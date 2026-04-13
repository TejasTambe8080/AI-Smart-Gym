// Analytics Page - Performance trends and insights
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { workoutService } from '../services/api';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await workoutService.getStats(period);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  // Sample data for trends
  const trendData = [
    { day: 'Mon', reps: 45, posture: 78, consistency: 82 },
    { day: 'Tue', reps: 52, posture: 82, consistency: 85 },
    { day: 'Wed', reps: 48, posture: 75, consistency: 80 },
    { day: 'Thu', reps: 61, posture: 88, consistency: 90 },
    { day: 'Fri', reps: 55, posture: 85, consistency: 88 },
    { day: 'Sat', reps: 67, posture: 90, consistency: 92 },
    { day: 'Sun', reps: 40, posture: 72, consistency: 78 },
  ];

  const improvementData = [
    { metric: 'Posture', improvement: 12, color: '#10B981' },
    { metric: 'Consistency', improvement: 8, color: '#3B82F6' },
    { metric: 'Rep Count', improvement: 15, color: '#F59E0B' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">📈 Analytics & Insights</h1>

          {/* Period Selector */}
          <div className="flex gap-3">
            {['week', 'month'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Total Workouts</p>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalWorkouts || 0}</p>
            <p className="text-xs text-gray-500 mt-2">↑ 12% from last period</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Avg Posture Score</p>
            <p className="text-3xl font-bold text-green-600">{stats?.averagePostureScore || 0}%</p>
            <p className="text-xs text-gray-500 mt-2">↑ Improved</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Total Reps</p>
            <p className="text-3xl font-bold text-orange-600">{stats?.totalReps || 0}</p>
            <p className="text-xs text-gray-500 mt-2">↑ 8% increase</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm mb-2">Calories Burned</p>
            <p className="text-3xl font-bold text-red-600">
              {stats?.totalCalories || 0}
            </p>
            <p className="text-xs text-gray-500 mt-2">🔥 Great effort!</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Rep Progress */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Rep Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorReps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="reps"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorReps)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Posture Improvement */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Posture Score Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="posture"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-metric Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Performance Metrics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="consistency" fill="#3B82F6" />
                <Bar dataKey="posture" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Improvement Metrics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Improvement Over Time</h2>
            <div className="space-y-4">
              {improvementData.map((item) => (
                <div key={item.metric}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">{item.metric}</span>
                    <span className="text-green-600 font-bold">+{item.improvement}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${item.improvement * 6}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">💡 Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border-l-4 border-green-600 rounded">
              <p className="font-semibold text-green-900">Posture Improved by 12%</p>
              <p className="text-sm text-green-700 mt-1">
                Great work! Your form has been consistently better this week.
              </p>
            </div>

            <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
              <p className="font-semibold text-blue-900">Rep Count Up 15%</p>
              <p className="text-sm text-blue-700 mt-1">
                You're building strength! Keep pushing.
              </p>
            </div>

            <div className="p-4 bg-orange-50 border-l-4 border-orange-600 rounded">
              <p className="font-semibold text-orange-900">Best Day: Saturday</p>
              <p className="text-sm text-orange-700 mt-1">
                You performed best on Saturday with 67 reps. Try to maintain consistency.
              </p>
            </div>

            <div className="p-4 bg-purple-50 border-l-4 border-purple-600 rounded">
              <p className="font-semibold text-purple-900">Consistency Score: 86%</p>
              <p className="text-sm text-purple-700 mt-1">
                Excellent consistency! You're following your routine well.
              </p>
            </div>
          </div>
        </div>

        {/* Exercise Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Exercise Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(stats?.exerciseBreakdown || {}).map(([exercise, count]) => (
              <div key={exercise} className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">
                  {exercise.toUpperCase().replace('_', ' ')}
                </p>
                <p className="text-2xl font-bold text-blue-600">{count}</p>
                <p className="text-xs text-gray-500 mt-1">workouts</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
