// Profile Page Component - Modern Design
import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';

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
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
      setFormData(userData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load profile', err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      // API call to update user profile
      // const response = await userService.updateProfile(formData);
      setUser(formData);
      localStorage.setItem('user', JSON.stringify(formData));
      setIsEditing(false);
      // Show success toast
    } catch (err) {
      console.error('Failed to save profile', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold text-gray-600">⏳ Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">👤 My Profile</h1>
          <p className="text-gray-600">Manage your account settings and personal information</p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-3xl font-bold">{user?.name}</h2>
                <p className="text-blue-100 text-lg">{user?.email}</p>
                <div className="flex gap-4 mt-3">
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur">
                    🏋️ {user?.fitnessLevel || 'Beginner'}
                  </span>
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur">
                    📅 Member since {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:shadow-lg transition"
            >
              {isEditing ? '❌ Cancel' : '✏️ Edit Profile'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['personal', 'fitness', 'settings', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-bold transition whitespace-nowrap capitalize ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab === 'personal' && '👤'} {tab === 'fitness' && '🏋️'}  {tab === 'settings' && '⚙️'} {tab === 'stats' && '📊'} {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Personal Information */}
            {activeTab === 'personal' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition ${
                          isEditing
                            ? 'border-gray-200 focus:border-blue-500 focus:outline-none'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition ${
                          isEditing
                            ? 'border-gray-200 focus:border-blue-500 focus:outline-none'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition ${
                        isEditing
                          ? 'border-gray-200 focus:border-blue-500 focus:outline-none'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                      rows="4"
                      className={`w-full px-4 py-3 border-2 rounded-xl transition resize-none ${
                        isEditing
                          ? 'border-gray-200 focus:border-blue-500 focus:outline-none'
                          : 'border-gray-200 bg-gray-50 text-gray-600'
                      }`}
                    />
                  </div>

                  {isEditing && (
                    <button
                      onClick={handleSave}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition"
                    >
                      💾 Save Changes
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Fitness Information */}
            {activeTab === 'fitness' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Fitness Profile</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition ${
                          isEditing
                            ? 'border-gray-200 focus:border-blue-500 focus:outline-none'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition ${
                          isEditing
                            ? 'border-gray-200 focus:border-blue-500 focus:outline-none'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight || ''}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition ${
                          isEditing
                            ? 'border-gray-200 focus:border-blue-500 focus:outline-none'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Fitness Level</label>
                      <select
                        name="fitnessLevel"
                        value={formData.fitnessLevel || 'beginner'}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition ${
                          isEditing
                            ? 'border-gray-200 focus:border-blue-500 focus:outline-none'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Fitness Goal</label>
                      <select
                        name="fitnessGoal"
                        value={formData.fitnessGoal || 'general_fitness'}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border-2 rounded-xl transition ${
                          isEditing
                            ? 'border-gray-200 focus:border-blue-500 focus:outline-none'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      >
                        <option value="general_fitness">General Fitness</option>
                        <option value="weight_loss">Weight Loss</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="endurance">Endurance</option>
                      </select>
                    </div>
                  </div>

                  {isEditing && (
                    <button
                      onClick={handleSave}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg transition"
                    >
                      💾 Save Changes
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Notification Settings */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">📬 Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Email Notifications', description: 'Get updates about your workouts' },
                      { label: 'Push Notifications', description: 'Receive push alerts on your phone' },
                      { label: 'Weekly Reports', description: 'Get weekly fitness reports' },
                      { label: 'Marketing Emails', description: 'Receive offers and promotions' },
                    ].map((item, idx) => (
                      <label key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer">
                        <div>
                          <p className="font-semibold text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-6 h-6 rounded" />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">🔒 Privacy & Security</h3>
                  <div className="space-y-4">
                    <button className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-left font-semibold text-gray-900">
                      🔐 Change Password
                    </button>
                    <button className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-left font-semibold text-gray-900">
                      📱 Two-Factor Authentication
                    </button>
                    <button className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-left font-semibold text-gray-900">
                      🚪 Active Sessions
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics */}
            {activeTab === 'stats' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">📊 Your Statistics</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                    <p className="text-gray-600 text-sm font-semibold mb-2">Total Workouts</p>
                    <p className="text-4xl font-bold text-blue-600">42</p>
                    <p className="text-xs text-gray-500 mt-2">+3 this week</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-6 border-l-4 border-green-500">
                    <p className="text-gray-600 text-sm font-semibold mb-2">Total Reps</p>
                    <p className="text-4xl font-bold text-green-600">1,250</p>
                    <p className="text-xs text-gray-500 mt-2">+150 this week</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl p-6 border-l-4 border-orange-500">
                    <p className="text-gray-600 text-sm font-semibold mb-2">Avg Posture Score</p>
                    <p className="text-4xl font-bold text-orange-600">87%</p>
                    <p className="text-xs text-gray-500 mt-2">+5% improvement</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-6 border-l-4 border-red-500">
                    <p className="text-gray-600 text-sm font-semibold mb-2">Calories Burned</p>
                    <p className="text-4xl font-bold text-red-600">3,840</p>
                    <p className="text-xs text-gray-500 mt-2">This month</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
                  🎯 Start Workout
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
                  📋 View Analytics
                </button>
                <button className="w-full p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
                  💡 Get AI Suggestions
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">📈 Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>This Week</span>
                  <span className="text-xl font-bold">+12%</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white/60 w-3/4 rounded-full"></div>
                </div>
                <p className="text-sm text-blue-100">Great improvement! Keep it up! 💪</p>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">❓ Help & Support</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-blue-600 hover:underline font-semibold">📚 View Documentation</a>
                <a href="#" className="block text-blue-600 hover:underline font-semibold">💬 Contact Support</a>
                <a href="#" className="block text-blue-600 hover:underline font-semibold">🐛 Report Issue</a>
                <a href="#" className="block text-blue-600 hover:underline font-semibold">❓ FAQ</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImproved;
