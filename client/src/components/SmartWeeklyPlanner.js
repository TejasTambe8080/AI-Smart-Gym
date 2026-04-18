// Smart Weekly Planner - Displays AI-generated weekly workout plan
import React, { useState, useEffect } from 'react';

const SmartWeeklyPlanner = () => {
  const [weeklyPlan, setWeeklyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    fetchWeeklyPlan();
  }, []);

  const fetchWeeklyPlan = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/weekly-plan', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWeeklyPlan(data.data);
        // Select first training day
        const firstTrainingDay = data.data.weeklyPlan.find(day => day.exercises.length > 0);
        if (firstTrainingDay) {
          setSelectedDay(firstTrainingDay);
        }
      }
    } catch (error) {
      console.error('Error fetching weekly plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
        <p className="text-gray-400">Loading your personalized plan...</p>
      </div>
    );
  }

  if (!weeklyPlan || !weeklyPlan.weeklyPlan) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
        <p className="text-gray-400">Unable to generate plan. Try completing more workouts first.</p>
      </div>
    );
  }

  const daysOfWeek = weeklyPlan.weeklyPlan || [];

  return (
    <div className="space-y-6">
      {/* Plan Summary */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-blue-300 mb-2">📅 Your Personalized Weekly Plan</h3>
        <p className="text-gray-300 mb-4">{weeklyPlan.totalWeeklyWorkouts} workouts scheduled this week</p>
        {weeklyPlan.focusAreas && weeklyPlan.focusAreas.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-gray-400">Focus areas:</span>
            {weeklyPlan.focusAreas.map((area, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-300 text-sm"
              >
                {area}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {daysOfWeek.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedDay(day)}
            className={`p-3 rounded-lg text-center transition-all ${
              day.exercises.length === 0
                ? 'bg-slate-700 text-gray-400 cursor-default'
                : selectedDay?.dayIdx === day.dayIdx
                ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
            disabled={day.exercises.length === 0}
          >
            <p className="text-xs font-semibold">{day.day}</p>
            <p className="text-xs mt-1">
              {day.exercises.length === 0 ? 'Rest' : `${day.exercises.length} ex`}
            </p>
          </button>
        ))}
      </div>

      {/* Selected Day Details */}
      {selectedDay && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-2xl font-bold text-white">{selectedDay.day}</h4>
              <p className="text-gray-400 text-sm">{selectedDay.focus}</p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                selectedDay.intensity === 'rest'
                  ? 'bg-green-500/20 text-green-400'
                  : selectedDay.intensity === 'light'
                  ? 'bg-blue-500/20 text-blue-400'
                  : selectedDay.intensity === 'moderate'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {selectedDay.intensity.charAt(0).toUpperCase() + selectedDay.intensity.slice(1)}
            </div>
          </div>

          {selectedDay.exercises.length > 0 ? (
            <div className="space-y-3">
              {/* Exercises List */}
              <div>
                <h5 className="text-sm font-semibold text-gray-300 mb-3">Exercises</h5>
                <div className="space-y-2">
                  {selectedDay.exercises.map((ex, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-semibold">{ex.name}</p>
                        <p className="text-xs text-gray-400">{ex.reps}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Rest: {ex.restSeconds}s</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workout Info */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700">
                <div className="bg-blue-500/10 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Est. Duration</p>
                  <p className="text-lg font-bold text-blue-400">{selectedDay.estimatedDuration} min</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Exercises</p>
                  <p className="text-lg font-bold text-purple-400">{selectedDay.exercises.length}</p>
                </div>
              </div>

              {/* Tips */}
              {selectedDay.tips && selectedDay.tips.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <h5 className="text-sm font-semibold text-gray-300 mb-2">💡 Tips</h5>
                  <ul className="space-y-1">
                    {selectedDay.tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-xs text-blue-400">→</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">😴</p>
              <p className="text-gray-400">Rest day - let your muscles recover!</p>
              <div className="mt-4 space-y-2 text-left bg-slate-700/50 rounded p-4">
                {selectedDay.tips && selectedDay.tips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-green-400">→</span>
                    <span className="text-gray-300">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {weeklyPlan.recommendations && weeklyPlan.recommendations.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
          <h4 className="text-lg font-bold text-yellow-300 mb-3">📋 Recommendations</h4>
          <div className="space-y-2">
            {weeklyPlan.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-yellow-400 mt-0.5">→</span>
                <div>
                  <p className="text-sm font-semibold text-yellow-300">{rec.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={fetchWeeklyPlan}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
      >
        Regenerate Plan
      </button>
    </div>
  );
};

export default SmartWeeklyPlanner;
