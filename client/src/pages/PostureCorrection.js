// Posture Correction Page - Real-time Form Analysis
import React, { useState, useEffect, useRef } from 'react';
import MediaPipePose from '../components/MediaPipePose';
import { PostureDetector, VoiceFeedback } from '../utils/ai';

const PostureCorrection = () => {
  const [postureScore, setPostureScore] = useState(100);
  const [feedback, setFeedback] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [history, setHistory] = useState([]);
  const voiceFeedbackRef = useRef(null);

  useEffect(() => {
    const voice = new VoiceFeedback();
    voiceFeedbackRef.current = voice;
  }, []);

  const handlePoseDetected = (results) => {
    if (!isMonitoring || !results.poseLandmarks) return;

    const landmarks = results.poseLandmarks;

    // Calculate posture score
    const score = PostureDetector.calculatePostureScore(landmarks);
    setPostureScore(score);

    // Get feedback
    const newFeedback = PostureDetector.getPostureFeedback(landmarks);
    setFeedback(newFeedback);

    // Voice feedback for poor posture
    if (score < 70 && voiceEnabled && voiceFeedbackRef.current) {
      if (newFeedback.length > 0 && Math.random() < 0.1) {
        voiceFeedbackRef.current.speak(newFeedback[0], 0.85, 1.1);
      }
    }

    // Add to history
    setHistory(prev => [...prev.slice(-99), { score, time: new Date() }]);
  };

  const getScoreColor = () => {
    if (postureScore >= 85) return 'text-green-500';
    if (postureScore >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = () => {
    if (postureScore >= 85) return 'bg-green-100';
    if (postureScore >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Mobile view - Full width camera
  if (window.innerWidth < 1024) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">👁️ Posture Analysis</h1>
          <p className="text-gray-300">Real-time form correction</p>
        </div>

        {/* Score Card */}
        <div className={`${getScoreBg()} rounded-2xl p-6 mb-6 shadow-xl border-2 border-gray-200`}>
          <p className="text-gray-600 text-sm font-semibold mb-2">POSTURE SCORE</p>
          <div className="flex items-end justify-between">
            <div>
              <p className={`text-5xl font-bold ${getScoreColor()}`}>{postureScore}%</p>
              <p className="text-gray-600 mt-2">
                {postureScore >= 85 && '✨ Excellent form!'}
                {postureScore >= 70 && postureScore < 85 && '👍 Good form'}
                {postureScore < 70 && '⚠️ Needs adjustment'}
              </p>
            </div>
          </div>
        </div>

        {/* Camera Feed */}
        <div className="bg-black rounded-2xl overflow-hidden mb-6 shadow-2xl aspect-video">
          <MediaPipePose onPoseDetected={handlePoseDetected} isRunning={isMonitoring} />
        </div>

        {/* Feedback List */}
        {feedback.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border-2 border-red-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">⚠️</span> Form Issues Detected
            </h2>
            <div className="space-y-3">
              {feedback.map((msg, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-red-50 p-4 rounded-xl">
                  <span className="text-xl">🔴</span>
                  <p className="text-gray-800 font-semibold flex-1">{msg}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {feedback.length === 0 && postureScore >= 80 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border-2 border-green-200">
            <p className="text-lg font-bold text-green-600 flex items-center gap-2">
              <span className="text-2xl">✅</span> Perfect Form!
            </p>
            <p className="text-gray-600 mt-2">Keep maintaining this posture</p>
          </div>
        )}

        {/* Voice Toggle */}
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all mb-6 ${
            voiceEnabled
              ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
        </button>

        {/* Controls */}
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`w-full py-4 rounded-xl font-bold text-lg ${
            isMonitoring
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isMonitoring ? '⏸ Pause Monitoring' : '▶ Start Monitoring'}
        </button>
      </div>
    );
  }

  // Desktop view - Three column layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">👁️ Posture Analysis</h1>
        <p className="text-gray-600 text-lg">Real-time form correction and feedback</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Left - Camera Feed */}
        <div className="md:col-span-1">
          <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video mb-4">
            <MediaPipePose onPoseDetected={handlePoseDetected} isRunning={isMonitoring} />
          </div>
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`w-full py-3 rounded-xl font-bold transition-all ${
              isMonitoring
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isMonitoring ? '⏸ Pause' : '▶ Start'}
          </button>
        </div>

        {/* Center - Skeleton and Analysis */}
        <div className="md:col-span-1 space-y-6">
          {/* Posture Score */}
          <div className={`${getScoreBg()} rounded-2xl p-8 shadow-xl border-2 border-gray-200`}>
            <p className="text-gray-600 text-sm font-semibold mb-2">POSTURE SCORE</p>
            <p className={`text-6xl font-bold ${getScoreColor()}`}>{postureScore}%</p>
            <div className="w-full bg-gray-300 rounded-full h-3 mt-4">
              <div
                className={`h-full rounded-full transition-all ${
                  postureScore >= 85
                    ? 'bg-green-500'
                    : postureScore >= 70
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${postureScore}%` }}
              ></div>
            </div>
            <p className="text-gray-600 mt-3 text-sm">
              {postureScore >= 85 && '✨ Excellent form - Keep it up!'}
              {postureScore >= 70 && postureScore < 85 && '👍 Good form - Minor adjustments needed'}
              {postureScore < 70 && '⚠️ Needs adjustment - Focus on form'}
            </p>
          </div>

          {/* Key Areas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📍</span> Key Joints
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl">🎯</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Back Alignment</p>
                  <p className="text-xs text-gray-600">Keep straight</p>
                </div>
                <span className={`px-3 py-1 rounded-full font-bold text-sm ${
                  PostureDetector.isBackBent ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {PostureDetector.isBackBent ? 'Bent' : 'Good'}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl">💪</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Shoulders</p>
                  <p className="text-xs text-gray-600">Keep level</p>
                </div>
                <span className="px-3 py-1 rounded-full font-bold text-sm bg-green-100 text-green-700">
                  Level
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-2xl">🦵</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Knees</p>
                  <p className="text-xs text-gray-600">Aligned with toes</p>
                </div>
                <span className="px-3 py-1 rounded-full font-bold text-sm bg-green-100 text-green-700">
                  Good
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Feedback & Tips */}
        <div className="md:col-span-1 space-y-6">
          {/* Issues */}
          {feedback.length > 0 ? (
            <div className="bg-red-50 rounded-2xl p-6 shadow-lg border-2 border-red-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚠️</span> Issues Detected ({feedback.length})
              </h3>
              <div className="space-y-3">
                {feedback.map((msg, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-xl border-l-4 border-red-500">
                    <span className="text-xl">🔴</span>
                    <p className="text-gray-800 font-semibold flex-1">{msg}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-green-50 rounded-2xl p-6 shadow-lg border-2 border-green-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">✅</span> Perfect Form!
              </h3>
              <p className="text-gray-700">Your posture is excellent. Keep maintaining this position.</p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span> Form Tips
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Keep back straight and engaged</p>
              <p>• Align knees over toes</p>
              <p>• Keep shoulders level</p>
              <p>• Maintain steady breathing</p>
              <p>• Move with control</p>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                voiceEnabled
                  ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {voiceEnabled ? '🔊 Voice Guidance' : '🔇 Voice Off'}
            </button>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-lg border-2 border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3">Session Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Best Score:</span>
                <span className="font-bold text-blue-600">
                  {history.length > 0 ? Math.max(...history.map(h => h.score)) : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average:</span>
                <span className="font-bold text-blue-600">
                  {history.length > 0
                    ? Math.round(history.reduce((a, b) => a + b.score, 0) / history.length)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frames:</span>
                <span className="font-bold text-blue-600">{history.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostureCorrection;
