import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
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

      {/* Content */}
      <div className="pt-32 pb-20 md:pt-40 md:pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-12">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none space-y-8 text-slate-700">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">1. Introduction</h2>
              <p>
                At Smart Gym AI, we're committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our fitness platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">2. Information We Collect</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Personal Information</h3>
                  <p>Name, email, age, height, weight, and fitness goals when you create an account.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Workout Data</h3>
                  <p>Exercise types, reps, duration, and form analysis from your workouts.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Video Data</h3>
                  <p>We may process video during workouts for form analysis. Videos are processed locally on your device whenever possible.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Device Information</h3>
                  <p>Device type, OS, browser, and IP address for service improvement and security.</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide personalized AI coaching and workout recommendations</li>
                <li>To analyze your form and prevent injuries</li>
                <li>To show your progress and achievements</li>
                <li>To improve our AI models (only with your consent)</li>
                <li>To send you important updates about your account</li>
                <li>To ensure platform security and prevent fraud</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">4. Data Security</h2>
              <p>
                We use industry-standard encryption (SSL/TLS) to protect your data in transit. Your passwords are hashed using bcrypt. Video data is processed with privacy-first technology.
              </p>
              <p>
                <strong>We never share your personal data with third parties.</strong> We don't sell your information, and we don't use it for advertising.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Request corrections to your data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt-out of non-essential communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">6. Cookies</h2>
              <p>
                We use cookies to remember your preferences and keep you logged in. You can disable cookies in your browser settings, but some features may not work properly.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">7. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <p className="font-semibold">privacy@smartgym.ai</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy occasionally. We'll notify you of significant changes via email or through the app. Your continued use of Smart Gym AI means you accept these changes.
              </p>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <p className="text-sm text-slate-600">
                <strong>Last Updated:</strong> April 2026<br/>
                <strong>Effective Date:</strong> April 1, 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-600">
          <p>© 2026 Smart Gym AI. Your privacy matters to us.</p>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
