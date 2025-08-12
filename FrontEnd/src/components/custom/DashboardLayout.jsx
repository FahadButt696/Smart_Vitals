import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlobalSidebar from "./GlobalSidebar.jsx";
import SidebarContext from "./SidebarContext.jsx";

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
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-r from-gray-900 via-cyan-900 to-neutral-900"></div>
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10"></div>
        </div>

        {/* Global Sidebar */}
        <GlobalSidebar />

        {/* Main Content */}
        <motion.div 
          className="relative z-10 transition-all duration-300 min-h-screen"
          animate={{ 
            marginLeft: sidebarOpen ? '17.5rem' : '3rem',
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
                  <p className="text-white/60 text-lg">{subtitle}</p>
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
    </SidebarContext.Provider>
  );
};

export default DashboardLayout; 