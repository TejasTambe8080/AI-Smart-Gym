// Premium Corporate SaaS Landing Page - FormFix AI
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  BarChart, 
  Target, 
  Brain, 
  Camera, 
  ChevronRight, 
  Star,
  Activity,
  ArrowRight
} from 'lucide-react';

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: <Target className="text-blue-400" />, title: 'Precision Tracking', desc: 'Millisecond-level skeleton analysis for perfect posture execution.' },
    { icon: <BarChart className="text-purple-400" />, title: 'Advanced Analytics', desc: 'Deep-dive into your biometric data with institutional-grade charts.' },
    { icon: <Brain className="text-emerald-400" />, title: 'AI Neural Coach', desc: 'Predictive workout adjustments powered by Gemini Large Language Models.' },
    { icon: <Zap className="text-yellow-400" />, title: 'Real-time Feedback', desc: 'Instant voice and visual corrections during your most intense sets.' },
    { icon: <Shield className="text-cyan-400" />, title: 'Privacy First', desc: 'Local-first processing ensures your video data never leaves your device.' },
    { icon: <Activity className="text-pink-400" />, title: 'Performance Metrics', desc: 'Holistic view of your cardiovascular and muscular evolution.' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Activity className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">FormFix<span className="text-blue-500">AI</span></span>
          </Link>
          
          <div className="hidden lg:flex gap-10 items-center">
            {['Features', 'Intelligence', 'Enterprise'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-slate-400 hover:text-white transition-colors tracking-wide uppercase">{item}</a>
            ))}
            <div className="w-[1px] h-4 bg-slate-800"></div>
            <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wide">Sign In</Link>
            <Link to="/signup" className="group relative px-6 py-2.5 bg-white text-[#020617] rounded-full font-bold text-sm overflow-hidden transition-all hover:pr-10">
              <span className="relative z-10 uppercase tracking-widest">Join Platform</span>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={18} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-40 z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-12"
          >
            <Star size={14} fill="currentColor" />
            Empowering 50,000+ Elite Performers
          </motion.div>
          
          <motion.h1 
            style={{ opacity, scale }}
            className="text-6xl lg:text-[100px] font-black tracking-tighter leading-[0.9] mb-12 italic"
          >
            PRECISION <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500">BIOMECHANICS</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed mb-16 font-medium"
          >
            The world's most advanced AI-powered fitness engine. Institutional-grade skeletal tracking meets personalized neural coaching.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link to="/signup" className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-3 group">
              Start Your Evolution <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link to="/login" className="px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white border border-white/5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all">
              Platform Portal
            </Link>
          </motion.div>

          {/* Large Hero Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="mt-32 relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[3rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-slate-900 rounded-[2.5rem] border border-white/10 p-2 shadow-[0_0_100px_rgba(37,99,235,0.1)] overflow-hidden">
              <img 
                src="/dashboard_mockup.png" 
                alt="FormFix AI Interface" 
                className="w-full h-auto rounded-[2rem] object-cover ring-1 ring-white/10"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intelligence Section (The one from user screenshot) */}
      <section id="intelligence" className="py-32 relative z-10 overflow-hidden bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-blue-500 font-black uppercase tracking-[0.3em] text-sm mb-6">Neural Engine</h2>
                <h3 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-8">
                  SIMPLIFY YOUR <br />
                  <span className="italic text-slate-500 uppercase">BIOMECHANICS</span>
                </h3>
              </div>
              
              <div className="space-y-10">
                {[
                  { step: '01', title: 'Neural Sync', desc: 'Instant connection with any high-fidelity camera array via encrypted WebSocket streaming.' },
                  { step: '02', title: 'Kinetic Analysis', desc: 'Proprietary computer vision model translates pixels into 25+ biometric vectors in real-time.' },
                  { step: '03', title: 'Data Infusion', desc: 'Aggregated analytics synthesized into actionable cognitive insights for performance scaling.' }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 10 }}
                    className="flex gap-8 items-start group cursor-default"
                  >
                    <span className="text-5xl font-black text-slate-800 group-hover:text-blue-500/50 transition-colors">{item.step}</span>
                    <div className="space-y-2">
                       <h4 className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">{item.title}</h4>
                       <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-10 bg-blue-600/10 rounded-full blur-[100px]"></div>
              <div className="relative bg-slate-900 border border-white/5 p-4 rounded-[2.5rem] shadow-2xl overflow-hidden group">
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Neural Link Active</span>
                </div>
                <img 
                  src="/biomechanics.png" 
                  alt="AI Biomechanics Analysis" 
                  className="w-full h-auto rounded-[1.8rem] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-10 left-10 space-y-2">
                  <p className="text-[10px] font-mono text-blue-400">// ANALYZING_VECTORS: ACTIVE</p>
                  <p className="text-white font-bold tracking-tight">SQUAT_DEPTH: <span className="text-blue-400">98% OPTIMAL</span></p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-blue-400 font-bold uppercase tracking-[0.2em] text-xs">The Stack</h2>
            <h3 className="text-5xl font-black tracking-tight leading-none">EQUIPPED FOR EXCELLENCE</h3>
            <p className="text-slate-400 font-medium">Every tool you need to transcend your current limits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[2rem] bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   {feature.icon}
                </div>
                <div className="w-14 h-14 bg-slate-950 rounded-[1.2rem] border border-white/5 flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform">
                   {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{feature.title}</h4>
                <p className="text-slate-400 font-medium text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-blue-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white text-blue-500 rounded-full blur-[180px] opacity-20 -mr-96 -mt-96"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-12">
           <h2 className="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-none italic uppercase">
             BEGIN YOUR <br />
             TRANSFORMATION
           </h2>
           <p className="text-blue-100 text-xl font-bold max-w-xl mx-auto uppercase tracking-widest">
             Immediate Access. No Barriers. Free Forever for Individuals.
           </p>
           <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pt-10"
           >
             <Link to="/signup" className="px-16 py-6 bg-white text-blue-600 rounded-2xl font-black text-2xl hover:shadow-[0_20px_50px_rgba(255,255,255,0.3)] transition-all uppercase tracking-tighter">
               Create Identity
             </Link>
           </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-white/5 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-24 mb-20">
             <div className="col-span-2 space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                     <Activity size={24} />
                   </div>
                   <span className="font-black text-white text-3xl tracking-tighter uppercase italic">FormFix<span className="text-blue-600">AI</span></span>
                </div>
                <p className="text-slate-500 text-sm max-w-xs leading-relaxed font-bold uppercase tracking-wide">
                  Architected for the elite. Engineered for the future of human performance.
                </p>
             </div>
             <div>
                <h5 className="font-black text-white uppercase text-xs tracking-widest mb-10">Intelligence</h5>
                <div className="flex flex-col gap-6 text-sm text-slate-500 font-bold uppercase tracking-widest">
                   <a href="#features" className="hover:text-blue-500 transition-colors">Neural Stack</a>
                   <a href="#intelligence" className="hover:text-blue-500 transition-colors">Biomechanics</a>
                   <a href="#" className="hover:text-blue-500 transition-colors">Pricing</a>
                </div>
             </div>
             <div>
                <h5 className="font-black text-white uppercase text-xs tracking-widest mb-10">Entity</h5>
                <div className="flex flex-col gap-6 text-sm text-slate-500 font-bold uppercase tracking-widest">
                   <Link to="/about" className="hover:text-blue-500 transition-colors">Manifesto</Link>
                   <Link to="/careers" className="hover:text-blue-500 transition-colors">Careers</Link>
                   <Link to="/privacy" className="hover:text-blue-500 transition-colors">Security</Link>
                </div>
             </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-center flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">© 2026 FormFix AI Protocol. All Rights Reserved.</p>
             <div className="flex gap-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <a href="#" className="hover:text-white transition-colors tracking-widest">Twitter / X</a>
                <a href="#" className="hover:text-white transition-colors tracking-widest">Github</a>
                <a href="#" className="hover:text-white transition-colors tracking-widest">LinkedIn</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
