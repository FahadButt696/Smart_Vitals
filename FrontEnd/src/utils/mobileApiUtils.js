// Mobile-specific API utilities for better mobile experience
import { API_BASE_URL } from '../config/api.js';

// Enhanced mobile detection
export const detectMobile = () => {
  try {
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
    
    // Connection detection
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    
    return isMobileUA || isMobilePlatform || (hasTouch && isSmallScreen) || isSlowConnection;
  } catch (error) {
    console.warn('Mobile detection failed, defaulting to desktop:', error);
    return false;
  }
};

// Mobile-optimized fetch with better error handling
export const mobileFetch = async (url, options = {}) => {
  const isMobile = detectMobile();
  
  const config = {
    ...options,
    timeout: isMobile ? 30000 : 15000, // 30 seconds for mobile, 15 for desktop
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    }
  };

  // Add mobile-specific headers
  if (isMobile) {
    config.headers['X-Mobile-Client'] = 'true';
    config.headers['X-Device-Type'] = 'mobile';
    
    if (navigator.userAgent) {
      config.headers['User-Agent'] = navigator.userAgent;
    }
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

// Retry wrapper for mobile with exponential backoff
export const mobileFetchWithRetry = async (url, options = {}, retryCount = 0) => {
  const isMobile = detectMobile();
  const maxRetries = isMobile ? 3 : 1;
  const baseDelay = isMobile ? 1000 : 0;
  
  try {
    return await mobileFetch(url, options);
  } catch (error) {
    if (retryCount < maxRetries) {
      console.log(`🔄 Mobile API retry ${retryCount + 1}/${maxRetries} for ${url}`);
      
      // Exponential backoff for retries
      const delay = baseDelay * Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return mobileFetchWithRetry(url, options, retryCount + 1);
    }
    throw error;
  }
};

// Mobile-optimized API calls
export const mobileApiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await mobileFetchWithRetry(url, options);
    return await response.json();
  } catch (error) {
    console.error(`Mobile API call failed for ${endpoint}:`, error);
    
    // Enhanced error messages for mobile
    if (error.message.includes('timeout')) {
      throw new Error('Request timed out. Please check your connection and try again.');
    } else if (error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw error;
    }
  }
};

// Mobile-specific toast configuration
export const mobileToastConfig = {
  duration: 4000,
  position: 'top-center',
  style: {
    background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
    color: '#fff',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    fontSize: '14px', // Smaller font for mobile
    maxWidth: '90vw', // Responsive width
  },
};

// Mobile connection quality detection
export const getConnectionQuality = () => {
  try {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (!connection) {
      return 'unknown';
    }
    
    const { effectiveType, downlink, rtt } = connection;
    
    if (effectiveType === '4g' && downlink > 10) {
      return 'excellent';
    } else if (effectiveType === '4g' || effectiveType === '3g') {
      return 'good';
    } else if (effectiveType === '2g' || effectiveType === 'slow-2g') {
      return 'poor';
    } else {
      return 'moderate';
    }
  } catch (error) {
    return 'unknown';
  }
};

// Mobile-specific loading states
export const getMobileLoadingConfig = () => {
  const isMobile = detectMobile();
  const connectionQuality = getConnectionQuality();
  
  return {
    showSpinner: isMobile,
    timeout: connectionQuality === 'poor' ? 45000 : 30000,
    retryAttempts: connectionQuality === 'poor' ? 5 : 3,
    showProgress: isMobile && connectionQuality !== 'excellent',
  };
};

// Export mobile detection for use in components
export { detectMobile as isMobile };
