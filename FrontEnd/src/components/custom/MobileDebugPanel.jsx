import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Wifi, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { mobileApiClient, testMobileConnectivity, mobileHealthCheck, getNetworkStatus, isOnline } from '@/utils/mobileApiUtils';

const MobileDebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    mobile: false,
    userAgent: '',
    platform: '',
    connection: null,
    apiHealth: null,
    connectivityTest: null,
    lastTest: null,
    error: null
  });
  const [isTesting, setIsTesting] = useState(false);

  // Safe mobile detection with fallbacks
  const detectMobile = () => {
    try {
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
      }
      
      const userAgent = navigator.userAgent || '';
      const platform = navigator.platform || '';
      
      const isMobileUA = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isMobilePlatform = /Android|iPhone|iPad|iPod/i.test(platform);
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      
      return isMobileUA || isMobilePlatform || (hasTouch && isSmallScreen);
    } catch (error) {
      console.warn('Mobile detection failed:', error);
      return false;
    }
  };

  // Safe network information with fallbacks
  const getSafeNetworkInfo = () => {
    try {
      if ('connection' in navigator && navigator.connection) {
        return {
          effectiveType: navigator.connection.effectiveType || 'unknown',
          downlink: navigator.connection.downlink || 0,
          rtt: navigator.connection.rtt || 0,
          online: navigator.onLine
        };
      }
      
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
        online: true
      };
    }
  };

  useEffect(() => {
    try {
      const isMobile = detectMobile();
      const networkInfo = getSafeNetworkInfo();
      
      setDebugInfo(prev => ({
        ...prev,
        mobile: isMobile,
        userAgent: navigator.userAgent || 'Unknown',
        platform: navigator.platform || 'Unknown',
        connection: networkInfo,
        error: null
      }));
    } catch (error) {
      console.error('Failed to initialize mobile debug panel:', error);
      setDebugInfo(prev => ({
        ...prev,
        error: error.message,
        mobile: false
      }));
    }
  }, []);

  const runTests = async () => {
    setIsTesting(true);
    try {
      // Test mobile health endpoint
      const healthResult = await mobileHealthCheck();
      
      // Test mobile connectivity
      const connectivityResult = await testMobileConnectivity();
      
      setDebugInfo(prev => ({
        ...prev,
        apiHealth: healthResult,
        connectivityTest: connectivityResult,
        lastTest: new Date().toISOString(),
        error: null
      }));
    } catch (error) {
      console.error('Mobile debug tests failed:', error);
      setDebugInfo(prev => ({
        ...prev,
        apiHealth: { error: error.message },
        connectivityTest: { error: error.message },
        lastTest: new Date().toISOString(),
        error: error.message
      }));
    } finally {
      setIsTesting(false);
    }
  };

  // Only show on mobile devices
  if (!debugInfo.mobile) return null;

  return (
    <>
      {/* Floating debug button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full text-white shadow-lg backdrop-blur-sm"
      >
        <Smartphone className="w-5 h-5" />
      </motion.button>

      {/* Debug panel */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-4 z-40 w-80 max-h-96 bg-gray-900/95 backdrop-blur-xl border border-cyan-400/20 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                Mobile Debug
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Error Display */}
            {debugInfo.error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs">Error: {debugInfo.error}</span>
                </div>
              </div>
            )}

            {/* Device Info */}
            <div className="space-y-3 mb-4">
              <div className="bg-white/10 rounded-lg p-3">
                <h4 className="text-sm font-medium text-cyan-400 mb-2">Device Info</h4>
                <div className="text-xs text-gray-300 space-y-1">
                  <p><span className="text-gray-400">Platform:</span> {debugInfo.platform}</p>
                  <p><span className="text-gray-400">Connection:</span> {debugInfo.connection?.effectiveType || 'Unknown'}</p>
                  <p><span className="text-gray-400">Speed:</span> {debugInfo.connection?.downlink || 'Unknown'} Mbps</p>
                  <p><span className="text-gray-400">Online:</span> {debugInfo.connection?.online ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {/* API Health */}
              <div className="bg-white/10 rounded-lg p-3">
                <h4 className="text-sm font-medium text-cyan-400 mb-2">API Health</h4>
                {debugInfo.apiHealth ? (
                  <div className="text-xs text-gray-300">
                    {debugInfo.apiHealth.error ? (
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Failed: {debugInfo.apiHealth.error}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>Healthy</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">Not tested</span>
                )}
              </div>

              {/* Connectivity Test */}
              <div className="bg-white/10 rounded-lg p-3">
                <h4 className="text-sm font-medium text-cyan-400 mb-2">Connectivity</h4>
                {debugInfo.connectivityTest ? (
                  <div className="text-xs text-gray-300">
                    {debugInfo.connectivityTest.error ? (
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Failed: {debugInfo.connectivityTest.error}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>Connected</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">Not tested</span>
                )}
              </div>

              {/* Last Test Time */}
              {debugInfo.lastTest && (
                <div className="text-xs text-gray-500 text-center">
                  Last test: {new Date(debugInfo.lastTest).toLocaleTimeString()}
                </div>
              )}
            </div>

            {/* Test Button */}
            <button
              onClick={runTests}
              disabled={isTesting}
              className="w-full bg-gradient-to-r from-cyan-400 to-purple-400 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4" />
                  Run Tests
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default MobileDebugPanel;
