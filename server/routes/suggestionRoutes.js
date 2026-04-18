// Suggestion Routes - API endpoints for recommendations and diet
const express = require('express');
const {
  getSuggestions,
  getDietPlan,
  getRecommendations,
} = require('../controllers/suggestionController');

const router = express.Router();

// Get suggestions for a user
router.get('/suggestions/:userId', getSuggestions);

// Get diet plan for a user
router.get('/diet/:userId', getDietPlan);

// Get all recommendations (suggestions + diet)
router.get('/recommendations/:userId', getRecommendations);

module.exports = router;
