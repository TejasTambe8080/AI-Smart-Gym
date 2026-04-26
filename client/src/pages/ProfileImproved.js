// Profile Page Component - Modern Premium Design
import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Award, 
  Activity, 
  Shield, 
  Zap, 
  Mail, 
  Phone, 
  Calendar, 
  Ruler, 
  Weight, 
  Target, 
  Save, 
  X, 
  Edit3,
  Lock,
  Cloud,
  Mic,
  Eye,
  RefreshCw
} from 'lucide-react';
import StatusHandler from '../components/StatusHandler';

const ProfileImproved = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await userService.getProfile();
      setUser(res.data.user);
      setFormData(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      toast.error('Neural identity sync failed.');
      const cached = JSON.parse(localStorage.getItem('user'));
      if (cached) {
        setUser(cached);
        setFormData(cached);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const res = await userService.updateProfile(formData);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setIsEditing(false);
      toast.success('Neural credentials synchronized. ✨');
    } catch (err) {
      toast.error('Synchronization failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 lg:p-10 animate-enter scrollbar-hide">
      <StatusHandler loading={loading}>
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header & Control Segment */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-3">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400">
                  <Shield size={12} className="animate-pulse" />
                  Neural Encryption // Identity Verified
               </div>
               <h1 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                 Identity <span className="text-blue-600">Architect</span>
               </h1>
               <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] flex items-center gap-2 italic">
                 Biometric parameters and neural preferences.
               </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`h-16 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-3 shadow-xl ${
                isEditing 
                  ? 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20'
              }`}
            >
              {isEditing ? <><X size={18} /> Abort Sync</> : <><Edit3 size={18} /> Modify Credentials</>}
            </button>
          </div>

          {/* Core Profile Node */}
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 lg:p-14 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 italic font-black text-[200px] pointer-events-none grayscale uppercase tracking-tighter">Identity</div>
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
               <div className="relative group/avatar">
                  <div className="w-40 h-40 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center text-6xl font-black text-white shadow-[0_20px_50px_rgba(37,99,235,0.3)] ring-4 ring-slate-950/50 group-hover:scale-105 transition-transform duration-700">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-500 border-4 border-slate-950 rounded-2xl flex items-center justify-center shadow-2xl">
                     <Shield size={20} className="text-white" />
                  </div>
               </div>
               <div className="text-center md:text-left space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{user?.name}</h2>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                     <p className="text-blue-500 font-black uppercase tracking-widest text-[11px] italic bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-full">Operative // Level {user?.level || 1}</p>
                     <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] italic">{user?.email}</p>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                     <div className="flex items-center gap-3 px-6 py-3 bg-slate-950 border border-slate-800 rounded-2xl">
                        <Activity size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Streak: {user?.streak || 0} Cycles</span>
                     </div>
                     <div className="flex items-center gap-3 px-6 py-3 bg-slate-950 border border-slate-800 rounded-2xl">
                        <Target size={14} className="text-purple-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{user?.fitnessGoal?.split('_').join(' ') || 'Optimization'}</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="flex gap-4 p-2 bg-slate-900/50 border border-slate-800 rounded-[2rem] w-fit overflow-x-auto scrollbar-hide">
            {[
              { id: 'personal', label: 'Identity Matrix', icon: User },
              { id: 'fitness', label: 'Biometric Stack', icon: Activity },
              { id: 'settings', label: 'Neural Logic', icon: Settings },
              { id: 'stats', label: 'Legacy Vault', icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <Icon size={14} /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Orchestrator */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 lg:p-14 min-h-[500px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none"></div>
                
                {activeTab === 'personal' && (
                  <div className="space-y-10 animate-enter relative z-10">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Core identity</h3>
                      <div className="h-0.5 w-12 bg-blue-600"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2 italic">
                           <User size={12} className="text-blue-500" /> Operative Alias
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl px-6 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all italic disabled:opacity-50 transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2 italic">
                           <Mail size={12} className="text-blue-500" /> Communication Node
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl px-6 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all italic disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2 italic">
                         <Phone size={12} className="text-blue-500" /> Secure Frequency
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="+1 (555) 000-0000"
                        className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl px-6 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all italic disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2 italic">
                         <Edit3 size={12} className="text-blue-500" /> Operational Biography
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        rows="4"
                        className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all italic disabled:opacity-50 resize-none"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'fitness' && (
                  <div className="space-y-10 animate-enter relative z-10">
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Biometric Vectors</h3>
                       <div className="h-0.5 w-12 bg-purple-600"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2 italic">
                           <Calendar size={12} className="text-purple-500" /> Temporal Age
                        </label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl px-6 text-sm font-bold text-white focus:border-purple-500 outline-none transition-all italic disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2 italic">
                           <Ruler size={12} className="text-purple-500" /> Height (cm)
                        </label>
                        <input
                          type="number"
                          name="height"
                          value={formData.height || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl px-6 text-sm font-bold text-white focus:border-purple-500 outline-none transition-all italic disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2 italic">
                           <Weight size={12} className="text-purple-500" /> Weight (kg)
                        </label>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight || ''}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl px-6 text-sm font-bold text-white focus:border-purple-500 outline-none transition-all italic disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2 italic">
                           <Activity size={12} className="text-purple-500" /> Experience Tier
                        </label>
                        <div className="relative">
                           <select
                             name="fitnessLevel"
                             value={formData.fitnessLevel || 'beginner'}
                             onChange={handleChange}
                             disabled={!isEditing}
                             className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white appearance-none outline-none focus:border-purple-500 cursor-pointer disabled:opacity-50"
                           >
                             <option value="beginner">Beginner // L1</option>
                             <option value="intermediate">Intermediate // L2</option>
                             <option value="advanced">Advanced // L3</option>
                           </select>
                           <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700">▼</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 flex items-center gap-2 italic">
                           <Target size={12} className="text-purple-500" /> Primary Objective
                        </label>
                        <div className="relative">
                           <select
                             name="fitnessGoal"
                             value={formData.fitnessGoal || 'general_fitness'}
                             onChange={handleChange}
                             disabled={!isEditing}
                             className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white appearance-none outline-none focus:border-purple-500 cursor-pointer disabled:opacity-50"
                           >
                             <option value="general_fitness">General Fitness</option>
                             <option value="weight_loss">Weight Loss</option>
                             <option value="muscle_gain">Hypertrophy Gain</option>
                             <option value="endurance">Stamina Threshold</option>
                           </select>
                           <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700">▼</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-10 animate-enter relative z-10">
                    <div className="space-y-2">
                       <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Preference Nodes</h3>
                       <div className="h-0.5 w-12 bg-amber-600"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: 'Cloud Sync', desc: 'Institutional data bridge auto-synchronization.', icon: Cloud },
                        { label: 'Voice Coaching', desc: 'Real-time neural voice feedback sequences.', icon: Mic },
                        { label: 'Biometric Lock', desc: 'Identity verification via neural hardware tether.', icon: Lock },
                        { label: 'Entity Profile', desc: 'Public visibility of operative achievements.', icon: Eye }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-8 bg-slate-950 border border-slate-800 rounded-3xl group hover:border-amber-500/20 transition-all">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                               <item.icon size={14} className="text-amber-500" />
                               <p className="text-[10px] font-black text-white uppercase tracking-widest">{item.label}</p>
                            </div>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic">{item.desc}</p>
                          </div>
                          <div className="w-12 h-6 bg-slate-800 rounded-full relative p-1 cursor-not-allowed">
                             <div className="w-4 h-4 bg-amber-500 rounded-full shadow-lg shadow-amber-500/20"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'stats' && (
                  <div className="h-full flex flex-col items-center justify-center space-y-10 animate-enter relative z-10 py-10">
                    <div className="w-32 h-32 bg-slate-950 rounded-[2.5rem] border border-slate-800 flex items-center justify-center text-5xl shadow-inner relative group/vault">
                       <div className="absolute inset-0 bg-blue-600/5 rounded-[2.5rem] animate-pulse"></div>
                       <Lock size={40} className="text-slate-800 transition-colors group-hover/vault:text-blue-500" />
                    </div>
                    <div className="text-center space-y-4">
                       <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Legacy Vault locked</h3>
                       <p className="text-slate-500 font-bold text-xs uppercase tracking-widest italic max-w-sm">Complete high-intensity protocols and reach Level 5 to unlock institutional achievements.</p>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-16 h-16 bg-slate-950 border border-slate-800 border-dashed rounded-2xl flex items-center justify-center grayscale opacity-20 hover:opacity-50 transition-all cursor-not-allowed">
                          🔒
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isEditing && (activeTab === 'personal' || activeTab === 'fitness') && (
                  <div className="mt-12 pt-12 border-t border-slate-800 relative z-10">
                    <button
                      onClick={handleSave}
                      className="h-20 w-full bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.4em] italic transition-all shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-4 active:scale-95"
                    >
                      <Save size={20} /> Authorize Synchronization
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Strategic Intelligence Panel */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-500/20 rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 text-[180px] text-white opacity-5 font-black italic pointer-events-none grayscale uppercase tracking-tighter">Elite</div>
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[9px] font-black uppercase tracking-widest text-white w-fit">
                      <Award size={10} /> Tier: Sovereign Operative
                   </div>
                   <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Institutional <br />Membership</h4>
                   <p className="text-blue-100/70 text-xs font-bold leading-relaxed italic">The FormFix Protocol granted you terminal access to all neural modules and real-time biomechanical analysis nodes.</p>
                   <div className="space-y-2 pt-4">
                      <div className="flex justify-between items-end">
                         <p className="text-[9px] font-black uppercase text-white/60 tracking-widest">Protocol Fidelity</p>
                         <p className="text-[9px] font-black uppercase text-white tracking-widest">100%</p>
                      </div>
                      <div className="h-2 bg-black/20 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                        ></motion.div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-8 shadow-xl">
                <h4 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                   <Shield size={20} className="text-blue-500" /> Identity Health
                </h4>
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800 transition-colors hover:border-emerald-500/20">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Neural Security</span>
                    <span className="text-[11px] font-black text-emerald-500 italic uppercase">Optimized</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800 transition-colors hover:border-blue-500/20">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Data Continuity</span>
                    <span className="text-[11px] font-black text-blue-500 italic uppercase flex items-center gap-2">
                       <RefreshCw size={12} className="animate-spin-slow" /> Synced
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StatusHandler>
    </div>
  );
};

export default ProfileImproved;
