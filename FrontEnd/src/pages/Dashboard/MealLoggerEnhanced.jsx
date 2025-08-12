import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  Plus, 
  Trash2, 
  ArrowLeft,
  X,
  Upload,
  Flame,
  Utensils,
  Hamburger,
  Pizza,
  Apple,
  Edit3,
  Clock,
  Droplets,
  Leaf,
  Loader2,
  Search
} from "lucide-react";
import AIRecommendationCard from "@/components/custom/AIRecommendationCard";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
const MealLoggerEnhanced = () => {
  const { user } = useUser();
  const { recommendations } = useAIRecommendations();
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [currentStep, setCurrentStep] = useState('mealType');
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectedGroups, setDetectedGroups] = useState([]);
  const [detectedItems, setDetectedItems] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedServing, setSelectedServing] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mealItems, setMealItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todayMeals, setTodayMeals] = useState([]);
  const [nutritionSummary, setNutritionSummary] = useState({
    totalCalories: 0,
    targetCalories: 2000,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  
  // Manual entry states
  const [manualQuantity, setManualQuantity] = useState(1);
  const [manualMealItems, setManualMealItems] = useState([]);
  const [manualMealName, setManualMealName] = useState('');
  
  // Manual entry form states
  const [manualFoodName, setManualFoodName] = useState('');
  const [manualCalories, setManualCalories] = useState('');
  const [manualServingSize, setManualServingSize] = useState('');
  const [manualServingUnit, setManualServingUnit] = useState('serving');
  const [successMessage, setSuccessMessage] = useState('');
  

  
  // Search and filter states
  const [searchFilters, setSearchFilters] = useState({
    mealType: 'all',
    dateRange: 'today',
    minCalories: '',
    maxCalories: '',
    sortBy: 'time'
  });
  
  const fileInputRef = useRef(null);

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: Utensils, color: 'from-orange-400 to-yellow-500' },
    { id: 'lunch', label: 'Lunch', icon: Hamburger, color: 'from-green-400 to-emerald-500' },
    { id: 'dinner', label: 'Dinner', icon: Pizza, color: 'from-purple-400 to-pink-500' },
    { id: 'snack', label: 'Snacks', icon: Apple, color: 'from-cyan-400 to-blue-500' },
  ];

  // Fetch today's meals on component mount
  useEffect(() => {
    fetchTodayMeals();
  }, [user]);

  const fetchTodayMeals = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/meal?userId=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setTodayMeals(data.meals || []);
        
        // Calculate nutrition summary
        const totalCalories = data.meals?.reduce((sum, meal) => sum + (meal.totalNutrition?.calories || 0), 0) || 0;
        const totalProtein = data.meals?.reduce((sum, meal) => sum + (meal.totalNutrition?.protein || 0), 0) || 0;
        const totalCarbs = data.meals?.reduce((sum, meal) => sum + (meal.totalNutrition?.totalCarbs || 0), 0) || 0;
        const totalFat = data.meals?.reduce((sum, meal) => sum + (meal.totalNutrition?.totalFat || 0), 0) || 0;
        
        setNutritionSummary({
          totalCalories,
          targetCalories: 2000,
          protein: totalProtein,
          carbs: totalCarbs,
          fat: totalFat
        });
      }
    } catch (err) {
      console.error('Error fetching meals:', err);
    }
  };

  // Handle image upload and food detection
  const handleImageUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('mealImage', file);
  
      const response = await fetch('http://localhost:5000/api/meal/detect', {
        method: 'POST',
        body: formData
      });
  
      const data = await response.json();
      
      if (response.ok) {
        setSelectedImage(data.imagePath);
        setDetectedItems(data.items || []);
        
        // Extract all unique groups from detected items
        const allGroups = data.items?.map(item => item.group) || [];
        const uniqueGroups = [...new Set(allGroups)];
        
        console.log('All detected groups:', uniqueGroups);
        setDetectedGroups(uniqueGroups);
        setCurrentStep('groupSelection');
      } else {
        setError(data.error || 'Failed to detect food');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };



  // Add manual meal item to the meal
  const addManualMealItem = async () => {
    if (!manualFoodName.trim() || !manualCalories || !manualServingSize || !manualQuantity) {
      setError('Please fill in all required fields');
      return;
    }

    if (!manualMealName.trim()) {
      setError('Please enter a meal name first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Calculate total calories based on serving size and quantity
      const caloriesPerServing = parseFloat(manualCalories);
      const servingSize = parseFloat(manualServingSize);
      const totalCalories = caloriesPerServing * servingSize * manualQuantity;

      // Save the meal item directly to the database
      const response = await fetch('http://localhost:5000/api/meal/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          mealType: selectedMealType,
          foodName: manualFoodName.trim(),
          servingSize: manualServingUnit,
          quantity: manualQuantity,
          group: 'Manual Entry',
          calories: totalCalories
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save meal item');
      }

      // Add to local state for display
      const newItem = {
        name: manualFoodName.trim(),
        group: 'Manual Entry',
        foodId: data.meal._id,
        servingSize: {
          unit: manualServingUnit,
          servingWeight: servingSize
        },
        quantity: manualQuantity,
        nutrients: {
          calories: totalCalories,
          protein: 0,
          totalCarbs: 0,
          totalFat: 0
        }
      };

      setManualMealItems([...manualMealItems, newItem]);
      
      // Reset form fields for next item
      setManualFoodName('');
      setManualCalories('');
      setManualServingSize('');
      setManualServingUnit('serving');
      setManualQuantity(1);
      
      // Show success message
      setSuccessMessage(`${manualFoodName.trim()} added successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Refresh meals to show the new item
      fetchTodayMeals();
      
    } catch (err) {
      setError(err.message || 'Failed to add meal item');
    } finally {
      setIsLoading(false);
    }
  };

  // Close manual meal entry
  const closeManualMeal = () => {
    setShowManualEntry(false);
    resetManualEntry();
  };

  // Add item to meal (for image detection flow)
  const addItemToMeal = () => {
    if (!selectedFood || !selectedServing || !quantity) {
      setError('Please select all required fields');
      return;
    }

    // Calculate calories based on serving size and quantity
    const baseCalories = selectedFood.nutrition?.calories || 0;
    const servingMultiplier = selectedServing.servingWeight || 1;
    const totalCalories = baseCalories * servingMultiplier * quantity;

    const newItem = {
      name: selectedFood.name,
      group: selectedFood.group,
      foodId: selectedFood.food_id,
      score: selectedFood.score,
      servingSize: {
        unit: selectedServing.unit,
        servingWeight: selectedServing.servingWeight
      },
      quantity: quantity,
      nutrients: {
        ...selectedFood.nutrition,
        calories: totalCalories,
        // Scale other nutrients by serving size and quantity
        protein: (selectedFood.nutrition?.protein || 0) * servingMultiplier * quantity,
        totalCarbs: (selectedFood.nutrition?.totalCarbs || 0) * servingMultiplier * quantity,
        totalFat: (selectedFood.nutrition?.totalFat || 0) * servingMultiplier * quantity
      }
    };

    setMealItems([...mealItems, newItem]);
    setSelectedFood(null);
    setSelectedServing(null);
    setQuantity(1);
    setCurrentStep('mealSummary'); // Go to meal summary to review and save
  };

  // Save meal (for image detection flow)
  const saveMeal = async () => {
    if (!mealItems.length) {
      setError('Please add at least one item to the meal');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/meal/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          mealType: selectedMealType,
          mealItems: mealItems,
          imagePath: selectedImage
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setShowAddMeal(false);
        resetMealCreation();
        fetchTodayMeals(); // Refresh meals
      } else {
        setError(data.error || 'Failed to save meal');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset functions
  const resetMealCreation = () => {
    setCurrentStep('mealType');
    setSelectedImage(null);
    setDetectedGroups([]);
    setDetectedItems([]);
    setSelectedGroup(null);
    setSelectedFood(null);
    setSelectedServing(null);
    setQuantity(1);
    setMealItems([]);
    setError(null);
  };

  const resetManualEntry = () => {
    setManualQuantity(1);
    setManualMealItems([]);
    setManualMealName('');
    setManualFoodName('');
    setManualCalories('');
    setManualServingSize('');
    setManualServingUnit('serving');
    setError(null);
    setSuccessMessage('');
  };

  // Calculate total nutrition
  const calculateTotalNutrition = () => {
    return mealItems.reduce((total, item) => {
      const itemNutrition = item.nutrients || {};
      for (let key in itemNutrition) {
        if (typeof itemNutrition[key] === 'number') {
          total[key] = (total[key] || 0) + itemNutrition[key];
        }
      }
      return total;
    }, {});
  };

  // Calculate total nutrition for manual meals
  const calculateManualTotalNutrition = () => {
    return manualMealItems.reduce((total, item) => {
      const itemNutrition = item.nutrients || {};
      for (let key in itemNutrition) {
        if (typeof itemNutrition[key] === 'number') {
          total[key] = (total[key] || 0) + itemNutrition[key];
        }
      }
      return total;
    }, {});
  };

  // Apply filters and sorting to meals
  const getFilteredAndSortedMeals = () => {
    let filteredMeals = [...todayMeals];
    
    // Apply meal type filter
    if (searchFilters.mealType !== 'all') {
      filteredMeals = filteredMeals.filter(meal => meal.mealType === searchFilters.mealType);
    }
    

    
    // Apply date range filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (searchFilters.dateRange) {
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        filteredMeals = filteredMeals.filter(meal => {
          const mealDate = new Date(meal.timestamp);
          return mealDate >= yesterday && mealDate < today;
        });
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        filteredMeals = filteredMeals.filter(meal => {
          const mealDate = new Date(meal.timestamp);
          return mealDate >= weekStart;
        });
        break;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        filteredMeals = filteredMeals.filter(meal => {
          const mealDate = new Date(meal.timestamp);
          return mealDate >= monthStart;
        });
        break;
      default: // today
        filteredMeals = filteredMeals.filter(meal => {
          const mealDate = new Date(meal.timestamp);
          return mealDate >= today;
        });
    }
    
    // Apply calorie filters
    if (searchFilters.minCalories) {
      filteredMeals = filteredMeals.filter(meal => 
        (meal.totalNutrition?.calories || 0) >= parseInt(searchFilters.minCalories)
      );
    }
    
    if (searchFilters.maxCalories) {
      filteredMeals = filteredMeals.filter(meal => 
        (meal.totalNutrition?.calories || 0) <= parseInt(searchFilters.maxCalories)
      );
    }
    
    // Apply sorting
    switch (searchFilters.sortBy) {
      case 'calories':
        filteredMeals.sort((a, b) => (b.totalNutrition?.calories || 0) - (a.totalNutrition?.calories || 0));
        break;
      case 'name':
        filteredMeals.sort((a, b) => {
          const aName = a.mealItems?.map(item => item.name).join(', ') || '';
          const bName = b.mealItems?.map(item => item.name).join(', ') || '';
          return aName.localeCompare(bName);
        });
        break;
      default: // time
        filteredMeals.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    return filteredMeals;
  };

  // Delete meal function
  const deleteMeal = async (mealId) => {
    if (!confirm('Are you sure you want to delete this meal?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/meal/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (response.ok) {
        fetchTodayMeals(); // Refresh meals
      } else {
        setError('Failed to delete meal');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  return (
    <SignedIn>
      <>
        {/* Header with Action Buttons */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">Meal Logger</h2>
            <p className="text-white/60">Track your daily meals and nutrition</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddMeal(true)}
            className="p-4 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 whitespace-nowrap upload-btn"
          >
            <Camera className="inline mr-2" />
            Take Photo
          </motion.button>
        </div>

        {/* Nutrition Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-400/20 to-red-400/20 border border-orange-400/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="text-orange-400" />
              <span className="text-white font-medium">Calories</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {Math.round(nutritionSummary.totalCalories)}
            </div>
            <div className="text-white/60 text-sm">
              / {nutritionSummary.targetCalories} cal
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 border border-blue-400/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="text-blue-400" />
              <span className="text-white font-medium">Protein</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {nutritionSummary.protein.toFixed(1)}g
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 border border-green-400/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="text-green-400" />
              <span className="text-white font-medium">Carbs</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {nutritionSummary.carbs.toFixed(1)}g
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="text-yellow-400" />
              <span className="text-white font-medium">Fat</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {nutritionSummary.fat.toFixed(1)}g
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Leaf className="text-green-400" />
                AI Nutrition Tips
              </h3>
              {recommendations?.mealLog ? (
                <AIRecommendationCard
                  title="Meal & Nutrition"
                  recommendation={recommendations.mealLog}
                  feature="mealLog"
                  userId={user?.id}
                />
              ) : (
                <div className="text-center py-4">
                  <p className="text-white/60 mb-2">No AI recommendations available yet.</p>
                  <p className="text-white/40 text-sm">Complete your onboarding to get personalized AI recommendations.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Meal List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              {/* Professional Search and Filters */}
              <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Search className="text-cyan-400" />
                  Search & Filters
                </h3>
                


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Meal Type Filter */}
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Meal Type</label>
                    <select
                      value={searchFilters.mealType}
                      onChange={(e) => setSearchFilters({...searchFilters, mealType: e.target.value})}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                    >
                      <option value="all">All Types</option>
                      {mealTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Date Range</label>
                    <select
                      value={searchFilters.dateRange}
                      onChange={(e) => setSearchFilters({...searchFilters, dateRange: e.target.value})}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-400"
                    >
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                  
                  {/* Min Calories Filter */}
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Min Calories</label>
                    <input
                      type="number"
                      placeholder="Min"
                      value={searchFilters.minCalories}
                      onChange={(e) => setSearchFilters({...searchFilters, minCalories: e.target.value})}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  
                  {/* Max Calories Filter */}
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Max Calories</label>
                    <input
                      type="number"
                      placeholder="Max"
                      value={searchFilters.maxCalories}
                      onChange={(e) => setSearchFilters({...searchFilters, maxCalories: e.target.value})}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
                
                {/* Sort Options */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <label className="text-white/80 text-sm">Sort by:</label>
                    <div className="flex gap-2">
                      {[
                        { value: 'time', label: 'Time' },
                        { value: 'calories', label: 'Calories' },
                        { value: 'name', label: 'Name' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => setSearchFilters({...searchFilters, sortBy: option.value})}
                          className={`px-3 py-1 rounded-lg text-sm transition-all ${
                            searchFilters.sortBy === option.value
                              ? 'bg-cyan-400 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Clear Filters Button */}
                  <button
                    onClick={() => setSearchFilters({
                      mealType: 'all',
                      dateRange: 'today',
                      minCalories: '',
                      maxCalories: '',
                      sortBy: 'time'
                    })}
                    className="px-4 py-2 bg-white/10 text-white/70 hover:bg-white/20 rounded-lg text-sm transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                {mealTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMealType(type.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl transition-all duration-200 meal-type-btn ${
                      selectedMealType === type.id
                        ? 'bg-gradient-to-r ' + type.color + ' text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <type.icon />
                    <span className="font-medium">{type.label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Results Count and Active Filters */}
              <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between text-white/80 text-sm mb-2">
                  <span>
                    Showing {getFilteredAndSortedMeals().filter(meal => meal.mealType === selectedMealType).length} meals
                    {searchFilters.mealType !== 'all' && ` for ${mealTypes.find(t => t.id === selectedMealType)?.label}`}
                  </span>
                  <span>
                    Total: {getFilteredAndSortedMeals().length} meals
                  </span>
                </div>
                
                {/* Active Filters Display */}
                {(searchFilters.dateRange !== 'today' || searchFilters.minCalories || searchFilters.maxCalories || searchFilters.sortBy !== 'time') && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="text-white/60">Active filters:</span>
                    {searchFilters.dateRange !== 'today' && (
                      <span className="px-2 py-1 bg-blue-400/20 text-blue-300 rounded-full">
                        {searchFilters.dateRange.charAt(0).toUpperCase() + searchFilters.dateRange.slice(1)}
                      </span>
                    )}
                    {searchFilters.minCalories && (
                      <span className="px-1 bg-green-400/20 text-green-300 rounded-full">
                        Min: {searchFilters.minCalories} cal
                      </span>
                    )}
                    {searchFilters.maxCalories && (
                      <span className="px-2 py-1 bg-orange-400/20 text-orange-300 rounded-full">
                        Max: {searchFilters.maxCalories} cal
                      </span>
                    )}
                    {searchFilters.sortBy !== 'time' && (
                      <span className="px-2 py-1 bg-purple-400/20 text-purple-300 rounded-full">
                        Sorted by: {searchFilters.sortBy.charAt(0).toUpperCase() + searchFilters.sortBy.slice(1)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {getFilteredAndSortedMeals()
                  .filter(meal => meal.mealType === selectedMealType)
                  .map((meal, index) => (
                    <motion.div
                      key={meal._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-2xl">🍽️</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-medium text-white">
                                {meal.mealName || meal.mealItems?.map(item => item.name).join(', ') || 'Meal'}
                              </h3>
                              <span className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full">
                                {mealTypes.find(t => t.id === meal.mealType)?.label}
                              </span>
                            </div>
                            <p className="text-white/60 text-sm mb-2">
                              {new Date(meal.timestamp).toLocaleDateString()} at {new Date(meal.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            {/* Show individual meal items */}
                            {meal.mealItems && meal.mealItems.length > 0 && (
                              <div className="space-y-1">
                                {meal.mealItems.map((item, itemIndex) => (
                                  <div key={itemIndex} className="text-xs text-white/70 flex items-center gap-2 bg-white/5 p-2 rounded">
                                    <span className="text-cyan-400">•</span>
                                    <span className="flex-1">{item.name}</span>
                                    <span className="text-cyan-400">
                                      {item.quantity}x {item.servingSize?.unit || 'serving'}
                                    </span>
                                    <span className="text-orange-400 font-medium">
                                      {Math.round(item.nutrients?.calories || 0)} cal
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <div className="font-bold text-white text-lg">
                            {Math.round(meal.totalNutrition?.calories || 0)} cal
                          </div>
                          <div className="text-white/60 text-xs">
                            P: {(meal.totalNutrition?.protein || 0).toFixed(1)}g |
                            C: {(meal.totalNutrition?.totalCarbs || 0).toFixed(1)}g |
                            F: {(meal.totalNutrition?.totalFat || 0).toFixed(1)}g
                          </div>
                          <button
                            onClick={() => deleteMeal(meal._id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all"
                            title="Delete meal"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                {getFilteredAndSortedMeals().filter(meal => meal.mealType === selectedMealType).length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    <Utensils className="text-4xl mx-auto mb-4" />
                    <p>No {selectedMealType} meals found</p>
                    <p className="text-sm">
                      {getFilteredAndSortedMeals().length === 0 
                        ? 'Try adjusting your filters or add some meals' 
                        : 'No meals of this type in the selected date range'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowAddMeal(true)}
                  className="w-full p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
                >
                  <Camera className="inline mr-2" />
                  Take Photo
                </button>
                <button 
                  onClick={() => setShowManualEntry(true)}
                  className="w-full p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
                >
                  <Edit3 className="inline mr-2" />
                  Manual Entry
                </button>
              </div>
            </div> */}
          </motion.div>
        </div>

        {/* Manual Entry Modal */}
        <AnimatePresence>
          {showManualEntry && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                          <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Manual Meal Entry</h2>
                  <button
                    onClick={() => {
                      setShowManualEntry(false);
                      resetManualEntry();
                    }}
                    className="text-white/60 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
                    {error}
                  </div>
                )}

                {/* Success Message Display */}
                {successMessage && (
                  <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300">
                    {successMessage}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Meal Name Input */}
                  <div>
                    <label className="block text-white font-medium mb-2">Meal Name *</label>
                    <input
                      type="text"
                      placeholder="Enter meal name (e.g., 'Grilled Chicken Salad')"
                      value={manualMealName}
                      onChange={(e) => setManualMealName(e.target.value)}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-cyan-400"
                    />
                    <p className="text-white/60 text-xs mt-1">* Required to add food items</p>
                  </div>

                  {/* Meal Type Selection */}
                  <div>
                    <label className="block text-white font-medium mb-2">Meal Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {mealTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedMealType(type.id)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            selectedMealType === type.id
                              ? 'border-cyan-400 bg-gradient-to-r ' + type.color
                              : 'border-white/20 bg-white/5 hover:border-white/40'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <type.icon />
                            <span className="text-white font-medium">{type.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Food Entry Form */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white font-medium mb-4">Add Food Item</h4>
                    <p className="text-white/60 text-sm mb-4">
                      Fill in the details below to add a food item to your meal. You can add multiple items before saving.
                    </p>
                    
                    {/* Food Name Input */}
                    <div className="mb-4">
                      <label className="block text-white/80 text-sm mb-2">Food Name</label>
                      <input
                        type="text"
                        placeholder="Enter food name (e.g., 'Grilled Chicken Breast')"
                        value={manualFoodName}
                        onChange={(e) => setManualFoodName(e.target.value)}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Calories Input */}
                    <div className="mb-4">
                      <label className="block text-white/80 text-sm mb-2">Calories per Serving</label>
                      <input
                        type="number"
                        placeholder="Enter calories (e.g., 165)"
                        value={manualCalories}
                        onChange={(e) => setManualCalories(e.target.value)}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Serving Size Inputs */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Serving Size</label>
                        <input
                          type="number"
                          placeholder="1"
                          value={manualServingSize}
                          onChange={(e) => setManualServingSize(e.target.value)}
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-2">Unit</label>
                        <select
                          value={manualServingUnit}
                          onChange={(e) => setManualServingUnit(e.target.value)}
                          className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400"
                        >
                          <option value="serving">serving</option>
                          <option value="cup">cup</option>
                          <option value="tbsp">tbsp</option>
                          <option value="tsp">tsp</option>
                          <option value="piece">piece</option>
                          <option value="slice">slice</option>
                          <option value="gram">gram</option>
                          <option value="ounce">ounce</option>
                        </select>
                      </div>
                    </div>

                    {/* Quantity Input */}
                    <div className="mb-4">
                      <label className="block text-white/80 text-sm mb-2">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={manualQuantity}
                        onChange={(e) => setManualQuantity(parseInt(e.target.value) || 1)}
                        className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white text-center focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    {/* Add to Meal Button */}
                    <button
                      onClick={addManualMealItem}
                      disabled={!manualFoodName.trim() || !manualCalories || !manualServingSize || !manualQuantity || !manualMealName.trim()}
                      className="w-full p-3 bg-cyan-400 text-white rounded-xl font-medium hover:bg-cyan-500 transition-all disabled:opacity-50"
                    >
                      Add to Meal
                    </button>
                  </div>
                </div>

                {/* Current Meal Summary */}
                {manualMealItems.length > 0 && (
                  <div className="bg-gradient-to-br from-cyan-400/10 to-purple-400/10 rounded-xl p-4 border border-cyan-400/20 mb-6">
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <span className="text-cyan-400">✓</span>
                      Current Meal Progress
                    </h4>
                    <div className="text-white/80 text-sm">
                      <p>Meal Name: <span className="text-white font-medium">{manualMealName || 'Not set'}</span></p>
                      <p>Meal Type: <span className="text-white font-medium">{mealTypes.find(t => t.id === selectedMealType)?.label}</span></p>
                      <p>Items Added: <span className="text-white font-medium">{manualMealItems.length}</span></p>
                      <p>Total Calories: <span className="text-white font-medium">{Math.round(calculateManualTotalNutrition().calories || 0)} cal</span></p>
                    </div>
                  </div>
                )}

                {/* Manual Meal Items Summary */}
                {manualMealItems.length > 0 && (
                  <div className="mt-6 p-4 bg-white/5 rounded-xl">
                    <h4 className="text-white font-medium mb-3">Current Meal Items:</h4>
                    <div className="space-y-2">
                      {manualMealItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex-1">
                            <div className="text-white font-medium">{item.name}</div>
                            <div className="text-white/60 text-sm">
                              {item.quantity}x {item.servingSize.servingWeight} {item.servingSize.unit}
                            </div>
                            <div className="text-cyan-400 text-xs mt-1">
                              {Math.round(item.nutrients?.calories / item.quantity)} cal per {item.servingSize.unit}
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <div className="text-white font-bold text-lg">
                              {Math.round(item.nutrients?.calories || 0)} cal
                            </div>
                            <button
                              onClick={() => setManualMealItems(manualMealItems.filter((_, i) => i !== index))}
                              className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400/10 rounded-lg transition-all"
                              title="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="flex items-center justify-between text-white font-medium">
                        <span>Total Calories:</span>
                        <span>{Math.round(calculateManualTotalNutrition().calories || 0)} cal</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => {
                          // Reset form fields to add more items
                          setManualFoodName('');
                          setManualCalories('');
                          setManualServingSize('');
                          setManualServingUnit('serving');
                          setManualQuantity(1);
                          setError(null);
                        }}
                        className="flex-1 p-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all"
                      >
                        Add More Meal
                      </button>
                      <button
                        onClick={closeManualMeal}
                        className="flex-1 p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}


              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Meal Modal (Image Detection Flow) */}
        <AnimatePresence>
          {showAddMeal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Add New Meal</h2>
                  <button
                    onClick={() => {
                      setShowAddMeal(false);
                      resetMealCreation();
                    }}
                    className="text-white/60 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
                    {error}
                  </div>
                )}

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  {/* Step 1: Meal Type Selection */}
                  {currentStep === 'mealType' && (
                    <motion.div
                      key="mealType"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-white text-center">Select Meal Type</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {mealTypes.map((type) => (
                          <motion.button
                            key={type.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedMealType(type.id);
                              setCurrentStep('imageUpload');
                            }}
                            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                              selectedMealType === type.id
                                ? 'border-cyan-400 bg-gradient-to-r ' + type.color
                                : 'border-white/20 bg-white/5 hover:border-white/40'
                            }`}
                          >
                            <type.icon className="text-3xl mb-3 mx-auto" />
                            <div className="text-center font-medium text-white">{type.label}</div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Image Upload */}
                  {currentStep === 'imageUpload' && (
                    <motion.div
                      key="imageUpload"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-semibold text-white text-center">Upload Food Image</h3>
                      
                      <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleImageUpload(file);
                          }}
                          className="hidden"
                        />
                        
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isLoading}
                          className="w-full p-8 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                        >
                          {isLoading ? (
                            <div className="space-y-4">
                              <Loader2 className="text-4xl mx-auto animate-spin text-cyan-400" />
                              <p className="text-white">Analyzing image...</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <Upload className="text-4xl mx-auto text-cyan-400" />
                              <p className="text-white">Click to upload or drag image here</p>
                              <p className="text-white/60 text-sm">Supports JPG, PNG, GIF</p>
                            </div>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Group Selection */}
                  {currentStep === 'groupSelection' && (
  <motion.div
    key="groupSelection"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <h3 className="text-xl font-semibold text-white text-center">Select Food Group</h3>
    
    {selectedImage && (
      <div className="text-center mb-6">
        <img 
          src={`http://localhost:5000${selectedImage}`} 
          alt="Uploaded food" 
          className="w-32 h-32 object-cover rounded-xl mx-auto"
        />
      </div>
    )}
    
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {detectedGroups.map((group, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSelectedGroup(group);
            setCurrentStep('foodSelection');
          }}
          className="p-4 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-all"
        >
          <div className="text-center font-medium text-white">{group}</div>
          <div className="text-white/60 text-xs mt-1">
            {detectedItems.filter(item => item.group === group).length} items
          </div>
        </motion.button>
      ))}
    </div>
  </motion.div>
)}

                  {/* Step 4: Food Selection */}
                  {currentStep === 'foodSelection' && (
                    <motion.div
                      key="foodSelection"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <button
                          onClick={() => setCurrentStep('groupSelection')}
                          className="text-white/60 hover:text-white"
                        >
                          <ArrowLeft />
                        </button>
                        <h3 className="text-xl font-semibold text-white">Select Food from {selectedGroup}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                        {detectedItems
                          .filter(item => item.group === selectedGroup)
                          .map((item, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => {
                                setSelectedFood(item);
                                setCurrentStep('servingSelection');
                              }}
                              className="p-4 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-all text-left"
                            >
                              <div className="font-medium text-white">{item.name}</div>
                              <div className="text-white/60 text-sm">
                                Score: {item.score}% | {Math.round(item.nutrition?.calories || 0)} cal
                              </div>
                            </motion.button>
                          ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 5: Serving Selection */}
                  {currentStep === 'servingSelection' && selectedFood && (
                    <motion.div
                      key="servingSelection"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <button
                          onClick={() => setCurrentStep('foodSelection')}
                          className="text-white/60 hover:text-white"
                        >
                          <ArrowLeft />
                        </button>
                        <h3 className="text-xl font-semibold text-white">Select Serving Size</h3>
                      </div>
                      
                      <div className="bg-white/5 rounded-xl p-4 mb-6">
                        <h4 className="text-white font-medium mb-2">{selectedFood.name}</h4>
                        <p className="text-white/60 text-sm">{selectedFood.group}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {selectedFood.servingSizes?.map((serving, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedServing(serving)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              selectedServing?.unit === serving.unit
                                ? 'border-cyan-400 bg-cyan-400/20'
                                : 'border-white/20 bg-white/5 hover:border-white/40'
                            }`}
                          >
                            <div className="text-center">
                              <div className="font-medium text-white">{serving.unit}</div>
                              <div className="text-white/60 text-sm">
                                {Math.round(serving.servingWeight * 100)}g
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <label className="text-white">Quantity:</label>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          className="w-20 p-2 bg-white/10 border border-white/20 rounded-lg text-white text-center"
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <button
                          onClick={addItemToMeal}
                          className="flex-1 p-3 bg-cyan-400 text-white rounded-xl font-medium hover:bg-cyan-500 transition-all"
                        >
                          Add to Meal
                        </button>
                        <button
                          onClick={() => setCurrentStep('mealType')}
                          className="flex-1 p-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all"
                        >
                          Add More Items
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 6: Meal Summary and Save */}
                  {currentStep === 'mealSummary' && (
                    <motion.div
                      key="mealSummary"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <button
                          onClick={() => setCurrentStep('servingSelection')}
                          className="text-white/60 hover:text-white"
                        >
                          <ArrowLeft />
                        </button>
                        <h3 className="text-xl font-semibold text-white">Review and Save Meal</h3>
                      </div>
                      
                      <div className="bg-white/5 rounded-xl p-4">
                        <h4 className="text-white font-medium mb-3">Meal Summary:</h4>
                        <div className="space-y-2">
                          {mealItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                              <div>
                                <div className="text-white font-medium">{item.name}</div>
                                <div className="text-white/60 text-sm">
                                  {item.quantity}x {item.servingSize.unit}
                                </div>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                <div className="text-white font-medium">
                                  {Math.round(item.nutrients?.calories || 0)} cal
                                </div>
                                <button
                                  onClick={() => setMealItems(mealItems.filter((_, i) => i !== index))}
                                  className="text-red-400 hover:text-red-300 p-1 hover:bg-red-400/10 rounded"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-white/20">
                          <div className="flex items-center justify-between text-white font-medium">
                            <span>Total Calories:</span>
                            <span>{Math.round(calculateTotalNutrition().calories || 0)} cal</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <button
                          onClick={() => setCurrentStep('mealType')}
                          className="flex-1 p-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all"
                        >
                          Add More Meal
                        </button>
                        <button
                          onClick={saveMeal}
                          disabled={isLoading}
                          className="flex-1 p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Save Meal'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Meal Items Summary */}
                {mealItems.length > 0 && (
                  <div className="mt-6 p-4 bg-white/5 rounded-xl">
                    <h4 className="text-white font-medium mb-3">Current Meal Items:</h4>
                    <div className="space-y-2">
                      {mealItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-white font-medium">{item.name}</div>
                            <div className="text-white/60 text-sm">
                              {item.quantity}x {item.servingSize.unit}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-medium">
                              {Math.round(item.nutrients?.calories * item.quantity || 0)} cal
                            </div>
                            <button
                              onClick={() => setMealItems(mealItems.filter((_, i) => i !== index))}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="flex items-center justify-between text-white font-medium">
                        <span>Total Calories:</span>
                        <span>{Math.round(calculateTotalNutrition().calories || 0)} cal</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={saveMeal}
                      disabled={isLoading}
                      className="w-full mt-4 p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Save Meal'}
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </SignedIn>
  );
};

export default MealLoggerEnhanced;