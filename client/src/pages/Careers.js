import React from 'react';
import { Link } from 'react-router-dom';

const Careers = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">💪</div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Smart Gym</span>
          </Link>
          <Link to="/" className="text-slate-600 hover:text-blue-600 transition-colors">Back to Home</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 md:pt-48 md:pb-32 bg-gradient-to-r from-blue-50 to-slate-50 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">Join Our Team</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            We're looking for talented people who are passionate about fitness, technology, and making a real impact in people's lives.
          </p>
        </div>
      </div>

      {/* Why Join Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Why Work With Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              {
                icon: '🎯',
                title: 'Mission-Driven Work',
                desc: 'Help millions of people reach their fitness goals and live healthier lives.'
              },
              {
                icon: '🧠',
                title: 'Cutting-Edge Technology',
                desc: 'Work with AI, computer vision, and modern web technologies.'
              },
              {
                icon: '🌱',
                title: 'Growth Opportunities',
                desc: 'Learn from experienced professionals and grow your skills.'
              },
              {
                icon: '🤝',
                title: 'Great Team',
                desc: 'Collaborate with passionate, friendly people who love fitness and tech.'
              },
              {
                icon: '💪',
                title: 'Health & Wellness',
                desc: 'Free Smart Gym AI premium access and wellness benefits for you and your family.'
              },
              {
                icon: '🏠',
                title: 'Flexible Work',
                desc: 'Work from anywhere. We believe in results, not desk time.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-20 md:py-32 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">Open Positions</h2>
          
          <div className="space-y-6">
            {[
              {
                title: 'Senior Machine Learning Engineer',
                team: 'AI & ML',
                level: 'Senior',
                description: 'Build and improve our computer vision models for form analysis and injury prevention.',
                skills: ['Python', 'TensorFlow', 'MediaPipe', 'Computer Vision']
              },
              {
                title: 'Full Stack Developer',
                team: 'Product',
                level: 'Mid-Level',
                description: 'Help us build the next generation of our fitness platform using React and Node.js.',
                skills: ['React', 'Node.js', 'MongoDB', 'WebRTC']
              },
              {
                title: 'Product Manager',
                team: 'Product',
                level: 'Mid-Level',
                description: 'Lead the vision for our fitness AI platform and work directly with users to understand their needs.',
                skills: ['Product Strategy', 'User Research', 'Analytics', 'Fitness Knowledge']
              },
              {
                title: 'Fitness Scientist',
                team: 'Science',
                level: 'Mid-Level',
                description: 'Ensure our AI recommendations are backed by the latest sports science and biomechanics research.',
                skills: ['Exercise Science', 'Biomechanics', 'Research', 'Data Analysis']
              },
              {
                title: 'DevOps Engineer',
                team: 'Infrastructure',
                level: 'Mid-Level',
                description: 'Build and maintain our cloud infrastructure. Keep our platform fast, reliable, and secure.',
                skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
              }
            ].map((job, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{job.title}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-slate-600">
                      <span className="font-semibold">{job.team}</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{job.level}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 mb-4">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <button className="text-blue-600 font-bold hover:text-blue-700">Apply Now →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">Our Culture</h2>
            <p className="text-lg text-slate-600">
              We're building something meaningful. We move fast, we're transparent, we support each other, and we never compromise on quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: '15+', label: 'Team Members' },
              { value: '5', label: 'Countries' },
              { value: '100k+', label: 'Users Helped' }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-5xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-slate-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 md:py-32 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">Don't See Your Role?</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              We're always looking for talented people. Send us your resume and tell us what you're passionate about!
            </p>
          </div>
          <a 
            href="mailto:careers@smartgym.ai" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-all"
          >
            Email: careers@smartgym.ai
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-600">
          <p>© 2026 Smart Gym AI. Equal Opportunity Employer.</p>
        </div>
      </footer>
    </div>
  );
};

export default Careers;
