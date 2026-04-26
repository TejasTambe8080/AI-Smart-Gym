// Signup Page Component - Premium Modern Design
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { toast } from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    height: '',
    weight: '',
    fitnessGoal: 'general_fitness',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        fitnessGoal: formData.fitnessGoal,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Welcome! Your account has been created! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Synchronization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 py-12 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delayed-pulse"></div>

      <div className="relative z-10 w-full max-w-2xl animate-enter">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-block bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] p-4 mb-4 shadow-2xl shadow-blue-500/20">
             <span className="text-5xl">💪</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Smart Gym AI</h1>
          <p className="text-slate-400 font-medium">Get personalized fitness coaching</p>
        </div>

        {/* Global Container */}
        <div className="glass-card p-10 rounded-[2.5rem] border-slate-800/80">
          <div className="mb-10 text-center md:text-left">
             <h2 className="text-3xl font-black text-white tracking-tight">Create Your Account</h2>
             <p className="text-slate-500 text-sm font-medium">Let's get started on your fitness journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••••••"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {/* Physical Metrics */}
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="24"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="175"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="70"
                  required
                />
              </div>
            </div>

            {/* Fitness Goal */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">What's Your Fitness Goal?</label>
              <select
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleChange}
                className="input-field appearance-none"
              >
                <option value="general_fitness">General Fitness</option>
                <option value="weight_loss">Lose Weight</option>
                <option value="muscle_gain">Build Muscle</option>
                <option value="endurance">Improve Endurance</option>
                <option value="flexibility">Improve Flexibility</option>
              </select>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0" required />
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                I agree to the terms and allow Smart Gym AI to help me reach my fitness goals
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-14 text-lg"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-800 text-center">
             <p className="text-slate-500 text-sm font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-500 hover:text-blue-400 font-black px-1 transition-colors">
                  Sign In
                </Link>
             </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center gap-2 opacity-40">
           <div className="flex gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[.3em]">Secure</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[.3em]">Privacy First</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[.3em]">Encrypted</span>
           </div>
           <p className="text-[10px] text-slate-500 font-black">© 2026 Smart Gym AI</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
