// Main App.js - Router configuration and main component
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardImproved from './pages/DashboardImproved';
import WorkoutRefactored from './pages/WorkoutRefactored';
import PostureCorrection from './pages/PostureCorrection';
import ActivityImproved from './pages/ActivityImproved';
import AnalyticsImproved from './pages/AnalyticsImproved';
import AISuggestionsImproved from './pages/AISuggestionsImproved';
import Diet from './pages/Diet';
import ProfileImproved from './pages/ProfileImproved';
import Settings from './pages/Settings';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes with Layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<DashboardImproved />} />
                  <Route path="/workout" element={<WorkoutRefactored />} />
                  <Route path="/posture" element={<PostureCorrection />} />
                  <Route path="/activity" element={<ActivityImproved />} />
                  <Route path="/analytics" element={<AnalyticsImproved />} />
                  <Route path="/suggestions" element={<AISuggestionsImproved />} />
                  <Route path="/diet" element={<Diet />} />
                  <Route path="/profile" element={<ProfileImproved />} />
                  <Route path="/settings" element={<Settings />} />
                  
                  {/* Default redirect */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
