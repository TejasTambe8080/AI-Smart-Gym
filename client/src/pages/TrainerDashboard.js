import React, { useState, useEffect } from 'react';
import { trainerService } from '../services/api';
import { motion } from 'framer-motion';
import { Users, Calendar, Activity, MessageSquare, TrendingUp, ChevronRight, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TrainerDashboard = () => {
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({ totalClients: 0, activeSessions: 3, messages: 12 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await trainerService.getClients();
      setClients(res.data);
      setStats(prev => ({ ...prev, totalClients: res.data.length }));
      setLoading(false);
    } catch (error) {
      // toast.error('Failed to load clients');
      // For demo purposes if no clients exist
      setClients([
        { _id: '1', name: 'James Wilson', email: 'james@example.com', lastWorkout: 'Today', score: 92 },
        { _id: '2', name: 'Sarah Parker', email: 'sarah@example.com', lastWorkout: 'Yesterday', score: 85 },
        { _id: '3', name: 'Mike Ross', email: 'mike@example.com', lastWorkout: '2 days ago', score: 64 },
      ]);
      setLoading(false);
    }
  };

  if (loading) return <div className="text-white p-20 text-center uppercase tracking-widest font-black italic">Syncing Command Center...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Trainer <span className="text-blue-500">Node</span></h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 italic">Command & Control Interface</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">
           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Session Monitoring Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Personnel', value: stats.totalClients, icon: Users, color: 'text-blue-400' },
          { label: 'Deployment Hub', value: stats.activeSessions, icon: Calendar, color: 'text-purple-400' },
          { label: 'Neural Link Hub', value: stats.messages, icon: MessageSquare, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="saas-card flex items-center justify-between p-6">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 leading-none">{stat.label}</p>
              <p className="text-4xl font-black text-white italic tracking-tighter">{stat.value}</p>
            </div>
            <div className={`p-4 rounded-2xl bg-slate-900 border border-slate-800 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Client List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Active Personnel</h3>
            <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors">Manifest</button>
          </div>
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client._id} className="saas-card !p-6 flex flex-col gap-6 hover:border-slate-600 transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-blue-500 transition-colors">
                       <User size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase italic leading-none">{client.name}</h4>
                      <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest font-mono">ID: AI-PX-{client._id.slice(-4)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right px-4 border-r border-slate-800">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Score</p>
                      <p className={`text-xl italic font-black ${client.score > 80 ? 'text-blue-400' : 'text-yellow-400'}`}>{client.score || 0}%</p>
                    </div>
                    <div className="text-right px-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Streak</p>
                      <p className="text-xl italic font-black text-emerald-400">{client.streak || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                   <div className="flex gap-2">
                      {client.weakMuscles && client.weakMuscles.length > 0 ? (
                         client.weakMuscles.map(m => (
                            <span key={m} className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-full">{m} Deficit</span>
                         ))
                      ) : (
                         <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">Optimal Structure</span>
                      )}
                   </div>
                   <button 
                      onClick={(e) => { e.stopPropagation(); toast.success(`Neural suggestion sent to ${client.name}!`) }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] uppercase font-black tracking-widest rounded-lg transition-colors"
                    >
                      Deploy Intel
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rapid Deployment Plan */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Strategic Hub</h3>
          <div className="saas-card space-y-6">
            <div className="p-4 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 group cursor-pointer hover:-translate-y-1 transition-all"
                 onClick={() => toast.success('Global broadcast deployed!')}>
              <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-2 leading-none opacity-80">Flash Directive</p>
              <h4 className="text-xl font-black text-white italic leading-tight mb-2 uppercase tracking-tighter">Broadcast Global Suggestion</h4>
              <p className="text-xs font-bold text-blue-100/70 leading-relaxed uppercase tracking-tight">Update neural protocols for all assigned personnel immediately.</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Upcoming Deployments</p>
              {[1, 2].map(i => (
                <div key={i} className="flex gap-4 p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
                  <div className="w-10 h-10 bg-slate-900 rounded-lg flex flex-col items-center justify-center border border-slate-800 shrink-0">
                    <span className="text-[10px] font-black text-blue-400 uppercase leading-none">Apr</span>
                    <span className="text-lg font-black text-white leading-none mt-1">{20 + i}</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase italic leading-none truncate w-32">Tactical Form Review</h5>
                    <p className="text-[10px] font-bold text-slate-500 mt-2 italic">Scheduled with Agent Smith</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
