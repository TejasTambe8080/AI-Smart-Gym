import React, { useState, useEffect } from 'react';
import { authService, aiService } from '../services/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, RefreshCw, Zap, Target, Clock, Brain, ChevronRight, Layout, Info } from 'lucide-react';
import StatusHandler from '../components/StatusHandler';

const AIWorkoutPlanner = () => {
  const [user, setUser] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setFetchingUser(true);
      const response = await authService.getProfile();
      setUser(response.data.user);
    } catch (error) {
      toast.error('Neural identity sync failed.');
    } finally {
      setFetchingUser(false);
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

      const response = await aiService.generateWorkoutPlan({ query: prompt });

      if (response.data.success && response.data.reply) {
         try {
           const planData = JSON.parse(response.data.reply);
           setWorkoutPlan(planData);
           if (planData.weeklyPlan?.length > 0) setSelectedDay(planData.weeklyPlan[0]);
           toast.success('Strategy generated and synchronized! 🗓️');
         } catch (e) {
           setWorkoutPlan({ weeklyPlan: generateSamplePlan(), summary: "Neural link output standardized for compatibility." });
         }
      }
    } catch (error) {
      toast.error('AI Strategy generation failed. Reverting to local cache.');
      setWorkoutPlan({ weeklyPlan: generateSamplePlan(), summary: "Standardized performance trajectory deployed." });
    } finally {
      setLoading(false);
    }
  };

  const generateSamplePlan = () => [
    { day: 'Monday', focus: 'Chest & Triceps', duration: '45 mins', exercises: [ { name: 'Bench Press', sets: '4x8', rest: '90s', tips: 'Explosive drive' }, { name: 'Dips', sets: '3x12', rest: '60s', tips: 'Full extension' } ] },
    { day: 'Tuesday', focus: 'Back & Biceps', duration: '50 mins', exercises: [ { name: 'Deadlifts', sets: '4x6', rest: '120s', tips: 'Neutral spine' }, { name: 'Pull Ups', sets: '4xMAX', rest: '90s', tips: 'Dead hang focus' } ] },
    { day: 'Wednesday', focus: 'Active Recovery', duration: '30 mins', exercises: [ { name: 'Yoga / Mobility', sets: '30m', rest: '—', tips: 'Breathing priority' } ] },
    { day: 'Thursday', focus: 'Legs & Core', duration: '60 mins', exercises: [ { name: 'Squats', sets: '5x5', rest: '120s', tips: 'Drive through heels' } ] },
    { day: 'Friday', focus: 'Shoulders', duration: '45 mins', exercises: [ { name: 'Overhead Press', sets: '4x8', rest: '90s', tips: 'Full lockout' } ] },
    { day: 'Saturday', focus: 'Metabolic Load', duration: '40 mins', exercises: [ { name: 'Sprint Intervals', sets: '10x100m', rest: '60s', tips: 'Max effort' } ] },
    { day: 'Sunday', focus: 'System Rest', duration: '—', exercises: [ { name: 'Rest', sets: '—', rest: '—', tips: 'Prioritize sleep' } ] }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-4 lg:p-10 animate-enter scrollbar-hide">
      <StatusHandler loading={fetchingUser}>
        <div className="max-w-7xl mx-auto space-y-10"> {/* Main Cinematic Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="space-y-3">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400">
                  <Brain size={12} className="animate-pulse" />
                  AI Powered // Workout Plan
               </div>
               <h1 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                 Workout <span className="text-blue-600">Planner</span>
               </h1>
               <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] flex items-center gap-2 italic">
                 Personalized 7-day workout routine just for you.
               </p>
            </div>
            {workoutPlan && (
              <button 
                onClick={() => setWorkoutPlan(null)}
                className="h-16 px-8 bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl flex items-center justify-center gap-3"
              >
                <RefreshCw size={18} /> New Plan
              </button>
            )}
          </div>

          {!workoutPlan ? (
            <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-16 lg:p-24 text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5"></div>
               <div className="relative z-10 space-y-10 max-w-2xl mx-auto">
                  <div className="w-24 h-24 bg-slate-950 rounded-[2rem] border border-slate-800 flex items-center justify-center text-4xl mx-auto shadow-2xl group-hover:scale-110 group-hover:border-blue-500/30 transition-all duration-700">
                     <Calendar className="text-blue-500" size={40} />
                  </div>
                  <div className="space-y-4">
                     <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tighter italic uppercase">Build Your Weekly Plan</h2>
                     <p className="text-slate-500 text-sm font-bold leading-relaxed italic">
                        Our AI models will analyze your fitness level (Weight: {user?.weight}kg, Goal: {user?.fitnessGoal}) 
                        to create a custom 7-day training schedule.
                     </p>
                  </div>
                  <button
                    onClick={generateWorkoutPlan}
                    disabled={loading}
                    className="h-20 px-12 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] italic transition-all shadow-2xl shadow-blue-600/40 flex items-center justify-center gap-4 mx-auto disabled:opacity-50"
                  >
                    {loading ? (
                       <>
                         <RefreshCw className="animate-spin" size={20} />
                         Creating Plan...
                       </>
                    ) : (
                       <>
                         <Zap className="fill-current" size={20} />
                         Generate Plan
                       </>
                    )}
                  </button>
               </div>
            </div>
          ) : (
            <div className="space-y-10 animate-enter">
              {/* Tab Selector */}
              <div className="flex gap-4 p-2 bg-slate-900/50 border border-slate-800 rounded-[2rem] w-fit">
                {[
                  { id: 'overview', label: 'Full Week', icon: Layout },
                  { id: 'weekly', label: 'Daily Workouts', icon: Calendar }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 ${
                        activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      <Icon size={14} /> {tab.label}
                    </button>
                  );
                })}
              </div>

              {activeTab === 'overview' && (
                <div className="space-y-10">
                  <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 lg:p-14 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-12 opacity-5 italic font-black text-9xl pointer-events-none grayscale uppercase tracking-tighter">Plan</div>
                     <div className="max-w-3xl relative z-10 space-y-8">
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                           <Target className="text-blue-500" /> Plan Summary
                        </h3>
                        <p className="text-slate-400 font-bold leading-relaxed italic text-lg tracking-tight">{workoutPlan.summary || 'A custom routine designed to maximize your efficiency and reach your fitness goals.'}</p>
                     </div>
                     
                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mt-16 relative z-10">
                        {workoutPlan.weeklyPlan?.map((day, idx) => (
                          <div
                            key={idx}
                            onClick={() => { setSelectedDay(day); setActiveTab('weekly'); }}
                            className="bg-slate-950 border border-slate-800 hover:border-blue-500/30 hover:bg-blue-600/5 p-6 rounded-[2rem] text-center cursor-pointer transition-all group flex flex-col items-center gap-4"
                          >
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 group-hover:text-blue-500 transition-colors">{day.day}</p>
                            <div className="w-12 h-12 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                               {day.focus.toLowerCase().includes('rest') ? '💤' : '🏋️'}
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-white uppercase italic tracking-tighter truncate w-full">{day.focus}</p>
                               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{day.duration}</p>
                            </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 space-y-8">
                        <h4 className="text-white text-lg font-black italic uppercase tracking-widest flex items-center gap-3">
                           <Info size={20} className="text-blue-500" /> Professional Tips
                        </h4>
                        <div className="space-y-4">
                           {(workoutPlan.tips || ['Focus on proper form over weight', 'Stay hydrated throughout the week']).map((tip, idx) => (
                             <div key={idx} className="flex gap-4 p-5 bg-slate-950 rounded-2xl border border-slate-800 group hover:border-blue-500/20 transition-all">
                                <div className="text-blue-500 font-black italic text-sm">0{idx+1}</div>
                                <p className="text-slate-400 font-bold italic text-sm leading-relaxed">{tip}</p>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'weekly' && selectedDay && (
                <div className="space-y-8 animate-enter">
                   <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 lg:p-14 bg-gradient-to-br from-slate-900 to-blue-900/10 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                      <div className="absolute -left-10 -bottom-10 text-[200px] opacity-5 font-black italic pointer-events-none grayscale uppercase tracking-tighter">{selectedDay.day.slice(0,3)}</div>
                      <div className="space-y-3 text-center md:text-left relative z-10">
                         <h2 className="text-5xl lg:text-6xl font-black text-white tracking-widest uppercase italic leading-none">{selectedDay.day}</h2>
                         <p className="text-blue-500 font-black uppercase tracking-[0.3em] ml-1">{selectedDay.focus}</p>
                      </div>
                      <div className="px-10 py-6 bg-slate-950 rounded-[2rem] border border-slate-800 shadow-2xl relative z-10">
                         <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1 text-center">Duration</p>
                         <p className="text-4xl font-black text-white italic tracking-tighter">{selectedDay.duration}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-6">
                      {selectedDay.exercises?.map((ex, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 lg:p-10 group hover:border-slate-700 transition-all">
                           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                              <div className="space-y-6 flex-1">
                                 <div className="flex items-center gap-5">
                                    <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 w-12 h-12 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-inner italic">0{idx+1}</span>
                                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{ex.name}</h3>
                                 </div>
                                 <div className="flex gap-12">
                                    <div>
                                       <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Sets & Reps</p>
                                       <p className="text-2xl font-black text-white italic">{ex.sets}</p>
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Rest Time</p>
                                       <p className="text-2xl font-black text-purple-500 italic tracking-tighter">{ex.rest}</p>
                                    </div>
                                 </div>
                              </div>
                              <div className="lg:max-w-md w-full bg-slate-950 p-6 rounded-3xl border border-slate-800 relative shadow-inner group-hover:border-emerald-500/30 transition-all">
                                 <div className="flex items-center gap-2 mb-3">
                                    <Zap className="text-emerald-500" size={14} />
                                    <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest italic">Coach's Tip</p>
                                 </div>
                                 <p className="text-slate-400 text-sm font-bold leading-relaxed italic tracking-tight">"{ex.tips}"</p>
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
      </StatusHandler>
    </div>
  );
};

export default AIWorkoutPlanner;
