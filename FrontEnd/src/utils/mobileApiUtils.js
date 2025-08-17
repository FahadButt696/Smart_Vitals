// Mobile-specific API utilities
import { mobileFetch, mobileFetchWithRetry } from '@/config/api.js';

// Safe mobile detection with fallbacks
const detectMobile = () => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }
    
    // Multiple detection methods for better compatibility
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
    console.warn('Mobile detection failed, defaulting to desktop:', error);
    return false;
  }
};

// Safe network information with fallbacks
const getNetworkInfo = () => {
  try {
    // Check if Network Information API is available
    if ('connection' in navigator && navigator.connection) {
      return {
        effectiveType: navigator.connection.effectiveType || 'unknown',
        downlink: navigator.connection.downlink || 0,
        rtt: navigator.connection.rtt || 0,
        online: navigator.onLine
      };
    }
    
    // Fallback to basic online status
    return {
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0,
      online: navigator.onLine
    };
  } catch (error) {
    console.warn('Network info detection failed:', error);
    return {
      effectiveType: 'unknown',
      downlink: 0,
      rtt: 0,
      online: true // Assume online if we can't detect
    };
  }
};

// Mobile API wrapper with better error handling
export class MobileApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.isMobile = detectMobile();
    this.networkInfo = getNetworkInfo();
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  // Generic API call with mobile optimization
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      if (this.isMobile) {
        // Use mobile-optimized fetch with retry
        const response = await mobileFetchWithRetry(url, options);
        return await response.json();
      } else {
        // Standard fetch for desktop
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
      }
    } catch (error) {
      console.error(`🚨 API Error on ${endpoint}:`, error);
      
      // Mobile-specific error handling
      if (this.isMobile) {
        console.log(`📱 Mobile API error details:`, {
          endpoint,
          error: error.message,
          userAgent: navigator.userAgent || 'Unknown',
          timestamp: new Date().toISOString(),
          networkInfo: this.networkInfo
        });
      }
      
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  // Health check specifically for mobile
  async mobileHealthCheck() {
    try {
      const response = await this.get('/mobile-health');
      console.log('📱 Mobile health check successful:', response);
      return response;
    } catch (error) {
      console.error('📱 Mobile health check failed:', error);
      throw error;
    }
  }

  // Test mobile connectivity
  async testMobileConnectivity() {
    try {
      const response = await this.get('/api/test-mobile');
      console.log('📱 Mobile connectivity test successful:', response);
      return response;
    } catch (error) {
      console.error('📱 Mobile connectivity test failed:', error);
      throw error;
    }
  }

  // Get current network status
  getNetworkStatus() {
    return this.networkInfo;
  }

  // Check if device is online
  isOnline() {
    return this.networkInfo.online;
  }
}

// Create default instance with error handling
let mobileApiClient;
try {
  mobileApiClient = new MobileApiClient(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
} catch (error) {
  console.error('Failed to create MobileApiClient:', error);
  // Fallback to basic client
  mobileApiClient = {
    isMobile: false,
    get: async () => { throw new Error('Mobile API client not available'); },
    post: async () => { throw new Error('Mobile API client not available'); },
    put: async () => { throw new Error('Mobile API client not available'); },
    delete: async () => { throw new Error('Mobile API client not available'); },
    mobileHealthCheck: async () => { throw new Error('Mobile API client not available'); },
    testMobileConnectivity: async () => { throw new Error('Mobile API client not available'); },
    getNetworkStatus: () => ({ online: true, effectiveType: 'unknown' }),
    isOnline: () => true
  };
}

// Export individual methods for convenience
export const {
  get: mobileGet,
  post: mobilePost,
  put: mobilePut,
  delete: mobileDelete,
  mobileHealthCheck,
  testMobileConnectivity,
  getNetworkStatus,
  isOnline
} = mobileApiClient;

export { mobileApiClient };
