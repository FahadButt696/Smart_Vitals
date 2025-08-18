import { useState, useEffect, useCallback } from 'react';
import { isMobile, getConnectionQuality, getMobileLoadingConfig } from '../utils/mobileApiUtils';

// Hook for mobile-specific optimizations
export const useMobileOptimization = () => {
  const [mobileState, setMobileState] = useState({
    isMobile: false,
    connectionQuality: 'unknown',
    loadingConfig: {},
    viewport: { width: 0, height: 0 },
    orientation: 'portrait',
    touchSupported: false,
    networkStatus: 'online'
  });

  // Update viewport dimensions
  const updateViewport = useCallback(() => {
    setMobileState(prev => ({
      ...prev,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    }));
  }, []);

  // Update network status
  const updateNetworkStatus = useCallback(() => {
    setMobileState(prev => ({
      ...prev,
      networkStatus: navigator.onLine ? 'online' : 'offline'
    }));
  }, []);

  // Update connection quality
  const updateConnectionQuality = useCallback(() => {
    const quality = getConnectionQuality();
    setMobileState(prev => ({
      ...prev,
      connectionQuality: quality
    }));
  }, []);

  // Initialize mobile state
  useEffect(() => {
    const mobile = isMobile();
    const quality = getConnectionQuality();
    const loadingConfig = getMobileLoadingConfig();
    const touchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    setMobileState({
      isMobile: mobile,
      connectionQuality: quality,
      loadingConfig,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      touchSupported,
      networkStatus: navigator.onLine ? 'online' : 'offline'
    });

    // Add event listeners
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Update connection quality periodically
    const connectionInterval = setInterval(updateConnectionQuality, 10000);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      clearInterval(connectionInterval);
    };
  }, [updateViewport, updateNetworkStatus, updateConnectionQuality]);

  // Mobile-specific toast configuration
  const getMobileToastConfig = useCallback(() => ({
    duration: mobileState.isMobile ? 5000 : 4000,
    position: mobileState.isMobile ? 'top-center' : 'top-right',
    style: {
      background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
      color: '#fff',
      borderRadius: mobileState.isMobile ? '8px' : '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      fontSize: mobileState.isMobile ? '14px' : '16px',
      maxWidth: mobileState.isMobile ? '90vw' : '400px',
      padding: mobileState.isMobile ? '12px 16px' : '16px 20px',
    },
  }), [mobileState.isMobile]);

  // Mobile-optimized loading states
  const getLoadingState = useCallback((isLoading, error = null) => {
    if (mobileState.isMobile) {
      return {
        isLoading,
        error,
        showSpinner: true,
        showProgress: mobileState.connectionQuality !== 'excellent',
        retryAttempts: mobileState.loadingConfig.retryAttempts,
        timeout: mobileState.loadingConfig.timeout
      };
    }
    
    return {
      isLoading,
      error,
      showSpinner: false,
      showProgress: false,
      retryAttempts: 1,
      timeout: 15000
    };
  }, [mobileState.isMobile, mobileState.connectionQuality, mobileState.loadingConfig]);

  // Mobile-specific error handling
  const handleMobileError = useCallback((error, context = '') => {
    if (mobileState.isMobile) {
      console.log(`📱 Mobile error in ${context}:`, {
        error: error.message,
        connectionQuality: mobileState.connectionQuality,
        networkStatus: mobileState.networkStatus,
        viewport: mobileState.viewport,
        timestamp: new Date().toISOString()
      });
    }

    // Return user-friendly error message
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please check your connection and try again.';
    } else if (error.message.includes('Failed to fetch')) {
      return 'Network error. Please check your connection and try again.';
    } else if (error.message.includes('NetworkError')) {
      return 'Network error. Please check your connection and try again.';
    } else {
      return error.message || 'Something went wrong. Please try again.';
    }
  }, [mobileState]);

  // Mobile-specific retry logic
  const withMobileRetry = useCallback(async (apiCall, maxRetries = null) => {
    const retries = maxRetries || mobileState.loadingConfig.retryAttempts;
    let lastError;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error;
        
        if (attempt < retries) {
          console.log(`🔄 Mobile retry ${attempt}/${retries}`);
          
          // Exponential backoff
          const delay = 1000 * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }, [mobileState.loadingConfig.retryAttempts]);

  // Mobile-specific form validation
  const getMobileFormConfig = useCallback(() => ({
    validateOnBlur: mobileState.isMobile,
    validateOnChange: !mobileState.isMobile,
    showValidationErrors: true,
    errorDisplay: mobileState.isMobile ? 'toast' : 'inline',
    submitButtonText: mobileState.isMobile ? 'Submit' : 'Submit Form',
    loadingText: mobileState.isMobile ? 'Processing...' : 'Submitting...'
  }), [mobileState.isMobile]);

  // Mobile-specific navigation
  const getMobileNavigationConfig = useCallback(() => ({
    useBackButton: mobileState.isMobile,
    showBreadcrumbs: !mobileState.isMobile,
    compactMenu: mobileState.isMobile,
    swipeNavigation: mobileState.isMobile && mobileState.touchSupported
  }), [mobileState.isMobile, mobileState.touchSupported]);

  return {
    ...mobileState,
    getMobileToastConfig,
    getLoadingState,
    handleMobileError,
    withMobileRetry,
    getMobileFormConfig,
    getMobileNavigationConfig
  };
};

export default useMobileOptimization;
