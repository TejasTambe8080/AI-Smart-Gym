// MediaPipe Pose Detection Component - Fully Fixed
import React, { useEffect, useRef, useState } from 'react';

const MediaPipePose = ({ onPoseDetected, isRunning }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const cameraRef = useRef(null);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initMediaPipe = async () => {
      try {
        setError(null);
        console.log('🎯 Initializing MediaPipe Pose...');

        // Dynamically import MediaPipe libraries
        const { Pose, POSE_CONNECTIONS } = await import(
          'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1635989592/pose.js'
        );

        console.log('✅ Pose module loaded');

        const drawingUtils = await import(
          'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.5.1635989592/drawing_utils.js'
        );

        console.log('✅ Drawing utils loaded');

        // Store in window for drawing functions
        window.POSE_CONNECTIONS = POSE_CONNECTIONS;
        window.drawConnectors = drawingUtils.drawConnectors;
        window.drawLandmarks = drawingUtils.drawLandmarks;

        // CRITICAL: Load Camera Utils BEFORE using
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src =
            'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.5.1635989592/camera_utils.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

        console.log('✅ Camera utils loaded');

        // Initialize Pose model
        const pose = new Pose({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1635989592/${file}`;
          },
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        poseRef.current = pose;
        console.log('✅ Pose model configured');

        // CRITICAL: Set up pose results handler BEFORE starting camera
        pose.onResults((results) => {
          console.log('📍 Pose results received:', results.poseLandmarks?.length, 'landmarks');

          if (onPoseDetected && results.poseLandmarks) {
            onPoseDetected(results);
          }

          // Draw pose on canvas
          drawPose(results);
        });

        console.log('✅ Pose results handler attached');

        // Initialize camera with proper event loop
        if (videoRef.current && window.Camera) {
          const camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
              if (isRunning && poseRef.current && videoRef.current) {
                try {
                  await poseRef.current.send({ image: videoRef.current });
                } catch (err) {
                  console.error('Error sending frame to pose:', err);
                }
              }
            },
            width: 1280,
            height: 720,
          });

          cameraRef.current = camera;

          // CRITICAL: Start camera AFTER all callbacks are set
          camera.start();
          console.log('✅ Camera started - streaming frames to pose');
        } else {
          throw new Error('Camera API not available - window.Camera is undefined');
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('❌ MediaPipe initialization error:', error);
        setError(error.message);
      }
    };

    if (isRunning && !isInitialized) {
      initMediaPipe();

      return () => {
        console.log('🛑 Cleaning up MediaPipe...');
        if (cameraRef.current) {
          try {
            cameraRef.current.stop();
          } catch (err) {
            console.error('Error stopping camera:', err);
          }
        }
      };
    }
  }, [isRunning, isInitialized, onPoseDetected]);

  const drawPose = (results) => {
    const canvas = canvasRef.current;
    if (!canvas || !results.poseLandmarks) {
      console.warn('Cannot draw: canvas or landmarks missing');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video frame
    if (results.image) {
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    }

    // CRITICAL: Draw skeleton connections and landmarks
    if (window.drawConnectors && window.drawLandmarks && window.POSE_CONNECTIONS) {
      try {
        // Draw connections between joints
        window.drawConnectors(
          ctx,
          results.poseLandmarks,
          window.POSE_CONNECTIONS,
          { color: '#00FF00', lineWidth: 3 }
        );

        // Draw landmarks (joints)
        window.drawLandmarks(ctx, results.poseLandmarks, {
          color: '#FF0000',
          lineWidth: 2,
          radius: 4,
        });

        console.log('✅ Skeleton drawn on canvas');
      } catch (err) {
        console.error('Error drawing pose:', err);
      }
    } else {
      console.warn('Drawing utilities not available');
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="absolute inset-0 w-full h-full object-contain"
        style={{ display: isInitialized ? 'block' : 'none' }}
      />

      {/* Status Indicators */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 px-4 py-2 rounded-lg">
        <div className="text-white text-sm font-mono">
          {!isInitialized && (
            <div className="text-yellow-400">🔄 Initializing MediaPipe...</div>
          )}
          {isInitialized && isRunning && (
            <div className="text-green-400">🟢 Live - Pose Detection Active</div>
          )}
          {isInitialized && !isRunning && (
            <div className="text-orange-400">⏸️ Paused</div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-red-900 text-white p-6 rounded-lg max-w-md text-center">
            <div className="text-2xl mb-2">❌</div>
            <div className="font-bold mb-2">MediaPipe Error</div>
            <div className="text-sm">{error}</div>
            <div className="text-xs text-gray-300 mt-4">
              Check browser console for details
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPipePose;
