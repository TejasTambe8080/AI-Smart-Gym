const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// All AI routes are protected
router.use(protect);

router.post('/diet', aiController.getDietPlan);
router.post('/suggestions', aiController.getWorkoutSuggestions);
router.post('/insights', aiController.getPerformanceInsights);

module.exports = router;
