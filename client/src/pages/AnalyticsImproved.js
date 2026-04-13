// Analytics Page Component - Modern Design
import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

const AnalyticsImproved = () => {
  const [view, setView] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');

  // Sample data
  const weeklyData = [
    { name: 'Mon', workouts: 2, reps: 45, duration: 45 },
    { name: 'Tue', workouts: 2, reps: 52, duration: 50 },
    { name: 'Wed', workouts: 1, reps: 38, duration: 40 },
    { name: 'Thu', workouts: 3, reps: 60, duration: 55 },
    { name: 'Fri', workouts: 2, reps: 55, duration: 48 },
    { name: 'Sat', workouts: 2, reps: 48, duration: 42 },
    { name: 'Sun', workouts: 1, reps: 35, duration: 35 },
  ];

  const exerciseData = [
    { name: 'Chest Press', value: 28, color: '#3b82f6' },
    { name: 'Squats', value: 24, color: '#10b981' },
    { name: 'Deadlifts', value: 18, color: '#f59e0b' },
    { name: 'Bench Press', value: 16, color: '#ef4444' },
    { name: 'Pull-ups', value: 14, color: '#8b5cf6' },
  ];

  const progressData = [
    { week: 'Week 1', posture: 78, strength: 65, endurance: 72 },
    { week: 'Week 2', posture: 81, strength: 70, endurance: 75 },
    { week: 'Week 3', posture: 85, strength: 75, endurance: 80 },
    { week: 'Week 4', posture: 87, strength: 80, endurance: 85 },
  ];

  const performanceData = [
    { reps: 10, duration: 20, posture: 85 },
    { reps: 15, duration: 25, posture: 88 },
    { reps: 12, duration: 22, posture: 82 },
    { reps: 18, duration: 30, posture: 90 },
    { reps: 20, duration: 35, posture: 92 },
    { reps: 16, duration: 28, posture: 87 },
    { reps: 22, duration: 38, posture: 91 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Advanced Analytics</h1>
          <p className="text-gray-600">Detailed insights into your fitness performance</p>
        </div>

        {/* View & Time Range Selector */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex gap-2 bg-white rounded-2xl shadow-lg p-4">
            {['overview', 'exercises', 'progress', 'performance'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-6 py-2 rounded-lg font-semibold capitalize transition ${
                  view === v
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {v === 'overview' && '👁️'} {v === 'exercises' && '🏋️'} {v === 'progress' && '📈'} {v === 'performance' && '⚡'} {v}
              </button>
            ))}
          </div>

          <div className="flex gap-2 bg-white rounded-2xl shadow-lg p-4">
            {['week', 'month', 'year'].map((range) => (
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
        </div>

        {/* Overview View */}
        {view === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '💪', label: 'Total Workouts', value: '42', trend: '+3 (7%)' },
                { icon: '🔢', label: 'Total Reps', value: '1.2k', trend: '+150 (14%)' },
                { icon: '🧘', label: 'Avg Posture', value: '87%', trend: '+5% (6%)' },
                { icon: '🔥', label: 'Calories', value: '5.2k', trend: '+1.2k (30%)' },
              ].map((metric, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{metric.icon}</span>
                    <span className="text-green-500 text-sm font-bold">📈</span>
                  </div>
                  <p className="text-gray-600 text-sm font-semibold">{metric.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{metric.value}</p>
                  <p className="text-xs text-green-600 font-semibold mt-2">{metric.trend}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Workouts & Reps */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Weekly Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="workouts" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="reps" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Duration by Day */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">⏱️ Duration Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="duration" fill="#8b5cf6" stroke="#8b5cf6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Exercises View */}
        {view === 'exercises' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Exercises Pie */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🏋️ Most Practiced Exercises</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={exerciseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {exerciseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Exercise Frequency */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Exercise Frequency</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={exerciseData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Exercise Stats Table */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💪 Detailed Exercise Stats</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-bold text-gray-900">Exercise</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900">Times Done</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900">Avg Reps</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900">Best Reps</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900">Avg Posture</th>
                      <th className="text-left py-4 px-4 font-bold text-gray-900">Total Calories</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exerciseData.map((exercise, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-4 px-4 font-semibold text-gray-900">{exercise.name}</td>
                        <td className="py-4 px-4 text-gray-700">{Math.floor(Math.random() * 30) + 10}</td>
                        <td className="py-4 px-4 text-gray-700">{Math.floor(Math.random() * 15) + 5}</td>
                        <td className="py-4 px-4"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-bold">{Math.floor(Math.random() * 25) + 15}</span></td>
                        <td className="py-4 px-4"><span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-bold">{Math.floor(Math.random() * 15) + 80}%</span></td>
                        <td className="py-4 px-4 text-gray-700 font-bold">{Math.floor(Math.random() * 300) + 200}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Progress View */}
        {view === 'progress' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📈 4-Week Progress</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="posture" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6 }} />
                  <Line type="monotone" dataKey="strength" stroke="#ef4444" strokeWidth={3} dot={{ r: 6 }} />
                  <Line type="monotone" dataKey="endurance" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Posture Improvement', current: 87, previous: 78, change: '+9%', color: 'from-yellow-400 to-yellow-600' },
                { label: 'Strength Gain', current: 80, previous: 65, change: '+15%', color: 'from-red-400 to-red-600' },
                { label: 'Endurance Build', current: 85, previous: 72, change: '+13%', color: 'from-green-400 to-green-600' },
              ].map((prog, idx) => (
                <div key={idx} className={`bg-gradient-to-br ${prog.color} rounded-2xl shadow-lg p-6 text-white`}>
                  <p className="text-white/80 text-sm font-semibold mb-2">{prog.label}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-4xl font-bold">{prog.current}</p>
                      <p className="text-white/60 text-sm">Current: {prog.current}</p>
                    </div>
                    <span className="text-4xl">📈</span>
                  </div>
                  <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white/70 rounded-full" style={{ width: `${prog.current}%` }}></div>
                  </div>
                  <p className="text-white/90 text-sm font-bold mt-3">Previous: {prog.previous} {prog.change}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance View */}
        {view === 'performance' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">⚡ Reps vs Duration vs Posture</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis dataKey="reps" name="Reps" />
                  <YAxis dataKey="duration" name="Duration (min)" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Workouts" data={performanceData} fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '🎯', label: 'Best Day', value: 'Thursday', detail: '3 workouts' },
                { icon: '⏱️', label: 'Avg Session', value: '45 min', detail: 'Optimal duration' },
                { icon: '🧘', label: 'Posture Peak', value: '92%', detail: 'Best form day' },
                { icon: '💯', label: 'Consistency', value: '85%', detail: 'Off only 2 days' },
              ].map((metric, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg p-6">
                  <span className="text-4xl mb-2 block">{metric.icon}</span>
                  <p className="text-gray-600 text-sm font-semibold mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-xs text-gray-500 mt-2">{metric.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsImproved;
