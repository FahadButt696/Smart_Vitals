import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { 
  FaUtensils, 
  FaCalculator,
  FaPlus,
  FaFire,
  FaClock,
  FaLightbulb
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/custom/DashboardLayout";

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const quickStats = [
    { 
      title: 'Today\'s Calories', 
      value: 0, 
      target: 2000, 
      icon: FaCalculator, 
      color: 'from-cyan-400 to-blue-500' 
    },
    { 
      title: 'Meals Logged', 
      value: 0, 
      target: 'Today', 
      icon: FaUtensils, 
      color: 'from-green-400 to-emerald-500' 
    },
    { 
      title: 'Calorie Goal', 
      value: '0%', 
      target: '2000 cal', 
      icon: FaFire, 
      color: 'from-orange-400 to-red-500' 
    },
    { 
      title: 'Last Meal', 
      value: 'N/A', 
      target: 'Today', 
      icon: FaClock, 
      color: 'from-purple-400 to-pink-500' 
    },
  ];

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <SignedIn>
      <DashboardLayout title="Dashboard" subtitle="Your health overview">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="text-white text-xl" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.target}</div>
                </div>
              </div>
              <h3 className="text-white font-medium">{stat.title}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaPlus className="text-cyan-400" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation('/Dashboard/meals')}
                  className="p-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl text-white hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <FaUtensils className="text-2xl" />
                    <div className="text-left">
                      <h4 className="font-bold text-lg">Log Meal</h4>
                      <p className="text-white/80 text-sm">Track your food intake</p>
                    </div>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation('/Dashboard/profile')}
                  className="p-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl text-white hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <FaCalculator className="text-2xl" />
                    <div className="text-left">
                      <h4 className="font-bold text-lg">View Profile</h4>
                      <p className="text-white/80 text-sm">Manage your account</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaLightbulb className="text-cyan-400" />
                Health Tips
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="text-white font-medium text-sm mb-1">Track Your Meals</h4>
                  <p className="text-white/70 text-sm">Log your meals to monitor your nutrition and calorie intake.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="text-white font-medium text-sm mb-1">Stay Consistent</h4>
                  <p className="text-white/70 text-sm">Regular meal tracking helps you understand your eating patterns.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="text-white font-medium text-sm mb-1">Use AI Detection</h4>
                  <p className="text-white/70 text-sm">Take photos of your food for automatic calorie detection.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </SignedIn>
  );
};

export default Dashboard;
