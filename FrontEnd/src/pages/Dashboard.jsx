import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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
  FaPlus,
  FaFire,
  FaClock,
  FaLightbulb
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/custom/AuthForm";
import DashboardLayout from "@/components/custom/DashboardLayout";

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get token using the correct method
        let token;
        try {
          token = await user?.getToken();
        } catch (tokenError) {
          console.warn('Could not get token:', tokenError);
          // Continue without token for now
        }

        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/dashboard', {
          headers
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        setDashboardData(data.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const quickStats = [
    { 
      title: 'Today\'s Calories', 
      value: dashboardData?.summary?.todayCalories || 0, 
      target: dashboardData?.summary?.calorieGoal || 2000, 
      icon: FaCalculator, 
      color: 'from-cyan-400 to-blue-500' 
    },
    { 
      title: 'Water Intake', 
      value: `${Math.round((dashboardData?.summary?.todayWaterIntake || 0) / 250)}/8`, 
      target: '8 glasses', 
      icon: FaTint, 
      color: 'from-blue-400 to-cyan-500' 
    },
    { 
      title: 'Workouts This Week', 
      value: dashboardData?.todayWorkouts?.length || 0, 
      target: 5, 
      icon: FaDumbbell, 
      color: 'from-purple-400 to-pink-500' 
    },
    { 
      title: 'Sleep Last Night', 
      value: dashboardData?.todaySleep?.sleepDuration ? `${dashboardData.todaySleep.sleepDuration}h` : 'N/A', 
      target: '8h', 
      icon: FaBed, 
      color: 'from-indigo-400 to-purple-500' 
    },
  ];

  const handleNavigation = (route) => {
    navigate(route);
  };

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Loading your health data...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-white/60">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Error loading data">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFire className="text-red-400 text-2xl" />
            </div>
            <h3 className="text-white text-lg font-medium mb-2">Error</h3>
            <p className="text-white/60 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaClock className="text-cyan-400" />
                Recent Activities
              </h3>
              <div className="space-y-4">
                {dashboardData?.recentActivities?.length > 0 ? (
                  dashboardData.recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                        <FaPlus className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.title}</p>
                        <p className="text-white/60 text-sm">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/60">No recent activities</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* AI Suggestions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl border border-cyan-400/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaLightbulb className="text-cyan-400" />
                AI Suggestions
              </h3>
              <div className="space-y-4">
                {dashboardData?.aiSuggestions?.length > 0 ? (
                  dashboardData.aiSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/5 rounded-xl"
                    >
                      <h4 className="text-white font-medium text-sm mb-1">{suggestion.title}</h4>
                      <p className="text-white/70 text-sm">{suggestion.message}</p>
                    </motion.div>
                  ))
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <h4 className="text-white font-medium text-sm mb-1">Stay Hydrated</h4>
                      <p className="text-white/70 text-sm">Drink 8 glasses of water today for optimal health.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <h4 className="text-white font-medium text-sm mb-1">Exercise Reminder</h4>
                      <p className="text-white/70 text-sm">Try to get at least 30 minutes of exercise today.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </SignedIn>
  );
};

export default Dashboard;
