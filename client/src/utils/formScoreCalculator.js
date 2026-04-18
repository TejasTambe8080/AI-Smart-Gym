// Form Score Calculator - Calculates fitness form from multiple metrics
const calculateFormScore = (metrics) => {
  /**
   * Formula: (Posture Accuracy × 0.40) + (Reps Completed × 0.30) + (Consistency × 0.30)
   * Returns score out of 100
   */

  const {
    postureAccuracy = 0,    // 0-100 (% correct form)
    repsCompleted = 0,      // Current reps / target reps (0-100%)
    consistency = 0,        // Variation in form (0-100%)
    speed = 0,              // Exercise speed (0-100%)
    range = 0               // Range of motion (0-100%)
  } = metrics;

  // Weighted calculation
  const formScore = (postureAccuracy * 0.40) + (repsCompleted * 0.30) + (consistency * 0.30);

  return Math.min(100, Math.max(0, Math.round(formScore)));
};

const getFormScoreGrade = (score) => {
  if (score >= 90) return { grade: 'S', label: 'Perfect Form', color: '#22C55E', emoji: '🔥' };
  if (score >= 80) return { grade: 'A', label: 'Excellent', color: '#10B981', emoji: '💪' };
  if (score >= 70) return { grade: 'B', label: 'Good', color: '#3B82F6', emoji: '👍' };
  if (score >= 60) return { grade: 'C', label: 'Fair', color: '#F59E0B', emoji: '⚡' };
  if (score >= 50) return { grade: 'D', label: 'Needs Work', color: '#EF4444', emoji: '⚠️' };
  return { grade: 'F', label: 'Poor Form', color: '#DC2626', emoji: '❌' };
};

const detectPostureErrors = (keypoints) => {
  /**
   * Analyzes MediaPipe keypoints to detect posture errors
   * Returns array of detected issues
   */
  const errors = [];

  // Example keypoints indices (MediaPipe format)
  const NOSE = 0, LEFT_SHOULDER = 11, RIGHT_SHOULDER = 12;
  const LEFT_ELBOW = 13, RIGHT_ELBOW = 14;
  const LEFT_HIP = 23, RIGHT_HIP = 24;
  const LEFT_KNEE = 25, RIGHT_KNEE = 26;

  if (!keypoints || keypoints.length < 27) return errors;

  // Check spinal alignment
  const shoulderTilt = Math.abs(
    keypoints[LEFT_SHOULDER].y - keypoints[RIGHT_SHOULDER].y
  );
  if (shoulderTilt > 0.1) {
    errors.push({
      type: 'SHOULDER_TILT',
      severity: 'HIGH',
      message: 'Keep shoulders level',
      fix: 'Align shoulders parallel to ground'
    });
  }

  // Check knee alignment
  const leftKneeAngle = calculateAngle(
    keypoints[LEFT_HIP],
    keypoints[LEFT_KNEE],
    { x: keypoints[LEFT_KNEE].x, y: keypoints[LEFT_KNEE].y + 1 }
  );
  if (leftKneeAngle < 60 || leftKneeAngle > 120) {
    errors.push({
      type: 'KNEE_ALIGNMENT',
      severity: 'MEDIUM',
      message: 'Knee angle incorrect',
      fix: 'Adjust knee position to 90 degrees'
    });
  }

  // Check elbow position
  if (keypoints[LEFT_ELBOW].x > keypoints[LEFT_SHOULDER].x + 0.2) {
    errors.push({
      type: 'ELBOW_FLARE',
      severity: 'MEDIUM',
      message: 'Elbow is flaring out too much',
      fix: 'Keep elbows closer to body'
    });
  }

  return errors;
};

const calculateAngle = (point1, point2, point3) => {
  /**
   * Calculate angle between three points
   * Returns angle in degrees
   */
  const dx1 = point1.x - point2.x;
  const dy1 = point1.y - point2.y;
  const dx2 = point3.x - point2.x;
  const dy2 = point3.y - point2.y;

  const angle = Math.atan2(dy2, dx2) - Math.atan2(dy1, dx1);
  return Math.abs((angle * 180) / Math.PI);
};

const analyzeExerciseForm = (exerciseName, keypoints, frameHistory = []) => {
  /**
   * Comprehensive form analysis for specific exercises
   * Returns detailed feedback with score
   */

  const baseScore = 50; // Start with baseline
  let deductions = 0;

  const errors = detectPostureErrors(keypoints);
  deductions += errors.length * 5; // Each error is -5 points

  // Exercise-specific analysis
  const analysis = {
    exercise: exerciseName,
    formScore: Math.max(0, baseScore - deductions),
    errors: errors,
    tips: getExerciseTips(exerciseName),
    confidence: calculateConfidence(frameHistory)
  };

  return analysis;
};

const getExerciseTips = (exerciseName) => {
  const tips = {
    'bench-press': [
      'Keep feet flat on ground',
      'Lower bar to chest level',
      'Maintain shoulder blade retraction',
      'Control the descent (3 seconds)',
      'Press explosively up'
    ],
    'squat': [
      'Chest up, core tight',
      'Descend slowly (3 seconds)',
      'Knees track over toes',
      'Break parallel or below',
      'Drive through heels to stand'
    ],
    'deadlift': [
      'Back straight, not rounded',
      'Shoulders over bar',
      'Drive legs first',
      'Maintain neutral spine',
      'Full hip extension at top'
    ],
    'pull-up': [
      'Full range of motion',
      'Chest to bar (strict)',
      'Controlled descent',
      'Avoid excessive swinging',
      'Scapular retraction'
    ]
  };

  return tips[exerciseName.toLowerCase()] || [
    'Focus on proper form',
    'Control the movement',
    'Full range of motion',
    'Consistent pace',
    'Engage target muscles'
  ];
};

const calculateConfidence = (frameHistory) => {
  /**
   * Calculate confidence score based on frame consistency
   * Higher confidence = more consistent form across frames
   */
  if (!frameHistory || frameHistory.length === 0) return 50;

  let variance = 0;
  for (let i = 1; i < frameHistory.length; i++) {
    variance += Math.abs(frameHistory[i].score - frameHistory[i - 1].score);
  }
  variance /= frameHistory.length - 1;

  // Convert variance to confidence (inverse relationship)
  return Math.max(0, Math.min(100, 100 - variance * 10));
};

const getWeakMuscles = (workoutHistory) => {
  /**
   * Analyze workout history to identify weak muscle groups
   * Returns ranked list of weakest muscles
   */

  const musclePerformance = {
    chest: [],
    back: [],
    shoulders: [],
    biceps: [],
    triceps: [],
    forearms: [],
    quads: [],
    hamstrings: [],
    glutes: [],
    calves: [],
    core: [],
    legs: []
  };

  // Aggregate performance scores by muscle group
  workoutHistory.forEach(workout => {
    workout.exercises.forEach(exercise => {
      const muscles = getExerciseMuscles(exercise.name);
      muscles.forEach(muscle => {
        if (musclePerformance[muscle]) {
          musclePerformance[muscle].push(exercise.formScore || 75);
        }
      });
    });
  });

  // Calculate average performance per muscle
  const muscleAverages = Object.entries(musclePerformance)
    .map(([muscle, scores]) => ({
      muscle: muscle.charAt(0).toUpperCase() + muscle.slice(1),
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0,
      workouts: scores.length
    }))
    .filter(m => m.workouts > 0)
    .sort((a, b) => a.averageScore - b.averageScore);

  return muscleAverages.slice(0, 3); // Top 3 weak muscles
};

const getExerciseMuscles = (exerciseName) => {
  const muscleMap = {
    'bench press': ['chest', 'triceps'],
    'incline press': ['chest', 'shoulders', 'triceps'],
    'squat': ['quads', 'glutes', 'hamstrings', 'legs'],
    'deadlift': ['back', 'glutes', 'hamstrings', 'core'],
    'bent row': ['back', 'biceps'],
    'pull-up': ['back', 'biceps'],
    'lateral raise': ['shoulders'],
    'dips': ['chest', 'triceps'],
    'leg press': ['quads', 'glutes', 'hamstrings'],
    'leg curl': ['hamstrings'],
    'bicep curl': ['biceps', 'forearms'],
    'tricep': ['triceps'],
    'shoulder press': ['shoulders', 'triceps']
  };

  for (const [key, muscles] of Object.entries(muscleMap)) {
    if (exerciseName.toLowerCase().includes(key)) {
      return muscles;
    }
  }

  return ['core']; // Default
};

const detectInjuryRisk = (formScores, postureErrors) => {
  /**
   * Detects potential injury risks based on form patterns
   * Returns array of risk warnings
   */

  const risks = [];

  // Check for consistent form degradation
  if (formScores.length > 5) {
    const recentAvg = formScores.slice(-5).reduce((a, b) => a + b) / 5;
    const earlierAvg = formScores.slice(0, 5).reduce((a, b) => a + b) / 5;
    
    if (recentAvg < earlierAvg - 10) {
      risks.push({
        severity: 'HIGH',
        type: 'FORM_DEGRADATION',
        message: 'Your form is getting worse - you may be fatigued',
        recommendation: 'Take a break or reduce weight'
      });
    }
  }

  // Check for repeated errors
  const errorCounts = {};
  postureErrors.forEach(error => {
    errorCounts[error.type] = (errorCounts[error.type] || 0) + 1;
  });

  Object.entries(errorCounts).forEach(([errorType, count]) => {
    if (count > 3) {
      risks.push({
        severity: 'MEDIUM',
        type: errorType,
        message: `Repeated ${errorType} - high injury risk`,
        recommendation: 'Adjust form immediately'
      });
    }
  });

  return risks;
};

export {
  calculateFormScore,
  getFormScoreGrade,
  detectPostureErrors,
  calculateAngle,
  analyzeExerciseForm,
  getExerciseTips,
  calculateConfidence,
  getWeakMuscles,
  getExerciseMuscles,
  detectInjuryRisk
};
