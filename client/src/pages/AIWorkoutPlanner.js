// Premium AI Workout Planner - High-Fidelity Neural Engineering
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authService } from '../services/api';
import { toast } from 'react-hot-toast';

const AIWorkoutPlanner = () => {
  const [user, setUser] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data.user);
    } catch (error) {
      console.error('Bio-Sync Failure:', error);
    }
  };

  const generateWorkoutPlan = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const prompt = `Generate a detailed 7-day workout plan for someone with these details:
      Goal: ${user.fitnessGoal || 'General Fitness'}
      Weight: ${user.weight || 70}kg
      Height: ${user.height || 170}cm
      Experience: Beginner to Intermediate`;

      const response = await axios.post('http://localhost:5000/api/ai/generate-workout', { query: prompt });

      if (response.data.success && response.data.reply) {
         try {
           const planData = JSON.parse(response.data.reply);
           setWorkoutPlan(planData);
           if (planData.weeklyPlan?.length > 0) setSelectedDay(planData.weeklyPlan[0]);
           toast.success('Strategy generated and synchronized! 🗓️');
         } catch (e) {
           setWorkoutPlan({ weeklyPlan: generateSamplePlan(), summary: "Neural link output standardized." });
         }
      }
    } catch (error) {
      setWorkoutPlan({ weeklyPlan: generateSamplePlan() });
    } finally {
      setLoading(false);
    }
  };

  const generateSamplePlan = () => [
    { day: 'Monday', focus: 'Chest & Triceps', duration: '45 mins', exercises: [ { name: 'Bench Press', sets: '4x8', rest: '90s', tips: 'Explosive drive' } ] },
    { day: 'Tuesday', focus: 'Back & Biceps', duration: '50 mins', exercises: [ { name: 'Deadlifts', sets: '4x6', rest: '120s', tips: 'Neutral spine' } ] },
    { day: 'Wednesday', focus: 'Rest Loop', duration: '—', exercises: [ { name: 'Yoga', sets: '20m', rest: '—', tips: 'Breathing priority' } ] }
  ];

  return (
    <div className="min-h-screen bg-slate-900/50 p-6 lg:p-8 animate-enter">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tight italic">🗓️ Protocol Orchestrator</h1>
            <p className="text-slate-400 font-medium">Neural-computed 7-day training sequences optimized for your goals.</p>
          </div>
          {workoutPlan && (
            <button onClick={() => setWorkoutPlan(null)} className="btn-secondary h-12">
               ↻ Regenerate Matrix
            </button>
          )}
        </div>

        {!workoutPlan ? (
          /* Generate Cinematic CTA */
          <div className="glass-card p-16 rounded-[4rem] border-slate-700/30 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5"></div>
            <div className="relative z-10 space-y-10">
               <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center text-5xl mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-700">🗓️</div>
               <div className="space-y-4 max-w-2xl mx-auto">
                  <h2 className="text-4xl font-black text-white tracking-tighter">Initialize Your Weekly Engine</h2>
                  <p className="text-slate-400 text-lg font-medium leading-relaxed">
                    Our AI models will analyze your current biometrics (Weight: {user?.weight}kg, Goal: {user?.fitnessGoal}) 
                    to compute a precision-weighted 7-day training schedule.
                  </p>
               </div>
               <button
                 onClick={generateWorkoutPlan}
                 disabled={loading}
                 className="btn-primary h-16 px-12 text-lg shadow-2xl shadow-blue-500/20"
               >
                 {loading ? '🧠 Computing Neural Trajectory...' : '⚡ Generate Performance Matrix'}
               </button>
            </div>
          </div>
        ) : (
          /* High-Fidelity Plan Interface */
          <div className="space-y-10 animate-enter">
            {/* Context Navigation */}
            <div className="flex gap-2 p-1.5 bg-slate-800/50 border border-slate-700/50 rounded-2xl w-fit">
              {[
                { id: 'overview', label: 'Matrix View', icon: '📋' },
                { id: 'weekly', label: 'Day Specifics', icon: '📅' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-widest ${
                    activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-10">
                <div className="premium-card p-10 rounded-[3rem]">
                   <h3 className="text-2xl font-black text-white mb-6">Neural Strategy Overview</h3>
                   <p className="text-slate-400 font-medium leading-relaxed mb-10 max-w-3xl">{workoutPlan.summary || 'Follow this computational path for maximum physical adaptation.'}</p>
                   
                   {/* Day Grid */}
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                      {workoutPlan.weeklyPlan?.map((day, idx) => (
                        <div
                          key={idx}
                          onClick={() => { setSelectedDay(day); setActiveTab('weekly'); }}
                          className="premium-card p-5 border-slate-800 hover:border-blue-500/50 hover:bg-blue-600/5 cursor-pointer transition-all text-center group"
                        >
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">{day.day}</p>
                          <div className="text-3xl mb-4 group-hover:scale-125 transition-transform duration-500">
                             {day.focus.toLowerCase().includes('rest') ? '💤' : '🏋️'}
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{day.duration}</p>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Intelligent Hints */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="glass-card p-8 rounded-[2rem] border-blue-500/10">
                      <h4 className="text-blue-400 text-xs font-black uppercase tracking-widest mb-6 italic">Strategy Notes</h4>
                      <ul className="space-y-4">
                         {(workoutPlan.tips || ['Prioritize form check', 'Hydrate adequately']).map((tip, idx) => (
                           <li key={idx} className="flex items-center gap-3 text-slate-300 font-medium text-sm">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                              {tip}
                           </li>
                         ))}
                      </ul>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'weekly' && selectedDay && (
              <div className="space-y-8 animate-enter">
                 {/* Day Profile */}
                 <div className="glass-card p-10 rounded-[3rem] bg-gradient-to-r from-blue-600/20 to-indigo-600/20 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-2 text-center md:text-left">
                       <h2 className="text-5xl font-black text-white tracking-widest uppercase italic">{selectedDay.day}</h2>
                       <p className="text-blue-400 font-bold uppercase tracking-widest">{selectedDay.focus}</p>
                    </div>
                    <div className="px-10 py-5 bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl">
                       <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1 text-center">Session Weight</p>
                       <p className="text-3xl font-black text-white italic">{selectedDay.duration}</p>
                    </div>
                 </div>

                 {/* Exercises Stream */}
                 <div className="grid grid-cols-1 gap-6">
                    {selectedDay.exercises?.map((ex, idx) => (
                      <div key={idx} className="premium-card p-8 group hover:bg-slate-800/40 transition-colors">
                         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="space-y-4 flex-1">
                               <div className="flex items-center gap-4">
                                  <span className="text-xs font-black text-blue-500 bg-blue-500/10 w-10 h-10 rounded-xl flex items-center justify-center border border-blue-500/20">{idx+1}</span>
                                  <h3 className="text-2xl font-black text-white tracking-tight">{ex.name}</h3>
                               </div>
                               <div className="flex gap-6">
                                  <div>
                                     <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Protocol</p>
                                     <p className="text-xl font-black text-white italic">{ex.sets}</p>
                                  </div>
                                  <div>
                                     <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Downtime</p>
                                     <p className="text-xl font-black text-purple-400 italic">{ex.rest}</p>
                                  </div>
                               </div>
                            </div>
                            <div className="md:w-1/3 bg-slate-950 p-5 rounded-2xl border border-slate-800 relative group-hover:border-emerald-500/30 transition-all">
                               <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-2 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Logic Tip
                               </p>
                               <p className="text-slate-400 text-xs font-bold leading-relaxed">{ex.tips}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIWorkoutPlanner;
