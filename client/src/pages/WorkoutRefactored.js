import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaPipePose from '../components/MediaPipePose';
import { exerciseService, workoutService } from '../services/api';
import { PostureDetector, PerformanceScorer, RepCounter, VoiceFeedback } from '../utils/ai';

const MUSCLE_GROUPS = [
  { key: 'chest', label: 'Chest', icon: '🏋️', description: 'Press and fly movements' },
  { key: 'back', label: 'Back', icon: '🔙', description: 'Pulling and rowing work' },
  { key: 'biceps', label: 'Biceps', icon: '💪', description: 'Arm curl variations' },
  { key: 'triceps', label: 'Triceps', icon: '🦾', description: 'Push and extension work' },
  { key: 'legs', label: 'Legs', icon: '🦵', description: 'Squats, lunges, and drive' },
  { key: 'abs', label: 'Abs', icon: '🫱', description: 'Core and stability training' },
  { key: 'cardio', label: 'Cardio', icon: '💨', description: 'High-energy conditioning' },
];

const MUSCLE_COLOR_MAP = {
  chest: 'from-rose-500 to-orange-500',
  back: 'from-blue-500 to-cyan-500',
  biceps: 'from-amber-500 to-yellow-500',
  triceps: 'from-violet-500 to-fuchsia-500',
  legs: 'from-emerald-500 to-green-500',
  abs: 'from-indigo-500 to-sky-500',
  cardio: 'from-red-500 to-pink-500',
};

const DIFFICULTY_STYLES = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-rose-100 text-rose-700',
};

const getWorkoutTypeFromExercise = (exercise) => {
  const name = (exercise?.name || '').toLowerCase();
  const muscleGroup = (exercise?.muscleGroup || '').toLowerCase();

  if (muscleGroup === 'cardio' || /burpee|jumping jack|mountain climber/.test(name)) {
    return 'burpee';
  }

  if (muscleGroup === 'legs' || /squat|lunge|deadlift|leg/.test(name)) {
    return 'squat';
  }

  if (muscleGroup === 'abs' || /sit|crunch|plank|core|raise/.test(name)) {
    return 'sit_up';
  }

  if (muscleGroup === 'back' || /pull|row|lat|chin/.test(name)) {
    return 'pull_up';
  }

  if (muscleGroup === 'chest' || muscleGroup === 'biceps' || muscleGroup === 'triceps' || /curl|press|fly|push|dip|bench/.test(name)) {
    return 'push_up';
  }

  return 'other';
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const WorkoutRefactored = () => {
  const navigate = useNavigate();

  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(false);
  const [reps, setReps] = useState(0);
  const [postureScore, setPostureScore] = useState(100);
  const [postureFeedback, setPostureFeedback] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [summary, setSummary] = useState(null);
  const [saving, setSaving] = useState(false);
  const [muscleAnimationKey, setMuscleAnimationKey] = useState(0);

  const repCounterRef = useRef(null);
  const voiceRef = useRef(null);

  useEffect(() => {
    const storedVoicePreference = localStorage.getItem('voiceFeedback');
    if (storedVoicePreference !== null) {
      setVoiceEnabled(storedVoicePreference === 'true');
    }

    voiceRef.current = new VoiceFeedback();
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('voiceFeedback', voiceEnabled ? 'true' : 'false');
    if (voiceRef.current) {
      voiceRef.current.setEnabled(voiceEnabled);
    }
  }, [voiceEnabled]);

  useEffect(() => {
    let isCancelled = false;

    const fetchExercises = async () => {
      if (!selectedMuscle) {
        setExercises([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setExercises([]);

      try {
        const response = await exerciseService.getExercisesByMuscleGroup(selectedMuscle);
        if (!isCancelled) {
          setExercises(response.data.data || []);
        }
      } catch (fetchError) {
        if (!isCancelled) {
          setError(fetchError.response?.data?.message || 'Failed to fetch exercises');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchExercises();

    return () => {
      isCancelled = true;
    };
  }, [selectedMuscle]);

  useEffect(() => {
    if (!activeWorkout) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setElapsedTime((currentTime) => currentTime + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeWorkout]);

  const handleMuscleSelect = (muscle) => {
    setMuscleAnimationKey((prev) => prev + 1);
    setSelectedMuscle(muscle);
    setSelectedExercise(null);
    setActiveWorkout(false);
    setReps(0);
    setPostureScore(100);
    setPostureFeedback([]);
    setElapsedTime(0);
    setSummary(null);
    repCounterRef.current = null;
  };

  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setSummary(null);
    setReps(0);
    setPostureScore(100);
    setPostureFeedback([]);
  };

  const startWorkout = (exercise) => {
    const workoutType = getWorkoutTypeFromExercise(exercise);
    setSelectedExercise(exercise);
    setActiveWorkout(true);
    setReps(0);
    setPostureScore(100);
    setPostureFeedback([]);
    setElapsedTime(0);
    setSummary(null);

    repCounterRef.current = new RepCounter(workoutType);
    voiceRef.current?.setEnabled(voiceEnabled);
    voiceRef.current?.feedbackStart(workoutType);
  };

  const handlePoseDetected = (results) => {
    if (!activeWorkout || !repCounterRef.current || !results?.poseLandmarks) {
      return;
    }

    const landmarks = results.poseLandmarks;
    const score = PostureDetector.calculatePostureScore(landmarks);
    const feedback = PostureDetector.getPostureFeedback(landmarks);

    setPostureScore(score);
    setPostureFeedback(feedback);
    repCounterRef.current.addPostureScore(score);

    if (voiceEnabled && score < 70 && feedback.length > 0) {
      voiceRef.current?.feedbackPosture(feedback[0]);
    }

    const repDetected = repCounterRef.current.detect(landmarks);
    if (repDetected) {
      const currentReps = repCounterRef.current.getRepCount();
      setReps(currentReps);

      if (voiceEnabled) {
        voiceRef.current?.feedbackReps(currentReps, selectedExercise?.targetReps || 10);
        if (currentReps % 5 === 0) {
          voiceRef.current?.motivate();
        }
      }
    }
  };

  const endWorkout = async () => {
    setActiveWorkout(false);
    setSaving(true);

    const finalReps = repCounterRef.current?.getRepCount() || reps;
    const averagePostureScore = repCounterRef.current?.getAveragePostureScore() || postureScore;
    const workoutType = getWorkoutTypeFromExercise(selectedExercise);
    const targetReps = selectedExercise?.targetReps || 10;

    const performanceScore = PerformanceScorer.calculatePerformanceScore({
      postureScore: averagePostureScore,
      reps: finalReps,
      targetReps,
      consistency: 0.85,
    });

    const suggestions = PerformanceScorer.generateSuggestions({
      postureScore: averagePostureScore,
      reps: finalReps,
      targetReps,
      performanceScore,
    });

    const caloriesBurned = PerformanceScorer.estimateCaloriesBurned(
      workoutType,
      Math.max(elapsedTime / 60, 0.1),
      performanceScore
    );

    const workoutData = {
      exerciseType: workoutType,
      reps: finalReps,
      sets: 1,
      duration: elapsedTime,
      postureScore: averagePostureScore,
      caloriesBurned,
      notes: `${selectedExercise?.name || 'Workout'} session from ${selectedMuscle}`,
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

    try {
      await workoutService.createWorkout(workoutData);
      voiceRef.current?.feedbackEnd(finalReps, performanceScore);
      setSummary({
        workout: workoutData,
        performanceScore,
        suggestions,
      });
    } catch (saveError) {
      console.error('Error saving workout:', saveError);
      setSummary({
        workout: workoutData,
        performanceScore,
        suggestions,
        saveError: saveError.response?.data?.message || 'Failed to save workout',
      });
    } finally {
      setSaving(false);
      repCounterRef.current = null;
    }
  };

  const clearWorkout = () => {
    setSelectedExercise(null);
    setActiveWorkout(false);
    setReps(0);
    setPostureScore(100);
    setPostureFeedback([]);
    setElapsedTime(0);
    setSummary(null);
    repCounterRef.current = null;
  };

  const exercisesForSelectedMuscle = useMemo(() => exercises, [exercises]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">AI Gym</p>
          <div className="mt-2 flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Select Muscle Group</h1>
            <p className="text-base text-slate-600 sm:text-lg">Choose what you want to train today</p>
          </div>
        </div>

        <section className="mb-10">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-7">
            {MUSCLE_GROUPS.map((group, index) => {
              const isSelected = selectedMuscle === group.key;

              return (
                <button
                  key={group.key}
                  type="button"
                  onClick={() => handleMuscleSelect(group.key)}
                  style={{ animationDelay: `${index * 55}ms` }}
                  className={`workout-card-enter rounded-2xl border bg-white p-5 text-left shadow-lg transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl ${
                    isSelected ? 'border-2 border-blue-500 bg-blue-50' : 'border-slate-100'
                  }`}
                >
                  <div className="text-3xl">{group.icon}</div>
                  <div className="mt-4 space-y-1">
                    <h2 className="text-lg font-bold">{group.label}</h2>
                    <p className="text-sm text-slate-500">{group.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {selectedMuscle && (
          <section className="mb-10 rounded-3xl bg-white p-5 shadow-xl ring-1 ring-slate-100 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r ${MUSCLE_COLOR_MAP[selectedMuscle] || 'from-blue-500 to-cyan-500'} text-xl text-white shadow-lg`}>
                    {MUSCLE_GROUPS.find((item) => item.key === selectedMuscle)?.icon || '💪'}
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold capitalize">{selectedMuscle}</h3>
                    <p className="text-slate-600">Browse exercises and start a live workout session</p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMuscleAnimationKey((prev) => prev + 1)}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Refresh exercises
              </button>
            </div>

            {loading && (
              <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-600">Loading exercises...</div>
            )}

            {error && !loading && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                <p className="font-semibold">Unable to load exercises</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && exercisesForSelectedMuscle.length === 0 && (
              <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-600">No exercises found</div>
            )}

            {!loading && exercisesForSelectedMuscle.length > 0 && (
              <div key={`${selectedMuscle}-${muscleAnimationKey}`} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {exercisesForSelectedMuscle.map((exercise, index) => {
                  const isSelected = selectedExercise?._id === exercise._id;
                  const difficultyKey = (exercise.difficulty || 'beginner').toLowerCase();

                  return (
                    <article
                      key={exercise._id}
                      style={{ animationDelay: `${index * 70}ms` }}
                      className={`workout-card-enter rounded-2xl border bg-white p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl ${
                        isSelected ? 'border-2 border-blue-500 bg-blue-50' : 'border-slate-100'
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-xl font-bold text-slate-900">{exercise.name}</h4>
                          <p className="mt-1 text-sm text-slate-500 capitalize">{exercise.muscleGroup}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${DIFFICULTY_STYLES[difficultyKey] || 'bg-slate-100 text-slate-700'}`}>
                          {difficultyKey}
                        </span>
                      </div>

                      <p className="mb-4 text-sm leading-6 text-slate-600">
                        {exercise.description || 'No description available.'}
                      </p>

                      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-slate-500">Target Reps</p>
                          <p className="font-bold text-slate-900">{exercise.targetReps || 10}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-slate-500">Calories</p>
                          <p className="font-bold text-slate-900">{exercise.caloriesBurned || 0}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => startWorkout(exercise)}
                        className={`w-full rounded-xl px-4 py-3 text-sm font-bold text-white transition ${
                          isSelected
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                            : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg'
                        }`}
                      >
                        Start Workout
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeWorkout && selectedExercise && (
          <section className="mb-10 rounded-3xl bg-slate-950 p-4 text-white shadow-2xl ring-1 ring-slate-800 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Live Workout</p>
                <h3 className="mt-2 text-2xl font-bold sm:text-3xl">{selectedExercise.name}</h3>
                <p className="mt-1 text-sm text-slate-300">
                  {selectedExercise.description || 'Focus on clean reps and steady posture.'}
                </p>
              </div>
              <button
                type="button"
                onClick={endWorkout}
                className="rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                disabled={saving}
              >
                {saving ? 'Saving workout...' : 'End Workout'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <div className="overflow-hidden rounded-3xl bg-black shadow-2xl">
                  <MediaPipePose onPoseDetected={handlePoseDetected} isRunning={activeWorkout} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-900 p-5 shadow-lg">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Reps</p>
                  <p className="mt-2 text-5xl font-extrabold text-cyan-400">{reps}</p>
                  <p className="mt-2 text-sm text-slate-300">Target {selectedExercise.targetReps || 10} reps</p>
                </div>

                <div className="rounded-2xl bg-slate-900 p-5 shadow-lg">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Timer</p>
                  <p className="mt-2 text-5xl font-extrabold text-violet-300">{formatTime(elapsedTime)}</p>
                </div>

                <div className={`rounded-2xl p-5 shadow-lg ${postureScore >= 80 ? 'bg-emerald-600' : postureScore >= 60 ? 'bg-amber-600' : 'bg-rose-600'}`}>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Posture</p>
                  <p className="mt-2 text-5xl font-extrabold text-white">{postureScore}%</p>
                </div>

                <button
                  type="button"
                  onClick={() => setVoiceEnabled((current) => !current)}
                  className={`w-full rounded-2xl px-5 py-4 text-sm font-bold transition ${
                    voiceEnabled ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' : 'bg-slate-800 text-white hover:bg-slate-700'
                  }`}
                >
                  {voiceEnabled ? 'Voice Feedback On' : 'Voice Feedback Off'}
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl bg-slate-900 p-5">
                <h4 className="text-lg font-bold">Posture Feedback</h4>
                <div className="mt-4 space-y-3">
                  {postureFeedback.length > 0 ? (
                    postureFeedback.map((item, index) => (
                      <div key={`${item}-${index}`} className="rounded-xl bg-slate-800 px-4 py-3 text-sm text-slate-100">
                        {item}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl bg-slate-800 px-4 py-3 text-sm text-slate-100">
                      Keep moving with control and clean form.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900 p-5">
                <h4 className="text-lg font-bold">Exercise Details</h4>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <p><span className="font-semibold text-white">Muscle Group:</span> {selectedExercise.muscleGroup}</p>
                  <p><span className="font-semibold text-white">Difficulty:</span> {selectedExercise.difficulty}</p>
                  <p><span className="font-semibold text-white">Equipment:</span> {(selectedExercise.equipment || []).join(', ') || 'Bodyweight'}</p>
                  <p><span className="font-semibold text-white">Workout Type:</span> {getWorkoutTypeFromExercise(selectedExercise)}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {summary && selectedExercise && (
          <section className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-slate-100 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Workout Summary</p>
                <h3 className="mt-2 text-2xl font-bold">Session complete</h3>
              </div>
              <button
                type="button"
                onClick={clearWorkout}
                className="rounded-full bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
              >
                Choose Another Exercise
              </button>
            </div>

            {summary.saveError && (
              <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                {summary.saveError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">Reps</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{summary.workout.reps}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">Time</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{formatTime(summary.workout.duration)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">Posture</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{summary.workout.postureScore}%</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-center">
                <p className="text-sm text-slate-500">Calories</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{summary.workout.caloriesBurned}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl bg-blue-50 p-5">
                <h4 className="text-lg font-bold text-slate-900">Performance Score</h4>
                <p className="mt-2 text-5xl font-extrabold text-blue-600">{summary.performanceScore}%</p>
                <p className="mt-2 text-sm text-slate-600">
                  {summary.performanceScore >= 85 && 'Excellent work.'}
                  {summary.performanceScore >= 70 && summary.performanceScore < 85 && 'Strong session.'}
                  {summary.performanceScore < 70 && 'Keep improving your form and consistency.'}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <h4 className="text-lg font-bold text-slate-900">AI Suggestions</h4>
                <div className="mt-4 space-y-3">
                  {summary.suggestions.slice(0, 3).map((item, index) => (
                    <div key={`${item.type}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="font-semibold text-slate-900">{item.message}</p>
                      <p className="mt-1 text-sm text-slate-600">{item.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={clearWorkout}
                className="rounded-full bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
              >
                Start New Workout
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default WorkoutRefactored;
