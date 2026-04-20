// Premium AI Diet Planner - Integrated with Google Gemini
import React, { useState, useEffect } from 'react';
import { aiService, authService } from '../services/api';
import { toast } from 'react-hot-toast';
import SkeletonLoader from '../components/SkeletonLoader';

const Diet = () => {
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    goal: 'muscle_gain'
  });
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchExistingPlan();
  }, []);

  const fetchExistingPlan = async () => {
    try {
      setInitialLoading(true);
      // We'll also fetch user data to pre-populate
      const userRes = await authService.getProfile();
      if (userRes.data.success) {
        setFormData(prev => ({
          ...prev,
          height: userRes.data.user.height || '',
          weight: userRes.data.user.weight || '',
          goal: userRes.data.user.fitnessGoal || 'muscle_gain'
        }));
      }

      // Check if a plan already exists (this will hit the cache in the backend)
      const res = await aiService.getDietPlan({
        height: userRes.data.user.height,
        weight: userRes.data.user.weight,
        goal: userRes.data.user.fitnessGoal
      });
      if (res.data.success && res.data.data) {
        setDietPlan(res.data.data);
      }
    } catch (error) {
      console.log("No existing plan found or error fetching initial data.");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePlan = async (e) => {
    e.preventDefault();
    if (!formData.height || !formData.weight) {
      return toast.error("Please provide height and weight.");
    }

    try {
      setLoading(true);
      const res = await aiService.getDietPlan(formData);
      if (res.data.success) {
        setDietPlan(res.data.data);
        toast.success("AI Diet Plan Generated!");
      }
    } catch (error) {
      toast.error("AI Node Offline or generation failed.");
    } finally {
      setLoading(false);
    }

  };

  if (initialLoading) return <div className="p-8"><SkeletonLoader type="dashboard" /></div>;

  return (
    <div className="min-h-screen bg-slate-900/50 p-6 lg:p-8 animate-enter">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-widest uppercase italic leading-none">AI BIOLOGICAL <span className="text-blue-500">FUELING</span></h1>
          <p className="text-slate-400 font-medium italic">Precision hyper-nutrient protocols powered by Gemini Neural Core.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Input Form Column */}
          <div className="lg:col-span-1">
            <div className="premium-card p-8 bg-slate-900 border-slate-800 shadow-2xl">
              <h2 className="text-xl font-black text-white mb-8 tracking-tight uppercase italic flex items-center gap-3">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                Protocol Params
              </h2>
              <form onSubmit={generatePlan} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Height (CM)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. 175"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Weight (KG)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g. 70"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Fitness Vector</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="input-field appearance-none"
                  >
                    <option value="muscle_gain">Hypertrophy (Muscle Gain)</option>
                    <option value="weight_loss">Fat Oxidation (Weight Loss)</option>
                    <option value="endurance">Stamina (Endurance)</option>
                    <option value="general_fitness">Base Maintenance (General)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full h-16 text-lg mt-4 shadow-xl shadow-blue-500/20"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                       <span>Generating AI Plan...</span>
                    </div>
                  ) : 'Generate Protocol'}
                </button>
              </form>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2 space-y-8">
            {dietPlan ? (
              <div className="animate-enter">
                <div className="premium-card p-10 border-blue-500/20 bg-gradient-to-br from-blue-600/5 to-transparent relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <span className="text-[150px]">🥗</span>
                   </div>
                   <div className="relative z-10 space-y-10">
                      <div className="flex justify-between items-center border-b border-white/5 pb-8">
                         <div>
                            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Intelligent Diet Plan</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Generated by Gemini Neural Engine</p>
                         </div>
                         <div className="text-right">
                            <span className="px-4 py-1.5 bg-blue-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Active Cache</span>
                         </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                         <div className="space-y-6">
                            <h4 className="text-sm font-black text-blue-500 tracking-[0.3em] uppercase">Core Fueling Base</h4>
                            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800">
                               <pre className="text-slate-300 font-medium whitespace-pre-wrap font-sans text-sm leading-relaxed">
                                 {dietPlan.rawResponse}
                               </pre>
                            </div>
                         </div>
                         <div className="space-y-6">
                            <h4 className="text-sm font-black text-emerald-500 tracking-[0.3em] uppercase">Status Check</h4>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 text-center">
                                  <p className="text-[10px] font-black text-slate-600 uppercase mb-2">Height</p>
                                  <p className="text-2xl font-black text-white italic">{dietPlan.height} cm</p>
                               </div>
                               <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 text-center">
                                  <p className="text-[10px] font-black text-slate-600 uppercase mb-2">Weight</p>
                                  <p className="text-2xl font-black text-white italic">{dietPlan.weight} kg</p>
                               </div>
                            </div>
                            <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800 relative overflow-hidden group">
                               <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                               <p className="text-[10px] font-black text-slate-600 uppercase mb-3">Calculated Target</p>
                               <p className="text-xl font-black text-white uppercase italic leading-tight">Optimization for {dietPlan.goal.replace('_', ' ')}</p>
                               <div className="mt-8 flex gap-2">
                                  {[1,2,3,4,5,6].map(i => <div key={i} className="flex-1 h-1 bg-blue-500/20 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-full animate-pulse" style={{ animationDelay: `${i*100}ms` }}></div></div>)}
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ) : (
              <div className="premium-card p-20 flex flex-col items-center justify-center text-center opacity-50 border-dashed border-slate-800">
                 <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center text-5xl mb-8">🤖</div>
                 <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-4">Input Profile Constraints</h3>
                 <p className="text-slate-500 max-w-sm">Provide your biological vectors and target objective to initialize the diet plan synthesis.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diet;
