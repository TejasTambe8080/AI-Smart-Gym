// AI Performance Insights Engine - Generates coaching insights from data
const Workout = require('../models/Workout');
const UserStats = require('../models/UserStats');

// Generate insights from user stats and history
exports.generateInsights = async (userId) => {
  try {
    const stats = await UserStats.findOne({ userId });
    if (!stats) {
      return { insights: [], trends: {} };
    }

    const workouts = await Workout.find({ userId }).sort({ date: -1 }).limit(100);
    
    const insights = [];
    const trends = {};

    // 1. Posture Improvement Analysis (last 7 vs last 30 days)
    const postureImprovement = await analyzePostureImprovement(workouts);
    if (postureImprovement.improvement > 0) {
      insights.push({
        type: 'posture_improvement',
        title: '🎯 Form Getting Better!',
        message: `Your posture improved by ${postureImprovement.improvement}% this week`,
        details: `From ${postureImprovement.lastMonthAvg}% to ${postureImprovement.lastWeekAvg}%`,
        severity: 'success',
        actionable: true
      });
    } else if (postureImprovement.improvement < -5) {
      insights.push({
        type: 'posture_decline',
        title: '⚠️ Form Needs Attention',
        message: `Your posture score declined by ${Math.abs(postureImprovement.improvement)}% this week`,
        details: 'Focus on controlled movements and proper form',
        severity: 'warning',
        actionable: true
      });
    }

    // 2. Muscle Imbalance Detection
    const imbalance = await detectMuscleImbalance(workouts, stats.weakMuscles);
    if (imbalance.primaryWeak && imbalance.imbalancePercent > 15) {
      insights.push({
        type: 'muscle_imbalance',
        title: '💪 Muscle Imbalance Detected',
        message: `Your ${imbalance.primaryWeak} is ${imbalance.imbalancePercent}% undertrained vs ${imbalance.primaryStrong}`,
        details: `To prevent injury, add ${imbalance.recommendation} exercises`,
        severity: 'warning',
        actionable: true,
        recommendation: `Focus on ${imbalance.primaryWeak} training`
      });
    }

    // 3. Consistency Analysis
    const consistency = await analyzeConsistency(workouts);
    if (consistency.trend === 'increasing') {
      insights.push({
        type: 'consistency_up',
        title: '🔥 You\'re on a Roll!',
        message: `Your consistency improved by ${consistency.trendPercent}% this week`,
        details: `Keep up the momentum—you're building a strong habit`,
        severity: 'success',
        actionable: false
      });
    } else if (consistency.trend === 'decreasing' && consistency.trendPercent > 20) {
      insights.push({
        type: 'consistency_down',
        title: '⚡ Maintain Your Momentum',
        message: `Your consistency dropped—${consistency.daysWithoutWorkout} days since last workout`,
        details: `Get back on track with 3 workouts this week`,
        severity: 'caution',
        actionable: true
      });
    }

    // 4. Plateau Detection
    const plateau = detectPlateau(workouts);
    if (plateau.isPlateau) {
      insights.push({
        type: 'plateau_warning',
        title: '📈 Approaching Plateau',
        message: `Your progress may plateau in ${plateau.daysUntilPlateau} days`,
        details: 'Time to increase intensity, add new exercises, or change rep ranges',
        severity: 'caution',
        actionable: true
      });
    }

    // 5. Strength Progress
    const strengthProgress = analyzeStrengthProgress(workouts);
    if (strengthProgress.progressPercent > 10) {
      insights.push({
        type: 'strength_gain',
        title: '💥 You\'re Getting Stronger!',
        message: `Your reps/strength increased by ${strengthProgress.progressPercent}%`,
        details: `Average reps: ${strengthProgress.lastWeekAvg} → Keep challenging yourself!`,
        severity: 'success',
        actionable: false
      });
    }

    // 6. Recovery Recommendation
    const recovery = analyzeRecovery(workouts);
    if (recovery.needsRest) {
      insights.push({
        type: 'recovery_needed',
        title: '😴 Time to Rest',
        message: `You\'ve trained ${recovery.consecutiveDays} days in a row`,
        details: 'Take a rest day to optimize recovery and prevent burnout',
        severity: 'caution',
        actionable: true
      });
    }

    // 7. Next Milestone
    const nextMilestone = getNextMilestone(stats.currentStreak, stats.totalXP, stats.totalWorkouts);
    insights.push({
      type: 'next_milestone',
      title: `🎯 Next Goal: ${nextMilestone.name}`,
      message: nextMilestone.message,
      details: nextMilestone.details,
      severity: 'info',
      actionable: false,
      progress: nextMilestone.progress
    });

    // Prepare trends data
    trends.postureImprovement = postureImprovement;
    trends.muscleImbalance = imbalance;
    trends.consistency = consistency;
    trends.strengthProgress = strengthProgress;

    return {
      insights: insights.slice(0, 5), // Return top 5 insights
      trends,
      generatedAt: new Date()
    };
  } catch (error) {
    console.error('Error generating insights:', error);
    return { insights: [], trends: {}, error: error.message };
  }
};

// Analyze posture improvement over time
async function analyzePostureImprovement(workouts) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const lastWeekWorkouts = workouts.filter(w => new Date(w.date) >= sevenDaysAgo);
  const lastMonthWorkouts = workouts.filter(w => new Date(w.date) >= thirtyDaysAgo);

  const lastWeekAvg = lastWeekWorkouts.length > 0
    ? Math.round(lastWeekWorkouts.reduce((sum, w) => sum + (w.postureScore || 0), 0) / lastWeekWorkouts.length)
    : 0;

  const lastMonthAvg = lastMonthWorkouts.length > 0
    ? Math.round(lastMonthWorkouts.reduce((sum, w) => sum + (w.postureScore || 0), 0) / lastMonthWorkouts.length)
    : 0;

  const improvement = lastWeekAvg - lastMonthAvg;

  return {
    lastWeekAvg,
    lastMonthAvg,
    improvement,
    workoutCount: lastWeekWorkouts.length
  };
}

// Detect muscle imbalance
async function detectMuscleImbalance(workouts, weakMuscles) {
  const muscleFrequency = {};
  workouts.slice(0, 30).forEach(workout => {
    const muscle = getMuscleFromExercise(workout.exerciseType);
    muscleFrequency[muscle] = (muscleFrequency[muscle] || 0) + 1;
  });

  const allMuscles = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
  const sorted = Object.entries(muscleFrequency)
    .sort(([, a], [, b]) => b - a)
    .map(([muscle, freq]) => ({ muscle, freq }));

  const primaryStrong = sorted[0]?.muscle || 'Chest';
  const primaryWeak = sorted[sorted.length - 1]?.muscle || 'Back';
  const strongFreq = muscleFrequency[primaryStrong] || 1;
  const weakFreq = muscleFrequency[primaryWeak] || 0;

  const imbalancePercent = strongFreq > 0 
    ? Math.round(((strongFreq - weakFreq) / strongFreq) * 100)
    : 0;

  return {
    primaryStrong,
    primaryWeak,
    imbalancePercent,
    recommendation: `${Math.ceil((strongFreq - weakFreq + 1) / 2)} ${primaryWeak.toLowerCase()} workouts`
  };
}

// Analyze consistency trend
async function analyzeConsistency(workouts) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const lastWeek = workouts.filter(w => new Date(w.date) >= sevenDaysAgo).length;
  const lastTwoWeeks = workouts.filter(w => new Date(w.date) >= fourteenDaysAgo).length;

  const previousWeek = lastTwoWeeks - lastWeek;
  const trend = lastWeek > previousWeek ? 'increasing' : lastWeek < previousWeek ? 'decreasing' : 'stable';
  const trendPercent = previousWeek > 0 
    ? Math.round(((lastWeek - previousWeek) / previousWeek) * 100)
    : 0;

  // Days without workout
  const lastWorkoutDate = workouts.length > 0 ? new Date(workouts[0].date) : null;
  const today = new Date();
  const daysWithoutWorkout = lastWorkoutDate 
    ? Math.floor((today - lastWorkoutDate) / (1000 * 60 * 60 * 24))
    : 999;

  return {
    thisWeek: lastWeek,
    lastWeek: previousWeek,
    trend,
    trendPercent: Math.abs(trendPercent),
    daysWithoutWorkout
  };
}

// Detect plateau (similar performance over multiple workouts)
function detectPlateau(workouts) {
  if (workouts.length < 5) {
    return { isPlateau: false, daysUntilPlateau: 30 };
  }

  const recent = workouts.slice(0, 5);
  const reps = recent.map(w => w.reps || 0);
  const avgReps = reps.reduce((a, b) => a + b) / reps.length;
  const variance = reps.reduce((sum, rep) => sum + Math.pow(rep - avgReps, 2), 0) / reps.length;
  const stdDev = Math.sqrt(variance);

  // Plateau if std deviation is < 10% of mean
  const isPlateau = stdDev < (avgReps * 0.1);
  const daysUntilPlateau = isPlateau ? 3 : 15;

  return { isPlateau, daysUntilPlateau };
}

// Analyze strength progress
function analyzeStrengthProgress(workouts) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const lastWeekWorkouts = workouts.filter(w => new Date(w.date) >= sevenDaysAgo);
  const lastMonthWorkouts = workouts.filter(w => new Date(w.date) >= thirtyDaysAgo);

  const lastWeekAvg = lastWeekWorkouts.length > 0
    ? Math.round(lastWeekWorkouts.reduce((sum, w) => sum + (w.reps || 0), 0) / lastWeekWorkouts.length)
    : 0;

  const lastMonthAvg = lastMonthWorkouts.length > 0
    ? Math.round(lastMonthWorkouts.reduce((sum, w) => sum + (w.reps || 0), 0) / lastMonthWorkouts.length)
    : 0;

  const progressPercent = lastMonthAvg > 0
    ? Math.round(((lastWeekAvg - lastMonthAvg) / lastMonthAvg) * 100)
    : 0;

  return {
    lastWeekAvg,
    lastMonthAvg,
    progressPercent
  };
}

// Analyze recovery needs
function analyzeRecovery(workouts) {
  let consecutiveDays = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const workout of workouts) {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - consecutiveDays);

    if (workoutDate.getTime() === expectedDate.getTime()) {
      consecutiveDays++;
    } else {
      break;
    }
  }

  return {
    consecutiveDays,
    needsRest: consecutiveDays >= 5
  };
}

// Get next milestone
function getNextMilestone(streak, totalXP, totalWorkouts) {
  const milestones = [
    { name: '7-Day Streak', target: 7, current: streak, type: 'streak' },
    { name: '50 Workouts', target: 50, current: totalWorkouts, type: 'workouts' },
    { name: 'Level 5', target: 5000, current: totalXP, type: 'xp' }
  ];

  let closest = milestones[0];
  let minDiff = closest.target - closest.current;

  for (const milestone of milestones) {
    const diff = milestone.target - milestone.current;
    if (diff > 0 && diff < minDiff) {
      closest = milestone;
      minDiff = diff;
    }
  }

  return {
    name: closest.name,
    message: `You're ${minDiff > 0 ? minDiff : 'only'} ${closest.type === 'streak' ? 'days' : closest.type === 'workouts' ? 'workouts' : 'XP'} away!`,
    details: `${closest.current} / ${closest.target} (${Math.round((closest.current / closest.target) * 100)}%)`,
    progress: Math.round((closest.current / closest.target) * 100)
  };
}

// Helper: Get muscle from exercise type
function getMuscleFromExercise(exerciseType) {
  const muscleMap = {
    'squat': 'Legs',
    'push_up': 'Chest',
    'pull_up': 'Back',
    'sit_up': 'Core',
    'burpee': 'Full Body',
    'plank': 'Core',
    'dumbbell_curl': 'Arms',
    'other': 'General'
  };
  return muscleMap[exerciseType] || 'General';
}

// Export for testing
module.exports.analyzePostureImprovement = analyzePostureImprovement;
module.exports.detectMuscleImbalance = detectMuscleImbalance;
module.exports.analyzeConsistency = analyzeConsistency;
module.exports.analyzeStrengthProgress = analyzeStrengthProgress;
module.exports.detectPlateau = detectPlateau;
module.exports.analyzeRecovery = analyzeRecovery;
