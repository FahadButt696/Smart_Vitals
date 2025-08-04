import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlobalSidebar from "./GlobalSidebar.jsx";

const DashboardLayout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"><defs><radialGradient id="a" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="%230ea5e9" stop-opacity="0.1"/><stop offset="100%" stop-color="%238b5cf6" stop-opacity="0.05"/></radialGradient><pattern id="b" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" fill-opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23a)"/><rect width="100%" height="100%" fill="url(%23b)"/></svg>')`,
            filter: 'brightness(0.3) contrast(1.2) saturate(0.8)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-cyan-900/60 to-neutral-900/80"></div>
      </div>

      {/* Global Sidebar */}
      <GlobalSidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />

      {/* Main Content */}
      <motion.div 
        className="relative z-10 transition-all duration-300 min-h-screen"
        animate={{ 
          marginLeft: sidebarOpen ? '20rem' : '1rem',
          paddingLeft: sidebarOpen ? '1rem' : '0'
        }}
        style={{ 
          maxWidth: '100vw',
          overflowX: 'hidden'
        }}
      >
        <div className="p-6 lg:p-8 pt-20">
          {/* Header */}
          {title && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-white/60">{subtitle}</p>
              )}
            </motion.div>
          )}

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-x-hidden"
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardLayout; 