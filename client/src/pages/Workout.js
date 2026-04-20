// Main Workout Page - Premium High-Fidelity Performance Module
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MediaPipePose from '../components/MediaPipePose';
import { PostureDetector, RepCounter, PerformanceScorer } from '../utils/ai';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { workoutService } from '../services/api';
import { toast } from 'react-hot-toast';

const Workout = () => {
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
  const workoutIntervalRef = useRef(null);

  // Track elapsed time
  useEffect(() => {
    if (!isWorkoutActive || !startTime) return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((new Date() - startTime) / 1000));
    }, 500);
    workoutIntervalRef.current = interval;
    return () => clearInterval(interval);
  }, [isWorkoutActive, startTime]);

  // Start sequence
  const startWorkoutCountdown = () => {
    setShowWorkoutSetup(false);
    let countdown = 3;
    setCountdownValue(countdown);

    const interval = setInterval(() => {
      countdown--;
      setCountdownValue(countdown);
      if (voiceEnabled && countdown > 0) voiceFeedbackHook.speak(countdown.toString());
      if (countdown <= 0) {
        clearInterval(interval);
        initiateWorkout();
      }
    }, 1000);
  };

  const initiateWorkout = () => {
    const counter = new RepCounter(exerciseType);
    setRepCounter(counter);
    setIsWorkoutActive(true);
    setStartTime(new Date());
    setElapsedTime(0);
    setCountdownValue(null);
    if (voiceEnabled) voiceFeedbackHook.speak(`Initializing ${exerciseType.replace('_', ' ')} protocol. Let's begin.`);
  };

  const handlePoseDetected = (results) => {
    if (!isWorkoutActive || !repCounter) return;
    const landmarks = results.poseLandmarks;
    if (!landmarks) return;

    const score = PostureDetector.calculatePostureScore(landmarks);
    setPostureScore(score);
    repCounter.addPostureScore(score);

    const feedback = PostureDetector.getPostureFeedback(landmarks);
    setPostureFeedback(feedback);

    if (score < 60 && voiceEnabled && feedback.length > 0) {
      voiceFeedbackHook.speakPostureCorrection(feedback);
    }

    if (repCounter.detect(landmarks)) {
      const count = repCounter.getRepCount();
      if (voiceEnabled) voiceFeedbackHook.speakRepCount(count, 10);
      if (count % 5 === 0) voiceFeedbackHook.speakMotivation();
    }
  };

  const endWorkout = async () => {
    setIsWorkoutActive(false);
    clearInterval(workoutIntervalRef.current);

    const finalReps = repCounter?.getRepCount() || 0;
    const avgPosture = repCounter?.getAveragePostureScore() || 0;

    const performanceScore = PerformanceScorer.calculatePerformanceScore({ 
       postureScore: avgPosture, reps: finalReps, targetReps: 10, consistency: 0.85 
    });
    
    const calories = PerformanceScorer.estimateCaloriesBurned(exerciseType, elapsedTime / 60, performanceScore);
    const suggestions = PerformanceScorer.generateSuggestions({ 
       postureScore: avgPosture, reps: finalReps, performanceScore 
    });

    const workoutData = { exerciseType, reps: finalReps, duration: elapsedTime, postureScore: avgPosture, caloriesBurned: calories };

    setSessionData({ workout: workoutData, performanceScore, suggestions });
    if (voiceEnabled) voiceFeedbackHook.speak(`Protocol complete. Final score: ${performanceScore} percent.`);

    try {
      await workoutService.createWorkout(workoutData);
      toast.success('Performance data synchronized.');
    } catch (error) {
      toast.error('Sync failure.');
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // SETUP SCREEN
  if (showWorkoutSetup) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden animate-enter">
         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
         <div className="glass-card p-12 rounded-[3.5rem] w-full max-w-lg border-slate-800/80 relative z-10 text-center space-y-10">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-blue-500/20">🏋️</div>
            <div className="space-y-2">
               <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Select Protocol</h1>
               <p className="text-slate-500 font-medium">Choose your focus group for real-time analysis.</p>
            </div>
            <div className="space-y-6 text-left">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest ml-1">Target Exercise</label>
                  <select
                    value={exerciseType}
                    onChange={(e) => setExerciseType(e.target.value)}
                    className="input-field appearance-none"
                  >
                    <option value="squat">🦵 Posterior Chain (Squat)</option>
                    <option value="push_up">💪 Pushing Power (Push-Up)</option>
                    <option value="pull_up">🔝 Vertical Pull (Pull-Up)</option>
                    <option value="sit_up">⬇️ Core Stability (Sit-Up)</option>
                  </select>
               </div>
               <div className="flex items-center justify-between p-5 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-300">Neural Voice Feedback</span>
                  <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`w-14 h-7 rounded-full p-1 transition-colors ${voiceEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}>
                     <div className={`w-5 h-5 bg-white rounded-full transition-transform ${voiceEnabled ? 'translate-x-7' : ''}`}></div>
                  </button>
               </div>
            </div>
            <div className="space-y-3 pt-4">
               <button onClick={startWorkoutCountdown} className="btn-primary w-full h-16 text-lg">Initialize Feedback Stream</button>
               <button onClick={() => navigate('/dashboard')} className="btn-secondary w-full">Return to Dashboard</button>
            </div>
         </div>
      </div>
    );
  }

  // COUNTDOWN
  if (countdownValue !== null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 animate-enter">
         <p className="text-blue-500 font-black uppercase tracking-[0.5em] mb-12">Synchronizing Biometrics</p>
         <div className="w-64 h-64 rounded-full border-2 border-white/5 flex items-center justify-center relative">
            <div className="absolute inset-4 rounded-full border border-blue-500/20 animate-ping"></div>
            <span className="text-9xl font-black text-white italic">{countdownValue}</span>
         </div>
      </div>
    );
  }

  // SUMMARY SCREEN
  if (sessionData) {
    const { workout, performanceScore, suggestions } = sessionData;
    return (
      <div className="min-h-screen bg-slate-900/50 p-6 lg:p-8 animate-enter">
         <div className="max-w-5xl mx-auto space-y-10">
            <div className="text-center space-y-2">
               <div className="text-6xl mb-6">🏆</div>
               <h1 className="text-5xl font-black text-white tracking-widest uppercase italic">Session Decoded</h1>
               <p className="text-slate-400 font-medium">Performance data categorized and stored in neural cloud.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { l: 'Reps Detected', v: workout.reps, c: 'blue' },
                 { l: 'Time Under Tension', v: formatTime(workout.duration), c: 'emerald' },
                 { l: 'Avg Precision', v: `${workout.postureScore}%`, c: 'amber' },
                 { l: 'Neural Index', v: `${performanceScore}%`, c: 'rose' }
               ].map((s, i) => (
                 <div key={i} className="premium-card p-6 border-slate-800 text-center space-y-1">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.l}</p>
                    <p className={`text-3xl font-black text-${s.c}-500 italic`}>{s.v}</p>
                 </div>
               ))}
            </div>

            <div className="glass-card p-10 rounded-[3rem] bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-center">
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Metabolic Burn Factor</p>
               <p className="text-6xl font-black text-white italic">🔥 {workout.caloriesBurned} <span className="text-2xl text-slate-500">KCALS</span></p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
               <div className="space-y-6">
                  <h3 className="text-xl font-black text-white italic uppercase flex items-center gap-3">
                     <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                     Strategic Recalibration
                  </h3>
                  <div className="space-y-4">
                     {suggestions.map((s, i) => (
                       <div key={i} className={`p-6 rounded-3xl border-l-[6px] ${s.priority === 'high' ? 'bg-rose-500/5 border-rose-500' : 'bg-slate-800/40 border-slate-700'}`}>
                          <p className="text-white font-black text-lg mb-2">{s.message}</p>
                          <p className="text-slate-500 text-sm font-medium italic">🧠 {s.tip}</p>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="flex flex-col gap-4 justify-center">
                  <button onClick={() => navigate('/dashboard')} className="btn-primary h-20 text-xl shadow-2xl">Return to Terminal</button>
                  <button onClick={() => { setShowWorkoutSetup(true); setSessionData(null); }} className="btn-secondary h-20 text-xl">Initialize New Loop</button>
               </div>
            </div>
         </div>
      </div>
    );
  }

  // ACTIVE WORKOUT
  return (
    <div className="min-h-screen bg-slate-950 p-4 lg:p-8 flex flex-col gap-6 animate-enter">
       <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <span className="text-3xl animate-pulse">💪</span>
             <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">{exerciseType.replace('_', ' ')} ACTIVE</h2>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inference Feed Live</span>
                </div>
             </div>
          </div>
          <button onClick={endWorkout} className="h-14 px-10 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-rose-500/20 active:scale-95">TERMINATE LOOP</button>
       </div>

       <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 h-full relative rounded-[3rem] overflow-hidden border-4 border-slate-900 bg-black shadow-2xl">
             <MediaPipePose onPoseDetected={handlePoseDetected} isRunning={isWorkoutActive} />
             
             {/* Dynamic Floating HUD */}
             <div className="absolute top-8 left-8 flex flex-col gap-3 pointer-events-none">
                <div className="glass-card !bg-black/20 p-4 rounded-2xl border-white/5 backdrop-blur-md">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Protocol Clock</p>
                   <p className="text-3xl font-black text-blue-400 italic font-mono">{formatTime(elapsedTime)}</p>
                </div>
                {postureFeedback.length > 0 && (
                  <div className="glass-card !bg-rose-500/20 p-4 rounded-2xl border-rose-500/30 backdrop-blur-md animate-pulse">
                     <p className="text-[10px] font-black text-rose-200 uppercase tracking-widest mb-2">Form Alert</p>
                     <p className="text-xs font-bold text-white uppercase">{postureFeedback[0]}</p>
                  </div>
                )}
             </div>

             <div className="absolute bottom-8 right-8 pointer-events-none">
                <div className="glass-card !bg-black/20 p-6 rounded-[2.5rem] border-white/5 backdrop-blur-xl flex items-center gap-8">
                   <div className="text-center">
                      <p className="text-[10px] font-black text-white/30 uppercase mb-1">Reps</p>
                      <p className="text-6xl font-black text-white italic">{repCounter?.getRepCount() || 0}</p>
                   </div>
                   <div className="w-[1px] h-12 bg-white/10"></div>
                   <div className="text-center">
                      <p className="text-[10px] font-black text-white/30 uppercase mb-1">Precision</p>
                      <p className={`text-6xl font-black italic ${postureScore > 80 ? 'text-emerald-400' : 'text-rose-400'}`}>{postureScore}%</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <div className="premium-card p-6 h-full flex flex-col">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Bio-Feedback Logs</h3>
                <div className="flex-1 overflow-y-auto space-y-3 font-mono">
                   {postureFeedback.map((f, i) => (
                     <div key={i} className="text-[10px] text-rose-400 font-bold uppercase py-2 border-b border-white/5">
                        [!] Deviation: {f}
                     </div>
                   ))}
                   <div className="text-[10px] text-emerald-500 font-bold uppercase py-2">
                      [+] Feed Synchronized
                   </div>
                </div>
                <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="w-full h-14 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">
                   Voice Protocol: {voiceEnabled ? 'ACTIVE' : 'MUTED'}
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default Workout;
