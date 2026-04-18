// Premium Landing Page - FormFix AI
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: '🎯',
      title: 'Real-Time Form Detection',
      description: 'AI-powered pose detection using MediaPipe to automatically track your form and prevent injuries.'
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Track every workout with detailed charts, posture scores, and personalized insights.'
    },
    {
      icon: '🗣️',
      title: 'Voice AI Coach',
      description: 'Real-time audio guidance and corrections during your workouts with motivational feedback.'
    },
    {
      icon: '🥗',
      title: 'AI Diet Planning',
      description: 'Personalized meal plans and nutrition recommendations powered by Google Gemini.'
    },
    {
      icon: '🤖',
      title: 'Smart Suggestions',
      description: 'AI suggests workouts and recovery strategies based on your progress.'
    },
    {
      icon: '📱',
      title: 'Always Available',
      description: 'Train anywhere, anytime with our fully responsive design and offline support.'
    },
  ];

  const testimonials = [
    {
      name: 'Raj Kumar',
      role: 'Fitness Enthusiast',
      text: 'FormFix AI completely transformed my workout routine. The real-time form feedback is game-changing!',
      avatar: '👨‍💼'
    },
    {
      name: 'Priya Singh',
      role: 'Professional Trainer',
      text: 'An incredible tool for coaching. My clients now maintain perfect form throughout their workouts.',
      avatar: '👩‍💼'
    },
    {
      name: 'Arjun Patel',
      role: 'Gym Owner',
      text: 'My members love the AI coach and personalized plans. Retention has improved significantly!',
      avatar: '👨‍🎓'
    },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl group-hover:scale-110 transition-transform">🚀</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              FormFix AI
            </span>
          </Link>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition">How It Works</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition">Testimonials</a>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="px-6 py-2 text-gray-300 hover:text-white transition font-semibold">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all shadow-lg">
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animation */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -top-40 -left-40 animate-blob"></div>
          <div className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -bottom-40 -right-40 animate-blob animation-delay-2000"></div>
          <div className="absolute w-96 h-96 bg-pink-600/20 rounded-full blur-3xl top-1/2 left-1/3 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-sm font-semibold text-blue-300">
                  🎯 The Future of Fitness is Here
                </div>
                <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                  Your AI Fitness Coach for Perfect Form
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Real-time posture correction, AI diet plans, voice coaching, and personalized workouts. Train smarter, not harder.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg transition-all shadow-2xl hover:shadow-blue-500/50 transform hover:-translate-y-1">
                  Get Started Free
                </Link>
                <a href="#features" className="px-8 py-4 border-2 border-gray-500 hover:border-white text-white rounded-xl font-bold text-lg transition-all hover:bg-white/10">
                  Explore Features
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div>
                  <div className="text-2xl font-bold text-blue-400">10K+</div>
                  <p className="text-sm text-gray-400">Active Users</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">95%</div>
                  <p className="text-sm text-gray-400">Satisfaction</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-400">50K+</div>
                  <p className="text-sm text-gray-400">Workouts</p>
                </div>
              </div>
            </div>

            {/* Hero Image/Animation */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-800 transform hover:scale-105 transition-transform">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-6xl">🏋️</div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Form Score</p>
                      <p className="text-3xl font-bold text-green-400">98%</p>
                    </div>
                  </div>
                  <div className="h-24 bg-gradient-to-t from-blue-600/30 to-transparent rounded-lg flex items-end justify-between px-4 py-2">
                    <div className="w-1 bg-blue-500 rounded-full" style={{ height: '20%' }}></div>
                    <div className="w-1 bg-blue-500 rounded-full" style={{ height: '40%' }}></div>
                    <div className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: '80%' }}></div>
                    <div className="w-1 bg-blue-500 rounded-full" style={{ height: '60%' }}></div>
                    <div className="w-1 bg-blue-500 rounded-full" style={{ height: '45%' }}></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-800 rounded p-2 text-center">
                      <p className="text-xs text-gray-400">Rep Count</p>
                      <p className="font-bold text-white">24</p>
                    </div>
                    <div className="bg-gray-800 rounded p-2 text-center">
                      <p className="text-xs text-gray-400">Posture</p>
                      <p className="font-bold text-green-400">Good</p>
                    </div>
                    <div className="bg-gray-800 rounded p-2 text-center">
                      <p className="text-xs text-gray-400">Time</p>
                      <p className="font-bold text-white">2:45m</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-sm font-semibold text-blue-300 mb-4">
              ✨ Powerful Features
            </div>
            <h2 className="text-5xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-400">Transform your fitness journey with cutting-edge AI technology</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm font-semibold text-purple-300 mb-4">
              🚀 Getting Started
            </div>
            <h2 className="text-5xl font-bold text-white mb-4">Simple 4-Step Setup</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Sign Up', desc: 'Create account in seconds' },
              { step: '2', title: 'Enable Camera', desc: 'Allow webcam access' },
              { step: '3', title: 'Start Training', desc: 'AI detects your exercises' },
              { step: '4', title: 'Track Progress', desc: 'View detailed analytics' }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-xl">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 text-center">{item.desc}</p>
                </div>
                {idx < 3 && <div className="hidden md:block absolute top-8 -right-8 w-16 h-1 bg-gradient-to-r from-blue-600/50 to-transparent"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Loved by Fitness Enthusiasts</h2>
            <p className="text-xl text-gray-400">Real reviews from real users</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-8 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-purple-500/50 transition-all">
                <div className="flex items-start mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-50"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform?</h2>
              <p className="text-xl text-blue-100 mb-8">Join thousands of users achieving their fitness goals with FormFix AI.</p>
              <Link to="/signup" className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl">
                Start Your Journey Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🚀</span>
                <span className="font-bold text-white">FormFix AI</span>
              </div>
              <p className="text-gray-400 text-sm">Your AI Fitness Coach for Perfect Form</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">License</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>&copy; 2026 FormFix AI. All rights reserved. | Made with 💪 for Fitness Lovers</p>
          </div>
        </div>
      </footer>

      {/* Add animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Landing;
