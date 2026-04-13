// Performance Scoring - Calculates performance score and AI suggestions
export class PerformanceScorer {
  // Calculate performance score based on multiple factors
  static calculatePerformanceScore(workoutData) {
    const {
      postureScore = 0,
      reps = 0,
      targetReps = 10,
      previousAvgReps = 10,
      consistency = 0,
    } = workoutData;

    // Posture score: 40% weight
    const postureWeight = (postureScore / 100) * 0.4;

    // Reps score: 30% weight (based on target achievement)
    const repRatio = Math.min(reps / targetReps, 1.0);
    const repsWeight = repRatio * 0.3;

    // Consistency score: 30% weight
    const consistencyData = consistency || {
      uniformity: 0.7,
      speed: 0.8,
    };
    const consistencyScore =
      ((consistencyData.uniformity + consistencyData.speed) / 2) * 0.3;

    const totalScore = (postureWeight + repsWeight + consistencyScore) * 100;
    return Math.round(Math.min(totalScore, 100));
  }

  // Generate AI suggestions based on performance
  static generateSuggestions(workoutData) {
    const suggestions = [];
    const {
      postureScore = 0,
      reps = 0,
      targetReps = 10,
      previousAvgReps = 10,
      performanceScore = 0,
    } = workoutData;

    // Posture suggestions
    if (postureScore < 60) {
      suggestions.push({
        type: 'posture',
        priority: 'high',
        message: 'Focus on maintaining proper form. Your posture score is below 60%.',
        tip: 'Watch your form in a mirror and slow down your movements.',
      });
    } else if (postureScore < 80) {
      suggestions.push({
        type: 'posture',
        priority: 'medium',
        message: 'Slight form improvements needed.',
        tip: 'Keep your core tight and maintain steady breathing.',
      });
    }

    // Rep performance suggestions
    if (reps < targetReps * 0.7) {
      suggestions.push({
        type: 'reps',
        priority: 'high',
        message: `You completed only ${reps}/${targetReps} target reps.`,
        tip: 'Try using lighter weights or taking shorter breaks between sets.',
      });
    } else if (reps > targetReps * 1.2) {
      suggestions.push({
        type: 'reps',
        priority: 'low',
        message: 'Great work! You exceeded your target reps.',
        tip: 'Consider increasing weight or reps next time.',
      });
    }

    // Consistency suggestions
    if (reps < previousAvgReps * 0.8) {
      suggestions.push({
        type: 'consistency',
        priority: 'medium',
        message: 'Your performance is below your average.',
        tip: 'Ensure you are rested and hydrated before workouts.',
      });
    }

    // Overall performance
    if (performanceScore < 50) {
      suggestions.push({
        type: 'overall',
        priority: 'high',
        message: 'Overall performance needs improvement.',
        tip: 'Focus on form first, then gradually increase intensity.',
      });
    } else if (performanceScore >= 80) {
      suggestions.push({
        type: 'overall',
        priority: 'low',
        message: 'Excellent performance! Keep it up!',
        tip: 'Challenge yourself with progressive overload.',
      });
    }

    return suggestions.length > 0
      ? suggestions
      : [
        {
          type: 'overall',
          priority: 'low',
          message: 'Good workout!',
          tip: 'Continue with your current routine.',
        },
      ];
  }

  // Generate workout plan recommendations
  static generateWorkoutPlan(userProfile) {
    const { fitnessGoal, age, weight, height } = userProfile;
    const bmi = weight / ((height / 100) ** 2);

    const plan = {
      goal: fitnessGoal,
      recommendation: '',
      exercises: [],
      frequency: '',
      duration: '',
    };

    // Recommendations based on fitness goal
    switch (fitnessGoal) {
      case 'weight_loss':
        plan.recommendation =
          'Focus on high-intensity cardio and circuit training with moderate resistance.';
        plan.exercises = ['squat', 'burpee', 'push_up', 'sit_up'];
        plan.frequency = '5-6 days per week';
        plan.duration = '45-60 minutes per session';
        break;

      case 'muscle_gain':
        plan.recommendation =
          'Focus on strength training with progressive overload and adequate rest.';
        plan.exercises = ['squat', 'dumbbell_curl', 'push_up', 'pull_up'];
        plan.frequency = '4-5 days per week';
        plan.duration = '60-90 minutes per session';
        break;

      case 'endurance':
        plan.recommendation = 'Focus on high-rep, moderate intensity exercises.';
        plan.exercises = ['squat', 'push_up', 'burpee'];
        plan.frequency = '5-6 days per week';
        plan.duration = '30-45 minutes per session';
        break;

      case 'flexibility':
        plan.recommendation =
          'Focus on controlled movements with full range of motion.';
        plan.exercises = ['plank', 'push_up', 'squat'];
        plan.frequency = '4-5 days per week';
        plan.duration = '30-40 minutes per session';
        break;

      default:
        plan.recommendation = 'Maintain a balanced fitness routine.';
        plan.exercises = ['squat', 'push_up', 'burpee', 'sit_up'];
        plan.frequency = '4-5 days per week';
        plan.duration = '45-60 minutes per session';
    }

    return plan;
  }

  // Estimate calories burned based on exercise
  static estimateCaloriesBurned(exerciseType, duration, intensity) {
    // Base calories per minute for different exercises
    const calorieRates = {
      squat: 6,
      push_up: 7,
      pull_up: 8,
      sit_up: 5,
      burpee: 9,
      plank: 4,
      dumbbell_curl: 5,
      other: 5,
    };

    const baseRate = calorieRates[exerciseType] || 5;
    const intensityMultiplier = intensity / 100; // 0-1

    return Math.round(baseRate * duration * intensityMultiplier);
  }
}

export default PerformanceScorer;
