// Premium AI Coach Chat Page - Fluid Modern Interface
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AIChatCoach = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Neural Link Established. I am your AI Biometrics Coach. Data synchronized. How can I optimize your performance today? 💪",
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
    const query = inputValue.trim();
    if (!query) return;

    const userMessage = {
      id: Date.now(),
      text: query,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/coach', {
        query: query
      });

      if (response.data.success) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: response.data.reply,
          sender: 'bot',
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('AI Comms Failure:', error);
      toast.error('Neural uplink interrupted.');
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        text: "Apologies, my neural processing units are currently undergoing maintenance. Please retry in a few moments.",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const suggestedQuestions = [
    "Target muscle group for today?",
    "Recalibrate my posture scores",
    "Hypertrophy diet variables",
    "Optimizing sleep cycles",
    "Injury risk mitigation",
    "Volume progression logic"
  ];

  return (
    <div className="min-h-screen bg-slate-900/50 p-4 lg:p-8 flex flex-col items-center animate-enter">
      <div className="w-full max-w-4xl h-[calc(100vh-140px)] flex flex-col gap-6">
        {/* Cinematic Header */}
        <div className="flex items-center justify-between px-4">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-blue-500/20">🤖</div>
              <div>
                 <h1 className="text-xl font-black text-white tracking-tight">NEURAL COACH v4.0</h1>
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Link</span>
                 </div>
              </div>
           </div>
           <div className="hidden md:flex gap-2">
              <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-[10px] font-black text-slate-400 uppercase tracking-widest">GEMINI CORE</span>
              <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-[10px] font-black text-slate-400 uppercase tracking-widest">REAL-TIME BIOMETRICS</span>
           </div>
        </div>

        {/* Chat Interface Container */}
        <div className="flex-1 glass-card rounded-[2.5rem] border-slate-800/80 overflow-hidden flex flex-col shadow-2xl relative">
          {/* Scrollable Message History */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[70%] rounded-3xl px-6 py-4 shadow-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-800/80 border border-slate-700/50 text-slate-100 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm font-medium leading-relaxed">{message.text}</p>
                  <p className={`text-[10px] mt-2 font-black uppercase tracking-widest ${
                    message.sender === 'user' ? 'text-blue-200' : 'text-slate-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} System.T
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-enter">
                <div className="bg-slate-800/80 border border-slate-700/50 rounded-3xl rounded-tl-none px-6 py-4 flex items-center gap-3">
                   <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Processing Bio-Data...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Logic Ingress */}
          {messages.length === 1 && (
            <div className="px-8 pb-6 animate-enter">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputValue(question)}
                    className="text-left p-4 bg-slate-800 border border-slate-700 hover:border-blue-500 hover:bg-slate-700/50 rounded-2xl text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all line-clamp-1"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Terminal Area */}
          <div className="p-6 md:p-8 bg-slate-950/50 border-t border-slate-800/50">
            <form onSubmit={sendMessage} className="flex gap-4 relative group">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Synchronize command..."
                disabled={loading}
                className="flex-1 h-14 bg-slate-900 border border-slate-800 rounded-2xl px-6 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
              />
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:grayscale text-white w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-blue-500/20 active:scale-95"
              >
                 <span className="text-xl">🚀</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatCoach;
