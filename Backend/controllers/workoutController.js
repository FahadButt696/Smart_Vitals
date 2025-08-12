import Workout from '../models/Workout.js';
import axios from 'axios';
import mongoose from 'mongoose';

// MET values for calorie calculation (Metabolic Equivalent of Task)
const MET_VALUES = {
  // Strength training
  'strength_light': 3.5,
  'strength_moderate': 5.0,
  'strength_vigorous': 6.0,
  // Cardio
  'running_slow': 8.0,
  'running_moderate': 11.0,
  'running_fast': 15.0,
  'cycling_light': 4.0,
  'cycling_moderate': 8.0,
  'cycling_vigorous': 12.0,
  'swimming': 10.0,
  'walking': 3.5,
  // Other activities
  'yoga': 2.5,
  'pilates': 3.0,
  'dancing': 4.5,
  'default': 4.0
};

// Calculate calories burned using MET formula
const calculateCalories = (met, weightKg, durationMinutes) => {
  return Math.round(met * weightKg * (durationMinutes / 60));
};

// Get exercise data from Wger API
export const getExerciseDatabase = async (req, res) => {
  try {
    const { category, muscle, equipment, search } = req.query;
    
    // Use the correct Wger API endpoint with proper parameters
    let url = 'https://wger.de/api/v2/exercise/';
    const params = new URLSearchParams();
    
    // Add default limit and language
    params.append('limit', '50');
    params.append('language', 'en');
    
    if (category) params.append('category', category);
    if (muscle) params.append('muscles', muscle);
    if (equipment) params.append('equipment', equipment);
    if (search) params.append('search', search);
    
    console.log('Fetching exercises from Wger API:', url + '?' + params.toString());
    
    const response = await axios.get(`${url}?${params.toString()}`, {
      timeout: 15000, // 15 second timeout
      headers: {
        'User-Agent': 'SmartVitals/1.0',
        'Accept': 'application/json'
      }
    });
    
    console.log('Wger API response status:', response.status);
    console.log('Wger API response data count:', response.data?.results?.length || 0);
    
    if (!response.data || !response.data.results) {
      throw new Error('Invalid response format from Wger API');
    }
    
    // Debug: Log first few exercises to understand structure
    console.log('Sample exercise data:', JSON.stringify(response.data.results[0], null, 2));
    console.log('Sample exercise keys:', Object.keys(response.data.results[0] || {}));
    
    // Transform the data to match our needs with better error handling
    const exercises = response.data.results
      .filter(exercise => {
        // More lenient filtering - just check if exercise exists and has basic data
        if (!exercise) return false;
        
        // Check for name in different possible fields
        const hasName = exercise.name || exercise.name_en || exercise.name_de;
        if (!hasName || !hasName.trim()) {
          console.log('Filtering out exercise without name:', exercise);
          return false;
        }
        
        return true;
      })
      .map(exercise => {
        // Handle different possible data structures for Wger API
        const exerciseId = exercise.id?.toString() || exercise.uuid || `wger_${Date.now()}_${Math.random()}`;
        
        // Try different name fields
        const name = exercise.name?.trim() || exercise.name_en?.trim() || exercise.name_de?.trim() || 'Unnamed Exercise';
        
        // Handle category - Wger uses category IDs, we'll map them
        let category = 'strength';
        if (exercise.category) {
          // Map Wger category IDs to our categories
          const categoryMap = {
            10: 'strength',    // Abs
            8: 'strength',     // Arms
            12: 'strength',    // Back
            14: 'strength',    // Chest
            11: 'strength',    // Legs
            13: 'strength',    // Shoulders
            15: 'cardio',      // Cardio
            16: 'flexibility'  // Stretching
          };
          category = categoryMap[exercise.category] || 'strength';
        }
        
        // Handle description - try multiple language fields
        const description = exercise.description?.trim() || 
                          exercise.description_en?.trim() || 
                          exercise.description_de?.trim() || 
                          'Exercise from Wger database';
        
        // Handle muscles - Wger returns muscle IDs, we'll map them
        let targetMuscle = 'General';
        if (exercise.muscles && Array.isArray(exercise.muscles) && exercise.muscles.length > 0) {
          const muscleMap = {
            1: 'Biceps brachii',
            2: 'Anterior deltoid',
            3: 'Serratus anterior',
            4: 'Pectoralis major',
            5: 'Triceps brachii',
            6: 'Rectus abdominis',
            7: 'Gastrocnemius',
            8: 'Trapezius',
            9: 'Gluteus maximus',
            10: 'Quadriceps femoris'
          };
          const muscleId = exercise.muscles[0];
          targetMuscle = muscleMap[muscleId] || 'General';
        }
        
        // Handle equipment - Wger returns equipment IDs, we'll map them
        let equipment = 'Bodyweight';
        if (exercise.equipment && Array.isArray(exercise.equipment) && exercise.equipment.length > 0) {
          const equipmentMap = {
            1: 'Barbell',
            2: 'SZ-Bar',
            3: 'Dumbbell',
            4: 'Gym mat',
            5: 'Swiss Ball',
            6: 'Pull-up bar',
            7: 'None (bodyweight exercise)',
            8: 'Bench',
            9: 'Incline bench',
            10: 'Kettlebell'
          };
          const equipmentId = exercise.equipment[0];
          equipment = equipmentMap[equipmentId] || 'Bodyweight';
        }
        
        return {
          exerciseId,
          name,
          category,
          description,
          targetMuscle,
          equipment,
          source: 'wger',
          imageUrl: exercise.images?.[0]?.image || null
        };
      });
    
    console.log(`Successfully processed ${exercises.length} exercises from Wger API`);
    if (exercises.length === 0) {
      console.log('No exercises processed. Raw data sample:', JSON.stringify(response.data.results.slice(0, 2), null, 2));
    }
    
    res.json({
      success: true,
      exercises,
      pagination: {
        count: response.data.count || exercises.length,
        next: response.data.next,
        previous: response.data.previous
      }
    });
  } catch (error) {
    console.error('Error fetching exercises from Wger API:', error);
    
    // Provide fallback exercises if API fails
    const fallbackExercises = [
      {
        exerciseId: 'fallback_1',
        name: 'Push-ups',
        category: 'strength',
        description: 'Classic bodyweight exercise for chest, shoulders, and triceps',
        targetMuscle: 'Chest',
        equipment: 'Bodyweight',
        source: 'fallback',
        imageUrl: null
      },
      {
        exerciseId: 'fallback_2',
        name: 'Squats',
        category: 'strength',
        description: 'Fundamental lower body exercise',
        targetMuscle: 'Legs',
        equipment: 'Bodyweight',
        source: 'fallback',
        imageUrl: null
      },
      {
        exerciseId: 'fallback_3',
        name: 'Plank',
        category: 'strength',
        description: 'Core strengthening exercise',
        targetMuscle: 'Core',
        equipment: 'Bodyweight',
        source: 'fallback',
        imageUrl: null
      },
      {
        exerciseId: 'fallback_4',
        name: 'Pull-ups',
        category: 'strength',
        description: 'Upper body pulling exercise for back and biceps',
        targetMuscle: 'Back',
        equipment: 'Bodyweight',
        source: 'fallback',
        imageUrl: null
      },
      {
        exerciseId: 'fallback_5',
        name: 'Lunges',
        category: 'strength',
        description: 'Unilateral leg exercise for balance and strength',
        targetMuscle: 'Legs',
        equipment: 'Bodyweight',
        source: 'fallback',
        imageUrl: null
      },
      {
        exerciseId: 'fallback_6',
        name: 'Burpees',
        category: 'cardio',
        description: 'Full body conditioning exercise',
        targetMuscle: 'Full Body',
        equipment: 'Bodyweight',
        source: 'fallback',
        imageUrl: null
      }
    ];
    
    res.json({
      success: true,
      exercises: fallbackExercises,
      pagination: {
        count: fallbackExercises.length,
        next: null,
        previous: null
      },
      message: 'Using fallback exercises due to API error',
      error: error.message
    });
  }
};

// Get all workouts for a user
export const getUserWorkouts = async (req, res) => {
  try {
    // Get user ID from Clerk auth
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { 
      page = 1, 
      limit = 10, 
      type, 
      status, 
      startDate, 
      endDate,
      isTemplate 
    } = req.query;
    
    // Build filter object
    const filter = { userId };
    if (type) filter.workoutType = type;
    if (status) filter.status = status;
    if (isTemplate !== undefined) filter.isTemplate = isTemplate === 'true';
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    
    const skip = (page - 1) * limit;
    
    const workouts = await Workout.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Workout.countDocuments(filter);
    
    res.json({
      success: true,
      workouts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user workouts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workouts',
      error: error.message
    });
  }
};

// Get a specific workout by ID
export const getWorkoutById = async (req, res) => {
  try {
    const { workoutId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format',
        error: 'Workout ID must be a valid MongoDB ObjectId'
      });
    }
    
    const workout = await Workout.findById(workoutId);
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }
    
    res.json({
      success: true,
      workout
    });
  } catch (error) {
    console.error('Error fetching workout:', error);
    
    // Handle specific error types
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format',
        error: 'Workout ID must be a valid MongoDB ObjectId'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workout',
      error: error.message
    });
  }
};

// Create a new workout
export const createWorkout = async (req, res) => {
  try {
    // Get user ID from Clerk auth
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const workoutData = { ...req.body, userId };
    
    // Validate exercises data before processing
    if (workoutData.exercises && Array.isArray(workoutData.exercises)) {
      // Check if all exercises have required fields
      for (let i = 0; i < workoutData.exercises.length; i++) {
        const exercise = workoutData.exercises[i];
        
        // Ensure exercise name exists
        if (!exercise.name || exercise.name.trim() === '') {
          return res.status(400).json({
            success: false,
            message: `Exercise at index ${i} is missing a name`,
            field: `exercises.${i}.name`
          });
        }
        
        // Ensure exercise has at least one set
        if (!exercise.sets || !Array.isArray(exercise.sets) || exercise.sets.length === 0) {
          return res.status(400).json({
            success: false,
            message: `Exercise "${exercise.name}" must have at least one set`,
            field: `exercises.${i}.sets`
          });
        }
      }
      
      // Process exercises for calorie and volume calculations
      for (let exercise of workoutData.exercises) {
        if (!exercise.estimatedCalories && exercise.sets && exercise.sets.length > 0) {
          // Get user weight from profile or use default
          const userWeight = req.body.userWeight || 70; // Default 70kg
          
          // Calculate total duration for this exercise
          const totalDuration = exercise.sets.reduce((total, set) => {
            return total + (set.duration || 0);
          }, 0);
          
          if (totalDuration > 0) {
            // Determine MET value based on exercise type
            let metValue = MET_VALUES.default;
            const exerciseName = exercise.name.toLowerCase();
            
            if (exerciseName.includes('run')) metValue = MET_VALUES.running_moderate;
            else if (exerciseName.includes('cycle') || exerciseName.includes('bike')) metValue = MET_VALUES.cycling_moderate;
            else if (exerciseName.includes('swim')) metValue = MET_VALUES.swimming;
            else if (exerciseName.includes('walk')) metValue = MET_VALUES.walking;
            else if (exerciseName.includes('yoga')) metValue = MET_VALUES.yoga;
            else if (exercise.category === 'strength') metValue = MET_VALUES.strength_moderate;
            
            exercise.estimatedCalories = calculateCalories(metValue, userWeight, totalDuration / 60);
          }
          
          // Calculate total volume for strength exercises
          if (exercise.sets && exercise.sets.length > 0) {
            exercise.totalVolume = exercise.sets.reduce((total, set) => {
              const weight = set.weight?.value || 0;
              const reps = set.reps || 0;
              return total + (weight * reps);
            }, 0);
          }
          
          exercise.totalDuration = totalDuration;
        }
      }
    }
    
    const workout = new Workout(workoutData);
    await workout.save();
    
    res.status(201).json({
      success: true,
      message: 'Workout created successfully',
      workout
    });
  } catch (error) {
    console.error('Error creating workout:', error);
    
    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      
      return res.status(400).json({
        success: false,
        message: 'Workout validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create workout',
      error: error.message
    });
  }
};

// Update a workout
export const updateWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const updates = req.body;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format',
        error: 'Workout ID must be a valid MongoDB ObjectId'
      });
    }
    
    // Validate exercises data if being updated
    if (updates.exercises && Array.isArray(updates.exercises)) {
      for (let i = 0; i < updates.exercises.length; i++) {
        const exercise = updates.exercises[i];
        
        // Ensure exercise name exists
        if (!exercise.name || exercise.name.trim() === '') {
          return res.status(400).json({
            success: false,
            message: `Exercise at index ${i} is missing a name`,
            field: `exercises.${i}.name`
          });
        }
        
        // Ensure exercise has at least one set
        if (!exercise.sets || !Array.isArray(exercise.sets) || exercise.sets.length === 0) {
          return res.status(400).json({
            success: false,
            message: `Exercise "${exercise.name}" must have at least one set`,
            field: `exercises.${i}.sets`
          });
        }
      }
    }
    
    const workout = await Workout.findByIdAndUpdate(
      workoutId,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Workout updated successfully',
      workout
    });
  } catch (error) {
    console.error('Error updating workout:', error);
    
    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      
      return res.status(400).json({
        success: false,
        message: 'Workout validation failed',
        errors: validationErrors
      });
    }
    
    // Handle specific error types
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format',
        error: 'Workout ID must be a valid MongoDB ObjectId'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update workout',
      error: error.message
    });
  }
};

// Delete a workout
export const deleteWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format',
        error: 'Workout ID must be a valid MongoDB ObjectId'
      });
    }
    
    const workout = await Workout.findByIdAndDelete(workoutId);
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting workout:', error);
    
    // Handle specific error types
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format',
        error: 'Workout ID must be a valid MongoDB ObjectId'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete workout',
      error: error.message
    });
  }
};

// Get workout statistics for a user
export const getWorkoutStats = async (req, res) => {
  try {
    // Get user ID from Clerk auth
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { period = '30' } = req.query; // days
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    const workouts = await Workout.find({
      userId,
      status: 'completed',
      timestamp: { $gte: startDate }
    });
    
    // Calculate statistics
    const stats = {
      totalWorkouts: workouts.length,
      totalDuration: workouts.reduce((sum, w) => sum + (w.actualDuration || 0), 0),
      totalCalories: workouts.reduce((sum, w) => sum + (w.totalCaloriesBurned || 0), 0),
      totalVolume: workouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0),
      avgDuration: 0,
      avgCalories: 0,
      workoutsByType: {},
      workoutsByWeek: {},
      personalRecords: workouts.filter(w => w.isPersonalRecord).length
    };
    
    if (stats.totalWorkouts > 0) {
      stats.avgDuration = Math.round(stats.totalDuration / stats.totalWorkouts);
      stats.avgCalories = Math.round(stats.totalCalories / stats.totalWorkouts);
    }
    
    // Group by workout type
    workouts.forEach(workout => {
      const type = workout.workoutType;
      stats.workoutsByType[type] = (stats.workoutsByType[type] || 0) + 1;
    });
    
    // Group by week
    workouts.forEach(workout => {
      const week = `${workout.timestamp.getFullYear()}-W${Math.ceil((workout.timestamp.getDate()) / 7)}`;
      stats.workoutsByWeek[week] = (stats.workoutsByWeek[week] || 0) + 1;
    });
    
    res.json({
      success: true,
      stats,
      period: parseInt(period)
    });
  } catch (error) {
    console.error('Error fetching workout stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workout statistics',
      error: error.message
    });
  }
};

// Start a workout (update status to in_progress)
export const startWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format',
        error: 'Workout ID must be a valid MongoDB ObjectId'
      });
    }
    
    const workout = await Workout.findByIdAndUpdate(
      workoutId,
      { 
        status: 'in_progress',
        startTime: new Date()
      },
      { new: true }
    );
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Workout started',
      workout
    });
  } catch (error) {
    console.error('Error starting workout:', error);
    
    // Handle specific error types
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format',
        error: 'Workout ID must be a valid MongoDB ObjectId'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to start workout',
      error: error.message
    });
  }
};

// Complete a workout
export const completeWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    const { difficultyRating, satisfactionRating, notes } = req.body;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(workoutId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format',
        error: 'Workout ID must be a valid MongoDB ObjectId'
      });
    }
    
    const workout = await Workout.findByIdAndUpdate(
      workoutId,
      { 
        status: 'completed',
        endTime: new Date(),
        difficultyRating,
        satisfactionRating,
        notes
      },
      { new: true }
    );
    
    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Workout completed successfully',
      workout
    });
  } catch (error) {
    console.error('Error completing workout:', error);
    
    // Handle specific error types
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format',
        error: 'Workout ID must be a valid MongoDB ObjectId'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to complete workout',
      error: error.message
    });
  }
};

// Get workout templates for a user
export const getWorkoutTemplates = async (req, res) => {
  try {
    // Get user ID from Clerk auth
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    const templates = await Workout.find({
      userId,
      isTemplate: true
    }).sort({ templateName: 1 });
    
    res.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Error fetching workout templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch workout templates',
      error: error.message
    });
  }
};

// Create workout from template
export const createWorkoutFromTemplate = async (req, res) => {
  try {
    // Get user ID from Clerk auth
    const userId = req.auth.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const { templateId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(templateId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template ID format',
        error: 'Template ID must be a valid MongoDB ObjectId'
      });
    }
    
    const template = await Workout.findById(templateId);
    
    if (!template || !template.isTemplate) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }
    
    // Create new workout from template
    const workoutData = template.toObject();
    delete workoutData._id;
    delete workoutData.createdAt;
    delete workoutData.updatedAt;
    
    workoutData.userId = userId; // Set the authenticated user's ID
    workoutData.isTemplate = false;
    workoutData.basedOnTemplate = templateId;
    workoutData.status = 'planned';
    workoutData.timestamp = new Date();
    
    // Reset performance data
    workoutData.exercises.forEach(exercise => {
      exercise.sets = exercise.sets.map(set => ({
        ...set,
        reps: 0,
        weight: set.weight ? { ...set.weight, value: 0 } : undefined,
        duration: 0,
        distance: set.distance ? { ...set.distance, value: 0 } : undefined,
        notes: ''
      }));
    });
    
    const workout = new Workout(workoutData);
    await workout.save();
    
    res.status(201).json({
      success: true,
      message: 'Workout created from template',
      workout
    });
  } catch (error) {
    console.error('Error creating workout from template:', error);
    
    // Handle specific error types
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid template ID format',
        error: 'Template ID must be a valid MongoDB ObjectId'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create workout from template',
      error: error.message
    });
  }
};