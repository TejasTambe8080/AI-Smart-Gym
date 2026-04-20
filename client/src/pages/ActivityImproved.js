// Activity Page Component - Shows real workout history
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-hot-toast';

const ActivityImproved = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/workouts', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.workouts) {
        const formattedActivities = response.data.workouts.map((w, idx) => ({
          id: w._id || idx,
          date: new Date(w.date).toLocaleDateString(),
          timestamp: new Date(w.date).getTime(),
          exercise: w.exerciseType?.replace('_', ' ').toUpperCase() || 'EXERCISE',
          reps: w.reps || 0,
          duration: `${Math.round(w.duration / 60)} min`,
          posture: w.postureScore || 0,
          calories: Math.round(w.caloriesBurned || 0)
        }));
        setActivities(formattedActivities);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load workout history');
      toast.error('Failed to load history');
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getExerciseIcon = (exercise) => {
    const lowerExercise = exercise?.toLowerCase() || '';
    const icons = {
      'chest press': '🏋️',
      'chest': '🏋️',
      'squat': '🦵',
      'squats': '🦵',
      'deadlift': '💪',
      'deadlifts': '💪',
      'bench press': '🏋️',
      'pull-up': '🤸',
      'pull_up': '🤸',
      'push_up': '💥',
      'sit_up': '⚡',
      'burpee': '🔥',
    };
    return icons[lowerExercise] || '🏃';
  };

  const getPostureColor = (posture) => {
    if (posture >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (posture >= 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6 lg:p-8 space-y-8 animate-enter">
        <div className="space-y-2">
          <div className="h-10 w-64 skeleton rounded-xl"></div>
          <div className="h-4 w-48 skeleton rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} />)}
        </div>
        <div className="h-96 w-full skeleton rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/50 p-6 lg:p-8 animate-enter">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tight">📋 Activity Log</h1>
            <p className="text-slate-400 font-medium">Your complete fitness journey recorded in real-time.</p>
          </div>
          <button
            onClick={fetchActivities}
            className="btn-secondary"
          >
            ↻ Refresh List
          </button>
        </div>

        {/* Stats Summary Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="premium-card p-6">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Sessions</p>
            <p className="stat-value mt-2 text-white">{activities.length}</p>
          </div>
          <div className="premium-card p-6">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Time</p>
            <p className="stat-value mt-2 text-blue-400">
               {activities.reduce((sum, a) => sum + parseInt(a.duration), 0)} <span className="text-sm font-bold uppercase">min</span>
            </p>
          </div>
          <div className="premium-card p-6">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Avg Precision</p>
            <p className="stat-value mt-2 text-emerald-400">
              {activities.length > 0
                ? Math.round(activities.reduce((sum, a) => sum + a.posture, 0) / activities.length)
                : 0}%
            </p>
          </div>
          <div className="premium-card p-6">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Energy Burned</p>
            <p className="stat-value mt-2 text-orange-400">
              {activities.reduce((sum, a) => sum + a.calories, 0)} <span className="text-sm font-bold uppercase">kcal</span>
            </p>
          </div>
        </div>

        {/* Workouts List */}
        <div className="premium-card overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-700 bg-slate-800/30">
            <h3 className="text-xl font-bold text-white">Workout History</h3>
          </div>
          
          {activities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-700">
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Exercise</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Volume</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Time</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Accuracy</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Calories</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {activities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-slate-800/30 transition-colors group cursor-default">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                            {getExerciseIcon(activity.exercise)}
                          </span>
                          <span className="font-bold text-white tracking-tight">{activity.exercise}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-400 font-medium">{activity.date}</td>
                      <td className="px-6 py-5">
                        <span className="text-white font-black text-lg">{activity.reps}</span>
                        <span className="ml-1 text-slate-500 text-xs font-bold uppercase tracking-widest">Reps</span>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-400 font-medium">{activity.duration}</td>
                      <td className="px-6 py-5">
                        <span className={`px-4 py-1.5 rounded-full font-black text-xs border ${getPostureColor(activity.posture)}`}>
                          {activity.posture}%
                        </span>
                      </td>
                      <td className="px-6 py-5">
                         <span className="text-orange-400 font-black text-lg">{activity.calories}</span>
                         <span className="ml-1 text-slate-500 text-xs font-bold uppercase tracking-widest">Kcal</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 px-6">
               <EmptyState 
                 icon="📅" 
                 title="No History Found" 
                 message="Every journey begins with a single rep. Record your first session to see your progress here."
                 action={{ label: "Start Training", onClick: () => window.location.href='/workout' }}
               />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityImproved;
