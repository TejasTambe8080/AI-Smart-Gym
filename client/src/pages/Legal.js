import React from 'react';
import { Link } from 'react-router-dom';

const Legal = () => {
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
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-12">Terms of Service</h1>

          <div className="prose prose-lg max-w-none space-y-8 text-slate-700">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Smart Gym AI, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on Smart Gym AI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the site</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">3. Disclaimer of Warranties</h2>
              <p>
                The materials on Smart Gym AI are provided on an 'as is' basis. Smart Gym AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">4. Limitations of Liability</h2>
              <p>
                In no event shall Smart Gym AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Smart Gym AI, even if Smart Gym AI has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on Smart Gym AI could include technical, typographical, or photographic errors. Smart Gym AI does not warrant that any of the materials on the site are accurate, complete, or current. Smart Gym AI may make changes to the materials contained on its site at any time without notice.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">6. Medical Disclaimer</h2>
              <p>
                <strong>IMPORTANT:</strong> Smart Gym AI is NOT a substitute for professional medical advice. The AI coaching, form analysis, and workout recommendations are for educational purposes only. Always consult with a healthcare provider or certified fitness professional before starting a new exercise program, especially if you have any pre-existing health conditions.
              </p>
              <p>
                Stop using any exercise if you experience pain, dizziness, or discomfort, and seek medical attention immediately if needed.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">7. User Responsibilities</h2>
              <p>You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the service only for lawful purposes</li>
                <li>Not violate any laws or regulations</li>
                <li>Not use the service in a way that infringes others' rights</li>
                <li>Maintain the confidentiality of your account information</li>
                <li>Accept full responsibility for your use of the service</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">8. Limitation on Usage</h2>
              <p>
                You agree not to access or use for any purpose other than that for which we make the platform available. The platform may not be used in connection with any commercial endeavors except those specifically endorsed or approved by Smart Gym AI.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">9. Modifications</h2>
              <p>
                Smart Gym AI may revise these terms of service at any time without notice. By using this platform, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">10. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Smart Gym AI operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">11. Contact Information</h2>
              <p>
                If you have questions about these Terms of Service, please contact us at:
              </p>
              <p className="font-semibold">legal@smartgym.ai</p>
            </section>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-8">
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
          <p>© 2026 Smart Gym AI. Terms of Service</p>
        </div>
      </footer>
    </div>
  );
};

export default Legal;
