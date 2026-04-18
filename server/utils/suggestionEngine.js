// Suggestion Engine - AI-based workout recommendations
const mongoose = require('mongoose');

class SuggestionEngine {
  // Analyze user workout history and generate suggestions
  static async generateSuggestions(userId) {
    try {
      const Workout = require('../models/Workout');
      const User = require('../models/User');

      // Get user data
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get last 30 days of workouts
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const workouts = await Workout.find({
        userId,
        date: { $gte: thirtyDaysAgo },
      }).sort({ date: -1 });

      if (workouts.length === 0) {
        return {
          suggestions: [
            {
              type: 'beginner',
              priority: 'high',
              message: 'Start with light exercises to build your foundation',
              recommendation: 'Try 2-3 workouts per week focusing on basic compound movements',
              icon: '🏋️',
            },
          ],
          stats: {
            totalWorkouts: 0,
            totalReps: 0,
            avgPostureScore: 0,
            streak: 0,
          },
        };
      }

      // Calculate statistics
      const totalWorkouts = workouts.length;
      const totalReps = workouts.reduce((sum, w) => sum + (w.reps || 0), 0);
      const avgPostureScore = 
        workouts.reduce((sum, w) => sum + (w.postureScore || 0), 0) / totalWorkouts;
      
      // Calculate workout streak
      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (const workout of workouts) {
        const workoutDate = new Date(workout.date);
        workoutDate.setHours(0, 0, 0, 0);

        const dayDiff = Math.floor(
          (currentDate - workoutDate) / (1000 * 60 * 60 * 24)
        );

        if (dayDiff === streak) {
          streak++;
        } else {
          break;
        }
      }

      // Get muscle group breakdown
      const muscleGroupStats = {};
      workouts.forEach((workout) => {
        const muscle = workout.muscleGroup || 'other';
        if (!muscleGroupStats[muscle]) {
          muscleGroupStats[muscle] = { count: 0, avgScore: 0, totalReps: 0 };
        }
        muscleGroupStats[muscle].count++;
        muscleGroupStats[muscle].avgScore += workout.postureScore || 0;
        muscleGroupStats[muscle].totalReps += workout.reps || 0;
      });

      Object.keys(muscleGroupStats).forEach((muscle) => {
        const stats = muscleGroupStats[muscle];
        stats.avgScore = Math.round(stats.avgScore / stats.count);
      });

      // Generate suggestions
      const suggestions = [];

      // 1. Posture improvement
      if (avgPostureScore < 60) {
        suggestions.push({
          type: 'posture',
          priority: 'critical',
          message: 'Your posture needs improvement',
          recommendation:
            'Focus on slow, controlled movements. Do posture correction exercises before your next workout.',
          icon: '🧘',
          action: 'Take posture class',
        });
      } else if (avgPostureScore < 75) {
        suggestions.push({
          type: 'posture',
          priority: 'high',
          message: 'Improve your posture for better results',
          recommendation: 'Your form is okay, but can be better. Practice mirror exercises.',
          icon: '🪞',
          action: 'Practice with mirror',
        });
      }

      // 2. Frequency analysis
      if (totalWorkouts < 3) {
        suggestions.push({
          type: 'frequency',
          priority: 'high',
          message: 'Increase workout frequency',
          recommendation: 'Aim for 3-4 workouts per week for better results',
          icon: '📅',
          action: 'Schedule more workouts',
        });
      }

      // 3. Muscle group balance
      const muscleArray = Object.entries(muscleGroupStats);
      const maxWorkouts = Math.max(...muscleArray.map(([_, stats]) => stats.count));
      const weakMuscles = muscleArray
        .filter(([_, stats]) => stats.count < maxWorkouts / 2)
        .map(([muscle]) => muscle);

      if (weakMuscles.length > 0) {
        suggestions.push({
          type: 'muscle_balance',
          priority: 'medium',
          message: `Focus on ${weakMuscles.join(', ')}`,
          recommendation: `You're neglecting ${weakMuscles.join(', ')}. Add these muscle groups to balance your training.`,
          icon: '⚖️',
          action: 'Add balanced exercises',
        });
      }

      // 4. Streak encouragement
      if (streak >= 7) {
        suggestions.push({
          type: 'motivation',
          priority: 'low',
          message: `Awesome! ${streak}-day streak! 🔥`,
          recommendation: `Keep going! You've built great consistency. Maintain this momentum.`,
          icon: '🎯',
          action: 'Keep going',
        });
      } else if (streak === 0 && totalWorkouts > 0) {
        suggestions.push({
          type: 'motivation',
          priority: 'high',
          message: 'Start a new streak today',
          recommendation: 'Get back on track with a quick workout today',
          icon: '💪',
          action: 'Start workout',
        });
      }

      // 5. Performance analysis
      if (totalReps > 0) {
        const recentReps = workouts.slice(0, 5).reduce((sum, w) => sum + (w.reps || 0), 0);
        const previousReps = workouts.slice(5, 10).reduce((sum, w) => sum + (w.reps || 0), 0);

        if (previousReps > 0 && recentReps < previousReps) {
          suggestions.push({
            type: 'performance',
            priority: 'medium',
            message: 'Your reps are decreasing',
            recommendation: 'Try lighter weight or more rest days. Recovery is important!',
            icon: '⏰',
            action: 'Rest and recover',
          });
        } else if (recentReps > previousReps) {
          suggestions.push({
            type: 'performance',
            priority: 'low',
            message: 'Great progress! Your reps are increasing',
            recommendation: 'You can consider increasing the weight or intensity.',
            icon: '📈',
            action: 'Level up difficulty',
          });
        }
      }

      // Sort by priority
      suggestions.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      return {
        suggestions: suggestions.slice(0, 5), // Top 5 suggestions
        stats: {
          totalWorkouts,
          totalReps,
          avgPostureScore: Math.round(avgPostureScore),
          streak,
          muscleGroupStats,
        },
        nextRecommendation: suggestions[0] || null,
      };
    } catch (err) {
      console.error('Error generating suggestions:', err);
      throw err;
    }
  }

  // Get diet recommendations based on user data
  static async generateDietPlan(userId) {
    try {
      const User = require('../models/User');
      const Workout = require('../models/Workout');

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Get weekly stats
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const workouts = await Workout.find({
        userId,
        date: { $gte: sevenDaysAgo },
      });

      const totalCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0);
      const avgCaloriesPerDay = totalCalories / 7;

      // Calculate macro recommendations
      const bodyweight = user.weight || 70; // kg, default 70
      const goal = user.goal || 'maintenance'; // muscle_gain, fat_loss, maintenance

      let calories, protein, carbs, fats;

      if (goal === 'muscle_gain') {
        calories = bodyweight * 35; // 35 cal/kg for muscle gain
        protein = bodyweight * 2.2; // 2.2g/kg protein
        carbs = bodyweight * 4; // 4g/kg carbs
        fats = bodyweight * 1; // 1g/kg fats
      } else if (goal === 'fat_loss') {
        calories = bodyweight * 25; // 25 cal/kg for fat loss
        protein = bodyweight * 2.5; // Higher protein for retention
        carbs = bodyweight * 2.5;
        fats = bodyweight * 0.8;
      } else {
        // maintenance
        calories = bodyweight * 30;
        protein = bodyweight * 1.8;
        carbs = bodyweight * 3;
        fats = bodyweight * 1;
      }

      const dietPlan = {
        goal,
        bodyweight,
        dailyCalories: Math.round(calories),
        macros: {
          protein: { grams: Math.round(protein), calories: Math.round(protein * 4) },
          carbs: { grams: Math.round(carbs), calories: Math.round(carbs * 4) },
          fats: { grams: Math.round(fats), calories: Math.round(fats * 9) },
        },
        mealPlan: {
          breakfast: {
            description: 'High protein, moderate carbs',
            examples: [
              'Oatmeal with eggs and banana',
              'Greek yogurt with granola',
              'Pancakes with protein powder',
            ],
            calories: Math.round(calories * 0.25),
            protein: Math.round(protein * 0.25),
          },
          lunch: {
            description: 'Balanced meal with protein and carbs',
            examples: [
              'Chicken breast with rice and vegetables',
              'Salmon with sweet potato',
              'Lean beef with quinoa',
            ],
            calories: Math.round(calories * 0.35),
            protein: Math.round(protein * 0.35),
          },
          snack: {
            description: 'Quick protein source',
            examples: [
              'Protein shake',
              'Greek yogurt',
              'Protein bar',
              'Nuts and fruit',
            ],
            calories: Math.round(calories * 0.15),
            protein: Math.round(protein * 0.15),
          },
          dinner: {
            description: 'Protein-rich, lighter on carbs',
            examples: [
              'Fish with vegetables',
              'Lean turkey with broccoli',
              'Chicken with salad',
            ],
            calories: Math.round(calories * 0.25),
            protein: Math.round(protein * 0.25),
          },
        },
        tips: [
          'Drink at least 3 liters of water daily',
          'Eat protein within 2 hours post-workout',
          'Include vegetables in every meal',
          'Time carbs around workouts',
          'Adjust portions based on hunger and energy levels',
        ],
      };

      return dietPlan;
    } catch (err) {
      console.error('Error generating diet plan:', err);
      throw err;
    }
  }
}

module.exports = SuggestionEngine;
