// Analytics Page Component - Shows real progress data
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-hot-toast';

const AnalyticsImproved = () => {
  const [stats, setStats] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [statsRes, workoutsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/workouts', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data.data);
      setWorkouts(workoutsRes.data.workouts || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      toast.error('Could not sync analytics data. Server might be offline.');

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 space-y-8 animate-enter">
        <div className="h-10 w-64 skeleton rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="h-80 skeleton rounded-3xl"></div>
           <div className="h-80 skeleton rounded-3xl"></div>
        </div>
      </div>
    );
  }

  // Create chart data from workouts
  const dailyStats = {};
  workouts.forEach(w => {
    const date = new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!dailyStats[date]) {
      dailyStats[date] = { date, workouts: 0, reps: 0, duration: 0 };
    }
    dailyStats[date].workouts++;
    dailyStats[date].reps += w.reps || 0;
    dailyStats[date].duration += Math.round(w.duration / 60);
  });

  const weeklyData = Object.values(dailyStats).slice(-7);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl shadow-2xl">
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">{label}</p>
          <p className="text-white font-black text-lg">
            {payload[0].value} <span className="text-xs text-slate-500 uppercase">{payload[0].name}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-900/50 p-6 lg:p-8 animate-enter">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tight">📈 Performance Analytics</h1>
            <p className="text-slate-400 font-medium">Deep dive into your training patterns and volume.</p>
          </div>
          <div className="flex gap-3">
             <button onClick={fetchAnalytics} className="btn-secondary px-4 py-2 text-sm">↻ Sync</button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="premium-card p-6 border-l-4 border-l-blue-500">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Sessions</p>
            <p className="stat-value mt-2 text-white">{stats?.totalWorkouts || 0}</p>
          </div>
          <div className="premium-card p-6 border-l-4 border-l-emerald-500">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Reps</p>
            <p className="stat-value mt-2 text-white">{stats?.totalReps || 0}</p>
          </div>
          <div className="premium-card p-6 border-l-4 border-l-purple-500">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Avg Precision</p>
            <p className="stat-value mt-2 text-white">{stats?.averagePostureScore || 0}%</p>
          </div>
          <div className="premium-card p-6 border-l-4 border-l-orange-500">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Kcal Burned</p>
            <p className="stat-value mt-2 text-white">{stats?.totalCalories || 0}</p>
          </div>
        </div>

        {/* Weekly Charts */}
        {weeklyData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="premium-card p-8">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                Training Volume (Reps)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#1e293b', radius: 8}} />
                  <Bar dataKey="reps" name="Reps" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="premium-card p-8">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                Active Duration (Mins)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="duration" 
                    name="Minutes"
                    stroke="#10b981" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorDuration)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <EmptyState 
            icon="📉" 
            title="Insufficient Data" 
            message="We need at least a few days of activity to generate meaningful charts and insights."
          />
        )}

        {/* Pro Performance Timeline */}
        <div className="premium-card p-10 bg-slate-900/60 border-slate-800">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tight flex items-center gap-4">
               <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
               Performance Timeline
            </h3>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Precision</span>
              <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Volume</span>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={Object.values(dailyStats)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="reps" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 0}} activeDot={{r: 6}} />
              <Line type="monotone" dataKey="avgPosture" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6', strokeWidth: 0}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>

          {/* Milestones Flow */}
          <div className="mt-12 space-y-6">
             <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Neural Milestones</h4>
             <div className="flex flex-col gap-4">
                {workouts.length > 5 && (
                  <div className="flex items-center gap-6 p-6 bg-slate-950/50 rounded-2xl border border-white/5">
                     <div className="text-2xl">🎖️</div>
                     <div>
                        <p className="text-white font-black text-sm uppercase italic">Symmetry Breakthrough</p>
                        <p className="text-slate-500 text-[10px] font-bold">Posture improved from 60% → {stats?.averagePostureScore}% in the last cycle.</p>
                     </div>
                  </div>
                )}
                {stats?.currentStreak >= 3 && (
                  <div className="flex items-center gap-6 p-6 bg-slate-950/50 rounded-2xl border border-white/5">
                     <div className="text-2xl">🔥</div>
                     <div>
                        <p className="text-white font-black text-sm uppercase italic">Continuity Anchor</p>
                        <p className="text-slate-500 text-[10px] font-bold">Maintained active neural bridge for {stats.currentStreak} consecutive cycles.</p>
                     </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Global Summary */}
        {stats && (
          <div className="glass-card p-10 rounded-3xl relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
               <span className="text-9xl">🏛️</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-8 italic uppercase tracking-widest">Executive Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-4">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Streak Intensity</p>
                  <p className="text-5xl font-black text-emerald-400 italic leading-none">{stats.currentStreak} <span className="text-xl">Days</span></p>
                  <p className="text-slate-500 text-xs italic font-medium">Consistency is the foundation of growth.</p>
                </div>
                <div className="space-y-4">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Evolution Tier</p>
                  <p className="text-5xl font-black text-purple-400 italic leading-none">Lv. {stats.level}</p>
                  <p className="text-slate-500 text-xs italic font-medium">Progressing towards next biometric peak.</p>
                </div>
                <div className="space-y-4">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Neural Volume</p>
                  <p className="text-5xl font-black text-blue-400 italic leading-none">{stats.totalReps} <span className="text-xl">Units</span></p>
                  <p className="text-slate-500 text-xs italic font-medium">Total energy displacement recorded.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AnalyticsImproved;
