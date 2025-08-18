import React from 'react';
import { motion } from 'framer-motion';
import { isMobile, getConnectionQuality } from '../../utils/mobileApiUtils';

class MobileErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      isMobile: false,
      connectionQuality: 'unknown'
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
      isMobile: isMobile(),
      connectionQuality: getConnectionQuality()
    });

    // Log error for debugging
    console.error('Mobile Error Boundary caught an error:', error, errorInfo);
    
    // Log mobile-specific information
    if (isMobile()) {
      console.log('📱 Mobile error details:', {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        connection: getConnectionQuality(),
        timestamp: new Date().toISOString(),
        error: error.message,
        stack: error.stack
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isMobileDevice = this.state.isMobile;
      const connectionQuality = this.state.connectionQuality;

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full text-center"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </motion.div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-white mb-4">
              {isMobileDevice ? 'Mobile App Error' : 'Something Went Wrong'}
            </h1>

            {/* Error Message */}
            <p className="text-white/80 mb-6">
              {isMobileDevice 
                ? 'We encountered an issue with the mobile app. This might be due to network connectivity or device compatibility.'
                : 'An unexpected error occurred. Please try again or contact support if the problem persists.'
              }
            </p>

            {/* Mobile-specific information */}
            {isMobileDevice && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 mb-6 text-left"
              >
                <h3 className="text-blue-300 font-semibold mb-2">Device Information</h3>
                <div className="text-blue-200 text-sm space-y-1">
                  <p>📱 Mobile Device: {navigator.platform || 'Unknown'}</p>
                  <p>🌐 Connection: {connectionQuality}</p>
                  <p>🔧 Browser: {navigator.userAgent.split(' ').pop() || 'Unknown'}</p>
                </div>
              </motion.div>
            )}

            {/* Connection quality warning */}
            {isMobileDevice && connectionQuality === 'poor' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4 mb-6"
              >
                <p className="text-yellow-200 text-sm">
                  ⚠️ Your connection appears to be slow. This might be causing the error.
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleRetry}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
              >
                🔄 Try Again
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleGoHome}
                className="flex-1 bg-white/10 text-white font-semibold py-3 px-6 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                🏠 Go Home
              </motion.button>
            </div>

            {/* Additional Help */}
            {isMobileDevice && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-white/60 text-sm"
              >
                <p>💡 Try refreshing the page or check your internet connection.</p>
                <p>📧 If the problem persists, contact our support team.</p>
              </motion.div>
            )}

            {/* Error Details (for debugging) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="text-white/60 cursor-pointer text-sm">
                  🔍 Show Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-black/20 rounded text-xs text-white/60 overflow-auto max-h-32">
                  <pre>{this.state.error && this.state.error.toString()}</pre>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MobileErrorBoundary;
