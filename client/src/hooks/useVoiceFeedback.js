// Enhanced Voice Feedback Hook - FULLY FIXED
import { useState, useRef, useCallback, useEffect } from 'react';

export const useVoiceFeedback = () => {
  const [isEnabled, setIsEnabled] = useState(localStorage.getItem('voiceFeedback') !== 'false');
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const synth = useRef(window.speechSynthesis);
  const lastSpeakTimeRef = useRef(0);
  const cooldownMs = 3000; // 3 seconds minimum between voice outputs
  const utteranceRef = useRef(null);

  // CRITICAL: Unlock audio context with user interaction
  useEffect(() => {
    const unlockAudio = () => {
      console.log('🔓 Attempting to unlock audio...');
      try {
        // Resume speech synthesis (needed for Safari and some browsers)
        window.speechSynthesis.resume();
        
        // Create a silent utterance to unlock audio
        const silentUtterance = new SpeechSynthesisUtterance('');
        silentUtterance.volume = 0;
        window.speechSynthesis.speak(silentUtterance);
        
        setIsAudioUnlocked(true);
        console.log('✅ Audio unlocked - voice feedback ready');
      } catch (error) {
        console.error('Audio unlock error:', error);
      }
    };

    // Listen for first user interaction
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, unlockAudio, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, unlockAudio);
      });
    };
  }, []);

  // Main speak function with proper error handling
  const speak = useCallback(
    (text, options = {}) => {
      if (!isEnabled) {
        console.log('ℹ️ Voice feedback disabled');
        return false;
      }

      if (!isAudioUnlocked) {
        console.warn('⚠️ Audio not unlocked yet - require user interaction');
        return false;
      }

      const now = Date.now();
      if (now - lastSpeakTimeRef.current < cooldownMs) {
        console.log('⏳ Cooldown active - skipping speech');
        return false;
      }

      try {
        // Cancel any ongoing speech
        synth.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        // Set proper voice for better clarity
        const voices = synth.current.getVoices();
        if (voices.length > 0) {
          utterance.voice = voices[0]; // Use default system voice
        }

        utteranceRef.current = utterance;

        // Add event listeners for debugging
        utterance.onstart = () => console.log('🔊 Speaking:', text);
        utterance.onend = () => console.log('✅ Speech ended');
        utterance.onerror = (event) => {
          console.error('❌ Speech error:', event.error);
        };

        window.speechSynthesis.speak(utterance);
        lastSpeakTimeRef.current = now;

        console.log('📢 Voice output:', text);
        return true;
      } catch (error) {
        console.error('❌ Speech synthesis error:', error);
        return false;
      }
    },
    [isEnabled, isAudioUnlocked]
  );

  // Stop ongoing speech
  const stop = useCallback(() => {
    try {
      synth.current.cancel();
      console.log('⏹️ Speech stopped');
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }, []);

  // Posture correction feedback
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

  // Rep count feedback
  const speakRepCount = useCallback(
    (currentReps, targetReps) => {
      const message = `${currentReps} out of ${targetReps} reps completed`;
      speak(message, { rate: 0.9, pitch: 1.0 });
    },
    [speak]
  );

  // Performance feedback
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

  // Motivation message
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

  // Enable/disable voice feedback
  const toggleVoice = useCallback((enabled) => {
    setIsEnabled(enabled);
    localStorage.setItem('voiceFeedback', enabled ? 'true' : 'false');
    console.log(enabled ? '🔊 Voice enabled' : '🔇 Voice disabled');
  }, []);

  return {
    speak,
    stop,
    isEnabled,
    isAudioUnlocked,
    toggleVoice,
    speakPostureCorrection,
    speakRepCount,
    speakPerformance,
    speakMotivation,
  };
};

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
