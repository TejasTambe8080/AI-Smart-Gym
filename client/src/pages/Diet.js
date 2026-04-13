// Diet Recommendations Page
import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';

const Diet = () => {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

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
  };

  const selectedMealPlan = mealPlans[user?.fitnessGoal] || mealPlans.muscle_gain;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🥗 Diet Recommendations</h1>
          <p className="text-gray-600">Personalized nutrition plan based on your fitness goal</p>
        </div>

        {/* Macros Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Caloric Needs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Daily Caloric Needs</h2>

            <div className="space-y-3 mb-6">
              <div>
                <p className="text-gray-600 text-sm">Basal Metabolic Rate (BMR)</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(recommendations.bmr)}</p>
                <p className="text-xs text-gray-500">Calories at rest</p>
              </div>

              <div className="border-t pt-3">
                <p className="text-gray-600 text-sm">Total Daily Energy Expenditure (TDEE)</p>
                <p className="text-2xl font-bold text-green-600">{Math.round(recommendations.tdee)}</p>
                <p className="text-xs text-gray-500">Calorie baseline</p>
              </div>

              <div className="border-t pt-3 bg-yellow-50 p-3 rounded-lg">
                <p className="text-gray-600 text-sm font-semibold">Recommended Daily Intake</p>
                <p className="text-3xl font-bold text-yellow-600">{recommendations.calories}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {recommendations.deficit
                    ? `Deficit: -${recommendations.deficit} cal/day`
                    : recommendations.surplus
                    ? `Surplus: +${recommendations.surplus} cal/day`
                    : 'Maintenance'}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 italic">{recommendations.description}</p>
          </div>

          {/* Macronutrients */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🥚 Macronutrients Breakdown</h2>

            <div className="space-y-4">
              {/* Protein */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Protein</span>
                  <span className="text-red-600 font-bold">{Math.round(recommendations.protein)}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="h-3 rounded-full bg-red-500" style={{ width: '35%' }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">~30% of calories</p>
              </div>

              {/* Carbs */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Carbohydrates</span>
                  <span className="text-blue-600 font-bold">
                    {Math.round(recommendations.carbs)}g
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="h-3 rounded-full bg-blue-500" style={{ width: '45%' }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">~45% of calories</p>
              </div>

              {/* Fats */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Fats</span>
                  <span className="text-yellow-600 font-bold">
                    {Math.round(recommendations.fats)}g
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="h-3 rounded-full bg-yellow-500" style={{ width: '25%' }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">~25% of calories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Meal Plan */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🍽️ Sample Daily Meal Plan</h2>

          <div className="space-y-4">
            {selectedMealPlan.map((meal, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{meal.meal}</h3>
                    <p className="text-sm text-gray-500">{meal.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{meal.cals}</p>
                    <p className="text-xs text-gray-600">cal</p>
                  </div>
                </div>

                <div className="mb-3">
                  <ul className="space-y-1">
                    {meal.foods.map((food, foodIdx) => (
                      <li key={foodIdx} className="text-sm text-gray-700">
                        • {food}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                  <span>Protein: {meal.protein}g</span>
                  <span>Carbs: Auto-calculated</span>
                  <span>Fats: Auto-calculated</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-semibold text-green-900">Daily Total</p>
            <p className="text-xl font-bold text-green-600 mt-2">
              {selectedMealPlan.reduce((sum, m) => sum + m.cals, 0)} Calories
            </p>
            <p className="text-sm text-green-700 mt-1">
              Protein: {selectedMealPlan.reduce((sum, m) => sum + m.protein, 0)}g
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-4">💡 Nutrition Tips</h3>
            <ul className="space-y-2">
              <li className="text-sm text-blue-800">✓ Drink 3-4 liters of water daily</li>
              <li className="text-sm text-blue-800">✓ Eat protein with every meal</li>
              <li className="text-sm text-blue-800">✓ Prep meals in advance</li>
              <li className="text-sm text-blue-800">✓ Track your intake in an app</li>
              <li className="text-sm text-blue-800">✓ Adjust based on progress</li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-lg shadow-md p-6 border border-purple-200">
            <h3 className="text-lg font-bold text-purple-900 mb-4">🎯 Hydration & Supplements</h3>
            <ul className="space-y-2">
              <li className="text-sm text-purple-800">✓ Whey protein powder (30g/day)</li>
              <li className="text-sm text-purple-800">✓ Multivitamin daily</li>
              <li className="text-sm text-purple-800">✓ Creatine monohydrate (5g/day)</li>
              <li className="text-sm text-purple-800">✓ Omega-3 fish oil</li>
              <li className="text-sm text-purple-800">✓ Water: 1g per lb bodyweight</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diet;
