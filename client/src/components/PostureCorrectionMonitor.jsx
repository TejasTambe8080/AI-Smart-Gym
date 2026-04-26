/**
 * Real-Time Posture Correction Component
 * Monitors posture during workout and gives Hindi voice feedback
 */

import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Volume2, CheckCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  givePostureFeedback,
  countRepsHindi,
  giveMotivation,
  giveBreathingTips,
} from '../utils/hindiVoiceFeedback';

const PostureCorrectionMonitor = ({ 
  postureScore = 75, 
  repsCount = 0,
  currentExercise = 'Bench Press',
  isActive = false,
  onFeedbackGiven = () => {}
}) => {
  const [feedback, setFeedback] = useState(null);
  const [lastFeedbackTime, setLastFeedbackTime] = useState(0);
  const [repsSaid, setRepsSaid] = useState(0);
  const [postureStatus, setPostureStatus] = useState('good');
  const feedbackTimeoutRef = useRef(null);

  const FEEDBACK_INTERVAL = 5000; // Give feedback every 5 seconds max

  // Monitor posture and give feedback
  useEffect(() => {
    if (!isActive) return;

    const now = Date.now();
    const timeSinceLastFeedback = now - lastFeedbackTime;

    // Only give feedback if enough time has passed
    if (timeSinceLastFeedback < FEEDBACK_INTERVAL) return;

    // Determine posture status
    if (postureScore < 50) {
      setPostureStatus('critical');
    } else if (postureScore < 70) {
      setPostureStatus('warning');
    } else if (postureScore >= 85) {
      setPostureStatus('excellent');
    } else {
      setPostureStatus('good');
    }

    // Give feedback based on posture
    const giveFeedback = async () => {
      try {
        if (postureScore < 60) {
          setFeedback({
            type: 'warning',
            message: `⚠️ पोजीशन ठीक करें - स्कोर: ${postureScore}%`
          });
        } else if (postureScore >= 80) {
          setFeedback({
            type: 'success',
            message: `✅ शानदार पोजीशन! स्कोर: ${postureScore}%`
          });
        } else {
          setFeedback({
            type: 'info',
            message: `📊 पोजीशन: ${postureScore}%`
          });
        }

        // Speak feedback in Hindi
        await givePostureFeedback(postureScore);
        setLastFeedbackTime(now);
        onFeedbackGiven({ type: 'posture', score: postureScore });
      } catch (error) {
        console.error('Error giving posture feedback:', error);
      }
    };

    // Clear existing timeout
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    // Set new timeout for feedback
    feedbackTimeoutRef.current = setTimeout(giveFeedback, 1000);

    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, [postureScore, isActive, lastFeedbackTime, onFeedbackGiven]);

  // Monitor rep counting
  useEffect(() => {
    if (!isActive || repsCount <= repsSaid) return;

    const speakReps = async () => {
      for (let i = repsSaid + 1; i <= repsCount; i++) {
        if (i <= 10) {
          await countRepsHindi(i);
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      setRepsSaid(repsCount);
      
      // Give motivation after every 5 reps
      if (repsCount % 5 === 0 && repsCount > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
        await giveMotivation();
      }
    };

    speakReps();
  }, [repsCount, isActive, repsSaid]);

  // Get color based on posture status
  const getStatusColor = () => {
    switch (postureStatus) {
      case 'excellent':
        return 'from-green-600 to-emerald-600';
      case 'good':
        return 'from-blue-600 to-cyan-600';
      case 'warning':
        return 'from-yellow-600 to-orange-600';
      case 'critical':
        return 'from-red-600 to-pink-600';
      default:
        return 'from-slate-600 to-slate-700';
    }
  };

  const getStatusIcon = () => {
    switch (postureStatus) {
      case 'excellent':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'critical':
        return <AlertCircle className="text-red-400" size={20} />;
      default:
        return <Volume2 className="text-blue-400" size={20} />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
      {/* Posture Monitor Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`bg-gradient-to-br ${getStatusColor()} rounded-2xl p-6 text-white shadow-2xl border border-white/20`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <span className="font-black text-sm uppercase tracking-widest">
              Live Posture Monitor
            </span>
          </div>
          {isActive && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 bg-white rounded-full"
            />
          )}
        </div>

        {/* Exercise Info */}
        <div className="space-y-3 mb-4 pb-4 border-b border-white/20">
          <div className="text-sm font-bold opacity-90">{currentExercise}</div>
          <div className="flex items-center justify-between text-xs">
            <span>Posture Score</span>
            <span className="font-black text-lg">{postureScore}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${postureScore}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <div className="text-xs opacity-75 text-center">
            {postureStatus === 'excellent' && '✨ Perfect Form'}
            {postureStatus === 'good' && '👍 Good Form'}
            {postureStatus === 'warning' && '⚠️ Adjust Position'}
            {postureStatus === 'critical' && '🛑 Correct Now!'}
          </div>
        </div>

        {/* Rep Counter */}
        {repsCount > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between text-sm">
            <span>Reps Completed</span>
            <motion.span
              key={repsCount}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="font-black text-2xl"
            >
              {repsCount}
            </motion.span>
          </div>
        )}
      </motion.div>

      {/* Feedback Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`p-4 rounded-xl font-bold text-sm border backdrop-blur-sm ${
              feedback.type === 'warning'
                ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-100'
                : feedback.type === 'success'
                ? 'bg-green-500/20 border-green-500/50 text-green-100'
                : 'bg-blue-500/20 border-blue-500/50 text-blue-100'
            }`}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hindi Instructions */}
      {isActive && (
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 text-white text-xs border border-slate-700 flex items-center gap-2">
          <Volume2 size={14} className="text-blue-400 flex-shrink-0" />
          <span className="opacity-75">🎤 Hindi voice feedback सक्रिय</span>
        </div>
      )}
    </div>
  );
};

export default PostureCorrectionMonitor;
