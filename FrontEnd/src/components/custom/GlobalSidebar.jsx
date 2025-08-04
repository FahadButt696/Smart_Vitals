import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import { 
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaUtensils,
  FaCalculator,
  FaDumbbell,
  FaWeight,
  FaTint,
  FaBed,
  FaBrain,
  FaThermometerHalf,
  FaUtensilSpoon,
  FaFilePdf,
  FaChartLine,
  FaBell,
  FaMicrophone,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

const GlobalSidebar = ({ isOpen, onToggle }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FaHome, route: '/Dashboard' },
    { id: 'profile', label: 'Profile', icon: FaUser, route: '/Dashboard/profile' },
    { id: 'meals', label: 'Meal Logger', icon: FaUtensils, route: '/Dashboard/meals' },
    { id: 'calories', label: 'Calorie Tracker', icon: FaCalculator, route: '/Dashboard/calories' },
    { id: 'workout', label: 'Workout Logger', icon: FaDumbbell, route: '/Dashboard/workout' },
    { id: 'weight', label: 'Weight Progress', icon: FaWeight, route: '/Dashboard/weight' },
    { id: 'water', label: 'Water Intake', icon: FaTint, route: '/Dashboard/water' },
    { id: 'sleep', label: 'Sleep Tracker', icon: FaBed, route: '/Dashboard/sleep' },
    { id: 'mental-health', label: 'Mental Health', icon: FaBrain, route: '/Dashboard/mental-health' },
    { id: 'symptom-checker', label: 'Symptom Checker', icon: FaThermometerHalf, route: '/Dashboard/symptom-checker' },
    { id: 'meal-plan', label: 'Meal Plan Generator', icon: FaUtensilSpoon, route: '/Dashboard/meal-plan' },
    { id: 'reports', label: 'Health Reports', icon: FaFilePdf, route: '/Dashboard/reports' },
    { id: 'analytics', label: 'Analytics', icon: FaChartLine, route: '/Dashboard/analytics' },
    { id: 'reminders', label: 'Reminders', icon: FaBell, route: '/Dashboard/reminders' },
    { id: 'voice-assistant', label: 'Voice Assistant', icon: FaMicrophone, route: '/Dashboard/voice-assistant' },
    { id: 'settings', label: 'Settings', icon: FaCog, route: '/Dashboard/settings' },
  ];

  useEffect(() => {
    // Set active section based on current route
    const currentRoute = location.pathname;
    const menuItem = menuItems.find(item => item.route === currentRoute);
    if (menuItem) {
      setActiveSection(menuItem.id);
    } else {
      // Handle overview route
      if (currentRoute === '/Dashboard' || currentRoute === '/Dashboard/') {
        setActiveSection('overview');
      }
    }
  }, [location.pathname]);

  const handleNavigation = (route) => {
    navigate(route);
    const routeId = route.split('/').pop() || 'overview';
    setActiveSection(routeId);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      onToggle(false);
    }
  };

  return (
    <>
      {/* Toggle Button - Always Visible */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggle(!isOpen)}
        className={`fixed top-4 z-50 p-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl text-white shadow-lg backdrop-blur-sm transition-all duration-300 ${
          isOpen ? 'left-72' : 'left-4'
        }`}
        style={{ zIndex: 9999 }}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </motion.button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-r border-white/20 z-40 shadow-2xl sidebar-scroll"
        style={{ zIndex: 9998 }}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo and User */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
              Smart Vitals
            </h1>
            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                <FaUser className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user?.username || "User"}</p>
                <p className="text-white/60 text-sm truncate">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonBox: "w-8 h-8",
                    userButtonTrigger: "focus:shadow-none"
                  }
                }}
              />
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation(item.route)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="text-lg flex-shrink-0" />
                <span className="font-medium truncate">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Bottom Actions - Only Sign Out */}
          <div className="space-y-2 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-200"
            >
              <FaSignOutAlt className="text-lg flex-shrink-0" />
              <span className="font-medium">Sign Out</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onToggle(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            style={{ zIndex: 9997 }}
          />
        )}
      </AnimatePresence>

      {/* CSS for hiding scrollbar */}
      <style jsx>{`
        .sidebar-scroll {
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        .sidebar-scroll::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
      `}</style>
    </>
  );
};

export default GlobalSidebar; 