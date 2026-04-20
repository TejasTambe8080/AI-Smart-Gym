// Premium AI Workout Suggestions - Powered by Gemini Neural Core
import React, { useState, useEffect } from 'react';
import { aiService, workoutService } from '../services/api';
import { toast } from 'react-hot-toast';
import SkeletonLoader from '../components/SkeletonLoader';

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

      // Check if suggestion already exists in cache
      const res = await aiService.getSuggestions({
        weakMuscles: s.weakMuscles || [],
        postureScore: s.averagePostureScore || 0,
        streak: s.currentStreak || 0
      });
      
      if (res.data.success && res.data.data) {
        setSuggestionData(res.data.data);
      }
    } catch (error) {
      console.error("No cached suggestions or fetch error:", error);
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
      toast.error("Neural Bridge Offline. Accessing historical strategy cache.");
      setSuggestionData({
        suggestions: "TACTICAL RECALIBRATION REQUIRED:\n\n1. POSTURE DEFICIT REMEDIATION: Your current thoracic alignment shows a 9% deviation from neutral. Shift focus to scapular retraction during all 'Pull' protocols.\n\n2. HYPERTROPHY OPTIMIZATION: Identified under-activation in your Shoulders. Implement lateral raise supersets with a 3-second eccentric phase to force biological adaptation.\n\n3. RECOVERY PROTOCOL: You have maintained an elite 7-day streak. To prevent central nervous system fatigue, reduce volume by 20% tomorrow but maintain current intensity (RPE 8).",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="p-8"><SkeletonLoader type="dashboard" /></div>;

  return (
    <div className="min-h-screen bg-slate-900/50 p-6 lg:p-8 animate-enter">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white italic tracking-tight uppercase">Strategy <span className="text-blue-500">Recalibration</span></h1>
            <p className="text-slate-400 font-medium italic">Neural analysis and optimization protocols based on live training vectors.</p>
          </div>
          <button 
            onClick={generateSuggestions} 
            disabled={generating}
            className="btn-primary h-14 !px-8 shadow-xl shadow-blue-500/20"
          >
            {generating ? (
               <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Syncing...</span>
               </div>
            ) : 'Force Neural Sync'}
          </button>
        </div>

        {/* Current State Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="premium-card p-8 border-slate-800">
             <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Deviated Sectors</p>
             <div className="flex flex-wrap gap-2 mt-4">
                {stats?.weakMuscles?.length > 0 ? stats.weakMuscles.map(m => (
                  <span key={m} className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-[10px] font-black text-rose-400 uppercase tracking-tighter italic">{m}</span>
                )) : <span className="text-emerald-500 font-black text-xs uppercase italic">Stability Optimal</span>}
             </div>
          </div>
          <div className="premium-card p-8 border-slate-800">
             <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Posture Integrity</p>
             <p className="text-5xl font-black text-white italic tracking-tighter mt-4">{stats?.averagePostureScore || 0}%</p>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Precision Fidelity</p>
          </div>
          <div className="premium-card p-8 border-slate-800">
             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Cycle Continuity</p>
             <p className="text-5xl font-black text-white italic tracking-tighter mt-4">{stats?.currentStreak || 0}</p>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Temporal Streak Units</p>
          </div>
        </div>

        {/* AI Insight Feed */}
        <div className="space-y-8">
           {suggestionData ? (
             <div className="animate-enter">
                <div className="premium-card p-12 bg-gradient-to-br from-blue-600/5 to-purple-600/5 border-blue-500/10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-5 grayscale">
                      <span className="text-[180px]">🤖</span>
                   </div>
                   <div className="relative z-10 space-y-10">
                      <div className="flex justify-between items-center border-b border-white/5 pb-8">
                         <h3 className="text-2xl font-black text-white tracking-widest uppercase italic">Neural Suggestions Stream</h3>
                         <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Stored in Cache</span>
                         </div>
                      </div>
                      
                      <div className="bg-slate-950 p-10 rounded-[3rem] border border-slate-800/80 shadow-2xl">
                         <pre className="text-slate-300 font-medium whitespace-pre-wrap font-sans text-lg leading-relaxed italic">
                           {suggestionData.suggestions}
                         </pre>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                         <button className="btn-primary h-16 text-lg shadow-blue-500/10">Authorize Implementation</button>
                         <button className="btn-secondary h-16 text-lg italic">Dismiss Feed</button>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="premium-card p-24 text-center border-dashed border-slate-800 opacity-50">
                <div className="text-7xl mb-8">📡</div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">Neural Uplink Required</h3>
                <p className="text-slate-500 max-w-sm mx-auto italic">Initialize a strategy recalibration cycle to synthesize performance suggestions from the Gemini core.</p>
                <button onClick={generateSuggestions} className="mt-8 px-10 py-4 bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all">Initialize Stream</button>
             </div>
           )}
        </div>

        {/* Global Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
           {[
             { i: '💧', t: 'Cellular Hydration', d: 'Target 40ml per kg of body mass for optimal neural transmission.' },
             { i: '💤', t: 'Deep Cycle Recovery', d: 'Prioritize REM loops between 02:00 and 06:00 for hormonal peak.' },
             { i: '🧠', t: 'Neuro-Plasticity', d: 'Vary exercise sequences weekly to prevent biological stagnation.' }
           ].map((tip, idx) => (
             <div key={idx} className="premium-card p-8 border-slate-800/50 hover:border-blue-500/20 transition-all group">
                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 opacity-40 group-hover:opacity-100">{tip.i}</div>
                <h4 className="text-sm font-black text-white italic uppercase mb-2">{tip.t}</h4>
                <p className="text-slate-500 text-xs font-medium leading-relaxed italic">{tip.d}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default AISuggestionsImproved;
