import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import AIRecommendationCard from "@/components/custom/AIRecommendationCard";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { API_BASE_URL } from "@/config/api";
import { 
  Thermometer, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock, 
  Trash2,
  Loader2,
  User,
  Calendar,
  Type
} from 'lucide-react';

const SymptomChecker = () => {
  // Debug logging
  console.log('SymptomChecker component is rendering!');
  
  const { user } = useUser();
  const { getToken } = useAuth();
  const { recommendations } = useAIRecommendations();
  const [userData, setUserData] = useState(null);
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [currentCheck, setCurrentCheck] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  
  // Simplified state for text-based symptom input
  const [symptomText, setSymptomText] = useState('');

  // Check if backend is available
  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`, { 
        method: 'GET',
        signal: AbortSignal.timeout(10000) // 10 second timeout for mobile
      });
      return response.ok;
    } catch (error) {
      console.warn('Backend server not available:', error.message);
      return false;
    }
  };

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoadingUserData(true);
        
        // Check if backend is available
        const backendAvailable = await checkBackendStatus();
        if (!backendAvailable) {
          toast.error('Backend server is not available. Please check your connection.');
          return;
        }
        
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/api/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(15000) // 15 second timeout for mobile
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          console.log('User data fetched:', data);
        } else {
          console.error('Failed to fetch user data:', response.status);
          toast.error('Failed to load user profile. Please complete onboarding first.');
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error('Request timeout:', error);
          toast.error('Request timed out. Please check your connection.');
        } else {
          console.error('Error fetching user data:', error);
          toast.error('Failed to load user profile. Please try again.');
        }
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  useEffect(() => {
    if (userData) {
      fetchSymptomHistory();
    }
  }, [userData]);

  const fetchSymptomHistory = async () => {
    if (!userData) return;
    
    try {
      // Check if backend is available
      const backendAvailable = await checkBackendStatus();
      if (!backendAvailable) {
        toast.error('Backend server is not available. Please check your connection.');
        return;
      }

      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/symptom-check?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setSymptomHistory(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch symptom history');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout:', error);
        toast.error('Request timed out. Please check your connection.');
      } else {
        console.error('Error fetching symptom history:', error);
        toast.error('Failed to fetch symptom history. Please try again.');
      }
      setSymptomHistory([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userData) {
      setError('User data not loaded. Please try again.');
      return;
    }

    if (!symptomText.trim()) {
      setError('Please describe your symptoms.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check if backend is available
      const backendAvailable = await checkBackendStatus();
      if (!backendAvailable) {
        toast.error('Backend server is not available. Please check your connection.');
        return;
      }
      
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/symptom-check/check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          age: userData.age,
          sex: userData.gender?.toLowerCase() === 'male' ? 'male' : 'female',
          symptomsEntered: symptomText.trim()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        console.log('Symptom check response data:', data.data);
        console.log('Triage data received:', data.data.triage);
        setSuccess('Symptom check completed successfully!');
        setCurrentCheck(data.data);
        setSymptomText(''); // Clear the input
        fetchSymptomHistory(); // Refresh history
      } else {
        setError(data.error || 'Failed to complete symptom check');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout:', error);
        setError('Request timed out. Please check your connection.');
      } else {
        console.error('Error submitting symptom check:', error);
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSymptomCheck = async (checkId) => {
    if (!userData) return;

    try {
      // Check if backend is available
      const backendAvailable = await checkBackendStatus();
      if (!backendAvailable) {
        toast.error('Backend server is not available. Please check your connection.');
        return;
      }

      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/symptom-check/${checkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setSuccess('Symptom check deleted successfully');
        fetchSymptomHistory(); // Refresh history
      } else {
        setError(data.error || 'Failed to delete symptom check');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timeout:', error);
        setError('Request timed out. Please check your connection.');
      } else {
        console.error('Error deleting symptom check:', error);
        setError('Failed to delete symptom check');
      }
    }
  };

  const getTriageColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'emergency': return 'bg-red-500/20 text-red-400 border-red-400/30';
      case 'urgent': return 'bg-orange-500/20 text-orange-400 border-orange-400/30';
      case 'non_urgent': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'self_care': return 'bg-green-500/20 text-green-400 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  const getTriageIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'emergency': return <AlertTriangle className="w-5 h-5" />;
      case 'urgent': return <AlertTriangle className="w-5 h-5" />;
      case 'non_urgent': return <Info className="w-5 h-5" />;
      case 'self_care': return <CheckCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center">
            <Thermometer className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Symptom Checker</h3>
            <p className="text-white/60">Powered by Infermedica AI - Get instant health insights</p>
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="backdrop-blur-xl border border-red-400/20 rounded-2xl p-4 bg-red-400/5"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="backdrop-blur-xl border border-green-400/20 rounded-2xl p-4 bg-green-400/5"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Check Results */}
      {currentCheck && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6 bg-cyan-400/5"
        >
          <h3 className="text-xl font-bold text-white mb-4">Latest Check Results</h3>
          
          {/* Triage Level */}
          <div className={`p-4 rounded-xl border mb-4 ${getTriageColor(currentCheck.triage?.level)}`}>
            <div className="flex items-center gap-3">
              {getTriageIcon(currentCheck.triage?.level)}
              <div>
                <h4 className="font-semibold">
                  Triage Level: {currentCheck.triage?.level ? currentCheck.triage.level.replace('_', ' ').toUpperCase() : 'Not Available'}
                </h4>
                <p className="text-sm opacity-80">
                  {currentCheck.triage?.description || 'No description available'}
                </p>
                
              </div>
            </div>
          </div>

          {/* Conditions */}
          {currentCheck.conditions && currentCheck.conditions.length > 0 && (
            <div className="mb-4">
              <h5 className="text-white font-medium mb-3">Possible Conditions:</h5>
              <div className="space-y-2">
                {currentCheck.conditions.map((condition, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white">{condition.name}</span>
                    <span className="text-cyan-400 font-medium">
                      {(condition.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Symptoms */}
          {currentCheck.symptoms && currentCheck.symptoms.length > 0 && (
            <div>
              <h5 className="text-white font-medium mb-3">Identified Symptoms:</h5>
              <div className="flex flex-wrap gap-2">
                {currentCheck.symptoms.map((symptom, index) => (
                  <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-white text-sm">
                    {symptom.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* AI Health Recommendations */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Thermometer className="text-purple-400" />
          AI Health Tips
        </h3>
        {recommendations?.generalTips ? (
          <AIRecommendationCard
            title="General Health"
            recommendation={recommendations.generalTips}
            feature="generalTips"
            userId={user?.id}
          />
        ) : (
          <div className="text-center py-4">
            <p className="text-white/60 mb-2">No AI recommendations available yet.</p>
            <p className="text-white/40 text-sm">Complete your onboarding to get personalized AI recommendations.</p>
          </div>
        )}
      </div>

      {/* Symptom Check Form */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">New Symptom Check</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Demographics Display */}
          {isLoadingUserData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              <span className="ml-2 text-white/60">Loading your profile...</span>
            </div>
          ) : userData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Age
                  </div>
                </label>
                <div className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white/80">
                  {userData.age} years old
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Sex
                  </div>
                </label>
                <div className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white/80">
                  {userData.gender}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-xl">
              <p className="text-red-400 text-sm">Unable to load your profile. Please complete onboarding first.</p>
            </div>
          )}

          {/* Text-Based Symptom Input */}
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium flex items-center gap-2 mb-2">
                🎯 Describe Your Symptoms
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-400/30">
                  AI-Powered Analysis
                </span>
              </h4>
              <p className="text-white/60 text-sm">Use natural language to describe how you're feeling - AI will automatically identify symptoms and provide diagnosis</p>
            </div>
            
            {/* Tips Section */}
            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/20">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-white font-medium text-sm mb-2">💡 Tips for Better Results</h5>
                  <ul className="text-white/70 text-xs space-y-1">
                    <li>• Be specific about timing (e.g., "for the past 3 days")</li>
                    <li>• Include severity (e.g., "mild", "severe", "unbearable")</li>
                    <li>• Mention related symptoms together</li>
                    <li>• Describe how symptoms affect your daily activities</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Type your symptoms in natural language
                </div>
              </label>
              <textarea
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                placeholder="Example: I have been experiencing severe headaches for the past 3 days, along with nausea and sensitivity to light. I also feel dizzy when I stand up quickly."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 resize-none"
                rows={4}
                disabled={isLoading}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-white/60 text-xs">
                  Describe your symptoms in detail. The AI will automatically identify and analyze them.
                </p>
                <span className={`text-xs ${
                  symptomText.length < 20 ? 'text-red-400' : 
                  symptomText.length < 50 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {symptomText.length} characters
                </span>
              </div>
              
              {/* Example Suggestions */}
              <div className="mt-3 space-y-2">
                <p className="text-white/50 text-xs font-medium">💡 Example descriptions:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSymptomText("I have a fever of 101°F, sore throat, and difficulty swallowing for the past 2 days.")}
                    className="symptom-checker-btn text-left p-2 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/30 hover:bg-white/10 transition-all duration-200"
                  >
                    <p className="text-white/70 text-xs">"I have a fever of 101°F, sore throat, and difficulty swallowing for the past 2 days."</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSymptomText("Experiencing chest pain, shortness of breath, and left arm numbness since this morning.")}
                    className="symptom-checker-btn text-left p-2 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/30 hover:bg-white/10 transition-all duration-200"
                  >
                    <p className="text-white/70 text-xs">"Experiencing chest pain, shortness of breath, and left arm numbness since this morning."</p>
                  </button>
                </div>
              </div>
            </div>
            
            {symptomText.length < 20 && symptomText.length > 0 && (
              <p className="text-red-400 text-xs">Please provide more detail (at least 20 characters)</p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading || !symptomText.trim() || !userData || !userData.age || !userData.gender}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
              isLoading || !symptomText.trim() || !userData || !userData.age || !userData.gender
                ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Symptoms...
              </div>
            ) : (
              'Analyze Symptoms with AI'
            )}
          </motion.button>
        </form>
      </div>

      {/* Symptom History */}
      {symptomHistory.length > 0 && (
        <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Symptom Check History</h3>
          <div className="space-y-4">
            {symptomHistory.map((check) => (
              <motion.div
                key={check._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-white/60" />
                    <span className="text-white/80 text-sm">
                      {new Date(check.timestamp).toLocaleDateString()} at {new Date(check.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteSymptomCheck(check._id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <p className="text-white text-sm">
                    <span className="text-white/60">Symptoms:</span> {check.symptomsEntered}
                  </p>
                  
                  {check.triage && (
                    <div className={`inline-block px-3 py-1 rounded-full text-xs ${getTriageColor(check.triage.level)}`}>
                      {check.triage.level?.replace('_', ' ').toUpperCase()}
                    </div>
                  )}
                  
                  {check.diagnosisResults && check.diagnosisResults.length > 0 && (
                    <p className="text-white/80 text-sm">
                      <span className="text-white/60">Top condition:</span> {check.diagnosisResults[0]?.name} ({(check.diagnosisResults[0]?.probability * 100).toFixed(1)}%)
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="backdrop-blur-xl border border-yellow-400/20 rounded-2xl p-6 bg-yellow-400/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-white font-semibold mb-2">Important Disclaimer</h4>
            <p className="text-white/70 text-sm">
              This AI symptom checker is for informational purposes only and should not replace professional medical advice. 
              Always consult with a healthcare provider for proper diagnosis and treatment. In case of emergency, call emergency services immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker; 