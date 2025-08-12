import axios from "axios";
import SymptomCheck from "../models/SymptomCheck.js";

const API_URL = "https://api.infermedica.com/v3";
const APP_ID = process.env.INFERMEDICA_APP_ID;
const APP_KEY = process.env.INFERMEDICA_APP_KEY;

// Validate API credentials
const validateCredentials = () => {
  if (!APP_ID || !APP_KEY) {
    throw new Error("Infermedica API credentials not configured");
  }
};

/**
 * Get appropriate description for triage level
 */
const getTriageDescription = (triageLevel, rootCause) => {
  const descriptions = {
    'emergency_ambulance': 'This requires immediate emergency medical attention. Call emergency services immediately.',
    'emergency_room': 'This requires urgent medical care. Go to the nearest emergency room.',
    'consultation_24': 'This requires medical consultation within 24 hours. Contact a healthcare provider soon.',
    'consultation': 'This requires medical consultation. Schedule an appointment with a healthcare provider.',
    'self_care': 'This can typically be managed with self-care measures. Monitor symptoms and seek care if they worsen.',
    'unknown': 'Unable to determine urgency level. Please consult a healthcare provider for assessment.'
  };
  
  return descriptions[triageLevel] || 'Medical consultation recommended. Please consult a healthcare provider.';
};

/**
 * Step 1 & 2: Parse symptoms and get diagnosis
 */
export const runSymptomCheck = async (req, res) => {
  try {
    const { userId, age, sex, symptomsEntered } = req.body;

    // Validate input fields
    if (!symptomsEntered || !age || !sex) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: symptomsEntered, age, and sex are required"
      });
    }

    if (age < 0 || age > 120) {
      return res.status(400).json({
        success: false,
        error: "Age must be between 0 and 120"
      });
    }

    // Infermedica only accepts 'male' or 'female'
    let validatedSex = sex.toLowerCase();
    if (!['male', 'female'].includes(validatedSex)) {
      validatedSex = "male"; // default fallback
    }

    validateCredentials();

    // Step 1: Automatically parse symptoms from text input
    const parseRes = await axios.post(
      `${API_URL}/parse`,
      {
        text: symptomsEntered,
        age: { value: parseInt(age) },
        sex: validatedSex
      },
      {
        headers: {
          "App-Id": APP_ID,
          "App-Key": APP_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    if (!parseRes.data.mentions || parseRes.data.mentions.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No symptoms could be identified from the text. Please try describing your symptoms more specifically."
      });
    }

    // Convert parsed symptoms to the format expected by diagnosis API
    const finalStructuredSymptoms = parseRes.data.mentions.map(m => ({
      id: m.id,
      name: m.name,
      choice_id: m.choice_id || "present"
    }));

    // Step 2: Get diagnosis using parsed symptoms
    const diagnosisRes = await axios.post(
      `${API_URL}/diagnosis`,
      {
        sex: validatedSex,
        age: { value: parseInt(age) },
        evidence: finalStructuredSymptoms,
        extras: { enable_triage: true }
      },
      {
        headers: {
          "App-Id": APP_ID,
          "App-Key": APP_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const diagnosisResults = diagnosisRes.data.conditions?.map(c => ({
      id: c.id,
      name: c.name,
      probability: c.probability
    })) || [];

    // Step 3: Get triage using the triage endpoint
    let triage;
    try {
      const triageRes = await axios.post(
        `${API_URL}/triage`,
        {
          sex: validatedSex,
          age: { value: parseInt(age) },
          evidence: finalStructuredSymptoms
        },
        {
          headers: {
            "App-Id": APP_ID,
            "App-Key": APP_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Triage API response:", triageRes.data);
      
      // Map Infermedica triage response to expected structure
      const triageData = triageRes.data;
      if (triageData && triageData.triage_level) {
        // Map triage_level to level and create appropriate description
        triage = {
          level: triageData.triage_level,
          description: getTriageDescription(triageData.triage_level, triageData.root_cause)
        };
      } else {
        triage = {
          level: "self_care",
          description: "No urgent medical condition detected based on your symptoms."
        };
      }
    } catch (triageError) {
      console.error("Triage API error:", triageError.response?.data || triageError.message);
      
      // Fallback triage if triage API fails
      triage = {
        level: "self_care",
        description: "Unable to determine triage level. Please consult a healthcare provider if symptoms are severe."
      };
    }

    // Step 4: Save in DB
    const symptomCheck = new SymptomCheck({
      userId,
      symptomsEntered,
      structuredSymptoms: finalStructuredSymptoms,
      diagnosisResults,
      triage,
      userDemographics: { age: parseInt(age), sex: validatedSex }
    });

    await symptomCheck.save();

    console.log("Final triage data being sent:", triage);
    
    res.status(201).json({
      success: true,
      message: "Symptom check completed successfully",
      data: {
        id: symptomCheck._id,
        symptoms: finalStructuredSymptoms,
        conditions: diagnosisResults,
        triage,
        timestamp: symptomCheck.timestamp
      }
    });

  } catch (err) {
    console.error("Error running symptom check:", err.response?.data || err.message);

    if (err.response?.status === 401) {
      return res.status(500).json({
        success: false,
        error: "API authentication failed. Please check your Infermedica credentials."
      });
    }

    if (err.response?.status === 429) {
      return res.status(429).json({
        success: false,
        error: "API rate limit exceeded. Please try again later."
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to run symptom check. Please try again later."
    });
  }
};

/**
 * Fetch all symptom checks for a user
 */
export const getSymptomChecks = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required"
      });
    }

    const checks = await SymptomCheck.find({ userId })
      .sort({ timestamp: -1 })
      .select('-__v')
      .limit(50);

    res.json({
      success: true,
      count: checks.length,
      data: checks
    });
  } catch (err) {
    console.error("Error fetching symptom checks:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch symptom checks"
    });
  }
};

/**
 * Fetch one symptom check by ID
 */
export const getSymptomCheckById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Check ID is required"
      });
    }

    const check = await SymptomCheck.findById(id).select('-__v');

    if (!check) {
      return res.status(404).json({
        success: false,
        error: "Symptom check not found"
      });
    }

    res.json({
      success: true,
      data: check
    });
  } catch (err) {
    console.error("Error fetching symptom check:", err.message);

    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: "Invalid check ID format"
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to fetch symptom check"
    });
  }
};

/**
 * Delete a symptom check
 */
export const deleteSymptomCheck = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Check ID is required"
      });
    }

    const check = await SymptomCheck.findByIdAndDelete(id);

    if (!check) {
      return res.status(404).json({
        success: false,
        error: "Symptom check not found"
      });
    }

    res.json({
      success: true,
      message: "Symptom check deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting symptom check:", err.message);

    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: "Invalid check ID format"
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to delete symptom check"
    });
  }
};

/**
 * Health check for Infermedica API
 */
export const healthCheck = async (req, res) => {
  try {
    validateCredentials();

    const response = await axios.get(`${API_URL}/info`, {
      headers: {
        "App-Id": APP_ID,
        "App-Key": APP_KEY
      }
    });

    res.json({
      success: true,
      message: "Infermedica API is working correctly",
      apiInfo: response.data
    });
  } catch (err) {
    console.error("Infermedica API health check failed:", err.message);

    if (err.response?.status === 401) {
      return res.status(500).json({
        success: false,
        error: "API authentication failed. Please check your Infermedica credentials."
      });
    }

    res.status(500).json({
      success: false,
      error: "Infermedica API is not working correctly",
      details: err.message
    });
  }
};
