// Main Workout Page Component
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaPipePose from '../components/MediaPipePose';
import { PostureDetector, RepCounter, PerformanceScorer, VoiceFeedback } from '../utils/ai';
import { workoutService } from '../services/api';

const Workout = () => {
  const navigate = useNavigate();
  const [exerciseType, setExerciseType] = useState('squat');
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [repCounter, setRepCounter] = useState(null);
  const [postureScore, setPostureScore] = useState(100);
  const [voiceFeedback, setVoiceFeedback] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [postureFeedback, setPostureFeedback] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [showWorkoutSetup, setShowWorkoutSetup] = useState(true);

  const countdownIntervalRef = useRef(null);
  const workoutIntervalRef = useRef(null);

  // Initialize voice feedback
  useEffect(() => {
    const feedback = new VoiceFeedback();
    setVoiceFeedback(feedback);
  }, []);

  // Update voice enabled setting
  useEffect(() => {
    if (voiceFeedback) {
      voiceFeedback.setEnabled(voiceEnabled);
    }
  }, [voiceEnabled, voiceFeedback]);

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

  const startWorkoutCountdown = () => {
    setShowWorkoutSetup(false);
    let countdown = 3;

    const countdownInterval = setInterval(() => {
      if (countdown > 0) {
        voiceFeedback?.feedbackCountdown(countdown);
        countdown--;
      } else {
        clearInterval(countdownInterval);
        startWorkout();
      }
    }, 1000);

    countdownIntervalRef.current = countdownInterval;
  };

  const startWorkout = () => {
    const counter = new RepCounter(exerciseType);
    setRepCounter(counter);
    setIsWorkoutActive(true);
    setStartTime(new Date());
    setElapsedTime(0);
    voiceFeedback?.feedbackStart(exerciseType);
  };

  const handlePoseDetected = (results) => {
    if (!isWorkoutActive || !repCounter) return;

    const landmarks = results.poseLandmarks;
    if (!landmarks) return;

    // Calculate posture score
    const score = PostureDetector.calculatePostureScore(landmarks);
    setPostureScore(score);
    repCounter.addPostureScore(score);

    // Get posture feedback
    const feedback = PostureDetector.getPostureFeedback(landmarks);
    setPostureFeedback(feedback);

    // Provide voice feedback for poor posture
    if (score < 60 && voiceEnabled) {
      feedback.forEach((msg) => {
        voiceFeedback?.speak(msg);
      });
    }

    // Detect reps
    const repDetected = repCounter.detect(landmarks);
    if (repDetected) {
      // Provide rep feedback
      if (voiceEnabled) {
        voiceFeedback?.feedbackReps(
          repCounter.getRepCount(),
          10
        );
      }
    }
  };

  const endWorkout = async () => {
    setIsWorkoutActive(false);
    clearInterval(workoutIntervalRef.current);
    clearInterval(countdownIntervalRef.current);

    const finalRepCount = repCounter?.getRepCount() || 0;
    const avgPostureScore = repCounter?.getAveragePostureScore() || 0;
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

    // Provide end feedback
    voiceFeedback?.feedbackEnd(finalRepCount, performanceScore);

    // Save to backend
    try {
      await workoutService.createWorkout(workoutData);
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (showWorkoutSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-6">
        <div className="card w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">
            Select Exercise
          </h1>

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                Choose Exercise Type
              </label>
              <select
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value)}
                className="input-field"
              >
                <option value="squat">Squat</option>
                <option value="push_up">Push-Up</option>
                <option value="pull_up">Pull-Up</option>
                <option value="sit_up">Sit-Up</option>
                <option value="burpee">Burpee</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="voice"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="w-5 h-5"
              />
              <label htmlFor="voice" className="text-gray-700 font-semibold">
                Enable Voice Feedback 🔊
              </label>
            </div>
          </div>

          <button
            onClick={startWorkoutCountdown}
            className="btn-primary w-full mb-4"
          >
            Start Workout
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary w-full"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (sessionData) {
    const { workout, performanceScore, suggestions } = sessionData;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="card mb-8">
            <h1 className="text-4xl font-bold mb-8 text-center text-green-600">
              🎉 Workout Complete!
            </h1>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-2">Reps</p>
                <p className="text-3xl font-bold text-blue-600">{workout.reps}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-2">Duration</p>
                <p className="text-3xl font-bold text-green-600">{formatTime(workout.duration)}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-2">Posture</p>
                <p className="text-3xl font-bold text-orange-600">{workout.postureScore}%</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm mb-2">Performance</p>
                <p className="text-3xl font-bold text-red-600">{performanceScore}%</p>
              </div>
            </div>

            {/* Calories */}
            <div className="bg-purple-50 p-6 rounded-lg mb-8">
              <p className="text-gray-600 text-lg mb-2">Calories Burned</p>
              <p className="text-4xl font-bold text-purple-600">🔥 {workout.caloriesBurned} kcal</p>
            </div>

            {/* Suggestions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">AI Suggestions</h2>
              <div className="space-y-3">
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-l-4 ${
                      suggestion.priority === 'high'
                        ? 'bg-red-50 border-red-500'
                        : suggestion.priority === 'medium'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-green-50 border-green-500'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{suggestion.message}</p>
                    <p className="text-gray-600 text-sm mt-1">💡 {suggestion.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary flex-1"
              >
                View Dashboard
              </button>
              <button
                onClick={() => {
                  setShowWorkoutSetup(true);
                  setSessionData(null);
                  setRepCounter(null);
                }}
                className="btn-success flex-1"
              >
                Start Another Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            💪 {exerciseType.toUpperCase().replace('_', ' ')}
          </h1>
          <button
            onClick={() => {
              endWorkout();
            }}
            className="btn-danger"
          >
            End Workout
          </button>
        </div>

        {/* Main workout area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video/Pose Detection - Large area */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden h-96 lg:h-full min-h-96">
              <MediaPipePose onPoseDetected={handlePoseDetected} isRunning={isWorkoutActive} />
            </div>
          </div>

          {/* Stats Panel */}
          <div className="space-y-4">
            {/* Timer */}
            <div className="card bg-gray-800 text-center">
              <p className="text-gray-300 text-sm mb-2">ELAPSED TIME</p>
              <p className="text-5xl font-bold text-blue-400">{formatTime(elapsedTime)}</p>
            </div>

            {/* Reps Counter */}
            <div className="card bg-gray-800 text-center">
              <p className="text-gray-300 text-sm mb-2">REPS</p>
              <p className="text-5xl font-bold text-green-400">{repCounter?.getRepCount() || 0}</p>
            </div>

            {/* Posture Score */}
            <div className="card bg-gray-800 text-center">
              <p className="text-gray-300 text-sm mb-2">POSTURE SCORE</p>
              <p className={`text-5xl font-bold ${
                postureScore >= 80 
                  ? 'text-green-400' 
                  : postureScore >= 60 
                  ? 'text-yellow-400' 
                  : 'text-red-400'
              }`}>
                {postureScore}%
              </p>
            </div>

            {/* Voice Toggle */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                voiceEnabled
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {voiceEnabled ? '🔊 Voice ON' : '🔇 Voice OFF'}
            </button>

            {/* Posture Feedback */}
            {postureFeedback.length > 0 && (
              <div className="card bg-orange-900 border border-orange-500">
                <p className="text-sm font-semibold text-orange-100 mb-2">Form Tips:</p>
                {postureFeedback.map((feedback, idx) => (
                  <p key={idx} className="text-xs text-orange-50 mb-1">
                    • {feedback}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workout;
