// Premium Enhanced Dashboard - Performance Intelligence & Neural Analytics
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutService, aiService, trainerService } from '../services/api';
import socket from '../utils/socket';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Target, Activity, Star, Calendar, Video, 
  ArrowUpRight, Brain, ShieldAlert, Clock, ChevronRight,
  TrendingUp, BarChart, ExternalLink, Layers, Sparkles
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart as ReBarChart, Bar 
} from 'recharts';
import StatusHandler from '../components/StatusHandler';

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
    
    socket.on('stats_updated', () => {
      toast.success('Neural biometrics synchronized');
      fetchDashboardData();
    });
    
    socket.on('dashboard_refresh', fetchDashboardData);
    
    socket.on('notification_received', (data) => {
      toast.success(data.message || 'Incoming signal detected', { icon: '📡' });
      fetchDashboardData();
    });

    socket.on('booking_updated', fetchBookings);
    
    return () => {
      socket.off('stats_updated');
      socket.off('dashboard_refresh');
      socket.off('notification_received');
      socket.off('booking_updated');
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, workoutsRes, bookingsRes] = await Promise.all([
        workoutService.getStats('week'),
        workoutService.getWorkouts({ limit: 7 }),
        trainerService.getUserBookings()
      ]);
      
      setStats(statsRes.data.stats);
      setWorkouts(workoutsRes.data.workouts || []);
      setBookings(bookingsRes.data.bookings || []);
      
      if (statsRes.data.stats) {
        fetchAIInsights(statsRes.data.stats);
      }
    } catch (e) { 
      setError('Neural link synchronization failed. System offline.');
    } finally { 
      setLoading(false); 
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await trainerService.getUserBookings();
      setBookings(res.data.bookings || []);
    } catch (e) {}
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
      console.log("AI Core: Insight cache empty.");
    } finally {
      setInsightsLoading(false);
    }
  };

  const performanceData = useMemo(() => {
    return workouts.slice().reverse().map(w => ({
      name: new Date(w.date).toLocaleDateString([], { weekday: 'short' }),
      reps: w.reps,
      score: w.postureScore
    }));
  }, [workouts]);

  const parsedAI = useMemo(() => {
    if (!insights) return null;
    try {
      return JSON.parse(insights.insights);
    } catch (e) {
      return { summary: insights.insights };
    }
  }, [insights]);

  const s = stats || { totalWorkouts: 0, level: 1, currentStreak: 0 };

  return (
    <div className="min-h-screen bg-slate-950 p-4 lg:p-10 animate-enter scrollbar-hide">
      <StatusHandler loading={loading} error={error}>
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Main Cinematic Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-3">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400">
                  <Activity size={12} className="animate-pulse" />
                  Status: Optimized // Security Node: {user._id?.slice(-8).toUpperCase()}
               </div>
               <h1 className="text-5xl lg:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                 My <span className="text-blue-600">Dashboard</span>
               </h1>
               <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] flex items-center gap-2 italic">
                 Welcome back, {user.name} <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></span>
               </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
               <button 
                 onClick={() => navigate('/find-trainer')}
                 className="h-16 px-8 bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl flex items-center justify-center gap-3"
               >
                 <Star size={18} /> Book Trainer
               </button>
               <button 
                 onClick={() => navigate('/workout')}
                 className="h-16 px-10 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase italic tracking-widest transition-all shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-3 active:scale-95"
               >
                 <Zap size={20} className="fill-current" />
                 Start Workout
               </button>
            </div>
          </div>

          {/* Biometric Integration Node (Chart + Progress) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col gap-8 relative overflow-hidden group">
                <div className="flex justify-between items-center relative z-10">
                   <div>
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                         <TrendingUp className="text-blue-500" /> Performance Trends
                      </h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Weekly Activity Analysis</p>
                   </div>
                   <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Reps
                      </div>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Posture Score
                      </div>
                   </div>
                </div>
                
                <div className="h-[250px] w-full relative z-10">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                         <defs>
                            <linearGradient id="colorReps" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                         <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                         <YAxis hide />
                         <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '10px' }}
                            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                         />
                         <Area type="monotone" dataKey="reps" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorReps)" />
                         <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-9xl font-black italic">LVL {s.level || 1}</div>
                <div className="space-y-8 relative z-10">
                   <div className="flex justify-between items-start">
                      <div className="w-20 h-20 bg-slate-950 rounded-3xl border border-slate-700 flex flex-col items-center justify-center shadow-inner group-hover:border-blue-500 transition-colors">
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Level</span>
                         <span className="text-3xl font-black text-white italic">{s.level || 1}</span>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">XP Progress</p>
                         <p className="text-2xl font-black text-blue-500 italic mt-1">{(s.totalWorkouts || 0) * 10} / 500</p>
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Progress Path</p>
                         <p className="text-[9px] font-black text-blue-400">Next: Pro Athlete Level</p>
                      </div>
                      <div className="h-6 bg-slate-950 rounded-2xl border border-slate-800 p-1.5">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${Math.min(100, ((s.totalWorkouts || 0) * 10 / 500) * 100)}%` }}
                           className="h-full bg-blue-600 rounded-xl shadow-lg shadow-blue-600/40 relative overflow-hidden"
                         >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                         </motion.div>
                      </div>
                   </div>

                   <button 
                     onClick={() => navigate('/analytics')}
                     className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-950/50 rounded-2xl border border-slate-800 hover:text-white hover:border-slate-600 transition-all"
                   >
                     View Detailed Analytics <ChevronRight className="inline ml-1" size={12} />
                   </button>
                </div>
             </div>
          </div>

          {/* Quick Metrics Node */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              { label: 'Total Workouts', value: s.totalWorkouts || 0, icon: Activity, color: 'text-blue-500' },
              { label: 'Streak', value: s.currentStreak || 0, icon: Clock, color: 'text-emerald-500' },
              { label: 'Consistency', value: `${s.weeklyProgress?.percentage || 0}%`, icon: Zap, color: 'text-amber-500' },
              { label: 'Posture Score', value: `${s.averagePostureScore || 0}%`, icon: Target, color: 'text-rose-500' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 group hover:border-slate-700 transition-all cursor-default relative overflow-hidden">
                 <div className="absolute -right-4 -bottom-4 text-4xl opacity-5 grayscale pointer-events-none group-hover:scale-110 transition-transform"><item.icon size={48} /></div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{item.label}</p>
                 <p className="text-3xl font-black text-white italic tracking-tighter">{item.value}</p>
              </div>
            ))}
            {/* Weak Muscles Node */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 group hover:border-rose-500/30 transition-all cursor-default relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 text-4xl opacity-5 grayscale pointer-events-none group-hover:scale-110 transition-transform"><Layers size={48} /></div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Weak Muscles</p>
               <div className="flex flex-wrap gap-1 mt-1">
                 {s.weakMuscles && s.weakMuscles.length > 0 ? s.weakMuscles.map(m => (
                   <span key={m} className="text-[9px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase italic">{m}</span>
                 )) : (
                   <span className="text-[10px] font-black text-emerald-500 italic uppercase">None Detected</span>
                 )}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Active Expert Links (Bookings) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                   <Video className="text-blue-600" /> My Training Sessions
                 </h3>
                 <button onClick={() => navigate('/notifications')} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">View All</button>
              </div>
              
              <div className="space-y-4">
                 {bookings.length > 0 ? bookings.map(b => (
                   <div key={b._id} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-blue-500/30 transition-all">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-700 text-2xl group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all">
                            <Star size={32} />
                         </div>
                         <div>
                            <p className="text-lg font-black text-white italic uppercase tracking-tight">{b.trainerId?.name || 'Authorized Specialist'}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                               <span className="px-3 py-1 bg-slate-950 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-800 italic">{b.sessionType}</span>
                               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                 b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                 b.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                 'bg-slate-800 text-slate-500 border-slate-700 font-bold'
                               }`}>{b.status}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-6 w-full md:w-auto">
                         <div className="hidden sm:block text-right">
                            <p className="text-sm font-black text-white italic leading-none">{new Date(b.scheduledAt).toLocaleDateString()}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{new Date(b.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                         </div>
                         {b.status === 'confirmed' && b.meetingLink ? (
                           <a 
                             href={b.meetingLink} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex-1 md:flex-none h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/30 active:scale-95 group"
                           >
                             <Video size={16} /> Join Video Session <ExternalLink size={12} className="opacity-50" />
                           </a>
                         ) : (
                           <div className="flex-1 md:flex-none h-14 px-8 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center opacity-50 grayscale italic text-[9px] font-black text-slate-600 uppercase tracking-widest">
                             Link Pending
                           </div>
                         )}
                      </div>
                   </div>
                 )) : (
                   <div className="bg-slate-900 border border-slate-800 border-dashed rounded-[3rem] p-20 text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto text-slate-800">
                         <Video size={32} />
                      </div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic leading-relaxed">
                         No training sessions booked.<br />Connect with a trainer to schedule your first session.
                      </p>
                      <button onClick={() => navigate('/find-trainer')} className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white mt-4 underline underline-offset-8">Browse Trainers</button>
                   </div>
                 )}
              </div>
            </div>

            {/* AI Suggestions Node */}
            <div className="space-y-6">
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                 <Brain className="text-purple-600" /> AI Suggestions
               </h3>
               <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col gap-8 relative overflow-hidden border-purple-500/20">
                  <div className="absolute top-0 right-0 p-10 opacity-5 grayscale pointer-events-none text-9xl font-black italic">🤖</div>
                  
                  <StatusHandler loading={insightsLoading} empty={!insights} emptyMessage="Analyzing your biometric data...">
                    <div className="space-y-10 relative z-10">
                      <div>
                         <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={14} className="text-purple-500" />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Summary</p>
                         </div>
                         <p className="text-sm font-bold text-slate-200 italic leading-relaxed tracking-tight">{parsedAI?.summary || "Great consistency this week. Focus on maintaining posture alignment during deep squat repetitions."}</p>
                      </div>
                      
                      <div className="space-y-4">
                         <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl group/ins">
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2 group-hover/ins:translate-x-1 transition-transform">
                               <TrendingUp size={12} /> Improvements
                            </p>
                            <p className="text-xs text-white font-bold italic leading-relaxed">
                               {parsedAI?.key_improvement?.msg || "Keep your weight centered over your midfoot for better balance."}
                            </p>
                         </div>

                         <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-3xl group/ins">
                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2 group-hover/ins:translate-x-1 transition-transform">
                               <Zap size={12} /> Next Action
                            </p>
                            <p className="text-xs text-white font-bold italic leading-relaxed">
                               {parsedAI?.next_action || "Try a 15-minute mobility routine to improve hip flexibility."}
                            </p>
                         </div>
                      </div>
                    </div>
                  </StatusHandler>
               </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                  <Activity className="text-rose-600" /> Recent Workouts
                </h3>
                <button onClick={() => navigate('/activity')} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all underline underline-offset-4">Full Activity</button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {workouts.slice(0, 4).map(w => (
                   <div key={w._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-6 group hover:border-slate-600 transition-all">
                      <div className="w-14 h-14 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-700 text-2xl group-hover:text-rose-500 group-hover:scale-110 transition-all shadow-inner">
                         {w.exerciseType === 'squat' ? '🦵' : w.exerciseType === 'push_up' ? '🏋️' : '🦾'}
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">{(new Date(w.date).getMonth() + 1).toString().padStart(2, '0')} / {new Date(w.date).getDate().toString().padStart(2, '0')}</p>
                         <p className="text-sm font-black text-white italic tracking-tight uppercase leading-none mt-1">{w.exerciseType.replace('_', ' ')}</p>
                         <p className="text-xs font-black text-rose-500 italic mt-1 leading-none">{w.reps} Reps</p>
                      </div>
                      <button onClick={() => navigate(`/analytics`)} className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 hover:text-white hover:border-white transition-all">
                         <ChevronRight size={14} />
                      </button>
                   </div>
                ))}
                {workouts.length === 0 && (
                   <div className="col-span-full py-12 bg-slate-900 border border-slate-800 border-dashed rounded-[2.5rem] text-center italic text-slate-600 text-[10px] font-black uppercase tracking-widest">
                      No workouts recorded yet. Start your first session now!
                   </div>
                )}
             </div>
          </div>
        </div>
      </StatusHandler>
    </div>
  );
};

export default EnhancedDashboard;
