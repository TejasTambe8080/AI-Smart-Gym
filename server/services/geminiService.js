const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateFitnessPlan(userData) {
    const { height, weight, goal, activityLevel = "Moderate", workoutHistory = "Beginner" } = userData;

    const prompt = `Act as a professional fitness trainer and nutritionist.
Generate a personalized fitness and diet plan.

User details:
Height: ${height} cm
Weight: ${weight} kg
Goal: ${goal}
Activity Level: ${activityLevel}
Workout History: ${workoutHistory}

Provide:
1. Daily calorie requirement
2. Protein intake (in grams)
3. Meal plan (breakfast, lunch, dinner)
4. Workout plan (weekly)
5. Tips for improvement

Return response in strict JSON format like this:
{
  "dailyCalories": 2500,
  "proteinIntake": "150g",
  "mealPlan": {
    "breakfast": "...",
    "lunch": "...",
    "dinner": "..."
  },
  "workoutPlan": {
    "monday": "...",
    "wednesday": "...",
    "friday": "..."
  },
  "tips": ["tip1", "tip2", "tip3"]
}

ENSURE the response is valid JSON only, without markdown like \`\`\`json.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      // Remove any json markdown tag in case model adds it
      if (text.startsWith("\`\`\`json")) {
        text = text.replace(/^\`\`\`json\n/, "").replace(/\n\`\`\`$/, "");
      }
      return JSON.parse(text);
    } catch (error) {
      console.error("Gemini API Error:", error.message);
      throw error;
    }
  }

  async generateAICoachResponse(query) {
    const prompt = `You are a strict but supportive professional AI fitness coach. 
Keep your response short, helpful, and highly motivating (max 2-3 sentences).
User says: "${query}"`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API Error:", error.message);
      throw error;
    }
  }
}

module.exports = new GeminiService();
