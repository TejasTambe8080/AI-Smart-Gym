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

    return suggestions;
  }

  // Estimate calories burned based on exercise type, duration, and performance
  static estimateCaloriesBurned(exerciseType, durationMinutes, performanceScore) {
    const baseCalories = {
      squat: 5.0, // calories per minute
      push_up: 4.0,
      pull_up: 6.0,
      sit_up: 3.0,
      burpee: 8.0,
      other: 4.0,
    };

    const baseRate = baseCalories[exerciseType] || baseCalories.other;
    const performanceMultiplier = 0.8 + (performanceScore / 100) * 0.4; // 0.8 to 1.2 multiplier
    
    const totalCalories = Math.round(baseRate * durationMinutes * performanceMultiplier);
    return totalCalories;
  }
}

export default PerformanceScorer;
