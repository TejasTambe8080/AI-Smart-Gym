// Injury Risk Detection Engine - Analyzes posture patterns and detects injury risks
const Workout = require('../models/Workout');

// Analyze injury risk based on posture patterns
exports.analyzeInjuryRisk = async (userId) => {
  try {
    const workouts = await Workout.find({ userId }).sort({ date: -1 }).limit(50);
    
    if (workouts.length < 3) {
      return { riskLevel: 'insufficient_data', risks: [], message: 'Need more workout data for analysis' };
    }

    const risks = [];
    const riskPatterns = {};

    // Analyze posture error patterns
    workouts.forEach(workout => {
      const details = workout.postureDetails || {};
      const postureScore = workout.postureScore || 100;
      const exerciseType = workout.exerciseType;

      // Track risk indicators by exercise type
      if (!riskPatterns[exerciseType]) {
        riskPatterns[exerciseType] = {
          totalWorkouts: 0,
          backBentCount: 0,
          kneesMisalignedCount: 0,
          shouldersMisalignedCount: 0,
          lowScoreCount: 0,
          avgScore: 0,
          scores: []
        };
      }

      riskPatterns[exerciseType].totalWorkouts++;
      if (details.backBent > 20) riskPatterns[exerciseType].backBentCount++;
      if (details.kneesMisaligned > 20) riskPatterns[exerciseType].kneesMisalignedCount++;
      if (details.shouldersMisaligned > 20) riskPatterns[exerciseType].shouldersMisalignedCount++;
      if (postureScore < 60) riskPatterns[exerciseType].lowScoreCount++;
      riskPatterns[exerciseType].scores.push(postureScore);
    });

    // Calculate injury risks for each exercise
    for (const [exercise, pattern] of Object.entries(riskPatterns)) {
      if (pattern.totalWorkouts < 2) continue;

      pattern.avgScore = Math.round(pattern.scores.reduce((a, b) => a + b) / pattern.scores.length);

      // Knee injury risk (from squats, lunges, burpees)
      if (['squat', 'burpee'].includes(exercise)) {
        const kneeRiskPercent = (pattern.kneesMisalignedCount / pattern.totalWorkouts) * 100;
        if (kneeRiskPercent > 30) {
          risks.push({
            type: 'knee_injury',
            exercise: exercise.replace('_', ' '),
            riskLevel: kneeRiskPercent > 60 ? 'high' : 'medium',
            riskPercent: kneeRiskPercent,
            message: `${kneeRiskPercent > 60 ? 'HIGH' : 'MEDIUM'} risk of knee injury in ${exercise}`,
            details: `Knee valgus (inward collapse) detected in ${pattern.kneesMisalignedCount}/${pattern.totalWorkouts} workouts`,
            recommendation: 'Focus on proper knee alignment. Keep knees over toes, avoid inward collapse.',
            exercises: ['leg press', 'box step-ups', 'wall sits']
          });
        }
      }

      // Back injury risk
      if (pattern.backBentCount > 0) {
        const backRiskPercent = (pattern.backBentCount / pattern.totalWorkouts) * 100;
        if (backRiskPercent > 25) {
          risks.push({
            type: 'back_injury',
            exercise: exercise.replace('_', ' '),
            riskLevel: backRiskPercent > 50 ? 'high' : 'medium',
            riskPercent: backRiskPercent,
            message: `${backRiskPercent > 50 ? 'HIGH' : 'MEDIUM'} risk of back strain in ${exercise}`,
            details: `Excessive back bending detected in ${pattern.backBentCount}/${pattern.totalWorkouts} workouts`,
            recommendation: 'Maintain neutral spine throughout. Engage your core and avoid excessive flexion.',
            exercises: ['planks', 'dead bugs', 'bird dogs']
          });
        }
      }

      // Shoulder injury risk (from push-ups, overhead movements)
      if (['push_up', 'dumbbell_curl'].includes(exercise)) {
        const shoulderRiskPercent = (pattern.shouldersMisalignedCount / pattern.totalWorkouts) * 100;
        if (shoulderRiskPercent > 25) {
          risks.push({
            type: 'shoulder_injury',
            exercise: exercise.replace('_', ' '),
            riskLevel: shoulderRiskPercent > 50 ? 'high' : 'medium',
            riskPercent: shoulderRiskPercent,
            message: `${shoulderRiskPercent > 50 ? 'HIGH' : 'MEDIUM'} risk of shoulder strain in ${exercise}`,
            details: `Shoulder impingement patterns detected in ${pattern.shouldersMisalignedCount}/${pattern.totalWorkouts} workouts`,
            recommendation: 'Keep shoulders packed (scapula down and back). Avoid shrugging.',
            exercises: ['band pull-aparts', 'face pulls', 'reverse pec deck']
          });
        }
      }

      // Poor form pattern (consistent low scores)
      if (pattern.avgScore < 60 && pattern.lowScoreCount / pattern.totalWorkouts > 0.5) {
        risks.push({
          type: 'poor_form_pattern',
          exercise: exercise.replace('_', ' '),
          riskLevel: 'high',
          riskPercent: Math.round((pattern.lowScoreCount / pattern.totalWorkouts) * 100),
          message: `POOR FORM PATTERN: ${pattern.avgScore}% avg score on ${exercise}`,
          details: `Consistent form issues detected (${pattern.lowScoreCount}/${pattern.totalWorkouts} workouts below 60%)`,
          recommendation: 'Reduce weight/intensity, slow down movements, focus on form over performance',
          exercises: []
        });
      }
    }

    // Determine overall risk level
    const overallRiskLevel = risks.length === 0 ? 'low' : 
                            risks.filter(r => r.riskLevel === 'high').length > 0 ? 'high' :
                            'medium';

    return {
      riskLevel: overallRiskLevel,
      risks: risks.slice(0, 3), // Top 3 risks
      riskCount: risks.length,
      analysisDate: new Date(),
      recommendations: generateRecommendations(risks)
    };
  } catch (error) {
    console.error('Error analyzing injury risk:', error);
    return { riskLevel: 'error', risks: [], error: error.message };
  }
};

// Generate action recommendations
function generateRecommendations(risks) {
  const recommendations = [];

  if (risks.length === 0) {
    recommendations.push({
      title: '✅ Form Looking Great',
      message: 'Keep up your current form and continue progressive overload safely.',
      priority: 'low'
    });
  } else {
    const highRisks = risks.filter(r => r.riskLevel === 'high');
    if (highRisks.length > 0) {
      recommendations.push({
        title: '⚠️ Immediate Action Required',
        message: `${highRisks.length} high-risk form issue(s) detected. Reduce intensity and focus on form correction.`,
        priority: 'high'
      });
    }

    // Suggest corrective exercises
    const correctiveExercises = new Set();
    risks.forEach(risk => {
      if (risk.exercises && risk.exercises.length > 0) {
        risk.exercises.forEach(ex => correctiveExercises.add(ex));
      }
    });

    if (correctiveExercises.size > 0) {
      recommendations.push({
        title: '🏋️ Corrective Exercises',
        message: `Add these to improve form: ${Array.from(correctiveExercises).join(', ')}`,
        priority: 'high'
      });
    }
  }

  return recommendations;
}

// Get detailed risk profile for a specific exercise
exports.getExerciseRiskProfile = async (userId, exerciseType) => {
  try {
    const workouts = await Workout.find({ userId, exerciseType }).sort({ date: -1 }).limit(20);
    
    if (workouts.length === 0) {
      return { exercise: exerciseType, workouts: 0, riskProfile: 'no_data' };
    }

    const scores = workouts.map(w => w.postureScore || 0);
    const postures = workouts.map(w => w.postureDetails || {});

    const avgScore = Math.round(scores.reduce((a, b) => a + b) / scores.length);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const consistency = maxScore - minScore;

    const avgBackBent = Math.round(postures.reduce((sum, p) => sum + (p.backBent || 0), 0) / postures.length);
    const avgKneesMisaligned = Math.round(postures.reduce((sum, p) => sum + (p.kneesMisaligned || 0), 0) / postures.length);
    const avgShouldersMisaligned = Math.round(postures.reduce((sum, p) => sum + (p.shouldersMisaligned || 0), 0) / postures.length);

    return {
      exercise: exerciseType,
      workouts: workouts.length,
      avgScore,
      scoreRange: { min: minScore, max: maxScore },
      consistency,
      posture: {
        avgBackBent,
        avgKneesMisaligned,
        avgShouldersMisaligned
      },
      trend: getTrend(scores),
      riskLevel: avgScore < 60 ? 'high' : avgScore < 75 ? 'medium' : 'low'
    };
  } catch (error) {
    console.error('Error getting exercise risk profile:', error);
    return { exercise: exerciseType, error: error.message };
  }
};

// Determine trend (improving, stable, declining)
function getTrend(scores) {
  if (scores.length < 3) return 'insufficient_data';

  const recent = scores.slice(0, 3);
  const older = scores.slice(3, 6);

  if (older.length === 0) return 'stable';

  const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b) / older.length;

  const improvement = recentAvg - olderAvg;

  if (Math.abs(improvement) < 5) return 'stable';
  return improvement > 0 ? 'improving' : 'declining';
}
