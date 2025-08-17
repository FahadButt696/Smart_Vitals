// Mobile-specific API utilities
import { mobileFetch, mobileFetchWithRetry } from '@/config/api.js';

// Mobile API wrapper with better error handling
export class MobileApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
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
}

// Create default instance
export const mobileApiClient = new MobileApiClient(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

// Export individual methods for convenience
export const {
  get: mobileGet,
  post: mobilePost,
  put: mobilePut,
  delete: mobileDelete,
  mobileHealthCheck,
  testMobileConnectivity
} = mobileApiClient;
