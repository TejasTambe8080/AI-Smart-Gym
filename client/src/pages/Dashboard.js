// Premium Dashboard Page - Performance Intelligence Terminal
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutService } from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, workoutsRes] = await Promise.all([
          workoutService.getStats(period),
          workoutService.getWorkouts({ limit: 10 })
        ]);
        setStats(statsRes.data.stats);
        setWorkouts(workoutsRes.data.workouts || []);
      } catch (error) {
        console.error('Data Fetch Failure:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  const chartData = (workouts || []).map(w => ({
    name: new Date(w.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    score: w.postureScore,
    reps: w.reps
  })).reverse();

  const handleStart = () => navigate('/workout');

  if (loading) return <div className="p-8"><SkeletonLoader type="dashboard" /></div>;

  return (
    <div className="min-h-screen bg-slate-900/50 p-6 lg:p-8 animate-enter">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Logic */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tight italic">Performance <span className="text-blue-500">Overview</span></h1>
            <p className="text-slate-400 font-medium">Synchronized with Neural Link v4.0. Welcome back, {user.name}.</p>
          </div>
          <div className="flex gap-4">
             <button onClick={handleStart} className="btn-primary h-12 !px-8 shadow-xl shadow-blue-500/20">Initialize Workout</button>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Sessions', value: stats?.totalWorkouts || 0, icon: '📋', color: 'blue' },
            { label: 'Neural Precision', value: `${stats?.averagePostureScore || 0}%`, icon: '🧠', color: 'emerald' },
            { label: 'Bio-Mass Moved', value: stats?.totalReps || 0, icon: '🏗️', color: 'amber' },
            { label: 'Metabolic Load', value: stats?.totalCalories || 0, icon: '🔥', color: 'rose' }
          ].map((stat, idx) => (
            <div key={idx} className="premium-card p-6 border-slate-800/60 hover:border-blue-500/30 transition-all group">
               <div className="flex justify-between items-start">
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{stat.label}</p>
                     <p className="text-4xl font-black text-white italic tracking-tighter">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-xl grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500`}>
                     {stat.icon}
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Time-Series Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 premium-card p-8">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-black text-white tracking-tight uppercase italic flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                    Performance Delta
                 </h2>
                 <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {['day', 'week', 'month'].map(p => (
                      <button 
                        key={p} 
                        onClick={() => setPeriod(p)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${period === p ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                      >
                         {p}
                      </button>
                    ))}
                 </div>
              </div>
              
              <div className="h-[350px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                       <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                       <YAxis stroke="#475569" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                         itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                       />
                       <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                       <Area type="monotone" dataKey="reps" stroke="#10B981" strokeWidth={2} fillOpacity={0} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="premium-card p-8 flex flex-col">
              <h2 className="text-xl font-black text-white mb-8 tracking-tight uppercase italic">Protocol Mix</h2>
              <div className="flex-1 flex flex-col items-center justify-center">
                 <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                       <Pie
                          data={Object.entries(stats?.exerciseBreakdown || {}).map(([name, value]) => ({ name, value }))}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                       >
                          {Object.keys(stats?.exerciseBreakdown || {}).map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#EF4444'][index % 5]} />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="grid grid-cols-2 gap-4 w-full mt-6">
                    {Object.entries(stats?.exerciseBreakdown || {}).slice(0, 4).map(([name, value], i) => (
                       <div key={name} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'][i % 4] }}></div>
                          <span className="text-[10px] font-black text-slate-500 uppercase truncate">{name}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Binary Stream - Recent Activity */}
        <div className="premium-card p-0 overflow-hidden">
           <div className="p-8 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-black text-white tracking-tight uppercase italic">Neural Logs // RECENT</h2>
              <button onClick={() => navigate('/activity')} className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">Expand full stream →</button>
           </div>
           {workouts.length > 0 ? (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-slate-950/50">
                      <tr>
                         <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol ID</th>
                         <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Exercise Base</th>
                         <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Load</th>
                         <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Precision</th>
                         <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800">
                      {workouts.map((w) => (
                        <tr key={w._id} className="hover:bg-slate-800/30 transition-colors group">
                           <td className="px-8 py-5 text-xs font-bold text-slate-400 font-mono tracking-tighter">
                              {new Date(w.date).toLocaleDateString()} // {new Date(w.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                           </td>
                           <td className="px-8 py-5">
                              <span className="text-sm font-black text-white italic uppercase tracking-tight">{w.exerciseType}</span>
                           </td>
                           <td className="px-8 py-5 text-sm font-bold text-slate-300 italic">{w.reps} units</td>
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                 <div className="flex-1 h-1 bg-slate-800 rounded-full w-20">
                                    <div className={`h-full rounded-full ${w.postureScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${w.postureScore}%` }}></div>
                                 </div>
                                 <span className="text-xs font-black text-white italic">{w.postureScore}%</span>
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${w.postureScore > 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                 {w.postureScore > 80 ? 'SYNCHRONIZED' : 'DEVIATED'}
                              </span>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           ) : (
             <EmptyState title="No Neural Logs" message="Initialize your first training protocol to populate the analysis stream." />
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
