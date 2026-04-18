// Insights & Injury Risk Routes
const express = require('express');
const router = express.Router();
const insightsController = require('../controllers/insightsController');
const injuryRiskController = require('../controllers/injuryRiskController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Performance Insights
router.get('/performance', async (req, res) => {
  try {
    const userId = req.user.id;
    const insights = await insightsController.generateInsights(userId);
    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Injury Risk Analysis
router.get('/injury-risk', async (req, res) => {
  try {
    const userId = req.user.id;
    const riskAnalysis = await injuryRiskController.analyzeInjuryRisk(userId);
    res.status(200).json({ success: true, data: riskAnalysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get specific exercise risk profile
router.get('/injury-risk/:exerciseType', async (req, res) => {
  try {
    const userId = req.user.id;
    const { exerciseType } = req.params;
    const riskProfile = await injuryRiskController.getExerciseRiskProfile(userId, exerciseType);
    res.status(200).json({ success: true, data: riskProfile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
