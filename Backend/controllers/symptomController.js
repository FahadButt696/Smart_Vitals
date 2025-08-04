import SymptomLog from '../models/SymptomLog.js';

// Get all symptom logs for a user
export const getSymptomLogs = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { days = 30 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const symptomLogs = await SymptomLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    res.json({
      success: true,
      data: symptomLogs
    });
  } catch (error) {
    console.error('Error getting symptom logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving symptom logs'
    });
  }
};

// Add a new symptom log
export const addSymptomLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { symptoms, severity, duration, bodyLocation } = req.body;

    // Simulate Infermedica API analysis
    const aiAnalysis = await analyzeSymptomsWithAI(symptoms, severity, duration, bodyLocation);
    
    const symptomData = {
      userId,
      symptoms,
      severity,
      duration,
      bodyLocation,
      aiAnalysis,
      date: new Date()
    };

    const symptomLog = new SymptomLog(symptomData);
    await symptomLog.save();

    res.status(201).json({
      success: true,
      data: symptomLog,
      aiAnalysis
    });
  } catch (error) {
    console.error('Error adding symptom log:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding symptom log'
    });
  }
};

// Simulate Infermedica API analysis
const analyzeSymptomsWithAI = async (symptoms, severity, duration, bodyLocation) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock analysis based on symptoms
  const possibleConditions = [
    {
      condition: 'Common Cold',
      probability: 65,
      description: 'A viral infection of the upper respiratory tract'
    },
    {
      condition: 'Seasonal Allergies',
      probability: 25,
      description: 'Allergic reaction to environmental allergens'
    },
    {
      condition: 'Stress-related symptoms',
      probability: 10,
      description: 'Physical symptoms related to stress and anxiety'
    }
  ];

  const recommendations = [
    'Rest and stay hydrated',
    'Monitor symptoms for worsening',
    'Consider over-the-counter medications if appropriate',
    'Seek medical attention if symptoms persist or worsen'
  ];

  let urgencyLevel = 'low';
  if (severity >= 8) {
    urgencyLevel = 'high';
  } else if (severity >= 5) {
    urgencyLevel = 'medium';
  }

  return {
    possibleConditions,
    recommendations,
    urgencyLevel,
    confidence: Math.floor(Math.random() * 20) + 80, // 80-100% confidence
    analysisDate: new Date()
  };
};

// Update a symptom log
export const updateSymptomLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const symptomLog = await SymptomLog.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!symptomLog) {
      return res.status(404).json({
        success: false,
        message: 'Symptom log not found'
      });
    }

    res.json({
      success: true,
      data: symptomLog
    });
  } catch (error) {
    console.error('Error updating symptom log:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating symptom log'
    });
  }
};

// Delete a symptom log
export const deleteSymptomLog = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { id } = req.params;

    const symptomLog = await SymptomLog.findOneAndDelete({ _id: id, userId });

    if (!symptomLog) {
      return res.status(404).json({
        success: false,
        message: 'Symptom log not found'
      });
    }

    res.json({
      success: true,
      message: 'Symptom log deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting symptom log:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting symptom log'
    });
  }
};

// Analyze symptoms with AI (simplified version)
export const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, severity, duration, additionalInfo } = req.body;

    // Simple symptom analysis logic (in a real app, this would use AI/ML)
    const analysis = {
      severity: 'Low',
      recommendations: [],
      warning: '',
      possibleConditions: []
    };

    // Basic symptom analysis
    const symptomText = symptoms.toLowerCase();
    
    if (symptomText.includes('fever') || symptomText.includes('temperature')) {
      analysis.severity = 'Medium';
      analysis.recommendations.push('Monitor your temperature regularly');
      analysis.recommendations.push('Stay hydrated and rest');
      analysis.possibleConditions.push('Viral infection', 'Bacterial infection');
    }

    if (symptomText.includes('headache')) {
      analysis.recommendations.push('Rest in a quiet, dark room');
      analysis.recommendations.push('Stay hydrated');
      analysis.possibleConditions.push('Tension headache', 'Migraine', 'Dehydration');
    }

    if (symptomText.includes('cough') || symptomText.includes('sore throat')) {
      analysis.recommendations.push('Stay hydrated');
      analysis.recommendations.push('Rest your voice');
      analysis.possibleConditions.push('Common cold', 'Upper respiratory infection');
    }

    if (symptomText.includes('fatigue') || symptomText.includes('tired')) {
      analysis.recommendations.push('Get adequate sleep');
      analysis.recommendations.push('Eat a balanced diet');
      analysis.possibleConditions.push('Stress', 'Sleep deprivation', 'Nutritional deficiency');
    }

    // Set severity based on input
    if (severity === 'High' || severity === 'Severe') {
      analysis.severity = 'High';
      analysis.warning = 'If symptoms worsen or persist, consult a healthcare professional immediately';
    } else if (severity === 'Medium') {
      analysis.severity = 'Medium';
      analysis.warning = 'Monitor symptoms and seek medical attention if they worsen';
    } else {
      analysis.warning = 'If symptoms persist for more than 48 hours, consider consulting a healthcare professional';
    }

    // Add general recommendations
    if (analysis.recommendations.length === 0) {
      analysis.recommendations.push('Rest and stay hydrated');
      analysis.recommendations.push('Monitor symptoms for 24-48 hours');
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get symptom statistics
export const getSymptomStats = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { days = 30 } = req.query;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const symptomLogs = await SymptomLog.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    });

    if (symptomLogs.length === 0) {
      return res.json({
        success: true,
        data: {
          message: 'No symptom data available for the specified period'
        }
      });
    }

    // Calculate statistics
    const totalSymptoms = symptomLogs.length;
    const severityScores = symptomLogs.map(log => log.severity || 3);
    const avgSeverity = severityScores.reduce((sum, severity) => sum + severity, 0) / severityScores.length;

    // Symptom frequency analysis
    const symptomFrequency = {};
    symptomLogs.forEach(log => {
      const symptoms = Array.isArray(log.symptoms) ? log.symptoms : [log.symptoms];
      symptoms.forEach(symptom => {
        symptomFrequency[symptom] = (symptomFrequency[symptom] || 0) + 1;
      });
    });

    // Most common symptoms
    const mostCommonSymptoms = Object.entries(symptomFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([symptom, count]) => ({ symptom, count }));

    // Severity distribution
    const severityDistribution = {};
    severityScores.forEach(severity => {
      const level = severity <= 2 ? 'mild' : severity <= 4 ? 'moderate' : 'severe';
      severityDistribution[level] = (severityDistribution[level] || 0) + 1;
    });

    // Generate insights
    const insights = [];
    if (avgSeverity > 6) {
      insights.push('Your symptoms have been severe. Consider consulting a healthcare professional.');
    } else if (avgSeverity > 4) {
      insights.push('Your symptoms are moderate. Monitor them closely and consider lifestyle changes.');
    }

    if (totalSymptoms > parseInt(days) * 0.3) {
      insights.push('You\'re experiencing symptoms frequently. Consider tracking patterns and triggers.');
    }

    res.json({
      success: true,
      data: {
        totalSymptoms,
        avgSeverity: Math.round(avgSeverity * 10) / 10,
        mostCommonSymptoms,
        severityDistribution,
        insights,
        period: `${days} days`
      }
    });
  } catch (error) {
    console.error('Error getting symptom stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving symptom statistics'
    });
  }
}; 