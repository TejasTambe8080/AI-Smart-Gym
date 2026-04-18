// Premium SaaS Dashboard - FormFix AI with Gamification (Connected to Real Data)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PremiumDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.response?.data?.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
            <p className="text-red-300 text-lg">{error || 'Failed to load dashboard'}</p>
            <button
              onClick={fetchStats}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
          <p className="text-xl font-semibold text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            💪 Welcome back, {user.name}!
          </h1>
          <p className="text-slate-400 text-lg">Your fitness journey continues...</p>
        </div>

        {/* CTA Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/workout')}
            className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            🏋️ Start Workout
          </button>
          <button
            onClick={() => navigate('/ai-workout')}
            className="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            🤖 AI Workout Plan
          </button>
          <button
            onClick={() => navigate('/posture')}
            className="px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            🧍 Check Posture
          </button>
        </div>

        {/* Gamification Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Streak & XP */}
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-400 text-sm uppercase tracking-wider">Current Streak</p>
                <h2 className="text-5xl font-bold text-orange-400 mt-2">{stats.currentStreak}🔥</h2>
                <p className="text-slate-400 mt-2">Days in a row!</p>
              </div>
              <div className="text-8xl opacity-50">🔥</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-300 text-sm mb-2">Longest streak: {stats.longestStreak} days</p>
              <div className="flex gap-2">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${Math.min(100, (stats.currentStreak / 30) * 100)}%` }}></div>
                </div>
                <span className="text-sm text-orange-400 font-bold">Keep going! 🎯</span>
              </div>
            </div>
          </div>

          {/* Level & XP */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-400 text-sm uppercase tracking-wider">Your Level</p>
                <h2 className="text-5xl font-bold text-purple-400 mt-2">LEVEL {stats.level}</h2>
                <p className="text-slate-400 mt-2">Fitness Elite</p>
              </div>
              <div className="text-8xl">🏆</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-slate-300 text-sm">Experience Points</span>
                <span className="text-purple-400 font-bold">{stats.totalXP} XP</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${((stats.totalXP % 1000) / 1000) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Next level in {1000 - (stats.totalXP % 1000)} XP</p>
            </div>
          </div>
        </div>

        {/* Achievements & Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Badges */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🏅 Achievements ({stats.badges?.length || 0})
            </h3>
            {stats.badges && stats.badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {stats.badges.map((badge, idx) => (
                  <div key={idx} className="bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-center hover:border-yellow-500 transition-all cursor-pointer">
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <p className="text-xs text-slate-300 line-clamp-2">{badge.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">Keep working to unlock badges! 🚀</p>
            )}
          </div>

          {/* Form Score */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              📊 Form Score
            </h3>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-8 border-slate-700"></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-green-500 transition-all"
                  style={{
                    borderRadius: '50%',
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((stats.averagePostureScore / 100) * 2 * Math.PI - Math.PI / 2)}% ${50 + 50 * Math.sin((stats.averagePostureScore / 100) * 2 * Math.PI - Math.PI / 2)}%)`
                  }}
                ></div>
                <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400">{stats.averagePostureScore}</div>
                    <div className="text-xs text-slate-400">Score</div>
                  </div>
                </div>
              </div>
              <p className="text-slate-300">{stats.averagePostureScore >= 80 ? 'Excellent form! 💪' : stats.averagePostureScore >= 60 ? 'Good form! 👍' : 'Keep improving! ⚡'}</p>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card: Total Workouts */}
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-xl p-6 hover:border-blue-500 transition-all">
            <p className="text-slate-400 text-sm uppercase tracking-wider">Total Workouts</p>
            <h3 className="text-4xl font-bold text-blue-400 mt-2">{stats.totalWorkouts}</h3>
            <p className="text-slate-400 text-sm mt-2">Tracked & Analyzed</p>
          </div>

          {/* Card: Total Duration */}
          <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-700/20 border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-500 transition-all">
            <p className="text-slate-400 text-sm uppercase tracking-wider">Time Trained</p>
            <h3 className="text-4xl font-bold text-cyan-400 mt-2">{stats.totalDuration}h</h3>
            <p className="text-slate-400 text-sm mt-2">Total hours</p>
          </div>

          {/* Card: Posture Score */}
          <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 border border-green-500/30 rounded-xl p-6 hover:border-green-500 transition-all">
            <p className="text-slate-400 text-sm uppercase tracking-wider">Avg Posture</p>
            <h3 className="text-4xl font-bold text-green-400 mt-2">{stats.averagePostureScore}%</h3>
            <p className="text-slate-400 text-sm mt-2">Form quality</p>
          </div>

          {/* Card: Calories Burned */}
          <div className="bg-gradient-to-br from-orange-600/20 to-orange-700/20 border border-orange-500/30 rounded-xl p-6 hover:border-orange-500 transition-all">
            <p className="text-slate-400 text-sm uppercase tracking-wider">Calories</p>
            <h3 className="text-4xl font-bold text-orange-400 mt-2">{stats.totalCalories.toLocaleString()}</h3>
            <p className="text-slate-400 text-sm mt-2">Total burned</p>
          </div>
        </div>

        {/* Weak Muscle Groups & Weekly Goal */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Weak Muscles */}
          <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              ⚠️ Weak Muscle Groups
            </h3>
            <p className="text-slate-400 mb-4">Focus on these areas to balance your training:</p>
            {stats.weakMuscles && stats.weakMuscles.length > 0 ? (
              <>
                <div className="space-y-3">
                  {stats.weakMuscles.map((item, idx) => (
                    <div key={idx} className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-3 hover:bg-slate-800 transition-all cursor-pointer">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-slate-300">{item.muscle}</span>
                      <span className="ml-auto text-sm text-slate-500">({item.frequency} workouts)</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/ai-workout')}
                  className="w-full mt-4 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg font-semibold transition-all"
                >
                  Get AI Plan
                </button>
              </>
            ) : (
              <p className="text-slate-400">Keep training to identify weak areas!</p>
            )}
          </div>

          {/* Weekly Goal */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🎯 Weekly Goal
            </h3>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Workouts Completed</span>
                <span className="text-blue-400 font-bold">{stats.weeklyProgress.completed} / {stats.weeklyProgress.goal}</span>
              </div>
              <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                  style={{ width: `${stats.weeklyProgress.percentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">{stats.weeklyProgress.percentage}% to goal</p>
            </div>
            <div className="space-y-2">
              {Array.from({ length: stats.weeklyProgress.goal }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {idx < stats.weeklyProgress.completed ? (
                    <span className="text-green-400">✓</span>
                  ) : (
                    <span className="text-slate-500">○</span>
                  )}
                  <span className="text-slate-400">Day {idx + 1}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/workout')}
              className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
            >
              Continue Training
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumDashboard;
