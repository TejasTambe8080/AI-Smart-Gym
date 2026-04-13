// Enhanced Exercise Detection Module - Supports multiple muscle groups
export class ExerciseDetector {
  constructor() {
    this.exercises = {
      pushup: { name: 'Push-up', muscles: 'chest', minConfidence: 0.5 },
      squat: { name: 'Squat', muscles: 'legs', minConfidence: 0.5 },
      pullup: { name: 'Pull-up', muscles: 'back', minConfidence: 0.5 },
      curls: { name: 'Dumbbell Curls', muscles: 'biceps', minConfidence: 0.5 },
      triceps: { name: 'Triceps Extension', muscles: 'triceps', minConfidence: 0.5 },
      jumpingjacks: { name: 'Jumping Jacks', muscles: 'cardio', minConfidence: 0.5 },
    };
  }

  // Calculate distance between two points
  static distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  // Calculate angle between 3 points
  static angle(a, b, c) {
    const radians =
      Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  }

  // Detect CHEST exercises (Push-ups)
  static detectChest(landmarks) {
    if (!landmarks[11] || !landmarks[13] || !landmarks[15]) return null;

    const shoulder = landmarks[11];
    const elbow = landmarks[13];
    const wrist = landmarks[15];

    const angle = this.angle(shoulder, elbow, wrist);
    
    // Push-up detected when elbow angle is acute (bent)
    if (angle < 100) return { exercise: 'pushup', angle, status: 'down' };
    if (angle > 160) return { exercise: 'pushup', angle, status: 'up' };
    
    return null;
  }

  // Detect BACK exercises (Pull movements)
  static detectBack(landmarks) {
    if (!landmarks[11] || !landmarks[13] || !landmarks[15]) return null;

    const shoulder = landmarks[11];
    const elbow = landmarks[13];
    const wrist = landmarks[15];

    const angle = this.angle(shoulder, elbow, wrist);
    
    // Pull-up: elbow bends inward when pulling
    if (angle > 30 && angle < 120) {
      return { exercise: 'pullup', angle, status: 'pulling' };
    }
    if (angle > 160) {
      return { exercise: 'pullup', angle, status: 'released' };
    }
    
    return null;
  }

  // Detect BICEPS curls
  static detectBiceps(landmarks) {
    if (!landmarks[11] || !landmarks[13] || !landmarks[15]) return null;

    const shoulder = landmarks[11];
    const elbow = landmarks[13];
    const wrist = landmarks[15];

    const angle = this.angle(shoulder, elbow, wrist);
    const wristHeight = wrist.y;
    const shoulderHeight = shoulder.y;

    // Bicep curl: wrist raised above elbow, angle bends
    if (wristHeight < shoulderHeight && angle < 100) {
      return { exercise: 'curls', angle, status: 'up' };
    }
    if (angle > 160) {
      return { exercise: 'curls', angle, status: 'down' };
    }

    return null;
  }

  // Detect TRICEPS extensions
  static detectTriceps(landmarks) {
    if (!landmarks[11] || !landmarks[13] || !landmarks[15]) return null;

    const shoulder = landmarks[11];
    const elbow = landmarks[13];
    const wrist = landmarks[15];

    const angle = this.angle(shoulder, elbow, wrist);

    // Tricep: arm extends and retracts behind head
    if (angle > 160) return { exercise: 'triceps', angle, status: 'extended' };
    if (angle < 90) return { exercise: 'triceps', angle, status: 'flexed' };

    return null;
  }

  // Detect LEG exercises (Squats)
  static detectLegs(landmarks) {
    if (!landmarks[23] || !landmarks[25] || !landmarks[27]) return null;

    const hip = landmarks[23];
    const knee = landmarks[25];
    const ankle = landmarks[27];

    const angle = this.angle(hip, knee, ankle);

    // Squat: knee angle decreases
    if (angle < 100) return { exercise: 'squat', angle, status: 'down' };
    if (angle > 150) return { exercise: 'squat', angle, status: 'up' };

    return null;
  }

  // Detect CARDIO (Jumping Jacks)
  static detectCardio(landmarks) {
    if (!landmarks[27] || !landmarks[28]) return null;

    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];

    const footDistance = this.distance(leftAnkle, rightAnkle);

    // Jumping jacks: feet apart/together
    if (footDistance > 0.3) {
      return { exercise: 'jumpingjacks', distance: footDistance, status: 'apart' };
    }
    if (footDistance < 0.15) {
      return { exercise: 'jumpingjacks', distance: footDistance, status: 'together' };
    }

    return null;
  }

  // Detect posture errors for each exercise
  static detectPostureErrors(landmarks, exerciseType) {
    const errors = [];

    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    // Check back alignment
    if (Math.abs(leftShoulder.y - rightShoulder.y) > 0.08) {
      errors.push('Shoulders not level');
    }

    // Check hip alignment
    if (Math.abs(leftHip.y - rightHip.y) > 0.08) {
      errors.push('Hips not level');
    }

    // Exercise-specific errors
    switch (exerciseType) {
      case 'squat':
        if (landmarks[25] && landmarks[27]) {
          const kneeAngle = this.angle(landmarks[23], landmarks[25], landmarks[27]);
          if (kneeAngle < 60) errors.push('Knee angle too acute');
          if (kneeAngle > 170) errors.push('Not going deep enough');
        }
        break;

      case 'pushup':
        if (landmarks[11] && landmarks[13]) {
          const armAngle = this.angle(landmarks[11], landmarks[13], landmarks[15]);
          if (armAngle > 120) errors.push('Arms not sufficiently bent');
        }
        break;

      case 'pullup':
        if (landmarks[13] && landmarks[15]) {
          const pullAngle = this.angle(landmarks[11], landmarks[13], landmarks[15]);
          if (pullAngle > 150) errors.push('Not pulling high enough');
        }
        break;
    }

    return errors;
  }

  // Main detection function
  static detect(landmarks, currentExercise = null) {
    let detected = null;

    // Try muscle group detection
    if (!currentExercise || currentExercise.includes('chest')) {
      detected = this.detectChest(landmarks);
    }

    if (!detected && (!currentExercise || currentExercise.includes('back'))) {
      detected = this.detectBack(landmarks);
    }

    if (!detected && (!currentExercise || currentExercise.includes('bicep'))) {
      detected = this.detectBiceps(landmarks);
    }

    if (!detected && (!currentExercise || currentExercise.includes('tricep'))) {
      detected = this.detectTriceps(landmarks);
    }

    if (!detected && (!currentExercise || currentExercise.includes('leg'))) {
      detected = this.detectLegs(landmarks);
    }

    if (!detected && (!currentExercise || currentExercise.includes('cardio'))) {
      detected = this.detectCardio(landmarks);
    }

    return detected;
  }

  // Get structured output
  static getOutput(landmarks, reps, exerciseType) {
    const errors = this.detectPostureErrors(landmarks, exerciseType);
    const postureScore = Math.max(0, 100 - errors.length * 20);

    return {
      exerciseType,
      reps,
      postureErrors: errors,
      postureScore,
      duration: 0, // Will be calculated by caller
      timestamp: new Date(),
    };
  }
}

export default ExerciseDetector;
