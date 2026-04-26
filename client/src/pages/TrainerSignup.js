import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { trainerService } from '../services/api';
import { toast } from 'react-hot-toast';

const TrainerSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    experience: '',
    pricePerSession: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await trainerService.register(formData);
      toast.success(res.data?.message || 'Trainer registered successfully. Pending verification.');
      setTimeout(() => navigate('/trainer-login'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register trainer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-12 animate-enter bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-600/5 mix-blend-screen opacity-50 pointer-events-none"></div>
      <div className="w-full max-w-xl glass-card p-10 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        <div className="mb-10 text-center">
          <Link to="/" className="inline-block mb-6 group">
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
              FORMFIX<span className="text-blue-500">AI</span>
            </h1>
          </Link>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-widest mb-2">Trainer Portal</h2>
          <p className="text-slate-400 text-sm">Join the elite network of human verifiers.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-900 border border-slate-700 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-slate-600"
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-900 border border-slate-700 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-slate-600"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full bg-slate-900 border border-slate-700 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-slate-600"
              placeholder="Secure password"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Specialization (comma separated)</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              className="w-full bg-slate-900 border border-slate-700 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-slate-600"
              placeholder="e.g. Hypertrophy, Rehab, Mobility"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Years Experience</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-900 border border-slate-700 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-slate-600"
                placeholder="e.g. 5"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Price / Session ($)</label>
              <input
                type="number"
                name="pricePerSession"
                value={formData.pricePerSession}
                onChange={handleInputChange}
                required
                className="w-full bg-slate-900 border border-slate-700 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-slate-600"
                placeholder="e.g. 50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? 'Submitting Application...' : 'Apply as Trainer'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500 font-medium">
          Already verified? <Link to="/trainer-login" className="text-blue-500 hover:text-white transition-colors uppercase font-bold">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default TrainerSignup;
