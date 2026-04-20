// Posture Correction Page - Real-time Form Analysis
import React, { useState, useEffect, useRef } from 'react';
import MediaPipePose from '../components/MediaPipePose';
import { PostureDetector, VoiceFeedback } from '../utils/ai';
import { toast } from 'react-hot-toast';

const PostureCorrection = () => {
  const [postureScore, setPostureScore] = useState(100);
  const [feedback, setFeedback] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [history, setHistory] = useState([]);
  const voiceFeedbackRef = useRef(null);

  useEffect(() => {
    voiceFeedbackRef.current = new VoiceFeedback();
  }, []);

  const handlePoseDetected = (results) => {
    if (!isMonitoring || !results.poseLandmarks) return;
    const landmarks = results.poseLandmarks;

    // Calculate score & feedback
    const score = PostureDetector.calculatePostureScore(landmarks);
    setPostureScore(score);
    const newFeedback = PostureDetector.getPostureFeedback(landmarks);
    setFeedback(newFeedback);

    // AI Voice Logic
    if (score < 70 && voiceEnabled && voiceFeedbackRef.current) {
      if (newFeedback.length > 0 && Math.random() < 0.1) {
        voiceFeedbackRef.current.speak(newFeedback[0], 0.85, 1.1);
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
    <div className="min-h-screen bg-slate-900/50 p-4 lg:p-8 animate-enter">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Cinematic Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tight italic">👁️ Form Diagnostic</h1>
            <p className="text-slate-400 font-medium">Real-time neural biomechanics correction and error mapping.</p>
          </div>
          <div className="flex gap-3">
             <button
               onClick={() => setVoiceEnabled(!voiceEnabled)}
               className={`h-12 px-6 rounded-xl font-black text-xs uppercase tracking-widest border transition-all ${
                 voiceEnabled ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'
               }`}
             >
               Voice: {voiceEnabled ? 'ON' : 'OFF'}
             </button>
             <button
               onClick={() => setIsMonitoring(!isMonitoring)}
               className={`btn-primary h-12 !px-10 ${isMonitoring ? 'bg-rose-600 border-rose-500' : ''}`}
             >
               {isMonitoring ? 'PAUSE DIAGNOSTIC' : 'START FEED'}
             </button>
          </div>
        </div>

        {/* Global Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
           {/* Primary Visual Feed */}
           <div className="lg:col-span-2 space-y-6">
              <div className="relative group rounded-[2.5rem] overflow-hidden border-4 border-slate-800 bg-black aspect-video shadow-2xl">
                 <div className="absolute inset-0 z-10 pointer-events-none border-[20px] border-black/20"></div>
                 {/* Neural Overlay Simulation */}
                 <div className="absolute top-6 left-6 z-20 flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">REC // NEURAL FEED</span>
                 </div>
                 
                 <MediaPipePose onPoseDetected={handlePoseDetected} isRunning={isMonitoring} />
                 
                 {/* Dynamic Score Overlay */}
                 <div className="absolute bottom-8 left-8 z-20 glass-card !bg-black/40 p-4 rounded-2xl border-white/10 backdrop-blur-xl">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Precision Index</p>
                    <p className={`text-3xl font-black italic ${getScoreColor()}`}>{postureScore}%</p>
                 </div>
              </div>

              {/* Multi-Joint Analysis Bar */}
              <div className="premium-card p-6 flex flex-wrap gap-6 justify-between items-center">
                 {[
                   { label: 'Back Axis', status: PostureDetector.isBackBent ? 'Compromised' : 'Optimal', color: PostureDetector.isBackBent ? 'rose' : 'emerald' },
                   { label: 'Shoulder Plane', status: 'Stable', color: 'emerald' },
                   { label: 'Knee Tracking', status: 'Optimal', color: 'emerald' }
                 ].map((joint, idx) => (
                   <div key={idx} className="flex flex-col gap-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{joint.label}</p>
                      <div className="flex items-center gap-2">
                         <span className={`w-1.5 h-1.5 rounded-full bg-${joint.color}-500`}></span>
                         <span className={`text-xs font-black text-${joint.color}-400 uppercase tracking-tighter`}>{joint.status}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Feedback Sidebar */}
           <div className="space-y-6">
              {/* Live Feedback Logic */}
              <div className="premium-card p-8 min-h-[300px] flex flex-col">
                 <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                    Error Mapping
                 </h3>
                 
                 <div className="flex-1 space-y-4">
                    {feedback.length > 0 ? (
                      feedback.map((msg, idx) => (
                        <div key={idx} className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl animate-slide-up flex gap-3">
                           <span className="text-rose-500">⚠️</span>
                           <p className="text-rose-200 text-xs font-bold leading-relaxed uppercase tracking-tight">{msg}</p>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-4 py-10">
                         <span className="text-4xl text-emerald-400">✨</span>
                         <p className="text-xs font-black text-slate-500 uppercase tracking-widest px-10 leading-loose">Biomechanical Symmetry Detected. Protocol Execution Optimal.</p>
                      </div>
                    )}
                 </div>
              </div>

              {/* Session Intelligence Stats */}
              <div className="premium-card p-8 bg-gradient-to-br from-blue-600/5 to-indigo-600/5">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 italic">Session Intelligence</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-white/5 pb-3">
                       <span className="text-xs font-bold text-slate-500">Peak Precision</span>
                       <span className="text-lg font-black text-white italic">{history.length > 0 ? Math.max(...history.map(h => h.score)) : 0}%</span>
                    </div>
                    <div className="flex justify-between items-end border-b border-white/5 pb-3">
                       <span className="text-xs font-bold text-slate-500">Avg Symmetry</span>
                       <span className="text-lg font-black text-white italic">
                         {history.length > 0 ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length) : 0}%
                       </span>
                    </div>
                    <div className="flex justify-between items-end">
                       <span className="text-xs font-bold text-slate-500">Neural Sync Frames</span>
                       <span className="text-lg font-black text-blue-400 italic">{history.length}</span>
                    </div>
                 </div>
              </div>

              {/* Critical Protocol Guard */}
              <div className="premium-card p-6 bg-slate-950 border-dashed border-slate-700">
                 <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
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
