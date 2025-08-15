import { SignedIn, useUser, useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import AIRecommendationCard from "@/components/custom/AIRecommendationCard";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";
import { 
  Dumbbell,
  Plus,
  Play,
  Check,
  X,
  Trash2,
  Edit3,
  Clock,
  Flame,
  Weight,
  Search,
  Loader2,
  Database,
  UserPlus,
  Filter,
  ArrowUpDown,
  Eye,
  Copy,
  Star,
  TrendingUp,
  Calendar,
  MapPin,
  Heart,
  Trophy,
  History,
  Bookmark,
  ArrowDown,
  ArrowUp,
  Expand,
  Minimize,
  EyeOff,
  Share2,
  Download,
  Upload,
  Settings,
  Info,
  Lightbulb,
  Target,
  Activity,
  Baby,
  Dumbbell as Strength
} from "lucide-react";


const API_BASE_URL = 'http://localhost:5000/api';

const WorkoutTracker = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { recommendations } = useAIRecommendations();
  const [workouts, setWorkouts] = useState([]);
  const [exerciseDatabase, setExerciseDatabase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showDatabaseModal, setShowDatabaseModal] = useState(false);
  const [activeTab, setActiveTab] = useState('workouts');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentWorkout, setCurrentWorkout] = useState(null);
  
  // Enhanced state for better UX
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    dateRange: 'all',
    duration: 'all',
    calories: 'all',
    status: 'all'
  });
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseSearchFilters, setExerciseSearchFilters] = useState({
    category: '',
    muscle: '',
    equipment: '',
    search: ''
  });
  const [workoutStats, setWorkoutStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  const [workoutForm, setWorkoutForm] = useState({
    workoutName: '',
    workoutType: 'strength',
    plannedDuration: 60,
    notes: '',
    location: 'Gym',
    exercises: [],
    difficulty: 'moderate',
    tags: [],
    isTemplate: false,
    templateName: ''
  });

  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    category: 'strength',
    targetMuscle: '',
    equipment: '',
    description: '',
    instructions: '',
    difficulty: 'beginner',
    sets: [{ reps: 0, weight: { value: 0, unit: 'kg' }, duration: 0, restTime: 60, notes: '', isCompleted: false }],
    estimatedCalories: 0,
    targetSets: 3,
    targetReps: 10
  });

  // Fetch user workouts
  const fetchWorkouts = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/workout/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        // Ensure workout names and exercise names are properly set
        const processedWorkouts = (data.workouts || []).map(workout => ({
          ...workout,
          workoutName: workout.workoutName || 'Unnamed Workout',
          exercises: (workout.exercises || []).map(exercise => ({
            ...exercise,
            name: exercise.name || 'Unnamed Exercise'
          }))
        }));
        setWorkouts(processedWorkouts);
      } else {
        setError(data.message || 'Failed to fetch workouts');
      }
    } catch (err) {
      setError('Failed to fetch workouts');
      console.error('Error fetching workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch exercise database from Wger API
  const fetchExerciseDatabase = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      
      const token = await getToken();
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_BASE_URL}/workout/exercises/database?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        console.log(`Fetched ${data.exercises?.length || 0} exercises from database`);
        setExerciseDatabase(data.exercises || []);
        
        if (data.message) {
          console.log('Database message:', data.message);
        }
      } else {
        setError(data.message || 'Failed to fetch exercises');
      }
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError('Failed to fetch exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch workout statistics
  const fetchWorkoutStats = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoadingStats(true);
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/workout/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setWorkoutStats(data.stats);
      } else {
        setError('Failed to fetch workout statistics');
      }
    } catch (err) {
      setError('Failed to fetch workout statistics');
      console.error('Error fetching workout stats:', err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Create workout from template
  const createWorkoutFromTemplate = (template) => {
    const newWorkout = {
      ...template,
      _id: undefined, // Remove template ID
      isTemplate: false,
      templateName: '',
      timestamp: new Date(),
      status: 'planned',
      workoutName: `${template.workoutName} - ${new Date().toLocaleDateString()}`
    };
    
    setWorkoutForm(newWorkout);
    setActiveTab('create');
  };

  // Save workout as template
  const saveWorkoutAsTemplate = async () => {
    if (!user?.id || !workoutForm.workoutName.trim()) {
      setError('Please fill in required fields');
      return;
    }

    // Validate that exercises have names
    if (workoutForm.exercises.length === 0) {
      setError('Please add at least one exercise to the workout');
      return;
    }

    // Check if all exercises have names
    const exercisesWithNames = workoutForm.exercises.filter(ex => ex.name && ex.name.trim());
    if (exercisesWithNames.length !== workoutForm.exercises.length) {
      setError('All exercises must have names');
      return;
    }

    try {
      setLoading(true);
      const templateData = {
        ...workoutForm,
        isTemplate: true,
        templateName: workoutForm.workoutName,
        timestamp: new Date(),
        status: 'planned' // Use valid status instead of 'template'
      };

      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/workout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      const data = await response.json();

      if (data.success) {
        setWorkouts(prev => [data.workout, ...prev]);
        setShowCreateModal(false);
        setWorkoutForm({
          workoutName: '',
          workoutType: 'strength',
          plannedDuration: 60,
          notes: '',
          location: 'Gym',
          exercises: [],
          difficulty: 'moderate',
          tags: [],
          isTemplate: false,
          templateName: ''
        });
        setActiveTab('templates');
      } else {
        setError(data.message || 'Failed to save template');
      }
    } catch (err) {
      setError('Failed to save template');
      console.error('Error saving template:', err);
    } finally {
      setLoading(false);
    }
  };

  // Edit existing workout
  const editWorkout = (workout) => {
    setCurrentWorkout(workout);
    setWorkoutForm({
      workoutName: workout.workoutName,
      workoutType: workout.workoutType,
      plannedDuration: workout.plannedDuration || 60,
      notes: workout.notes || '',
      location: workout.location || 'Gym',
      exercises: workout.exercises || [],
      difficulty: workout.difficulty || 'moderate',
      tags: workout.tags || [],
      isTemplate: workout.isTemplate || false,
      templateName: workout.templateName || ''
    });
    setActiveTab('create');
  };

  // Update existing workout
  const updateWorkout = async () => {
    if (!user?.id || !currentWorkout?._id || !workoutForm.workoutName.trim()) {
      setError('Please fill in required fields');
      return;
    }

    // Validate that exercises have names
    if (workoutForm.exercises.length === 0) {
      setError('Please add at least one exercise to the workout');
      return;
    }

    // Check if all exercises have names
    const exercisesWithNames = workoutForm.exercises.filter(ex => ex.name && ex.name.trim());
    if (exercisesWithNames.length !== workoutForm.exercises.length) {
      setError('All exercises must have names');
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        ...workoutForm,
        timestamp: new Date()
      };

      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/workout/${currentWorkout._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.success) {
        // Ensure the updated workout has proper names
        const updatedWorkout = {
          ...data.workout,
          workoutName: data.workout.workoutName || 'Unnamed Workout',
          exercises: (data.workout.exercises || []).map(exercise => ({
            ...exercise,
            name: exercise.name || 'Unnamed Exercise'
          }))
        };
        
        setWorkouts(prev => prev.map(w => w._id === currentWorkout._id ? updatedWorkout : w));
        setShowCreateModal(false);
        setCurrentWorkout(null);
        setWorkoutForm({
          workoutName: '',
          workoutType: 'strength',
          plannedDuration: 60,
          notes: '',
          location: 'Gym',
          exercises: [],
          difficulty: 'moderate',
          tags: [],
          isTemplate: false,
          templateName: ''
        });
        setActiveTab('workouts');
        
        // Refresh stats after updating workout
        fetchWorkoutStats();
      } else {
        setError(data.message || 'Failed to update workout');
      }
    } catch (err) {
      setError('Failed to update workout');
      console.error('Error updating workout:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchWorkouts();
      fetchExerciseDatabase(); // Load exercise database on component mount
      fetchWorkoutStats(); // Load workout statistics on component mount
    }
  }, [user?.id]);

  // Create workout
  const handleCreateWorkout = async () => {
    if (!user?.id || !workoutForm.workoutName.trim()) {
      setError('Please fill in required fields');
      return;
    }

    // Validate that exercises have names
    if (workoutForm.exercises.length === 0) {
      setError('Please add at least one exercise to the workout');
      return;
    }

    // Check if all exercises have names and clean them up
    const exercisesWithNames = workoutForm.exercises.filter(ex => ex.name && ex.name.trim());
    if (exercisesWithNames.length !== workoutForm.exercises.length) {
      // Try to fix exercises without names
      const fixedExercises = workoutForm.exercises.map((ex, index) => {
        if (!ex.name || !ex.name.trim()) {
          return {
            ...ex,
            name: ex.name || `Exercise ${index + 1}`,
            category: ex.category || 'strength',
            targetMuscle: ex.targetMuscle || 'General',
            equipment: ex.equipment || 'Bodyweight'
          };
        }
        return ex;
      });
      
      setWorkoutForm(prev => ({ ...prev, exercises: fixedExercises }));
      console.log('Fixed exercises without names:', fixedExercises);
    }

    try {
      setLoading(true);
      const workoutData = {
        ...workoutForm,
        timestamp: new Date(),
        status: 'planned'
      };

      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/workout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      });

      const data = await response.json();

      if (data.success) {
        // Ensure the new workout has proper names
        const newWorkout = {
          ...data.workout,
          workoutName: data.workout.workoutName || 'Unnamed Workout',
          exercises: (data.workout.exercises || []).map(exercise => ({
            ...exercise,
            name: exercise.name || 'Unnamed Exercise'
          }))
        };
        
        setWorkouts(prev => [newWorkout, ...prev]);
        setShowCreateModal(false);
        setWorkoutForm({
          workoutName: '',
          workoutType: 'strength',
          plannedDuration: 60,
          notes: '',
          location: 'Gym',
          exercises: []
        });
        
        // Refresh stats after creating workout
        fetchWorkoutStats();
      } else {
        setError(data.message || 'Failed to create workout');
      }
    } catch (err) {
      setError('Failed to create workout');
      console.error('Error creating workout:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add exercise to workout
  const addExerciseToWorkout = (exercise) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise]
    }));
  };

  // Add exercise from database
  const addExerciseFromDatabase = (exercise) => {
    // Ensure exercise has a valid name
    if (!exercise.name || exercise.name.trim() === '') {
      setError('Exercise name is required. Please select a valid exercise.');
      return;
    }

    const newExercise = {
      exerciseId: exercise.exerciseId || `wger_${Date.now()}`,
      name: exercise.name.trim(),
      category: exercise.category || 'strength',
      targetMuscle: exercise.targetMuscle || 'General',
      equipment: exercise.equipment || 'Bodyweight',
      description: exercise.description || 'Exercise from Wger database',
      source: 'wger',
      imageUrl: exercise.imageUrl || null,
      sets: [{ reps: 0, weight: { value: 0, unit: 'kg' }, duration: 0, restTime: 60, notes: '' }]
    };
    
    console.log('Adding exercise from database:', newExercise);
    addExerciseToWorkout(newExercise);
    setShowDatabaseModal(false);
  };

  // Create custom exercise
  const handleCreateExercise = () => {
    if (!exerciseForm.name.trim()) {
      setError('Please enter exercise name');
      return;
    }

    const newExercise = {
      ...exerciseForm,
      source: 'manual',
      exerciseId: `custom_${Date.now()}`
    };
    
    addExerciseToWorkout(newExercise);
    setShowExerciseModal(false);
    setExerciseForm({
      name: '',
      category: 'strength',
      targetMuscle: '',
      equipment: '',
      description: '',
      sets: [{ reps: 0, weight: { value: 0, unit: 'kg' }, duration: 0, restTime: 60, notes: '' }]
    });
  };

  // Add set to exercise
  const addSetToExercise = (exerciseIndex) => {
    const newSet = { reps: 0, weight: { value: 0, unit: 'kg' }, duration: 0, restTime: 60, notes: '' };
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, idx) => 
        idx === exerciseIndex 
          ? { ...ex, sets: [...ex.sets, newSet] }
          : ex
      )
    }));
  };

  // Update set values
  const updateSetValue = (exerciseIndex, setIndex, field, value) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, idx) => 
        idx === exerciseIndex 
          ? {
              ...ex,
              sets: ex.sets.map((set, sIdx) => 
                sIdx === setIndex 
                  ? { ...set, [field]: value }
                  : set
              )
            }
          : ex
      )
    }));
  };

  // Remove exercise from workout
  const removeExerciseFromWorkout = (exerciseIndex) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, idx) => idx !== exerciseIndex)
    }));
  };

  // Remove set from exercise
  const removeSetFromExercise = (exerciseIndex, setIndex) => {
    setWorkoutForm(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, idx) => 
        idx === exerciseIndex 
          ? { ...ex, sets: ex.sets.filter((_, sIdx) => sIdx !== setIndex) }
          : ex
      )
    }));
  };

  // Start workout
  const startWorkout = async (workoutId) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/workout/${workoutId}/start`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });
      
      if (response.ok) {
        // Refresh workouts after starting
        fetchWorkouts();
      }
    } catch (err) {
      console.error('Error starting workout:', err);
    }
  };

  // Complete workout
  const completeWorkout = async (workoutId) => {
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/workout/${workoutId}/complete`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ difficultyRating: 5, satisfactionRating: 5 })
      });
      
      if (response.ok) {
        // Refresh both workouts and stats after completion
        await Promise.all([
          fetchWorkouts(),
          fetchWorkoutStats()
        ]);
      }
    } catch (err) {
      console.error('Error completing workout:', err);
    }
  };

  // Delete workout
  const deleteWorkout = async (workoutId) => {
    if (!confirm('Are you sure you want to delete this workout?')) return;
    
    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/workout/${workoutId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setWorkouts(prev => prev.filter(w => w._id !== workoutId));
        // Refresh stats after deleting workout
        fetchWorkoutStats();
      }
    } catch (err) {
      console.error('Error deleting workout:', err);
    }
  };

  const workoutTypeIcons = {
    strength: Strength,
    cardio: Activity,
    flexibility: Baby,
    mixed: Dumbbell,
    sports: Play,
    custom: UserPlus
  };

  const workoutTypeColors = {
    strength: 'bg-gradient-to-br from-red-500 to-red-600',
    cardio: 'bg-gradient-to-br from-blue-500 to-blue-600',
    flexibility: 'bg-gradient-to-br from-green-500 to-green-600',
    mixed: 'bg-gradient-to-br from-purple-500 to-purple-600',
    sports: 'bg-gradient-to-br from-orange-500 to-orange-600',
    custom: 'bg-gradient-to-br from-gray-500 to-gray-600'
  };

  const workoutTypeLabels = {
    strength: 'Strength Training',
    cardio: 'Cardio & Endurance',
    flexibility: 'Flexibility & Mobility',
    mixed: 'Mixed Training',
    sports: 'Sports & Recreation',
    custom: 'Custom Workout'
  };

  const difficultyColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    advanced: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  // Filter and sort workouts
  const filteredWorkouts = workouts
    .filter(workout => {
      if (filterType !== 'all' && workout.workoutType !== filterType) return false;
      if (searchTerm && !workout.workoutName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date': return new Date(b.timestamp) - new Date(a.timestamp);
        case 'name': return a.workoutName.localeCompare(b.workoutName);
        case 'type': return a.workoutType.localeCompare(b.workoutType);
        case 'duration': return (b.plannedDuration || 0) - (a.plannedDuration || 0);
        default: return 0;
      }
    });

  return (
    <SignedIn>
      <>
        <div className="space-y-6">
          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4"
              >
                <div className="flex items-center space-x-2 text-red-400">
                  <span>{error}</span>
                  <button onClick={() => setError(null)} className="ml-auto">
                    <X className="text-sm" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Tab Navigation */}
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-1">
            {[
              { id: 'workouts', label: 'My Workouts', icon: Dumbbell, count: workouts.length },
              { id: 'database', label: 'Exercise Database', icon: Database, count: exerciseDatabase.length },
              { id: 'create', label: 'Create Workout', icon: Plus },
              { id: 'templates', label: 'Templates', icon: Bookmark, count: workouts.filter(w => w.isTemplate).length },
              { id: 'stats', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all relative ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="text-sm" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activeTab === tab.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/10 text-white/60'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Workouts Tab */}
          {activeTab === 'workouts' && (
            <div className="space-y-6">
              {/* Enhanced Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <h3 className="text-white text-xl font-semibold">Your Workouts</h3>
                  <button
                    onClick={() => {
                      fetchWorkouts();
                      fetchWorkoutStats();
                    }}
                    className="p-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                    title="Refresh Data"
                  >
                    <Loader2 className="text-sm" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === 'grid' 
                          ? 'bg-cyan-600 text-white' 
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      <Expand className="text-sm" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === 'list' 
                          ? 'bg-cyan-600 text-white' 
                          : 'bg-white/10 text-white/60 hover:bg-white/20'
                      }`}
                    >
                      <Minimize className="text-sm" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                    <input
                      type="text"
                      placeholder="Search workouts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-lg transition-all ${
                      showFilters 
                        ? 'bg-cyan-600 text-white' 
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                    title="Advanced Filters"
                  >
                    <Filter className="text-sm" />
                  </button>
                  
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="mixed">Mixed</option>
                    <option value="sports">Sports</option>
                    <option value="custom">Custom</option>
                  </select>
                  
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none pr-8"
                    >
                      <option value="date">Date</option>
                      <option value="name">Name</option>
                      <option value="type">Type</option>
                      <option value="duration">Duration</option>
                      <option value="calories">Calories</option>
                      <option value="volume">Volume</option>
                    </select>
                    <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 text-xs" />
                  </div>
                </div>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Date Range</label>
                        <select
                          value={advancedFilters.dateRange}
                          onChange={(e) => setAdvancedFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none"
                        >
                          <option value="all">All Time</option>
                          <option value="today">Today</option>
                          <option value="week">This Week</option>
                          <option value="month">This Month</option>
                          <option value="year">This Year</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Duration</label>
                        <select
                          value={advancedFilters.duration}
                          onChange={(e) => setAdvancedFilters(prev => ({ ...prev, duration: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none"
                        >
                          <option value="all">Any Duration</option>
                          <option value="short">Short (&lt; 30 min)</option>
                          <option value="medium">Medium (30-60 min)</option>
                          <option value="long">Long (&gt; 60 min)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Calories</label>
                        <select
                          value={advancedFilters.calories}
                          onChange={(e) => setAdvancedFilters(prev => ({ ...prev, calories: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none"
                        >
                          <option value="all">Any Calories</option>
                          <option value="low">Low (&lt; 200)</option>
                          <option value="medium">Medium (200-500)</option>
                          <option value="high">High (&gt; 500)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Status</label>
                        <select
                          value={advancedFilters.status}
                          onChange={(e) => setAdvancedFilters(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none"
                        >
                          <option value="all">All Status</option>
                          <option value="planned">Planned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="skipped">Skipped</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Workouts Display */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="animate-spin text-cyan-400 text-3xl" />
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
                }>
                  {filteredWorkouts.map((workout) => {
                    const TypeIcon = workoutTypeIcons[workout.workoutType] || Dumbbell;
                    const typeColor = workoutTypeColors[workout.workoutType] || 'bg-gray-500';
                    const typeLabel = workoutTypeLabels[workout.workoutType] || workout.workoutType;
                    
                    if (viewMode === 'grid') {
                      return (
                        <motion.div
                          key={workout._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="workout-tracker-card bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all hover:shadow-lg hover:shadow-cyan-400/20 group"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`p-3 ${typeColor} rounded-lg shadow-lg group-hover:scale-110 transition-transform`}>
                                <TypeIcon className="text-white text-lg" />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold text-lg group-hover:text-cyan-300 transition-colors">
                                  {workout.workoutName}
                                </h3>
                                <p className="text-white/60 text-sm">{typeLabel}</p>
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              workout.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              workout.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            }`}>
                              {workout.status.replace('_', ' ')}
                            </div>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center space-x-2 text-white/70">
                              <Clock className="text-sm" />
                              <span className="text-sm">
                                {workout.plannedDuration ? `${workout.plannedDuration} min planned` : 'No duration set'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-white/70">
                              <Weight className="text-sm" />
                              <span className="text-sm">
                                {workout.exercises?.length || 0} exercises
                              </span>
                            </div>
                            {workout.exercises && workout.exercises.length > 0 && (
                              <div className="text-white/60 text-xs">
                                {workout.exercises.slice(0, 2).map(ex => ex.name).join(', ')}
                                {workout.exercises.length > 2 && ` +${workout.exercises.length - 2} more`}
                              </div>
                            )}
                            {workout.location && (
                              <div className="flex items-center space-x-2 text-white/70">
                                <MapPin className="text-sm" />
                                <span className="text-sm">{workout.location}</span>
                              </div>
                            )}
                            {workout.totalCaloriesBurned > 0 && (
                              <div className="flex items-center space-x-2 text-white/70">
                                <Flame className="text-sm" />
                                <span className="text-sm">{workout.totalCaloriesBurned} cal</span>
                              </div>
                            )}
                            {workout.totalVolume > 0 && (
                              <div className="flex items-center space-x-2 text-white/70">
                                <Trophy className="text-sm" />
                                <span className="text-sm">{workout.totalVolume} kg total volume</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            {workout.status === 'planned' && (
                              <button
                                onClick={() => startWorkout(workout._id)}
                                className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg text-sm transition-all hover:scale-105 shadow-lg"
                              >
                                <Play className="text-xs" />
                                <span>Start</span>
                              </button>
                            )}
                            {workout.status === 'in_progress' && (
                              <button
                                onClick={() => completeWorkout(workout._id)}
                                className="flex items-center space-x-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-2 rounded-lg text-sm transition-all hover:scale-105 shadow-lg"
                              >
                                <Check className="text-xs" />
                                <span>Complete</span>
                              </button>
                            )}
                            <button
                              onClick={() => editWorkout(workout)}
                              className="flex items-center space-x-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-3 py-2 rounded-lg text-sm transition-all hover:scale-105 shadow-lg"
                            >
                              <Edit3 className="text-xs" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => deleteWorkout(workout._id)}
                              className="flex items-center space-x-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 py-2 rounded-lg text-sm transition-all hover:scale-105 shadow-lg"
                            >
                              <Trash2 className="text-xs" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </motion.div>
                      );
                    } else {
                      // List view
                      return (
                        <motion.div
                          key={workout._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-cyan-400/50 transition-all hover:bg-white/15"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                              <div className={`p-3 ${typeColor} rounded-lg`}>
                                <TypeIcon className="text-white text-lg" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-white font-semibold text-lg">{workout.workoutName}</h3>
                                <p className="text-white/60 text-sm">{typeLabel}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-6 text-sm text-white/70">
                              <div className="flex items-center space-x-2">
                                <Clock className="text-sm" />
                                <span>{workout.plannedDuration || 0} min</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Weight className="text-sm" />
                                <span>{workout.exercises?.length || 0} exercises</span>
                              </div>
                              {workout.exercises && workout.exercises.length > 0 && (
                                <div className="text-white/50 text-xs ml-6">
                                  {workout.exercises.slice(0, 3).map(ex => ex.name).join(', ')}
                                  {workout.exercises.length > 3 && ` +${workout.exercises.length - 3} more`}
                                </div>
                              )}
                              {workout.totalCaloriesBurned > 0 && (
                                <div className="flex items-center space-x-2">
                                  <Flame className="text-sm" />
                                  <span>{workout.totalCaloriesBurned} cal</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                workout.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                workout.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                              }`}>
                                {workout.status.replace('_', ' ')}
                              </div>
                              
                              <div className="flex space-x-1">
                                {workout.status === 'planned' && (
                                  <button
                                    onClick={() => startWorkout(workout._id)}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    title="Start Workout"
                                  >
                                    <Play className="text-xs" />
                                  </button>
                                )}
                                {workout.status === 'in_progress' && (
                                  <button
                                    onClick={() => completeWorkout(workout._id)}
                                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                    title="Complete Workout"
                                  >
                                    <Check className="text-xs" />
                                  </button>
                                )}
                                <button
                                  onClick={() => editWorkout(workout)}
                                  className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                  title="Edit Workout"
                                >
                                  <Edit3 className="text-xs" />
                                </button>
                                <button
                                  onClick={() => deleteWorkout(workout._id)}
                                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                  title="Delete Workout"
                                >
                                  <Trash2 className="text-xs" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    }
                  })}
                </div>
              )}

              {filteredWorkouts.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Dumbbell className="text-6xl text-white/30 mx-auto mb-4" />
                  <h3 className="text-white/60 text-xl mb-2">No workouts found</h3>
                  <p className="text-white/40 mb-4">Create your first workout to get started!</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Create Workout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-white text-xl font-semibold">Workout Templates</h3>
                <button
                  onClick={() => {
                    setActiveTab('create');
                    setWorkoutForm(prev => ({ ...prev, isTemplate: true }));
                  }}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="inline mr-2" />
                  Create Template
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workouts.filter(w => w.isTemplate).map((template) => {
                  const TypeIcon = workoutTypeIcons[template.workoutType] || Dumbbell;
                  const typeColor = workoutTypeColors[template.workoutType] || 'bg-gray-500';
                  const typeLabel = workoutTypeLabels[template.workoutType] || template.workoutType;
                  
                  return (
                    <motion.div
                      key={template._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all hover:shadow-lg hover:shadow-cyan-400/20 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 ${typeColor} rounded-lg shadow-lg group-hover:scale-110 transition-transform`}>
                            <TypeIcon className="text-white text-lg" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg group-hover:text-cyan-300 transition-colors">
                              {template.templateName || template.workoutName}
                            </h3>
                            <p className="text-white/60 text-sm">{typeLabel}</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-medium">
                          Template
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center space-x-2 text-white/70">
                          <Clock className="text-sm" />
                          <span className="text-sm">
                            {template.plannedDuration ? `${template.plannedDuration} min` : 'No duration set'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-white/70">
                          <Weight className="text-sm" />
                          <span className="text-sm">
                            {template.exercises?.length || 0} exercises
                          </span>
                        </div>
                        {template.exercises && template.exercises.length > 0 && (
                          <div className="text-white/60 text-xs">
                            {template.exercises.slice(0, 2).map(ex => ex.name).join(', ')}
                            {template.exercises.length > 2 && ` +${template.exercises.length - 2} more`}
                          </div>
                        )}
                        {template.location && (
                          <div className="flex items-center space-x-2 text-white/70">
                            <MapPin className="text-sm" />
                            <span className="text-sm">{template.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => createWorkoutFromTemplate(template)}
                          className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-3 py-2 rounded-lg text-sm transition-all hover:scale-105 shadow-lg"
                        >
                          <Copy className="text-xs" />
                          <span>Use Template</span>
                        </button>
                        <button
                          onClick={() => editWorkout(template)}
                          className="flex items-center space-x-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-3 py-2 rounded-lg text-sm transition-all hover:scale-105 shadow-lg"
                        >
                          <Edit3 className="text-xs" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteWorkout(template._id)}
                          className="flex items-center space-x-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 py-2 rounded-lg text-sm transition-all hover:scale-105 shadow-lg"
                        >
                          <Trash2 className="text-xs" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {workouts.filter(w => w.isTemplate).length === 0 && (
                <div className="text-center py-12">
                  <Bookmark className="text-6xl text-white/30 mx-auto mb-4" />
                  <h3 className="text-white/60 text-xl mb-2">No templates yet</h3>
                  <p className="text-white/40 mb-4">Create workout templates to quickly start new workouts</p>
                  <button
                    onClick={() => {
                      setActiveTab('create');
                      setWorkoutForm(prev => ({ ...prev, isTemplate: true }));
                    }}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Create Template
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-white text-xl font-semibold">Workout Analytics</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => fetchWorkoutStats()}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <TrendingUp className="inline mr-2" />
                    Refresh Stats
                  </button>
                </div>
              </div>

              {isLoadingStats ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="animate-spin text-cyan-400 text-3xl" />
                </div>
              ) : workoutStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Dumbbell className="text-blue-400 text-xl" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Total Workouts</p>
                        <p className="text-white text-2xl font-bold">{workoutStats.totalWorkouts}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-green-500/20 rounded-lg">
                        <Clock className="text-green-400 text-xl" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Total Duration</p>
                        <p className="text-white text-2xl font-bold">{workoutStats.totalDuration} min</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-red-500/20 rounded-lg">
                        <Flame className="text-red-400 text-xl" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Total Calories</p>
                        <p className="text-white text-2xl font-bold">{workoutStats.totalCalories} cal</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <Trophy className="text-purple-400 text-xl" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Total Volume</p>
                        <p className="text-white text-2xl font-bold">{workoutStats.totalVolume} kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="text-6xl text-white/30 mx-auto mb-4" />
                  <h3 className="text-white/60 text-xl mb-2">No analytics data</h3>
                  <p className="text-white/40 mb-4">Complete some workouts to see your progress</p>
                  <button
                    onClick={() => fetchWorkoutStats()}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Load Stats
                  </button>
                </div>
              )}

              {/* AI Workout Recommendations */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
                  <Dumbbell className="text-cyan-400" />
                  AI Workout Tips
                </h3>
                {recommendations?.workoutTracker ? (
                  <AIRecommendationCard
                    title="Workout & Fitness"
                    recommendation={recommendations.workoutTracker}
                    feature="workoutTracker"
                    userId={user?.id}
                  />
                ) : (
                  <div className="text-center py-4">
                    <p className="text-white/60 mb-2">No AI recommendations available yet.</p>
                    <p className="text-white/40 text-sm">Complete your onboarding to get personalized AI recommendations.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Exercise Database Tab */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-white text-xl font-semibold">Exercise Database</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchExerciseDatabase()}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Refresh Exercises
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(`${API_BASE_URL}/workout/exercises/test`);
                        const data = await response.json();
                        console.log('Wger API Basic Test:', data);
                        if (data.success) {
                          alert('Wger API basic test successful! Check console for details.');
                        } else {
                          alert('Wger API basic test failed. Check console for details.');
                        }
                      } catch (err) {
                        console.error('Basic test failed:', err);
                        alert('Basic test failed. Check console for details.');
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    title="Basic Wger API test"
                  >
                    Basic Test
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(`${API_BASE_URL}/workout/exercises/debug`);
                        const data = await response.json();
                        console.log('Wger API Debug:', data);
                        if (data.success) {
                          alert('Wger API debug test successful! Check console for details.');
                        } else {
                          alert('Wger API debug test failed. Check console for details.');
                        }
                      } catch (err) {
                        console.error('Debug test failed:', err);
                        alert('Debug test failed. Check console for details.');
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    title="Detailed Wger API test"
                  >
                    Debug Test
                  </button>
                  <button
                    onClick={() => setShowExerciseModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    title="Create custom exercise"
                  >
                    + Custom
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12 col-span-full">
                  <Loader2 className="animate-spin text-cyan-400 text-3xl" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exerciseDatabase.map((exercise) => (
                    <motion.div
                      key={exercise.exerciseId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:border-cyan-400/50 transition-all"
                    >
                      {exercise.imageUrl && (
                        <img 
                          src={exercise.imageUrl} 
                          alt={exercise.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h4 className="text-white font-semibold mb-2">{exercise.name}</h4>
                      <p className="text-white/60 text-sm mb-2">{exercise.description}</p>
                      <div className="flex items-center justify-between text-xs text-white/50 mb-3">
                        <span>{exercise.targetMuscle}</span>
                        <span>{exercise.equipment}</span>
                      </div>
                      <button
                        onClick={() => addExerciseFromDatabase(exercise)}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-colors text-sm"
                      >
                        Add to Workout
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {exerciseDatabase.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Database className="text-6xl text-white/30 mx-auto mb-4" />
                  <h3 className="text-white/60 text-xl mb-2">No exercises found</h3>
                  <p className="text-white/40 mb-4">Try refreshing the exercise database or check your connection</p>
                </div>
              )}
            </div>
          )}

          {/* Create Workout Tab */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-white text-xl font-semibold">
                  {currentWorkout ? `Edit Workout: ${currentWorkout.workoutName}` : 'Create New Workout'}
                </h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDatabaseModal(true)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Database />
                    <span>Browse Exercises</span>
                  </button>
                  <button
                    onClick={() => setShowExerciseModal(true)}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <UserPlus />
                    <span>Custom Exercise</span>
                  </button>
                </div>
              </div>

              {/* Workout Form */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Workout Name</label>
                    <input
                      type="text"
                      value={workoutForm.workoutName}
                      onChange={(e) => setWorkoutForm(prev => ({ ...prev, workoutName: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none"
                      placeholder="Enter workout name..."
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Type</label>
                    <select
                      value={workoutForm.workoutType}
                      onChange={(e) => setWorkoutForm(prev => ({ ...prev, workoutType: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="strength">Strength</option>
                      <option value="cardio">Cardio</option>
                      <option value="flexibility">Flexibility</option>
                      <option value="mixed">Mixed</option>
                      <option value="sports">Sports</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Duration (min)</label>
                    <input
                      type="number"
                      value={workoutForm.plannedDuration}
                      onChange={(e) => setWorkoutForm(prev => ({ ...prev, plannedDuration: parseInt(e.target.value) || 60 }))}
                      className="w-full px-3 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Location</label>
                    <input
                      type="text"
                      value={workoutForm.location}
                      onChange={(e) => setWorkoutForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none"
                      placeholder="Gym, Home, Park, etc."
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-white/70 text-sm mb-2">Notes</label>
                  <textarea
                    value={workoutForm.notes}
                    onChange={(e) => setWorkoutForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none resize-none"
                    rows="3"
                    placeholder="Add any notes about this workout..."
                  />
                </div>

                {/* Exercises List */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-semibold">Exercises ({workoutForm.exercises.length})</h4>
                  </div>

                  {workoutForm.exercises.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-white/20 rounded-lg">
                      <Dumbbell className="text-4xl text-white/30 mx-auto mb-3" />
                      <p className="text-white/50 mb-3">No exercises added yet</p>
                      <p className="text-white/30 text-sm">Use the buttons above to add exercises from the database or create custom ones</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {workoutForm.exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-white font-medium">{exercise.name}</h5>
                            <button
                              onClick={() => removeExerciseFromWorkout(exerciseIndex)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 />
                            </button>
                          </div>
                          
                          <div className="text-sm text-white/60 mb-3">
                            <span className="capitalize">{exercise.category}</span>
                            {exercise.targetMuscle && ` • ${exercise.targetMuscle}`}
                            {exercise.equipment && ` • ${exercise.equipment}`}
                          </div>

                          {/* Sets */}
                          <div className="space-y-2">
                            {exercise.sets.map((set, setIndex) => (
                              <div key={setIndex} className="flex items-center space-x-2 text-sm">
                                <span className="text-white/50 w-8">Set {setIndex + 1}</span>
                                <input
                                  type="number"
                                  placeholder="Reps"
                                  value={set.reps || ''}
                                  onChange={(e) => updateSetValue(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                                  className="w-16 px-2 py-1 bg-white/10 text-white rounded border border-white/20 focus:border-cyan-400 focus:outline-none"
                                />
                                <input
                                  type="number"
                                  placeholder="Weight"
                                  value={set.weight?.value || ''}
                                  onChange={(e) => updateSetValue(exerciseIndex, setIndex, 'weight', { ...set.weight, value: parseFloat(e.target.value) || 0 })}
                                  className="w-20 px-2 py-1 bg-white/10 text-white rounded border border-white/20 focus:border-cyan-400 focus:outline-none"
                                />
                                <select
                                  value={set.weight?.unit || 'kg'}
                                  onChange={(e) => updateSetValue(exerciseIndex, setIndex, 'weight', { ...set.weight, unit: e.target.value })}
                                  className="px-2 py-1 bg-white/10 text-white rounded border border-white/20 focus:border-cyan-400 focus:outline-none"
                                >
                                  <option value="kg">kg</option>
                                  <option value="lbs">lbs</option>
                                </select>
                                <input
                                  type="number"
                                  placeholder="Rest (s)"
                                  value={set.restTime || ''}
                                  onChange={(e) => updateSetValue(exerciseIndex, setIndex, 'restTime', parseInt(e.target.value) || 60)}
                                  className="w-20 px-2 py-1 bg-white/10 text-white rounded border border-white/20 focus:border-cyan-400 focus:outline-none"
                                />
                                <button
                                  onClick={() => removeSetFromExercise(exerciseIndex, setIndex)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <X />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => addSetToExercise(exerciseIndex)}
                              className="text-cyan-400 hover:text-cyan-300 text-sm"
                            >
                              + Add Set
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={currentWorkout ? updateWorkout : handleCreateWorkout}
                    disabled={loading || workoutForm.exercises.length === 0}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white py-3 rounded-lg transition-colors font-medium"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : (currentWorkout ? 'Update Workout' : 'Create Workout')}
                  </button>
                  {currentWorkout && (
                    <button
                      onClick={() => {
                        setCurrentWorkout(null);
                        setWorkoutForm({
                          workoutName: '',
                          workoutType: 'strength',
                          plannedDuration: 60,
                          notes: '',
                          location: 'Gym',
                          exercises: [],
                          difficulty: 'moderate',
                          tags: [],
                          isTemplate: false,
                          templateName: ''
                        });
                      }}
                      className="px-6 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors font-medium"
                    >
                      Cancel Edit
                    </button>
                  )}
                  {!currentWorkout && (
                    <button
                      onClick={saveWorkoutAsTemplate}
                      disabled={loading || workoutForm.exercises.length === 0}
                      className="px-6 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors font-medium"
                    >
                      Save as Template
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Exercise Database Modal */}
        {showDatabaseModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-xl font-semibold">Exercise Database</h3>
                <button
                  onClick={() => setShowDatabaseModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exerciseDatabase.map((exercise) => (
                  <div key={exercise.exerciseId} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    {exercise.imageUrl && (
                      <img 
                        src={exercise.imageUrl} 
                        alt={exercise.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h4 className="text-white font-semibold mb-2">{exercise.name}</h4>
                    <p className="text-white/60 text-sm mb-2">{exercise.description}</p>
                    <div className="flex items-center justify-between text-xs text-white/50 mb-3">
                      <span>{exercise.targetMuscle}</span>
                      <span>{exercise.equipment}</span>
                    </div>
                    <button
                      onClick={() => addExerciseFromDatabase(exercise)}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-colors text-sm"
                    >
                      Add to Workout
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Custom Exercise Modal */}
        {showExerciseModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-xl font-semibold">Create Custom Exercise</h3>
                <button
                  onClick={() => setShowExerciseModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Exercise Name</label>
                  <input
                    type="text"
                    value={exerciseForm.name}
                    onChange={(e) => setExerciseForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none"
                    placeholder="Enter exercise name..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Category</label>
                    <select
                      value={exerciseForm.category}
                      onChange={(e) => setExerciseForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="strength">Strength</option>
                      <option value="cardio">Cardio</option>
                      <option value="flexibility">Flexibility</option>
                      <option value="sports">Sports</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">Target Muscle</label>
                    <input
                      type="text"
                      value={exerciseForm.targetMuscle}
                      onChange={(e) => setExerciseForm(prev => ({ ...prev, targetMuscle: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none"
                      placeholder="e.g., Chest, Back"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Equipment</label>
                  <input
                    type="text"
                    value={exerciseForm.equipment}
                    onChange={(e) => setExerciseForm(prev => ({ ...prev, equipment: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none"
                    placeholder="e.g., Dumbbells, Barbell, Bodyweight"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Description</label>
                  <textarea
                    value={exerciseForm.description}
                    onChange={(e) => setExerciseForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none resize-none"
                    rows="3"
                    placeholder="Describe how to perform this exercise..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateExercise}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg transition-colors"
                >
                  Add Exercise
                </button>
                <button
                  onClick={() => setShowExerciseModal(false)}
                  className="px-6 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </SignedIn>
  );
};

export default WorkoutTracker;