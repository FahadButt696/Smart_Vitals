import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      isMobile: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Detect if this is a mobile device
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      isMobile: isMobile
    });

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log mobile-specific info if applicable
    if (isMobile) {
      console.log('📱 Mobile error details:', {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
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
      const isMobile = this.state.isMobile;
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-neutral-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/10 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6 text-center">
            {/* Error Icon */}
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            {/* Error Title */}
            <h1 className="text-xl font-bold text-white mb-2">
              {isMobile ? '📱 Mobile App Error' : 'Something went wrong'}
            </h1>

            {/* Error Message */}
            <p className="text-gray-300 mb-4">
              {isMobile 
                ? 'The mobile app encountered an unexpected error. This might be due to network issues or browser compatibility.'
                : 'An unexpected error occurred. Please try again or contact support if the problem persists.'
              }
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-4 p-3 bg-black/20 rounded-lg">
                <summary className="text-cyan-400 cursor-pointer text-sm">
                  Error Details (Development)
                </summary>
                <div className="text-xs text-gray-400 mt-2 space-y-1">
                  <p><strong>Message:</strong> {this.state.error.message}</p>
                  {this.state.errorInfo && (
                    <p><strong>Component:</strong> {this.state.errorInfo.componentStack}</p>
                  )}
                </div>
              </details>
            )}

            {/* Mobile-Specific Info */}
            {isMobile && (
              <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-400/20 rounded-lg">
                <p className="text-xs text-cyan-300">
                  <strong>Device:</strong> {navigator.platform || 'Unknown'}<br/>
                  <strong>Browser:</strong> {navigator.userAgent.split(' ').pop() || 'Unknown'}<br/>
                  <strong>Online:</strong> {navigator.onLine ? 'Yes' : 'No'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-gradient-to-r from-cyan-400 to-purple-400 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-500 hover:to-purple-500 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-white/10 text-white py-3 px-4 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 border border-white/20 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            </div>

            {/* Support Info */}
            <p className="text-xs text-gray-500 mt-4">
              If this problem continues, please contact support with the error details above.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 