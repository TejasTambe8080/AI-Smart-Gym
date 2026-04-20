// Profile Page Component - Modern Premium Design
import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { toast } from 'react-hot-toast';
import SkeletonLoader from '../components/SkeletonLoader';

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
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
      setFormData(userData);
    } catch (err) {
      console.error('Failed to load profile', err);
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
      // Simulate API call
      setUser(formData);
      localStorage.setItem('user', JSON.stringify(formData));
      setIsEditing(false);
      toast.success('Profile updated successfully! ✨');
    } catch (err) {
      console.error('Failed to save profile', err);
      toast.error('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 space-y-8 animate-enter">
        <div className="h-40 w-full skeleton rounded-3xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 h-96 skeleton rounded-3xl"></div>
           <div className="h-64 skeleton rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900/50 p-6 lg:p-8 animate-enter">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tight">👤 Account Settings</h1>
            <p className="text-slate-400 font-medium">Manage your personal information and preferences.</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing ? "btn-secondary" : "btn-primary"}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Identity Card */}
        <div className="glass-card p-8 rounded-[2rem] border-slate-700/50 overflow-hidden relative group">
          <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
             <span className="text-[200px]">👤</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Avatar */}
            <div className="relative group/avatar">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-blue-500/20 ring-4 ring-slate-800/50">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-bold">Change</span>
                </div>
              )}
            </div>

            <div className="text-center md:text-left space-y-2">
              <h2 className="text-3xl font-black text-white">{user?.name}</h2>
              <p className="text-blue-400 font-bold">{user?.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <span className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-xs font-bold text-slate-300 uppercase tracking-widest">
                  🔥 Level {user?.level || 1}
                </span>
                <span className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-full text-xs font-bold text-slate-300 uppercase tracking-widest">
                  🏋️ {user?.fitnessGoal?.split('_').join(' ') || 'General Fitness'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'personal', label: 'Identity', icon: '👤' },
            { id: 'fitness', label: 'Body Metrics', icon: '📏' },
            { id: 'settings', label: 'Preferences', icon: '⚙️' },
            { id: 'stats', label: 'Achievements', icon: '🏆' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                activeTab === tab.id
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              <span className="text-lg">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="premium-card p-8 min-h-[400px]">
              {activeTab === 'personal' && (
                <div className="space-y-8 animate-enter">
                  <h3 className="text-xl font-bold text-white mb-6">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Display Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Contact Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+1 (555) 000-0000"
                      className="input-field"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Biography</label>
                    <textarea
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows="4"
                      className="input-field resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'fitness' && (
                <div className="space-y-8 animate-enter">
                  <h3 className="text-xl font-bold text-white mb-6">Bio-Physical Data</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Chronological Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Experience Tier</label>
                      <select
                        name="fitnessLevel"
                        value={formData.fitnessLevel || 'beginner'}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field appearance-none"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Primary Objective</label>
                      <select
                        name="fitnessGoal"
                        value={formData.fitnessGoal || 'general_fitness'}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="input-field appearance-none"
                      >
                        <option value="general_fitness">General Fitness</option>
                        <option value="weight_loss">Weight Loss</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="endurance">Endurance</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-8 animate-enter">
                  <h3 className="text-xl font-bold text-white mb-6">User Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Cloud Sync', desc: 'Auto-sync workout data to server' },
                      { label: 'Voice Coaching', desc: 'Live AI voice feedback during training' },
                      { label: 'Biometric Login', desc: 'Secure login via face/touch ID' },
                      { label: 'Public Profile', desc: 'Allow others to see your level/badges' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-5 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <div>
                          <p className="font-bold text-white">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                        <div className="w-12 h-6 bg-slate-700 rounded-full relative p-1 cursor-pointer">
                           <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-8 animate-enter text-center py-10">
                  <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-5xl">🏆</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">Unlock Your Potential</h3>
                  <p className="text-slate-400 max-w-sm mx-auto">Complete daily challenges and reach milestone levels to earn unique digital badges.</p>
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="aspect-square bg-slate-800/50 border border-slate-700 border-dashed rounded-2xl flex items-center justify-center opacity-30 grayscale">
                        🔒
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isEditing && (activeTab === 'personal' || activeTab === 'fitness') && (
                <div className="mt-10 pt-10 border-t border-slate-800">
                  <button
                    onClick={handleSave}
                    className="btn-primary w-full"
                  >
                    🚀 Save Intelligence Data
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="premium-card p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <h4 className="text-lg font-bold mb-4">Elite Membership</h4>
              <p className="text-sm text-blue-100/80 mb-6">You've unlocked full access to all AI features and real-time biomechanics analysis.</p>
              <div className="h-2 bg-black/20 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-white w-full"></div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest">Active Status: Infinite</p>
            </div>

            <div className="premium-card p-6">
              <h4 className="text-lg font-bold text-white mb-4">Account Health</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Security Score</span>
                  <span className="text-emerald-400 font-bold">Excellent</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Data Sync</span>
                  <span className="text-blue-400 font-bold">Synced 2m ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImproved;
