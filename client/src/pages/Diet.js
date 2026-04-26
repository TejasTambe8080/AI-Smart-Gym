// Premium AI Diet Planner - Integrated with Google Gemini Neural Core
import React, { useState, useEffect } from 'react';
import { aiService, authService } from '../services/api';
import { toast } from 'react-hot-toast';
import SkeletonLoader from '../components/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Sun, Moon, Zap, Utensils, Scale, User, Target, ChevronRight } from 'lucide-react';

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
      const userRes = await authService.getProfile();
      if (userRes.data.success) {
        setFormData(prev => ({
          ...prev,
          height: userRes.data.user.height || '',
          weight: userRes.data.user.weight || '',
          goal: userRes.data.user.fitnessGoal || 'muscle_gain'
        }));
      }

      const res = await aiService.getDietPlan({
        height: userRes.data.user.height,
        weight: userRes.data.user.weight,
        goal: userRes.data.user.fitnessGoal
      });
      if (res.data.success && res.data.data) {
        setDietPlan(res.data.data);
      }
    } catch (error) {
      console.log("No existing plan found.");
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
      return toast.error("Please provide height and weight vectors.");
    }

    try {
      setLoading(true);
      const res = await aiService.getDietPlan(formData);
      if (res.data.success) {
        setDietPlan(res.data.data);
        toast.success("AI Nutrition Protocol Synchronized!");
      }
    } catch (error) {
      toast.error("Bridge Connection Lost. Retry Protocol.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse Gemini's markdown/text into sections
  const parseDietSections = (text) => {
    if (!text) return [];
    
    // Attempting to split by common meal keywords
    const sections = [];
    const keywords = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Pre-Workout', 'Post-Workout', 'Note'];
    
    let currentSection = { title: 'General Guidelines', content: [] };
    
    const lines = text.split('\n');
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      const foundKeyword = keywords.find(k => trimmedLine.toLowerCase().includes(k.toLowerCase()) && (trimmedLine.length < 30 || trimmedLine.startsWith('#') || trimmedLine.startsWith('**')));
      
      if (foundKeyword && !trimmedLine.includes(':')) {
        if (currentSection.content.length > 0) sections.push(currentSection);
        currentSection = { title: foundKeyword, content: [] };
      } else {
        currentSection.content.push(trimmedLine.replace(/^[*-]\s*/, '').replace(/^\d+\.\s*/, ''));
      }
    });
    
    sections.push(currentSection);
    return sections;
  };

  const sections = dietPlan ? parseDietSections(dietPlan.rawResponse) : [];

  const getSectionIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('breakfast')) return <Coffee size={24} className="text-amber-400" />;
    if (t.includes('lunch')) return <Sun size={24} className="text-blue-400" />;
    if (t.includes('dinner')) return <Moon size={24} className="text-indigo-400" />;
    if (t.includes('snack')) return <Zap size={24} className="text-emerald-400" />;
    return <Utensils size={24} className="text-slate-400" />;
  };

  if (initialLoading) return <div className="p-8 bg-slate-950 min-h-screen"><SkeletonLoader type="dashboard" /></div>;

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-12 animate-enter text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Block */}
        <div className="space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">
              <Zap size={10} /> Metabolic Optimization // v2.4
           </div>
           <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic leading-none">
             Neural <span className="text-blue-600">Nutrition</span>
           </h1>
           <p className="text-slate-500 font-bold uppercase text-xs tracking-widest italic max-w-2xl">
             Biometric-driven meal architecture synthesized by the Gemini Neural Engine for peak hypertrophy performance.
           </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Input Form Fragment */}
          <div className="lg:col-span-4 lg:sticky lg:top-12 h-fit">
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 grayscale pointer-events-none text-9xl font-black">?</div>
              
              <h2 className="text-xl font-black text-white mb-10 tracking-tight uppercase italic flex items-center gap-4">
                <span className="w-1.5 h-8 bg-blue-600 rounded-full"></span>
                Constraints
              </h2>
              
              <form onSubmit={generatePlan} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Stature (CM)</label>
                  <div className="relative group">
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl px-6 font-black text-lg text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-800"
                      placeholder="180"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 font-black italic">CM</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Body Mass (KG)</label>
                  <div className="relative group">
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl px-6 font-black text-lg text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-800"
                      placeholder="75"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 font-black italic">KG</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Optimization Vector</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="w-full h-16 bg-slate-950 border border-slate-800 rounded-2xl px-6 font-black text-[10px] uppercase tracking-widest text-white outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="muscle_gain">Hypertrophy (Lean Gain)</option>
                    <option value="weight_loss">Fat Oxidation (Cut)</option>
                    <option value="endurance">Mitochondrial Stamina</option>
                    <option value="general_fitness">Biological Maintenance</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-20 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-4 group"
                >
                  {loading ? (
                    <>
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                       <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                       Generate Protocol
                       <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Analysis Column */}
          <div className="lg:col-span-8 space-y-10">
            <AnimatePresence mode='wait'>
            {dietPlan ? (
              <motion.div 
                key="plan"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-10"
              >
                {/* Visual Summary Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 shadow-[0_20px_50px_rgba(37,99,235,0.2)] flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                   <div className="relative z-10 space-y-4">
                      <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-tight">Biometric Profile <br/><span className="text-blue-200">Synchronized</span></h3>
                      <div className="flex gap-4">
                         <div className="bg-black/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                            <p className="text-[8px] font-black uppercase text-white/50 tracking-widest mb-1">Status</p>
                            <p className="text-sm font-black italic uppercase">Optimized</p>
                         </div>
                         <div className="bg-black/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                            <p className="text-[8px] font-black uppercase text-white/50 tracking-widest mb-1">Engine</p>
                            <p className="text-sm font-black italic uppercase text-blue-300">Gemini Pro</p>
                         </div>
                      </div>
                   </div>
                   
                   <div className="relative z-10 grid grid-cols-2 gap-4 w-full md:w-auto">
                      <div className="bg-white rounded-3xl p-6 text-black min-w-[140px] text-center shadow-2xl">
                         <Scale size={20} className="mx-auto mb-2 opacity-40" />
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Weight</p>
                         <p className="text-3xl font-black italic">{dietPlan.weight}<span className="text-[10px] ml-1 uppercase">kg</span></p>
                      </div>
                      <div className="bg-slate-900 rounded-3xl p-6 text-white min-w-[140px] text-center border border-white/10">
                         <Target size={20} className="mx-auto mb-2 text-blue-500" />
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Target</p>
                         <p className="text-3xl font-black italic uppercase">{dietPlan.goal === 'muscle_gain' ? 'Lean' : 'Cut'}</p>
                      </div>
                   </div>
                </div>

                {/* Structured Protocol View */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {sections.map((section, idx) => (
                     <motion.div 
                       key={idx}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.1 }}
                       className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 group hover:border-blue-500/30 transition-all"
                     >
                        <div className="flex items-center gap-6 mb-8">
                           <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all shadow-inner">
                              {getSectionIcon(section.title)}
                           </div>
                           <div>
                              <h4 className="text-lg font-black italic uppercase tracking-tighter text-white">{section.title}</h4>
                              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Protocol Segment</p>
                           </div>
                        </div>
                        
                        <ul className="space-y-4">
                           {section.content.map((item, i) => (
                             <li key={i} className="flex items-start gap-4 text-sm font-medium text-slate-400 group/item hover:text-slate-200 transition-colors">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0 group-hover/item:scale-150 transition-all"></div>
                                <span>{item}</span>
                             </li>
                           ))}
                        </ul>
                     </motion.div>
                   ))}
                </div>

                {/* Raw Stream Fallback (styled nicely) */}
                <div className="bg-slate-950 border border-slate-900 rounded-[2.5rem] p-12 text-center border-dashed">
                   <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-4 italic italic">Neural Stream // Full Manifest</p>
                   <div className="text-slate-600 text-xs font-medium leading-relaxed max-w-2xl mx-auto italic">
                      This protocol has been dynamically synthesized based on your metabolic vectors. Optimal adherence recommended for maximum physical transcendence.
                   </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-900 border border-dashed border-slate-800 rounded-[3rem] p-24 flex flex-col items-center justify-center text-center group"
              >
                 <div className="w-32 h-32 bg-slate-950 rounded-full border border-slate-800 flex items-center justify-center text-7xl mb-10 group-hover:scale-110 transition-transform duration-700">
                    📡
                 </div>
                 <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">Awaiting Biometric <br/><span className="text-blue-600">Normalization</span></h3>
                 <p className="text-slate-500 max-w-sm font-medium uppercase text-[10px] tracking-widest leading-loose">
                    Initialize your biological vectors in the constraints panel to synthesize a customized nutrition strategy from the neural cloud.
                 </p>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diet;

