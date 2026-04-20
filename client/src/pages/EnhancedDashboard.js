// Premium Enhanced Dashboard - Performance Intelligence & Neural Analytics
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutService, aiService } from '../services/api';
import InsightsCard from '../components/InsightsCard';
import InjuryRiskAlert from '../components/InjuryRiskAlert';
import EmptyState from '../components/EmptyState';
import SkeletonLoader from '../components/SkeletonLoader';
import socket from '../utils/socket';
import { toast } from 'react-hot-toast';

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState(null);
  const [injuryRisk, setInjuryRisk] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
    socket.on('stats_updated', () => fetchDashboardData());
    return () => socket.off('stats_updated');
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, workoutsRes] = await Promise.all([
        workoutService.getStats('week'),
        workoutService.getWorkouts({ limit: 5 })
      ]);
      const s = statsRes.data.stats;
      setStats(statsRes.data);
      setWorkouts(workoutsRes.data.workouts || []);
      
      // Auto-fetch insights based on stats
      if (s) {
        fetchAIInsights(s);
      }
      fetchInjuryRisk();
    } catch (e) { 
      toast.error('Failed to sync neural link. Core API might be offline.');
      console.error(e);
      setStats({ stats: null });
    }
    finally { setLoading(false); }

  };

  const fetchAIInsights = async (s) => {
    try {
      setInsightsLoading(true);
      const res = await aiService.getInsights({
        posture: s.averagePostureScore || 0,
        totalWorkouts: s.totalWorkouts || 0,
        weakMuscles: s.weakMuscles || []
      });
      if (res.data.success) {
        setInsights(res.data.data);
      }
    } catch (error) {
      console.log("No cached insights or error fetching AI insights.");
    } finally {
      setInsightsLoading(false);
    }
  };

  const fetchInjuryRisk = async () => {
    try {
      const response = await fetch('/api/insights/injury-risk', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (response.ok) { const data = await response.json(); setInjuryRisk(data.data); }
    } catch (e) {}
  };

  if (loading) return <div className="p-8 space-y-8 animate-enter"><SkeletonLoader type="dashboard" /></div>;

  const s = stats?.stats || {};

  return (
    <div className="min-h-screen bg-slate-900/50 p-6 lg:p-8 animate-enter">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Cinematic Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                Uplink Active // Neural Engine v4
             </div>
             <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Mission <span className="text-blue-500">Control</span></h1>
             <p className="text-slate-500 font-medium italic">Welcome back to the terminal, {user.name}. All systems nominal.</p>
          </div>
          <button onClick={() => navigate('/workout')} className="btn-primary h-16 !px-10 text-lg shadow-2xl shadow-blue-500/20">Initialize Loop</button>
        </div>

        {/* Binary Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { l: 'Protocol Cycles', v: s.totalWorkouts || 0, i: '🧬', c: 'blue' },
            { l: 'Temporal Streak', v: s.currentStreak || 0, i: '🔥', c: 'orange' },
            { l: 'Consistency Score', v: `${s.weeklyProgress?.percentage || 0}%`, i: '📈', c: 'emerald' },
            { l: 'Evolution Level', v: s.level || 1, i: '⭐', c: 'purple' }

          ].map((item, idx) => (
            <div key={idx} className="premium-card p-8 group hover:bg-slate-800 transition-all border-slate-800">
               <div className="flex justify-between items-start">
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.l}</p>
                     <p className={`text-4xl font-black text-white group-hover:text-${item.c}-500 transition-colors italic`}>{item.v}</p>
                  </div>
                  <div className={`text-3xl opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700`}>{item.i}</div>
               </div>
               <div className="mt-6 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className={`h-full bg-${item.c}-500 transition-all duration-1000`} style={{ width: String(item.v).includes('%') ? item.v : '60%' }}></div>
               </div>

            </div>
          ))}
        </div>

        {/* Action Center Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* TODAY STATUS */}
           <div className="lg:col-span-1 premium-card p-8 bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700">
                 <span className="text-8xl">⏱️</span>
              </div>
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest mb-6 flex items-center gap-3">
                 <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                 Today's Status
              </h3>
              
              <div className="space-y-6 relative z-10">
                 <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Protocol</span>
                    <span className="text-lg font-black text-white italic uppercase text-right">Chest & Push</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Completion</span>
                    <span className="text-lg font-black text-emerald-400 italic">3 / 5 Sets</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Posture Sync</span>
                    <span className="text-lg font-black text-blue-400 italic tracking-tighter">82% <span className="text-slate-600 text-xs tracking-widest">Fidelity</span></span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Energy Output</span>
                    <span className="text-lg font-black text-orange-400 italic">210 kcal</span>
                 </div>
              </div>
           </div>

           {/* QUICK ACTIONS */}
           <div className="lg:col-span-2 premium-card p-8 bg-slate-900/80 border-slate-800">
              <h3 className="text-xl font-black text-white italic uppercase tracking-widest mb-8 flex items-center gap-3">
                 <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                 Quick Deployment
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                 <button onClick={() => navigate('/workout')} className="h-full flex flex-col items-center justify-center gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-blue-500 hover:bg-slate-900 transition-all group">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <span className="text-2xl">⚡</span>
                    </div>
                    <span className="font-black text-white uppercase tracking-widest text-sm">Start Protocol</span>
                 </button>
                 <button onClick={() => navigate('/ai-workout')} className="h-full flex flex-col items-center justify-center gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-purple-500 hover:bg-slate-900 transition-all group">
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <span className="text-2xl">🧠</span>
                    </div>
                    <span className="font-black text-white uppercase tracking-widest text-sm">View Intel Plan</span>
                 </button>
                 <button onClick={() => navigate('/find-trainer')} className="h-full flex flex-col items-center justify-center gap-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 hover:border-emerald-500 hover:bg-slate-900 transition-all group">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <span className="text-2xl">👨‍🏫</span>
                    </div>
                    <span className="font-black text-white uppercase tracking-widest text-sm">Book Elite Node</span>
                 </button>
              </div>
           </div>
        </div>


        {/* Neural Analytics Row */}
        <div className="grid lg:grid-cols-2 gap-10">
           <section className="space-y-8">
              <div className="flex items-center justify-between">
                 <h2 className="text-xl font-black text-white italic uppercase flex items-center gap-4">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                    Neural Infusion Logs
                 </h2>
                 <button onClick={() => fetchAIInsights(s)} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">{insightsLoading ? 'Syncing...' : 'Force Uplink'}</button>
              </div>
               <div className="space-y-4">
                 {insights ? (
                   <div className="space-y-4">
                     {(() => {
                        let parsed;
                        try {
                           // Try to parse if it's stored as a JSON string
                           parsed = JSON.parse(insights.insights);
                        } catch (e) {
                           // If it's pure text, render as fallback
                           return (
                              <div className="premium-card p-8 bg-slate-800/40 border-blue-500/10">
                                 <pre className="text-slate-300 font-medium whitespace-pre-wrap font-sans text-sm leading-relaxed italic">
                                   {insights.insights}
                                 </pre>
                              </div>
                           );
                        }
                        
                        // It's structured JSON. Render UI Cards.
                        return (
                           <div className="grid gap-4">
                              {parsed.summary && (
                                <div className="premium-card p-6 border-blue-500/20 bg-blue-500/5">
                                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Summary</p>
                                   <p className="text-white text-sm font-medium">{parsed.summary}</p>
                                </div>
                              )}
                              {parsed.key_improvement && (
                                <div className="premium-card p-6 border-emerald-500/20 bg-emerald-500/5 flex items-start gap-4">
                                   <div className="text-2xl mt-1 text-emerald-400">📈</div>
                                   <div>
                                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Improvement: {parsed.key_improvement.metric}</p>
                                      <p className="text-white text-sm font-medium">{parsed.key_improvement.msg}</p>
                                   </div>
                                </div>
                              )}
                              {parsed.risk_warning && (
                                <div className="premium-card p-6 border-rose-500/20 bg-rose-500/5 flex items-start gap-4">
                                   <div className="text-2xl mt-1 text-rose-400">⚠️</div>
                                   <div>
                                      <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Risk Alert: {parsed.risk_warning.level}</p>
                                      <p className="text-white text-sm font-medium">{parsed.risk_warning.msg}</p>
                                   </div>
                                </div>
                              )}
                              {parsed.next_action && (
                                <div className="premium-card p-6 border-purple-500/20 bg-purple-500/5">
                                   <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Next Action</p>
                                   <p className="text-white text-sm font-medium">{parsed.next_action}</p>
                                </div>
                              )}
                           </div>
                        );
                     })()}
                   </div>
                 ) : (
                   insightsLoading ? [1,2].map(i => <div key={i} className="h-32 skeleton rounded-3xl"></div>) :
                   <EmptyState icon="🧠" title="Scanning Biometrics..." message="Data stream insufficient for pattern recognition." />
                 )}
               </div>
           </section>

           <section className="space-y-8">
              <h2 className="text-xl font-black text-white italic uppercase flex items-center gap-4">
                 <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span>
                 Internal Integrity
              </h2>
              {injuryRisk ? (
                <InjuryRiskAlert riskData={injuryRisk} />
              ) : (
                <div className="premium-card p-12 text-center border-dashed bg-emerald-500/5 group hover:bg-emerald-500/10 transition-all">
                   <div className="text-6xl mb-6 grayscale group-hover:grayscale-0 transition-all">🛡️</div>
                   <p className="text-emerald-400 font-black uppercase text-xs tracking-[0.2em] mb-2 font-mono">Structural Integrity [NOMINAL]</p>
                   <p className="text-slate-500 text-sm font-medium italic">No biomechanical deviations detected in recent protocol cycles.</p>
                </div>
              )}
           </section>
        </div>

        {/* Performance Stream */}
        <div className="grid lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2 premium-card p-10">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Binary Flux Stream</h3>
                 <button onClick={() => navigate('/activity')} className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">View Repository →</button>
              </div>
              <div className="space-y-4">
                 {workouts.map(w => (
                   <div key={w._id} onClick={() => navigate('/activity')} className="flex items-center justify-between p-6 bg-slate-900/60 rounded-[2rem] border border-slate-800/50 hover:bg-slate-800 transition-all cursor-pointer group">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-xl shadow-lg border border-white/5 opacity-50 group-hover:opacity-100 transition-all">
                            {w.exerciseType === 'squat' ? '🦵' : w.exerciseType === 'push_up' ? '💪' : '🏋️'}
                         </div>
                         <div>
                            <p className="text-white font-black text-lg italic uppercase">{w.exerciseType.replace('_', ' ')}</p>
                            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{new Date(w.date).toLocaleDateString()} // {new Date(w.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-2xl font-black text-white italic leading-none">{w.reps}</p>
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Units</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="premium-card p-10 flex flex-col justify-between space-y-10">
              <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Cycle Synthesis</h3>
              <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                 <div className="relative w-48 h-48 mx-auto">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                       <p className="text-4xl font-black text-blue-500 italic leading-none">{s.weeklyProgress?.percentage || 0}%</p>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Efficiency</p>
                    </div>
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                       <circle className="text-slate-800" strokeWidth="6" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                       <circle className="text-blue-600 transition-all duration-1000" strokeWidth="6" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * (s.weeklyProgress?.percentage || 0)) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    </svg>
                 </div>
                 <div className="p-6 bg-slate-900 rounded-3xl w-full text-center border border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Protocol Count</p>
                    <p className="text-2xl font-black text-white italic">{s.weeklyProgress?.completed || 0} / {s.weeklyProgress?.goal || 0}</p>
                 </div>
              </div>
              <button onClick={() => navigate('/ai-workout')} className="btn-secondary w-full h-14">Recalibrate Strategy</button>
           </div>
        </div>

        {/* Global Focus Alert */}
        {s.weakMuscles?.length > 0 && (
          <div className="premium-card p-12 overflow-hidden relative group">
             <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-125 transition-all duration-1000 pointer-events-none text-[200px]">🧬</div>
             <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20 text-white animate-pulse">⚠️</div>
                   <h3 className="text-2xl font-black text-rose-500 uppercase italic tracking-tighter">Biometric Imbalance Detected</h3>
                </div>
                <p className="text-slate-400 text-lg max-w-3xl font-medium italic">Neural analysis indicates a frequency deficit in <span className="text-white font-black">{s.weakMuscles.join(' and ')}</span> sectors. High risk of asymmetrical hypertrophy detected.</p>
                <div className="flex flex-wrap gap-4">
                   {s.weakMuscles.map(m => (
                     <span key={m} className="px-6 py-2 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-400 font-black text-xs uppercase tracking-widest">{m} Protocol</span>
                   ))}
                </div>
                <button onClick={() => navigate('/ai-workout')} className="btn-primary !bg-rose-600 hover:!bg-rose-500 h-16 shadow-rose-500/20">Execute Remediation Plan</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDashboard;
