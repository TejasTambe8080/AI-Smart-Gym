import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { trainerService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Calendar, User, ShieldCheck, Search, Filter, X, ArrowRight, DollarSign, Award, Users as UsersIcon, Sparkles, Bot, Zap, Brain } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StatusHandler from '../components/StatusHandler';

const TrainerDiscovery = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpec, setFilterSpec] = useState('All');
  const [maxPrice, setMaxPrice] = useState(300);
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
      setLoading(true);
      setError(null);
      const res = await trainerService.getAll();
      setTrainers(res.data || []);
    } catch (error) {
      setError('Strategic connection lost. Accessing cache...');
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainers = useMemo(() => {
    return trainers.filter(t => {
      if (t.name === 'Marcus Aurelius') return false; // Featured separately
      const name = t.name || '';
      const specs = t.specialization || [];
      const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             specs.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSpec = filterSpec === 'All' || specs.includes(filterSpec);
      const matchesPrice = (t.pricePerSession || 0) <= maxPrice;
      return matchesSearch && matchesSpec && matchesPrice;
    });
  }, [trainers, searchTerm, filterSpec, maxPrice]);

  const allSpecializations = useMemo(() => {
    const specs = new Set(['All']);
    trainers.forEach(t => (t.specialization || []).forEach(s => specs.add(s)));
    return Array.from(specs);
  }, [trainers]);

  const handleBookSession = async (e) => {
    e.preventDefault();
    try {
      await trainerService.bookSession({
        trainerId: selectedTrainer._id,
        ...bookingData
      });
      toast.success('Strategic session secured! Link established.');
      setIsBookingModalOpen(false);
    } catch (error) {
      toast.error('Deployment failed. Neural path occupied.');
    }
  };

  return (
    <div className="space-y-10 pb-20 animate-enter">
      {/* Header & Elite Status */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter italic uppercase leading-none">
            Find <span className="text-blue-600">Trainers</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] flex items-center gap-2 italic">
            Connect with professional coaches and athletes <Award size={12} className="text-blue-500" />
          </p>
        </div>
        <div className="flex items-center gap-4 px-6 py-4 bg-slate-900 border border-slate-800 rounded-3xl group transition-all hover:border-blue-500/30">
           <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-black text-blue-400 italic">0{i}</div>
              ))}
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Found {trainers.length} active coaches</p>
        </div>
      </div>

      {/* Filters & Search Node */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-6 shadow-2xl">
         <div className="flex-1 relative group">
            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or workout type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 pl-16 pr-6 text-sm text-white placeholder-slate-700 focus:border-blue-500 outline-none transition-all italic tracking-tight"
            />
         </div>
         <div className="flex flex-wrap gap-4">
            <div className="relative">
               <Filter size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" />
               <select 
                 value={filterSpec}
                 onChange={(e) => setFilterSpec(e.target.value)}
                 className="bg-slate-950 border border-slate-800 rounded-2xl py-5 pl-14 pr-12 text-[10px] font-black text-white uppercase tracking-widest appearance-none outline-none focus:border-blue-500 cursor-pointer"
               >
                  {allSpecializations.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl py-3 px-8 flex items-center gap-6">
               <div className="space-y-1.5 min-w-[120px]">
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Price Max</p>
                    <p className="text-[10px] font-black text-blue-500 italic">${maxPrice}</p>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="500" 
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Neural AI Trainer - Special Genesis Node */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border-2 border-blue-600/30 rounded-[3rem] overflow-hidden group hover:border-blue-500 transition-all flex flex-col relative shadow-[0_0_50px_-12px_rgba(37,99,235,0.3)]"
        >
          <div className="absolute top-6 right-6 z-10">
             <div className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 backdrop-blur-2xl rounded-full border border-blue-500/30">
                <Sparkles size={12} className="text-blue-400 animate-pulse" />
                <span className="text-[11px] font-black text-blue-400 italic">GENESIS AI</span>
             </div>
          </div>
          
          <div className="h-72 overflow-hidden relative bg-slate-950 flex items-center justify-center">
             <Bot size={120} className="text-blue-600 opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent"></div>
             <div className="absolute bottom-6 left-8">
               <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">AI <span className="text-blue-600">Coach</span></h3>
               <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block italic">Neural Intelligence Unit</p>
             </div>
          </div>
          
          <div className="p-8 space-y-8 flex-1 flex flex-col">
            <div>
              <div className="flex flex-wrap gap-2">
                 {['Neural Form', 'Real-time Sync', 'Unlimited Access'].map((spec, i) => (
                   <span key={i} className="text-[9px] font-black text-blue-400 px-3 py-1 bg-blue-600/10 rounded-lg border border-blue-600/20 uppercase tracking-widest italic">
                     {spec}
                   </span>
                 ))}
              </div>
            </div>
            
            <p className="text-slate-200 text-sm font-bold italic leading-relaxed">
               "Advanced neural processing for instant form correction, elite workout planning, and biometric analysis."
            </p>
            
            <div className="pt-8 border-t border-slate-800 flex items-center justify-between mt-auto">
               <div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Price</p>
                  <p className="text-3xl font-black text-emerald-400 italic tracking-tighter">FREE<span className="text-[10px] text-slate-600 ml-1">/Unlimited</span></p>
               </div>
               <div className="text-right">
                  <Brain size={24} className="text-blue-500 ml-auto mb-1 animate-pulse" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">Instant Deploy</p>
               </div>
            </div>
            
            <div className="pt-4">
               <button 
                 onClick={() => navigate('/ai-coach')}
                 className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] italic flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-600/30 active:scale-95"
               >
                 Activate AI Coach <Zap size={16} fill="currentColor" />
               </button>
            </div>
          </div>
        </motion.div>

        {/* Featured Elite Trainer - Valid Human Proxy */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden group hover:border-blue-500/30 transition-all flex flex-col relative shadow-xl"
        >
           <div className="absolute top-6 right-6 z-10">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-2xl rounded-full border border-emerald-500/20">
                 <ShieldCheck size={12} className="text-emerald-500" />
                 <span className="text-[11px] font-black text-emerald-500 italic uppercase">Verified Pro</span>
              </div>
           </div>
           
           <div className="h-72 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1541534741688-6078c64b52d2?q=80&w=800&auto=format&fit=crop" 
                alt="Elite Trainer" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
              <div className="absolute bottom-6 left-8">
                 <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Tejas <span className="text-blue-600">Tambe</span></h3>
                 <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block">Elite Head Performance Coach</p>
              </div>
           </div>

           <div className="p-8 space-y-8 flex-1 flex flex-col">
              <div>
                 <div className="flex flex-wrap gap-2">
                    {['System Architect', 'Neural Form', 'Kinetic Linkage'].map((spec, i) => (
                       <span key={i} className="text-[9px] font-black text-slate-400 px-3 py-1 bg-slate-950 rounded-lg border border-slate-800 uppercase tracking-widest italic">
                          {spec}
                       </span>
                    ))}
                 </div>
              </div>
              <p className="text-slate-500 text-sm font-bold italic leading-relaxed line-clamp-3">
                 "Advanced biomechanical analysis and neurological motor control mapping for peak athletic performance."
              </p>
              <div className="pt-8 border-t border-slate-800 flex items-center justify-between mt-auto">
                 <div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Price</p>
                    <p className="text-3xl font-black text-white italic tracking-tighter">₹5000<span className="text-[10px] text-slate-600 ml-1">/Month</span></p>
                 </div>
                 <div className="text-right">
                    <UsersIcon size={24} className="text-slate-800 ml-auto mb-1 group-hover:text-blue-500 transition-colors" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">15+ Years Exp</p>
                 </div>
              </div>
              <div className="pt-4">
                 <button 
                    onClick={() => { 
                       const realTejas = trainers.find(t => t.name.includes('Tejas'));
                       setSelectedTrainer(realTejas || { _id: 'featured_pro_1', name: 'Tejas Tambe', pricePerSession: 5000 }); 
                       setIsBookingModalOpen(true); 
                    }}
                    className="w-full h-16 bg-blue-600/10 border border-blue-600/20 hover:bg-blue-600 hover:text-white text-blue-500 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] italic flex items-center justify-center gap-3 transition-all active:scale-95"
                 >
                    Book Performance Session <ArrowRight size={16} />
                 </button>
              </div>
           </div>
        </motion.div>

        {/* Dynamically Fetched Roster */}
        <AnimatePresence mode="popLayout">
          {filteredTrainers.map((trainer) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={trainer._id}
              className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden group hover:border-slate-700 transition-all flex flex-col relative shadow-xl"
            >
              <div className="absolute top-6 right-6 z-10">
                 <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-2xl rounded-full border border-white/5">
                    <Star size={12} fill="#3b82f6" className="text-blue-500" />
                    <span className="text-[11px] font-black text-white italic">{trainer.rating || '4.9'}</span>
                 </div>
              </div>
              
              <div className="h-72 overflow-hidden relative">
                 <img 
                   src={trainer.imageUrl || `https://ui-avatars.com/api/?name=${trainer.name}&background=0f172a&color=3b82f6&size=512`} 
                   alt={trainer.name} 
                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                 <div className="absolute bottom-6 left-8">
                   <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{trainer.name}</h3>
                   <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block">Professional Coach</p>
                 </div>
              </div>
              
              <div className="p-8 space-y-8 flex-1 flex flex-col">
                <div>
                  <div className="flex flex-wrap gap-2">
                     {(trainer.specialization || []).slice(0, 3).map((spec, i) => (
                       <span key={i} className="text-[9px] font-black text-slate-400 px-3 py-1 bg-slate-950 rounded-lg border border-slate-800 uppercase tracking-widest italic group-hover:border-slate-700 transition-colors">
                         {spec}
                       </span>
                     ))}
                  </div>
                </div>
                
                <p className="text-slate-500 text-sm font-bold italic leading-relaxed line-clamp-3">
                   "{trainer.bio || 'Professional trainer focused on performance optimization and form correction.'}"
                </p>
                
                <div className="pt-8 border-t border-slate-800 flex items-center justify-between mt-auto">
                   <div>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Price</p>
                      <p className="text-3xl font-black text-white italic tracking-tighter">${trainer.pricePerSession}<span className="text-[10px] text-slate-600 ml-1">/Session</span></p>
                   </div>
                   <div className="text-right">
                      <UsersIcon size={24} className="text-slate-800 ml-auto mb-1 group-hover:text-blue-500 transition-colors" />
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">{trainer.experience}+ Years Exp</p>
                   </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                   <button 
                     onClick={() => { setSelectedTrainer(trainer); setIsBookingModalOpen(true); }}
                     className="flex-1 h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] italic flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-600/30 active:scale-95"
                   >
                     Book Session <ArrowRight size={16} />
                   </button>
                   <button className="w-16 h-16 bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-2xl flex items-center justify-center text-slate-600 hover:text-white transition-all shadow-inner">
                      <MessageSquare size={20} />
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-[3.5rem] p-12 w-full max-w-xl shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-10 -left-10 text-[200px] opacity-5 font-black italic pointer-events-none grayscale">SYNC</div>
            <button onClick={() => setIsBookingModalOpen(false)} className="absolute top-10 right-10 text-slate-600 hover:text-white transition-colors p-2 bg-slate-950 rounded-full border border-slate-800"><X size={24} /></button>
            
            <div className="space-y-3 mb-12 relative z-10">
               <h3 className="text-4xl lg:text-5xl font-black text-white italic uppercase tracking-tighter">Book <span className="text-blue-600">Session</span></h3>
               <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] flex items-center gap-2 italic">Trainer: {selectedTrainer?.name}</p>
            </div>

            <form onSubmit={handleBookSession} className="space-y-8 relative z-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 italic flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Session Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                   {['Video Call', 'Workout Review', 'Chat Coaching', 'Custom Session'].map(type => (
                     <button
                       key={type}
                       type="button"
                       onClick={() => setBookingData({...bookingData, sessionType: type})}
                       className={`h-16 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest border transition-all ${bookingData.sessionType === type ? 'bg-blue-600 border-blue-500 text-white shadow-2xl shadow-blue-600/30' : 'bg-slate-950 border-slate-800 text-slate-700 hover:border-slate-600 hover:text-slate-400'}`}
                     >
                       {type}
                     </button>
                   ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 italic flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Date & Time
                </label>
                <input 
                   type="datetime-local" 
                   className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-8 py-5 text-sm text-white focus:border-blue-500 outline-none transition-all font-mono tracking-tighter"
                   onChange={(e) => setBookingData({...bookingData, scheduledAt: e.target.value})}
                   required
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 italic flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Additional Notes
                </label>
                <textarea 
                  placeholder="Tell your trainer about your goals or any injuries..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-3xl px-8 py-5 text-sm text-white focus:border-blue-500 outline-none transition-all italic resize-none h-32"
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                ></textarea>
              </div>

              <div className="pt-8">
                <button 
                  type="submit"
                  className="w-full h-20 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.4em] italic transition-all shadow-2xl shadow-blue-600/40 active:scale-95"
                >
                  Confirm Booking
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
