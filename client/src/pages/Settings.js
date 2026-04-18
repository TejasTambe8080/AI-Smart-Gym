// Premium Enhanced Settings Page - User Preferences & Configuration
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // In production, save to backend API
      // const token = localStorage.getItem('token');
      // await axios.put('/api/user/settings', settings, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: '👤 Profile', icon: '👤' },
    { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
    { id: 'preferences', label: '⚙️ Preferences', icon: '⚙️' },
    { id: 'workout', label: '🏋️ Workout', icon: '🏋️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">⚙️ Settings</h1>
          <p className="text-slate-400 text-lg">Customize your FormFix AI experience</p>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 bg-green-500/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-3 animate-pulse">
            <span className="text-green-400 text-2xl">✓</span>
            <span className="text-green-300 font-semibold">Settings saved successfully!</span>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 flex gap-2 bg-slate-800/50 p-2 rounded-xl backdrop-blur-sm border border-slate-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">👤 Profile Information</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-slate-300 font-semibold mb-3">Full Name</label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => handleSettingChange('name', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-300 font-semibold mb-3">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white opacity-50 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-slate-300 font-semibold mb-3">Weight (kg)</label>
                <input
                  type="number"
                  value={settings.weight}
                  onChange={(e) => handleSettingChange('weight', parseInt(e.target.value))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-slate-300 font-semibold mb-3">Height (cm)</label>
                <input
                  type="number"
                  value={settings.height}
                  onChange={(e) => handleSettingChange('height', parseInt(e.target.value))}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Fitness Goal */}
              <div className="md:col-span-2">
                <label className="block text-slate-300 font-semibold mb-3">Fitness Goal</label>
                <select
                  value={settings.goal}
                  onChange={(e) => handleSettingChange('goal', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="muscle_gain">💪 Muscle Gain</option>
                  <option value="weight_loss">⚖️ Weight Loss</option>
                  <option value="strength">🔥 Strength Building</option>
                  <option value="endurance">⚡ Endurance</option>
                  <option value="flexibility">🤸 Flexibility</option>
                  <option value="general_fitness">🎯 General Fitness</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 border border-purple-500/30 rounded-2xl p-6 shadow-lg space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">🔔 Notification Preferences</h2>

            {/* Push Notifications */}
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all">
              <div>
                <h3 className="text-white font-semibold">Push Notifications</h3>
                <p className="text-slate-400 text-sm">Get workout reminders and achievements</p>
              </div>
              <button
                onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
                className={`relative w-14 h-8 rounded-full transition-all ${
                  settings.pushNotifications ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.pushNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </button>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all">
              <div>
                <h3 className="text-white font-semibold">Email Notifications</h3>
                <p className="text-slate-400 text-sm">Weekly progress reports and tips</p>
              </div>
              <button
                onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                className={`relative w-14 h-8 rounded-full transition-all ${
                  settings.emailNotifications ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </button>
            </div>

            {/* Voice Feedback */}
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all">
              <div>
                <h3 className="text-white font-semibold">Voice Feedback</h3>
                <p className="text-slate-400 text-sm">Real-time audio coaching during workouts</p>
              </div>
              <button
                onClick={() => handleSettingChange('voiceFeedback', !settings.voiceFeedback)}
                className={`relative w-14 h-8 rounded-full transition-all ${
                  settings.voiceFeedback ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.voiceFeedback ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </button>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all">
              <div>
                <h3 className="text-white font-semibold">Sound Effects</h3>
                <p className="text-slate-400 text-sm">Enable sound feedback and achievement sounds</p>
              </div>
              <button
                onClick={() => handleSettingChange('soundEffects', !settings.soundEffects)}
                className={`relative w-14 h-8 rounded-full transition-all ${
                  settings.soundEffects ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.soundEffects ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </button>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30 rounded-2xl p-6 shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">⚙️ Preferences</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Dark Mode */}
              <div>
                <label className="block text-slate-300 font-semibold mb-3">Theme</label>
                <select
                  value={settings.darkMode ? 'dark' : 'light'}
                  onChange={(e) => handleSettingChange('darkMode', e.target.value === 'dark')}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                >
                  <option value="dark">🌙 Dark Mode</option>
                  <option value="light">☀️ Light Mode</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-slate-300 font-semibold mb-3">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                >
                  <option value="english">🇺🇸 English</option>
                  <option value="hindi">🇮🇳 हिन्दी (Hindi)</option>
                  <option value="spanish">🇪🇸 Español</option>
                </select>
              </div>

              {/* Unit System */}
              <div className="md:col-span-2">
                <label className="block text-slate-300 font-semibold mb-3">Unit System</label>
                <select
                  value={settings.unitSystem}
                  onChange={(e) => handleSettingChange('unitSystem', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                >
                  <option value="metric">📏 Metric (kg, cm, km)</option>
                  <option value="imperial">🗽 Imperial (lbs, inches, miles)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Workout Tab */}
        {activeTab === 'workout' && (
          <div className="bg-gradient-to-br from-orange-500/10 to-yellow-600/10 border border-orange-500/30 rounded-2xl p-6 shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">🏋️ Workout Preferences</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Weekly Goal */}
              <div>
                <label className="block text-slate-300 font-semibold mb-3">Weekly Workout Goal</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={settings.weeklyGoal}
                    onChange={(e) => handleSettingChange('weeklyGoal', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <span className="text-orange-400 font-bold text-lg w-12">{settings.weeklyGoal}</span>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-slate-300 font-semibold mb-3">Experience Level</label>
                <select
                  value={settings.experienceLevel}
                  onChange={(e) => handleSettingChange('experienceLevel', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                >
                  <option value="beginner">🌱 Beginner</option>
                  <option value="intermediate">💪 Intermediate</option>
                  <option value="advanced">🔥 Advanced</option>
                  <option value="elite">🏆 Elite</option>
                </select>
              </div>

              {/* Activity Level */}
              <div className="md:col-span-2">
                <label className="block text-slate-300 font-semibold mb-3">Daily Activity Level</label>
                <select
                  value={settings.activityLevel}
                  onChange={(e) => handleSettingChange('activityLevel', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                >
                  <option value="sedentary">🪑 Sedentary (Little or no exercise)</option>
                  <option value="light">🚶 Light Activity (1-3 days/week)</option>
                  <option value="moderate">🏃 Moderate Activity (3-5 days/week)</option>
                  <option value="active">💨 Very Active (6-7 days/week)</option>
                  <option value="extra_active">⚡ Extra Active (Physical job + exercise)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={saveSettings}
            disabled={loading}
            className={`flex-1 px-6 py-4 rounded-lg font-bold text-lg transition-all ${
              loading
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/50 transform hover:scale-105'
            }`}
          >
            {loading ? '💾 Saving...' : '✓ Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
