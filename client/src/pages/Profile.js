// Profile Management Page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      setUser(response.data.user);
      setFormData(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await authService.updateProfile(formData);
      setUser(response.data.user);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">👤 My Profile</h1>
          <p className="text-gray-600">Manage your personal information and fitness goals</p>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes('success')
                ? 'bg-green-100 text-green-700 border border-green-400'
                : 'bg-red-100 text-red-700 border border-red-400'
            }`}
          >
            {message}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          {/* Avatar Section */}
          <div className="text-center mb-8 pb-8 border-b">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">💪</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500 mt-2">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                }`}
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Age */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                  }`}
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                  }`}
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                  }`}
                />
              </div>
            </div>

            {/* Fitness Goal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fitness Goal</label>
              <select
                name="fitnessGoal"
                value={formData.fitnessGoal || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                }`}
              >
                <option value="general_fitness">General Fitness</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
                <option value="flexibility">Flexibility</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Back
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-gray-600 text-sm">BMI</p>
            <p className="text-2xl font-bold text-blue-600">
              {(formData.weight / ((formData.height / 100) ** 2)).toFixed(1) || 'N/A'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-gray-600 text-sm">Age</p>
            <p className="text-2xl font-bold text-green-600">{formData.age || 'N/A'}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-gray-600 text-sm">Weight</p>
            <p className="text-2xl font-bold text-orange-600">{formData.weight || 'N/A'} kg</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-gray-600 text-sm">Goal</p>
            <p className="text-2xl font-bold text-purple-600">
              {formData.fitnessGoal?.replace('_', ' ').toUpperCase() || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
