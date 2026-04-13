// MediaPipe Pose Detection Component
import React, { useEffect, useRef } from 'react';

const MediaPipePose = ({ onPoseDetected, isRunning }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const initMediaPipe = async () => {
      try {
        // Dynamically import MediaPipe
        const { Pose, POSE_CONNECTIONS, drawConnectors, drawLandmarks } = await import(
          'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1635989592/pose.js'
        );
        
        await import('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.5.1635989592/drawing_utils.js');
        await import('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.5.1635989592/camera_utils.js');

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

        // Set up pose detection callback
        pose.onResults((results) => {
          if (onPoseDetected) {
            onPoseDetected(results);
          }

          // Draw pose on canvas
          drawPose(results);
        });

        // Start camera
        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (isRunning && poseRef.current) {
              await poseRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        cameraRef.current = camera;
        camera.start();
      } catch (error) {
        console.error('Error initializing MediaPipe:', error);
      }
    };

    if (isRunning) {
      // Load MediaPipe Pose script
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1635989592/pose.js';
      script.async = true;

      const drawingScript = document.createElement('script');
      drawingScript.src =
        'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.5.1635989592/drawing_utils.js';
      drawingScript.async = true;

      const cameraScript = document.createElement('script');
      cameraScript.src =
        'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.5.1635989592/camera_utils.js';
      cameraScript.async = true;

      document.body.appendChild(script);
      document.body.appendChild(drawingScript);
      document.body.appendChild(cameraScript);

      script.onload = initMediaPipe;

      return () => {
        if (cameraRef.current) {
          cameraRef.current.stop();
        }
        document.body.removeChild(script);
        document.body.removeChild(drawingScript);
        document.body.removeChild(cameraScript);
      };
    }
  }, [isRunning, onPoseDetected]);

  const drawPose = (results) => {
    const canvas = canvasRef.current;
    if (!canvas || !results.poseLandmarks) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    if (results.image) {
      ctx.drawImage(results.image, 0, 0);
    }

    // Draw landmarks and connections
    if (window.drawConnectors && window.drawLandmarks && window.POSE_CONNECTIONS) {
      window.drawConnectors(
        ctx,
        results.poseLandmarks,
        window.POSE_CONNECTIONS,
        { color: '#00FF00', lineWidth: 2 }
      );
      window.drawLandmarks(ctx, results.poseLandmarks, { color: '#FF0000', LineWidth: 2 });
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover hidden"
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default MediaPipePose;
