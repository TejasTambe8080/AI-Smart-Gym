// Premium Diet Recommendations Page with Gemini AI
import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import axios from 'axios';

const Diet = () => {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUserAndCalculate();
  }, []);

  const fetchUserAndCalculate = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      setUser(response.data.user);
      calculateDietPlan(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIDietPlan = async () => {
    if (!user) return;
    try {
      setAiLoading(true);
      const response = await axios.post('http://localhost:5000/api/ai/diet', {
        height: user.height || 170,
        weight: user.weight,
        goal: user.fitnessGoal === 'muscle_gain' ? 'Build Muscle' : 
              user.fitnessGoal === 'weight_loss' ? 'Lose Weight' : 'General Fitness',
        activityLevel: 'Moderate',
        workoutHistory: 'Beginner'
      });

      if (response.data.success) {
        setRecommendations({
          ...recommendations,
          aiPlan: response.data.data,
          isAI: true
        });
        setUseAI(true);
        setActiveTab('mealPlan');
      }
    } catch (error) {
      console.error('Error generating AI diet plan:', error);
      alert('Failed to generate AI diet plan. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const calculateDietPlan = (userData) => {
    const { weight, fitnessGoal, age } = userData;

    // BMR calculation (Mifflin-St Jeor Equation)
    const bmr = 10 * weight + 6.25 * (userData.height || 170) - 5 * age + 5;
    const tdee = bmr * 1.5; // Moderate activity

    let plan = { tdee, bmr };

    // Macros based on goal
    switch (fitnessGoal) {
      case 'muscle_gain':
        plan = {
          ...plan,
          protein: (weight * 2.2).toFixed(0), // 2.2g/kg
          carbs: (tdee * 0.45) / 4,
          fats: (tdee * 0.25) / 9,
          goal: 'Build Muscle',
          surplus: 300,
          description: 'High protein to support muscle growth with caloric surplus',
        };
        break;

      case 'weight_loss':
        plan = {
          ...plan,
          protein: (weight * 1.8).toFixed(0), // 1.8g/kg
          carbs: (tdee * 0.4) / 4,
          fats: (tdee * 0.3) / 9,
          goal: 'Lose Weight',
          deficit: 500,
          description: 'High protein to preserve muscle with moderate caloric deficit',
        };
        break;

      case 'endurance':
        plan = {
          ...plan,
          protein: (weight * 1.6).toFixed(0), // 1.6g/kg
          carbs: (tdee * 0.55) / 4,
          fats: (tdee * 0.25) / 9,
          goal: 'Build Endurance',
          description: 'High carbs for energy with adequate protein',
        };
        break;

      default:
        plan = {
          ...plan,
          protein: (weight * 1.6).toFixed(0),
          carbs: (tdee * 0.45) / 4,
          fats: (tdee * 0.3) / 9,
          goal: 'General Fitness',
          description: 'Balanced macros for overall health and fitness',
        };
    }

    plan.calories = plan.deficit ? Math.round(tdee - plan.deficit) : 
                   plan.surplus ? Math.round(tdee + plan.surplus) : Math.round(tdee);

    setRecommendations(plan);
  };

  if (loading || !recommendations) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Loading diet recommendations...</div>
      </div>
    );
  }

  const mealPlans = {
    muscle_gain: [
      {
        meal: 'Breakfast',
        time: '7:00 AM',
        foods: ['Oatmeal with berries', 'Eggs (3)', 'Whole wheat toast', 'Almond butter'],
        cals: 450,
        protein: 25,
      },
      {
        meal: 'Snack 1',
        time: '10:00 AM',
        foods: ['Greek yogurt', 'Granola', 'Honey'],
        cals: 200,
        protein: 15,
      },
      {
        meal: 'Lunch',
        time: '1:00 PM',
        foods: ['Chicken breast (150g)', 'Brown rice', 'Broccoli', 'Olive oil'],
        cals: 550,
        protein: 40,
      },
      {
        meal: 'Snack 2',
        time: '4:00 PM',
        foods: ['Protein shake', 'Banana', 'Peanut butter'],
        cals: 300,
        protein: 25,
      },
      {
        meal: 'Dinner',
        time: '7:00 PM',
        foods: ['Salmon (150g)', 'Sweet potato', 'Green beans', 'Lemon'],
        cals: 500,
        protein: 35,
      },
    ],
    weight_loss: [
      {
        meal: 'Breakfast',
        time: '7:00 AM',
        foods: ['Egg whites (4)', 'Vegetables', 'Whole wheat toast'],
        cals: 250,
        protein: 20,
      },
      {
        meal: 'Snack 1',
        time: '10:00 AM',
        foods: ['Apple', 'Almonds (28g)'],
        cals: 150,
        protein: 5,
      },
      {
        meal: 'Lunch',
        time: '1:00 PM',
        foods: ['Lean turkey (100g)', 'Large salad', 'Light dressing'],
        cals: 300,
        protein: 30,
      },
      {
        meal: 'Snack 2',
        time: '4:00 PM',
        foods: ['Greek yogurt (nonfat)', 'Berries'],
        cals: 120,
        protein: 20,
      },
      {
        meal: 'Dinner',
        time: '7:00 PM',
        foods: ['White fish (150g)', 'Brown rice (small)', 'Vegetables'],
        cals: 350,
        protein: 35,
      },
    ],
    endurance: [
      {
        meal: 'Breakfast',
        time: '7:00 AM',
        foods: ['Oatmeal with banana', 'Almonds', 'Honey', 'Orange juice'],
        cals: 500,
        protein: 15,
      },
      {
        meal: 'Snack 1',
        time: '10:00 AM',
        foods: ['Energy bar', 'Apple', 'Almond butter'],
        cals: 300,
        protein: 10,
      },
      {
        meal: 'Lunch',
        time: '1:00 PM',
        foods: ['Chicken breast (120g)', 'Pasta', 'Tomato sauce', 'Vegetables'],
        cals: 600,
        protein: 35,
      },
      {
        meal: 'Snack 2',
        time: '4:00 PM',
        foods: ['Banana', 'Sports drink', 'Granola'],
        cals: 250,
        protein: 5,
      },
      {
        meal: 'Dinner',
        time: '7:00 PM',
        foods: ['Lean beef (120g)', 'Brown rice (generous)', 'Steamed broccoli'],
        cals: 550,
        protein: 30,
      },
    ],
    general_fitness: [
      {
        meal: 'Breakfast',
        time: '7:00 AM',
        foods: ['Scrambled eggs (2)', 'Whole wheat toast', 'Avocado', 'Berries'],
        cals: 380,
        protein: 18,
      },
      {
        meal: 'Snack 1',
        time: '10:00 AM',
        foods: ['Greek yogurt', 'Granola', 'Almonds'],
        cals: 180,
        protein: 12,
      },
      {
        meal: 'Lunch',
        time: '1:00 PM',
        foods: ['Turkey breast (120g)', 'Quinoa', 'Mixed vegetables', 'Olive oil'],
        cals: 450,
        protein: 32,
      },
      {
        meal: 'Snack 2',
        time: '4:00 PM',
        foods: ['Protein shake', 'Banana', 'Peanut butter'],
        cals: 280,
        protein: 20,
      },
      {
        meal: 'Dinner',
        time: '7:00 PM',
        foods: ['Grilled chicken (130g)', 'Sweet potato', 'Green beans', 'Lemon'],
        cals: 480,
        protein: 28,
      },
    ],
  };

  const selectedMealPlan = mealPlans[user?.fitnessGoal || 'general_fitness'] || mealPlans.general_fitness;

  if (loading || !recommendations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-white">Loading your personalized diet plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with AI Button */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🥗 Premium Diet Plan</h1>
            <p className="text-gray-400">Personalized nutrition powered by AI and science</p>
          </div>
          <button
            onClick={generateAIDietPlan}
            disabled={aiLoading}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
              useAI
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : aiLoading
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 text-white'
            }`}
          >
            {aiLoading ? '⏳ Generating...' : useAI ? '✅ AI Plan Generated' : '🤖 Generate with AI'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-gray-800/50 p-2 rounded-lg backdrop-blur-sm">
          {['overview', 'mealPlan', 'sources', 'tips'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'mealPlan' && '🍽️ Meal Plan'}
              {tab === 'sources' && '🥚 Food Sources'}
              {tab === 'tips' && '💡 Tips'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Caloric Needs */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  📊 Daily Caloric Needs
                </h2>
                <div className="space-y-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Basal Metabolic Rate (BMR)</p>
                    <p className="text-3xl font-bold text-blue-400 mt-2">{Math.round(recommendations.bmr)}</p>
                    <p className="text-xs text-gray-500 mt-1">Calories at rest</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Total Daily Energy Expenditure (TDEE)</p>
                    <p className="text-3xl font-bold text-green-400 mt-2">{Math.round(recommendations.tdee)}</p>
                    <p className="text-xs text-gray-500 mt-1">Calorie baseline</p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
                    <p className="text-gray-300 text-sm font-semibold">🎯 Recommended Daily Intake</p>
                    <p className="text-4xl font-bold text-yellow-400 mt-2">{recommendations.calories}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {recommendations.deficit
                        ? `Deficit: -${recommendations.deficit} cal/day`
                        : recommendations.surplus
                        ? `Surplus: +${recommendations.surplus} cal/day`
                        : 'Maintenance'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Macronutrients */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  🧬 Macronutrient Breakdown
                </h2>
                <div className="space-y-4">
                  {/* Protein */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-red-300">Protein</span>
                      <span className="text-red-400 font-bold">{Math.round(recommendations.protein)}g</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div className="h-3 bg-gradient-to-r from-red-500 to-red-400 rounded-full" style={{ width: '35%' }} />
                    </div>
                  </div>

                  {/* Carbs */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-blue-300">Carbohydrates</span>
                      <span className="text-blue-400 font-bold">{Math.round(recommendations.carbs)}g</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>

                  {/* Fats */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-yellow-300">Fats</span>
                      <span className="text-yellow-400 font-bold">{Math.round(recommendations.fats)}g</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div className="h-3 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Plan Display */}
            {useAI && recommendations.aiPlan && (
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl shadow-lg p-8 border border-purple-500/30">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  🤖 AI-Generated Personalized Plan
                </h3>
                <div className="prose prose-invert max-w-none">
                  <pre className="bg-gray-900 rounded-lg p-4 text-gray-300 text-sm overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(recommendations.aiPlan, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Meal Plan Tab */}
        {activeTab === 'mealPlan' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">🍽️ Sample Daily Meal Plan</h2>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-lg">
                  <p className="text-sm font-semibold text-white">Goal: {recommendations.goal}</p>
                </div>
              </div>
              <div className="space-y-4">
                {selectedMealPlan.map((meal, idx) => (
                  <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 hover:border-blue-500/50 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{meal.meal}</h3>
                        <p className="text-sm text-gray-400">{meal.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-400">{meal.cals}</p>
                        <p className="text-xs text-gray-500">calories</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <ul className="grid grid-cols-2 gap-2">
                        {meal.foods.map((food, foodIdx) => (
                          <li key={foodIdx} className="text-sm text-gray-300">
                            ✓ {food}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-3 border-t border-gray-700 flex justify-between text-xs text-gray-500">
                      <span>Protein: {meal.protein}g</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg">
                <p className="font-semibold text-green-300">Daily Total</p>
                <p className="text-3xl font-bold text-green-400 mt-2">
                  {selectedMealPlan.reduce((sum, m) => sum + m.cals, 0)} Calories
                </p>
                <p className="text-sm text-green-300 mt-1">
                  Protein: {selectedMealPlan.reduce((sum, m) => sum + m.protein, 0)}g
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Food Sources Tab */}
        {activeTab === 'sources' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-xl shadow-lg p-6 border border-red-500/30">
              <h3 className="text-lg font-bold text-red-300 mb-4">🍖 Protein Sources</h3>
              <ul className="space-y-3">
                {['Chicken breast', 'Fish & Salmon', 'Lean beef', 'Eggs', 'Protein powder', 'Greek yogurt'].map((item, idx) => (
                  <li key={idx} className="text-sm text-red-200 flex items-center gap-2">
                    <span className="text-red-400">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl shadow-lg p-6 border border-blue-500/30">
              <h3 className="text-lg font-bold text-blue-300 mb-4">🌾 Carbohydrate Sources</h3>
              <ul className="space-y-3">
                {['Brown rice', 'Oats', 'Sweet potatoes', 'Quinoa', 'Fruits & berries', 'Legumes'].map((item, idx) => (
                  <li key={idx} className="text-sm text-blue-200 flex items-center gap-2">
                    <span className="text-blue-400">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-xl shadow-lg p-6 border border-yellow-500/30">
              <h3 className="text-lg font-bold text-yellow-300 mb-4">🥑 Healthy Fats</h3>
              <ul className="space-y-3">
                {['Avocado', 'Olive oil', 'Nuts & seeds', 'Fatty fish', 'Nut butters', 'Coconut oil'].map((item, idx) => (
                  <li key={idx} className="text-sm text-yellow-200 flex items-center gap-2">
                    <span className="text-yellow-400">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl shadow-lg p-6 border border-blue-500/30">
              <h3 className="text-lg font-bold text-blue-300 mb-4">💡 Nutrition Tips</h3>
              <ul className="space-y-3">
                {[
                  'Drink 3-4 liters of water daily',
                  'Eat protein with every meal',
                  'Prep meals 1-2 days in advance',
                  'Use a food tracking app',
                  'Adjust portions based on progress',
                  'Include veggies in every meal'
                ].map((tip, idx) => (
                  <li key={idx} className="text-sm text-blue-200 flex items-center gap-2">
                    <span className="text-blue-400">✓</span> {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl shadow-lg p-6 border border-purple-500/30">
              <h3 className="text-lg font-bold text-purple-300 mb-4">🎯 Supplements</h3>
              <ul className="space-y-3">
                {[
                  'Whey protein powder (25-40g/day)',
                  'Multivitamin daily',
                  'Creatine monohydrate (5g/day)',
                  'Omega-3 fish oil (1-2g/day)',
                  'Water: Half bodyweight in oz',
                  'Electrolytes during intense training'
                ].map((sup, idx) => (
                  <li key={idx} className="text-sm text-purple-200 flex items-center gap-2">
                    <span className="text-purple-400">✓</span> {sup}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Diet;
