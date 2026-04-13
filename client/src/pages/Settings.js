// Settings Page
import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    voiceFeedback: localStorage.getItem('voiceFeedback') !== 'false',
    darkMode: localStorage.getItem('darkMode') === 'true',
    units: localStorage.getItem('units') || 'metric',
    notifications: localStorage.getItem('notifications') !== 'false',
    soundEffects: localStorage.getItem('soundEffects') !== 'false',
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (setting, value) => {
    setSettings({ ...settings, [setting]: value });
  };

  const handleSave = () => {
    localStorage.setItem('voiceFeedback', settings.voiceFeedback);
    localStorage.setItem('darkMode', settings.darkMode);
    localStorage.setItem('units', settings.units);
    localStorage.setItem('notifications', settings.notifications);
    localStorage.setItem('soundEffects', settings.soundEffects);

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    const defaults = {
      voiceFeedback: true,
      darkMode: false,
      units: 'metric',
      notifications: true,
      soundEffects: true,
    };
    setSettings(defaults);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ Settings</h1>
          <p className="text-gray-600">Customize your app experience</p>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 border border-green-400 rounded-lg">
            ✓ Settings saved successfully!
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Workout Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🏋️ Workout Settings</h2>

            <div className="space-y-4">
              {/* Voice Feedback */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-semibold text-gray-900">Voice Feedback</h3>
                  <p className="text-sm text-gray-500">
                    Receive audio guidance during workouts
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleChange('voiceFeedback', !settings.voiceFeedback)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      settings.voiceFeedback ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        settings.voiceFeedback ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Sound Effects */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-semibold text-gray-900">Sound Effects</h3>
                  <p className="text-sm text-gray-500">
                    Enable rep counting and milestone sounds
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleChange('soundEffects', !settings.soundEffects)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      settings.soundEffects ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        settings.soundEffects ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-semibold text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-500">
                    Get workout reminders and achievements
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleChange('notifications', !settings.notifications)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      settings.notifications ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        settings.notifications ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🎨 Display Settings</h2>

            <div className="space-y-4">
              {/* Dark Mode */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-semibold text-gray-900">Dark Mode</h3>
                  <p className="text-sm text-gray-500">
                    Easier on the eyes in low light conditions
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleChange('darkMode', !settings.darkMode)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      settings.darkMode ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        settings.darkMode ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Units */}
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-3">Units</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="units"
                      value="metric"
                      checked={settings.units === 'metric'}
                      onChange={(e) => handleChange('units', e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">Metric (kg, cm)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="units"
                      value="imperial"
                      checked={settings.units === 'imperial'}
                      onChange={(e) => handleChange('units', e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">Imperial (lbs, inches)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
            <h2 className="text-xl font-bold text-red-900 mb-4">⚠️ Danger Zone</h2>

            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition border border-red-300">
                Reset All Settings
              </button>
              <button className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition border border-red-300">
                Clear All Data
              </button>
              <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
                Delete Account
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-gray-600">
            <strong>AI Smart Gym</strong> • v1.0.0
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Made with ❤️ by Your Fitness Coach
          </p>
          <div className="flex justify-center gap-4 mt-4 text-sm text-gray-600">
            <a href="#" className="hover:text-blue-600">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-blue-600">
              Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
