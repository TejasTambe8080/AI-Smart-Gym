// Activity/History Page - CRUD operations for workouts
import React, { useState, useEffect } from 'react';
import { workoutService } from '../services/api';

const Activity = () => {
  const [workouts, setWorkouts] = useState([]);
  const [filter, setFilter] = useState('week');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, [filter]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const response = await workoutService.getWorkouts({ 
        period: filter 
      });
      setWorkouts(response.data.workouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (workout) => {
    setEditingId(workout._id);
    setEditData({ ...workout });
  };

  const handleSave = async () => {
    try {
      await workoutService.updateWorkout(editingId, editData);
      setEditingId(null);
      fetchWorkouts();
    } catch (error) {
      console.error('Error updating workout:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this workout?')) {
      try {
        await workoutService.deleteWorkout(id);
        fetchWorkouts();
      } catch (error) {
        console.error('Error deleting workout:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">📋 Workout Activity</h1>

          {/* Filter Buttons */}
          <div className="flex gap-3">
            {['day', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setFilter(period)}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  filter === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Workouts List */}
        <div className="space-y-4">
          {workouts.length > 0 ? (
            workouts.map((workout) => (
              <div
                key={workout._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                {editingId === workout._id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Exercise Type</label>
                        <select
                          value={editData.exerciseType}
                          onChange={(e) =>
                            setEditData({ ...editData, exerciseType: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="squat">Squat</option>
                          <option value="pushup">Push-up</option>
                          <option value="pullup">Pull-up</option>
                          <option value="curls">Curls</option>
                          <option value="triceps">Triceps</option>
                          <option value="jumpingjacks">Jumping Jacks</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Reps</label>
                        <input
                          type="number"
                          value={editData.reps}
                          onChange={(e) => setEditData({ ...editData, reps: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Sets</label>
                        <input
                          type="number"
                          value={editData.sets}
                          onChange={(e) => setEditData({ ...editData, sets: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Duration (seconds)</label>
                        <input
                          type="number"
                          value={editData.duration}
                          onChange={(e) => setEditData({ ...editData, duration: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Posture Score</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editData.postureScore}
                          onChange={(e) =>
                            setEditData({ ...editData, postureScore: parseInt(e.target.value) })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Calories Burned</label>
                        <input
                          type="number"
                          value={editData.caloriesBurned}
                          onChange={(e) =>
                            setEditData({ ...editData, caloriesBurned: parseInt(e.target.value) })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Notes</label>
                      <textarea
                        value={editData.notes || ''}
                        onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {workout.exerciseType.toUpperCase().replace('_', ' ')}
                        </h3>
                        <p className="text-gray-600">{formatDate(workout.date)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(workout)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(workout._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-sm">Reps</p>
                        <p className="text-2xl font-bold text-blue-600">{workout.reps}</p>
                      </div>

                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-sm">Sets</p>
                        <p className="text-2xl font-bold text-green-600">{workout.sets}</p>
                      </div>

                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-sm">Duration</p>
                        <p className="text-2xl font-bold text-yellow-600">{formatTime(workout.duration)}</p>
                      </div>

                      <div className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-sm">Posture</p>
                        <p className="text-2xl font-bold text-orange-600">{workout.postureScore}%</p>
                      </div>

                      <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-gray-600 text-sm">Calories</p>
                        <p className="text-2xl font-bold text-red-600">{workout.caloriesBurned}</p>
                      </div>
                    </div>

                    {workout.notes && (
                      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-700">{workout.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-xl text-gray-600">No workouts found for this period</p>
              <p className="text-gray-500 mt-2">Start a workout to see it here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity;
