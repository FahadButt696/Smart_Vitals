import { SignedIn, SignedOut, useUser, UserButton } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  FaDumbbell, 
  FaUtensils, 
  FaTint, 
  FaBed, 
  FaWeight, 
  FaChartLine, 
  FaFilePdf, 
  FaBrain, 
  FaStethoscope, 
  FaCalculator,
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaAppleAlt,
  FaHeartbeat,
  FaBell,
  FaMicrophone,
  FaCalendarAlt,
  FaClipboardList,
  FaRobot,
  FaThermometerHalf,
  FaUtensilSpoon
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/custom/AuthForm";

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    { id: 'charts', label: 'Analytics', icon: FaChartLine, route: '/Dashboard/analytics' },
    { id: 'reminders', label: 'Reminders', icon: FaBell, route: '/Dashboard/reminders' },
    { id: 'voice-assistant', label: 'Voice Assistant', icon: FaMicrophone, route: '/Dashboard/voice-assistant' },
    { id: 'settings', label: 'Settings', icon: FaCog, route: '/Dashboard/settings' },
  ];

  const quickStats = [
    { title: 'Today\'s Calories', value: '1,850', target: '2,000', icon: FaCalculator, color: 'from-cyan-400 to-blue-500' },
    { title: 'Water Intake', value: '6/8', target: '8 glasses', icon: FaTint, color: 'from-blue-400 to-cyan-500' },
    { title: 'Workouts This Week', value: '3', target: '5', icon: FaDumbbell, color: 'from-purple-400 to-pink-500' },
    { title: 'Sleep Last Night', value: '7.5h', target: '8h', icon: FaBed, color: 'from-indigo-400 to-purple-500' },
  ];

  const handleNavigation = (route) => {
    navigate(route);
    setActiveSection(route.split('/').pop() || 'overview');
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 transition-all duration-300 group cursor-pointer"
                  onClick={() => handleNavigation(menuItems.find(item => item.label.toLowerCase().includes(stat.title.toLowerCase().split(' ')[0]))?.route || '/Dashboard')}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="text-white text-xl" />
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-sm">{stat.title}</p>
                      <p className="text-white/40 text-xs">Target: {stat.target}</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className={`h-2 bg-gradient-to-r ${stat.color} rounded-full transition-all duration-300 group-hover:scale-105`} style={{ width: '75%' }}></div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  {[
                    { activity: 'Logged workout - Upper Body', time: '2 hours ago', icon: FaDumbbell },
                    { activity: 'Added meal - Chicken Salad', time: '4 hours ago', icon: FaUtensils },
                    { activity: 'Drank water - 250ml', time: '1 hour ago', icon: FaTint },
                    { activity: 'Updated weight - 75.2kg', time: 'Yesterday', icon: FaWeight },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    >
                      <div className="p-2 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-lg">
                        <item.icon className="text-cyan-400 text-sm" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{item.activity}</p>
                        <p className="text-white/60 text-xs">{item.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Log Workout', icon: FaDumbbell, color: 'from-purple-400 to-pink-500', route: '/Dashboard/workout' },
                    { label: 'Add Meal', icon: FaUtensils, color: 'from-cyan-400 to-blue-500', route: '/Dashboard/meals' },
                    { label: 'Log Water', icon: FaTint, color: 'from-blue-400 to-cyan-500', route: '/Dashboard/water' },
                    { label: 'Track Sleep', icon: FaBed, color: 'from-indigo-400 to-purple-500', route: '/Dashboard/sleep' },
                  ].map((action, index) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNavigation(action.route)}
                      className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white font-medium hover:shadow-lg transition-all duration-200`}
                    >
                      <action.icon className="text-2xl mb-2" />
                      <p className="text-sm">{action.label}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center h-64"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHome className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {menuItems.find(item => item.id === activeSection)?.label}
              </h3>
              <p className="text-white/60">This feature is coming soon!</p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <>
      <SignedIn>
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

          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden fixed top-4 left-4 z-50">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl text-white shadow-lg backdrop-blur-sm"
            >
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </motion.button>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: sidebarOpen ? 0 : -320 }}
            className={`fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-r border-white/20 z-40 lg:translate-x-0 lg:opacity-100 transition-all duration-300 shadow-2xl`}
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
                  <div className="flex-1">
                    <p className="text-white font-medium">{user?.username || "User"}</p>
                    <p className="text-white/60 text-sm">{user?.emailAddresses[0]?.emailAddress}</p>
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
                    <item.icon className="text-lg" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </nav>

              {/* Bottom Actions */}
              <div className="space-y-2 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation('/Dashboard/settings')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <FaCog className="text-lg" />
                  <span className="font-medium">Settings</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-200"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:ml-80 relative z-10">
            <div className="p-6 lg:p-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  Welcome back, {user?.username || "User"}! 👋
                </h1>
                <p className="text-white/60">Track your health journey with Smart Vitals</p>
              </motion.div>

              {/* Content Area */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            />
          )}
        </div>
      </SignedIn>
      <SignedOut>
        <AuthForm type="sign-in"/>
      </SignedOut>
    </>
  );
};

export default Dashboard;
