import React, { useState, useEffect } from 'react';
import { trainerService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, Activity, Star, Clock, ArrowUpRight, Zap, ShieldCheck, ChevronRight, User, TrendingUp, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import socket from '../utils/socket';
import { toast } from 'react-hot-toast';
import StatusHandler from '../components/StatusHandler';

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
    socket.on('booking_updated', fetchDashboardData);
    socket.on('new_booking', () => {
      toast.success('New Booking Request Received!', { icon: '📅' });
      fetchDashboardData();
    });
    return () => {
      socket.off('booking_updated');
      socket.off('new_booking');
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, bookingsRes] = await Promise.all([
        trainerService.getDashboardStats(),
        trainerService.getTrainerBookings()
      ]);
      setStats(statsRes.data.stats);
      setRecentBookings(bookingsRes.data.bookings?.slice(0, 5) || []);
    } catch (error) {
      setError('Failed to synchronize dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-enter p-4 lg:p-10 bg-slate-950 min-h-screen scrollbar-hide">
      <StatusHandler loading={loading} error={error}>
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-3">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400">
                  <ShieldCheck size={12} className="animate-pulse" />
                  Trainer Profile Active // {user.name}
               </div>
               <h1 className="text-4xl lg:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                 Coaching <span className="text-blue-600">Dashboard</span>
               </h1>
               <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] flex items-center gap-2 italic">
                 Manage Your Coaching Operations <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></span> Online
               </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
               <button 
                 onClick={() => navigate('/trainer-bookings')} 
                 className="h-16 px-8 bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl flex items-center justify-center gap-3"
               >
                 <Calendar size={18} /> Manage Bookings
               </button>
               <button 
                 onClick={() => navigate('/trainer-clients')} 
                 className="h-16 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-3 active:scale-95"
               >
                 <Users size={18} /> My Clients
               </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Clients', value: stats?.totalClients || 0, icon: Users, color: 'text-blue-500' },
              { label: 'Active Sessions', value: stats?.activeSessions || 0, icon: Calendar, color: 'text-emerald-500' },
              { label: 'Pending Requests', value: stats?.pendingBookings || 0, icon: Clock, color: 'text-amber-500', alert: stats?.pendingBookings > 0 },
              { label: 'Avg Performance', value: `${stats?.averageClientScore || 0}%`, icon: Zap, color: 'text-purple-500' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 group hover:border-slate-700 transition-all cursor-default relative overflow-hidden flex flex-col justify-between min-h-[180px]">
                 <div className="absolute top-0 right-0 p-8 opacity-5 grayscale pointer-events-none text-7xl italic font-black">{idx + 1}</div>
                 <div className="flex justify-between items-start relative z-10">
                   <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 ${item.color} shadow-inner group-hover:scale-110 transition-transform`}>
                       <item.icon size={24} />
                   </div>
                   {item.alert && <div className="absolute top-0 right-0 w-3 h-3 bg-amber-500 rounded-full animate-ping border-2 border-slate-900"></div>}
                 </div>
                 <div className="relative z-10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter">{item.value}</p>
                 </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Recent Bookings */}
            <div className="lg:col-span-2 space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                    <Activity size={20} className="text-blue-600" /> Recent Bookings
                  </h3>
                  <button onClick={() => navigate('/trainer-bookings')} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all underline underline-offset-8 decoration-slate-800">View All</button>
               </div>
               
               <div className="space-y-4">
                  {recentBookings.length > 0 ? recentBookings.map(b => (
                     <div key={b._id} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex items-center justify-between group hover:border-blue-500/30 transition-all shadow-xl">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-700 text-2xl group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all shadow-inner overflow-hidden uppercase italic font-bold">
                              {b.userId?.imageUrl ? <img src={b.userId.imageUrl} alt="" className="w-full h-full object-cover" /> : <User size={28} />}
                           </div>
                           <div>
                              <p className="text-lg font-black text-white italic uppercase tracking-tight leading-none mb-2">{b.userId?.name || 'Client'}</p>
                              <div className="flex items-center gap-4">
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] italic bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{b.sessionType}</span>
                                 <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                                    b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]' : 
                                    b.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                    'bg-slate-800 text-slate-500 border-slate-700'
                                 }`}>{b.status}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-8">
                           <div className="text-right hidden md:block">
                              <p className="text-sm font-black text-white italic leading-none">{new Date(b.scheduledAt).toLocaleDateString()}</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">{new Date(b.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                           </div>
                           <button 
                             onClick={() => navigate('/trainer-bookings')} 
                             className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-600 hover:text-white hover:border-slate-500 transition-all shadow-inner group-hover:translate-x-1"
                           >
                              <ChevronRight size={20} />
                           </button>
                        </div>
                     </div>
                  )) : (
                     <div className="bg-slate-900 border border-slate-800 border-dashed rounded-[3rem] p-20 text-center space-y-4">
                        <Activity size={32} className="mx-auto text-slate-800" />
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic leading-relaxed">
                           No upcoming bookings found.<br />You'll see new client requests here.
                        </p>
                     </div>
                  )}
               </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-8">
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                 <Star size={20} className="text-amber-500" /> Quick Actions
               </h3>
               <div className="flex flex-col gap-5">
                  {[
                    { label: 'Client List', desc: 'Review client stats & posture analytics', icon: Users, path: '/trainer-clients', color: 'border-blue-500/20' },
                    { label: 'Bookings / Schedule', desc: 'Confirm sessions & manage your time', icon: Calendar, path: '/trainer-bookings', color: 'border-emerald-500/20' },
                    { label: 'Messages', desc: 'Communicate directly with your clients', icon: Activity, path: '/notifications', color: 'border-purple-500/20' }
                  ].map((act, i) => (
                    <button 
                      key={i}
                      onClick={() => navigate(act.path)}
                      className={`bg-slate-900 border ${act.color} rounded-[2.5rem] p-8 text-left group hover:bg-slate-800/50 transition-all relative overflow-hidden shadow-xl`}
                    >
                       <div className="absolute -right-6 -bottom-6 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700 pointer-events-none grayscale"><act.icon size={100} /></div>
                       <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1 shadow-sm italic">{act.label}</h4>
                       <p className="text-[10px] font-bold text-slate-500 italic uppercase leading-relaxed max-w-[85%]">{act.desc}</p>
                       <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest group-hover:gap-4 transition-all">
                          Manage Now <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                       </div>
                    </button>
                  ))}
               </div>

               {/* Coaching Tip */}
               <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl border-l-4 border-l-blue-600">
                  <div className="absolute -right-6 -bottom-6 text-9xl opacity-5 italic grayscale pointer-events-none">💡</div>
                  <div className="flex items-center gap-2 mb-4">
                     <TrendingUp size={14} className="text-blue-500" />
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Coaching Tip</p>
                  </div>
                  <p className="text-xs font-bold text-slate-400 leading-relaxed italic pr-4">
                     "Average client performance is at <span className="text-white">{stats?.averageClientScore || 0}%</span>. Based on recent data, we recommend focusing on form correction for better long-term results."
                  </p>
                  <div className="mt-8 h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${stats?.averageClientScore || 0}%` }}
                       className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full shadow-[0_0_15px_-5px_rgba(59,130,246,0.6)]"
                     />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </StatusHandler>
    </div>
  );
};

export default TrainerDashboard;
