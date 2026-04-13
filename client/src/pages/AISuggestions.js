// AI Suggestions Page
import React, { useState, useEffect } from 'react';
import { workoutService } from '../services/api';

const AISuggestions = () => {
  const [workouts, setWorkouts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAndAnalyze();
  }, []);

  const fetchAndAnalyze = async () => {
    try {
      setLoading(true);
      const response = await workoutService.getWorkouts({ limit: 20 });
      setWorkouts(response.data.workouts);
      generateSuggestions(response.data.workouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = (workoutList) => {
    const suggestionsArray = [];

    // Analyze posture scores
    const avgPosture =
      workoutList.reduce((sum, w) => sum + w.postureScore, 0) / workoutList.length;

    if (avgPosture < 70) {
      suggestionsArray.push({
        type: 'posture',
        priority: 'high',
        title: 'Improve Your Form',
        description: `Your average posture score is ${Math.round(avgPosture)}%. Focus on these corrections:`,
        tips: [
          'Keep your back straight - avoid leaning forward',
          'Align your knees over your toes',
          'Keep shoulders level and engaged',
          'Engage your core throughout the movement',
        ],
      });
    }

    // Analyze rep consistency
    const repCounts = workoutList.map((w) => w.reps);
    const avgReps = repCounts.reduce((a, b) => a + b, 0) / repCounts.length;
    const variance =
      Math.sqrt(repCounts.reduce((sum, r) => sum + Math.pow(r - avgReps, 2), 0) / repCounts.length);

    if (variance > 20) {
      suggestionsArray.push({
        type: 'consistency',
        priority: 'medium',
        title: 'Build Consistency',
        description: `Your rep count varies significantly. You're averaging ${Math.round(avgReps)} reps with high variance.`,
        tips: [
          'Set a target and stick to it',
          'Take consistent rest periods between sets',
          'Maintain steady workout schedule',
          'Track progress daily',
        ],
      });
    }

    // Check for lack of variety
    const exerciseTypes = new Set(workoutList.map((w) => w.exerciseType));
    if (exerciseTypes.size < 3) {
      suggestionsArray.push({
        type: 'variety',
        priority: 'medium',
        title: 'Add Exercise Variety',
        description: `You're mainly doing ${Array.from(exerciseTypes).join(', ')}. Add more exercises to target different muscle groups.`,
        tips: [
          'Mix upper body and lower body exercises',
          'Include cardio workouts',
          'Try compound movements',
          'Balance pushing and pulling movements',
        ],
      });
    }

    // Check for inactivity
    if (workoutList.length === 0 || workoutList.length < 3) {
      suggestionsArray.push({
        type: 'frequency',
        priority: 'high',
        title: 'Increase Workout Frequency',
        description: 'You need to work out more consistently to see results.',
        tips: [
          'Aim for 4-5 workouts per week',
          'Set a consistent workout schedule',
          'Start with 20-30 minute sessions',
          'Gradually increase intensity',
        ],
      });
    }

    // Positive reinforcement
    if (avgPosture >= 80 && workoutList.length >= 5) {
      suggestionsArray.push({
        type: 'achievement',
        priority: 'low',
        title: 'Great Progress! 🌟',
        description: `Your posture score is excellent at ${Math.round(avgPosture)}%. Keep maintaining this form!`,
        tips: [
          'Challenge yourself with heavier weights',
          'Increase rep count gradually',
          'Try new variations of exercises',
          'Share your progress with others',
        ],
      });
    }

    setSuggestions(
      suggestionsArray.length > 0
        ? suggestionsArray
        : [
            {
              type: 'general',
              priority: 'low',
              title: 'Keep Training!',
              description: 'No specific recommendations yet. Continue your workout routine!',
              tips: ['Stay consistent', 'Keep challenging yourself', 'Listen to your body'],
            },
          ]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Analyzing your workouts...</div>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-green-500 bg-green-50';
    }
  };

  const getPriorityIcon = (type) => {
    const icons = {
      posture: '🧘',
      consistency: '📊',
      variety: '🎯',
      frequency: '⏰',
      achievement: '🌟',
      general: '💪',
    };
    return icons[type] || '💡';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🤖 AI Coach Suggestions</h1>
          <p className="text-gray-600">Personalized recommendations based on your performance</p>
        </div>

        {/* Suggestions */}
        <div className="space-y-6">
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className={`border-l-4 rounded-lg shadow-md p-6 ${getPriorityColor(suggestion.priority)}`}
            >
              {/* Title */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{getPriorityIcon(suggestion.type)}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{suggestion.title}</h2>
                  <p className="text-sm text-gray-600">{suggestion.description}</p>
                </div>
              </div>

              {/* Priority Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    suggestion.priority === 'high'
                      ? 'bg-red-200 text-red-800'
                      : suggestion.priority === 'medium'
                      ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-green-200 text-green-800'
                  }`}
                >
                  Priority: {suggestion.priority.toUpperCase()}
                </span>
              </div>

              {/* Tips */}
              <div className="bg-white bg-opacity-60 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Action Items:</h3>
                <ul className="space-y-2">
                  {suggestion.tips.map((tip, tipIdx) => (
                    <li key={tipIdx} className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-semibold text-blue-600">Posture Guide</h3>
              <p className="text-sm text-gray-600 mt-1">Learn proper form for each exercise</p>
            </div>

            <div className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-semibold text-blue-600">Workout Plans</h3>
              <p className="text-sm text-gray-600 mt-1">Get customized training programs</p>
            </div>

            <div className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-semibold text-blue-600">Nutrition Tips</h3>
              <p className="text-sm text-gray-600 mt-1">Optimize your diet for fitness goals</p>
            </div>

            <div className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h3 className="font-semibold text-blue-600">Recovery Guide</h3>
              <p className="text-sm text-gray-600 mt-1">Maximize rest and prevent injuries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;
