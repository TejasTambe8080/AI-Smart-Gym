const Diet = require('../models/Diet');
const Suggestion = require('../models/Suggestion');
const Insight = require('../models/Insight');
const { generateAIResponse } = require('../services/geminiService');

// Get AI Diet Plan
exports.getDietPlan = async (req, res) => {
  try {
    const { height, weight, goal } = req.body;
    const userId = req.user.id;

    // Check if diet plan already exists for this user in cache
    let existingDiet = await Diet.findOne({ userId });

    if (existingDiet) {
      return res.status(200).json({
        success: true,
        data: existingDiet
      });
    }

    // If not exists, generate using Gemini
    const prompt = `
      Act as a professional fitness trainer and nutritionist.
      
      User Data:
      Height: ${height} cm
      Weight: ${weight} kg
      Goal: ${goal}
      
      Generate a detailed diet plan. 
      IMPORTANT: Return the response in a structured string that I can easily parse.
      Include:
      1. Daily calories
      2. Protein intake
      3. Meal plan (breakfast, lunch, dinner)
      4. Health tips
      
      Keep the formatting clean and professional.
    `;

    const aiResponseText = await generateAIResponse(prompt);

    // Create new diet record
    const newDiet = new Diet({
      userId,
      height,
      weight,
      goal,
      rawResponse: aiResponseText,
      plan: {
        // We'll store the whole response in rawResponse for now, 
        // but we could try to split it if we used a more specific prompt.
        // For simplicity and robustness with LLMs, we'll return the string.
      }
    });

    await newDiet.save();

    res.status(201).json({
      success: true,
      data: newDiet
    });
  } catch (error) {
    console.error('Diet Generation Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get AI Workout Suggestions
exports.getWorkoutSuggestions = async (req, res) => {
  try {
    const { weakMuscles, postureScore, streak } = req.body;
    const userId = req.user.id;

    let existingSuggestion = await Suggestion.findOne({ userId });

    if (existingSuggestion) {
      return res.status(200).json({
        success: true,
        data: existingSuggestion
      });
    }

    const prompt = `
      User workout stats:
      Weak muscles: ${weakMuscles.join(', ')}
      Posture score: ${postureScore}%
      Streak: ${streak} days
      
      Act as a professional gym coach.
      Generate:
      1. Improvement suggestions for the identified weak muscles.
      2. Workout advice to maintain or improve the posture score.
      3. Recovery tips based on the current streak.
      
      Keep it motivational and actionable.
    `;

    const aiResponseText = await generateAIResponse(prompt);

    const newSuggestion = new Suggestion({
      userId,
      weakMuscles,
      postureScore,
      streak,
      suggestions: aiResponseText
    });

    await newSuggestion.save();

    res.status(201).json({
      success: true,
      data: newSuggestion
    });
  } catch (error) {
    console.error('Suggestions Generation Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get AI Performance Insights (Comparative Analysis)
exports.getPerformanceInsights = async (req, res) => {
  try {
    const { postureScore, totalWorkouts, weakMuscles } = req.body;
    const userId = req.user?.id || req.userId;

    let existingInsight = await Insight.findOne({ userId });

    if (existingInsight) {
      return res.status(200).json({
        success: true,
        data: existingInsight
      });
    }

    const prompt = `
      User stats:
      Posture score: ${postureScore || 85}%
      Total workouts: ${totalWorkouts || 0}
      Weak muscles: ${Array.isArray(weakMuscles) ? weakMuscles.join(', ') : 'None identified'}
      
      Act as an elite biometric performance analyst.
      Based on the past week data, provide 3 short, punchy insights into the user's performance and injury risks.
      Do not use JSON formatting. Provide a readable string summary with clear headers and bullet points.
    `;

    const aiResponseText = await generateAIResponse(prompt);

    const newInsight = new Insight({
      userId,
      postureScore: postureScore || 85,
      totalWorkouts: totalWorkouts || 0,
      insights: aiResponseText
    });

    await newInsight.save();

    res.status(200).json({ 
      success: true, 
      data: newInsight
    });

  } catch (error) {
    console.error('Insights Synthesis Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

