// Analytics Page Component - Performance Intelligence & Neural Progress Maps
import React, { useState, useEffect, useMemo } from 'react';
import { workoutService } from '../services/api';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { toast } from 'react-hot-toast';
import { TrendingUp, Activity, Target, Zap, Clock, ShieldCheck, ChevronUp, ChevronDown, BarChart2 } from 'lucide-react';
import socket from '../utils/socket';
import StatusHandler from '../components/StatusHandler';
import { motion } from 'framer-motion';

const AnalyticsImproved = () => {
  const [stats, setStats] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    
    socket.on('stats_updated', fetchAnalytics);
    socket.on('dashboard_refresh', fetchAnalytics);
    
    return () => {
      socket.off('stats_updated');
      socket.off('dashboard_refresh');
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, workoutsRes] = await Promise.all([
        workoutService.getStats('all'),
        workoutService.getWorkouts()
      ]);

      setStats(statsRes.data.stats);
      setWorkouts(workoutsRes.data.workouts || []);
    } catch (err) {
      setError('Neural data repository synchronization failed. Check uplink.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = useMemo(() => {
    const dailyStats = {};
    workouts.slice().reverse().forEach(w => {
      const date = new Date(w.date).toLocaleDateString([], { month: 'short', day: 'numeric' });
      if (!dailyStats[date]) {
        dailyStats[date] = { date, reps: 0, duration: 0, score: 0, count: 0 };
      }
      dailyStats[date].reps += w.reps || 0;
      dailyStats[date].duration += Math.round(w.duration / 60);
      dailyStats[date].score += w.postureScore;
      dailyStats[date].count++;
    });

    return Object.values(dailyStats).map(d => ({
      ...d,
      avgScore: Math.round(d.score / d.count)
    }));
  }, [workouts]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl shadow-2xl">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 italic">{label}</p>
          <div className="space-y-1">
            {payload.map((p, i) => (
              <p key={i} className="text-white font-black text-xs italic uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                {p.value} <span className="text-[10px] text-slate-500">{p.name}</span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 lg:p-10 animate-enter scrollbar-hide">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-4">
           <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-500">
                 <Activity size={10} /> Biometric Intelligence // Live
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                Neural <span className="text-blue-600">Analytics</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] italic leading-none">
                Deciphering the evolution of your physical architecture.
              </p>
           </div>
           <button 
             onClick={fetchAnalytics}
             className="h-16 px-10 bg-slate-900 border border-slate-800 hover:border-slate-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3"
           >
             <BarChart2 size={18} /> Resample Stream
           </button>
        </div>

        <StatusHandler loading={loading} error={error} empty={workouts.length === 0} emptyMessage="Insufficient data points for neural triangulation.">
          
          {/* Key Metrics Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { label: 'Total Volume', value: stats?.totalReps || 0, icon: TrendingUp, color: 'text-blue-500', suffix: 'Units' },
               { label: 'Mean Precision', value: `${stats?.averagePostureScore || 0}%`, icon: Target, color: 'text-emerald-500', suffix: 'Fidelity' },
               { label: 'Energy Load', value: stats?.totalCalories || 0, icon: Zap, color: 'text-rose-500', suffix: 'Kcal' },
               { label: 'Temporal Path', value: stats?.currentStreak || 0, icon: Clock, color: 'text-amber-500', suffix: 'Days' }
             ].map((stat, i) => (
               <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between group hover:border-slate-700 transition-all min-h-[180px] relative overflow-hidden">
                  <div className={`p-3 w-fit rounded-xl bg-slate-950 border border-slate-800 ${stat.color} shadow-inner group-hover:scale-110 transition-transform`}>
                     <stat.icon size={20} />
                  </div>
                  <div>
                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                     <p className={`text-4xl font-black text-white italic tracking-tighter leading-none mt-1`}>
                        {stat.value} <span className="text-[10px] text-slate-600 uppercase mb-1">{stat.suffix}</span>
                     </p>
                  </div>
                  <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform"><stat.icon size={100} /></div>
               </div>
             ))}
          </div>

          {/* Primary Visualization Node */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 space-y-10 group">
                <div className="flex justify-between items-center">
                   <div>
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                         <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span> Volume Frequency
                      </h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic mt-1">Repetition Deployment Map</p>
                   </div>
                   <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                      <button className="px-4 py-2 text-[8px] font-black uppercase tracking-widest text-white bg-blue-600 rounded-lg">Units</button>
                      <button className="px-4 py-2 text-[8px] font-black uppercase tracking-widest text-slate-600">Power</button>
                   </div>
                </div>
                
                <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                         <CartesianGrid strokeDasharray="5 5" stroke="#1e293b" vertical={false} />
                         <XAxis 
                           dataKey="date" 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} 
                           dy={10}
                         />
                         <YAxis hide />
                         <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(59, 130, 246, 0.05)', radius: 8}} />
                         <Bar dataKey="reps" name="Units" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={40} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 space-y-10 group">
                <div className="flex justify-between items-center">
                   <div>
                      <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                         <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span> Precision Flux
                      </h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic mt-1">Posture Alignment Index</p>
                   </div>
                </div>
                
                <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                         <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                               <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="5 5" stroke="#1e293b" vertical={false} />
                         <XAxis 
                           dataKey="date" 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} 
                           dy={10}
                         />
                         <YAxis domain={[0, 100]} hide />
                         <Tooltip content={<CustomTooltip />} />
                         <Area 
                           type="monotone" 
                           dataKey="avgScore" 
                           name="Fidelity" 
                           stroke="#10b981" 
                           strokeWidth={4} 
                           fillOpacity={1} 
                           fill="url(#colorScore)" 
                         />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>
          </div>

          {/* Evolution Manifest (Timeline) */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 space-y-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 italic font-black text-[120px] pointer-events-none grayscale">MANIFEST</div>
             
             <div className="space-y-3 relative z-10">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Evolution <span className="text-blue-600">Manifest</span></h3>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] italic leading-none">Timeline of your physical transcendence.</p>
             </div>

             <div className="space-y-4 relative z-10">
                {workouts.slice(0, 5).map((w, i) => (
                   <motion.div 
                     key={w._id}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                     className="bg-slate-950 border border-slate-800 p-6 rounded-[2rem] flex items-center justify-between group hover:border-blue-500/30 transition-all shadow-inner"
                   >
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center text-2xl group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all">
                            {w.exerciseType === 'squat' ? '🦵' : w.exerciseType === 'push_up' ? '🏋️' : '🦾'}
                         </div>
                         <div>
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{new Date(w.date).toLocaleDateString()} // {new Date(w.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <p className="text-lg font-black text-white italic uppercase tracking-tight">{w.exerciseType.replace('_', ' ')}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-10">
                         <div className="text-right">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Precision</p>
                            <p className={`text-xl font-black italic ${w.postureScore >= 85 ? 'text-emerald-500' : 'text-amber-500'}`}>{w.postureScore}%</p>
                         </div>
                         <div className="text-right min-w-[60px]">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Efficiency</p>
                            <p className="text-2xl font-black text-white italic">{w.reps}</p>
                         </div>
                      </div>
                   </motion.div>
                ))}
             </div>

             <div className="flex flex-col md:flex-row gap-8 pt-8 border-t border-slate-800 relative z-10">
                <div className="flex-1 bg-slate-950 p-8 rounded-3xl border border-slate-800 flex items-center gap-6 group hover:border-emerald-500/30 transition-all">
                   <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                      <ShieldCheck size={32} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Structural Peak</p>
                      <p className="text-xl font-black text-white italic mt-1 uppercase tracking-tight">Postural Equilibrium</p>
                      <p className="text-xs font-bold text-slate-500 italic mt-0.5">Maintain {stats?.averagePostureScore}% fidelity to unlock Tier 2.</p>
                   </div>
                </div>
                <div className="flex-1 bg-slate-950 p-8 rounded-3xl border border-slate-800 flex items-center gap-6 group hover:border-blue-500/30 transition-all">
                   <div className="w-16 h-16 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                      <TrendingUp size={32} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Volume Threshold</p>
                      <p className="text-xl font-black text-white italic mt-1 uppercase tracking-tight">Neural Overflow</p>
                      <p className="text-xs font-bold text-slate-500 italic mt-0.5">Surpass {Math.round(stats?.totalReps * 1.1)} units to trigger hypertrophy.</p>
                   </div>
                </div>
             </div>
          </div>

        </StatusHandler>
      </div>
    </div>
  );
};

export default AnalyticsImproved;
