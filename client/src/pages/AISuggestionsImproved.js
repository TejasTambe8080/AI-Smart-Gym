// AI Suggestions Page Component - Modern Design
import React, { useState } from 'react';

const AISuggestionsImproved = () => {
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const suggestions = [
    {
      id: 1,
      icon: '🏋️',
      title: 'Increase Chest Focus',
      category: 'Training',
      priority: 'high',
      reason: 'Your chest exercises show lower strength compared to other muscle groups',
      recommendation: 'Add 2-3 extra chest press sessions per week',
      impact: 'Improve chest strength by 20% in 4 weeks',
      action: '→ View Chest Workouts',
    },
    {
      id: 2,
      icon: '🧘',
      title: 'Improve Posture',
      category: 'Form',
      priority: 'high',
      reason: 'Average posture score during deadlifts is dropping (87% → 82%)',
      recommendation: 'Focus on form check exercises before main workouts',
      impact: 'Reduce injury risk by 30%',
      action: '→ Start Form Training',
    },
    {
      id: 3,
      icon: '⏱️',
      title: 'Extend Workout Duration',
      category: 'Duration',
      priority: 'medium',
      reason: 'Your sessions are shorter than optimal for muscle growth',
      recommendation: 'Add 10-15 minutes to your workouts (warm-up + cool-down)',
      impact: 'Better recovery and 15% more gains',
      action: '→ View Extended Program',
    },
    {
      id: 4,
      icon: '💪',
      title: 'Progressive Overload',
      category: 'Progress',
      priority: 'medium',
      reason: 'Your reps per exercise have plateaued at 10-12 range',
      recommendation: 'Increase weight by 5% every week, maintain 8-10 reps',
      impact: 'Break through plateaus and gain strength',
      action: '→ View Progressive Plan',
    },
    {
      id: 5,
      icon: '🔄',
      title: 'Rest Days Matter',
      category: 'Recovery',
      priority: 'medium',
      reason: 'You\'ve been working out 6/7 days - recovery is important',
      recommendation: 'Take at least one full rest day + two active recovery days weekly',
      impact: 'Prevent burnout, improve performance',
      action: '→ Plan Recovery Week',
    },
    {
      id: 6,
      icon: '🎯',
      title: 'New Exercise: Rows',
      category: 'Programming',
      priority: 'low',
      reason: 'Add variety and work opposite of chest muscles',
      recommendation: 'Include barbell rows 2x per week in back days',
      impact: 'Better back development and balance',
      action: '→ Learn Rowing Form',
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'from-red-500 to-red-600';
      case 'medium':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return '⚠️ High';
      case 'medium':
        return '📌 Medium';
      default:
        return '💡 Low';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🤖 AI Fitness Suggestions</h1>
          <p className="text-gray-600">Personalized recommendations to improve your fitness journey</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
            <p className="text-gray-600 text-sm font-semibold mb-2">🚨 High Priority</p>
            <p className="text-3xl font-bold text-gray-900">2</p>
            <p className="text-xs text-gray-500 mt-2">Need immediate attention</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-semibold mb-2">📌 Medium Priority</p>
            <p className="text-3xl font-bold text-gray-900">3</p>
            <p className="text-xs text-gray-500 mt-2">Can be addressed soon</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-semibold mb-2">💡 Low Priority</p>
            <p className="text-3xl font-bold text-gray-900">1</p>
            <p className="text-xs text-gray-500 mt-2">Nice to have improvements</p>
          </div>
        </div>

        {/* Suggestions Grid */}
        <div className="space-y-6">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => setSelectedSuggestion(selectedSuggestion?.id === suggestion.id ? null : suggestion)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer overflow-hidden"
            >
              {/* Main Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{suggestion.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{suggestion.title}</h3>
                      <div className="flex gap-2 mt-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                          {suggestion.category}
                        </span>
                        <span className={`px-3 py-1 bg-gradient-to-r ${getPriorityColor(suggestion.priority)} text-white rounded-full text-xs font-semibold`}>
                          {getPriorityBadge(suggestion.priority)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-400 text-2xl">{selectedSuggestion?.id === suggestion.id ? '▲' : '▼'}</span>
                </div>

                {/* Summary */}
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-3">
                    <span className="font-semibold text-gray-900">Why? </span>
                    {suggestion.reason}
                  </p>
                </div>

                {/* Action Button */}
                {selectedSuggestion?.id !== suggestion.id && (
                  <button className="text-blue-600 hover:text-blue-700 font-bold text-sm">
                    {suggestion.action}
                  </button>
                )}
              </div>

              {/* Expanded Content */}
              {selectedSuggestion?.id === suggestion.id && (
                <div className="border-t border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-3">📋 Recommendation</h4>
                      <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500">
                        <p className="text-gray-700 font-semibold">{suggestion.recommendation}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-3">🎯 Expected Impact</h4>
                      <div className="bg-white rounded-xl p-4 border-l-4 border-green-500">
                        <p className="text-gray-700 font-semibold">{suggestion.impact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Implementation Steps */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3">🚀 Implementation Steps</h4>
                    <div className="space-y-3">
                      {[
                        'Step 1: Understand the current issue',
                        'Step 2: Plan your approach',
                        'Step 3: Start implementation',
                        'Step 4: Track progress',
                      ].map((step, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                          <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold text-sm">
                            {idx + 1}
                          </span>
                          <span className="text-gray-700 font-semibold">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg transition">
                      ✅ Accept Suggestion
                    </button>
                    <button className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition">
                      💭 Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Tips Section */}
        <div className="mt-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-2xl p-8 text-white">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-5xl">🧠</span>
            <div>
              <h2 className="text-3xl font-bold mb-2">AI Coach Tips</h2>
              <p className="text-blue-100">Here are some general tips from your AI fitness coach</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '💧', title: 'Stay Hydrated', desc: 'Drink water before, during, and after workouts' },
              { emoji: '😴', title: 'Get Enough Sleep', desc: 'Aim for 7-9 hours for optimal recovery' },
              { emoji: '🥗', title: 'Balanced Nutrition', desc: 'Maintain proper protein intake for muscle growth' },
            ].map((tip, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur rounded-xl p-5 hover:bg-white/20 transition">
                <p className="text-3xl mb-2">{tip.emoji}</p>
                <h4 className="text-lg font-bold mb-2">{tip.title}</h4>
                <p className="text-blue-100">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-bold text-lg hover:shadow-lg transition">
            📊 View Full Analytics →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionsImproved;
