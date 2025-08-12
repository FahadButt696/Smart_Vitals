// Backend API configuration
export const API_BASE_URL = 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  MENTAL_HEALTH: {
    CHAT: `${API_BASE_URL}/api/mental-health/chat`,
    CHAT_HISTORY: (userId) => `${API_BASE_URL}/api/mental-health/chat/me?userId=${userId}`,
    INSIGHTS: (userId) => `${API_BASE_URL}/api/mental-health/insights/me?userId=${userId}`,
  },
  DIET_PLAN: {
    GENERATE: `${API_BASE_URL}/api/diet-plan/generate`,
    GET_ALL: (userId) => `${API_BASE_URL}/api/diet-plan?userId=${userId}`,
    DELETE: (id) => `${API_BASE_URL}/api/diet-plan/${id}`,
  },
  USER: {
    GET_BY_CLERK_ID: (clerkId) => `${API_BASE_URL}/api/user/clerk/${clerkId}`,
    CREATE: `${API_BASE_URL}/api/user/create`,
    UPDATE: (userId) => `${API_BASE_URL}/api/user/${userId}`,
  },
  AI_RECOMMENDATIONS: {
    GET: () => `${API_BASE_URL}/api/ai-recommendations/me`,
    GENERATE: () => `${API_BASE_URL}/api/ai-recommendations/generate`,
  },
  MEAL: {
    GET_ALL: (userId) => `${API_BASE_URL}/api/meal?userId=${userId}`,
    CREATE: `${API_BASE_URL}/api/meal`,
    UPDATE: (id) => `${API_BASE_URL}/api/meal/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/meal/${id}`,
  },
  WATER: {
    GET_STATS: (userId) => `${API_BASE_URL}/api/water/stats?userId=${userId}`,
    LOG: `${API_BASE_URL}/api/water`,
    GET_HISTORY: (userId) => `${API_BASE_URL}/api/water?userId=${userId}`,
  },
  SLEEP: {
    GET_STATS: (userId) => `${API_BASE_URL}/api/sleep/stats?userId=${userId}`,
    LOG: `${API_BASE_URL}/api/sleep`,
    GET_HISTORY: (userId) => `${API_BASE_URL}/api/sleep?userId=${userId}`,
  },
  WORKOUT: {
    GET_ALL: (userId) => `${API_BASE_URL}/api/workout?userId=${userId}`,
    CREATE: `${API_BASE_URL}/api/workout`,
    UPDATE: (id) => `${API_BASE_URL}/api/workout/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/workout/${id}`,
  },
  WEIGHT: {
    GET_ALL: (userId) => `${API_BASE_URL}/api/weight?userId=${userId}`,
    LOG: `${API_BASE_URL}/api/weight`,
    UPDATE: (id) => `${API_BASE_URL}/api/weight/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/weight/${id}`,
  },
  SYMPTOM_CHECK: {
    CHECK: `${API_BASE_URL}/api/symptom-check`,
    GET_HISTORY: (userId) => `${API_BASE_URL}/api/symptom-check?userId=${userId}`,
  },
  // Add other API endpoints here as needed
};

export default API_BASE_URL;
