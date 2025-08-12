import { SignedIn, useUser, useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  Utensils, 
  Calculator,
  Plus,
  Flame,
  Clock,
  Lightbulb,
  Droplets,
  Bed,
  Dumbbell,
  Brain,
  PieChart,
  BarChart3,
  TrendingUp,
  Bot,
  Bell,
  Mic,
  FileText,
  Leaf,
  Weight,
  Thermometer,
  Settings,
  ArrowRight,
  Waves,
  Heart,
  Target,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertTriangle,
  Activity,
  Zap,
  Moon,
  Sun,
  Coffee,
  Target as TargetIcon,
  User
} from "lucide-react";
import DashboardLayout from "@/components/custom/DashboardLayout";
import { BarChart, ProgressBar, DoughnutChart, TrendIndicator, LineChart, MetricCard } from "@/components/custom/ChartComponents";
import AIRecommendationCard from "@/components/custom/AIRecommendationCard";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";

// Dashboard Overview Component
const DashboardOverview = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { recommendations, isLoading: aiLoading } = useAIRecommendations();
  
  // Real-time stats state
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    waterIntake: 0,
    sleepHours: 0,
    mealsLogged: 0,
    workouts: 0,
    weight: 0,
    steps: 0,
    heartRate: 0
  });
  
  const [weeklyStats, setWeeklyStats] = useState({
    waterIntake: [],
    sleepHours: [],
    calories: [],
    weight: [],
    workouts: []
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from APIs
  useEffect(() => {
    if (user) {
      fetchAllStats();
    }
  }, [user]);

  const fetchAllStats = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchWaterStats(),
        fetchMealStats(),
        fetchSleepStats(),
        fetchWorkoutStats(),
        fetchWeightStats()
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWaterStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/water/stats?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        const stats = data.stats || {};
        
        setTodayStats(prev => ({
          ...prev,
          waterIntake: Math.round(stats.todayTotal || 0)
        }));
        
        // Weekly water data for charts
        if (stats.dailyBreakdown) {
          const weeklyData = Object.entries(stats.dailyBreakdown)
            .slice(-7)
            .map(([date, amount]) => ({
              label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
              value: Math.round(amount / 100) // Convert ml to glasses
            }));
          setWeeklyStats(prev => ({ ...prev, waterIntake: weeklyData }));
        }
      }
    } catch (error) {
      console.error('Error fetching water stats:', error);
    }
  };

  const fetchMealStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/meal?userId=${user.id}`);
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
        
        // Weekly calories data
        const weeklyCalories = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayMeals = data.meals?.filter(meal => {
            const mealDate = new Date(meal.timestamp);
            return mealDate.toDateString() === date.toDateString();
          }) || [];
          const dayCalories = dayMeals.reduce((sum, meal) => sum + (meal.totalNutrition?.calories || 0), 0);
          return {
            label: date.toLocaleDateString('en-US', { weekday: 'short' }),
            value: Math.round(dayCalories)
          };
        }).reverse();
        
        setWeeklyStats(prev => ({ ...prev, calories: weeklyCalories }));
      }
    } catch (error) {
      console.error('Error fetching meal stats:', error);
    }
  };

  const fetchSleepStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/sleep/stats?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        const stats = data.stats || {};
        
        setTodayStats(prev => ({
          ...prev,
          sleepHours: Math.round((stats.today?.duration || 0) * 100) / 100
        }));
        
        // Weekly sleep data
        if (stats.weekly) {
          const weeklyData = stats.weekly.map((day, index) => ({
            label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] || `Day ${index + 1}`,
            value: Math.round((day.duration || 0) * 100) / 100
          }));
          setWeeklyStats(prev => ({ ...prev, sleepHours: weeklyData }));
        }
      }
    } catch (error) {
      console.error('Error fetching sleep stats:', error);
    }
  };

  const fetchWorkoutStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/workout?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        const todayWorkouts = data.workouts?.filter(workout => {
          const today = new Date();
          const workoutDate = new Date(workout.date);
          return workoutDate.toDateString() === today.toDateString();
        }) || [];
        
        setTodayStats(prev => ({
          ...prev,
          workouts: todayWorkouts.length
        }));
        
        // Weekly workout data
        const weeklyWorkouts = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayWorkouts = data.workouts?.filter(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate.toDateString() === date.toDateString();
          }) || [];
          return {
            label: date.toLocaleDateString('en-US', { weekday: 'short' }),
            value: dayWorkouts.length
          };
        }).reverse();
        
        setWeeklyStats(prev => ({ ...prev, workouts: weeklyWorkouts }));
      }
    } catch (error) {
      console.error('Error fetching workout stats:', error);
    }
  };

  const fetchWeightStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/weight?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        const weights = data.weights || [];
        
        if (weights.length > 0) {
          const latestWeight = weights[weights.length - 1];
          setTodayStats(prev => ({
            ...prev,
            weight: latestWeight.weight
          }));
          
          // Weekly weight data (last 7 entries)
          const weeklyData = weights.slice(-7).map((entry, index) => ({
            label: `Week ${weights.length - 6 + index}`,
            value: entry.weight
          }));
          setWeeklyStats(prev => ({ ...prev, weight: weeklyData }));
        }
      }
    } catch (error) {
      console.error('Error fetching weight stats:', error);
    }
  };

  // Summary cards with real data
  const summaryCards = [
    { 
      title: 'Calories Consumed', 
      value: todayStats.calories, 
      target: 2000, 
      icon: Flame, 
      color: 'from-orange-400 to-red-500',
      unit: 'cal',
      progress: Math.min((todayStats.calories / 2000) * 100, 100)
    },
    { 
      title: 'Water Intake', 
      value: todayStats.waterIntake, 
      target: 2000, 
      icon: Droplets, 
      color: 'from-blue-400 to-cyan-500',
      unit: 'ml',
      progress: Math.min((todayStats.waterIntake / 2000) * 100, 100)
    },
    { 
      title: 'Sleep Hours', 
      value: todayStats.sleepHours, 
      target: 8, 
      icon: Bed, 
      color: 'from-purple-400 to-pink-500',
      unit: 'hrs',
      progress: Math.min((todayStats.sleepHours / 8) * 100, 100)
    },
    { 
      title: 'Meals Logged', 
      value: todayStats.mealsLogged, 
      target: 5, 
      icon: Utensils, 
      color: 'from-green-400 to-emerald-500',
      unit: 'meals',
      progress: Math.min((todayStats.mealsLogged / 5) * 100, 100)
    },
  ];

  // Feature navigation cards
  const featureCards = [
    { 
      title: 'Meal Logger', 
      description: 'Track your daily meals and nutrition',
      icon: Utensils, 
      route: '/Dashboard/meals', 
      color: 'from-green-400 to-emerald-500',
      stats: `${todayStats.mealsLogged} meals today`
    },
    { 
      title: 'Water Tracker', 
      description: 'Monitor your hydration levels',
      icon: Droplets, 
      route: '/Dashboard/water', 
      color: 'from-blue-400 to-cyan-500',
      stats: `${todayStats.waterIntake}ml today`
    },
    { 
      title: 'Sleep Tracker', 
      description: 'Track your sleep patterns and quality',
      icon: Bed, 
      route: '/Dashboard/sleep', 
      color: 'from-purple-400 to-pink-500',
      stats: `${todayStats.sleepHours}h today`
    },
    { 
      title: 'Workout Tracker', 
      description: 'Log your fitness activities and progress',
      icon: Dumbbell, 
      route: '/Dashboard/workout', 
      color: 'from-orange-400 to-red-500',
      stats: `${todayStats.workouts} workouts today`
    },
    { 
      title: 'Weight Tracker', 
      description: 'Monitor your weight progress over time',
      icon: Weight, 
      route: '/Dashboard/weight', 
      color: 'from-indigo-400 to-purple-500',
      stats: `${todayStats.weight}kg current`
    },
    { 
      title: 'Mental Health', 
      description: 'Track and improve your mental well-being',
      icon: Brain, 
      route: '/Dashboard/mental-health', 
      color: 'from-pink-400 to-rose-500',
      stats: 'AI-powered insights'
    },
    { 
      title: 'Symptom Checker', 
      description: 'Check symptoms and get health guidance',
      icon: Thermometer, 
      route: '/Dashboard/symptom-checker', 
      color: 'from-yellow-400 to-orange-500',
      stats: 'AI health assessment'
    },
    { 
      title: 'Meal Plan Generator', 
      description: 'Generate personalized meal plans',
      icon: Leaf, 
      route: '/Dashboard/meal-plan', 
      color: 'from-emerald-400 to-teal-500',
      stats: 'AI meal planning'
    },
    { 
      title: 'Profile & Settings', 
      description: 'Manage your profile and preferences',
      icon: User, 
      route: '/Dashboard/profile', 
      color: 'from-gray-400 to-slate-500',
      stats: 'Account management'
    }
  ];

  const handleNavigation = (route) => {
    navigate(route);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        <span className="ml-3 text-white/60 text-lg">Loading your health data...</span>
      </div>
    );
  }

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group health-stat-card"
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

      {/* Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="text-cyan-400" />
            Analytics Overview
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Weekly Water Intake */}
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Droplets className="text-blue-400" />
                Weekly Water Intake
              </h4>
              <BarChart 
                data={weeklyStats.waterIntake.length > 0 ? weeklyStats.waterIntake : [
                  { label: 'Mon', value: 0 },
                  { label: 'Tue', value: 0 },
                  { label: 'Wed', value: 0 },
                  { label: 'Thu', value: 0 },
                  { label: 'Fri', value: 0 },
                  { label: 'Sat', value: 0 },
                  { label: 'Sun', value: 0 }
                ]} 
                height={150} 
                color="from-blue-400 to-cyan-400" 
              />
            </div>

            {/* Weekly Calories */}
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Flame className="text-orange-400" />
                Weekly Calories
              </h4>
              <LineChart 
                data={weeklyStats.calories.length > 0 ? weeklyStats.calories : [
                  { label: 'Mon', value: 0 },
                  { label: 'Tue', value: 0 },
                  { label: 'Wed', value: 0 },
                  { label: 'Thu', value: 0 },
                  { label: 'Fri', value: 0 },
                  { label: 'Sat', value: 0 },
                  { label: 'Sun', value: 0 }
                ]} 
                height={150} 
                color="from-orange-400 to-red-400" 
              />
            </div>

            {/* Weekly Sleep */}
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Bed className="text-purple-400" />
                Weekly Sleep
              </h4>
              <BarChart 
                data={weeklyStats.sleepHours.length > 0 ? weeklyStats.sleepHours : [
                  { label: 'Mon', value: 0 },
                  { label: 'Tue', value: 0 },
                  { label: 'Wed', value: 0 },
                  { label: 'Thu', value: 0 },
                  { label: 'Fri', value: 0 },
                  { label: 'Sat', value: 0 },
                  { label: 'Sun', value: 0 }
                ]} 
                height={150} 
                color="from-purple-400 to-pink-400" 
              />
            </div>

            {/* Weekly Workouts */}
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Dumbbell className="text-green-400" />
                Weekly Workouts
              </h4>
              <BarChart 
                data={weeklyStats.workouts.length > 0 ? weeklyStats.workouts : [
                  { label: 'Mon', value: 0 },
                  { label: 'Tue', value: 0 },
                  { label: 'Wed', value: 0 },
                  { label: 'Thu', value: 0 },
                  { label: 'Fri', value: 0 },
                  { label: 'Sat', value: 0 },
                  { label: 'Sun', value: 0 }
                ]} 
                height={150} 
                color="from-green-400 to-emerald-400" 
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature Navigation Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <TargetIcon className="text-cyan-400" />
          Quick Access to Features
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {featureCards.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => handleNavigation(feature.route)}
              className="backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group feature-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-white text-lg sm:text-xl" />
                </div>
                <ArrowRight className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 ml-3 sm:ml-auto mt-2" />
              </div>
              
              <h4 className="text-white font-semibold text-base sm:text-lg mb-2">{feature.title}</h4>
              {/* <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4">{feature.description}</p> */}
              
                            
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Recommendations - Horizontal Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Bot className="text-cyan-400" />
              AI Health Recommendations
            </h3>
            {!recommendations && (
              <button
                onClick={async () => {
                  try {
                    const token = await getToken();
                    const response = await fetch('http://localhost:5000/api/ai-recommendations/generate', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      }
                    });
                    if (response.ok) {
                      window.location.reload();
                    } else {
                      toast.error('Failed to generate recommendations. Please try again later.');
                    }
                  } catch (error) {
                    toast.error('Failed to generate recommendations. Please try again later.');
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Generate AI Tips
              </button>
            )}
          </div>
          
          {aiLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              <span className="ml-2 text-white/60">Generating personalized recommendations...</span>
            </div>
          ) : recommendations ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendations.mealLog && (
                <AIRecommendationCard
                  title="Meal & Nutrition"
                  recommendation={recommendations.mealLog}
                  feature="mealLog"
                  userId={user?.id}
                />
              )}
              {recommendations.workoutTracker && (
                <AIRecommendationCard
                  title="Workout & Fitness"
                  recommendation={recommendations.workoutTracker}
                  feature="workoutTracker"
                  userId={user?.id}
                />
              )}
              {recommendations.sleepTracker && (
                <AIRecommendationCard
                  title="Sleep & Recovery"
                  recommendation={recommendations.sleepTracker}
                  feature="sleepTracker"
                  userId={user?.id}
                />
              )}
              {recommendations.hydration && (
                <AIRecommendationCard
                  title="Hydration"
                  recommendation={recommendations.hydration}
                  feature="hydration"
                  userId={user?.id}
                />
              )}
              {recommendations.weightProgress && (
                <AIRecommendationCard
                  title="Weight Management"
                  recommendation={recommendations.weightProgress}
                  feature="weightProgress"
                  userId={user?.id}
                />
              )}
              {recommendations.mentalHealthChatbot && (
                <AIRecommendationCard
                  title="Mental Health"
                  recommendation={recommendations.mentalHealthChatbot}
                  feature="mentalHealthChatbot"
                  userId={user?.id}
                />
              )}
              {recommendations.generalTips && (
                <AIRecommendationCard
                  title="General Health"
                  recommendation={recommendations.generalTips}
                  feature="generalTips"
                  userId={user?.id}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/60 mb-4">No AI recommendations available yet.</p>
              <p className="text-white/40 text-sm mb-4">Complete your onboarding to get personalized AI recommendations.</p>
              <button
                onClick={() => window.location.href = '/onboarding'}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              >
                Complete Onboarding
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

// Main Dashboard Component with Nested Routing
const Dashboard = () => {
  const location = useLocation();
  
  // Get the current route to determine the title
  const getRouteTitle = () => {
    const path = location.pathname;
    if (path === '/Dashboard' || path === '/Dashboard/') return 'Dashboard';
    if (path.includes('/profile')) return 'Profile';
    if (path.includes('/meals')) return 'Meal Logger';
    if (path.includes('/water')) return 'Water Tracker';
    if (path.includes('/sleep')) return 'Sleep Tracker';
    if (path.includes('/weight')) return 'Weight Tracker';
    if (path.includes('/workout')) return 'Workout Tracker';
    if (path.includes('/ai-assistant')) return 'AI Assistant';
    if (path.includes('/analytics')) return 'Analytics';
    if (path.includes('/reports')) return 'Reports';
    if (path.includes('/mental-health')) return 'Mental Health';
    if (path.includes('/symptom-checker')) return 'Symptom Checker';
    if (path.includes('/meal-plan')) return 'Meal Plan Generator';
    if (path.includes('/reminders')) return 'Reminders';
    if (path.includes('/voice-assistant')) return 'Chatbot';
    return 'Dashboard';
  };

  const getRouteSubtitle = () => {
    const path = location.pathname;
    if (path === '/Dashboard' || path === '/Dashboard/') return 'Your health overview and quick access to all features';
    if (path.includes('/profile')) return 'Manage your profile and settings';
    if (path.includes('/meals')) return 'Track your meals and nutrition';
    if (path.includes('/water')) return 'Monitor your daily water intake';
    if (path.includes('/sleep')) return 'Track your sleep patterns';
    if (path.includes('/weight')) return 'Monitor your weight progress';
    if (path.includes('/workout')) return 'Track your fitness activities';
    if (path.includes('/ai-assistant')) return 'Get AI-powered health insights and recommendations';
    if (path.includes('/analytics')) return 'View detailed health analytics and trends';
    if (path.includes('/reports')) return 'Generate and export health reports';
    if (path.includes('/mental-health')) return 'Track and improve your mental well-being';
    if (path.includes('/symptom-checker')) return 'Check symptoms and get health guidance';
    if (path.includes('/meal-plan')) return 'Generate personalized meal plans';
    if (path.includes('/reminders')) return 'Set and manage health reminders';
    if (path.includes('/voice-assistant')) return 'Chat with your health assistant';
    return 'Your health overview and quick access to all features';
  };

  return (
    <SignedIn>
      <DashboardLayout title={getRouteTitle()} subtitle={getRouteSubtitle()}>
        {/* Render the overview content for the main dashboard route */}
        {(location.pathname === '/Dashboard' || location.pathname === '/Dashboard/') && (
          <DashboardOverview />
        )}
        
        {/* Render nested routes */}
        <div>
          <Outlet />
        </div>
      </DashboardLayout>
    </SignedIn>
  );
};

export default Dashboard;