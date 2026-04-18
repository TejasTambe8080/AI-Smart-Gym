// Dashboard Page Component - Shows stats and workout history
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutService } from '../services/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchStats();
  }, [period]);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await workoutService.getStats(period);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const response = await workoutService.getWorkouts({ limit: 50 });
      setWorkouts(response.data.workouts || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setWorkouts([]);
    }
  };

  // Generate chart data from workouts by date
  const generateChartData = () => {
    if (!workouts || workouts.length === 0) {
      return [];
    }

    // Group workouts by date
    const workoutsByDate = {};
    workouts.forEach((workout) => {
      const date = new Date(workout.date);
      const dateKey = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      if (!workoutsByDate[dateKey]) {
        workoutsByDate[dateKey] = {
          name: dateKey,
          reps: 0,
          duration: 0,
          workouts: 0,
        };
      }
      workoutsByDate[dateKey].reps += workout.reps || 0;
      workoutsByDate[dateKey].duration += (workout.duration || 0) / 60; // Convert to minutes
      workoutsByDate[dateKey].workouts += 1;
    });

    // Return last 7 days
    return Object.values(workoutsByDate).slice(-7);
  };

  const chartData = generateChartData();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const startWorkout = () => {
    navigate('/workout');
  };

  const pieData = Object.entries(stats?.exerciseBreakdown || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">💪 AI Smart Gym</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
          </div>
          <div className="flex gap-4">
            <button onClick={startWorkout} className="btn-primary">
              Start Workout
            </button>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Total Workouts</p>
                <p className="text-4xl font-bold text-blue-600">{stats?.totalWorkouts || 0}</p>
              </div>
              <div className="text-5xl">📋</div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Total Reps</p>
                <p className="text-4xl font-bold text-green-600">{stats?.totalReps || 0}</p>
              </div>
              <div className="text-5xl">🔢</div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Avg Posture</p>
                <p className="text-4xl font-bold text-orange-600">
                  {stats?.averagePostureScore || 0}%
                </p>
              </div>
              <div className="text-5xl">🧘</div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-2">Calories Burned</p>
                <p className="text-4xl font-bold text-red-600">{stats?.totalCalories || 0}</p>
              </div>
              <div className="text-5xl">🔥</div>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setPeriod('day')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                period === 'day'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                period === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                period === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Line Chart - Reps & Duration */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Workout Progress</h2>
            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="reps" stroke="#3B82F6" strokeWidth={2} />
                  <Line
                    type="monotone"
                    dataKey="duration"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">No workout data yet. Start your first workout!</p>
              </div>
            )}
          </div>

          {/* Pie Chart - Exercise Breakdown */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Exercise Distribution</h2>
            {pieData && pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">No exercise data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Workouts */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Recent Workouts</h2>
          {workouts && workouts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Exercise</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Reps</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Posture</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((workout) => (
                    <tr key={workout._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {new Date(workout.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-semibold capitalize">{workout.exerciseType}</td>
                      <td className="py-3 px-4">{workout.reps}</td>
                      <td className="py-3 px-4">{Math.round(workout.duration / 60)}m</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-sm font-semibold ${
                            workout.postureScore >= 80
                              ? 'bg-green-100 text-green-800'
                              : workout.postureScore >= 60
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {workout.postureScore}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No workouts yet</p>
              <button
                onClick={startWorkout}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Start Your First Workout
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
