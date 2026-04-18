// Smart Weekly Planner - Generates AI personalized weekly workout plans
const UserStats = require('../models/UserStats');
const Workout = require('../models/Workout');

// Generate a personalized weekly workout plan
exports.generateWeeklyPlan = async (userId) => {
  try {
    const stats = await UserStats.findOne({ userId });
    const user = await require('../models/User').findById(userId);

    if (!stats) {
      return {
        success: false,
        message: 'No stats available. Complete a few workouts first.'
      };
    }

    const weeklyPlan = [];
    const weakMuscles = stats.weakMuscles || [];
    const fitnessLevel = user?.fitnessGoal || 'maintain';

    // Get user's weekly goal
    const weeklyGoal = stats.weeklyGoal || 4;
    const daysPerWeek = Math.min(weeklyGoal, 6);

    // Create a balanced 7-day plan
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ];

    // Determine which days to train
    const trainingDays = selectTrainingDays(daysPerWeek);

    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const day = days[dayIdx];
      const isTrainingDay = trainingDays.includes(dayIdx);

      if (isTrainingDay) {
        const workout = generateDayWorkout(dayIdx, weakMuscles, fitnessLevel);
        weeklyPlan.push({
          day,
          dayIdx,
          exercises: workout.exercises,
          focus: workout.focus,
          intensity: workout.intensity,
          estimatedDuration: workout.estimatedDuration,
          tips: workout.tips
        });
      } else {
        weeklyPlan.push({
          day,
          dayIdx,
          exercises: [],
          focus: 'Rest Day',
          intensity: 'rest',
          estimatedDuration: 0,
          tips: ['Active recovery', 'Stretching', 'Meal prep for next workout']
        });
      }
    }

    return {
      success: true,
      weeklyPlan,
      totalWeeklyWorkouts: daysPerWeek,
      focusAreas: weakMuscles.slice(0, 2),
      recommendations: generatePlanRecommendations(stats, fitnessLevel),
      nextReviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
  } catch (error) {
    console.error('Error generating weekly plan:', error);
    return { success: false, error: error.message };
  }
};

// Select which days to train (spread across week for recovery)
function selectTrainingDays(count) {
  const patterns = {
    1: [3], // Wednesday
    2: [2, 5], // Wed, Sat
    3: [0, 2, 4], // Mon, Wed, Fri
    4: [0, 2, 4, 6], // Mon, Wed, Fri, Sun
    5: [0, 1, 3, 4, 6], // Mon, Tue, Wed, Thu, Sun
    6: [0, 1, 2, 4, 5, 6] // All except Thursday
  };

  return patterns[count] || patterns[3];
}

// Generate workout for a specific day
function generateDayWorkout(dayIdx, weakMuscles, fitnessLevel) {
  const dayPatterns = {
    // Monday - Upper Body Focus
    0: {
      focus: 'Upper Body',
      intensity: 'moderate',
      exercises: [
        { name: 'Push-ups', reps: '3×8-12', restSeconds: 60 },
        { name: 'Dumbbell Rows', reps: '3×8-12', restSeconds: 60 },
        { name: 'Shoulder Press', reps: '3×6-10', restSeconds: 90 },
        { name: 'Pull-ups', reps: '3×5-10', restSeconds: 90 }
      ]
    },
    // Tuesday - Lower Body Focus
    1: {
      focus: 'Lower Body',
      intensity: 'high',
      exercises: [
        { name: 'Squats', reps: '4×6-10', restSeconds: 120 },
        { name: 'Lunges', reps: '3×8-12 each leg', restSeconds: 60 },
        { name: 'Calf Raises', reps: '3×12-15', restSeconds: 45 },
        { name: 'Leg Press', reps: '3×8-12', restSeconds: 90 }
      ]
    },
    // Wednesday - Core & Cardio
    2: {
      focus: 'Core & Cardio',
      intensity: 'moderate',
      exercises: [
        { name: 'Planks', reps: '3×30-60s', restSeconds: 30 },
        { name: 'Mountain Climbers', reps: '3×20', restSeconds: 45 },
        { name: 'Burpees', reps: '3×10', restSeconds: 60 },
        { name: 'Running/Cycling', reps: '20-30 min', restSeconds: 0 }
      ]
    },
    // Thursday - Active Recovery
    3: {
      focus: 'Active Recovery',
      intensity: 'light',
      exercises: [
        { name: 'Yoga', reps: '30 min', restSeconds: 0 },
        { name: 'Stretching', reps: '15 min', restSeconds: 0 },
        { name: 'Walking', reps: '20 min', restSeconds: 0 }
      ]
    },
    // Friday - Full Body
    4: {
      focus: 'Full Body',
      intensity: 'high',
      exercises: [
        { name: 'Deadlifts', reps: '3×5-8', restSeconds: 120 },
        { name: 'Bench Press', reps: '3×6-10', restSeconds: 90 },
        { name: 'Barbell Rows', reps: '3×6-10', restSeconds: 90 },
        { name: 'Front Squats', reps: '3×6-10', restSeconds: 90 }
      ]
    },
    // Saturday - Power & Explosiveness
    5: {
      focus: 'Power Training',
      intensity: 'high',
      exercises: [
        { name: 'Box Jumps', reps: '3×5', restSeconds: 120 },
        { name: 'Plyometric Push-ups', reps: '3×8-10', restSeconds: 90 },
        { name: 'Medicine Ball Slams', reps: '3×10', restSeconds: 60 },
        { name: 'Sprint Intervals', reps: '8×30 seconds', restSeconds: 90 }
      ]
    },
    // Sunday - Mobility & Flexibility
    6: {
      focus: 'Mobility',
      intensity: 'light',
      exercises: [
        { name: 'Foam Rolling', reps: '15 min', restSeconds: 0 },
        { name: 'Dynamic Stretching', reps: '15 min', restSeconds: 0 },
        { name: 'Tai Chi', reps: '20 min', restSeconds: 0 }
      ]
    }
  };

  let workout = dayPatterns[dayIdx] || dayPatterns[0];

  // Adjust based on weak muscles
  if (weakMuscles.length > 0) {
    workout.weakMusclesFocus = getWeakMuscleExercises(weakMuscles[0]);
  }

  // Adjust based on fitness level
  const adjustedWorkout = adjustForFitnessLevel(workout, fitnessLevel);

  return {
    ...adjustedWorkout,
    estimatedDuration: estimateDuration(adjustedWorkout.exercises),
    tips: generateWorkoutTips(adjustedWorkout.focus, weakMuscles)
  };
}

// Adjust exercises based on fitness level
function adjustForFitnessLevel(workout, level) {
  const adjustments = {
    beginner: { multiplier: 0.7, restMultiplier: 1.3 },
    intermediate: { multiplier: 1, restMultiplier: 1 },
    advanced: { multiplier: 1.3, restMultiplier: 0.8 },
    maintain: { multiplier: 1, restMultiplier: 1 }
  };

  const adj = adjustments[level] || adjustments.intermediate;

  return {
    ...workout,
    exercises: workout.exercises.map(ex => ({
      ...ex,
      intensity: level === 'beginner' ? 'moderate' : level === 'advanced' ? 'high' : 'moderate'
    }))
  };
}

// Get exercises for weak muscles
function getWeakMuscleExercises(weakMuscle) {
  const weakMuscleExercises = {
    'Legs': ['Bulgarian Split Squats', 'Leg Press', 'Hack Squats'],
    'Chest': ['Incline Push-ups', 'Dumbbell Flyes', 'Machine Chest Press'],
    'Back': ['Face Pulls', 'Machine Rows', 'Assisted Pull-ups'],
    'Shoulders': ['Lateral Raises', 'Cable Lateral Raises', 'Reverse Pec Deck'],
    'Arms': ['Preacher Curls', 'Tricep Dips', 'Cable Curls'],
    'Core': ['Hanging Leg Raises', 'Ab Wheel', 'Weighted Planks']
  };

  return weakMuscleExercises[weakMuscle] || [];
}

// Estimate workout duration
function estimateDuration(exercises) {
  const baseTime = exercises.length * 5; // 5 min per exercise
  const additionalTime = exercises.reduce((sum, ex) => {
    if (ex.reps && ex.reps.includes('30')) return sum + 10; // Cardio activities
    if (ex.reps && ex.reps.includes('min')) return sum + 5;
    return sum;
  }, 0);

  return baseTime + additionalTime;
}

// Generate personalized workout tips
function generateWorkoutTips(focus, weakMuscles) {
  const tips = {
    'Upper Body': [
      'Focus on controlled eccentric (lowering) phase',
      'Maintain proper scapular positioning',
      'Full range of motion is key'
    ],
    'Lower Body': [
      'Keep your core tight throughout',
      'Knee alignment is critical',
      'Deep breathing helps with stability'
    ],
    'Core & Cardio': [
      'Maintain steady pace for cardio',
      'Engage core during all movements',
      'Quality over speed'
    ],
    'Full Body': [
      'Progressive overload on compound movements',
      'Adequate rest between sets',
      'Focus on form before adding weight'
    ],
    'Power Training': [
      'Explosive movements require full recovery',
      'Form is even more critical at high intensity',
      'Stop if form breaks down'
    ],
    'Active Recovery': [
      'Focus on breathing and relaxation',
      'This helps muscle recovery',
      'Listen to your body'
    ],
    'Mobility': [
      'Hold stretches for 30-60 seconds',
      'Breathe deeply to improve range',
      'Consistency matters more than intensity'
    ]
  };

  return (
    tips[focus] || tips['Full Body']
  ).concat(
    weakMuscles && weakMuscles.length > 0
      ? [`Extra focus on ${weakMuscles[0]} training`]
      : []
  );
}

// Generate recommendations for the plan
function generatePlanRecommendations(stats, fitnessLevel) {
  const recommendations = [];

  if (stats.currentStreak < 7) {
    recommendations.push({
      type: 'consistency',
      message: 'Build a 7-day streak by following this plan consistently'
    });
  }

  if (stats.weakMuscles && stats.weakMuscles.length > 0) {
    recommendations.push({
      type: 'weak_muscles',
      message: `Add extra exercises for ${stats.weakMuscles[0]} 1-2 times per week`
    });
  }

  if (stats.averagePostureScore < 75) {
    recommendations.push({
      type: 'form',
      message: 'Review form videos before starting. Form is more important than weight.'
    });
  }

  if (stats.totalWorkouts < 10) {
    recommendations.push({
      type: 'progress',
      message: 'Focus on building the habit first. Intensity comes later.'
    });
  }

  return recommendations;
}

// Get existing weekly plan or generate new one
exports.getWeeklyPlan = async (userId) => {
  try {
    // For now, always generate fresh plan
    // In future, could cache with MongoDB
    return await exports.generateWeeklyPlan(userId);
  } catch (error) {
    console.error('Error getting weekly plan:', error);
    return { success: false, error: error.message };
  }
};
