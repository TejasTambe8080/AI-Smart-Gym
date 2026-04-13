// Improved Dashboard - Modern SaaS Design
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutService } from '../services/api';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DashboardImproved = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const statsRes = await workoutService.getStats(period);
      setStats(statsRes.data.stats);

      const workoutsRes = await workoutService.getWorkouts({ limit: 5 });
      setWorkouts(workoutsRes.data.workouts);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl font-bold text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Sample data for charts
  const chartData = [
    { name: 'Mon', reps: 45, duration: 25, posture: 82 },
    { name: 'Tue', reps: 52, duration: 30, posture: 85 },
    { name: 'Wed', reps: 48, duration: 28, posture: 78 },
    { name: 'Thu', reps: 61, duration: 35, posture: 88 },
    { name: 'Fri', reps: 55, duration: 32, posture: 80 },
    { name: 'Sat', reps: 67, duration: 40, posture: 90 },
    { name: 'Sun', reps: 40, duration: 20, posture: 75 },
  ];

  const pieData = Object.entries(stats?.exerciseBreakdown || {}).map(([name, value]) => ({
    name, value,
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">💪 Welcome back, {user.name}!</h1>
              <p className="text-blue-100 text-lg">Your fitness journey continues</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/workout')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg transition transform hover:scale-105"
              >
                🏋️ Start Workout
              </button>
              <button
                onClick={() => navigate('/posture')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition"
              >
                👁️ Check Posture
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        {/* Period Selector */}
        <div className="mb-8 flex gap-3 flex-wrap">
          {['day', 'week', 'month'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-3 rounded-xl font-bold transition ${
                period === p
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Top Stats Cards - 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Workouts */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border-t-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">TOTAL WORKOUTS</p>
                <p className="text-4xl font-bold text-blue-600">{stats?.totalWorkouts || 0}</p>
                <p className="text-xs text-gray-500 mt-2">↑ 12% from last period</p>
              </div>
              <span className="text-4xl">📋</span>
            </div>
          </div>

          {/* Total Reps */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border-t-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">TOTAL REPS</p>
                <p className="text-4xl font-bold text-green-600">{stats?.totalReps || 0}</p>
                <p className="text-xs text-gray-500 mt-2">↑ 8% from last period</p>
              </div>
              <span className="text-4xl">🔢</span>
            </div>
          </div>

          {/* Avg Posture Score */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border-t-4 border-orange-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">AVG POSTURE</p>
                <p className="text-4xl font-bold text-orange-600">{stats?.averagePostureScore || 0}%</p>
                <p className="text-xs text-gray-500 mt-2">↑ 5% from last period</p>
              </div>
              <span className="text-4xl">🧘</span>
            </div>
          </div>

          {/* Calories Burned */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border-t-4 border-red-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">CALORIES</p>
                <p className="text-4xl font-bold text-red-600">🔥 {stats?.totalCalories || 0}</p>
                <p className="text-xs text-gray-500 mt-2">↑ 15% from last period</p>
              </div>
              <span className="text-4xl">🍔</span>
            </div>
          </div>
        </div>

        {/* Charts Section - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Line Chart - Reps Trend */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-3xl">📈</span> Reps Progress
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="reps" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Workout Duration */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-3xl">⏱️</span> Workout Duration
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="duration" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Area Chart - Posture Score */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-3xl">📊</span> Posture Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="posture" fill="#F59E0B" stroke="#F59E0B" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Exercise Breakdown */}
          {pieData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-3xl">🎯</span> Exercise Breakdown
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Workouts */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-3xl">📝</span> Recent Workouts
            </h2>
            {workouts.length > 0 ? (
              <div className="space-y-4">
                {workouts.slice(0, 5).map((workout, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{workout.exerciseType}</p>
                      <p className="text-sm text-gray-600">
                        {workout.reps} reps • {Math.floor(workout.duration / 60)}m {workout.duration % 60}s
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{workout.postureScore}%</p>
                      <p className="text-sm text-gray-600">Posture Score</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No workouts yet. Start your first workout!</p>
            )}
          </div>

          {/* Goals Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-3xl">🎯</span> Weekly Goals
            </h2>
            <div className="space-y-6">
              {/* Workouts Goal */}
              <div>
                <div className="flex justify-between mb-2">
                  <p className="font-semibold text-gray-900">Workouts</p>
                  <p className="text-sm font-bold text-blue-600">{stats?.totalWorkouts || 0}/4</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(((stats?.totalWorkouts || 0) / 4) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Posture Goal */}
              <div>
                <div className="flex justify-between mb-2">
                  <p className="font-semibold text-gray-900">Avg Posture</p>
                  <p className="text-sm font-bold text-orange-600">{stats?.averagePostureScore || 0}%/85%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-orange-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(((stats?.averagePostureScore || 0) / 85) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Total Reps Goal */}
              <div>
                <div className="flex justify-between mb-2">
                  <p className="font-semibold text-gray-900">Total Reps</p>
                  <p className="text-sm font-bold text-green-600">{stats?.totalReps || 0}/300</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(((stats?.totalReps || 0) / 300) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/workout')}
            className="bg-gradient-to-br from-green-500 to-cyan-500 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition transform hover:scale-105 text-center"
          >
            <p className="text-4xl mb-3">🏋️</p>
            <p className="text-xl font-bold">Start Workout</p>
            <p className="text-sm mt-2 opacity-90">Begin your exercise session</p>
          </button>

          <button
            onClick={() => navigate('/analytics')}
            className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition transform hover:scale-105 text-center"
          >
            <p className="text-4xl mb-3">📊</p>
            <p className="text-xl font-bold">View Analytics</p>
            <p className="text-sm mt-2 opacity-90">Track your progress</p>
          </button>

          <button
            onClick={() => navigate('/suggestions')}
            className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition transform hover:scale-105 text-center"
          >
            <p className="text-4xl mb-3">💡</p>
            <p className="text-xl font-bold">Get Suggestions</p>
            <p className="text-sm mt-2 opacity-90">AI fitness tips</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardImproved;
