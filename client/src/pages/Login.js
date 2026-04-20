// Login Page Component - Premium Modern Design
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Welcome back! You are logged in! 👋');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md animate-enter">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-block bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 mb-4 shadow-2xl shadow-blue-500/20">
             <span className="text-5xl drop-shadow-lg">💪</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Smart Gym AI</h1>
          <p className="text-slate-400 font-medium">Welcome back to your fitness journey</p>
        </div>

        {/* Logic Container */}
        <div className="glass-card p-10 rounded-[2.5rem] border-slate-800/80">
          <div className="space-y-1 mb-8">
             <h2 className="text-2xl font-black text-white tracking-tight">Sign In</h2>
             <p className="text-slate-500 text-sm font-medium">Enter your email and password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex justify-between items-center text-xs">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer group">
                <input type="checkbox" className="rounded-md bg-slate-800 border-slate-700 text-blue-600 focus:ring-0" />
                <span className="group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-blue-500 hover:text-blue-400 font-black tracking-tight">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary h-14"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-800">
             <p className="text-center text-slate-500 text-sm font-medium">
               Don't have an account?{' '}
               <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-black px-1 transition-colors">
                 Create one
               </Link>
             </p>
          </div>
        </div>

        {/* Status Line */}
        <div className="mt-8 flex justify-center items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Secure Connection</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
