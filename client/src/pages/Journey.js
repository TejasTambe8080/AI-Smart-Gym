import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Journey = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/progression/story', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data.data);
      } catch (e) { 
        console.error(e); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchJourney();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-900 p-10 text-white font-black italic uppercase">Synchronizing Journey...</div>;
  if (!data) return <div className="min-h-screen bg-slate-900 p-10 text-white font-black italic uppercase">No neural data found. Start a protocol to begin.</div>;

  const { postureImprovement, strengthGrowth } = data.journeyMetrics;


  return (
    <div className="min-h-screen bg-slate-900/50 p-6 lg:p-10 animate-enter">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4">
           <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Biometric Evolution Narrative</p>
           <h1 className="text-6xl font-black text-white italic truncate uppercase tracking-tight">Your Journey</h1>
           <div className="flex justify-center gap-10 pt-4">
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase underline decoration-blue-500 underline-offset-8">Precision Delta</p>
                 <p className="text-4xl font-black text-emerald-400 mt-2">+{data.journeyMetrics.postureImprovement}%</p>
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase underline decoration-purple-500 underline-offset-8">Volume Delta</p>
                 <p className="text-4xl font-black text-purple-400 mt-2">+{data.journeyMetrics.strengthGrowth}%</p>
              </div>
           </div>
        </div>

        {/* Timeline */}
        <div className="space-y-10">
           <h2 className="text-xs font-black text-slate-600 uppercase tracking-widest border-b border-white/5 pb-4">Evolution Milestones</h2>
           <div className="space-y-8 relative">
              <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-slate-800"></div>
              {data.milestones.map((m, i) => (
                <div key={i} className="relative pl-16 group">
                   <div className="absolute left-0 w-12 h-12 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-xl shadow-2xl group-hover:scale-110 transition-transform">{m.icon}</div>
                   <div className="premium-card p-8 group-hover:bg-slate-800/40 transition-all">
                      <p className="text-[10px] font-black text-blue-500 uppercase mb-2">{new Date(m.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      <h3 className="text-xl font-black text-white italic uppercase">{m.title}</h3>
                      <p className="text-slate-500 text-sm italic font-medium mt-2 leading-relaxed">{m.description}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Comparison Board */}
        <div className="grid md:grid-cols-2 gap-10">
           <div className="premium-card p-10 space-y-6">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Phase 0: Baseline</p>
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center text-4xl">📉</div>
                 <div>
                    <p className="text-white font-black text-sm uppercase italic">Starting Precision</p>
                    <p className="text-slate-500 text-xs italic font-medium">Initial neural synchronization was unstable.</p>
                 </div>
              </div>
           </div>
           <div className="premium-card p-10 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-blue-500/20 space-y-6">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">Phase Optimal: Current</p>
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-3xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-4xl">📈</div>
                 <div>
                    <p className="text-white font-black text-sm uppercase italic">Evolution Achieved</p>
                    <p className="text-slate-400 text-xs italic font-medium">Neural pathways have optimized for {postureImprovement}% accuracy shift.</p>
                 </div>

              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Journey;
