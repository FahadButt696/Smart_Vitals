import { SignedIn, useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { 
  FaCamera, 
  FaPlus, 
  FaTrash, 
  FaArrowLeft,
  FaTimes,
  FaUpload,
  FaFire,
  FaBreadSlice,
  FaHamburger,
  FaPizzaSlice,
  FaAppleAlt,
  FaSearch,
  FaEdit,
  FaClock,
  FaTint,
  FaLeaf,
  FaUtensils,
  FaSpinner
} from "react-icons/fa";
import DashboardLayout from "../../components/custom/DashboardLayout.jsx";

const MealLoggerEnhanced = () => {
  const { user } = useUser();
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedManualFood, setSelectedManualFood] = useState(null);
  const [manualServingSizes, setManualServingSizes] = useState([]);
  const [selectedManualServing, setSelectedManualServing] = useState(null);
  const [manualQuantity, setManualQuantity] = useState(1);
  
  const fileInputRef = useRef(null);

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: FaBreadSlice, color: 'from-orange-400 to-yellow-500' },
    { id: 'lunch', label: 'Lunch', icon: FaHamburger, color: 'from-green-400 to-emerald-500' },
    { id: 'dinner', label: 'Dinner', icon: FaPizzaSlice, color: 'from-purple-400 to-pink-500' },
    { id: 'snack', label: 'Snacks', icon: FaAppleAlt, color: 'from-cyan-400 to-blue-500' },
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
        
        // Extract unique groups from all detected items
        const groups = [...new Set(data.items.map(item => item.group))];
        setDetectedGroups(groups);
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

  // Search foods for manual entry
  const searchFoods = async (query) => {
    console.log('Searching for:', query);
    if (!query || query.trim().length < 2) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:5000/api/meal/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      console.log('Search response:', data);
      
      if (response.ok) {
        setSearchResults(data.foods || []);
      } else {
        setError(data.error || 'Failed to search foods');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Network error occurred');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle manual food selection
  const handleManualFoodSelect = async (food) => {
    setSelectedManualFood(food);
    setSelectedManualServing(null);
    setManualQuantity(1);
    
    // Get serving sizes for the selected food
    try {
      const response = await fetch(`http://localhost:5000/api/meal/search?query=${encodeURIComponent(food.name)}`);
      const data = await response.json();
      
      if (response.ok && data.foods?.length > 0) {
        const selectedFood = data.foods.find(f => f.food_id === food.food_id) || data.foods[0];
        // Mock serving sizes since the search API doesn't return them
        setManualServingSizes([
          { unit: "1 serving", serving_weight: 1 },
          { unit: "100g", serving_weight: 0.1 },
          { unit: "1 cup", serving_weight: 0.25 },
          { unit: "1 tbsp", serving_weight: 0.015 },
          { unit: "1 tsp", serving_weight: 0.005 }
        ]);
      }
    } catch (err) {
      console.error('Error fetching serving sizes:', err);
      // Set default serving sizes
      setManualServingSizes([
        { unit: "1 serving", serving_weight: 1 },
        { unit: "100g", serving_weight: 0.1 },
        { unit: "1 cup", serving_weight: 0.25 },
        { unit: "1 tbsp", serving_weight: 0.015 },
        { unit: "1 tsp", serving_weight: 0.005 }
      ]);
    }
  };

  // Add manual meal
  const addManualMeal = async () => {
    console.log('Adding manual meal:', {
      selectedManualFood,
      selectedManualServing,
      manualQuantity,
      selectedMealType
    });
    
    if (!selectedManualFood || !selectedManualServing || !manualQuantity) {
      setError('Please select all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestBody = {
        userId: user.id,
        mealType: selectedMealType,
        foodName: selectedManualFood.name,
        servingSize: selectedManualServing.unit,
        quantity: manualQuantity,
        group: selectedManualFood.group || 'Other'
      };
      
      console.log('Sending request:', requestBody);
      
      const response = await fetch('http://localhost:5000/api/meal/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('Response:', data);
      
      if (response.ok) {
        setShowManualEntry(false);
        resetManualEntry();
        fetchTodayMeals(); // Refresh meals
      } else {
        setError(data.error || 'Failed to add meal');
      }
    } catch (err) {
      console.error('Error adding manual meal:', err);
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to meal (for image detection flow)
  const addItemToMeal = () => {
    if (!selectedFood || !selectedServing || !quantity) {
      setError('Please select all required fields');
      return;
    }

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
      nutrients: selectedFood.nutrition
    };

    setMealItems([...mealItems, newItem]);
    setSelectedFood(null);
    setSelectedServing(null);
    setQuantity(1);
    setCurrentStep('mealType'); // Go back to add more items
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
    setSearchQuery('');
    setSearchResults([]);
    setSelectedManualFood(null);
    setManualServingSizes([]);
    setSelectedManualServing(null);
    setManualQuantity(1);
    setError(null);
  };

  // Calculate total nutrition
  const calculateTotalNutrition = () => {
    return mealItems.reduce((total, item) => {
      const itemNutrition = item.nutrients || {};
      for (let key in itemNutrition) {
        if (typeof itemNutrition[key] === 'number') {
          total[key] = (total[key] || 0) + (itemNutrition[key] * item.quantity);
        }
      }
      return total;
    }, {});
  };

  return (
    <SignedIn>
      <DashboardLayout
        title="Meal Logger"
        subtitle="Track your meals and nutrition with AI-powered recognition"
      >
        {/* Header with Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for foods to add manually..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchFoods(searchQuery)}
                className="w-full p-4 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-cyan-400 transition-all"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
              <button
                onClick={() => searchFoods(searchQuery)}
                disabled={isSearching}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white disabled:opacity-50"
              >
                {isSearching ? <FaSpinner className="animate-spin" /> : 'Search'}
              </button>
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white/5 rounded-xl p-4 max-h-60 overflow-y-auto">
                <h4 className="text-white font-medium mb-2">Search Results:</h4>
                <div className="space-y-2">
                                       {searchResults.slice(0, 5).map((food, index) => (
                       <button
                         key={index}
                         onClick={() => {
                           handleManualFoodSelect(food);
                           setSearchResults([]);
                           setSearchQuery(food.name);
                           setShowManualEntry(true);
                         }}
                         className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all"
                       >
                         <div className="font-medium">{food.name}</div>
                         <div className="text-sm text-white/60">{food.group || 'Other'}</div>
                       </button>
                     ))}
                </div>
              </div>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddMeal(true)}
            className="p-4 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 whitespace-nowrap upload-btn"
          >
            <FaCamera className="inline mr-2" />
            Take Photo
          </motion.button>
        </div>

        {/* Nutrition Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-400/20 to-red-400/20 border border-orange-400/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaFire className="text-orange-400" />
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
              <FaLeaf className="text-blue-400" />
              <span className="text-white font-medium">Protein</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {nutritionSummary.protein.toFixed(1)}g
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-400/20 to-emerald-400/20 border border-green-400/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaBreadSlice className="text-green-400" />
              <span className="text-white font-medium">Carbs</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {nutritionSummary.carbs.toFixed(1)}g
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FaTint className="text-yellow-400" />
              <span className="text-white font-medium">Fat</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {nutritionSummary.fat.toFixed(1)}g
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Meal List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
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

              <div className="space-y-4">
                {todayMeals
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
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🍽️</span>
                          <div>
                            <h3 className="font-medium text-white">
                              {meal.mealItems?.map(item => item.name).join(', ') || 'Meal'}
                            </h3>
                            <p className="text-white/60 text-sm">
                              {new Date(meal.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">
                            {Math.round(meal.totalNutrition?.calories || 0)} cal
                          </div>
                          <div className="text-white/60 text-xs">
                            P: {(meal.totalNutrition?.protein || 0).toFixed(1)}g |
                            C: {(meal.totalNutrition?.totalCarbs || 0).toFixed(1)}g |
                            F: {(meal.totalNutrition?.totalFat || 0).toFixed(1)}g
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                {todayMeals.filter(meal => meal.mealType === selectedMealType).length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    <FaUtensils className="text-4xl mx-auto mb-4" />
                    <p>No {selectedMealType} meals logged today</p>
                    <p className="text-sm">Search for foods or take a photo to get started</p>
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
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowAddMeal(true)}
                  className="w-full p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
                >
                  <FaCamera className="inline mr-2" />
                  Take Photo
                </button>
                <button 
                  onClick={() => setShowManualEntry(true)}
                  className="w-full p-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
                >
                  <FaEdit className="inline mr-2" />
                  Manual Entry
                </button>
              </div>
            </div>
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
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 w-full max-w-2xl"
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
                    <FaTimes size={24} />
                  </button>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
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

                  {/* Food Selection */}
                  {selectedManualFood && (
                    <div className="bg-white/5 rounded-xl p-4">
                      <h4 className="text-white font-medium mb-2">Selected Food:</h4>
                      <div className="text-white">{selectedManualFood.name}</div>
                      <div className="text-white/60 text-sm">{selectedManualFood.group || 'Other'}</div>
                    </div>
                  )}

                  {/* Serving Size Selection */}
                  {manualServingSizes.length > 0 && (
                    <div>
                      <label className="block text-white font-medium mb-2">Serving Size</label>
                      <div className="grid grid-cols-2 gap-3">
                        {manualServingSizes.slice(0, 6).map((serving, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedManualServing(serving)}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              selectedManualServing?.unit === serving.unit
                                ? 'border-cyan-400 bg-cyan-400/20'
                                : 'border-white/20 bg-white/5 hover:border-white/40'
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-white font-medium">{serving.unit}</div>
                              <div className="text-white/60 text-sm">
                                {Math.round((serving.serving_weight || 1) * 100)}g
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <label className="block text-white font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={manualQuantity}
                      onChange={(e) => setManualQuantity(parseInt(e.target.value) || 1)}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white text-center"
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={addManualMeal}
                    disabled={isLoading || !selectedManualFood || !selectedManualServing}
                    className="w-full p-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Add Meal'}
                  </button>
                </div>
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
                    <FaTimes size={24} />
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
                              <FaSpinner className="text-4xl mx-auto animate-spin text-cyan-400" />
                              <p className="text-white">Analyzing image...</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <FaUpload className="text-4xl mx-auto text-cyan-400" />
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
                          <FaArrowLeft />
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
                          <FaArrowLeft />
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
                              <FaTrash size={14} />
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
                      {isLoading ? <FaSpinner className="animate-spin mx-auto" /> : 'Save Meal'}
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DashboardLayout>
    </SignedIn>
  );
};

export default MealLoggerEnhanced;
