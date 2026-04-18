// Analytics Page Component - Shows real progress data
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="text-center">
          <p className="text-lg text-red-600">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Analytics</h1>
          <p className="text-gray-600">Your fitness progress and performance metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">Total Workouts</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalWorkouts || 0}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">Total Reps</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalReps || 0}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">Avg Posture</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.averagePostureScore || 0}%</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">Total Calories</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalCalories || 0}</p>
          </div>
        </div>

        {/* Weekly Chart */}
        {weeklyData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Weekly Reps</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reps" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">⏱️ Weekly Duration</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="duration" fill="#10b981" stroke="#10b981" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-600 text-sm mb-1">Current Streak</p>
                <p className="text-2xl font-bold text-green-600">{stats.currentStreak} days 🔥</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Level</p>
                <p className="text-2xl font-bold text-purple-600">⭐ Level {stats.level}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Duration</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalDuration} mins</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsImproved;
