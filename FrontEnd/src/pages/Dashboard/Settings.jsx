import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  FaCog, 
  FaBell, 
  FaUser, 
  FaShieldAlt, 
  FaPalette,
  FaLanguage,
  FaDownload,
  FaTrash,
  FaEdit,
  FaSave,
  FaToggleOn,
  FaToggleOff
} from "react-icons/fa";

const Settings = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    water: true,
    meals: true,
    workouts: true,
    sleep: true,
    reminders: true,
    weekly: true
  });

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'privacy', label: 'Privacy', icon: FaShieldAlt },
    { id: 'appearance', label: 'Appearance', icon: FaPalette },
    { id: 'language', label: 'Language', icon: FaLanguage },
    { id: 'data', label: 'Data & Export', icon: FaDownload },
  ];

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <SignedIn>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
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

        <div className="relative z-10 p-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-white/60">Customize your Smart Vitals experience</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">Settings</h3>
                <div className="space-y-2">
                  {settingsTabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <tab.icon className="text-lg" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Settings Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                {activeTab === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-6">Profile Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/80 mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user?.fullName || "John Doe"}
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={user?.emailAddresses[0]?.emailAddress || "john@example.com"}
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 mb-2">Age</label>
                        <input
                          type="number"
                          defaultValue="28"
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                      >
                        <FaSave className="inline mr-2" />
                        Save Changes
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-6">Notification Settings</h3>
                    <div className="space-y-4">
                      {Object.entries(notifications).map(([key, value]) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                        >
                          <div>
                            <p className="text-white font-medium capitalize">{key} Reminders</p>
                            <p className="text-white/60 text-sm">Get notified about {key}</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleNotification(key)}
                            className="p-2"
                          >
                            {value ? (
                              <FaToggleOn className="text-cyan-400 text-2xl" />
                            ) : (
                              <FaToggleOff className="text-white/40 text-2xl" />
                            )}
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'privacy' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-6">Privacy & Security</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-xl">
                        <h4 className="text-white font-medium mb-2">Data Privacy</h4>
                        <p className="text-white/60 text-sm mb-3">Control how your health data is used and shared</p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="p-2 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 rounded-lg text-white text-sm"
                        >
                          Manage Privacy Settings
                        </motion.button>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl">
                        <h4 className="text-white font-medium mb-2">Account Security</h4>
                        <p className="text-white/60 text-sm mb-3">Update your password and security settings</p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="p-2 bg-gradient-to-r from-purple-400/20 to-pink-400/20 border border-purple-400/30 rounded-lg text-white text-sm"
                        >
                          Security Settings
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-6">Appearance</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-xl">
                        <h4 className="text-white font-medium mb-2">Theme</h4>
                        <div className="flex gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-lg font-medium"
                          >
                            Dark (Current)
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-3 bg-white/10 text-white/60 rounded-lg font-medium hover:bg-white/20"
                          >
                            Light
                          </motion.button>
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl">
                        <h4 className="text-white font-medium mb-2">Accent Color</h4>
                        <div className="flex gap-3">
                          {['cyan', 'purple', 'green', 'orange', 'pink'].map((color) => (
                            <motion.button
                              key={color}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`w-8 h-8 rounded-full bg-${color}-400 border-2 border-white/20`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'language' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-6">Language & Region</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white/80 mb-2">Language</label>
                        <select className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none">
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white/80 mb-2">Region</label>
                        <select className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none">
                          <option value="us">United States</option>
                          <option value="uk">United Kingdom</option>
                          <option value="ca">Canada</option>
                          <option value="au">Australia</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'data' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-6">Data & Export</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-xl">
                        <h4 className="text-white font-medium mb-2">Export Data</h4>
                        <p className="text-white/60 text-sm mb-3">Download your health data in various formats</p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="p-2 bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/30 rounded-lg text-white text-sm"
                        >
                          <FaDownload className="inline mr-2" />
                          Export Data
                        </motion.button>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl">
                        <h4 className="text-white font-medium mb-2">Delete Account</h4>
                        <p className="text-white/60 text-sm mb-3">Permanently delete your account and all data</p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="p-2 bg-gradient-to-r from-red-400/20 to-pink-400/20 border border-red-400/30 rounded-lg text-red-400 text-sm"
                        >
                          <FaTrash className="inline mr-2" />
                          Delete Account
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </SignedIn>
  );
};

export default Settings; 