// Premium AI Workout Planner - Generate Weekly Plans with Gemini
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authService } from '../services/api';

const AIWorkoutPlanner = () => {
  const [user, setUser] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const user_data = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const generateWorkoutPlan = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const prompt = `Generate a detailed 7-day workout plan for someone with these details:
Goal: ${user.fitnessGoal || 'General Fitness'}
Weight: ${user.weight || 70}kg
Height: ${user.height || 170}cm
Experience: Beginner to Intermediate

For EACH day, provide:
- Day name
- Focus muscle groups
- 4-5 exercises with:
  - Exercise name
  - Sets x Reps
  - Rest time
  - Tips
- Total duration

Format as JSON:
{
  "weeklyPlan": [
    {
      "day": "Monday",
      "focus": "Chest & Triceps",
      "duration": "45 mins",
      "exercises": [
        {"name": "Bench Press", "sets": "4x8", "rest": "90 sec", "tips": "..."}
      ]
    }
  ],
  "summary": "...",
  "tips": ["..."]
}`;

      const response = await axios.post('http://localhost:5000/api/ai/generate-workout', {
        query: prompt
      });

      if (response.data.success && response.data.reply) {
        try {
          const planData = JSON.parse(response.data.reply);
          setWorkoutPlan(planData);
          if (planData.weeklyPlan && planData.weeklyPlan.length > 0) {
            setSelectedDay(planData.weeklyPlan[0]);
          }
        } catch (e) {
          console.error('Error parsing AI response:', e);
          // Fallback: create a sample plan structure
          setWorkoutPlan({
            weeklyPlan: generateSamplePlan(),
            summary: response.data.reply
          });
        }
      }
    } catch (error) {
      console.error('Error generating workout plan:', error);
      setWorkoutPlan({ weeklyPlan: generateSamplePlan() });
    } finally {
      setLoading(false);
    }
  };

  const generateSamplePlan = () => {
    return [
      {
        day: 'Monday',
        focus: 'Chest & Triceps',
        duration: '45 mins',
        exercises: [
          { name: 'Bench Press', sets: '4x8', rest: '90 sec', tips: 'Control the weight on the way down' },
          { name: 'Incline Dumbbell Press', sets: '3x10', rest: '60 sec', tips: 'Engage core throughout' },
          { name: 'Dips', sets: '3x8', rest: '60 sec', tips: 'Keep torso upright' },
          { name: 'Tricep Pushdowns', sets: '3x12', rest: '45 sec', tips: 'Full range of motion' }
        ]
      },
      {
        day: 'Tuesday',
        focus: 'Back & Biceps',
        duration: '50 mins',
        exercises: [
          { name: 'Deadlifts', sets: '4x6', rest: '120 sec', tips: 'Keep back straight' },
          { name: 'Bent Over Rows', sets: '4x8', rest: '90 sec', tips: 'Squeeze shoulder blades' },
          { name: 'Pull-ups', sets: '3x6', rest: '90 sec', tips: 'Chest to bar' },
          { name: 'Barbell Curls', sets: '3x10', rest: '60 sec', tips: 'No swing' }
        ]
      },
      {
        day: 'Wednesday',
        focus: 'Rest & Recovery',
        duration: 'Light Activity',
        exercises: [
          { name: 'Stretching', sets: '20 mins', rest: '—', tips: 'Hold each stretch 30 seconds' },
          { name: 'Light Walk', sets: '30 mins', rest: '—', tips: 'Easy pace' },
          { name: 'Yoga', sets: 'Optional', rest: '—', tips: 'Focus on mobility' }
        ]
      },
      {
        day: 'Thursday',
        focus: 'Shoulders & Legs',
        duration: '60 mins',
        exercises: [
          { name: 'Squats', sets: '4x8', rest: '120 sec', tips: 'Deep, controlled reps' },
          { name: 'Leg Press', sets: '3x10', rest: '90 sec', tips: 'Full range of motion' },
          { name: 'Overhead Press', sets: '4x8', rest: '90 sec', tips: 'Strict form' },
          { name: 'Lateral Raises', sets: '3x12', rest: '45 sec', tips: 'Light weight, high reps' }
        ]
      },
      {
        day: 'Friday',
        focus: 'Full Body Power',
        duration: '55 mins',
        exercises: [
          { name: 'Power Cleans', sets: '5x3', rest: '120 sec', tips: 'Explosive movement' },
          { name: 'Front Squats', sets: '3x6', rest: '90 sec', tips: 'Keep elbows up' },
          { name: 'Bench Press', sets: '3x6', rest: '90 sec', tips: 'Maximum weight' },
          { name: 'Rows', sets: '3x8', rest: '90 sec', tips: 'Explosive concentric' }
        ]
      },
      {
        day: 'Saturday',
        focus: 'Cardio & Conditioning',
        duration: '40 mins',
        exercises: [
          { name: 'Running', sets: '20 mins', rest: '—', tips: 'Moderate pace' },
          { name: 'Battle Ropes', sets: '3x30 sec', rest: '30 sec', tips: 'High intensity' },
          { name: 'Box Jumps', sets: '3x8', rest: '60 sec', tips: 'Explosive' }
        ]
      },
      {
        day: 'Sunday',
        focus: 'Active Recovery',
        duration: 'Flexible',
        exercises: [
          { name: 'Light Stretching', sets: '20 mins', rest: '—', tips: 'Relaxed pace' },
          { name: 'Swimming', sets: '30 mins', rest: '—', tips: 'Easy laps' },
          { name: 'Meditation', sets: '10 mins', rest: '—', tips: 'Focus on breathing' }
        ]
      }
    ];
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 flex items-center gap-3">
            🤖 AI Workout Planner
          </h1>
          <p className="text-slate-400 text-lg">Generate your personalized weekly workout plan powered by AI</p>
        </div>

        {!workoutPlan ? (
          /* Generate Plan CTA */
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 sm:p-12 text-center shadow-xl">
            <div className="mb-6">
              <div className="text-6xl mb-4">🗓️</div>
              <h2 className="text-3xl font-bold text-white mb-3">Create Your AI Workout Plan</h2>
              <p className="text-slate-400 text-lg mb-8">
                Get a personalized 7-day workout plan tailored to your fitness goal and experience level.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 rounded-lg border border-blue-500/20">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold text-white mb-2">Personalized</h3>
                <p className="text-sm text-slate-400">Based on your goal and experience</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-4 rounded-lg border border-purple-500/20">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold text-white mb-2">Detailed</h3>
                <p className="text-sm text-slate-400">Sets, reps, rest times included</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-4 rounded-lg border border-green-500/20">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-white mb-2">Optimized</h3>
                <p className="text-sm text-slate-400">Balanced training throughout the week</p>
              </div>
            </div>

            <button
              onClick={generateWorkoutPlan}
              disabled={loading}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                loading
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/50 transform hover:scale-105'
              }`}
            >
              {loading ? '⏳ Generating Your Plan...' : '✨ Generate My Workout Plan'}
            </button>
          </div>
        ) : (
          /* Display Workout Plan */
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 bg-slate-800/50 p-2 rounded-xl backdrop-blur-sm border border-slate-700">
              {['overview', 'weekly'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {tab === 'overview' ? '📋 Overview' : '📅 Weekly Plan'}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold text-white mb-4">Your Weekly Overview</h2>
                  <p className="text-slate-300 mb-6">{workoutPlan.summary || 'Follow this plan for best results!'}</p>

                  <div className="grid md:grid-cols-7 gap-2">
                    {workoutPlan.weeklyPlan?.map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedDay(day);
                          setActiveTab('weekly');
                        }}
                        className="p-3 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 hover:border-blue-500 transition-all text-center group"
                      >
                        <div className="text-xs font-semibold text-slate-300 group-hover:text-blue-400 transition">{days[idx]}</div>
                        <div className="text-2xl my-2">
                          {idx === 2 || idx === 6 ? '💤' : '🏋️'}
                        </div>
                        <div className="text-xs text-slate-400">{day.duration}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tips Section */}
                {workoutPlan.tips && (
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-green-300 mb-4">💡 Pro Tips</h3>
                    <ul className="space-y-2">
                      {workoutPlan.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-300">
                          <span className="text-green-400 mt-1">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Weekly Tab */}
            {activeTab === 'weekly' && selectedDay && (
              <div className="space-y-6">
                {/* Day Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                  <h2 className="text-3xl font-bold mb-2">{selectedDay.day}</h2>
                  <p className="text-blue-100 text-lg">Focus: {selectedDay.focus}</p>
                  <p className="text-blue-100">Duration: {selectedDay.duration}</p>
                </div>

                {/* Exercises */}
                <div className="space-y-4">
                  {selectedDay.exercises?.map((exercise, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">{idx + 1}. {exercise.name}</h3>
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">Sets × Reps:</span>
                              <span className="text-blue-400 font-bold">{exercise.sets}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">Rest:</span>
                              <span className="text-purple-400 font-bold">{exercise.rest}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-700/30 rounded-lg p-4 border-l-4 border-green-500">
                        <p className="text-slate-300">
                          <span className="text-green-400 font-semibold">Tip: </span>
                          {exercise.tips}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const currentIdx = workoutPlan.weeklyPlan.indexOf(selectedDay);
                      if (currentIdx > 0) {
                        setSelectedDay(workoutPlan.weeklyPlan[currentIdx - 1]);
                      }
                    }}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
                  >
                    ← Previous Day
                  </button>
                  <button
                    onClick={() => {
                      const currentIdx = workoutPlan.weeklyPlan.indexOf(selectedDay);
                      if (currentIdx < workoutPlan.weeklyPlan.length - 1) {
                        setSelectedDay(workoutPlan.weeklyPlan[currentIdx + 1]);
                      }
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                  >
                    Next Day →
                  </button>
                </div>
              </div>
            )}

            {/* Generate New Plan */}
            <button
              onClick={() => setWorkoutPlan(null)}
              className="w-full px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white rounded-lg font-semibold transition-all"
            >
              Generate New Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIWorkoutPlanner;
