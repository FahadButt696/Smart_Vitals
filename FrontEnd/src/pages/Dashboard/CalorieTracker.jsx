import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useAuth } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import { 
  Flame, 
  TrendingUp, 
  Calendar,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Clock,
  Utensils,
  Apple,
  Pizza,
  Hamburger,
  Coffee,
  Zap,
  Lightbulb,
  RefreshCw,
  Plus,
  Minus,
  Edit3,
  Trash2
} from "lucide-react";
import { BarChart, ProgressBar, DoughnutChart, TrendIndicator, LineChart as LineChartComponent, MetricCard } from "@/components/custom/ChartComponents";
import AIRecommendationCard from "@/components/custom/AIRecommendationCard";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { API_BASE_URL } from "@/config/api";

const CalorieTracker = () => {
  const { user } = useUser();
  const { recommendations, isLoading: aiLoading, refreshRecommendations } = useAIRecommendations();
  
  // State for different time periods
  const [timePeriod, setTimePeriod] = useState('daily'); // daily, weekly, monthly
  
  // Calorie tracking state
  const [calorieData, setCalorieData] = useState({
    daily: [],
    weekly: [],
    monthly: []
  });
  
  // User profile and goals
  const [userProfile, setUserProfile] = useState({
    age: 25,
    gender: 'male',
    weight: 70,
    height: 170,
    activityLevel: 'moderate',
    goal: 'maintain', // lose, maintain, gain
    targetCalories: 2000
  });
  
  // Current day data
  const [todayData, setTodayData] = useState({
    consumed: 0,
    burned: 0,
    remaining: 0,
    progress: 0,
    meals: [],
    nutrition: {
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0
    }
  });
  
  // Chart data
  const [chartData, setChartData] = useState({
    calories: [],
    nutrition: [],
    trends: []
  });
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Refs for charts
  const chartRef = useRef(null);

  // Fetch user profile and calorie data
  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchCalorieData();
      fetchTodayMeals();
    }
  }, [user, timePeriod]);

  const fetchUserProfile = async () => {
    try {
      // This would fetch from your user profile API
      // For now, using default values
      setUserProfile(prev => ({
        ...prev,
        targetCalories: calculateTargetCalories()
      }));
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const calculateTargetCalories = () => {
    // Basic BMR calculation (Harris-Benedict equation)
    let bmr = 0;
    if (userProfile.gender === 'male') {
      bmr = 88.362 + (13.397 * userProfile.weight) + (4.799 * userProfile.height) - (5.677 * userProfile.age);
    } else {
      bmr = 447.593 + (9.247 * userProfile.weight) + (3.098 * userProfile.height) - (4.330 * userProfile.age);
    }
    
    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };
    
    let tdee = bmr * activityMultipliers[userProfile.activityLevel];
    
    // Goal adjustment
    switch (userProfile.goal) {
      case 'lose':
        tdee -= 500; // 500 calorie deficit
        break;
      case 'gain':
        tdee += 300; // 300 calorie surplus
        break;
      default:
        // maintain
        break;
    }
    
    return Math.round(tdee);
  };

  const fetchCalorieData = async () => {
    try {
      setIsLoading(true);
      const token = await user.getToken();
      
      const response = await fetch(`${API_BASE_URL}/api/calories?userId=${user.id}&period=${timePeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(15000) // 15 seconds for mobile
      });

      if (response.ok) {
        const data = await response.json();
        setCalorieData(prev => ({
          ...prev,
          [timePeriod]: data.data || []
        }));
        
        // Process chart data
        processChartData(data.data || []);
      } else {
        console.error('Failed to fetch calorie data');
        toast.error('Failed to load calorie data');
      }
    } catch (error) {
      console.error('Error fetching calorie data:', error);
      if (error.name === 'AbortError') {
        toast.error('Request timed out. Please check your connection.');
      } else {
        toast.error('Failed to load calorie data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleData = () => {
    let sampleData = [];
    
    if (timePeriod === 'daily') {
      // Generate last 7 days of data
      sampleData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString(),
          consumed: Math.floor(Math.random() * 800) + 1200,
          target: userProfile.targetCalories
        };
      }).reverse();
    } else if (timePeriod === 'weekly') {
      // Generate last 4 weeks of data
      sampleData = Array.from({ length: 4 }, (_, i) => {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i * 7));
        return {
          weekStart: weekStart.toISOString(),
          avgConsumed: Math.floor(Math.random() * 600) + 1400,
          target: userProfile.targetCalories
        };
      }).reverse();
    } else if (timePeriod === 'monthly') {
      // Generate last 6 months of data
      sampleData = Array.from({ length: 6 }, (_, i) => {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        return {
          month: month.toISOString(),
          avgConsumed: Math.floor(Math.random() * 400) + 1600,
          target: userProfile.targetCalories
        };
      }).reverse();
    }
    
    setCalorieData(prev => ({
      ...prev,
      [timePeriod]: sampleData
    }));
    
    processChartData(sampleData);
  };

  const fetchTodayMeals = async () => {
    try {
      const token = await user.getToken();
      
      const response = await fetch(`${API_BASE_URL}/api/meal?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(15000) // 15 seconds for mobile
      });

      if (response.ok) {
        const data = await response.json();
        const todayMeals = data.meals?.filter(meal => {
          const today = new Date();
          const mealDate = new Date(meal.timestamp);
          return mealDate.toDateString() === today.toDateString();
        }) || [];
        
        // Calculate today's totals
        const consumed = todayMeals.reduce((sum, meal) => sum + (meal.totalNutrition?.calories || 0), 0);
        const protein = todayMeals.reduce((sum, meal) => sum + (meal.totalNutrition?.protein || 0), 0);
        const carbs = todayMeals.reduce((sum, meal) => sum + (meal.totalNutrition?.carbs || meal.totalNutrition?.totalCarbs || 0), 0);
        const fat = todayMeals.reduce((sum, meal) => sum + (meal.totalNutrition?.fat || meal.totalNutrition?.totalFat || 0), 0);
        const fiber = todayMeals.reduce((sum, meal) => sum + (meal.totalNutrition?.fiber || 0), 0);
        const sugar = todayMeals.reduce((sum, meal) => sum + (meal.totalNutrition?.sugar || 0), 0);
        
        const remaining = Math.max(0, userProfile.targetCalories - consumed);
        const progress = Math.min(100, (consumed / userProfile.targetCalories) * 100);
        
        setTodayData({
          consumed,
          burned: 0, // Would come from workout tracking
          remaining,
          progress,
          meals: todayMeals,
          nutrition: { protein, carbs, fat, fiber, sugar }
        });
      }
    } catch (error) {
      console.error('Error fetching today\'s meals:', error);
      if (error.name === 'AbortError') {
        toast.error('Request timed out. Please check your connection.');
      }
      // Set default data for demonstration
      setTodayData(prev => ({
        ...prev,
        consumed: 328,
        remaining: Math.max(0, userProfile.targetCalories - 328),
        progress: Math.min(100, (328 / userProfile.targetCalories) * 100)
      }));
    }
  };

  const processChartData = (data) => {
    if (timePeriod === 'daily') {
      // Process daily data for the last 7 days
      const dailyData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayData = data.find(d => {
          const dDate = new Date(d.date);
          return dDate.toDateString() === date.toDateString();
        });
        return {
          label: date.toLocaleDateString('en-US', { weekday: 'short' }),
          value: dayData?.consumed || 0,
          target: userProfile.targetCalories
        };
      }).reverse();
      
      setChartData(prev => ({
        ...prev,
        calories: dailyData
      }));
    } else if (timePeriod === 'weekly') {
      // Process weekly data for the last 4 weeks
      const weeklyData = Array.from({ length: 4 }, (_, i) => {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const weekData = data.filter(d => {
          const dDate = new Date(d.weekStart);
          return dDate >= weekStart && dDate <= weekEnd;
        });
        
        const totalCalories = weekData.reduce((sum, d) => sum + (d.avgConsumed || 0), 0);
        const avgCalories = weekData.length > 0 ? totalCalories / weekData.length : 0;
        
        return {
          label: `Week ${4 - i}`,
          value: Math.round(avgCalories),
          target: userProfile.targetCalories
        };
      }).reverse();
      
      setChartData(prev => ({
        ...prev,
        calories: weeklyData
      }));
    } else if (timePeriod === 'monthly') {
      // Process monthly data for the last 6 months
      const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const month = new Date();
        month.setMonth(month.getMonth() - i);
        
        const monthData = data.filter(d => {
          const dDate = new Date(d.month);
          return dDate.getMonth() === month.getMonth() && dDate.getFullYear() === month.getFullYear();
        });
        
        const totalCalories = monthData.reduce((sum, d) => sum + (d.avgConsumed || 0), 0);
        const avgCalories = monthData.length > 0 ? totalCalories / monthData.length : 0;
        
        return {
          label: month.toLocaleDateString('en-US', { month: 'short' }),
          value: Math.round(avgCalories),
          target: userProfile.targetCalories
        };
      }).reverse();
      
      setChartData(prev => ({
        ...prev,
        calories: monthlyData
      }));
    }
  };

  const updateUserProfile = async (updates) => {
    setIsUpdating(true);
    try {
      const newProfile = { ...userProfile, ...updates };
      setUserProfile(newProfile);
      
      // Recalculate target calories
      const newTargetCalories = calculateTargetCalories();
      setUserProfile(prev => ({ ...prev, targetCalories: newTargetCalories }));
      
      // Refresh data
      await fetchCalorieData();
      await fetchTodayMeals();
      
    } catch (error) {
      console.error('Error updating user profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress < 80) return 'text-green-400';
    if (progress < 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getNutritionColor = (type) => {
    switch (type) {
      case 'protein': return 'text-blue-400';
      case 'carbs': return 'text-green-400';
      case 'fat': return 'text-orange-400';
      case 'fiber': return 'text-purple-400';
      case 'sugar': return 'text-pink-400';
      default: return 'text-white';
    }
  };

  const getNutritionIcon = (type) => {
    switch (type) {
      case 'protein': return '🥩';
      case 'carbs': return '🍞';
      case 'fat': return '🥑';
      case 'fiber': return '🥬';
      case 'sugar': return '🍯';
      default: return '🍽️';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-white mt-4">Loading Calorie Tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <SignedIn>
      <div className="min-h-screen text-white p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl">
              <Flame className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Calorie Tracker
              </h1>
              <p className="text-white/60">Track your daily nutrition and achieve your health goals</p>
            </div>
          </div>
          
          {/* Time Period Selector */}
          <div className="flex gap-2 mb-6">
            {['daily', 'weekly', 'monthly'].map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  timePeriod === period
                    ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Today's Progress</h2>
                <button
                  onClick={fetchTodayMeals}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              
              {/* Calorie Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60">Calories Consumed</span>
                  <span className="text-white font-medium">
                    {todayData.consumed} / {userProfile.targetCalories}
                  </span>
                </div>
                <ProgressBar 
                  value={todayData.consumed} 
                  max={userProfile.targetCalories}
                  color="from-green-400 to-emerald-400"
                  size="lg"
                />
                <div className="flex justify-between mt-2 text-sm text-white/60">
                  <span>Remaining: {todayData.remaining} cal</span>
                  <span className={getProgressColor(todayData.progress)}>
                    {todayData.progress.toFixed(1)}% Complete
                  </span>
                </div>
              </div>
              
              {/* Nutrition Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(todayData.nutrition).map(([type, value]) => (
                  <div key={type} className="text-center">
                    <div className="text-2xl mb-1">{getNutritionIcon(type)}</div>
                    <div className={`text-lg font-bold ${getNutritionColor(type)}`}>
                      {Math.round(value)}g
                    </div>
                    <div className="text-xs text-white/60 capitalize">{type}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Calorie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Calorie Trends
                </h2>
                <div className="flex items-center gap-2 text-white/60">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span>Consumed</span>
                  <div className="w-3 h-3 bg-cyan-400 rounded-full ml-4"></div>
                  <span>Target</span>
                </div>
              </div>
              
              <div className="h-80" ref={chartRef}>
                <BarChart
                  data={chartData.calories}
                  target={userProfile.targetCalories}
                  colors={['#f97316', '#06b6d4']}
                  height={320}
                />
              </div>
            </motion.div>

            {/* Nutrition Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Nutrition Distribution</h2>
              <div className="h-80">
                <DoughnutChart
                  data={[
                    { label: 'Protein', value: todayData.nutrition.protein, color: '#3b82f6' },
                    { label: 'Carbs', value: todayData.nutrition.carbs, color: '#10b981' },
                    { label: 'Fat', value: todayData.nutrition.fat, color: '#f59e0b' },
                    { label: 'Fiber', value: todayData.nutrition.fiber, color: '#8b5cf6' },
                    { label: 'Sugar', value: todayData.nutrition.sugar, color: '#ec4899' }
                  ]}
                  height={320}
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* User Profile & Goals */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Your Goals</h3>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-orange-400/20 to-red-500/20 rounded-xl border border-orange-400/30">
                  <div className="text-3xl font-bold text-orange-400">{userProfile.targetCalories}</div>
                  <div className="text-white/60 text-sm">Daily Target Calories</div>
                </div>
              </div>
            </motion.div>

            {/* Today's Meals */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Today's Meals</h3>
              
              <div className="space-y-3">
                {todayData.meals.length > 0 ? (
                  todayData.meals.map((meal, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <div className="text-2xl">
                        {meal.mealType === 'breakfast' && <Coffee />}
                        {meal.mealType === 'lunch' && <Hamburger />}
                        {meal.mealType === 'dinner' && <Pizza />}
                        {meal.mealType === 'snack' && <Apple />}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">
                          {meal.mealItems?.map(item => item.name).join(', ') || 'Meal'}
                        </div>
                        <div className="text-white/60 text-xs capitalize">{meal.mealType}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-orange-400 font-bold text-sm">
                          {Math.round(meal.totalNutrition?.calories || 0)} cal
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-white/60">
                    <Utensils className="text-4xl mx-auto mb-2" />
                    <p>No meals logged today</p>
                    <p className="text-sm">Start tracking your nutrition!</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="text-yellow-400" />
                <h3 className="text-xl font-bold text-white">AI Insights</h3>
              </div>
              
              {aiLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto"></div>
                  <p className="text-white/60 text-sm mt-2">Loading insights...</p>
                </div>
              ) : recommendations && recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.slice(0, 2).map((rec, index) => (
                    <AIRecommendationCard
                      key={index}
                      recommendation={rec}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-white/60">
                  <Zap className="text-2xl mx-auto mb-2" />
                  <p className="text-sm">No AI recommendations available</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </SignedIn>
  );
};

export default CalorieTracker;
