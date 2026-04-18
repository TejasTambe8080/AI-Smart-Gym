// Voice Feedback Service - AI Posture Correction with Voice
import { useRef, useEffect } from 'react';

const VoiceFeedback = {
  isSpeaking: false,
  lastFeedbackTime: 0,
  feedbackCooldown: 3000, // 3 seconds between feedback

  // Initialize speech synthesis
  init() {
    this.synth = window.speechSynthesis;
    this.voices = this.synth.getVoices();
    if (this.voices.length === 0) {
      // Wait for voices to load
      this.synth.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
    }
  },

  // Speak text using Web Speech API
  speak(text, urgency = 'normal') {
    if (this.isSpeaking) return;

    const now = Date.now();
    if (now - this.lastFeedbackTime < this.feedbackCooldown) {
      return; // Cooldown active
    }

    try {
      this.synth.cancel(); // Stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Select voice
      if (this.voices.length > 0) {
        utterance.voice = this.voices[0];
      }

      // Set speech parameters based on urgency
      if (urgency === 'critical') {
        utterance.rate = 1.2; // Faster for urgent feedback
        utterance.pitch = 1.2; // Higher pitch
        utterance.volume = 1.0; // Max volume
      } else if (urgency === 'warning') {
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.9;
      } else {
        utterance.rate = 0.95; // Slightly slower
        utterance.pitch = 0.9;
        utterance.volume = 0.8;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        console.log('🎙️ Voice feedback:', text);
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.lastFeedbackTime = Date.now();
      };

      this.synth.speak(utterance);
    } catch (err) {
      console.error('Error speaking:', err);
    }
  },

  // Stop current speech
  stop() {
    this.synth.cancel();
    this.isSpeaking = false;
  },

  // Posture feedback messages
  feedback: {
    backStraight: "Your back looks straight. Great form!",
    backSlumped: "Straighten your back for better form.",
    headUp: "Keep your head up.",
    shouldersRelaxed: "Relax your shoulders.",
    shouldersTense: "Your shoulders look tense. Relax them.",
    kneesBent: "Bend your knees slightly.",
    kneesLocked: "Don't lock your knees.",
    coreEngaged: "Engage your core.",
    goodPosture: "Perfect posture! Keep going!",
    poorPosture: "Improve your posture to prevent injury.",
    balanceLost: "Watch your balance.",
    weightDistribution: "Distribute your weight evenly.",
  },

  // Analyze posture and give feedback
  analyzePosture(landmarks, exercise) {
    if (!landmarks || landmarks.length < 33) return null;

    const feedback = {
      message: '',
      score: 100,
      issues: [],
      urgency: 'normal',
    };

    // Extract key points (MediaPipe Pose)
    const leftShoulder = landmarks[11]; // 11 = left shoulder
    const rightShoulder = landmarks[12]; // 12 = right shoulder
    const leftHip = landmarks[23]; // 23 = left hip
    const rightHip = landmarks[24]; // 24 = right hip
    const leftKnee = landmarks[25]; // 25 = left knee
    const rightKnee = landmarks[26]; // 26 = right knee
    const head = landmarks[0]; // 0 = nose/head position
    const leftElbow = landmarks[13]; // 13 = left elbow
    const rightElbow = landmarks[14]; // 14 = right elbow

    // Check back alignment (shoulder-hip)
    const shoulderHipAlignmentL = Math.abs(leftShoulder.x - leftHip.x);
    const shoulderHipAlignmentR = Math.abs(rightShoulder.x - rightHip.x);
    
    if (shoulderHipAlignmentL > 0.15 || shoulderHipAlignmentR > 0.15) {
      feedback.issues.push('Back not straight');
      feedback.score -= 20;
      feedback.message = this.feedback.backSlumped;
      feedback.urgency = 'warning';
    } else {
      feedback.message = this.feedback.backStraight;
    }

    // Check head position
    if (head.y < leftShoulder.y - 0.1) {
      feedback.issues.push('Head too forward');
      feedback.score -= 15;
      feedback.message = this.feedback.headUp;
      feedback.urgency = 'warning';
    }

    // Check shoulder alignment
    const shoulderTilt = Math.abs(leftShoulder.y - rightShoulder.y);
    if (shoulderTilt > 0.1) {
      feedback.issues.push('Uneven shoulders');
      feedback.score -= 15;
      feedback.message = this.feedback.shouldersTense;
      feedback.urgency = 'warning';
    }

    // Check hip alignment
    const hipTilt = Math.abs(leftHip.y - rightHip.y);
    if (hipTilt > 0.15) {
      feedback.issues.push('Hip misalignment');
      feedback.score -= 10;
    }

    // Check knee position based on exercise
    if (exercise === 'Squat' || exercise === 'Leg Press') {
      const kneeFlexion = Math.abs(leftKnee.y - leftHip.y);
      if (kneeFlexion < 0.1) {
        feedback.issues.push('Knees not bent enough');
        feedback.score -= 15;
      }
    }

    // Weight distribution (based on position)
    const leftSideWeight = (leftShoulder.x + leftHip.x + leftKnee.x) / 3;
    const rightSideWeight = (rightShoulder.x + rightHip.x + rightKnee.x) / 3;
    const weightDiff = Math.abs(leftSideWeight - rightSideWeight);
    
    if (weightDiff > 0.15) {
      feedback.issues.push('Uneven weight distribution');
      feedback.score -= 15;
      feedback.message = this.feedback.weightDistribution;
    }

    // Generate voice feedback based on score
    if (feedback.score < 60) {
      feedback.urgency = 'critical';
    } else if (feedback.score < 75) {
      feedback.urgency = 'warning';
    }

    return feedback;
  },

  // Get feedback message for specific exercise
  getExerciseFeedback(exercise, landmarks) {
    const feedback = this.analyzePosture(landmarks, exercise);
    
    if (feedback.score >= 80) {
      feedback.message = this.feedback.goodPosture;
      feedback.urgency = 'normal';
    } else if (feedback.score < 60) {
      feedback.message = this.feedback.poorPosture + ' ' + feedback.issues.join(', ');
      feedback.urgency = 'critical';
    }

    return feedback;
  },
};

// React Hook for Voice Feedback
export const useVoiceFeedback = () => {
  const feedbackIntervalRef = useRef(null);
  const lastFeedbackRef = useRef(0);

  useEffect(() => {
    VoiceFeedback.init();
    return () => {
      VoiceFeedback.stop();
    };
  }, []);

  const giveFeedback = (landmarks, exercise, score) => {
    const now = Date.now();
    
    // Give feedback every 5 seconds or if posture score drops
    if (now - lastFeedbackRef.current < 5000) {
      return;
    }

    const feedback = VoiceFeedback.getExerciseFeedback(exercise, landmarks);
    
    if (feedback && feedback.message) {
      VoiceFeedback.speak(feedback.message, feedback.urgency);
      lastFeedbackRef.current = now;
    }
  };

  const giveCriticalFeedback = (message) => {
    VoiceFeedback.speak(message, 'critical');
  };

  return {
    giveFeedback,
    giveCriticalFeedback,
    stopFeedback: () => VoiceFeedback.stop(),
  };
};

export default VoiceFeedback;
