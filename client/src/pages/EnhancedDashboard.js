// Enhanced Dashboard with AI Insights & Injury Detection
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutService } from '../services/api';
import InsightsCard from '../components/InsightsCard';
import InjuryRiskAlert from '../components/InjuryRiskAlert';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const EnhancedDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState(null);
  const [injuryRisk, setInjuryRisk] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [statsRes, workoutsRes] = await Promise.all([
        workoutService.getStats('week'),
        workoutService.getWorkouts({ limit: 5 })
      ]);

      setStats(statsRes.data);
      setWorkouts(workoutsRes.data.workouts || []);

      // Fetch AI insights
      fetchInsights();
      fetchInjuryRisk();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      setInsightsLoading(true);
      const response = await fetch('/api/insights/performance', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInsights(data.data);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setInsightsLoading(false);
    }
  };

  const fetchInjuryRisk = async () => {
    try {
      const response = await fetch('/api/insights/injury-risk', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInjuryRisk(data.data);
      }
    } catch (error) {
      console.error('Error fetching injury risk:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl font-bold text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const statsData = stats?.stats || {};

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user.name}</p>
          </div>
          <button
            onClick={() => navigate('/workout')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            + Start Workout
          </button>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Workouts</p>
                <p className="text-3xl font-bold text-white mt-2">{statsData.totalWorkouts || 0}</p>
              </div>
              <span className="text-4xl">💪</span>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Streak</p>
                <p className="text-3xl font-bold text-green-400 mt-2">{statsData.currentStreak || 0} days</p>
              </div>
              <span className="text-4xl">🔥</span>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Level</p>
                <p className="text-3xl font-bold text-purple-400 mt-2">{statsData.level || 1}</p>
              </div>
              <span className="text-4xl">⭐</span>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Form Score</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">{statsData.averagePostureScore || 0}%</p>
              </div>
              <span className="text-4xl">🎯</span>
            </div>
          </div>
        </div>

        {/* AI Performance Insights Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">🧠 AI Performance Insights</h2>
            <button
              onClick={fetchInsights}
              className="text-sm text-blue-400 hover:text-blue-300"
              disabled={insightsLoading}
            >
              {insightsLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {insights && insights.insights ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {insights.insights.slice(0, 4).map((insight, idx) => (
                <InsightsCard key={idx} insight={insight} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
              <p className="text-gray-400">Complete more workouts to get personalized insights</p>
            </div>
          )}
        </div>

        {/* Injury Risk Detection Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">🏥 Form Safety Analysis</h2>
          {injuryRisk ? (
            <InjuryRiskAlert riskData={injuryRisk} />
          ) : (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
              <p className="text-gray-400">Analyzing your form...</p>
            </div>
          )}
        </div>

        {/* Weekly Progress */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Weekly Progress</h3>
          {statsData.weeklyProgress && (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Workouts completed</span>
                  <span className="text-white font-bold">
                    {statsData.weeklyProgress.completed}/{statsData.weeklyProgress.goal}
                  </span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ width: `${Math.min(statsData.weeklyProgress.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-2xl">{statsData.weeklyProgress.percentage}%</span>
            </div>
          )}
        </div>

        {/* Recent Workouts */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Recent Workouts</h3>
          {workouts.length > 0 ? (
            <div className="space-y-3">
              {workouts.map(workout => (
                <div
                  key={workout._id}
                  className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                >
                  <div>
                    <p className="text-white font-semibold capitalize">{workout.exerciseType}</p>
                    <p className="text-gray-400 text-sm">
                      {workout.reps} reps × {workout.sets} sets
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">{workout.postureScore}% Form</p>
                    <p className="text-gray-400 text-sm">{Math.round(workout.duration / 60)} min</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">No workouts yet. Start with your first session!</p>
          )}
        </div>

        {/* Weak Muscles if any */}
        {statsData.weakMuscles && statsData.weakMuscles.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">💪 Muscle Groups to Focus On</h3>
            <div className="flex flex-wrap gap-2">
              {statsData.weakMuscles.map((muscle, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-sm"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDashboard;
