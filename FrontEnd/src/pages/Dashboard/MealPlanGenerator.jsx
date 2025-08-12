import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, 
  Calendar, 
  Target, 
  Clock, 
  Heart, 
  Leaf, 
  Zap, 
  Plus, 
  User, 
  Loader2, 
  Save, 
  Download, 
  Trash2, 
  ExternalLink, 
  Info, 
  CheckCircle, 
  AlertCircle,
  ChefHat,
  Scale,
  Activity,
  Printer,
  MapPin,
  Sun,
  Moon,
  ShoppingCart
} from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';

const MealPlanGenerator = () => {
  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('day');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const timeFrameOptions = [
    { value: 'day', label: '1 Day' },
    { value: 'week', label: '1 Week' }
  ];

  // API URLs
  const API_BASE_URL = 'http://localhost:5000/api';
  const USER_URL = `${API_BASE_URL}/user`;
  const DIET_PLAN_URL = `${API_BASE_URL}/diet-plan`;

  // Add print styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        .no-print { display: none !important; }
        .print-only { display: block !important; }
        .print-break { page-break-before: always; }
        body { background: white !important; color: black !important; }
        .backdrop-blur-xl { background: white !important; border: 1px solid #ccc !important; }
        .text-white { color: black !important; }
        .text-white\\/60 { color: #666 !important; }
        .text-white\\/40 { color: #999 !important; }
        .bg-white\\/5 { background: #f5f5f5 !important; }
        .border-white\\/10 { border-color: #ddd !important; }
        .border-white\\/20 { border-color: #ccc !important; }
      }
      .print-only { display: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (clerkUser) {
      fetchUserData();
    }
  }, [clerkUser]);

  useEffect(() => {
    if (userData?._id) {
      fetchSavedPlans();
    }
  }, [userData?._id]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 5000);
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching user data for clerk ID:', clerkUser.id);
      
      const token = await getToken();
      console.log('🔑 Got Clerk token');
      
      const response = await fetch(`${USER_URL}/${clerkUser.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ User data received:', data);
        setUserData(data);
      } else if (response.status === 404) {
        console.log('❌ User not found in database yet');
        setUserData(null);
      } else {
        const errorText = await response.text();
        console.error('❌ Error response body:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      showNotification('Failed to load user data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedPlans = async () => {
    try {
      if (!userData?._id) return;
      
      console.log('📚 Fetching saved plans for user:', userData._id);
      
      const token = await getToken();
      
      const response = await fetch(`${DIET_PLAN_URL}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Saved plans data:', data);
        setSavedPlans(data || []);
      } else {
        console.error('❌ Failed to fetch saved plans:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching saved plans:', error);
    }
  };

  const generateMealPlan = async () => {
    if (!userData?._id) {
      showNotification('Please complete your profile first', 'error');
      return;
    }
    
    try {
      setGenerating(true);
      console.log('🚀 Starting meal plan generation...');
      
      const requestBody = {
        userId: clerkUser.id,
        timeFrame: selectedTimeFrame
      };
      
      console.log('📤 Request body:', requestBody);
      
      const token = await getToken();
      
      const response = await fetch(`${DIET_PLAN_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Meal plan generated successfully:', data);
        console.log('🔍 Generated plan structure:', data.data);
        console.log('🔍 Plan data structure:', data.data.planData);
        console.log('🍽️ Meals structure:', data.data.planData.meals);
        console.log('📊 Extra meals structure:', data.data.planData.extraMeals);
        console.log('📈 Nutrients:', data.data.planData.nutrients);
        setGeneratedPlan(data.data);
        await fetchSavedPlans();
        showNotification('Meal plan generated successfully!', 'success');
      } else {
        let errorMessage = 'Failed to generate meal plan';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Error generating meal plan:', error);
      let userMessage = 'Failed to generate meal plan';
      
      if (error.message.includes('Failed to fetch')) {
        userMessage = 'Network error: Please check your connection and try again';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        userMessage = 'Authentication error: Please log in again';
      } else if (error.message.includes('500')) {
        userMessage = 'Server error: Please try again later';
      } else {
        userMessage = error.message;
      }
      
      showNotification(userMessage, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const deletePlan = async (planId) => {
    try {
      const token = await getToken();
      
      const response = await fetch(`${DIET_PLAN_URL}/${planId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setSavedPlans(savedPlans.filter(plan => plan._id !== planId));
        if (generatedPlan?._id === planId) {
          setGeneratedPlan(null);
        }
        showNotification('Meal plan deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      showNotification('Failed to delete meal plan', 'error');
    }
  };

  const exportPlan = (plan) => {
    const planData = {
      title: `Diet Plan - ${new Date().toLocaleDateString()}`,
      plan: plan
    };
    
    const blob = new Blob([JSON.stringify(planData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diet-plan-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Diet plan exported successfully', 'success');
  };

  const renderMealCard = (meal, mealType) => {
    // Ensure image URL is properly formatted
    const getImageUrl = (meal) => {
      // If meal has an image URL, use it directly
      if (meal.image) {
        // Handle full URLs
        if (meal.image.startsWith('http')) {
          return meal.image;
        }
        // Handle Spoonacular image paths
        if (meal.image.includes('recipeImages')) {
          return `https://spoonacular.com${meal.image}`;
        }
        // Handle image IDs (like '12345-312x231.jpg')
        if (meal.image.includes('-') && meal.image.includes('x')) {
          return `https://spoonacular.com/recipeImages/${meal.image}`;
        }
      }
      
      // If no image but has ID, construct URL
      if (meal.id) {
        return `https://spoonacular.com/recipeImages/${meal.id}-556x370.jpg`;
      }
      
      // Fallback placeholder
      return `https://via.placeholder.com/312x231/4a5568/ffffff?text=${encodeURIComponent(meal.title || 'Meal')}`;
    };

    const imageUrl = getImageUrl(meal);

    return (
      <div key={meal.id || Math.random()} className="p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="mb-3">
          <div className="w-full h-70 rounded-lg mb-3 overflow-hidden">
          <img 
  src={imageUrl} 
  alt={meal.title} 
  className="w-full h-full object-cover"
  onError={(e) => {
    // Try different image formats if the first one fails
    if (meal.id) {
      const formats = [
        `https://spoonacular.com/recipeImages/${meal.id}-556x370.jpg`,
        `https://spoonacular.com/recipeImages/${meal.id}-312x231.jpg`,
        `https://spoonacular.com/recipeImages/${meal.id}-480x360.jpg`
      ];
      
      // Find the next format to try
      const currentSrc = e.target.src;
      const nextFormat = formats.find(format => format !== currentSrc);
      
      if (nextFormat) {
        e.target.src = nextFormat;
        return;
      }
    }
    
    // Ultimate fallback
    e.target.src = `https://via.placeholder.com/312x231/4a5568/ffffff?text=${encodeURIComponent(meal.title || 'Meal')}`;
  }}
/>
          </div>
          <h5 className="text-white font-medium mb-2">{meal.title}</h5>
          
          {/* Meal Type Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              mealType === 'breakfast' ? 'bg-orange-400/20 text-orange-400' :
              mealType === 'lunch' ? 'bg-green-400/20 text-green-400' :
              mealType === 'dinner' ? 'bg-blue-400/20 text-blue-400' :
              mealType === 'snacks' ? 'bg-purple-400/20 text-purple-400' :
              mealType === 'pre-workout' ? 'bg-yellow-400/20 text-yellow-400' :
              mealType === 'post-workout' ? 'bg-purple-400/20 text-purple-400' :
              'bg-cyan-400/20 text-cyan-400'
            }`}>
              {mealType === 'meal' ? 'Meal' : mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </span>
          </div>

          {/* Preparation Time */}
          {meal.readyInMinutes && (
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <Clock className="w-4 h-4" />
              <span>{meal.readyInMinutes} minutes</span>
            </div>
          )}

          {/* Servings */}
          {meal.servings && (
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <User className="w-4 h-4" />
              <span>{meal.servings} servings</span>
            </div>
          )}

          {/* Nutrition Information */}
          {meal.nutrition && meal.nutrition.nutrients && (
            <div className="mb-3 p-3 bg-cyan-400/10 border border-cyan-400/20 rounded-lg">
              <h6 className="text-cyan-400 text-sm font-medium mb-2">Nutrition (per serving):</h6>
              <div className="grid grid-cols-2 gap-2 text-xs text-cyan-200/80">
                {meal.nutrition.nutrients.slice(0, 6).map((nutrient, index) => {
                  if (['Calories', 'Protein', 'Carbohydrates', 'Fat', 'Fiber', 'Sugar'].includes(nutrient.name)) {
                    return (
                      <div key={index} className="flex justify-between">
                        <span>{nutrient.name}:</span>
                        <span className="text-cyan-400">{nutrient.amount}{nutrient.unit}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <div className="flex-1 p-2 bg-cyan-400/20 text-cyan-400 text-xs rounded-lg text-center flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            {meal.readyInMinutes || 'N/A'} min
          </div>
          {meal.servings && (
            <span className="px-2 py-2 bg-white/10 text-white/60 text-xs rounded-lg">
              {meal.servings} servings
            </span>
          )}
        </div>
        
        {/* Recipe Link */}
        {meal.sourceUrl && (
          <a 
            href={meal.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-3 w-full p-2 bg-purple-400/20 text-purple-400 text-xs rounded-lg text-center hover:bg-purple-400/30 transition-colors flex items-center justify-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            View Recipe
          </a>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading user data...</span>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Profile Not Found</h3>
          <p className="text-white/60">Please complete your profile in the onboarding section first.</p>
          <p className="text-white/40 text-sm mt-2">This includes your age, weight, height, goals, and dietary preferences.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6 no-print">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center">
            <ChefHat className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Diet Plan Generator</h3>
            <p className="text-white/60">Create personalized diet plans using Spoonacular API with curated healthy options</p>
          </div>
        </div>
        
        {/* User Profile Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <User className="w-4 h-4" />
              <span>Age & Gender</span>
            </div>
            <p className="text-white font-semibold">{userData.age} years, {userData.gender}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <Scale className="w-4 h-4" />
              <span>Weight & Height</span>
            </div>
            <p className="text-white font-semibold">
              {userData.weight.value} {userData.weight.unit} / {userData.height.value} {userData.height.unit}
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <Target className="w-4 h-4" />
              <span>Goal</span>
            </div>
            <p className="text-white font-semibold">{userData.goal}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <Activity className="w-4 h-4" />
              <span>Activity Level</span>
            </div>
            <p className="text-white font-semibold">{userData.activityLevel}</p>
          </div>
        </div>

        {/* Additional User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <Heart className="w-4 h-4" />
              <span>Dietary Preference</span>
            </div>
            <p className="text-white font-semibold">{userData.dietaryPreference}</p>
            {userData.allergies && (
              <p className="text-white/60 text-xs mt-1">Allergies: {userData.allergies}</p>
            )}
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <Zap className="w-4 h-4" />
              <span>Target Weight</span>
            </div>
            <p className="text-white font-semibold">{userData.targetWeight} {userData.weight.unit}</p>
            {userData.medicalConditions && (
              <p className="text-white/60 text-xs mt-1">Medical: {userData.medicalConditions}</p>
            )}
          </div>
        </div>
      </div>

      {/* Plan Configuration */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6 no-print">
        <h3 className="text-xl font-bold text-white mb-6">Generate Your Personalized Diet Plan</h3>
        
        {/* Time Frame Selection */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-4">Select your diet plan duration:</h4>
          <div className="flex gap-3">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => setSelectedTimeFrame('day')}
    className="px-6 py-3 rounded-xl border border-cyan-400/50 bg-cyan-400/10 text-cyan-400 transition-all duration-200"
  >
    1 Day
  </motion.button>
</div>
        </div>

        {/* Info Box */}
        <div className="mb-6 p-4 bg-cyan-400/10 border border-cyan-400/20 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-cyan-100">
              <p className="font-medium mb-1">Your diet plan will include:</p>
              <ul className="space-y-1 text-cyan-200/80">
                <li>• Personalized meals from Spoonacular's extensive recipe database</li>
                <li>• Detailed nutritional information for each meal</li>
                <li>• Recipe links with cooking instructions and ingredients</li>
                <li>• Smart shopping list with ingredient priorities</li>
                <li>• Meal prep schedule for efficient planning</li>
                <li>• Calorie-optimized plans based on your goals</li>
                <li>• Dietary preference and allergy considerations</li>
                <li>• High-quality recipe images and preparation times</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateMealPlan}
          disabled={generating}
          className="w-full p-4 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Personalized Diet Plan...
            </>
          ) : (
            <>
              <ChefHat className="w-5 h-5" />
              Generate AI-Powered Diet Plan
            </>
          )}
        </button>
      </div>

      {/* Generated Diet Plan */}
      {generatedPlan && (
        <div className="space-y-6">
          {/* Print Header */}
          <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6 print-only hidden">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">Personalized Diet Plan</h1>
              <p className="text-white/60 text-lg">
                Generated for {userData?.fullName || 'User'} on {new Date().toLocaleDateString()}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-white/60 text-sm">Time Frame</p>
                  <p className="text-white font-bold text-xl">{selectedTimeFrame === 'day' ? '1 Day' : '1 Week'}</p>
                </div>
                <div className="text-center">
                  <p className="text-white/60 text-sm">Generated On</p>
                  <p className="text-white font-bold text-xl">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Summary */}
          <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Your Personalized Diet Plan</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/30 transition-colors"
                  title="Print Plan"
                >
                  <Printer className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => exportPlan(generatedPlan)}
                  className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-cyan-400/30 transition-colors"
                  title="Export Plan"
                >
                  <Download className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => deletePlan(generatedPlan._id)}
                  className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-red-400/30 transition-colors"
                  title="Delete Plan"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Plan Details */}
            <div className="space-y-6">
              
              {/* Plan Summary */}
              {generatedPlan.planData?.planSummary && (
                <div className="p-4 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 border border-cyan-400/20 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-4">Plan Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-white/60 text-sm">Total Calories</p>
                      <p className="text-white font-bold text-xl">{generatedPlan.planData.planSummary.totalCalories}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/60 text-sm">Meal Count</p>
                      <p className="text-white font-bold text-xl">{generatedPlan.planData.planSummary.mealCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/60 text-sm">Goal</p>
                      <p className="text-white font-bold text-xl">{generatedPlan.planData.planSummary.userGoals}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/60 text-sm">Diet Type</p>
                      <p className="text-white font-bold text-xl">{generatedPlan.planData.planSummary.dietaryPreferences}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nutrition Goals */}
              {generatedPlan.planData?.nutrients && (
                <div className="p-4 bg-gradient-to-r from-green-400/10 to-blue-400/10 border border-green-400/20 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-4">Daily Nutrition Goals</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-white/60 text-xs">Protein</p>
                      <p className="text-white font-semibold">{generatedPlan.planData.nutrients.protein}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/60 text-xs">Carbohydrates</p>
                      <p className="text-white font-semibold">{generatedPlan.planData.nutrients.carbohydrates}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/60 text-xs">Fat</p>
                      <p className="text-white font-semibold">{generatedPlan.planData.nutrients.fat}g</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Meals */}
              {generatedPlan.planData?.meals && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Daily Meals</h4>
                  
                  {/* For Daily Plan */}
                  {selectedTimeFrame === 'day' && (
                    <div className="space-y-8">
                      {/* Breakfast */}
                      {generatedPlan.planData.meals.breakfast && generatedPlan.planData.meals.breakfast.length > 0 && (
                        <div className="space-y-4">
                          <h5 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Sun className="w-5 h-5 text-orange-400" />
                            Breakfast
                          </h5>
                          <div className="space-y-4">
                            {generatedPlan.planData.meals.breakfast.map((meal, index) => (
                              <div key={meal.id || index}>
                                {renderMealCard(meal, 'breakfast')}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Lunch */}
                      {generatedPlan.planData.meals.lunch && generatedPlan.planData.meals.lunch.length > 0 && (
                        <div className="space-y-4">
                          <h5 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Sun className="w-5 h-5 text-green-400" />
                            Lunch
                          </h5>
                          <div className="space-y-4">
                            {generatedPlan.planData.meals.lunch.map((meal, index) => (
                              <div key={meal.id || index}>
                                {renderMealCard(meal, 'lunch')}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dinner */}
                      {generatedPlan.planData.meals.dinner && generatedPlan.planData.meals.dinner.length > 0 && (
                        <div className="space-y-4">
                          <h5 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <Moon className="w-5 h-5 text-blue-400" />
                            Dinner
                          </h5>
                          <div className="space-y-4">
                            {generatedPlan.planData.meals.dinner.map((meal, index) => (
                              <div key={meal.id || index}>
                                {renderMealCard(meal, 'dinner')}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* For Weekly Plan */}
                  {selectedTimeFrame === 'week' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {Object.entries(generatedPlan.planData.meals).map(([day, dayMeals]) => (
                        <div key={day} className="border border-white/10 rounded-xl p-6">
                          <h5 className="text-white font-semibold mb-4 text-center text-lg border-b border-white/10 pb-2">
                            {day}
                          </h5>
                          
                          {/* Breakfast */}
                          {dayMeals.breakfast && dayMeals.breakfast.length > 0 && (
                            <div className="mb-4">
                              <h6 className="text-white font-medium mb-3 flex items-center gap-2">
                                <Sun className="w-4 h-4 text-orange-400" />
                                Breakfast
                              </h6>
                              <div className="space-y-3">
                                {dayMeals.breakfast.map((meal, index) => (
                                  <div key={meal.id || index}>
                                    {renderMealCard(meal, 'breakfast')}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Lunch */}
                          {dayMeals.lunch && dayMeals.lunch.length > 0 && (
                            <div className="mb-4">
                              <h6 className="text-white font-medium mb-3 flex items-center gap-2">
                                <Sun className="w-4 h-4 text-green-400" />
                                Lunch
                              </h6>
                              <div className="space-y-3">
                                {dayMeals.lunch.map((meal, index) => (
                                  <div key={meal.id || index}>
                                    {renderMealCard(meal, 'lunch')}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Dinner */}
                          {dayMeals.dinner && dayMeals.dinner.length > 0 && (
                            <div className="mb-4">
                              <h6 className="text-white font-medium mb-3 flex items-center gap-2">
                                <Moon className="w-4 h-4 text-blue-400" />
                                Dinner
                              </h6>
                              <div className="space-y-3">
                                {dayMeals.dinner.map((meal, index) => (
                                  <div key={meal.id || index}>
                                    {renderMealCard(meal, 'dinner')}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Extra Meals */}
              {generatedPlan.planData?.extraMeals && (
                <div className="space-y-6">
                  {/* Snacks */}
                  {generatedPlan.planData.extraMeals.snacks && generatedPlan.planData.extraMeals.snacks.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-400" />
                        Healthy Snacks
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {generatedPlan.planData.extraMeals.snacks.map((snack, index) => (
                          <div key={snack.id || index}>
                            {renderMealCard(snack, 'snacks')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pre-workout */}
                  {generatedPlan.planData.extraMeals.preWorkout && generatedPlan.planData.extraMeals.preWorkout.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Pre-Workout Meals
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {generatedPlan.planData.extraMeals.preWorkout.map((meal, index) => (
                          <div key={meal.id || index}>
                            {renderMealCard(meal, 'pre-workout')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                    
                  {/* Post-workout */}
                  {generatedPlan.planData.extraMeals.postWorkout && generatedPlan.planData.extraMeals.postWorkout.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        Post-Workout Meals
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {generatedPlan.planData.extraMeals.postWorkout.map((meal, index) => (
                          <div key={meal.id || index}>
                            {renderMealCard(meal, 'post-workout')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Shopping List */}
              {generatedPlan.planData?.shoppingList && generatedPlan.planData.shoppingList.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-green-400/10 to-blue-400/10 border border-green-400/20 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-green-400" />
                    Shopping List
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedPlan.planData.shoppingList.map((item, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{item.ingredient}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.priority === 'High' ? 'bg-red-400/20 text-red-400' :
                            item.priority === 'Medium' ? 'bg-yellow-400/20 text-yellow-400' :
                            'bg-green-400/20 text-green-400'
                          }`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-white/60 text-sm">{item.quantity}</p>
                        <p className="text-cyan-400 text-xs">{item.category}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meal Prep Schedule */}
              {generatedPlan.planData?.mealPrepSchedule && (
                <div className="p-4 bg-gradient-to-r from-purple-400/10 to-pink-400/10 border border-purple-400/20 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    Meal Prep Schedule
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(generatedPlan.planData.mealPrepSchedule).map(([day, tasks]) => (
                      <div key={day} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <h5 className="text-white font-medium mb-3 text-center">{day}</h5>
                        <ul className="space-y-2">
                          {tasks.map((task, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-white/80">
                              <span className="text-purple-400">•</span>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Saved Plans */}
      {savedPlans.length > 0 && (
        <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6 no-print">
          <h3 className="text-xl font-bold text-white mb-6">Saved Diet Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPlans.map((plan) => (
              <div key={plan._id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-semibold">{plan.timeFrame === 'day' ? '1 Day' : '1 Week'} Plan</h4>
                  <button
                    onClick={() => deletePlan(plan._id)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-white/60 text-xs mb-3">
                  Created: {new Date(plan.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => setGeneratedPlan(plan)}
                  className="w-full p-2 bg-cyan-400/20 text-cyan-400 text-sm rounded-lg hover:bg-cyan-400/30 transition-colors"
                >
                  View Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="backdrop-blur-xl border border-white/20 rounded-2xl p-6 no-print">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => exportPlan(generatedPlan)}
            disabled={!generatedPlan}
            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Plan
            </h4>
            <p className="text-white/60 text-sm">Download or share your diet plan</p>
          </button>
          <button 
            onClick={() => setGeneratedPlan(null)}
            disabled={!generatedPlan}
            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Plan
            </h4>
            <p className="text-white/60 text-sm">Generate a new diet plan</p>
          </button>
          <button 
            onClick={() => window.print()}
            disabled={!generatedPlan}
            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Print Plan
            </h4>
            <p className="text-white/60 text-sm">Print your diet plan</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealPlanGenerator; 

// without changing anything else remove the select days option but pass the select option 1 day for every diet plan another issue in this images for breakfast lunch and dinner are not showing on the front end i use spoobnacular api whihc implement correclty in teh backend