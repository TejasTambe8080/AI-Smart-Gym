// Landing Page - Professional Homepage
import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    {
      icon: '🎯',
      title: 'Real-Time Exercise Detection',
      description: 'AI-powered pose detection using MediaPipe to automatically track your exercises in real-time.'
    },
    {
      icon: '📊',
      title: 'Performance Analytics',
      description: 'Track your progress with detailed charts, posture scores, and workout history.'
    },
    {
      icon: '🗣️',
      title: 'Voice Feedback',
      description: 'Get real-time audio guidance and posture corrections during your workouts.'
    },
    {
      icon: '🍎',
      title: 'Nutrition Planning',
      description: 'Personalized diet recommendations based on your fitness goals and body metrics.'
    },
    {
      icon: '💡',
      title: 'AI Suggestions',
      description: 'Smart workout recommendations tailored to improve your weak areas.'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Train anywhere with our fully responsive design for all devices.'
    },
  ];

  const testimonials = [
    {
      name: 'Raj Kumar',
      role: 'Fitness Enthusiast',
      text: 'The real-time feedback has completely transformed my workout routine. I can now focus on form instead of counting reps.',
      avatar: '👨‍💼'
    },
    {
      name: 'Priya Singh',
      role: 'Professional Trainer',
      text: 'An incredible tool for my clients. The posture detection ensures they maintain proper form throughout their workouts.',
      avatar: '👩‍💼'
    },
    {
      name: 'Arjun Patel',
      role: 'Gym Owner',
      text: 'My members love the AI-powered suggestions. It keeps them motivated and tracking their progress is so easy now.',
      avatar: '👨‍🎓'
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '₹0',
      features: [
        '✅ Basic workout tracking',
        '✅ 5 exercises detection',
        '✅ Dashboard access',
        '❌ Analytics',
        '❌ AI Suggestions',
      ]
    },
    {
      name: 'Pro',
      price: '₹299',
      period: '/month',
      popular: true,
      features: [
        '✅ Unlimited workouts',
        '✅ All 6+ exercises',
        '✅ Full analytics',
        '✅ AI suggestions',
        '✅ Diet planning',
      ]
    },
    {
      name: 'Premium',
      price: '₹599',
      period: '/month',
      features: [
        '✅ Everything in Pro',
        '✅ Priority support',
        '✅ Custom programs',
        '✅ Personal analytics',
        '✅ Advance booking',
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">🏋️‍♂️</span>
            <span className="text-2xl font-bold text-blue-600">AI Smart Gym</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2 text-gray-700 hover:text-blue-600 font-semibold">
              Login
            </Link>
            <Link to="/signup" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Your AI-Powered Fitness Coach
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Transform your workouts with real-time pose detection, voice guidance, and personalized AI suggestions. No more guesswork—just results.
            </p>
            <div className="flex gap-4">
              <Link to="/signup" className="px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition">
                Get Started Free
              </Link>
              <a href="#features" className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-blue-600 transition">
                Learn More
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="text-8xl animate-bounce">🏋️</div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600">10K+</div>
              <p className="text-gray-600 mt-2">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">50K+</div>
              <p className="text-gray-600 mt-2">Workouts Tracked</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">95%</div>
              <p className="text-gray-600 mt-2">User Satisfaction</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">6+</div>
              <p className="text-gray-600 mt-2">Exercise Types</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to reach your fitness goals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-8 bg-gray-50 rounded-lg hover:shadow-lg transition">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-bold text-lg mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your free account in seconds</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-bold text-lg mb-2">Enable Webcam</h3>
              <p className="text-gray-600">Allow access to start pose detection</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-bold text-lg mb-2">Start Working Out</h3>
              <p className="text-gray-600">AI automatically tracks your exercises</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-bold text-lg mb-2">View Analytics</h3>
              <p className="text-gray-600">Track progress with detailed insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-8 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that's right for you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`p-8 rounded-lg ${plan.popular ? 'bg-blue-600 text-white shadow-xl transform scale-105' : 'bg-white border border-gray-200'}`}>
                {plan.popular && <div className="inline-block bg-yellow-400 text-blue-600 px-4 py-1 rounded-full text-sm font-bold mb-4">Most Popular</div>}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-5xl font-bold mb-2">{plan.price}</div>
                {plan.period && <p className={plan.popular ? 'text-blue-100' : 'text-gray-600'}>{plan.period}</p>}
                
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={plan.popular ? 'text-blue-100' : 'text-gray-700'}>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full mt-8 py-3 rounded-lg font-bold transition ${plan.popular ? 'bg-white text-blue-600 hover:bg-gray-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Fitness?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of users already using AI Smart Gym to achieve their fitness goals.
          </p>
          <Link to="/signup" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition">
            Start Your Journey Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🏋️‍♂️</span>
                <span className="font-bold">AI Smart Gym</span>
              </div>
              <p className="text-gray-400">Your personal AI fitness coach</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">License</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2026 AI Smart Gym. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
