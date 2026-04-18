// MediaPipe Pose Detection Component - Production Ready
import React, { useEffect, useRef, useState } from 'react';

const MediaPipePose = ({ onPoseDetected, isRunning }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const onPoseDetectedRef = useRef(onPoseDetected);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isInitializedRef = useRef(false);
  
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [poseReady, setPoseReady] = useState(false);

  useEffect(() => {
    onPoseDetectedRef.current = onPoseDetected;
  }, [onPoseDetected]);

  // Load MediaPipe libraries - runs once
  useEffect(() => {
    let isMounted = true;

    const loadMediaPipeLibraries = async () => {
      try {
        console.log('🎯 Loading MediaPipe Pose libraries...');

        // Helper to load script
        const loadScript = (src) =>
          new Promise((resolve, reject) => {
            // Check if already loaded
            if (document.querySelector(`script[src="${src}"]`)) {
              console.log('✅ Already loaded:', src);
              resolve();
              return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.type = 'text/javascript';
            script.crossOrigin = 'anonymous';
            
            script.onload = () => {
              console.log('✅ Loaded:', src);
              resolve();
            };
            
            script.onerror = () => {
              const err = `Failed to load: ${src}`;
              console.error('❌', err);
              reject(new Error(err));
            };
            
            document.head.appendChild(script);
          });

        // Load MediaPipe libraries in sequence
        const libraries = [
          'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
          'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
          'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js',
        ];

        for (const lib of libraries) {
          await loadScript(lib);
        }

        // Verify all required globals
        if (!window.Pose) throw new Error('Pose not available');
        if (!window.drawConnectors) throw new Error('drawConnectors not available');
        if (!window.drawLandmarks) throw new Error('drawLandmarks not available');
        if (!window.POSE_CONNECTIONS) throw new Error('POSE_CONNECTIONS not available');

        console.log('✅ All MediaPipe libraries loaded successfully');
        
        if (isMounted) {
          initializePose();
        }
      } catch (err) {
        console.error('❌ Failed to load MediaPipe:', err);
        if (isMounted) {
          setError('Failed to load MediaPipe: ' + err.message);
        }
      }
    };

    const initializePose = () => {
      try {
        console.log('🎯 Initializing Pose model...');

        const pose = new window.Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        // Set up results handler
        pose.onResults((results) => {
          if (results.poseLandmarks && results.poseLandmarks.length > 0) {
            if (onPoseDetectedRef.current) {
              onPoseDetectedRef.current(results);
            }
          }
          // Draw on canvas
          drawPose(results);
        });

        poseRef.current = pose;
        setPoseReady(true);
        console.log('✅ Pose model initialized');
      } catch (err) {
        console.error('❌ Pose initialization failed:', err);
        if (isMounted) {
          setError('Pose initialization failed: ' + err.message);
        }
      }
    };

    loadMediaPipeLibraries();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency - load libraries only once

  // Initialize camera and start detection - runs when isRunning changes
  useEffect(() => {
    let isMounted = true;
    let cleanupDone = false;

    const startPoseDetection = async () => {
      try {
        if (!poseRef.current) {
          console.warn('⚠️ Pose not ready yet');
          return;
        }

        if (isInitializedRef.current) {
          console.log('ℹ️ Already initialized, skipping...');
          return;
        }

        console.log('🎥 Starting camera stream...');

        // Get camera stream with explicit constraints
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        isInitializedRef.current = true;

        // Attach stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('✅ Camera stream attached');
        }

        // Wait for video metadata before starting pose detection
        const waitForVideoReady = new Promise((resolve) => {
          const onLoadedMetadata = () => {
            console.log(`📹 Video ready: ${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`);
            videoRef.current.removeEventListener('loadedmetadata', onLoadedMetadata);
            resolve();
          };
          videoRef.current.addEventListener('loadedmetadata', onLoadedMetadata);
        });

        await waitForVideoReady;
        if (!isMounted) return;

        setCameraReady(true);
        console.log('✅ Camera ready for pose detection');

        // Start continuous pose detection using requestAnimationFrame
        const processPose = async () => {
          if (!isMounted || !isRunning || !poseRef.current || !videoRef.current) {
            if (isMounted && isRunning) {
              animationFrameRef.current = requestAnimationFrame(processPose);
            }
            return;
          }

          try {
            // Send current video frame to pose detector
            await poseRef.current.send({ image: videoRef.current });
          } catch (err) {
            console.error('❌ Error processing pose:', err);
          }

          animationFrameRef.current = requestAnimationFrame(processPose);
        };

        // Start the loop
        animationFrameRef.current = requestAnimationFrame(processPose);
        console.log('✅ Pose detection loop started');

      } catch (err) {
        console.error('❌ Camera initialization error:', err);
        if (isMounted) {
          setError(err.message);
        }
      }
    };

    const stopPoseDetection = () => {
      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // Stop camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('🛑 Camera track stopped');
        });
        streamRef.current = null;
      }

      // Reset video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      isInitializedRef.current = false;
      setCameraReady(false);
      cleanupDone = true;
    };

    if (isRunning && poseReady && !cleanupDone) {
      startPoseDetection();
    } else if (!isRunning && isInitializedRef.current) {
      stopPoseDetection();
    }

    return () => {
      isMounted = false;
      if (!cleanupDone) {
        stopPoseDetection();
      }
    };
  }, [isRunning, poseReady]);

  // Draw pose on canvas
  const drawPose = (results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;
    if (!results?.poseLandmarks || results.poseLandmarks.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to match video dimensions
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    if (videoWidth === 0 || videoHeight === 0) return;

    canvas.width = videoWidth;
    canvas.height = videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight);

    // Draw skeleton
    if (window.drawConnectors && window.drawLandmarks && window.POSE_CONNECTIONS) {
      try {
        // Draw pose connections (skeleton lines)
        window.drawConnectors(ctx, results.poseLandmarks, window.POSE_CONNECTIONS, {
          color: '#00FF00',
          lineWidth: 3,
        });

        // Draw pose landmarks (joints)
        window.drawLandmarks(ctx, results.poseLandmarks, {
          color: '#FF0000',
          lineWidth: 2,
          radius: 4,
        });

        console.log('✅ Skeleton drawn');
      } catch (err) {
        console.error('❌ Drawing error:', err);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden shadow-2xl">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />

      {/* Canvas for Skeleton Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          display: cameraReady ? 'block' : 'none',
          touchAction: 'none',
        }}
      />

      {/* Status Badge */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-90 px-4 py-2 rounded-lg backdrop-blur-sm">
        <div className="text-white text-xs sm:text-sm font-mono space-y-1">
          {!cameraReady && (
            <div className="text-yellow-400 flex items-center gap-2">
              <span className="animate-spin">⏳</span> Loading camera...
            </div>
          )}
          {cameraReady && isRunning && (
            <div className="text-green-400 flex items-center gap-2">
              <span className="animate-pulse">🟢</span> Detection Active
            </div>
          )}
          {cameraReady && !isRunning && (
            <div className="text-orange-400 flex items-center gap-2">
              <span>⏸️</span> Paused
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 rounded-lg">
          <div className="bg-red-900 text-white p-6 rounded-lg max-w-md text-center">
            <div className="text-2xl mb-2">❌</div>
            <div className="font-bold mb-2">Initialization Error</div>
            <div className="text-sm">{error}</div>
            <div className="text-xs text-gray-300 mt-4">Check console for details</div>
          </div>
        </div>
      )}
    </div>
  );

};

export default MediaPipePose;
