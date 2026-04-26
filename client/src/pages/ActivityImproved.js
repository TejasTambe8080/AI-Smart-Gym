// Activity Page Component - Shows real workout history with full CRUD & Neural Aesthetics
import React, { useState, useEffect } from 'react';
import { workoutService } from '../services/api';
import { toast } from 'react-hot-toast';
import { Trash2, Edit2, Check, X, Clock, Zap, Target, Database, RotateCcw, Calendar, TrendingUp } from 'lucide-react';
import socket from '../utils/socket';
import StatusHandler from '../components/StatusHandler';
import { motion, AnimatePresence } from 'framer-motion';

const ActivityImproved = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editReps, setEditReps] = useState('');

  useEffect(() => {
    fetchActivities();
    
    socket.on('stats_updated', fetchActivities);
    socket.on('dashboard_refresh', fetchActivities);
    
    return () => {
      socket.off('stats_updated');
      socket.off('dashboard_refresh');
    };
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await workoutService.getWorkouts();
      if (response.data.workouts) {
        setActivities(response.data.workouts);
      }
    } catch (err) {
      setError('Neural archive unreachable. Verify uplink status.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Purge biometric record from archive?')) return;
    try {
      await workoutService.deleteWorkout(id);
      setActivities(activities.filter(a => a._id !== id));
      toast.success('Record purged.');
    } catch (err) {
      toast.error('Deletion failed.');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await workoutService.updateWorkout(id, { reps: parseInt(editReps) });
      setActivities(activities.map(a => a._id === id ? res.data : a));
      setEditingId(null);
      toast.success('Biometrics recalibrated.');
    } catch (err) {
      toast.error('Recalibration failed.');
    }
  };

  const getExerciseIcon = (exercise) => {
    const lowerExercise = (exercise || '').toLowerCase();
    const icons = {
      'squat': '🦵',
      'push_up': '🏋️',
      'sit_up': '⚡',
      'burpee': '🔥',
      'pull_up': '🦾',
    };
    return icons[lowerExercise] || '🏃';
  };

  const getPostureColor = (posture) => {
    if (posture >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
    if (posture >= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-12 animate-enter scrollbar-hide text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-600/10 border border-rose-600/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-rose-500">
                <Database size={10} /> Neural Archive // Log: 03.2
             </div>
             <h1 className="text-4xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none">
               Workout <span className="text-blue-600">History</span>
             </h1>
             <p className="text-slate-500 font-bold uppercase text-xs tracking-widest italic max-w-xl">
               Automated biometric logging system documenting your trajectory of physical evolution.
             </p>
          </div>
          <button 
            onClick={fetchActivities} 
            className="h-20 px-10 bg-slate-900 border border-slate-800 hover:border-slate-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.34em] transition-all flex items-center justify-center gap-4 group shadow-2xl"
          >
            <RotateCcw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
            Recalibrate Stream
          </button>
        </div>

        <StatusHandler loading={loading} error={error} empty={activities.length === 0} emptyMessage="Neural archive is empty. Begin protocol registration.">
          {/* Summary Dashboard Fragment */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Protocols Active', value: activities.length, color: 'text-white', icon: Zap, bg: 'bg-white/5' },
              { label: 'Cycle Duration', value: `${activities.reduce((sum, a) => sum + Math.round(a.duration/60), 0)} min`, color: 'text-blue-500', icon: Clock, bg: 'bg-blue-500/10' },
              { label: 'Precision Mean', value: `${activities.length > 0 ? Math.round(activities.reduce((sum, a) => sum + a.postureScore, 0) / activities.length) : 0}%`, color: 'text-emerald-500', icon: Target, bg: 'bg-emerald-500/10' },
              { label: 'Metabolic Load', value: `${Math.round(activities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0))}`, color: 'text-rose-500', icon: TrendingUp, bg: 'bg-rose-500/10' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between group hover:border-slate-700 transition-all min-h-[180px] relative overflow-hidden shadow-inner">
                <div className={`p-4 w-fit rounded-2xl ${stat.bg} border border-white/5 ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                   <stat.icon size={22} />
                </div>
                <div className="relative z-10 space-y-1">
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 italic">{stat.label}</p>
                   <p className={`text-4xl font-black ${stat.color} italic tracking-tighter leading-none`}>{stat.value}</p>
                </div>
                <div className="absolute top-0 right-0 p-10 opacity-5 grayscale pointer-events-none text-9xl italic font-black">{i+1}</div>
              </div>
            ))}
          </div>

          {/* Master Log Manifest */}
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950/80 border-b border-slate-800">
                  <tr>
                    <th className="px-10 py-8 text-xs font-black text-slate-500 uppercase tracking-[0.4em] italic">Vector</th>
                    <th className="px-10 py-8 text-xs font-black text-slate-500 uppercase tracking-[0.4em] italic">Temporal Data</th>
                    <th className="px-10 py-8 text-xs font-black text-slate-500 uppercase tracking-[0.4em] italic">Units</th>
                    <th className="px-10 py-8 text-xs font-black text-slate-500 uppercase tracking-[0.4em] italic">Precision</th>
                    <th className="px-10 py-8 text-xs font-black text-slate-500 uppercase tracking-[0.4em] italic text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/20">
                  <AnimatePresence>
                    {activities.map((a) => (
                      <motion.tr 
                        key={a._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="hover:bg-blue-600/5 transition-all group"
                      >
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <span className="text-3xl w-16 h-16 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:text-blue-500 transition-all duration-500 shadow-inner">
                               {getExerciseIcon(a.exerciseType)}
                            </span>
                            <div>
                               <span className="text-lg font-black text-white italic uppercase tracking-tighter">{a.exerciseType.replace('_', ' ')}</span>
                               <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">Biometric Validated</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <p className="text-sm font-black text-slate-200 italic leading-none flex items-center gap-2">
                             <Calendar size={14} className="text-slate-600" />
                             {new Date(a.date).toLocaleDateString()}
                          </p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2 ml-5">{new Date(a.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </td>
                        <td className="px-10 py-8">
                          {editingId === a._id ? (
                             <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-2xl border-2 border-blue-600 shadow-2xl shadow-blue-500/20">
                               <input 
                                 type="number" 
                                 value={editReps} 
                                 onChange={(e) => setEditReps(e.target.value)}
                                 className="w-16 bg-transparent text-white font-black text-xl outline-none text-center"
                                 autoFocus
                               />
                               <div className="flex gap-1">
                                  <button onClick={() => handleUpdate(a._id)} className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-xl transition-all"><Check size={20} /></button>
                                  <button onClick={() => setEditingId(null)} className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-all"><X size={20} /></button>
                               </div>
                             </div>
                          ) : (
                            <div className="flex items-end gap-2 group-hover:translate-x-2 transition-transform duration-500">
                               <span className="text-4xl font-black text-white italic tracking-tighter leading-none">{a.reps}</span>
                               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 italic">Units</span>
                            </div>
                          )}
                        </td>
                        <td className="px-10 py-8">
                          <span className={`px-6 py-3 rounded-full font-black text-[10px] border tracking-widest uppercase italic inline-flex items-center gap-3 ${getPostureColor(a.postureScore)}`}>
                             <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div> 
                             {a.postureScore}% Precision
                          </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <button 
                                onClick={() => { setEditingId(a._id); setEditReps(a.reps); }}
                                className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-500 hover:border-blue-500/50 hover:shadow-xl transition-all group/btn"
                              >
                                 <Edit2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                              </button>
                              <button 
                                onClick={() => handleDelete(a._id)}
                                className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-500/50 hover:shadow-xl transition-all group/btn"
                              >
                                 <Trash2 size={20} className="group-hover/btn:rotate-12 transition-transform" />
                              </button>
                           </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </StatusHandler>
      </div>
    </div>
  );
};

export default ActivityImproved;
