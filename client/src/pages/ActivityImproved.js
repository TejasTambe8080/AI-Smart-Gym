// Activity Page Component - Modern Design
import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ActivityImproved = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [activities, setActivities] = useState([
    { id: 1, date: '2024-01-15', exercise: 'Chest Press', reps: 12, duration: '45 min', posture: 92, calories: 245 },
    { id: 2, date: '2024-01-14', exercise: 'Squats', reps: 15, duration: '35 min', posture: 88, calories: 210 },
    { id: 3, date: '2024-01-13', exercise: 'Deadlifts', reps: 10, duration: '40 min', posture: 85, calories: 280 },
    { id: 4, date: '2024-01-12', exercise: 'Bench Press', reps: 8, duration: '50 min', posture: 90, calories: 260 },
    { id: 5, date: '2024-01-11', exercise: 'Pull-ups', reps: 20, duration: '30 min', posture: 87, calories: 190 },
  ]);

  const [chartData] = useState([
    { date: 'Mon', reps: 45, duration: 45, posture: 85 },
    { date: 'Tue', reps: 52, duration: 50, posture: 87 },
    { date: 'Wed', reps: 38, duration: 40, posture: 82 },
    { date: 'Thu', reps: 60, duration: 55, posture: 90 },
    { date: 'Fri', reps: 55, duration: 48, posture: 88 },
    { date: 'Sat', reps: 48, duration: 42, posture: 85 },
    { date: 'Sun', reps: 35, duration: 35, posture: 80 },
  ]);

  const getExerciseIcon = (exercise) => {
    const icons = {
      'Chest Press': '🏋️',
      'Squats': '🦵',
      'Deadlifts': '💪',
      'Bench Press': '🏋️',
      'Pull-ups': '🤸',
    };
    return icons[exercise] || '🏃';
  };

  const getPostureColor = (posture) => {
    if (posture >= 85) return 'text-green-600 bg-green-50';
    if (posture >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Activity History</h1>
          <p className="text-gray-600">Track your workout progress and performance metrics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: '🏋️', label: 'Total Workouts', value: '42', change: '+3 this week' },
            { icon: '⏱️', label: 'Total Duration', value: '142h', change: '+12h this week' },
            { icon: '🧘', label: 'Avg Posture', value: '87%', change: '+2% improvement' },
            { icon: '🔥', label: 'Calories Burned', value: '5.2k', change: '+1.2k this week' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">{stat.icon}</div>
                <span className="text-green-500 text-sm font-bold">📈</span>
              </div>
              <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-3 mb-8 bg-white rounded-2xl shadow-lg p-4 w-fit">
          {['day', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2 rounded-lg font-semibold capitalize transition ${
                timeRange === range
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Reps Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Reps Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="reps"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Duration Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">⏱️ Duration by Day</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="duration" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">🔄 Recent Workouts</h3>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition">
              View All
            </button>
          </div>

          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Date</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Exercise</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Reps</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Duration</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Posture</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Calories</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">{activity.date}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getExerciseIcon(activity.exercise)}</span>
                        <span className="font-semibold text-gray-900">{activity.exercise}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold">{activity.reps}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold">{activity.duration}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-4 py-2 rounded-lg font-bold ${getPostureColor(activity.posture)}`}>
                        {activity.posture}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold">{activity.calories}</span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                        📊 Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Personal Records */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[
            { label: 'Max Reps', value: '20', exercise: 'Pull-ups' },
            { label: 'Longest Session', value: '120 min', exercise: 'Full Body' },
            { label: 'Best Posture', value: '96%', exercise: 'Deadlifts' },
            { label: 'Most Calories', value: '450 cal', exercise: 'HIIT Training' },
          ].map((pr, idx) => (
            <div key={idx} className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
              <p className="text-purple-100 text-sm font-semibold mb-2">🏅 {pr.label}</p>
              <p className="text-4xl font-bold mb-1">{pr.value}</p>
              <p className="text-purple-200 text-sm">{pr.exercise}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityImproved;
