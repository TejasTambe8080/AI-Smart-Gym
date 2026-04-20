import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">💪</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Smart Gym</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/login" className="text-slate-600 hover:text-blue-600 transition-colors">Sign In</Link>
            <Link to="/signup" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-50 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">About Smart Gym AI</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We're building the future of fitness. A platform that makes working out smarter, safer, and more effective for everyone.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-slate-900">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                We believe fitness should be accessible to everyone. Not just those with personal trainers or gyms nearby. That's why we created Smart Gym AI — to give you a personal AI coach in your pocket.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Whether you're starting your fitness journey or pushing for new personal records, our AI helps you train smarter, stay injury-free, and reach your goals faster.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-slate-600 font-semibold">Perfect Form, Every Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '❤️',
                title: 'Health First',
                desc: 'Your safety and wellbeing comes before everything. We prioritize injury prevention and sustainable fitness.'
              },
              {
                icon: '🎓',
                title: 'Accessibility',
                desc: 'Fitness technology should be available to everyone, regardless of their experience level or budget.'
              },
              {
                icon: '🔬',
                title: 'Science-Driven',
                desc: 'Everything we build is backed by sports science and biomechanics research.'
              },
              {
                icon: '🤝',
                title: 'Community',
                desc: 'We believe in building a supportive fitness community where everyone can celebrate progress together.'
              },
              {
                icon: '🔐',
                title: 'Privacy',
                desc: 'Your data is yours. We never sell or share your personal information with anyone.'
              },
              {
                icon: '⚡',
                title: 'Innovation',
                desc: 'We constantly improve our technology to give you the best fitness experience possible.'
              }
            ].map((value, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">Built by Fitness Enthusiasts</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our team combines expertise in AI, fitness science, and software engineering to create tools that actually help people reach their goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { role: 'AI & Machine Learning', desc: 'Building computer vision models to analyze movement and form' },
              { role: 'Fitness Science', desc: 'Ensuring our recommendations are backed by sports science' },
              { role: 'Product & Design', desc: 'Making complex fitness tech simple and intuitive' },
              { role: 'Engineering', desc: 'Creating fast, reliable, and secure platforms' }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.role}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">Ready to Get Started?</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Join thousands of people who are already using Smart Gym AI to train smarter and reach their fitness goals.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all">
              Get Started Free
            </Link>
            <Link to="/login" className="bg-blue-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-400 transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-600">
          <p>© 2026 Smart Gym AI. Building the future of fitness.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
