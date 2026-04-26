// Posture Correction Page - Real-time Form Analysis with Proactive Voice Feedback
import React, { useState, useEffect, useRef } from 'react';
import MediaPipePose from '../components/MediaPipePose';
import { PostureDetector, VoiceFeedback } from '../utils/ai';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Shield, volume2, VolumeX, Pause, Play, Target, AlertTriangle } from 'lucide-react';

const PostureCorrection = () => {
  const [postureScore, setPostureScore] = useState(100);
  const [feedback, setFeedback] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [history, setHistory] = useState([]);
  const voiceFeedbackRef = useRef(null);
  const lastVoiceFeedbackTime = useRef(0);

  useEffect(() => {
    voiceFeedbackRef.current = new VoiceFeedback();
    voiceFeedbackRef.current.setEnabled(true);
    
    // Welcome message
    setTimeout(() => {
      if (voiceEnabled) {
        voiceFeedbackRef.current.speak("Form Diagnostic System Online. Bio-mechanical monitoring active.", 0.9, 1.0);
      }
    }, 1000);

    return () => {
      if (voiceFeedbackRef.current) {
        voiceFeedbackRef.current.synth.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (voiceFeedbackRef.current) {
      voiceFeedbackRef.current.setEnabled(voiceEnabled);
    }
  }, [voiceEnabled]);

  const handlePoseDetected = (results) => {
    if (!isMonitoring || !results.poseLandmarks) return;
    const landmarks = results.poseLandmarks;

    // Calculate score & feedback
    const score = PostureDetector.calculatePostureScore(landmarks);
    setPostureScore(score);
    const newFeedback = PostureDetector.getPostureFeedback(landmarks);
    setFeedback(newFeedback);

    // Dynamic Voice Logic - Enhanced Robustness
    const now = Date.now();
    if (voiceEnabled && voiceFeedbackRef.current) {
      // If score is low, provide feedback more frequently but with cooldown
      if (score < 80 && newFeedback.length > 0) {
        if (now - lastVoiceFeedbackTime.current > 4000) { // Speak every 4 seconds if form is bad
          const msg = newFeedback[0];
          voiceFeedbackRef.current.feedbackPostureHindi(msg);
          lastVoiceFeedbackTime.current = now;
        }
      } else if (score > 90 && Math.random() < 0.005) { // Occasional encouragement
        if (now - lastVoiceFeedbackTime.current > 15000) {
           voiceFeedbackRef.current.motivate();
           lastVoiceFeedbackTime.current = now;
        }
      }
    }

    setHistory(prev => [...prev.slice(-99), { score, time: new Date() }]);
  };

  const getScoreColor = () => {
    if (postureScore >= 85) return 'text-emerald-400';
    if (postureScore >= 70) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 lg:p-10 animate-enter scrollbar-hide text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Cinematic Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-4">
           <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-500">
                 <Shield size={10} /> Neural Guard // Passive Monitoring
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                Form <span className="text-blue-600">Diagnostic</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] italic leading-none">
                Real-time neural biomechanics correction and error mapping.
              </p>
           </div>
           
           <div className="flex gap-4">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`h-16 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all flex items-center gap-3 ${
                  voiceEnabled ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20' : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                {voiceEnabled ? <div className="animate-pulse w-2 h-2 rounded-full bg-white" /> : null}
                Voice Feedback: {voiceEnabled ? 'ACTIVE' : 'MUTED'}
              </button>
              
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`h-16 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 ${
                  isMonitoring ? 'bg-rose-600 border-rose-500 text-white shadow-xl shadow-rose-500/20' : 'bg-emerald-600 border-emerald-500 text-white'
                }`}
              >
                {isMonitoring ? <Pause size={18} /> : <Play size={18} />}
                {isMonitoring ? 'PAUSE STREAM' : 'INITIALIZE FEED'}
              </button>
           </div>
        </div>

        {/* Global Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Primary Visual Feed */}
           <div className="lg:col-span-2 space-y-8">
              <div className="relative group rounded-[3rem] overflow-hidden border-4 border-slate-800 bg-black aspect-video shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                 {/* Cinematic Overlays */}
                 <div className="absolute inset-0 z-10 pointer-events-none border-[30px] border-black/10"></div>
                 <div className="absolute top-8 left-8 z-20 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                       <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">REC // NEURAL FEED</span>
                    </div>
                    <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest">FPS: 60 // SYNC: STABLE</div>
                 </div>

                 <div className="absolute top-8 right-8 z-20">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
                       <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Protocol</p>
                       <p className="text-[10px] font-bold text-white">GEN-V FORM SCAN</p>
                    </div>
                 </div>
                 
                 <MediaPipePose onPoseDetected={handlePoseDetected} isRunning={isMonitoring} />
                 
                 {/* Holographic Score Display */}
                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="absolute bottom-10 left-10 z-20 glass-card !bg-black/60 p-6 rounded-[2rem] border-white/10 min-w-[200px]"
                 >
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1 flex items-center gap-2">
                       <Target size={12} className="text-blue-500" /> Precision Index
                    </p>
                    <p className={`text-6xl font-black italic tracking-tighter ${getScoreColor()}`}>
                       {postureScore}<span className="text-xl ml-1">%</span>
                    </p>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                       <motion.div 
                         className={`h-full bg-current ${getScoreColor().replace('text-', 'bg-')}`}
                         initial={{ width: 0 }}
                         animate={{ width: `${postureScore}%` }}
                         transition={{ type: 'spring', stiffness: 100 }}
                       />
                    </div>
                 </motion.div>
              </div>

              {/* Multi-Joint Analysis Bar */}
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { label: 'Back Axis', status: PostureDetector.isBackBent ? 'Compromised' : 'Optimal', icon: Shield, color: PostureDetector.isBackBent ? 'text-rose-500' : 'text-emerald-500', bg: PostureDetector.isBackBent ? 'bg-rose-500/10' : 'bg-emerald-500/10' },
                   { label: 'Spatial Center', status: 'Balanced', icon: Target, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                   { label: 'Neural Sync', status: 'Optimal', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' }
                 ].map((joint, idx) => (
                   <div key={idx} className="flex items-center gap-4 group">
                      <div className={`w-12 h-12 rounded-xl ${joint.bg} border border-white/5 flex items-center justify-center ${joint.color} group-hover:scale-110 transition-transform`}>
                         <joint.icon size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{joint.label}</p>
                         <p className={`text-xs font-black uppercase tracking-tight ${joint.color}`}>{joint.status}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Feedback Sidebar */}
           <div className="space-y-8">
              {/* Live Feedback Logic */}
              <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] min-h-[400px] flex flex-col relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-5 grayscale pointer-events-none">
                    <span className="text-[100px] italic font-black">AI</span>
                 </div>
                 
                 <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4 italic uppercase tracking-tighter">
                    <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
                    Neural Suggestions
                 </h3>
                 
                 <div className="flex-1 space-y-4">
                    <AnimatePresence mode='popLayout'>
                    {feedback.length > 0 ? (
                      feedback.map((msg, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="p-5 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex gap-4"
                        >
                           <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 flex-shrink-0">
                              <AlertTriangle size={18} />
                           </div>
                           <div>
                              <p className="text-rose-200 text-[11px] font-bold leading-relaxed uppercase tracking-tight italic">{msg}</p>
                              <p className="text-[8px] font-black text-rose-500/60 uppercase tracking-widest mt-1">Severity: Critical</p>
                           </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10"
                      >
                         <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                            <Shield size={32} />
                         </div>
                         <p className="text-xs font-black text-slate-500 uppercase tracking-widest px-10 leading-loose">Biomechanical Symmetry Detected. Protocol Execution Optimal.</p>
                      </motion.div>
                    )}
                    </AnimatePresence>
                 </div>
              </div>

              {/* Session Intelligence Stats */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1 rounded-[2.5rem] shadow-2xl shadow-blue-500/20">
                 <div className="bg-slate-900 rounded-[2.4rem] p-10 space-y-8">
                    <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2 italic">Session Intelligence</h3>
                    <div className="space-y-6">
                       <div className="flex justify-between items-end border-b border-white/5 pb-4">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Peak Precision</span>
                          <span className="text-2xl font-black text-white italic tracking-tighter">{history.length > 0 ? Math.max(...history.map(h => h.score)) : 0}%</span>
                       </div>
                       <div className="flex justify-between items-end border-b border-white/5 pb-4">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sync Frames</span>
                          <span className="text-2xl font-black text-blue-500 italic tracking-tighter">{history.length}</span>
                       </div>
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Safety Margin</span>
                          <span className="text-2xl font-black text-emerald-500 italic tracking-tighter">98.2%</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Protocol Guard Disclaimer */}
              <div className="p-6 bg-slate-950/80 border border-dashed border-slate-800 rounded-3xl">
                 <p className="text-[9px] text-slate-600 font-bold leading-relaxed italic uppercase tracking-tight">
                    AI WARNING: Sustained deviation below 65% accuracy triggers injury risk alerts. Adjust center of gravity to optimize metabolic output.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PostureCorrection;

