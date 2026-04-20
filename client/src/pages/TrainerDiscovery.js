import React, { useState, useEffect } from 'react';
import { trainerService } from '../services/api';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Calendar, User, ShieldCheck, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TrainerDiscovery = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    sessionType: 'Video Call',
    scheduledAt: '',
    notes: ''
  });

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const res = await trainerService.getAll();
      
      // If DB is empty, provide some elite fallback trainers for the 60 sec demo automatically injected.
      if (res.data.length === 0) {
         setTrainers([
           { _id: 't1', name: 'Althea Vance', specialization: ['Hypertrophy', 'Biomechanics'], rating: 4.9, clients: [1,2,3,4,5], pricePerSession: 80, bio: 'Former competitive bodybuilder. Specializes in neuro-muscular adaptation and symmetry.', imageUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
           { _id: 't2', name: 'Marcus K.', specialization: ['Mobility', 'Rehab'], rating: 4.8, clients: [1,2,3], pricePerSession: 65, bio: 'Physical therapist turned elite coach. Fixes posture deviations and joint impingements.', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }
         ]);
      } else {
         setTrainers(res.data);
      }
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load trainers');
      setLoading(false);
    }
  };

  const handleBookSession = async (e) => {
    e.preventDefault();
    try {
      if(selectedTrainer._id.startsWith('t')) {
         toast.success('Demo Session booked successfully!');
         setIsBookingModalOpen(false);
         return;
      }
      await trainerService.bookSession({
        trainerId: selectedTrainer._id,
        ...bookingData
      });
      toast.success('Session booked successfully!');
      setIsBookingModalOpen(false);
    } catch (error) {
      toast.error('Booking failed');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full text-white">Loading Experts...</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">Elite Trainers</h2>
          <p className="text-slate-400 font-medium">Expert guidance to accelerate your physical evolution.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full">
          <ShieldCheck size={16} className="text-blue-400" />
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest text-white">Verified Platform Professionals</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.length > 0 ? trainers.map((trainer) => (
          <motion.div 
            key={trainer._id}
            whileHover={{ y: -5 }}
            className="saas-card group relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
              <Star size={12} fill="currentColor" className="text-yellow-400" />
              <span className="text-xs font-bold text-white">{trainer.rating}</span>
            </div>
            
            <img 
              src={trainer.imageUrl} 
              alt={trainer.name} 
              className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-500"
            />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors uppercase italic">{trainer.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {trainer.specialization.map((spec, i) => (
                    <span key={i} className="text-[10px] font-bold bg-slate-900 text-slate-400 px-2 py-1 rounded-md border border-slate-800">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-slate-400 text-sm line-clamp-2 italic">{trainer.bio}</p>
              
              <div className="flex items-center gap-4 pt-2 border-t border-slate-700/50">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center overflow-hidden">
                       <User size={12} className="text-slate-400" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{trainer.clients.length}+ Active Clients</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => { setSelectedTrainer(trainer); setIsBookingModalOpen(true); }}
                  className="saas-button !bg-slate-900 !border-slate-800 hover:!bg-slate-800 text-xs py-2"
                >
                  <Calendar size={14} /> Book Session
                </button>
                <button className="saas-button text-xs py-2">
                  <MessageSquare size={14} /> Chat
                </button>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center saas-card italic text-slate-500">
            No elite trainers available in your sector yet.
          </div>
        )}
      </div>

      {/* Booking Modal (Simplified) */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-md shadow-2xl"
          >
            <h3 className="text-2xl font-black text-white italic uppercase mb-6">Secure Session</h3>
            <form onSubmit={handleBookSession} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Session Protocol</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  value={bookingData.sessionType}
                  onChange={(e) => setBookingData({...bookingData, sessionType: e.target.value})}
                >
                  <option>Video Call</option>
                  <option>Chat Session</option>
                  <option>Form Review</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Deployment Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-blue-500 outline-none"
                  onChange={(e) => setBookingData({...bookingData, scheduledAt: e.target.value})}
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsBookingModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl font-bold uppercase text-xs tracking-widest transition-all"
                >
                  Abort
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-blue-600/20"
                >
                  Confirm
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TrainerDiscovery;
