// Activity Page Component - Shows real workout history
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ActivityImproved = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, [timeRange]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/workouts', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.workouts) {
        const formattedActivities = response.data.workouts.map((w, idx) => ({
          id: idx + 1,
          date: new Date(w.date).toLocaleDateString(),
          exercise: w.exerciseType?.replace('_', ' ').toUpperCase(),
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
    if (posture >= 85) return 'text-green-600 bg-green-50';
    if (posture >= 75) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading workout history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
        <div className="text-center">
          <p className="text-lg text-red-600">{error}</p>
          <button
            onClick={fetchActivities}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Workout History</h1>
          <p className="text-gray-600">View all your completed workouts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm">Total Workouts</p>
            <p className="text-3xl font-bold text-gray-900">{activities.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm">Total Duration</p>
            <p className="text-3xl font-bold text-gray-900">
              {activities.reduce((sum, a) => sum + parseInt(a.duration), 0)} min
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm">Avg Posture</p>
            <p className="text-3xl font-bold text-gray-900">
              {activities.length > 0
                ? Math.round(activities.reduce((sum, a) => sum + a.posture, 0) / activities.length)
                : 0}%
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <p className="text-gray-600 text-sm">Total Calories</p>
            <p className="text-3xl font-bold text-gray-900">
              {activities.reduce((sum, a) => sum + a.calories, 0)}
            </p>
          </div>
        </div>

        {/* Workouts List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Recent Workouts</h3>
          </div>
          {activities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Exercise</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reps</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Duration</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Posture</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span>{getExerciseIcon(activity.exercise)}</span>
                          <span className="font-semibold text-gray-900">{activity.exercise}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{activity.date}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{activity.reps}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{activity.duration}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full font-semibold text-sm ${getPostureColor(activity.posture)}`}>
                          {activity.posture}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{activity.calories}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No workouts yet. Start your first workout!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityImproved;
