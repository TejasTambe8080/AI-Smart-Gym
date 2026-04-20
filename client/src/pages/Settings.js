// Premium Enhanced Settings Page - User Preferences & Configuration
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [settings, setSettings] = useState({
    // Profile
    name: user.name || '',
    email: user.email || '',
    weight: user.weight || 70,
    height: user.height || 170,
    goal: user.fitnessGoal || 'muscle_gain',

    // Preferences
    darkMode: true,
    language: 'english',
    unitSystem: 'metric',

    // Notifications
    pushNotifications: true,
    emailNotifications: false,
    voiceFeedback: true,
    soundEffects: true,

    // Workout
    weeklyGoal: 5,
    experienceLevel: 'intermediate',
    activityLevel: 'moderate'
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      localStorage.setItem('userSettings', JSON.stringify(settings));
      // In production, sync with backend here
      toast.success('Configuration synchronized successfully! ⚙️', {
        style: { borderRadius: '12px', background: '#0f172a', color: '#fff', border: '1px solid #1e293b' }
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to sync settings.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Identity', icon: '👤' },
    { id: 'notifications', label: 'Push Logic', icon: '🔔' },
    { id: 'preferences', label: 'Interface', icon: '🎨' },
    { id: 'workout', label: 'Protocol', icon: '🏋️' }
  ];

  return (
    <div className="min-h-screen bg-slate-900/50 p-6 lg:p-8 animate-enter">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tight">⚙️ Core Configuration</h1>
            <p className="text-slate-400 font-medium">Fine-tune your AI coach and platform behavior.</p>
          </div>
          <button
            onClick={saveSettings}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? '🔄 Syncing...' : 'Save Configuration'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-bold transition-all border whitespace-nowrap flex items-center gap-3 ${
                activeTab === tab.id
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Content Container */}
        <div className="premium-card p-8 min-h-[500px]">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-enter">
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                 <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                 Biological Data
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Legal Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => handleSettingChange('name', e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Registered Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    className="input-field opacity-50 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Body Mass (KG)</label>
                  <input
                    type="number"
                    value={settings.weight}
                    onChange={(e) => handleSettingChange('weight', parseInt(e.target.value))}
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Verticality (CM)</label>
                  <input
                    type="number"
                    value={settings.height}
                    onChange={(e) => handleSettingChange('height', parseInt(e.target.value))}
                    className="input-field"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Primary Fitness Vector</label>
                  <select
                    value={settings.goal}
                    onChange={(e) => handleSettingChange('goal', e.target.value)}
                    className="input-field appearance-none"
                  >
                    <option value="muscle_gain">💪 Muscle Mass Hypertrophy</option>
                    <option value="weight_loss">⚖️ Adipose Tissue Reduction</option>
                    <option value="strength">🔥 Peak Power Output</option>
                    <option value="endurance">⚡ Cardiovascular Efficiency</option>
                    <option value="general_fitness">🎯 Balanced Longevity</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-8 animate-enter">
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                 <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
                 Communication Logic
              </h2>
              <div className="space-y-4">
                {[
                  { id: 'pushNotifications', label: 'Push Intelligence', desc: 'Real-time achievement & reminder triggers.' },
                  { id: 'emailNotifications', label: 'Weekly Digest', desc: 'In-depth performance analytics sent to inbox.' },
                  { id: 'voiceFeedback', label: 'AI Voice Synthesis', desc: 'Real-time biometric correction via audio.' },
                  { id: 'soundEffects', label: 'Haptic Audio', desc: 'UI interaction & milestone auditory cues.' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-6 bg-slate-900/50 border border-slate-800 rounded-2xl group hover:border-blue-500/30 transition-all">
                    <div>
                      <h4 className="font-bold text-white tracking-tight">{item.label}</h4>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange(item.id, !settings[item.id])}
                      className={`relative w-14 h-7 rounded-full p-1 transition-colors ${settings[item.id] ? 'bg-blue-600' : 'bg-slate-700'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings[item.id] ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-8 animate-enter">
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                 <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                 Interface Defaults
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Visual Aesthetic</label>
                  <select
                    value={settings.darkMode ? 'dark' : 'light'}
                    onChange={(e) => handleSettingChange('darkMode', e.target.value === 'dark')}
                    className="input-field appearance-none"
                  >
                    <option value="dark">🌙 Dark Mode (Optimal)</option>
                    <option value="light">☀️ Light Mode</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Linguistic Engine</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="input-field appearance-none"
                  >
                    <option value="english">🇺🇸 English (Global)</option>
                    <option value="hindi">🇮🇳 हिन्दी (Hindi)</option>
                    <option value="spanish">🇪🇸 Español</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Coordinate System</label>
                  <select
                    value={settings.unitSystem}
                    onChange={(e) => handleSettingChange('unitSystem', e.target.value)}
                    className="input-field appearance-none"
                  >
                    <option value="metric">📏 Metric (Standard: kg, cm)</option>
                    <option value="imperial">🗽 Imperial (lbs, inches)</option>
                  </select>
                </div>
                {/* Demo Mode Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Presentation System</label>
                  <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
                     <span className="text-sm font-bold text-white italic">Demo Mode</span>
                     <button
                        onClick={() => {
                          const newVal = localStorage.getItem('demo_mode') === 'true' ? 'false' : 'true';
                          localStorage.setItem('demo_mode', newVal);
                          toast.success(`Demo Mode: ${newVal === 'true' ? 'ON' : 'OFF'}`);
                          window.location.reload(); // Refresh to apply throughout API
                        }}
                        className={`relative w-12 h-6 rounded-full p-1 transition-colors ${localStorage.getItem('demo_mode') === 'true' ? 'bg-amber-500' : 'bg-slate-700'}`}
                     >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${localStorage.getItem('demo_mode') === 'true' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                     </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'workout' && (
            <div className="space-y-8 animate-enter">
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                 <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                 Training Protocols
              </h2>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Weekly Intensity Goal</label>
                    <span className="text-2xl font-black text-orange-400">{settings.weeklyGoal} <span className="text-sm">sessions</span></span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={settings.weeklyGoal}
                    onChange={(e) => handleSettingChange('weeklyGoal', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Proficiency Tier</label>
                      <select
                        value={settings.experienceLevel}
                        onChange={(e) => handleSettingChange('experienceLevel', e.target.value)}
                        className="input-field appearance-none"
                      >
                        <option value="beginner">🌱 Novice</option>
                        <option value="intermediate">💪 Intermediate</option>
                        <option value="advanced">🔥 Advanced</option>
                        <option value="elite">🏆 Elite Athlete</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Daily Metabolism Range</label>
                      <select
                        value={settings.activityLevel}
                        onChange={(e) => handleSettingChange('activityLevel', e.target.value)}
                        className="input-field appearance-none"
                      >
                        <option value="sedentary">🪑 Low (0-1 days/wk)</option>
                        <option value="light">🚶 Active (1-3 days/wk)</option>
                        <option value="moderate">🏃 Intensity (3-5 days/wk)</option>
                        <option value="active">💨 High (6-7 days/wk)</option>
                      </select>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
