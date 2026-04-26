import React, { useState, useEffect } from 'react';
import { trainerService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, ArrowUpRight, Target, Brain, Activity, MessageSquare, ShieldAlert, Database, ChevronRight, BarChart2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StatusHandler from '../components/StatusHandler';

const TrainerClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await trainerService.getClients();
      setClients(res.data);
    } catch (error) {
      setError('Neural data repository synchronization failed. Personnel files offline.');
    } finally {
      setLoading(false);
    }
  };

  const sendSuggestion = async (clientName) => {
    toast.success(`Tactical directive sent to ${clientName.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 lg:p-10 space-y-10 animate-enter scrollbar-hide">
      
      {/* Header Module */}
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
           <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600/10 border border-emerald-600/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-500">
                 <Users size={10} /> Active Personnel // Human Assets
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                Personnel <span className="text-blue-600">Roster</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] italic leading-none">
                Biological performance monitoring & tactical intervention.
              </p>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <button 
                onClick={fetchClients}
                className="h-16 px-10 bg-slate-900 border border-slate-800 hover:border-slate-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3"
              >
                <Activity size={18} /> Refresh Biometrics
              </button>
           </div>
        </div>

        <StatusHandler loading={loading} error={error} empty={clients.length === 0} emptyMessage="No personnel records localized in current sector.">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            <AnimatePresence>
               {clients.map((client, index) => (
                 <motion.div
                   key={client._id}
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   transition={{ delay: index * 0.05 }}
                   className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden group hover:border-blue-600/30 transition-all shadow-2xl flex flex-col relative"
                 >
                   {/* Elite Level Ornament */}
                   {client.score > 90 && (
                     <div className="absolute top-6 right-6 z-10">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 rounded-full shadow-lg shadow-blue-600/40 border border-blue-400/20">
                           <Target size={12} className="text-white" />
                           <span className="text-[9px] font-black uppercase tracking-widest text-white italic">Elite Node</span>
                        </div>
                     </div>
                   )}

                   <div className="p-8 lg:p-10 space-y-8 flex-1 flex flex-col">
                     {/* Identity Bridge */}
                     <div className="flex items-center gap-6">
                       <div className="relative">
                          <div className="w-20 h-20 bg-slate-950 rounded-[2rem] border border-slate-800 flex items-center justify-center text-slate-700 text-3xl group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all shadow-inner overflow-hidden font-black italic">
                             {client.imageUrl ? <img src={client.imageUrl} alt="" className="w-full h-full object-cover" /> : client.name?.[0]}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-900 rounded-full shadow-lg shadow-emerald-500/50"></div>
                       </div>
                       <div className="space-y-1">
                         <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none group-hover:text-blue-400 transition-colors">
                           {client.name}
                         </h3>
                         <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] italic">
                            Personnel ID: {client._id.slice(-8).toUpperCase()}
                         </p>
                       </div>
                     </div>

                     {/* Biometric Telemetry */}
                     <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-950 p-5 rounded-[1.5rem] border border-slate-800 shadow-inner group/stat relative overflow-hidden">
                         <div className="absolute -right-2 -bottom-2 opacity-5 text-4xl grayscale group-hover:scale-110 transition-transform"><Activity size={40} /></div>
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Neural Fidelity</p>
                         <div className="flex items-end gap-1 relative z-10">
                           <span className={`text-3xl font-black italic tracking-tighter ${client.score > 80 ? 'text-blue-500' : 'text-amber-500'}`}>
                             {client.score || 0}%
                           </span>
                         </div>
                       </div>
                       <div className="bg-slate-950 p-5 rounded-[1.5rem] border border-slate-800 shadow-inner group/stat relative overflow-hidden">
                          <div className="absolute -right-2 -bottom-2 opacity-5 text-4xl grayscale group-hover:scale-110 transition-transform"><Brain size={40} /></div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">Pulse Path</p>
                          <div className="flex items-end gap-1 relative z-10">
                            <span className="text-3xl font-black italic tracking-tighter text-emerald-500">
                              {client.streak || 0} <span className="text-xs uppercase text-slate-600 mb-1">D</span>
                            </span>
                          </div>
                       </div>
                     </div>

                     {/* Structural Integrity Analysis */}
                     <div className="space-y-4">
                       <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic flex items-center gap-2">
                          <Database size={12} /> Deficit Mapping
                       </p>
                       <div className="flex flex-wrap gap-2 min-h-[32px]">
                         {client.weakMuscles && client.weakMuscles.length > 0 ? (
                           client.weakMuscles.map(m => (
                             <span key={m} className="px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl italic">
                               {m}
                             </span>
                           ))
                         ) : (
                           <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl italic">
                             Nominal Status Verified
                           </span>
                         )}
                       </div>
                     </div>

                     {/* Tactical Execution Bridge */}
                     <div className="pt-8 border-t border-slate-800 flex gap-4 mt-auto">
                        <button 
                          onClick={() => sendSuggestion(client.name)}
                          className="flex-1 h-14 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 active:scale-95 group/btn"
                        >
                          <MessageSquare size={16} className="group-hover/btn:-rotate-12 transition-transform" />
                          Deploy Intel
                        </button>
                        <button className="w-14 h-14 bg-slate-950 border border-slate-800 hover:border-slate-500 text-slate-500 hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-inner">
                           <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                     </div>
                   </div>
                 </motion.div>
               ))}
            </AnimatePresence>
          </div>
        </StatusHandler>
      </div>
    </div>
  );
};

export default TrainerClients;
