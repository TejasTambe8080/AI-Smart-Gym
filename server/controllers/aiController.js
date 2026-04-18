const geminiService = require('../services/geminiService');

exports.getDietPlan = async (req, res) => {
  try {
    const { height, weight, goal, activityLevel, workoutHistory } = req.body;

    if (!height || !weight || !goal) {
      return res.status(400).json({ success: false, message: 'Height, weight, and goal are required' });
    }

    const userData = { height, weight, goal, activityLevel, workoutHistory };
    const plan = await geminiService.generateFitnessPlan(userData);

    res.status(200).json({ success: true, data: plan });
  } catch (err) {
    console.error('Error in getDietPlan controller:', err);
    res.status(500).json({ success: false, message: 'Failed to generate AI diet plan', error: err.message });
  }
};

exports.askAICoach = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    const reply = await geminiService.generateAICoachResponse(query);

    res.status(200).json({ success: true, reply });
  } catch (err) {
    console.error('Error in askAICoach controller:', err);
    res.status(500).json({ success: false, message: 'Failed to get AI coach response', error: err.message });
  }
};

exports.generateWorkoutPlan = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    const reply = await geminiService.generateAICoachResponse(query);

    res.status(200).json({ success: true, reply });
  } catch (err) {
    console.error('Error in generateWorkoutPlan controller:', err);
    res.status(500).json({ success: false, message: 'Failed to generate workout plan', error: err.message });
  }
};
