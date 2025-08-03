import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendar, 
  FaWeight, 
  FaRuler, 
  FaBullseye, 
  FaEdit, 
  FaSave,
  FaCamera,
  FaHeart,
  FaDumbbell,
  FaTint,
  FaBed
} from "react-icons/fa";

const Profile = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "John Doe",
    email: user?.emailAddresses[0]?.emailAddress || "john@example.com",
    age: 28,
    height: "175 cm",
    weight: "75 kg",
    targetWeight: "70 kg",
    goal: "Lose Weight",
    activityLevel: "Moderate"
  });

  const healthStats = [
    { label: 'Current Weight', value: '75 kg', icon: FaWeight, color: 'from-cyan-400 to-blue-500' },
    { label: 'Target Weight', value: '70 kg', icon: FaBullseye, color: 'from-purple-400 to-pink-500' },
    { label: 'Height', value: '175 cm', icon: FaRuler, color: 'from-green-400 to-emerald-500' },
    { label: 'BMI', value: '24.5', icon: FaHeart, color: 'from-orange-400 to-red-500' },
  ];

  const recentActivities = [
    { activity: 'Updated weight', time: '2 days ago', value: '75.2 kg' },
    { activity: 'Logged workout', time: '1 day ago', value: 'Upper Body' },
    { activity: 'Added meal', time: '3 hours ago', value: 'Chicken Salad' },
    { activity: 'Drank water', time: '1 hour ago', value: '500ml' },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
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
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Profile</h1>
            <p className="text-white/60">Manage your personal information and health data</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaUser className="text-white text-3xl" />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full text-white"
                    >
                      <FaCamera className="text-sm" />
                    </motion.button>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">{profileData.fullName}</h2>
                  <p className="text-white/60">{profileData.email}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <FaEnvelope className="text-cyan-400" />
                    <div>
                      <p className="text-white/60 text-sm">Email</p>
                      <p className="text-white font-medium">{profileData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <FaCalendar className="text-purple-400" />
                    <div>
                      <p className="text-white/60 text-sm">Age</p>
                      <p className="text-white font-medium">{profileData.age} years</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <FaWeight className="text-green-400" />
                    <div>
                      <p className="text-white/60 text-sm">Current Weight</p>
                      <p className="text-white font-medium">{profileData.weight}</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full mt-6 p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  {isEditing ? <FaSave className="inline mr-2" /> : <FaEdit className="inline mr-2" />}
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </motion.button>
              </div>
            </motion.div>

            {/* Health Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {healthStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                        <stat.icon className="text-white text-xl" />
                      </div>
                      <p className="text-white/60 text-sm">{stat.label}</p>
                    </div>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-lg">
                          <FaHeart className="text-cyan-400 text-sm" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{activity.activity}</p>
                          <p className="text-white/60 text-xs">{activity.time}</p>
                        </div>
                      </div>
                      <span className="text-white/80 text-sm font-medium">{activity.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </SignedIn>
  );
};

export default Profile; 