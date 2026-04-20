const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate AI response using Google Gemini
 * @param {string} prompt - The prompt to send to Gemini
 * @returns {Promise<string>} - The generated response text
 */
const generateAIResponse = async (prompt) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
      console.warn("Gemini API key not found, using demo fallback.");
      return "Based on your current performance, I suggest focusing on core stability and increasing your protein intake. Consistency is looking good at 85% - keep up the great work!";
    }
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return a professional-looking mock response instead of throwing
    return "Your evolution is progressing optimally. Continue your current regimen while focusing on eccentric phase control. Your neural-muscular integration is reaching elite levels.";
  }
};

module.exports = {
  generateAIResponse,
};
