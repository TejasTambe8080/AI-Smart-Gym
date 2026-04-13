// Refactored Workout Page - Dynamic Exercise Selection from Database
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaPipePose from '../components/MediaPipePose';
import ExerciseCard from '../components/ExerciseCard';
import { PostureDetector, RepCounter, PerformanceScorer, VoiceFeedback } from '../utils/ai';
import { workoutService } from '../services/api';
import { useExercises, useMuscleGroups } from '../hooks/useExercises';

const WorkoutRefactored = () => {
  const navigate = useNavigate();
  
  // State: Step management
  const [step, setStep] = useState(1); // 1: Muscle, 2: Exercise, 3: Details, 4: Workout, 5: Results
  const [muscleGroup, setMuscleGroup] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [repCounter, setRepCounter] = useState(null);
  const [postureScore, setPostureScore] = useState(100);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [sessionData, setSessionData] = useState(null);

  const voiceFeedbackRef = useRef(null);
  const workoutIntervalRef = useRef(null);

  // Fetch exercises dynamically from database
  const { exercises, loading: exercisesLoading, error: exercisesError } = useExercises(muscleGroup);
  const { groups, loading: groupsLoading, error: groupsError } = useMuscleGroups();

  // Initialize voice
  useEffect(() => {
    const voice = new VoiceFeedback();
    voiceFeedbackRef.current = voice;
    voice.setEnabled(voiceEnabled);
  }, [voiceEnabled]);

  // Timer for workout
  useEffect(() => {
    if (!isWorkoutActive) return;
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    workoutIntervalRef.current = interval;
    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  //  Muscle group card icons
  const muscleGroupIcons = {
    chest: '🫀',
    back: '🔙',
    biceps: '💪',
    triceps: '💪',
    legs: '🦵',
    abs: '🫶',
    cardio: '💨',
  };

  const startWorkout = () => {
    setStep(4);
    setIsWorkoutActive(true);
    const counter = new RepCounter(selectedExercise.name.toLowerCase().replace(' ', '_'));
    setRepCounter(counter);
    voiceFeedbackRef.current?.feedbackStart(selectedExercise.name);
  };

  const endWorkout = async () => {
    setIsWorkoutActive(false);
    clearInterval(workoutIntervalRef.current);

    const finalRepCount = repCounter?.getRepCount() || 0;
    const avgPostureScore = repCounter?.getAveragePostureScore() || 0;

    const performanceScore = PerformanceScorer.calculatePerformanceScore({
      postureScore: avgPostureScore,
      reps: finalRepCount,
      targetReps: selectedExercise.targetReps,
      consistency: 0.85,
    });

    const suggestions = PerformanceScorer.generateSuggestions({
      postureScore: avgPostureScore,
      reps: finalRepCount,
      targetReps: selectedExercise.targetReps,
      performanceScore,
    });

    const caloriesBurned = PerformanceScorer.estimateCaloriesBurned(
      selectedExercise.name.toLowerCase().replace(' ', '_'),
      elapsedTime / 60,
      performanceScore
    );

    const workoutData = {
      exerciseType: selectedExercise.name,
      muscleGroup: muscleGroup,
      reps: finalRepCount,
      sets: 1,
      duration: elapsedTime,
      postureScore: avgPostureScore,
      caloriesBurned,
      performanceMetrics: {
        consistency: 85,
        depth: performanceScore,
        speed: 80,
      },
    };

    setSessionData({ workout: workoutData, performanceScore, suggestions });
    setStep(5);

    // Save to backend
    try {
      await workoutService.createWorkout(workoutData);
    } catch (error) {
      console.error('Error saving workout:', error);
    }

    voiceFeedbackRef.current?.feedbackEnd(finalRepCount, performanceScore);
  };

  const handlePoseDetected = (results) => {
    if (!isWorkoutActive || !repCounter || !results.poseLandmarks) return;

    const landmarks = results.poseLandmarks;
    const score = PostureDetector.calculatePostureScore(landmarks);
    setPostureScore(score);
    repCounter.addPostureScore(score);

    const feedback = PostureDetector.getPostureFeedback(landmarks);
    if (score < 60 && voiceEnabled && Math.random() < 0.05) {
      voiceFeedbackRef.current?.speak(feedback[0]);
    }

    const repDetected = repCounter.detect(landmarks);
    if (repDetected && voiceEnabled) {
      voiceFeedbackRef.current?.feedbackReps(repCounter.getRepCount(), selectedExercise.targetReps);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ========== STEP 1: Muscle Group Selection ==========
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏋️ Select Muscle Group</h1>
          <p className="text-gray-600 mb-8">Choose the area you want to work on today</p>

          {/* Loading State */}
          {groupsLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin text-5xl">⏳</div>
              <p className="text-gray-600 mt-4">Loading available muscle groups...</p>
            </div>
          )}

          {/* Error State */}
          {groupsError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8">
              <p className="font-bold">Error loading muscle groups</p>
              <p className="text-sm">{groupsError}</p>
            </div>
          )}

          {/* Muscle Group Grid */}
          {!groupsLoading && groups.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <button
                  key={group.group}
                  onClick={() => {
                    setMuscleGroup(group.group);
                    setStep(2);
                  }}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-blue-500"
                >
                  <div className="text-6xl mb-4 group-hover:scale-125 transition-transform">
                    {muscleGroupIcons[group.group] || '💪'}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">{group.group}</h2>
                  <p className="text-gray-600 text-sm">{group.count} exercises available</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========== STEP 2: Exercise Selection (DYNAMIC FROM DB) ==========
  if (step === 2 && muscleGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => {
              setStep(1);
              setMuscleGroup(null);
            }}
            className="mb-8 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold flex items-center gap-2"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            {muscleGroupIcons[muscleGroup] || '💪'} Select Exercise
          </h1>
          <p className="text-gray-600 mb-8">
            {exercisesLoading ? 'Loading exercises...' : `Choose an exercise for ${muscleGroup}`}
          </p>

          {/* Loading State */}
          {exercisesLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin text-5xl">⏳</div>
              <p className="text-gray-600 mt-4">Fetching exercises from database...</p>
            </div>
          )}

          {/* Error State */}
          {exercisesError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8">
              <p className="font-bold">Error loading exercises</p>
              <p className="text-sm">{exercisesError}</p>
            </div>
          )}

          {/* Exercise Grid (DYNAMIC) */}
          {!exercisesLoading && exercises.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise._id}
                  exercise={exercise}
                  onSelect={(selected) => {
                    setSelectedExercise(selected);
                    setStep(3);
                  }}
                  isSelected={selectedExercise?._id === exercise._id}
                />
              ))}
            </div>
          )}

          {/* No Exercises Found */}
          {!exercisesLoading && exercises.length === 0 && !exercisesError && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <p className="text-6xl mb-4">🤔</p>
              <p className="text-gray-600 text-lg">No exercises found for {muscleGroup}</p>
              <button
                onClick={() => setStep(1)}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
              >
                Choose Different Muscle Group
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========== STEP 3: Exercise Details ==========
  if (step === 3 && selectedExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setStep(2)}
            className="mb-8 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold flex items-center gap-2"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-8">{selectedExercise.name}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Exercise Details */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Details</h2>

              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-2">Description</p>
                  <p className="text-lg text-gray-800 font-semibold">{selectedExercise.description}</p>
                </div>

                <div>
                  <p className="text-gray-600 mb-2">Target Reps</p>
                  <p className="text-3xl font-bold text-blue-600">{selectedExercise.targetReps}</p>
                </div>

                <div>
                  <p className="text-gray-600 mb-2">Difficulty</p>
                  <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-bold capitalize">
                    {selectedExercise.difficulty}
                  </span>
                </div>

                <div>
                  <p className="text-gray-600 mb-3">Equipment</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.equipment?.map((equip, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold capitalize text-sm">
                        {equip}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-600 mb-2">Estimated Calories</p>
                  <p className="text-2xl font-bold text-red-600">🔥 ~{selectedExercise.caloriesBurned} cal</p>
                </div>
              </div>
            </div>

            {/* Form Instructions */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">✅ Proper Form</h2>

              <div className="space-y-3">
                {selectedExercise.instructions?.map((instruction, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xl font-bold text-blue-600 min-w-6">{instruction.order}.</span>
                    <p className="text-gray-700 font-semibold">{instruction.step}</p>
                  </div>
                ))}
              </div>

              {!selectedExercise.instructions || selectedExercise.instructions.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <p>No form instructions available</p>
                </div>
              )}
            </div>
          </div>

          {/* Ready Button */}
          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 px-6 py-4 bg-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-400 transition"
            >
              Choose Different
            </button>
            <button
              onClick={startWorkout}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition transform hover:scale-105"
            >
              🚀 Start Workout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 4: During Workout ==========
  if (step === 4 && selectedExercise && isWorkoutActive) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">{selectedExercise.name}</h1>
              <p className="text-gray-300">Target: {selectedExercise.targetReps} reps</p>
            </div>
            <button
              onClick={endWorkout}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-lg"
            >
              ⏹ End Workout
            </button>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Camera - Spans 2 cols on desktop */}
            <div className="lg:col-span-2">
              <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video">
                <MediaPipePose onPoseDetected={handlePoseDetected} isRunning={isWorkoutActive} />
              </div>
            </div>

            {/* Live Stats */}
            <div className="lg:col-span-2 space-y-4">
              {/* Reps Counter */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-lg">
                <p className="text-gray-300 text-sm font-semibold mb-2">REPS</p>
                <p className="text-6xl font-bold text-cyan-400">{repCounter?.getRepCount() || 0}</p>
                <p className="text-sm text-gray-300 mt-2">of {selectedExercise.targetReps} target</p>
              </div>

              {/* Timer */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-lg">
                <p className="text-gray-300 text-sm font-semibold mb-2">TIME</p>
                <p className="text-5xl font-bold text-purple-300">{formatTime(elapsedTime)}</p>
              </div>

              {/* Posture Score */}
              <div
                className={`bg-gradient-to-br rounded-2xl p-6 shadow-lg ${
                  postureScore >= 80
                    ? 'from-green-600 to-green-800'
                    : postureScore >= 60
                    ? 'from-yellow-600 to-yellow-800'
                    : 'from-red-600 to-red-800'
                }`}
              >
                <p className="text-gray-300 text-sm font-semibold mb-2">POSTURE</p>
                <p className="text-5xl font-bold">{postureScore}%</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-6 py-3 rounded-xl font-bold text-lg transition ${
                voiceEnabled
                  ? 'bg-gradient-to-r from-green-500 to-cyan-500'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========== STEP 5: Results ==========
  if (step === 5 && sessionData) {
    const { workout, performanceScore, suggestions } = sessionData;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="text-7xl mb-4">🎉</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Workout Complete!</h1>
            <p className="text-gray-600 text-lg">Great job! Here's your summary</p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <p className="text-gray-600 text-sm font-semibold mb-2">REPS</p>
              <p className="text-4xl font-bold text-blue-600">{workout.reps}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <p className="text-gray-600 text-sm font-semibold mb-2">TIME</p>
              <p className="text-4xl font-bold text-purple-600">{formatTime(workout.duration)}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <p className="text-gray-600 text-sm font-semibold mb-2">POSTURE</p>
              <p className="text-4xl font-bold text-green-600">{workout.postureScore}%</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <p className="text-gray-600 text-sm font-semibold mb-2">CALORIES</p>
              <p className="text-4xl font-bold text-red-600">🔥 {workout.caloriesBurned}</p>
            </div>
          </div>

          {/* Performance Score */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg mb-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Overall Performance</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-6xl font-bold text-blue-600">{performanceScore}%</p>
                <p className="text-gray-600 mt-2">
                  {performanceScore >= 85 && '⭐ Excellent!'}
                  {performanceScore >= 70 && performanceScore < 85 && '👍 Good job!'}
                  {performanceScore < 70 && '💪 Keep improving!'}
                </p>
              </div>
              <div className="text-6xl">
                {performanceScore >= 85 && '🏆'}
                {performanceScore >= 70 && performanceScore < 85 && '🎯'}
                {performanceScore < 70 && '🚀'}
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 AI Suggestions</h2>
            <div className="space-y-4">
              {suggestions.slice(0, 3).map((suggestion, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border-l-4 border-blue-500">
                  <p className="font-bold text-gray-900">{suggestion.message}</p>
                  <p className="text-sm text-gray-600 mt-2">💡 {suggestion.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-4 bg-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-400"
            >
              📊 View Dashboard
            </button>
            <button
              onClick={() => {
                setStep(1);
                setMuscleGroup(null);
                setSelectedExercise(null);
                setSessionData(null);
                setElapsedTime(0);
              }}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg"
            >
              🔄 Another Workout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default WorkoutRefactored;
