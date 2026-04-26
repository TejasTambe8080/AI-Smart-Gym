import React, { useState, useEffect } from 'react';
import { trainerService } from '../services/api';
import { motion } from 'framer-motion';
import { User, Briefcase, Award, DollarSign, FileText, Save, Image as ImageIcon, Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TrainerProfile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [profile, setProfile] = useState({
    name: user.name || '',
    experience: user.experience || 0,
    specialization: Array.isArray(user.specialization) ? user.specialization.join(', ') : (user.specialization || ''),
    pricePerSession: user.pricePerSession || 0,
    bio: user.bio || '',
    imageUrl: user.imageUrl || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const dataToSave = {
        ...profile,
        specialization: profile.specialization.split(',').map(s => s.trim())
      };
      const res = await trainerService.updateProfile(user.id || user._id, dataToSave);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success('System credentials updated successfully');
    } catch (error) {
      toast.error('Failed to update neural profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
          Manage <span className="text-blue-500">Profile</span>
        </h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 italic">
          Neural Identity & Deployment Credentials
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 rounded-2xl bg-slate-950 border-2 border-slate-800 overflow-hidden flex items-center justify-center">
                {profile.imageUrl ? (
                  <img src={profile.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-slate-700" />
                )}
              </div>
              <div className="absolute inset-0 bg-blue-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left w-full">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Operational Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="block w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-white font-bold italic focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g. Alex Johnson"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase size={16} className="text-blue-400" />
              <h3 className="text-xs font-black text-white uppercase italic tracking-widest">Experience & Specialization</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Field Experience (Years)</label>
              <input
                type="number"
                name="experience"
                value={profile.experience}
                onChange={handleChange}
                className="block w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-white font-mono focus:border-blue-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core Specializations (Comma Separated)</label>
              <input
                type="text"
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
                className="block w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-white focus:border-blue-500 outline-none"
                placeholder="Strength, HIIT, Yoga..."
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-emerald-400" />
              <h3 className="text-xs font-black text-white uppercase italic tracking-widest">Pricing & Availability</h3>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Price Per Deployment ($)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <DollarSign size={16} />
                </div>
                <input
                  type="number"
                  name="pricePerSession"
                  value={profile.pricePerSession}
                  onChange={handleChange}
                  className="block w-full bg-slate-950 border border-slate-800 pl-10 pr-4 py-3 rounded-xl text-white font-mono focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
               <p className="text-[10px] font-bold text-emerald-400 leading-relaxed uppercase italic">
                 Top earners on FormFix maintain an average session price of $45-$60. Competitive pricing increases deployment frequency.
               </p>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-purple-400" />
            <h3 className="text-xs font-black text-white uppercase italic tracking-widest">Operational Bio</h3>
          </div>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows="4"
            className="block w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-white focus:border-blue-500 outline-none resize-none leading-relaxed"
            placeholder="Tell your clients about your training methodology and mission..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <Save size={20} />
              Synchronize Credentials
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TrainerProfile;
