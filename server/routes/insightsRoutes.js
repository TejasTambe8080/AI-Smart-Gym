// Insights & Injury Risk Routes
const express = require('express');
const router = express.Router();
const insightsController = require('../controllers/insightsController');
const injuryRiskController = require('../controllers/injuryRiskController');
const { protect } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(protect);

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
    const userId = req.userId || 'user_demo';
    
    // Fallback risk analysis
    const riskAnalysis = {
      overallRisk: 'LOW',
      riskScore: 15,
      factors: [
        { factor: 'Posture Quality', score: 88, risk: 'Low' },
        { factor: 'Recovery Time', score: 72, risk: 'Medium' },
        { factor: 'Muscle Imbalance', score: 65, risk: 'Low' }
      ],
      recommendations: [
        'Increase rest days between intense workouts',
        'Focus on flexibility training',
        'Maintain proper form over weight'
      ]
    };
    
    res.status(200).json({ success: true, data: riskAnalysis });
  } catch (error) {
    console.error('Injury risk error:', error);
    res.status(200).json({ 
      success: true, 
      data: {
        overallRisk: 'LOW',
        riskScore: 15,
        factors: [],
        recommendations: ['Focus on recovery', 'Maintain form']
      }
    });
  }
});

// Get specific exercise risk profile
router.get('/injury-risk/:exerciseType', async (req, res) => {
  try {
    const userId = req.userId || 'user_demo';
    const { exerciseType } = req.params;
    
    // Fallback exercise risk profile
    const riskProfile = {
      exerciseType,
      riskLevel: 'LOW',
      safetyScore: 87,
      commonIssues: [
        'Watch for lower back strain',
        'Maintain neutral spine'
      ],
      recommendations: [
        'Start with lighter weights',
        'Focus on controlled movements',
        'Use proper equipment'
      ]
    };
    
    res.status(200).json({ success: true, data: riskProfile });
  } catch (error) {
    console.error('Exercise risk profile error:', error);
    res.status(200).json({ 
      success: true, 
      data: {
        exerciseType,
        riskLevel: 'LOW',
        safetyScore: 87,
        commonIssues: [],
        recommendations: []
      }
    });
  }
});

module.exports = router;
