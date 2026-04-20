import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { Toaster } from 'react-hot-toast';

// Lazy Loaded Pages for Performance
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const TrainerSignup = lazy(() => import('./pages/TrainerSignup'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Careers = lazy(() => import('./pages/Careers'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Legal = lazy(() => import('./pages/Legal'));
const EnhancedDashboard = lazy(() => import('./pages/EnhancedDashboard'));
const WorkoutRefactored = lazy(() => import('./pages/WorkoutRefactored'));
const PostureCorrection = lazy(() => import('./pages/PostureCorrection'));
const ActivityImproved = lazy(() => import('./pages/ActivityImproved'));
const AnalyticsImproved = lazy(() => import('./pages/AnalyticsImproved'));
const AISuggestionsImproved = lazy(() => import('./pages/AISuggestionsImproved'));
const Diet = lazy(() => import('./pages/Diet'));
const ProfileImproved = lazy(() => import('./pages/ProfileImproved'));
const AIChatCoach = lazy(() => import('./pages/AIChatCoach'));
const AIWorkoutPlanner = lazy(() => import('./pages/AIWorkoutPlanner'));
const Settings = lazy(() => import('./pages/Settings'));
const Journey = lazy(() => import('./pages/Journey'));
const Notifications = lazy(() => import('./pages/Notifications'));
const TrainerDiscovery = lazy(() => import('./pages/TrainerDiscovery'));
const TrainerDashboard = lazy(() => import('./pages/TrainerDashboard'));

// Loading Screen Component
const NeuralPulse = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-6 animate-pulse">
       <div className="text-6xl text-blue-500 italic font-black">AI</div>
       <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-[loading_1.5s_ease-in-out_infinite]"></div>
       </div>
    </div>
  </div>
);

const AppRoutes = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isTrainer = user.role === 'trainer';

  return (
    <Routes>
      <Route path="/dashboard" element={<EnhancedDashboard />} />
      <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
      <Route path="/find-trainer" element={<TrainerDiscovery />} />
      <Route path="/workout" element={<WorkoutRefactored />} />
      <Route path="/ai-workout" element={<AIWorkoutPlanner />} />
      <Route path="/posture" element={<PostureCorrection />} />
      <Route path="/activity" element={<ActivityImproved />} />
      <Route path="/analytics" element={<AnalyticsImproved />} />
      <Route path="/journey" element={<Journey />} />
      <Route path="/suggestions" element={<AISuggestionsImproved />} />
      <Route path="/ai-coach" element={<AIChatCoach />} />
      <Route path="/diet" element={<Diet />} />
      <Route path="/profile" element={<ProfileImproved />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/notifications" element={<Notifications />} />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to={isTrainer ? "/trainer-dashboard" : "/dashboard"} replace />} />
      <Route path="*" element={<Navigate to={isTrainer ? "/trainer-dashboard" : "/dashboard"} replace />} />
    </Routes>
  );
};




function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
          },
        }}
      />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<NeuralPulse />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/trainer-signup" element={<TrainerSignup />} />
            <Route path="/about" element={<AboutUs />} />

            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/legal" element={<Legal />} />

            {/* Protected routes with Layout */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AppRoutes />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </>
  );

}

export default App;
