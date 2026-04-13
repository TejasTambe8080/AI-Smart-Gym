// Posture Detection Utilities - Calculates angles and detects posture errors
export class PostureDetector {
  // Helper function to calculate distance between two points
  static calculateDistance(point1, point2) {
    if (!point1 || !point2) return 0;
    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
    );
  }

  // Helper function to calculate angle between three points
  static calculateAngle(pointA, pointB, pointC) {
    if (!pointA || !pointB || !pointC) return 0;
    const radians =
      Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
      Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return angle;
  }

  // Calculate overall posture score (0-100)
  static calculatePostureScore(landmarks) {
    let score = 100;
    
    // Check for back bent
    if (PostureDetector.isBackBent(landmarks)) score -= 20;
    
    // Check for knees misaligned
    if (PostureDetector.areKneesTooForward(landmarks)) score -= 15;
    
    // Check for shoulders misaligned
    if (PostureDetector.shouldersMisaligned(landmarks)) score -= 15;
    
    return Math.max(0, Math.min(100, score));
  }

  // Get posture feedback messages
  static getPostureFeedback(landmarks) {
    const feedback = [];
    
    if (PostureDetector.isBackBent(landmarks)) {
      feedback.push('Keep your back straight - avoid leaning forward');
    }
    
    if (PostureDetector.areKneesTooForward(landmarks)) {
      feedback.push('Align your knees over your toes');
    }
    
    if (PostureDetector.shouldersMisaligned(landmarks)) {
      feedback.push('Keep shoulders level and engaged');
    }
    
    return feedback;
  }

  // Detect if back is bent (forward lean)
  static isBackBent(landmarks) {
    if (
      !landmarks[11] ||
      !landmarks[12] ||
      !landmarks[23] ||
      !landmarks[24]
    ) {
      return false;
    }

    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    const shoulderX = (leftShoulder.x + rightShoulder.x) / 2;
    const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipX = (leftHip.x + rightHip.x) / 2;
    const hipY = (leftHip.y + rightHip.y) / 2;

    // Calculate forward lean angle
    const angle = Math.atan2(hipY - shoulderY, hipX - shoulderX);
    const leanAngle = (angle * 180) / Math.PI + 90;

    // If lean angle is > 20 degrees, back is bent
    return Math.abs(leanAngle) > 20;
  }

  // Detect if knees are too far forward
  static areKneesTooForward(landmarks) {
    if (
      !landmarks[23] ||
      !landmarks[24] ||
      !landmarks[25] ||
      !landmarks[26]
    ) {
      return false;
    }

    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];

    const hipX = (leftHip.x + rightHip.x) / 2;
    const kneeX = (leftKnee.x + rightKnee.x) / 2;

    // If knees are more than 10% ahead of hips, they're too forward
    return Math.abs(kneeX - hipX) > 0.1;
  }

  // Detect if shoulders are misaligned
  static shouldersMisaligned(landmarks) {
    if (!landmarks[11] || !landmarks[12]) {
      return false;
    }

    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    // If vertical difference is > 0.05, shoulders are misaligned
    return Math.abs(leftShoulder.y - rightShoulder.y) > 0.05;
  }

  // Get detailed posture analysis
  static analyzePosture(landmarks) {
    return {
      backBent: this.isBackBent(landmarks),
      kneesTooForward: this.areKneesTooForward(landmarks),
      shouldersMisaligned: this.shouldersMisaligned(landmarks),
    };
  }

  // Calculate posture score (0-100)
  static calculatePostureScore(landmarks) {
    const analysis = this.analyzePosture(landmarks);
    let score = 100;

    if (analysis.backBent) score -= 30;
    if (analysis.kneesTooForward) score -= 25;
    if (analysis.shouldersMisaligned) score -= 15;

    return Math.max(0, score);
  }

  // Get posture feedback messages
  static getPostureFeedback(landmarks) {
    const analysis = this.analyzePosture(landmarks);
    const feedback = [];

    if (analysis.backBent) {
      feedback.push('Keep your back straight, lean less forward');
    }
    if (analysis.kneesTooForward) {
      feedback.push('Knees tracking over toes, move knees back');
    }
    if (analysis.shouldersMisaligned) {
      feedback.push('Keep shoulders level and aligned');
    }

    return feedback.length > 0
      ? feedback
      : ['Good posture! Keep it up!'];
  }
}

export default PostureDetector;
