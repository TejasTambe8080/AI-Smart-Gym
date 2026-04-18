// Premium AI Coach Chat Page
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AIChatCoach = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! I'm your AI Fitness Coach. Ask me anything about workouts, diet, posture, or training. What would you like to know today? 💪",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/coach', {
        query: inputValue
      });

      if (response.data.success) {
        const botMessage = {
          id: messages.length + 2,
          text: response.data.reply,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const suggestedQuestions = [
    "What should I train today?",
    "How to improve my posture?",
    "Best workout for muscle gain?",
    "How many calories should I eat?",
    "Tips for consistent training?",
    "How to recover better?"
  ];

  const handleSuggestedQuestion = (question) => {
    setInputValue(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            🤖 AI Fitness Coach
          </h1>
          <p className="text-gray-400">Personalized training and nutrition advice powered by AI</p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gray-700 overflow-hidden flex flex-col shadow-2xl">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-gray-700/50 text-gray-100 border border-gray-600'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions (show if no messages or at beginning) */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-400 mb-3">Quick suggestions:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-left p-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 hover:border-blue-500 rounded-lg text-sm text-gray-200 transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-700 p-4 bg-gray-900/50">
            <form onSubmit={sendMessage} className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask your AI Coach..."
                disabled={loading}
                className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-gray-700 transition-all"
              />
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/50"
              >
                {loading ? '⏳' : '✉️'}
              </button>
            </form>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">💪</div>
            <h3 className="text-sm font-semibold text-blue-300">Workout Advice</h3>
            <p className="text-xs text-gray-400 mt-1">Personalized training plans</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🥗</div>
            <h3 className="text-sm font-semibold text-green-300">Diet Guidance</h3>
            <p className="text-xs text-gray-400 mt-1">Nutrition recommendations</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🧘</div>
            <h3 className="text-sm font-semibold text-purple-300">Recovery Tips</h3>
            <p className="text-xs text-gray-400 mt-1">Injury prevention & wellness</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatCoach;
