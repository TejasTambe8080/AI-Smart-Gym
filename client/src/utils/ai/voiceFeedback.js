// Voice Feedback System - Provides voice feedback using Web Speech API
export class VoiceFeedback {
  constructor() {
    this.synth = window.speechSynthesis;
    this.enabled = false;
    this.lastSpeakTime = 0;
    this.cooldownMs = 1500; // Prevent spam (speak every 1.5 seconds max)
    this.speaker = null;
  }

  // Enable/disable voice feedback
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  // Bilingual translation map
  getTranslation(message) {
    const translations = {
      'Keep your back straight, lean less forward': 'अपनी पीठ सीधी रखें, आगे कम झुकें',
      'Knees tracking over toes, move knees back': 'घुटनों को पीछे रखें',
      'Keep shoulders level and aligned': 'कंधों को सीधा रखें',
      'Good posture! Keep it up!': 'बहुत अच्छे! करते रहें',
      'Excellent performance! Keep it up!': 'उत्कृष्ट प्रदर्शन! इसे जारी रखें!',
      'Good job! Well done!': 'अच्छा काम! बहुत बढ़िया!',
      'Average performance. Try to improve your form.': 'औसत प्रदर्शन। अपने फॉर्म को सुधारने का प्रयास करें।',
      'Focus on good form and technique.': 'अच्छे फॉर्म और तकनीक पर ध्यान दें।',
      'Keep your back straight - avoid leaning forward': 'अपनी पीठ सीधी रखें - आगे झुकने से बचें'
    };
    return translations[message] || '';
  }

  // Check if can speak (cooldown check)
  canSpeak() {
    const now = Date.now();
    if (now - this.lastSpeakTime >= this.cooldownMs) {
      this.lastSpeakTime = now;
      return true;
    }
    return false;
  }

  // Speak message with Web Speech API
  speak(message, rate = 0.9, pitch = 1.0, lang = 'en-US') {
    if (!this.enabled || !this.canSpeak()) {
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1.0;
    utterance.lang = lang;

    this.synth.speak(utterance);
    this.speaker = utterance;
  }

  // Speak Bilingual (English then Hindi)
  speakBilingual(engMessage) {
    if (!this.enabled || !this.canSpeak()) return;

    this.synth.cancel();

    const hindiMessage = this.getTranslation(engMessage);
    
    const engUtterance = new SpeechSynthesisUtterance(engMessage);
    engUtterance.lang = 'en-US';
    engUtterance.rate = 0.9;
    
    this.synth.speak(engUtterance);

    if (hindiMessage) {
      engUtterance.onend = () => {
        const hindiUtterance = new SpeechSynthesisUtterance(hindiMessage);
        hindiUtterance.lang = 'hi-IN';
        hindiUtterance.rate = 0.85;
        this.synth.speak(hindiUtterance);
      };
    }
  }

  // Provide posture feedback
  feedbackPosture(feedback) {
    if (Array.isArray(feedback)) {
      feedback.forEach((msg) => {
        this.speakBilingual(msg);
      });
    } else {
      this.speakBilingual(feedback);
    }
  }

  // Provide rep feedback
  feedbackReps(currentReps, targetReps) {
    const message = `You have completed ${currentReps} reps. Target is ${targetReps}.`;
    this.speak(message, 0.9, 1.0);
  }

  // Provide performance feedback
  feedbackPerformance(score) {
    let message = '';
    if (score >= 90) {
      message = 'Excellent performance! Keep it up!';
    } else if (score >= 75) {
      message = 'Good job! Well done!';
    } else if (score >= 60) {
      message = 'Average performance. Try to improve your form.';
    } else {
      message = 'Focus on good form and technique.';
    }
    this.speak(message, 0.9, 1.0);
  }

  // Provide countdown
  feedbackCountdown(seconds) {
    this.speak(String(seconds), 1.0, 1.2);
  }

  // Encourage/motivate
  motivate() {
    const messages = [
      'Keep pushing!',
      'You got this!',
      'Great effort!',
      'Almost there!',
      'Keep going!',
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    this.speak(message, 0.95, 1.1);
  }

  // Start workout feedback
  feedbackStart(exerciseType) {
    const message = `Starting ${exerciseType.replace('_', ' ')} workout. Good luck!`;
    this.speak(message, 0.9, 1.0);
  }

  // End workout feedback
  feedbackEnd(reps, performanceScore) {
    let message = `Great job! You completed ${reps} reps. `;
    if (performanceScore >= 90) {
      message += 'Excellent performance!';
    } else if (performanceScore >= 75) {
      message += 'Great effort!';
    } else if (performanceScore >= 60) {
      message += 'Good work! Keep practicing.';
    } else {
      message += 'Keep working on your form.';
    }
    this.speak(message, 0.9, 1.0);
  }
}

export default VoiceFeedback;
