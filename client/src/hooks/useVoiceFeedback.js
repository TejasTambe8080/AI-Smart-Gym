// Enhanced Voice Feedback Hook - stable production version
import { useState, useRef, useCallback, useEffect } from 'react';

export const useVoiceFeedback = () => {
  const [isEnabled, setIsEnabled] = useState(localStorage.getItem('voiceFeedback') !== 'false');
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const synth = useRef(window.speechSynthesis);
  const lastSpeakTimeRef = useRef(0);
  const cooldownMs = 3000;

  useEffect(() => {
    const unlockAudio = () => {
      try {
        window.speechSynthesis.resume();
        const silentUtterance = new SpeechSynthesisUtterance('');
        silentUtterance.volume = 0;
        window.speechSynthesis.speak(silentUtterance);
        setIsAudioUnlocked(true);
      } catch (error) {
        console.error('Audio unlock error:', error);
      }
    };

    const events = ['click', 'touchstart', 'keydown'];
    events.forEach((event) => {
      document.addEventListener(event, unlockAudio, { once: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, unlockAudio);
      });
    };
  }, []);

  const speak = useCallback(
    (text, options = {}) => {
      if (!isEnabled || !isAudioUnlocked) return false;

      const now = Date.now();
      if (now - lastSpeakTimeRef.current < cooldownMs) return false;

      try {
        synth.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;
        utterance.lang = options.lang || 'en-US';

        const voices = synth.current.getVoices();
        if (voices.length > 0) {
          utterance.voice = voices.find((voice) => voice.lang?.startsWith(utterance.lang)) || voices[0];
        }

        window.speechSynthesis.speak(utterance);
        lastSpeakTimeRef.current = now;
        return true;
      } catch (error) {
        console.error('Speech synthesis error:', error);
        return false;
      }
    },
    [isEnabled, isAudioUnlocked]
  );

  const stop = useCallback(() => {
    try {
      synth.current.cancel();
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }, []);

  const speakPostureCorrection = useCallback(
    (errors) => {
      if (!Array.isArray(errors) || errors.length === 0) return;

      const firstError = errors[0];
      const message =
        {
          'Shoulders not level': 'कंधों को सीधा रखें',
          'Hips not level': 'कूल्हों को सीधा रखें',
          'Knee angle too acute': 'घुटनों को थोड़ा और मोड़ें',
          'Not going deep enough': 'और नीचे जाएं',
          'Arms not sufficiently bent': 'हाथों को थोड़ा और मोड़ें',
          'Not pulling high enough': 'थोड़ा और ऊपर खींचें',
        }[firstError] || firstError;

      speak(message, { rate: 0.85, pitch: 1.05, lang: 'hi-IN' });
    },
    [speak]
  );

  const speakPostureCorrectionHindi = useCallback(
    (errors) => {
      if (!Array.isArray(errors) || errors.length === 0) return;
      speakPostureCorrection(errors);
    },
    [speakPostureCorrection]
  );

  const speakRepCount = useCallback(
    (currentReps, targetReps) => {
      speak(`${currentReps} out of ${targetReps} reps completed`, { rate: 0.9, pitch: 1.0 });
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

  const toggleVoice = useCallback((enabled) => {
    setIsEnabled(enabled);
    localStorage.setItem('voiceFeedback', enabled ? 'true' : 'false');
  }, []);

  return {
    speak,
    stop,
    isEnabled,
    isAudioUnlocked,
    toggleVoice,
    speakPostureCorrection,
    speakPostureCorrectionHindi,
    speakRepCount,
    speakPerformance,
    speakMotivation,
    speakCountdown,
  };
};

export default useVoiceFeedback;
