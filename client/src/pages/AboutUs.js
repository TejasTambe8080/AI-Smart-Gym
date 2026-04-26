import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Target, Brain, Users, Award, Zap, ArrowRight, ChevronLeft, Activity } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <ChevronLeft size={20} className="text-slate-500 group-hover:text-white group-hover:-translate-x-1 transition-all" />
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">Return // <span className="text-blue-500">Main</span></span>
          </Link>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-slate-600 transition-all">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 z-10">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 shadow-2xl shadow-blue-500/10"
          >
            <Shield size={12} /> The Manifesto // Protocol 01
          </motion.div>
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none italic uppercase">
            HUMAN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500">TRANSCENDENCE</span>
          </h1>
          <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed font-bold italic">
            FormFix AI is not just a platform. It's an institutional-grade infrastructure designed to optimize the kinetic potential of every human entity.
          </p>
        </div>
      </section>

      {/* Mission Node */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-10">
                 <div className="space-y-4">
                    <h2 className="text-blue-500 font-black uppercase tracking-[0.4em] text-xs">Strategic Objective</h2>
                    <h3 className="text-4xl lg:text-5xl font-black tracking-tighter italic uppercase">Universal Biometric <br /><span className="text-slate-500">Calibration</span></h3>
                 </div>
                 <div className="space-y-8">
                     <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
                        We believe that elite-level coaching should be a universal standard, not a premium luxury. Our mission is to democratize institutional sports science through high-fidelity computer vision and neural engineering.
                     </p>
                     <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
                        By translating complex kinetic movements into actionable data vectors, we empower every user to train with the precision of a professional athlete.
                     </p>
                 </div>
                 <div className="flex gap-4">
                    <div className="flex-1 bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 group hover:border-blue-500/30 transition-all">
                       <Target className="text-blue-500" size={32} />
                       <h4 className="text-white font-black uppercase text-sm tracking-widest italic">Precision Target</h4>
                       <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed">Eliminating injury risk through 99.9% posture fidelity.</p>
                    </div>
                    <div className="flex-1 bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 group hover:border-purple-500/30 transition-all">
                       <Zap className="text-purple-500" size={32} />
                       <h4 className="text-white font-black uppercase text-sm tracking-widest italic">Neural Speed</h4>
                       <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed">Instant recursive feedback during protocol execution.</p>
                    </div>
                 </div>
             </div>
             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[3rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-slate-900 border border-white/5 p-4 rounded-[2.5rem] overflow-hidden shadow-2xl">
                   <img 
                     src="/manifesto_viz.png" 
                     alt="Neural Manifesto Visualization" 
                     className="w-full h-auto rounded-[1.8rem] grayscale hover:grayscale-0 transition-all duration-700" 
                   />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Values Matrix */}
      <section className="py-32 px-6 bg-slate-950/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-blue-500 font-black uppercase tracking-[0.2em] text-xs">Core Logic</h2>
            <h3 className="text-5xl font-black tracking-tighter italic uppercase">PLATFORM PILLARS</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Award className="text-blue-500" />, title: 'Elite Standards', desc: 'Every recommendation is calibrated against elite athletes and institutional sports science research.' },
              { icon: <Shield className="text-emerald-500" />, title: 'Sovereign Privacy', desc: 'Proprietary local-first processing ensures biometric data streaming never compromises individual privacy.' },
              { icon: <Brain className="text-purple-500" />, title: 'Neural Evolution', desc: 'Constant platform refinement through large-scale LLM synthesis and recursive AI model training.' },
              { icon: <Users className="text-amber-500" />, title: 'Global Collective', desc: 'Building a high-performance network where progress is shared and excellence is the default.' },
              { icon: <Activity className="text-rose-500" />, title: 'Radical Honesty', desc: 'Biometric stats tell the truth. We provide the hard data needed for genuine physical breakthrough.' },
              { icon: <Target className="text-cyan-500" />, title: 'Singular Focus', desc: 'A platform stripped of distractions, engineered solely for your physical and mental optimization.' }
            ].map((value, idx) => (
              <div key={idx} className="p-10 rounded-[2.5rem] bg-slate-900/40 border border-slate-800 hover:border-blue-500/30 hover:bg-slate-900 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   {value.icon}
                </div>
                <div className="w-14 h-14 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                   {React.cloneElement(value.icon, { size: 24 })}
                </div>
                <h3 className="text-xl font-black text-white mb-4 uppercase italic tracking-tight group-hover:text-blue-500 transition-colors">{value.title}</h3>
                <p className="text-slate-500 font-bold text-sm leading-relaxed italic">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Directive */}
      <section className="py-40 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">JOIN THE <br /><span className="text-blue-600 italic">ELEVATION</span></h2>
            <p className="text-slate-500 text-lg font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto">
              Your previous limits were merely the baseline of our neural model.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/signup" className="h-20 px-14 bg-white text-[#020617] rounded-3xl font-black uppercase text-sm tracking-[0.3em] hover:shadow-[0_20px_60px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-4 italic group">
              Initialize Protocol <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Bridge */}
      <footer className="py-16 px-6 border-t border-white/5 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto text-center space-y-4">
           <div className="flex items-center justify-center gap-3 opacity-50 contrast-150">
              <Activity className="text-blue-600" size={20} />
              <span className="font-black text-white tracking-tighter uppercase italic">FormFix<span className="text-blue-600">AI</span></span>
           </div>
           <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] italic">© 2026 Institutional Performance Protocol.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
