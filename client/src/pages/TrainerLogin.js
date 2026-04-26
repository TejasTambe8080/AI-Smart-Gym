import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { toast } from 'react-hot-toast';
import { ShieldCheck, Mail, Lock, ArrowRight, Dumbbell } from 'lucide-react';

const TrainerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await authService.login({ email, password });
      
      if (res.data.success) {
        if (res.data.user.role !== 'trainer') {
          toast.error('This account is not registered as a trainer.');
          setIsLoading(false);
          return;
        }

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success(`Welcome back, Coach ${res.data.user.name}!`);
        navigate('/trainer-dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] -z-10 animate-pulse"></div>

      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20 group hover:scale-110 transition-transform cursor-pointer">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Trainer Portal</h1>
            <p className="text-slate-400 text-center">Manage your clients and elevate their performance.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-500 text-slate-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="name@formfix.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-500 text-slate-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-slate-400 text-center text-sm">
              New to the platform?{' '}
              <Link to="/trainer-signup" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                Apply as a Trainer
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center gap-6 text-slate-500 text-xs uppercase tracking-widest font-semibold">
           <Link to="/login" className="hover:text-blue-400 transition-colors">Standard Login</Link>
           <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
           <Link to="/about" className="hover:text-blue-400 transition-colors">Support</Link>
           <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
           <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms</Link>
        </div>
      </div>
    </div>
  );
};

export default TrainerLogin;
