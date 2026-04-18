const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Route for generating personalized fitness & diet plan
router.post('/diet', aiController.getDietPlan);

// Route for AI Coach Chat
router.post('/coach', aiController.askAICoach);

// Route for generating workout plan
router.post('/generate-workout', aiController.generateWorkoutPlan);

module.exports = router;
