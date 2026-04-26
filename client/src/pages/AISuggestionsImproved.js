// Premium AI Workout Suggestions - Powered by Gemini Neural Core
import React, { useState, useEffect } from 'react';
import { aiService, workoutService } from '../services/api';
import { toast } from 'react-hot-toast';
import SkeletonLoader from '../components/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Target, TrendingUp, ChevronRight, Activity, Shield, Droplets, Sparkles } from 'lucide-react';

const AISuggestionsImproved = () => {
  const [stats, setStats] = useState(null);
  const [suggestionData, setSuggestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const statsRes = await workoutService.getStats('week');
      const s = statsRes.data.stats;
      setStats(s);

      const res = await aiService.getSuggestions({
        weakMuscles: s.weakMuscles || [],
        postureScore: s.averagePostureScore || 0,
        streak: s.currentStreak || 0
      });
      
      if (res.data.success && res.data.data) {
        setSuggestionData(res.data.data);
      }
    } catch (error) {
      console.error("No cached suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = async () => {
    if (!stats) return;
    try {
      setGenerating(true);
      const res = await aiService.getSuggestions({
        weakMuscles: stats.weakMuscles || [],
        postureScore: stats.averagePostureScore || 0,
        streak: stats.currentStreak || 0
      });
      if (res.data.success) {
        setSuggestionData(res.data.data);
        toast.success("Intelligence stream synchronized! 🧠");
      }
    } catch (error) {
      toast.error("Neural Bridge Offline or sync failed.");
    } finally {
      setGenerating(false);
    }
  };

  // Simple parser for AI suggestions
  const parseSuggestions = (text) => {
    if (!text) return [];
    return text.split('\n')
      .filter(line => line.trim().length > 10)
      .map(line => line.replace(/^[*-]\s*/, '').replace(/^\d+\.\s*/, '').replace(/[*#]/g, '').trim());
  };

  const suggestions = suggestionData ? parseSuggestions(suggestionData.suggestions) : [];

  if (loading) return <div className="p-8 bg-slate-950 min-h-screen"><SkeletonLoader type="dashboard" /></div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-12 animate-enter text-white">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600/10 border border-purple-600/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 font-mono">
               <Brain size={10} /> Strategy Recalibration // 0x4A7
            </div>
            <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter uppercase leading-none">
              Optimization <span className="text-blue-600">Core</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] italic leading-none max-w-lg">
              Neural analysis protocols based on live biometric vectors.
            </p>
          </div>
          
          <button 
            onClick={generateSuggestions} 
            disabled={generating}
            className="h-20 px-10 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/20 transition-all flex items-center gap-4 group"
          >
            {generating ? (
               <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Syncing...</span>
               </>
            ) : (
               <>
                  Force Neural Sync
                  <TrendingUp size={18} className="group-hover:translate-y-[-2px] transition-transform" />
               </>
            )}
          </button>
        </div>

        {/* Current State Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 grayscale group-hover:scale-110 transition-transform duration-700 font-black text-8xl italic">!</div>
             <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-6 italic">Deviated Sectors</p>
             <div className="flex flex-wrap gap-3 mt-4">
                {stats?.weakMuscles?.length > 0 ? stats.weakMuscles.map(m => (
                  <span key={m} className="px-5 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full text-[10px] font-black text-rose-400 uppercase tracking-tighter italic hover:bg-rose-500/20 cursor-default transition-colors">{m}</span>
                )) : (
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Shield size={20} />
                     </div>
                     <span className="text-emerald-500 font-black text-xs uppercase italic">Structural Integrity Optimal</span>
                  </div>
                )}
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 grayscale group-hover:scale-110 transition-transform duration-700 font-black text-8xl italic">%</div>
             <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6 italic">Posture Integrity</p>
             <div className="flex items-end gap-2">
                <p className="text-7xl font-black text-white italic tracking-tighter mt-2">{stats?.averagePostureScore || 0}</p>
                <p className="text-xl font-black text-blue-500 italic mb-3">%</p>
             </div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">Precision Fidelity Mean</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 grayscale group-hover:scale-110 transition-transform duration-700 font-black text-8xl italic">#</div>
             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 italic">Cycle Continuity</p>
             <div className="flex items-end gap-3">
                <p className="text-7xl font-black text-white italic tracking-tighter mt-2">{stats?.currentStreak || 0}</p>
                <Zap size={24} className="text-emerald-500 mb-4 animate-pulse" />
             </div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">Temporal Streak Units</p>
          </div>
        </div>

        {/* AI Insight Feed */}
        <div className="space-y-10">
           <AnimatePresence mode='wait'>
           {suggestionData ? (
             <motion.div 
               key="insights"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-10"
             >
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-12 opacity-5 grayscale pointer-events-none">
                      <span className="text-[250px] font-black italic">GEN</span>
                   </div>
                   
                   <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
                      <div className="flex-1 space-y-10">
                         <div className="flex justify-between items-center border-b border-white/5 pb-8">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20">
                                  <Brain size={24} />
                               </div>
                               <h3 className="text-2xl font-black text-white tracking-widest uppercase italic leading-none">Neural Manifest</h3>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cached Protocol</span>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {suggestions.map((s, i) => (
                               <motion.div 
                                 key={i}
                                 initial={{ opacity: 0, scale: 0.95 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 transition={{ delay: i * 0.05 }}
                                 className="bg-slate-950/50 p-8 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all group/card shadow-inner"
                               >
                                  <div className="flex gap-5">
                                     <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0 group-hover/card:scale-110 transition-transform">
                                        <Sparkles size={16} />
                                     </div>
                                     <p className="text-sm font-medium text-slate-300 italic leading-relaxed">{s}</p>
                                  </div>
                               </motion.div>
                            ))}
                         </div>

                         <div className="flex flex-col sm:flex-row gap-6 pt-6">
                            <button className="h-16 px-10 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 group">
                               Authorize Implementation
                               <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="h-16 px-10 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all">
                               Dismiss Stream
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
           ) : (
             <motion.div 
               key="empty"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="bg-slate-900/50 border border-dashed border-slate-800 rounded-[3rem] p-24 text-center group"
             >
                <div className="text-8xl mb-10 group-hover:scale-110 transition-transform duration-1000 grayscale opacity-40">📡</div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6 leading-none">Neural Uplink <br/><span className="text-blue-600">Required</span></h3>
                <p className="text-slate-500 max-w-sm mx-auto font-medium uppercase text-[10px] tracking-widest leading-loose">
                   Initialize a strategy recalibration cycle to synthesize performance suggestions from the Gemini neural core.
                </p>
                <button onClick={generateSuggestions} className="mt-10 h-16 px-12 bg-slate-900 border border-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-blue-500 transition-all flex items-center justify-center gap-3 mx-auto">
                   Initialize Stream <ChevronRight size={14} />
                </button>
             </motion.div>
           )}
           </AnimatePresence>
        </div>

        {/* Global Strategy Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/5">
           {[
             { i: <Droplets />, t: 'Cellular Hydration', d: 'Target 40ml per kg of body mass for optimal neural transmission and muscle lubrication.' },
             { i: <Activity />, t: 'Deep Cycle Recovery', d: 'Prioritize REM loops between 02:00 and 06:00 for hormonal peak optimization.' },
             { i: <Brain />, t: 'Neuro-Plasticity', d: 'Vary exercise sequences weekly to prevent biological stagnation and plateaus.' }
           ].map((tip, idx) => (
             <div key={idx} className="bg-slate-900/30 p-8 rounded-[2rem] border border-slate-900/50 hover:border-blue-500/20 transition-all group">
                <div className="w-12 h-12 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-center text-slate-600 group-hover:text-blue-500 group-hover:scale-110 transition-all mb-6">{tip.i}</div>
                <h4 className="text-sm font-black text-white italic uppercase mb-2 tracking-tight">{tip.t}</h4>
                <p className="text-slate-500 text-xs font-medium leading-relaxed italic">{tip.d}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default AISuggestionsImproved;
