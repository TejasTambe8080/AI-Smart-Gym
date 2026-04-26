/**
 * Hindi Voice Feedback System
 * Provides real-time posture correction feedback in Hindi
 */

// Hindi feedback phrases for posture correction
const HINDI_FEEDBACK = {
  posture: {
    bad: [
      "अपनी रीढ़ सीधी रखें", // Keep your spine straight
      "कंधे पीछे की ओर खींचें", // Pull shoulders back
      "गर्दन को ऊपर रखें", // Keep neck up
      "पेट को अंदर की ओर खींचें", // Pull belly in
      "घुटने को मोड़ें", // Bend your knees
      "पीठ को सीधा रखें", // Keep back straight
    ],
    good: [
      "बहुत अच्छा! मुद्रा सही है", // Very good! Posture is correct
      "शानदार! यह सही फॉर्म है", // Excellent! This is correct form
      "आप सही रास्ते पर हैं", // You're on the right path
      "परफेक्ट! ऐसे ही जारी रखें", // Perfect! Keep it up
    ]
  },
  reps: {
    count: [
      "एक", // One
      "दो", // Two
      "तीन", // Three
      "चार", // Four
      "पांच", // Five
      "छः", // Six
      "सात", // Seven
      "आठ", // Eight
      "नौ", // Nine
      "दस", // Ten
    ],
    motivation: [
      "एक और कर सकते हो", // You can do one more
      "चल जारी रखो", // Keep going
      "तुम यह कर सकते हो", // You can do this
      "बस कुछ और", // Just a few more
      "शक्तिशाली बनो", // Be strong
    ]
  },
  breathing: {
    tips: [
      "साँस लो", // Breathe in
      "साँस छोड़ो", // Breathe out
      "गहरी साँस लो", // Take a deep breath
      "धीरे-धीरे साँस लो", // Breathe slowly
    ]
  }
};

// Initialize speech synthesis
const synth = window.speechSynthesis;

/**
 * Speak Hindi feedback
 */
export const speakHindi = (text, rate = 1) => {
  // Cancel any ongoing speech
  if (synth.speaking) {
    synth.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set language to Hindi
  utterance.lang = 'hi-IN';
  utterance.rate = rate;
  utterance.pitch = 1;
  utterance.volume = 1;

  synth.speak(utterance);
  
  return new Promise((resolve) => {
    utterance.onend = resolve;
  });
};

/**
 * Give posture feedback based on posture score
 */
export const givePostureFeedback = async (postureScore) => {
  try {
    if (postureScore < 60) {
      // Bad posture - give correction
      const randomIndex = Math.floor(Math.random() * HINDI_FEEDBACK.posture.bad.length);
      const feedback = HINDI_FEEDBACK.posture.bad[randomIndex];
      await speakHindi(feedback, 0.9);
    } else if (postureScore >= 80) {
      // Good posture - give motivation
      const randomIndex = Math.floor(Math.random() * HINDI_FEEDBACK.posture.good.length);
      const feedback = HINDI_FEEDBACK.posture.good[randomIndex];
      await speakHindi(feedback, 1);
    }
  } catch (error) {
    console.error('Error speaking Hindi feedback:', error);
  }
};

/**
 * Count reps in Hindi
 */
export const countRepsHindi = async (repNumber) => {
  try {
    if (repNumber >= 1 && repNumber <= 10) {
      const hindi = HINDI_FEEDBACK.reps.count[repNumber - 1];
      await speakHindi(hindi, 1.2);
    }
  } catch (error) {
    console.error('Error counting reps in Hindi:', error);
  }
};

/**
 * Give motivational feedback
 */
export const giveMotivation = async () => {
  try {
    const randomIndex = Math.floor(Math.random() * HINDI_FEEDBACK.reps.motivation.length);
    const feedback = HINDI_FEEDBACK.reps.motivation[randomIndex];
    await speakHindi(feedback, 1);
  } catch (error) {
    console.error('Error giving motivation:', error);
  }
};

/**
 * Give breathing instructions
 */
export const giveBreathingTips = async (tipIndex = 0) => {
  try {
    const tip = HINDI_FEEDBACK.breathing.tips[tipIndex % HINDI_FEEDBACK.breathing.tips.length];
    await speakHindi(tip, 0.8);
  } catch (error) {
    console.error('Error giving breathing tips:', error);
  }
};

/**
 * Custom Hindi feedback
 */
export const speakCustomFeedback = async (message) => {
  try {
    await speakHindi(message);
  } catch (error) {
    console.error('Error speaking custom feedback:', error);
  }
};

// Export all constants
export { HINDI_FEEDBACK };
