// Premium AI Coach Chat Page - Fluid Modern Interface
import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../services/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Sparkles, Terminal, RefreshCw } from 'lucide-react';

const AIChatCoach = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Connection established. I am your AI Coach. I've analyzed your recent workouts and I'm ready to help you optimize your form and performance. How can I help you today? 💪",
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

  const handleSuggestionClick = (question) => {
    setInputValue(question);
    // Use a small timeout to ensure state update before execution
    setTimeout(() => {
      processMessage(question);
    }, 100);
  };

  const processMessage = async (queryText) => {
    if (!queryText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: queryText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Mocked intelligence for demo if backend is generic
      let botReply = '';
      const normalizedQuery = queryText.toLowerCase();

      if (normalizedQuery.includes("weak muscles")) {
         botReply = "Analyzing your biometric history... I've detected a slight imbalance in your posterior chain. Your glutes and lower back are compensating during deep squats. I recommend adding 3 sets of Hip Thrusts to your next session to stabilize your form.";
      } else if (normalizedQuery.includes("last workout")) {
         botReply = "Your last session was high-intensity (85% of max HR). Your posture score was 94%, which is excellent. However, your rep speed dropped significantly in the 4th set, indicating a cardiovascular bottleneck.";
      } else if (normalizedQuery.includes("nutrition")) {
         botReply = "For your current hypertrophy goals, you should aim for 1.8g of protein per kg of body weight. Increasing your complex carb intake 2 hours before your workout will help with those final sets.";
      } else if (normalizedQuery.includes("tejas") || normalizedQuery.includes("tambe")) {
         botReply = "Tejas Tambe is our Head Performance Coach. He specializes in elite biomechanical optimization and system-driven physical architecture. You can book a direct 1-on-1 session with him for ₹5000/Month on the Find Trainers page.";
      } else {
         const response = await aiService.getCoachFeedback({ query: queryText });
         // Handle various response structures
         botReply = response.data?.reply || response.data?.data?.reply || response.data?.feedback || "I've analyzed your request. Your current trajectory is solid, but let's focus on micro-adjustments to your form in the next set.";
      }

      if (!botReply) botReply = "Neural connection established. I'm ready to assist with your next set.";

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: botReply,
        sender: 'bot',
        timestamp: new Date()
      }]);
    } catch (error) {
      toast.error('Connection lost. Please try again.');
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        text: "I'm having trouble connecting to my processing unit. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    processMessage(inputValue);
  };

  const suggestedQuestions = [
    "How was my last workout?",
    "Show my weak muscles",
    "Who is Tejas Tambe?",
    "Nutrition tips for growth",
    "How to sleep better?",
    "Next workout plan"
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-4 lg:p-10 flex flex-col items-center animate-enter scrollbar-hide">
      <div className="w-full max-w-5xl h-[calc(100vh-160px)] flex flex-col gap-8">
        
        {/* Institutional Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-4">
           <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 group hover:rotate-12 transition-transform duration-500">
                 <Bot size={32} />
              </div>
              <div className="space-y-1">
                 <h1 className="text-2xl font-black text-white tracking-widest uppercase italic leading-none">AI <span className="text-blue-600">Coach</span></h1>
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Status: Neural Link Active</span>
                 </div>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2 hover:border-blue-500/30 transition-all cursor-default">
                 <Sparkles size={12} className="text-blue-400" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gemini AI</span>
              </div>
              <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2 hover:border-amber-500/30 transition-all cursor-default">
                 <Terminal size={12} className="text-amber-400" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Analysis</span>
              </div>
           </div>
        </div>

        {/* Neural Command Interface */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl relative group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.05),transparent)] pointer-events-none"></div>
          
          {/* Timeline Node */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 scrollbar-hide">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group/msg`}
                >
                  <div className={`flex items-end gap-4 max-w-[85%] md:max-w-[75%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-inner ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                          : 'bg-slate-950 border-slate-800 text-blue-500'
                    }`}>
                        {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div
                      className={`rounded-[2rem] px-8 py-5 shadow-2xl relative transition-all group-hover/msg:scale-[1.01] ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none italic'
                      }`}
                    >
                      <p className="text-sm font-bold leading-relaxed tracking-tight">{message.text}</p>
                      <p className={`text-[9px] mt-3 font-black uppercase tracking-[0.2em] ${
                        message.sender === 'user' ? 'text-blue-200' : 'text-slate-600'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-slate-950 border border-slate-800 rounded-[2rem] rounded-tl-none px-8 py-5 flex items-center gap-4 group/loader">
                   <RefreshCw className="animate-spin text-blue-500" size={16} />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic group-hover:text-blue-400 transition-colors">AI is synthesizing response...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Command Matrix */}
          {messages.length === 1 && (
            <div className="px-10 pb-8 animate-enter">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(question)}
                    className="text-left p-5 bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-600/5 rounded-2xl text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all line-clamp-1 italic shadow-sm hover:shadow-xl hover:shadow-blue-500/10 group/btn"
                  >
                    <span className="group-hover/btn:translate-x-1 transition-transform inline-block">{question}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Central Command Ingress */}
          <div className="p-8 md:p-10 bg-slate-950/50 border-t border-slate-800/50">
            <form onSubmit={sendMessage} className="flex gap-5 relative">
              <div className="relative flex-1">
                 <input
                   ref={inputRef}
                   type="text"
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   placeholder="Type your message..."
                   disabled={loading}
                   className="w-full h-18 bg-slate-900 border border-slate-800 rounded-2xl px-8 text-white placeholder-slate-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold italic"
                 />
                 <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    <span className="hidden lg:block text-[9px] font-black text-slate-700 uppercase tracking-widest">Active Chat</span>
                 </div>
              </div>
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:grayscale text-white px-8 rounded-2xl flex items-center justify-center transition-all shadow-2xl shadow-blue-600/20 active:scale-95 group/btn"
              >
                 <Send size={24} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatCoach;
