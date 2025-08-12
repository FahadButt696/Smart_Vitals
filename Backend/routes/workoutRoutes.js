import express from 'express';
import axios from 'axios';
import {
  getUserWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats,
  startWorkout,
  completeWorkout,
  getWorkoutTemplates,
  createWorkoutFromTemplate,
  getExerciseDatabase
} from '../controllers/workoutController.js';
import { clerkAuthMiddleware } from '../middleware/clerkMiddleWare.js';

const router = express.Router();

// Exercise Database Routes (public - no auth required)
router.get('/exercises/database', getExerciseDatabase);

// Simple test endpoint for Wger API (remove in production)
router.get('/exercises/test', async (req, res) => {
  try {
    console.log('Testing basic Wger API connection...');
    
    const response = await axios.get('https://wger.de/api/v2/exercise/?limit=3&language=en', {
      timeout: 10000,
      headers: {
        'User-Agent': 'SmartVitals/1.0',
        'Accept': 'application/json'
      }
    });
    
    console.log('Basic test successful:', response.status);
    console.log('Response structure:', Object.keys(response.data || {}));
    console.log('Results count:', response.data?.results?.length || 0);
    
    if (response.data?.results?.[0]) {
      const firstExercise = response.data.results[0];
      console.log('First exercise structure:', Object.keys(firstExercise));
      console.log('First exercise name:', firstExercise.name);
      console.log('First exercise category:', firstExercise.category);
      console.log('First exercise muscles:', firstExercise.muscles);
    }
    
    res.json({
      success: true,
      message: 'Basic Wger API test successful',
      status: response.status,
      resultsCount: response.data?.results?.length || 0,
      sampleExercise: response.data?.results?.[0] || null
    });
  } catch (error) {
    console.error('Basic Wger API test failed:', error.message);
    res.json({
      success: false,
      message: 'Basic Wger API test failed',
      error: error.message
    });
  }
});

// Debug endpoint to test Wger API (remove in production)
router.get('/exercises/debug', async (req, res) => {
  try {
    console.log('Testing Wger API connection...');
    
    // Test different endpoints and parameters
    const testUrls = [
      'https://wger.de/api/v2/exercise/?limit=5&language=en',
      'https://wger.de/api/v2/exercise/?limit=5&category=10&language=en',
      'https://wger.de/api/v2/exercise/?limit=5&muscles=1&language=en',
      'https://wger.de/api/v2/exercise/?limit=5&equipment=3&language=en'
    ];
    
    const results = [];
    
    for (const url of testUrls) {
      try {
        console.log(`Testing URL: ${url}`);
        const response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'SmartVitals/1.0'
          }
        });
        
        const sampleExercise = response.data.results?.[0];
        console.log(`URL ${url} successful:`, response.status);
        console.log('Sample exercise structure:', Object.keys(sampleExercise || {}));
        
        results.push({
          url,
          status: response.status,
          count: response.data.count,
          sampleKeys: Object.keys(sampleExercise || {}),
          sampleExercise: sampleExercise
        });
      } catch (urlError) {
        console.error(`URL ${url} failed:`, urlError.message);
        results.push({
          url,
          error: urlError.message
        });
      }
    }
    
    res.json({
      success: true,
      message: 'Wger API debug test completed',
      results
    });
  } catch (error) {
    console.error('Wger API debug test failed:', error.message);
    res.json({
      success: false,
      message: 'Wger API debug test failed',
      error: error.message
    });
  }
});

// Protected Workout Routes (require authentication)
router.use(clerkAuthMiddleware);

// Workout CRUD Routes
router.get('/user', getUserWorkouts);

// Statistics Routes - MUST come before /:workoutId route
router.get('/stats', getWorkoutStats);

// Template Routes
router.get('/templates', getWorkoutTemplates);
router.post('/template/:templateId/create', createWorkoutFromTemplate);

// Workout Action Routes
router.post('/:workoutId/start', startWorkout);
router.post('/:workoutId/complete', completeWorkout);

// Workout CRUD Routes with ID parameter - MUST come last
router.get('/:workoutId', getWorkoutById);
router.post('/', createWorkout);
router.put('/:workoutId', updateWorkout);
router.delete('/:workoutId', deleteWorkout);

export default router;