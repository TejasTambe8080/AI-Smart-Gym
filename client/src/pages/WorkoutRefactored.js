import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaPipePose from '../components/MediaPipePose';
import { exerciseService, workoutService } from '../services/api';
import { PostureDetector, PerformanceScorer, RepCounter, VoiceFeedback } from '../utils/ai';
import { toast } from 'react-hot-toast';
import socket from '../utils/socket';
import StatusHandler from '../components/StatusHandler';

const user = JSON.parse(localStorage.getItem('user') || '{}');

const MUSCLE_GROUPS = [
  { key: 'chest', label: 'Chest', icon: '🏋️', description: 'Hypertrophy focused' },
  { key: 'back', label: 'Back', icon: '🔙', description: 'Posterior chain' },
  { key: 'biceps', label: 'Biceps', icon: '💪', description: 'Peak isolation' },
  { key: 'triceps', label: 'Triceps', icon: '🦾', description: 'Tri-head drive' },
  { key: 'legs', label: 'Legs', icon: '🦵', description: 'Lower body power' },
  { key: 'abs', label: 'Abs', icon: '🫱', description: 'Core compression' },
  { key: 'cardio', label: 'Cardio', icon: '💨', description: 'Metabolic load' },
];

const MUSCLE_COLOR_MAP = {
  chest: 'from-rose-500 to-rose-600',
  back: 'from-blue-500 to-indigo-600',
  biceps: 'from-amber-500 to-orange-600',
  triceps: 'from-purple-500 to-fuchsia-600',
  legs: 'from-emerald-500 to-teal-600',
  abs: 'from-cyan-500 to-blue-600',
  cardio: 'from-red-500 to-rose-700',
};

const getWorkoutTypeFromExercise = (exercise) => {
  const name = (exercise?.name || '').toLowerCase();
  const muscleGroup = (exercise?.muscleGroup || '').toLowerCase();
  if (muscleGroup === 'cardio' || /burpee|jumping jack|mountain climber/.test(name)) return 'burpee';
  if (muscleGroup === 'legs' || /squat|lunge|deadlift|leg/.test(name)) return 'squat';
  if (muscleGroup === 'abs' || /sit|crunch|plank|core|raise/.test(name)) return 'sit_up';
  if (muscleGroup === 'back' || /pull|row|lat|chin/.test(name)) return 'pull_up';
  if (muscleGroup === 'chest' || muscleGroup === 'biceps' || muscleGroup === 'triceps' || /curl|press|fly|push|dip|bench/.test(name)) return 'push_up';
  return 'other';
};

const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

const WorkoutRefactored = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('fav_exercises') || '[]'));
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(false);
  const [reps, setReps] = useState(0);
  const [postureScore, setPostureScore] = useState(100);
  const [postureFeedback, setPostureFeedback] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState(null);

  const repCounterRef = useRef(null);
  const voiceRef = useRef(new VoiceFeedback());


  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => 
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (filterDifficulty === 'all' || ex.difficulty.toLowerCase() === filterDifficulty.toLowerCase())
    );
  }, [exercises, searchTerm, filterDifficulty]);

  const toggleFavorite = (id) => {
    const newFavs = favorites.includes(id) ? favorites.filter(fid => fid !== id) : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('fav_exercises', JSON.stringify(newFavs));
    toast.success(favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites');
  };

  useEffect(() => {
    if (!selectedMuscle) return;
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await exerciseService.getExercisesByMuscleGroup(selectedMuscle);
        setExercises(response.data.data || []);
      } catch (e) { toast.error('Uplink failed.'); }
      finally { setLoading(false); }
    };
    fetchExercises();
  }, [selectedMuscle]);

  useEffect(() => {
    if (!activeWorkout) return;
    const timer = setInterval(() => setElapsedTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [activeWorkout]);

  const startWorkout = (exercise) => {
    const type = getWorkoutTypeFromExercise(exercise);
    setSelectedExercise(exercise);
    setReps(0);
    setPostureScore(100);
    setElapsedTime(0);
    setSummary(null);
    repCounterRef.current = new RepCounter(type);
    setActiveWorkout(true);
    voiceRef.current?.setEnabled(voiceEnabled);
    if (voiceRef.current?.feedbackStartHindi) {
      voiceRef.current.feedbackStartHindi(type);
    } else {
      voiceRef.current?.feedbackStart(type);
    }
  };

  const handlePoseDetected = (results) => {
    if (!activeWorkout || !repCounterRef.current || !results?.poseLandmarks) return;
    const landmarks = results.poseLandmarks;
    const score = PostureDetector.calculatePostureScore(landmarks);
    const feedback = PostureDetector.getPostureFeedback(landmarks);
    setPostureScore(score);
    setPostureFeedback(feedback);
    repCounterRef.current.addPostureScore(score);
    if (voiceEnabled && score < 70 && feedback.length > 0) {
      if (voiceRef.current?.feedbackPostureHindi) {
        voiceRef.current.feedbackPostureHindi(feedback[0]);
      } else {
        voiceRef.current?.feedbackPosture(feedback[0]);
      }
    }
    if (repCounterRef.current.detect(landmarks)) {
      const count = repCounterRef.current.getRepCount();
      setReps(count);
      if (voiceEnabled) {
        voiceRef.current?.feedbackReps(count, selectedExercise?.targetReps || 10);
        if (count % 5 === 0) {
          if (voiceRef.current?.feedbackMotivationHindi) {
            voiceRef.current.feedbackMotivationHindi();
          } else {
            voiceRef.current?.motivate();
          }
        }
      }
    }
  };

  const endWorkout = async () => {
    setActiveWorkout(false);
    setSaving(true);
    const finalReps = repCounterRef.current?.getRepCount() || reps;
    const finalScore = repCounterRef.current?.getAveragePostureScore() || postureScore;
    const performance = PerformanceScorer.calculatePerformanceScore({ postureScore: finalScore, reps: finalReps, targetReps: 10, consistency: 0.85 });
    const calories = PerformanceScorer.estimateCaloriesBurned(getWorkoutTypeFromExercise(selectedExercise), elapsedTime / 60, performance);
    const workoutData = { exerciseType: getWorkoutTypeFromExercise(selectedExercise), reps: finalReps, duration: elapsedTime, postureScore: finalScore, caloriesBurned: calories, requestId: `req_${Date.now()}` };

    try {
      await workoutService.createWorkout(workoutData);
      
      // Trigger instant dashboard update across potential multi-device logins
      socket.emit('workout_completed', { userId: user._id });
      
      setSummary({ 
        workout: workoutData, 
        performanceScore: performance, 
        suggestions: PerformanceScorer.generateSuggestions({ ...workoutData, performanceScore: performance }) 
      });
      
      localStorage.removeItem('active_workout_session');
      toast.success('Neural sync complete! 🚀', {
        style: { background: '#0f172a', color: '#3b82f6', border: '1px solid #1e293b' }
      });
    } catch (e) { 
       if (e.response?.status === 409) {
          toast.success('Sequence already recorded.');
          setSummary({ workout: workoutData, performanceScore: performance, suggestions: [] });
       } else {
          toast.error('Sync failure: Sequence cached locally.'); 
       }
    }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-slate-900/50 p-6 lg:p-8 animate-enter">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="fixed bottom-10 right-10 z-[100] flex items-center gap-4">
           {!navigator.onLine && (
             <div className="px-6 py-3 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl animate-pulse">Offline Mode Active</div>
           )}
        </div>

        {!activeWorkout && !summary && (
          <>
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-white italic tracking-tight uppercase">Choose Your Workout</h1>
              <p className="text-slate-400 font-medium italic">Select a muscle group to begin your AI-guided training session.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {MUSCLE_GROUPS.map((group) => (
                <button
                  key={group.key}
                  onClick={() => setSelectedMuscle(group.key)}
                  className={`premium-card p-6 text-center space-y-4 group transition-all duration-500 border-slate-800 ${selectedMuscle === group.key ? 'scale-105 border-blue-500/50 bg-blue-500/5 shadow-2xl shadow-blue-500/10' : ''}`}
                >
                  <div className={`text-4xl group-hover:scale-125 transition-transform duration-500 ${selectedMuscle === group.key ? 'grayscale-0' : 'grayscale opacity-30 group-hover:opacity-100 group-hover:grayscale-0'}`}>{group.icon}</div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">{group.label}</p>
                  </div>
                </button>
              ))}
            </div>

            {selectedMuscle && (
              <div className="space-y-8 animate-enter">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${MUSCLE_COLOR_MAP[selectedMuscle] || 'from-blue-500 to-indigo-600'} flex items-center justify-center text-xl`}>🧬</div>
                       <h2 className="text-2xl font-black text-white tracking-widest uppercase italic">{selectedMuscle} Exercises</h2>
                    </div>
                    {/* Search & Filters */}
                    <div className="flex flex-wrap items-center gap-4">
                       <input 
                         type="text" 
                         placeholder="Search exercises..." 
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 text-sm text-white focus:border-blue-500 outline-none w-full md:w-64 italic" 
                       />
                       <select 
                         value={filterDifficulty}
                         onChange={(e) => setFilterDifficulty(e.target.value)}
                         className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 text-sm text-white focus:border-blue-500 outline-none italic"
                       >
                         <option value="all">Level: All</option>
                         <option value="beginner">Beginner</option>
                         <option value="intermediate">Intermediate</option>
                         <option value="advanced">Advanced</option>
                       </select>
                    </div>
                 </div>

                 <StatusHandler loading={loading} empty={filteredExercises.length === 0} emptyMessage="No exercises found in this category.">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {filteredExercises.map((ex) => (
                         <div key={ex._id} className="premium-card p-8 group hover:bg-slate-800/40 border-slate-800 transition-all flex flex-col justify-between relative overflow-hidden">
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleFavorite(ex._id); }} 
                              className={`absolute top-6 right-6 text-xl transition-all ${favorites.includes(ex._id) ? 'scale-125 opacity-100' : 'opacity-20 grayscale hover:grayscale-0 hover:opacity-100'}`}
                            >
                               {favorites.includes(ex._id) ? '⭐' : '☆'}
                            </button>
                            <div className="space-y-4">
                               <div className="flex justify-between items-start">
                                  <h3 className="text-xl font-black text-white italic truncate pr-8">{ex.name}</h3>
                               </div>
                               <div className="flex gap-2">
                                 <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-tighter italic border border-blue-500/20">{ex.difficulty}</span>
                                 {favorites.includes(ex._id) && <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-tighter italic border border-amber-500/20">Favorite</span>}
                               </div>
                               <p className="text-slate-500 text-xs font-medium leading-relaxed italic line-clamp-2">{ex.description}</p>
                            </div>
                            <div className="pt-8 flex items-center justify-between">
                               <div className="flex gap-4">
                                  <div>
                                     <p className="text-[10px] font-black uppercase text-slate-600">Target Reps</p>
                                     <p className="text-lg font-black text-white italic">{ex.targetReps || 10}</p>
                                  </div>
                               </div>
                               <button onClick={() => startWorkout(ex)} className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">🚀</button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </StatusHandler>
              </div>
            )}
          </>
        )}



        {activeWorkout && selectedExercise && (
          <div className="space-y-8 animate-enter">
             <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-xl shadow-xl shadow-blue-500/20 animate-pulse">🏋️</div>
                   <div>
                      <h2 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase italic">{selectedExercise.name}</h2>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Live AI Tracking Online</p>
                   </div>
                </div>
                <button onClick={endWorkout} className="hidden lg:block h-14 px-10 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl shadow-rose-500/20">Finish Workout</button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 aspect-[3/4] md:aspect-video lg:h-[650px] bg-black rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border-2 md:border-4 border-slate-800 shadow-2xl relative">
                   <MediaPipePose onPoseDetected={handlePoseDetected} isRunning={activeWorkout} />
                   
                   {/* Mobile Optimized Overlays */}
                   <div className="absolute top-4 left-4 md:top-8 md:left-8 flex md:flex-col gap-2 md:gap-3 pointer-events-none">
                      <div className="glass-card !bg-black/60 p-3 md:p-4 rounded-xl md:rounded-3xl border-white/10 backdrop-blur-xl">
                         <p className="text-[8px] md:text-[10px] font-black text-white/50 uppercase tracking-widest mb-0.5 md:mb-1">Time</p>
                         <p className="text-xl md:text-3xl font-black text-blue-400 italic font-mono leading-none">{formatTime(elapsedTime)}</p>
                      </div>
                      <div className="glass-card !bg-black/60 p-3 md:p-4 rounded-xl md:rounded-3xl border-white/10 backdrop-blur-xl">
                         <p className="text-[8px] md:text-[10px] font-black text-white/50 uppercase tracking-widest mb-0.5 md:mb-1">Reps</p>
                         <p className="text-xl md:text-3xl font-black text-purple-400 italic font-mono leading-none">{reps}</p>
                      </div>
                   </div>

                   <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 pointer-events-none">
                      <div className="glass-card !bg-black/60 p-4 md:p-10 rounded-2xl md:rounded-[4rem] border-white/5 backdrop-blur-3xl text-center">
                         <p className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest mb-0.5 md:mb-2">Form Score</p>
                         <p className={`text-4xl md:text-8xl font-black italic tracking-tighter ${postureScore > 80 ? 'text-emerald-400' : 'text-rose-400'}`}>{postureScore}%</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="premium-card p-6 md:p-8 h-full flex flex-col gap-6">
                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] italic border-b border-white/5 pb-4">Live Form Tips</h4>
                      <div className="flex-1 max-h-[150px] lg:max-h-none overflow-y-auto space-y-4">
                         {postureFeedback.map((f, i) => (
                           <div key={i} className="flex gap-3 text-rose-400 animate-slide-up">
                              <span className="text-sm">⚠️</span>
                              <p className="text-[10px] font-black uppercase italic leading-loose tracking-tighter">{f}</p>
                           </div>
                         ))}
                         {postureFeedback.length === 0 && <div className="text-[10px] font-black text-emerald-500 uppercase italic tracking-tighter">Perfect Form!</div>}
                      </div>
                      
                      <div className="flex flex-col gap-3">
                         <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${voiceEnabled ? 'bg-blue-600 text-white border-blue-500 shadow-xl shadow-blue-500/20' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                            Voice Assistant: {voiceEnabled ? 'On' : 'Off'}
                         </button>
                         <button onClick={endWorkout} className="lg:hidden h-14 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-500/20">Finish Workout</button>
                      </div>
                   </div>
                </div>
             </div>

          </div>
        )}

        {summary && (
          <div className="space-y-10 animate-enter">
             <div className="text-center space-y-2">
                <div className="text-7xl mb-8">💎</div>
                <h2 className="text-5xl font-black text-white tracking-widest uppercase italic">Workout Finished!</h2>
                <p className="text-slate-400 font-medium italic">Great job! Your performance data has been analyzed and saved.</p>
             </div>

             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { l: 'Reps', v: summary.workout.reps, c: 'blue' },
                  { l: 'Duration', v: formatTime(summary.workout.duration), c: 'emerald' },
                  { l: 'Avg Score', v: `${summary.workout.postureScore}%`, c: 'amber' },
                  { l: 'Total Performance', v: `${summary.performanceScore}%`, c: 'rose' }
                ].map((s, i) => (
                  <div key={i} className="premium-card p-8 text-center space-y-2 border-slate-800 group hover:border-blue-500/30 transition-all">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.l}</p>
                     <p className={`text-4xl font-black text-white group-hover:text-${s.c}-500 transition-colors italic`}>{s.v}</p>
                  </div>
                ))}
             </div>

             <div className="grid lg:grid-cols-2 gap-10 pt-10">
                <div className="premium-card p-10 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-blue-500/20">
                   <h4 className="text-xl font-black text-white italic uppercase mb-6 tracking-tight">AI Coaching Suggestions</h4>
                   <div className="space-y-6">
                      {summary.suggestions.slice(0, 3).map((s, i) => (
                        <div key={i} className="flex gap-5 group items-center">
                           <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg border border-white/5 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all text-sm font-black text-blue-500 italic">#{i+1}</div>
                           <div>
                              <p className="text-white font-black text-sm italic group-hover:translate-x-2 transition-transform">{s.message}</p>
                              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{s.tip}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="flex flex-col gap-4 justify-center">
                   <button onClick={() => navigate('/dashboard')} className="btn-primary h-20 text-lg uppercase italic tracking-widest">Save & Finish</button>
                   <button onClick={() => { setSelectedExercise(null); setSummary(null); }} className="btn-secondary h-20 text-lg uppercase italic tracking-widest">Start New Workout</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutRefactored;
