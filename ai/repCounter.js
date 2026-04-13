// Rep Counting Utilities - Counts exercise repetitions based on body movements
export class RepCounter {
  constructor(exerciseType) {
    this.exerciseType = exerciseType;
    this.repCount = 0;
    this.isInMotion = false;
    this.postureScores = [];
    this.frameCount = 0;
  }

  // Track knee angle for squat exercises
  static getKneeAngle(landmarks) {
    if (!landmarks[23] || !landmarks[25] || !landmarks[27]) {
      return null;
    }

    const hip = landmarks[23];
    const knee = landmarks[25];
    const ankle = landmarks[27];

    const angle = this._calculateAngle(hip, knee, ankle);
    return angle;
  }

  // Track elbow angle for push-ups and pull-ups
  static getElbowAngle(landmarks) {
    if (!landmarks[11] || !landmarks[13] || !landmarks[15]) {
      return null;
    }

    const shoulder = landmarks[11];
    const elbow = landmarks[13];
    const wrist = landmarks[15];

    const angle = this._calculateAngle(shoulder, elbow, wrist);
    return angle;
  }

  // Calculate angle between three points
  static _calculateAngle(pointA, pointB, pointC) {
    const radians =
      Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
      Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return angle;
  }

  // Detect squat rep based on knee angle
  detectSquat(landmarks) {
    const kneeAngle = RepCounter.getKneeAngle(landmarks);
    if (!kneeAngle) return false;

    // Squat detected when knee bends to less than 90 degrees
    if (kneeAngle < 90 && !this.isInMotion) {
      this.isInMotion = true;
    }

    // Rep counted when returning to standing position (angle > 160)
    if (kneeAngle > 160 && this.isInMotion) {
      this.isInMotion = false;
      this.repCount++;
      return true;
    }

    return false;
  }

  // Detect push-up rep based on elbow angle
  detectPushUp(landmarks) {
    const elbowAngle = RepCounter.getElbowAngle(landmarks);
    if (!elbowAngle) return false;

    // Push-up down when elbow bends to less than 90 degrees
    if (elbowAngle < 90 && !this.isInMotion) {
      this.isInMotion = true;
    }

    // Rep counted when returning to full extension (angle > 160)
    if (elbowAngle > 160 && this.isInMotion) {
      this.isInMotion = false;
      this.repCount++;
      return true;
    }

    return false;
  }

  // Detect pull-up rep based on elbow angle
  detectPullUp(landmarks) {
    const elbowAngle = RepCounter.getElbowAngle(landmarks);
    if (!elbowAngle) return false;

    // Pull-up when elbow bends significantly
    if (elbowAngle < 100 && !this.isInMotion) {
      this.isInMotion = true;
    }

    // Rep counted when returning to full extension
    if (elbowAngle > 160 && this.isInMotion) {
      this.isInMotion = false;
      this.repCount++;
      return true;
    }

    return false;
  }

  // Generic rep detection for other exercises
  detect(landmarks) {
    switch (this.exerciseType) {
      case 'squat':
        return this.detectSquat(landmarks);
      case 'push_up':
        return this.detectPushUp(landmarks);
      case 'pull_up':
        return this.detectPullUp(landmarks);
      default:
        return false;
    }
  }

  // Track posture score and calculate average
  addPostureScore(score) {
    this.postureScores.push(score);
  }

  // Get average posture score
  getAveragePostureScore() {
    if (this.postureScores.length === 0) return 0;
    const sum = this.postureScores.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.postureScores.length);
  }

  // Get rep count
  getRepCount() {
    return this.repCount;
  }

  // Reset counter
  reset() {
    this.repCount = 0;
    this.isInMotion = false;
    this.postureScores = [];
    this.frameCount = 0;
  }
}

export default RepCounter;
