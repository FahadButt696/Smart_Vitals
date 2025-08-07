import { useState, useEffect, createContext, useContext } from "react";
import { motion } from "framer-motion";
import GlobalSidebar from "./GlobalSidebar.jsx";

// Create context for sidebar state
const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

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
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23ffffff" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>')`,
            }}
          />
        </div>

        {/* Global Sidebar */}
        <GlobalSidebar />

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