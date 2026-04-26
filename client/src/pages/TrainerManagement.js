// Trainer Management Page - Full CRUD for Trainers
import React, { useState, useEffect } from 'react';
import { trainerService } from '../services/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, Edit2, Shield, User, Mail, Briefcase, DollarSign, ChevronRight, X, Check, Save } from 'lucide-react';
import StatusHandler from '../components/StatusHandler';

const TrainerManagement = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123', // Default for now
    specialization: '',
    experience: '',
    pricePerSession: '',
    bio: ''
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const res = await trainerService.getAll();
      // Ensure we get an array
      setTrainers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to fetch trainers. Neural link unstable.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTrainer = async (e) => {
    e.preventDefault();
    try {
      const res = await trainerService.register(formData);
      if (res.data.trainer) {
        setTrainers([...trainers, res.data.trainer]);
        setIsAdding(false);
        resetForm();
        toast.success('Trainer added to personnel roster.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Protocol failed.');
    }
  };

  const handleUpdateTrainer = async (id) => {
    try {
      const res = await trainerService.updateProfile(id, formData);
      setTrainers(trainers.map(t => t._id === id ? res.data : t));
      setEditingId(null);
      resetForm();
      toast.success('Personnel profile recalibrated.');
    } catch (err) {
      toast.error('Update failed.');
    }
  };

  const handleDeleteTrainer = async (id) => {
    if (!window.confirm('Decommission this trainer? This cannot be undone.')) return;
    try {
      await trainerService.deleteTrainer(id);
      setTrainers(trainers.filter(t => t._id !== id));
      toast.success('Personnel record purged.');
    } catch (err) {
      toast.error('Purge failed.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: 'password123',
      specialization: '',
      experience: '',
      pricePerSession: '',
      bio: ''
    });
  };

  const startEdit = (trainer) => {
    setEditingId(trainer._id);
    setFormData({
      name: trainer.name,
      email: trainer.email,
      specialization: Array.isArray(trainer.specialization) ? trainer.specialization.join(', ') : trainer.specialization,
      experience: trainer.experience,
      pricePerSession: trainer.pricePerSession,
      bio: trainer.bio || ''
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-12 animate-enter text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
                 <Shield size={10} /> Personnel Management // Level 4
              </div>
              <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter uppercase leading-none">
                Trainer <span className="text-blue-600">Personnel</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest italic leading-none">
                CRUD operations for personnel roster and technical specialization mapping.
              </p>
           </div>
           
           {!isAdding && !editingId && (
             <button 
               onClick={() => { setIsAdding(true); resetForm(); }}
               className="h-16 px-10 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 transition-all flex items-center gap-4 group"
             >
                <UserPlus size={18} />
                Add Trainer
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
           )}
        </div>

        {/* Add/Edit Form Overlay */}
        <AnimatePresence>
          {(isAdding || editingId) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl space-y-10"
            >
               <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-4">
                     <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
                     {isAdding ? 'Initialization Protocol' : 'Profile Recalibration'}
                  </h3>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }} className="p-3 hover:bg-slate-800 rounded-xl transition-colors">
                     <X size={24} className="text-slate-500" />
                  </button>
               </div>

               <form onSubmit={isAdding ? handleAddTrainer : (e) => { e.preventDefault(); handleUpdateTrainer(editingId); }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Identity</label>
                        <div className="relative">
                           <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                           <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl pl-16 pr-6 font-black text-white outline-none focus:border-blue-500 transition-all" placeholder="e.g. Marcus Aurelius" required />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Communication Uplink (Email)</label>
                        <div className="relative">
                           <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                           <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl pl-16 pr-6 font-black text-white outline-none focus:border-blue-500 transition-all" placeholder="trainer@formfix.ai" required />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Technical Specialization (Comma separated)</label>
                        <div className="relative">
                           <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                           <input type="text" name="specialization" value={formData.specialization} onChange={handleInputChange} className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl pl-16 pr-6 font-black text-white outline-none focus:border-blue-500 transition-all" placeholder="Squats, Hypertrophy, Neural Form" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Cycle Exp (Years)</label>
                           <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl px-6 font-black text-white outline-none focus:border-blue-500 transition-all" placeholder="5" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Unit Price ($)</label>
                           <div className="relative">
                              <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                              <input type="number" name="pricePerSession" value={formData.pricePerSession} onChange={handleInputChange} className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 font-black text-white outline-none focus:border-blue-500 transition-all" placeholder="50" />
                           </div>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Personnel Biography</label>
                        <textarea name="bio" value={formData.bio} onChange={handleInputChange} className="w-full h-[148px] bg-slate-950 border border-slate-800 rounded-2xl p-6 font-black text-white outline-none focus:border-blue-500 transition-all resize-none" placeholder="Elite form specialist focusing on..." />
                     </div>
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-6 pt-4">
                     <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }} className="h-16 px-10 bg-slate-950 border border-slate-800 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest">Abort</button>
                     <button type="submit" className="h-16 px-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3">
                        <Save size={18} />
                        {isAdding ? 'Commit Roster' : 'Apply Changes'}
                     </button>
                  </div>
               </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Personnel Roster View */}
        <StatusHandler loading={loading} error={error} empty={trainers.length === 0} emptyMessage="Personnel roster is currently empty. Initialize a new trainer.">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainers.map((trainer) => (
                <motion.div 
                  key={trainer._id}
                  layout
                  className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 group hover:border-blue-500/30 transition-all relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 p-8 opacity-5 grayscale pointer-events-none text-9xl italic font-black">{trainer.name[0]}</div>
                   
                   <div className="relative z-10 space-y-8">
                      <div className="flex items-center gap-6">
                         <div className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 group-hover:text-blue-500 transition-all">
                            {trainer.imageUrl ? <img src={trainer.imageUrl} alt={trainer.name} className="w-full h-full object-cover rounded-3xl" /> : '👨‍🏫'}
                         </div>
                         <div>
                            <h4 className="text-xl font-black italic uppercase tracking-tighter text-white">{trainer.name}</h4>
                            <div className="flex items-center gap-2">
                               <span className={`w-1.5 h-1.5 rounded-full ${trainer.isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                               <p className={`text-[10px] font-black uppercase tracking-widest ${trainer.isVerified ? 'text-emerald-500' : 'text-amber-500'}`}>
                                  {trainer.isVerified ? 'Verified' : 'Pending Sync'}
                               </p>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex flex-wrap gap-2">
                            {(Array.isArray(trainer.specialization) ? trainer.specialization : []).map(s => (
                              <span key={s} className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-tighter italic">{s}</span>
                            ))}
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                               <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Experience</p>
                               <p className="font-black text-white italic">{trainer.experience} Cycles</p>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                               <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Rate</p>
                               <p className="font-black text-emerald-500 italic">${trainer.pricePerSession}/hr</p>
                            </div>
                         </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                         <button 
                           onClick={() => startEdit(trainer)}
                           className="flex-1 h-14 bg-slate-950 border border-slate-800 text-slate-400 hover:text-blue-500 hover:border-blue-500/50 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                         >
                            <Edit2 size={14} /> Recalibrate
                         </button>
                         <button 
                           onClick={() => handleDeleteTrainer(trainer._id)}
                           className="w-14 h-14 bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-500/50 rounded-2xl flex items-center justify-center transition-all"
                         >
                            <Trash2 size={18} />
                         </button>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </StatusHandler>
      </div>
    </div>
  );
};

export default TrainerManagement;
