// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Mobile detection
const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Mobile-specific API configuration
const MOBILE_CONFIG = {
  timeout: 30000, // 30 seconds for mobile (longer than desktop)
  retryAttempts: 3,
  retryDelay: 1000
};

// Helper function for mobile-optimized fetch
export const mobileFetch = async (url, options = {}) => {
  const config = {
    ...options,
    timeout: MOBILE_CONFIG.timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': navigator.userAgent,
      ...options.headers
    }
  };

  // Add mobile-specific headers
  if (isMobile) {
    config.headers['X-Mobile-Client'] = 'true';
    config.headers['X-Device-Type'] = 'mobile';
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - mobile network may be slow');
    }
    throw error;
  }
};

// Retry wrapper for mobile
export const mobileFetchWithRetry = async (url, options = {}, retryCount = 0) => {
  try {
    return await mobileFetch(url, options);
  } catch (error) {
    if (retryCount < MOBILE_CONFIG.retryAttempts) {
      console.log(`🔄 Mobile API retry ${retryCount + 1}/${MOBILE_CONFIG.retryAttempts} for ${url}`);
      await new Promise(resolve => setTimeout(resolve, MOBILE_CONFIG.retryDelay));
      return mobileFetchWithRetry(url, options, retryCount + 1);
    }
    throw error;
  }
};

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
  isProduction: API_BASE_URL !== 'http://localhost:5000',
  isMobile: isMobile,
  userAgent: navigator.userAgent,
  mobileConfig: MOBILE_CONFIG
});

// Mobile-specific debug info
if (isMobile) {
  console.log('📱 Mobile device detected:', {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    vendor: navigator.vendor,
    connection: navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt
    } : 'Not available'
  });
}
