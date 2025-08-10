import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useSidebar } from "./SidebarContext.jsx";
import { 
  Menu,
  X,
  Home,
  User,
  Utensils,
  Calculator,
  Dumbbell,
  Weight,
  Droplets,
  Bed,
  Brain,
  Thermometer,
  FileText,
  TrendingUp,
  Bell,
  Mic,
  Settings,
  LogOut,
  Heart,
  Target,
  Bot,
  Waves,
  Leaf
} from "lucide-react";

const GlobalSidebar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('overview');
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  const menuItems = [
    // Main Dashboard
    { id: 'overview', label: 'Dashboard', icon: Home, route: '/Dashboard' },
    
    // Health Tracking
    { id: 'meals', label: 'Meals', icon: Utensils, route: '/Dashboard/meals' },
    { id: 'water', label: 'Water', icon: Droplets, route: '/Dashboard/water' },
    { id: 'sleep', label: 'Sleep', icon: Bed, route: '/Dashboard/sleep' },
    { id: 'workout', label: 'Workouts', icon: Dumbbell, route: '/Dashboard/workout' },
    { id: 'weight', label: 'Weight Tracker', icon: Weight, route: '/Dashboard/weight' },
    
    // AI & Analytics
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, route: '/Dashboard/ai-assistant' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, route: '/Dashboard/analytics' },
    { id: 'reports', label: 'Reports', icon: FileText, route: '/Dashboard/reports' },
    
    // Additional Features
    { id: 'mental-health', label: 'Mental Health', icon: Brain, route: '/Dashboard/mental-health' },
    { id: 'symptom-checker', label: 'Symptom Checker', icon: Thermometer, route: '/Dashboard/symptom-checker' },
    { id: 'meal-plan', label: 'Meal Plan Generator', icon: Utensils, route: '/Dashboard/meal-plan' },
    { id: 'reminders', label: 'Reminders', icon: Bell, route: '/Dashboard/reminders' },
    { id: 'voice-assistant', label: 'Chatbot', icon: Mic, route: '/Dashboard/voice-assistant' },
    
    // Settings & Profile
    { id: 'profile', label: 'Profile', icon: User, route: '/Dashboard/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, route: '/Dashboard/settings' },
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
      setSidebarOpen(false);
    }
  };

  const handleToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Toggle Button - Always Visible */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        className={`fixed top-4 z-50 p-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl text-white shadow-lg backdrop-blur-sm transition-all duration-300 sidebar-toggle ${
          sidebarOpen ? 'left-[21rem]' : 'left-4'
        }`}
        style={{ zIndex: 9999 }}
      >
        {sidebarOpen ? <X className="text-white" /> : <Menu className="text-white" />}
      </motion.button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -352 }}
        animate={{ x: sidebarOpen ? 0 : -352 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-88 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-r border-cyan-400/20 z-40 shadow-2xl sidebar-scroll"
        style={{ 
          zIndex: 9998,
          width: '22rem',
          overflowX: 'hidden'
        }}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Brand Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-4 text-center">
              Smart Vitals
            </h1>
            <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-cyan-400/20">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                <Heart className="text-white" />
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
          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation(item.route)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 sidebar-item ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent hover:border-cyan-400/20'
                }`}
              >
                <item.icon className={`text-lg flex-shrink-0 ${
                  activeSection === item.id ? 'text-cyan-400' : 'text-white/60'
                }`} />
                <span className="font-medium truncate">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2 mt-6 pt-6 border-t border-cyan-400/20">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-200 border border-transparent hover:border-red-400/20"
            >
              <LogOut className="text-lg flex-shrink-0" />
              <span className="font-medium">Sign Out</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            style={{ zIndex: 9997 }}
          />
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(34, 211, 238, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5);
        }
      `}</style>
    </>
  );
};

export default GlobalSidebar; 