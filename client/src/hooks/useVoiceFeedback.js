// Enhanced Voice Feedback Hook
import { useState, useRef, useCallback } from 'react';

export const useVoiceFeedback = () => {
  const [isEnabled, setIsEnabled] = useState(localStorage.getItem('voiceFeedback') !== 'false');
  const synth = useRef(window.speechSynthesis);
  const lastSpeakTimeRef = useRef(0);
  const cooldownMs = 1500; // 1.5 seconds cooldown

  const speak = useCallback(
    (text, options = {}) => {
      if (!isEnabled) return false;

      const now = Date.now();
      if (now - lastSpeakTimeRef.current < cooldownMs) {
        return false; // Skip due to cooldown
      }

      try {
        synth.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        synth.current.speak(utterance);
        lastSpeakTimeRef.current = now;
        return true;
      } catch (error) {
        console.error('Speech synthesis error:', error);
        return false;
      }
    },
    [isEnabled]
  );

  const stop = useCallback(() => {
    synth.current.cancel();
  }, []);

  const speakPostureCorrection = useCallback(
    (errors) => {
      if (!Array.isArray(errors) || errors.length === 0) return;

      const firstError = errors[0];
      const message =
        {
          'Shoulders not level': 'Keep your shoulders level',
          'Hips not level': 'Align your hips',
          'Knee angle too acute': 'Your knees are bending too much',
          'Not going deep enough': 'Go deeper with your squat',
          'Arms not sufficiently bent': 'Bend your arms more',
          'Not pulling high enough': 'Pull up higher',
        }[firstError] || firstError;

      speak(message, { rate: 0.85, pitch: 1.1 });
    },
    [speak]
  );

  const speakRepCount = useCallback(
    (currentReps, targetReps) => {
      const message = `${currentReps} out of ${targetReps} reps`;
      speak(message, { rate: 0.9, pitch: 1.0 });
    },
    [speak]
  );

  const speakPerformance = useCallback(
    (score) => {
      let message = '';
      if (score >= 90) {
        message = 'Excellent! Perfect form!';
      } else if (score >= 75) {
        message = 'Great work! Good form!';
      } else if (score >= 60) {
        message = 'Good effort. Focus on form.';
      } else {
        message = 'Keep improving your technique.';
      }
      speak(message, { rate: 0.9, pitch: 1.0 });
    },
    [speak]
  );

  const speakMotivation = useCallback(() => {
    const messages = [
      'Keep pushing!',
      'You got this!',
      'Great effort!',
      'Almost there!',
      'One more set!',
      'Stay strong!',
      'You are awesome!',
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    speak(randomMessage, { rate: 0.95, pitch: 1.1 });
  }, [speak]);

  const speakCountdown = useCallback(
    (seconds) => {
      speak(String(seconds), { rate: 1.0, pitch: 1.2 });
    },
    [speak]
  );

  const toggleEnabled = useCallback(() => {
    setIsEnabled((prev) => {
      localStorage.setItem('voiceFeedback', !prev);
      return !prev;
    });
  }, []);

  return {
    isEnabled,
    toggleEnabled,
    speak,
    stop,
    speakPostureCorrection,
    speakRepCount,
    speakPerformance,
    speakMotivation,
    speakCountdown,
  };
};

export default useVoiceFeedback;
