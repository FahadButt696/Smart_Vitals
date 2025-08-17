// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  // User endpoints
  USER: {
    PROFILE: `${API_BASE_URL}/api/user/profile`,
    CREATE: `${API_BASE_URL}/api/user/create`,
    GET: `${API_BASE_URL}/api/user`,
    SLEEP_GOAL: `${API_BASE_URL}/api/user/sleepGoal`,
  },
  
  // Water tracking
  WATER: {
    BASE: `${API_BASE_URL}/api/water`,
    STATS: `${API_BASE_URL}/api/water/stats`,
  },
  
  // Sleep tracking
  SLEEP: {
    BASE: `${API_BASE_URL}/api/sleep`,
    STATS: `${API_BASE_URL}/api/sleep/stats`,
  },
  
  // Meal tracking
  MEAL: {
    BASE: `${API_BASE_URL}/api/meal`,
    DETECT: `${API_BASE_URL}/api/meal/detect`,
    SAVE: `${API_BASE_URL}/api/meal/save`,
    MANUAL: `${API_BASE_URL}/api/meal/manual`,
  },
  
  // Workout tracking
  WORKOUT: {
    BASE: `${API_BASE_URL}/api/workout`,
    STATS: `${API_BASE_URL}/api/workout/stats`,
  },
  
  // Weight tracking
  WEIGHT: {
    BASE: `${API_BASE_URL}/api/weight`,
    STATS: `${API_BASE_URL}/api/weight/stats`,
  },
  
  // Mental health
  MENTAL_HEALTH: {
    BASE: `${API_BASE_URL}/api/mental-health`,
    TEST: `${API_BASE_URL}/api/mental-health/test`,
  },
  
  // Diet plan
  DIET_PLAN: {
    BASE: `${API_BASE_URL}/api/diet-plan`,
  },
  
  // AI recommendations
  AI_RECOMMENDATIONS: {
    BASE: `${API_BASE_URL}/api/ai-recommendations`,
    GET: () => `${API_BASE_URL}/api/ai-recommendations/me`,
    GENERATE: () => `${API_BASE_URL}/api/ai-recommendations/generate`,
  },
  
  // Symptom checker
  SYMPTOM_CHECK: {
    BASE: `${API_BASE_URL}/api/symptom-check`,
  },
  
  // Contact
  CONTACT: {
    BASE: `${API_BASE_URL}/api/contact`,
  },
  
  // Calorie tracking
  CALORIE: {
    BASE: `${API_BASE_URL}/api/calorie`,
  },
};

// Helper function to get full URL for any endpoint
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Export the base URL for direct use if needed
export { API_BASE_URL };

// Log the current API configuration (for debugging)
console.log('🌐 API Configuration:', {
  baseUrl: API_BASE_URL,
  environment: import.meta.env.MODE,
  isProduction: API_BASE_URL !== 'http://localhost:5000'
});
