import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  FaUtensils, 
  FaCalculator,
  FaPlus,
  FaFire,
  FaClock,
  FaLightbulb,
  FaTint,
  FaBed,
  FaDumbbell,
  FaBrain,
  FaChartPie,
  FaChartBar,
  FaChartLine,
  FaRobot,
  FaBell,
  FaMicrophone,
  FaFilePdf,
  FaLeaf,
  FaBreadSlice,
  FaWeight,
  FaThermometerHalf,
  FaUtensilSpoon,
  FaCog,
  FaArrowRight,
  FaWater,
  FaHeart,
  FaBullseye,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/custom/DashboardLayout";
import { BarChart, ProgressBar, DoughnutChart, TrendIndicator } from "@/components/custom/ChartComponents";

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    waterIntake: 0,
    sleepHours: 0,
    mealsLogged: 0,
    workouts: 0,
    weight: 0
  });
  const [waterStats, setWaterStats] = useState({
    todayTotal: 0,
    weekTotal: 0,
    monthTotal: 0,
    averageDaily: 0,
    dailyBreakdown: {} // Added for daily breakdown
  });

  // Fetch real data from APIs
  useEffect(() => {
    if (user) {
      fetchWaterStats();
      fetchMealStats();
    }
  }, [user]);

  const fetchWaterStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/water/stats?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${await user.getToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWaterStats(data.stats || {});
        
        // Update today's stats with real water data
        setTodayStats(prev => ({
          ...prev,
          waterIntake: Math.round(data.stats.todayTotal / 250) // Convert ml to glasses (250ml per glass)
        }));
      }
    } catch (error) {
      console.error('Error fetching water stats:', error);
    }
  };

  const fetchMealStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/meal?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${await user.getToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const todayMeals = data.meals?.filter(meal => {
          const today = new Date();
          const mealDate = new Date(meal.timestamp);
          return mealDate.toDateString() === today.toDateString();
        }) || [];
        
        const todayCalories = todayMeals.reduce((sum, meal) => {
          return sum + (meal.totalNutrition?.calories || 0);
        }, 0);
        
        setTodayStats(prev => ({
          ...prev,
          calories: Math.round(todayCalories),
          mealsLogged: todayMeals.length
        }));
      }
    } catch (error) {
      console.error('Error fetching meal stats:', error);
    }
  };

  const summaryCards = [
    { 
      title: 'Calories Consumed', 
      value: todayStats.calories, 
      target: 2000, 
      icon: FaFire, 
      color: 'from-orange-400 to-red-500',
      unit: 'cal',
      progress: (todayStats.calories / 2000) * 100
    },
    { 
      title: 'Water Intake', 
      value: waterStats.todayTotal, 
      target: 2000, 
      icon: FaTint, 
      color: 'from-blue-400 to-cyan-500',
      unit: 'ml',
      progress: (waterStats.todayTotal / 2000) * 100
    },
    { 
      title: 'Sleep Hours', 
      value: todayStats.sleepHours, 
      target: 8, 
      icon: FaBed, 
      color: 'from-purple-400 to-pink-500',
      unit: 'hrs',
      progress: (todayStats.sleepHours / 8) * 100
    },
    { 
      title: 'Meals Logged', 
      value: todayStats.mealsLogged, 
      target: 5, 
      icon: FaUtensils, 
      color: 'from-green-400 to-emerald-500',
      unit: 'meals',
      progress: (todayStats.mealsLogged / 5) * 100
    },
  ];

  const macronutrients = [
    { label: 'Protein', value: 65 },
    { label: 'Carbs', value: 45 },
    { label: 'Fat', value: 30 },
  ];

  // Convert weekly water data to chart format
  const waterData = Object.entries(waterStats.dailyBreakdown || {}).map(([date, amount]) => ({
    label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    value: Math.round(amount / 100) // Convert ml to glasses (100ml per glass for chart display)
  })).slice(-7); // Last 7 days

  const weightData = [
    { label: 'Week 1', value: 76.5 },
    { label: 'Week 2', value: 76.2 },
    { label: 'Week 3', value: 75.8 },
    { label: 'Week 4', value: 75.2 },
  ];

  const aiRecommendations = [
    {
      type: 'nutrition',
      title: 'Increase Protein Intake',
      description: 'You\'re 15% below your protein goal. Consider adding lean meats or legumes to your next meal.',
      icon: FaLeaf,
      priority: 'high'
    },
    {
      type: 'hydration',
      title: waterStats.todayTotal >= 2000 ? 'Great Hydration!' : 'Stay Hydrated',
      description: waterStats.todayTotal >= 2000 
        ? `Excellent! You've consumed ${waterStats.todayTotal}ml today. Keep up the great work!`
        : `You've had ${waterStats.todayTotal}ml today. Aim for ${2000 - waterStats.todayTotal}ml more to reach your daily goal.`,
      icon: FaTint,
      priority: waterStats.todayTotal >= 2000 ? 'low' : 'medium'
    },
    {
      type: 'sleep',
      title: 'Great Sleep Pattern',
      description: 'You\'re consistently getting 7-8 hours. Keep up this healthy sleep routine!',
      icon: FaBed,
      priority: 'low'
    }
  ];

  const quickActions = [
    { title: 'Log Sleep', icon: FaBed, route: '/Dashboard/sleep', color: 'from-purple-400 to-pink-500' },
    { title: 'Track Water', icon: FaTint, route: '/Dashboard/water', color: 'from-blue-400 to-cyan-500' },
    { title: 'Generate Workout', icon: FaDumbbell, route: '/Dashboard/workout', color: 'from-green-400 to-emerald-500' },
    { title: 'Mental Health Bot', icon: FaBrain, route: '/Dashboard/mental-health', color: 'from-indigo-400 to-purple-500' },
  ];

  const handleNavigation = (route) => {
    navigate(route);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-400/30 bg-red-400/10';
      case 'medium': return 'border-yellow-400/30 bg-yellow-400/10';
      case 'low': return 'border-green-400/30 bg-green-400/10';
      default: return 'border-white/20 bg-white/5';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <FaExclamationTriangle className="text-red-400" />;
      case 'medium': return <FaBullseye className="text-yellow-400" />;
      case 'low': return <FaCheckCircle className="text-green-400" />;
      default: return <FaLightbulb className="text-cyan-400" />;
    }
  };

  return (
    <SignedIn>
      <DashboardLayout title="Dashboard" subtitle="Your health overview">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="text-white text-xl" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/60 text-sm">/ {stat.target} {stat.unit}</div>
                </div>
              </div>
              <h3 className="text-white font-medium mb-3">{stat.title}</h3>
              <ProgressBar value={stat.value} max={stat.target} color={stat.color} showLabel={false} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Analytics Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaChartLine className="text-cyan-400" />
                Analytics Overview
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Macronutrient Breakdown */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <FaChartPie className="text-cyan-400" />
                    Macronutrients
                  </h4>
                  <DoughnutChart data={macronutrients} height={150} />
                </div>

                {/* Water Intake Chart */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <FaChartBar className="text-blue-400" />
                    Weekly Water
                  </h4>
                  <BarChart data={waterData} height={150} />
                </div>

                {/* Weight Progress */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <FaChartLine className="text-green-400" />
                    Weight Trend
                  </h4>
                  <TrendIndicator 
                    value={todayStats.weight} 
                    previousValue={76.5} 
                    label="Current Weight (kg)" 
                  />
                  <div className="mt-3">
                    <div className="text-white/60 text-sm">Weekly Progress</div>
                    <div className="text-green-400 text-sm font-medium">-0.3kg this week</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaRobot className="text-cyan-400" />
                AI Recommendations
              </h3>
              <div className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border ${getPriorityColor(rec.priority)} hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-white/10">
                        {getPriorityIcon(rec.priority)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm mb-1">{rec.title}</h4>
                        <p className="text-white/70 text-xs">{rec.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Meal Log Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaUtensils className="text-cyan-400" />
                  Today's Meals
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation('/Dashboard/meals')}
                  className="p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  <FaPlus className="inline mr-2" />
                  Add Meal
                </motion.button>
              </div>
              
              <div className="space-y-4">
                {/* Breakfast */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <FaBreadSlice className="text-orange-400" />
                    Breakfast
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-medium">Oatmeal with Berries</div>
                        <div className="text-white/60 text-sm">1 cup oatmeal, 1/2 cup berries</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">320 cal</div>
                        <div className="text-white/60 text-xs">P: 12g | C: 58g | F: 6g</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lunch */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <FaUtensils className="text-green-400" />
                    Lunch
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-medium">Grilled Chicken Salad</div>
                        <div className="text-white/60 text-sm">4 oz chicken, mixed greens, olive oil</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">450 cal</div>
                        <div className="text-white/60 text-xs">P: 35g | C: 8g | F: 28g</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dinner */}
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <FaUtensils className="text-purple-400" />
                    Dinner
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-white font-medium">Salmon with Quinoa</div>
                        <div className="text-white/60 text-sm">5 oz salmon, 1/2 cup quinoa, vegetables</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">680 cal</div>
                        <div className="text-white/60 text-xs">P: 42g | C: 45g | F: 32g</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaPlus className="text-cyan-400" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigation(action.route)}
                    className={`w-full p-4 bg-gradient-to-r ${action.color} rounded-xl text-white hover:shadow-lg transition-all duration-200 flex items-center justify-between group`}
                  >
                    <div className="flex items-center gap-3">
                      <action.icon className="text-xl" />
                      <span className="font-medium">{action.title}</span>
                    </div>
                    <FaArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Health Tips */}
            <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaLightbulb className="text-cyan-400" />
                Health Tips
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="text-white font-medium text-sm mb-1">Stay Hydrated</h4>
                  <p className="text-white/70 text-sm">Drink water throughout the day to maintain optimal health.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="text-white font-medium text-sm mb-1">Consistent Sleep</h4>
                  <p className="text-white/70 text-sm">Aim for 7-9 hours of quality sleep each night.</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="text-white font-medium text-sm mb-1">Regular Exercise</h4>
                  <p className="text-white/70 text-sm">Include both cardio and strength training in your routine.</p>
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

