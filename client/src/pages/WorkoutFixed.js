// Main Workout Page - FULLY FIXED & MOBILE RESPONSIVE
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaPipePose from '../components/MediaPipePose';
import { PostureDetector, RepCounter, PerformanceScorer, VoiceFeedback } from '../utils/ai';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { workoutService } from '../services/api';

const WorkoutFixed = () => {
  const navigate = useNavigate();

  // State management
  const [exerciseType, setExerciseType] = useState('squat');
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [repCounter, setRepCounter] = useState(null);
  const [postureScore, setPostureScore] = useState(100);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [postureFeedback, setPostureFeedback] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [showWorkoutSetup, setShowWorkoutSetup] = useState(true);
  const [countdownValue, setCountdownValue] = useState(null);

  // Hooks
  const voiceFeedbackHook = useVoiceFeedback();

  const countdownIntervalRef = useRef(null);
  const workoutIntervalRef = useRef(null);

  // Update voice setting in localStorage
  useEffect(() => {
    localStorage.setItem('voiceFeedback', voiceEnabled ? 'true' : 'false');
  }, [voiceEnabled]);

  // Track elapsed time
  useEffect(() => {
    if (!isWorkoutActive || !startTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 100);

    workoutIntervalRef.current = interval;
    return () => clearInterval(interval);
  }, [isWorkoutActive, startTime]);

  // Countdown before workout starts
  const startWorkoutCountdown = () => {
    console.log('⏰ Starting 3-second countdown...');
    setShowWorkoutSetup(false);
    let countdown = 3;
    setCountdownValue(countdown);

    const countdownInterval = setInterval(() => {
      countdown--;
      setCountdownValue(countdown);

      if (voiceEnabled && countdown > 0) {
        voiceFeedbackHook.speak(countdown.toString(), { rate: 1.0, pitch: 1.2 });
      }

      if (countdown <= 0) {
        clearInterval(countdownInterval);
        startWorkout();
      }
    }, 1000);

    countdownIntervalRef.current = countdownInterval;
  };

  // Start the actual workout
  const startWorkout = () => {
    console.log('🚀 Workout started!');
    const counter = new RepCounter(exerciseType);
    setRepCounter(counter);
    setIsWorkoutActive(true);
    setStartTime(new Date());
    setElapsedTime(0);
    setCountdownValue(null);

    if (voiceEnabled) {
      voiceFeedbackHook.speak(
        `Starting ${exerciseType.replace('_', ' ')} workout. Good luck!`,
        { rate: 0.9, pitch: 1.0 }
      );
    }
  };

  // Handle pose detection - CRITICAL INTEGRATION
  const handlePoseDetected = (results) => {
    if (!isWorkoutActive || !repCounter) return;

    const landmarks = results.poseLandmarks;
    if (!landmarks || landmarks.length === 0) {
      console.warn('⚠️ No landmarks detected');
      return;
    }

    // Calculate posture score
    try {
      const score = PostureDetector.calculatePostureScore(landmarks);
      setPostureScore(score);
      repCounter.addPostureScore(score);

      // Get posture feedback
      const feedback = PostureDetector.getPostureFeedback(landmarks);
      setPostureFeedback(feedback);

      // Provide voice feedback for poor posture
      if (score < 60 && voiceEnabled && feedback.length > 0) {
        voiceFeedbackHook.speakPostureCorrection(feedback);
      }

      // Detect reps
      const repDetected = repCounter.detect(landmarks);
      if (repDetected) {
        const currentReps = repCounter.getRepCount();
        console.log('✅ Rep detected! Total:', currentReps);

        if (voiceEnabled) {
          voiceFeedbackHook.speakRepCount(currentReps, 10);
        }

        // Celebration every 5 reps
        if (currentReps % 5 === 0) {
          voiceFeedbackHook.speakMotivation();
        }
      }
    } catch (error) {
      console.error('Error processing pose:', error);
    }
  };

  // End workout and process results
  const endWorkout = async () => {
    console.log('🏁 Ending workout...');
    setIsWorkoutActive(false);
    clearInterval(workoutIntervalRef.current);
    clearInterval(countdownIntervalRef.current);

    if (!repCounter) {
      console.error('Rep counter not initialized');
      return;
    }

    const finalRepCount = repCounter.getRepCount();
    const avgPostureScore = repCounter.getAveragePostureScore();

    console.log(`📊 Final Stats: ${finalRepCount} reps, ${avgPostureScore}% posture`);

    const performanceData = {
      postureScore: avgPostureScore,
      reps: finalRepCount,
      targetReps: 10,
      consistency: 0.85,
    };

    const performanceScore = PerformanceScorer.calculatePerformanceScore(performanceData);
    const suggestions = PerformanceScorer.generateSuggestions({
      ...performanceData,
      performanceScore,
    });

    const caloriesBurned = PerformanceScorer.estimateCaloriesBurned(
      exerciseType,
      elapsedTime / 60,
      performanceScore
    );

    const workoutData = {
      exerciseType,
      reps: finalRepCount,
      sets: 1,
      duration: elapsedTime,
      postureScore: avgPostureScore,
      caloriesBurned,
      notes: `Performance Score: ${performanceScore}%`,
      postureDetails: {
        backBent: 0,
        kneesMisaligned: 0,
        shouldersMisaligned: 0,
      },
      performanceMetrics: {
        consistency: 85,
        depth: performanceScore,
        speed: 80,
      },
    };

    setSessionData({
      workout: workoutData,
      performanceScore,
      suggestions,
    });

    // End workout feedback
    if (voiceEnabled) {
      voiceFeedbackHook.speak(
        `Workout complete! You did ${finalRepCount} reps with ${performanceScore}% performance score.`,
        { rate: 0.9, pitch: 1.0 }
      );
    }

    // Save to backend
    try {
      await workoutService.createWorkout(workoutData);
      console.log('✅ Workout saved to backend');
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  // Format time: MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ============================================
  // RENDER: Workout Setup Screen
  // ============================================
  if (showWorkoutSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 flex items-center justify-center p-3 sm:p-6">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🏋️</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Select Exercise</h1>
            <p className="text-gray-600 text-sm mt-2">Choose your workout and get started</p>
          </div>

          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            {/* Exercise Type Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Choose Exercise Type
              </label>
              <select
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              >
                <option value="squat">🦵 Squat</option>
                <option value="push_up">💪 Push-Up</option>
                <option value="pull_up">🔝 Pull-Up</option>
                <option value="sit_up">⬆️ Sit-Up</option>
                <option value="burpee">🔄 Burpee</option>
              </select>
            </div>

            {/* Voice Feedback Toggle */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={voiceEnabled}
                  onChange={(e) => setVoiceEnabled(e.target.checked)}
                  className="w-5 h-5 accent-blue-600"
                />
                <div>
                  <p className="font-semibold text-gray-900">Enable Voice Feedback</p>
                  <p className="text-xs text-gray-600">Get real-time audio coaching during workout</p>
                </div>
              </label>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={startWorkoutCountdown}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 sm:py-4 rounded-lg transition-all duration-200 mb-3 text-base sm:text-lg"
          >
            ▶️ Start Workout
          </button>

          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 sm:py-3 rounded-lg transition-colors duration-200"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: Countdown Screen
  // ============================================
  if (countdownValue !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-white text-xl mb-8">Get Ready!</p>
          <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full border-4 border-blue-500 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
            <p className="text-7xl sm:text-9xl font-bold text-white">{countdownValue}</p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: Workout Complete Screen
  // ============================================
  if (sessionData) {
    const { workout, performanceScore, suggestions } = sessionData;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-green-600">Workout Complete!</h1>
          </div>

          {/* Stats Grid - Fully Responsive */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200">
              <p className="text-gray-600 text-xs sm:text-sm mb-2 font-semibold">REPS</p>
              <p className="text-2xl sm:text-4xl font-bold text-blue-600">{workout.reps}</p>
            </div>

            <div className="bg-green-50 p-4 sm:p-6 rounded-lg border border-green-200">
              <p className="text-gray-600 text-xs sm:text-sm mb-2 font-semibold">DURATION</p>
              <p className="text-2xl sm:text-4xl font-bold text-green-600">{formatTime(workout.duration)}</p>
            </div>

            <div className="bg-orange-50 p-4 sm:p-6 rounded-lg border border-orange-200">
              <p className="text-gray-600 text-xs sm:text-sm mb-2 font-semibold">POSTURE</p>
              <p className="text-2xl sm:text-4xl font-bold text-orange-600">{workout.postureScore}%</p>
            </div>

            <div className="bg-red-50 p-4 sm:p-6 rounded-lg border border-red-200">
              <p className="text-gray-600 text-xs sm:text-sm mb-2 font-semibold">PERFORMANCE</p>
              <p className="text-2xl sm:text-4xl font-bold text-red-600">{performanceScore}%</p>
            </div>
          </div>

          {/* Calories Burned */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 sm:p-8 rounded-lg text-white mb-6 sm:mb-8 text-center">
            <p className="text-gray-100 text-sm font-semibold mb-2">CALORIES BURNED</p>
            <p className="text-4xl sm:text-5xl font-bold">🔥 {workout.caloriesBurned} kcal</p>
          </div>

          {/* AI Suggestions */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">AI Suggestions</h2>
            <div className="space-y-3 sm:space-y-4">
              {suggestions && suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 rounded-lg border-l-4 ${
                    suggestion.priority === 'high'
                      ? 'bg-red-50 border-red-500'
                      : suggestion.priority === 'medium'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-green-50 border-green-500'
                  }`}
                >
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{suggestion.message}</p>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">💡 {suggestion.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 rounded-lg transition-colors duration-200 text-base sm:text-lg"
            >
              📊 View Dashboard
            </button>
            <button
              onClick={() => {
                setShowWorkoutSetup(true);
                setSessionData(null);
                setRepCounter(null);
                setElapsedTime(0);
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 sm:py-4 rounded-lg transition-colors duration-200 text-base sm:text-lg"
            >
              🔄 Another Workout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: Active Workout Screen - FULLY RESPONSIVE
  // ============================================
  return (
    <div className="min-h-screen bg-gray-900 text-white p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile optimized */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            💪 {exerciseType.toUpperCase().replace('_', ' ')}
          </h1>
          <button
            onClick={endWorkout}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            End Workout
          </button>
        </div>

        {/* Main Workout Area - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Video/Pose Detection - Responsive height */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden aspect-video lg:aspect-auto lg:h-[600px]">
              <MediaPipePose onPoseDetected={handlePoseDetected} isRunning={isWorkoutActive} />
            </div>
          </div>

          {/* Stats Panel - Responsive Stack */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:space-y-4">
            {/* Timer */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 sm:p-6 rounded-lg text-center col-span-2 lg:col-span-1">
              <p className="text-blue-100 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">ELAPSED TIME</p>
              <p className="text-3xl sm:text-5xl font-bold text-blue-300">{formatTime(elapsedTime)}</p>
            </div>

            {/* Reps Counter */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 sm:p-6 rounded-lg text-center">
              <p className="text-green-100 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">REPS</p>
              <p className="text-3xl sm:text-5xl font-bold text-green-300">{repCounter?.getRepCount() || 0}</p>
            </div>

            {/* Posture Score */}
            <div
              className={`p-4 sm:p-6 rounded-lg text-center ${
                postureScore >= 80
                  ? 'bg-gradient-to-br from-green-600 to-green-700'
                  : postureScore >= 60
                  ? 'bg-gradient-to-br from-yellow-600 to-yellow-700'
                  : 'bg-gradient-to-br from-red-600 to-red-700'
              }`}
            >
              <p className="text-gray-100 text-xs sm:text-sm font-semibold mb-1 sm:mb-2">POSTURE SCORE</p>
              <p className="text-3xl sm:text-5xl font-bold">{postureScore}%</p>
            </div>

            {/* Voice Toggle Button */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`col-span-2 lg:col-span-1 py-3 sm:py-4 rounded-lg font-bold transition-all duration-200 text-sm sm:text-base ${
                voiceEnabled
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {voiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}
            </button>

            {/* Posture Feedback - Mobile optimized */}
            {postureFeedback.length > 0 && (
              <div className="col-span-2 lg:col-span-1 bg-orange-900 border border-orange-500 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm font-semibold text-orange-200 mb-2">📝 Form Tips:</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {postureFeedback.map((feedback, idx) => (
                    <p key={idx} className="text-xs text-orange-100">
                      • {feedback}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutFixed;