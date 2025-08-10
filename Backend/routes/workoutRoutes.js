import express from 'express';
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