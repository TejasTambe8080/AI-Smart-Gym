import React, { useState, useEffect } from 'react';
import { trainerService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, CheckCircle2, Video, Link as LinkIcon, Check, X, Database, Search, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StatusHandler from '../components/StatusHandler';

const TrainerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await trainerService.getTrainerBookings();
      setBookings(res.data.bookings || []);
    } catch (error) {
      setError('Neural archive unreachable. Deployment synchronization suspended.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, link = '') => {
    try {
      await trainerService.updateBookingStatus(id, { status, meetingLink: link });
      toast.success(`Protocol updated: ${status.toUpperCase()}`);
      setSelectedBooking(null);
      setMeetingLink('');
      fetchBookings();
    } catch (error) {
      toast.error('Tactical update failed.');
    }
  };

  const filteredBookings = bookings.filter(b => 
    filter === 'All' || b.status.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 lg:p-10 space-y-10 animate-enter scrollbar-hide">
      
      {/* Cinematic Header Block */}
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
           <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-600/10 border border-amber-600/20 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-500">
                 <Database size={10} /> Active Operations // Deployment Manifest
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                Deployment <span className="text-blue-600">Logs</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] italic leading-none">
                Orchestrating expert-personnel synchronization pathways.
              </p>
           </div>

           {/* High-Fidelity Filter Controls */}
           <div className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-inner">
             {['All', 'Pending', 'Confirmed', 'Completed'].map((f) => (
               <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all relative ${
                    filter === f ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
               >
                 {filter === f && (
                    <motion.div layoutId="activeFilter" className="absolute inset-0 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20" />
                 )}
                 <span className="relative z-10">{f}</span>
               </button>
             ))}
           </div>
        </div>

        <StatusHandler loading={loading} error={error} empty={filteredBookings.length === 0} emptyMessage="No deployments localized in current frequency sector.">
           <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {filteredBookings.map((b, i) => (
                  <motion.div
                    key={b._id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-slate-700 transition-all shadow-2xl relative"
                  >
                    <div className="p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                      
                      {/* Identity Module */}
                      <div className="flex items-center gap-8">
                        <div className="relative">
                           <div className="w-20 h-20 bg-slate-950 rounded-[2rem] border border-slate-800 flex items-center justify-center text-slate-700 text-2xl group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all shadow-inner overflow-hidden uppercase italic font-bold">
                              {b.userId?.imageUrl ? (
                                <img src={b.userId.imageUrl} alt="" className="w-full h-full object-cover" />
                              ) : <User size={32} />}
                           </div>
                           <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-slate-900 flex items-center justify-center text-[8px] font-black ${
                              b.status === 'confirmed' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
                           }`}>
                              {b.status === 'confirmed' ? '✓' : '!'}
                           </div>
                        </div>
                        
                        <div className="space-y-2">
                           <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none flex items-center gap-4">
                             {b.userId?.name || 'Personnel Node'}
                           </h3>
                           <div className="flex items-center gap-4">
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest bg-slate-950 px-3 py-1 rounded-full border border-slate-800 italic shadow-inner">{b.sessionType}</span>
                              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 italic">
                                 <Clock size={12} /> {new Date(b.scheduledAt).toLocaleDateString()} // {new Date(b.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                           </div>
                        </div>
                      </div>

                      {/* Control Module */}
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-col text-right mr-4 hidden md:block">
                           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocol Status</p>
                           <p className={`text-xs font-black uppercase italic mt-1 ${
                              b.status === 'confirmed' ? 'text-blue-500' : 
                              b.status === 'completed' ? 'text-emerald-500' : 
                              'text-amber-500'
                           }`}>{b.status}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          {b.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => { setSelectedBooking(b); setMeetingLink(''); }}
                                className="h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-blue-600/30 active:scale-95"
                              >
                                <Check size={16} /> Authorize
                              </button>
                              <button 
                                onClick={() => handleStatusUpdate(b._id, 'rejected')}
                                className="w-14 h-14 bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white rounded-2xl flex items-center justify-center transition-all border border-slate-700 active:scale-95"
                              >
                                <X size={18} />
                              </button>
                            </>
                          )}
                          {b.status === 'confirmed' && (
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => handleStatusUpdate(b._id, 'completed')}
                                className="h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-emerald-500/30 active:scale-95"
                              >
                                <CheckCircle2 size={16} /> Finalize
                              </button>
                              {b.meetingLink && (
                                <a href={b.meetingLink} target="_blank" rel="noreferrer" className="w-14 h-14 bg-slate-950 hover:bg-slate-800 text-blue-400 rounded-2xl flex items-center justify-center border border-slate-800 transition-all shadow-inner group/link" title="Open Signal">
                                  <Video size={20} className="group-hover/link:scale-110 transition-transform" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interaction Extension */}
                    <AnimatePresence>
                      {selectedBooking?._id === b._id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-10 pb-10 border-t border-slate-800 bg-slate-950/20 pt-8"
                        >
                          <div className="space-y-4">
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-2">
                                <LinkIcon size={12} /> Establish Uplink Corridor // (Optional)
                             </p>
                             <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                   <input 
                                     type="url" 
                                     placeholder="ENTER SIGNAL COORDINATES (URL)..."
                                     value={meetingLink}
                                     onChange={(e) => setMeetingLink(e.target.value)}
                                     className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-xs text-white focus:border-blue-500 outline-none transition-all font-mono uppercase tracking-widest"
                                   />
                                </div>
                                <div className="flex gap-2">
                                   <button 
                                     onClick={() => handleStatusUpdate(b._id, 'confirmed', meetingLink)}
                                     className="h-14 px-8 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                   >
                                     Deploy Signal
                                   </button>
                                   <button 
                                     onClick={() => setSelectedBooking(null)}
                                     className="h-14 px-8 bg-slate-800 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest italic hover:text-white transition-all shadow-inner"
                                   >
                                     Abort
                                   </button>
                                </div>
                             </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Intel Module */}
                    <AnimatePresence>
                       {b.notes && (
                         <div className="px-10 py-5 bg-slate-950/40 border-t border-slate-800/50 flex items-start gap-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                               <Database size={14} />
                            </div>
                            <div>
                               <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Intelligence Briefing Attachment:</p>
                               <p className="text-sm text-slate-400 italic leading-relaxed mt-1">"{b.notes}"</p>
                            </div>
                         </div>
                       )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </StatusHandler>
      </div>
    </div>
  );
};

export default TrainerBookings;
