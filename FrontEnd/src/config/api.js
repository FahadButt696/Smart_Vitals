// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Safe mobile detection with fallbacks
const detectMobile = () => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }
    
    const userAgent = navigator.userAgent || '';
    const platform = navigator.platform || '';
    
    // Primary detection
    const isMobileUA = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    // Fallback detection
    const isMobilePlatform = /Android|iPhone|iPad|iPod/i.test(platform);
    
    // Touch detection (most reliable for mobile)
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Screen size detection
    const isSmallScreen = window.innerWidth <= 768;
    
    return isMobileUA || isMobilePlatform || (hasTouch && isSmallScreen);
  } catch (error) {
    // Silent fallback during build process
    return false;
  }
};

// Mobile detection and configuration
let isMobile = false;
let MOBILE_CONFIG = {
  timeout: 15000, // Default to desktop timeout
  retryAttempts: 1,
  retryDelay: 0
};

// Only run mobile detection in browser environment
if (typeof window !== 'undefined') {
  isMobile = detectMobile();
  MOBILE_CONFIG = {
    timeout: isMobile ? 30000 : 15000, // 30 seconds for mobile, 15 for desktop
    retryAttempts: isMobile ? 3 : 1,
    retryDelay: isMobile ? 1000 : 0
  };
}

// Helper function for mobile-optimized fetch with better error handling
const mobileFetch = async (url, options = {}) => {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    throw new Error('mobileFetch can only be used in browser environment');
  }

  const config = {
    ...options,
    timeout: MOBILE_CONFIG.timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    }
  };

  // Add mobile-specific headers safely
  try {
    if (isMobile && typeof navigator !== 'undefined') {
      config.headers['X-Mobile-Client'] = 'true';
      config.headers['X-Device-Type'] = 'mobile';
      
      // Only add User-Agent if available
      if (navigator.userAgent) {
        config.headers['User-Agent'] = navigator.userAgent;
      }
    }
  } catch (error) {
    // Silent fallback during build
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

// Retry wrapper for mobile with better error handling
const mobileFetchWithRetry = async (url, options = {}, retryCount = 0) => {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    throw new Error('mobileFetchWithRetry can only be used in browser environment');
  }

  try {
    return await mobileFetch(url, options);
  } catch (error) {
    if (retryCount < MOBILE_CONFIG.retryAttempts) {
      // Only log in browser environment
      if (typeof console !== 'undefined' && console.log) {
        console.log(`🔄 Mobile API retry ${retryCount + 1}/${MOBILE_CONFIG.retryAttempts} for ${url}`);
      }
      
      // Exponential backoff for retries
      const delay = MOBILE_CONFIG.retryDelay * Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return mobileFetchWithRetry(url, options, retryCount + 1);
    }
    throw error;
  }
};

// API endpoints
const API_ENDPOINTS = {
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
    CHAT: `${API_BASE_URL}/api/mental-health/chat`,
    CHAT_HISTORY: (userId) => `${API_BASE_URL}/api/mental-health/chat-history/${userId}`,
    INSIGHTS: (userId) => `${API_BASE_URL}/api/mental-health/insights/${userId}`,
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
const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Export all functions and constants
export { API_ENDPOINTS, getApiUrl, API_BASE_URL, mobileFetch, mobileFetchWithRetry };

// Log the current API configuration (for debugging) - only in browser
if (typeof window !== 'undefined' && typeof console !== 'undefined' && console.log) {
  console.log('🌐 API Configuration:', {
    baseUrl: API_BASE_URL,
    environment: import.meta.env.MODE,
    isProduction: API_BASE_URL !== 'http://localhost:5000',
    isMobile: isMobile,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Not available',
    mobileConfig: MOBILE_CONFIG
  });

  // Mobile-specific debug info
  if (isMobile) {
    console.log('📱 Mobile device detected:', {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Not available',
      platform: typeof navigator !== 'undefined' ? navigator.platform : 'Not available',
      vendor: typeof navigator !== 'undefined' ? navigator.vendor : 'Not available',
      connection: typeof navigator !== 'undefined' && navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : 'Not available'
    });
  }
}
