// MediaPipe Pose Detection Component - Enhanced Stability & Resilience
import React, { useEffect, useRef, useState, useCallback } from 'react';

const MediaPipePose = ({ onPoseDetected, isRunning }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState('user'); // 'user' or 'environment'
  const [isPoseInitialized, setIsPoseInitialized] = useState(false);

  // Initialize MediaPipe Pose Model
  const initializePose = useCallback(() => {
    try {
      if (!window.Pose) return;
      
      const pose = new window.Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      pose.onResults((results) => {
        if (results.poseLandmarks && onPoseDetected) {
          onPoseDetected(results);
        }
        drawSkeleton(results);
      });

      poseRef.current = pose;
      setIsPoseInitialized(true);
      console.log("✅ Neural Engine Initialized");
    } catch (err) {
      setError("Neural Core Initialization Failed: " + err.message);
    }
  }, [onPoseDetected]);

  // Load Scripts
  useEffect(() => {
    const scripts = [
      'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js'
    ];

    let loadedCount = 0;
    scripts.forEach(src => {
      if (document.querySelector(`script[src="${src}"]`)) {
        loadedCount++;
        if (loadedCount === scripts.length) initializePose();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        loadedCount++;
        if (loadedCount === scripts.length) initializePose();
      };
      document.head.appendChild(script);
    });

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [initializePose]);

  // Start Camera Stream
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
          setError(null);
        };
      }
    } catch (err) {
      console.error("Camera Error:", err);
      if (!window.isSecureContext) {
        setError("Insecure Context: Camera access requires HTTPS or localhost.");
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError("Permission Denied: Please click the camera icon in your browser's address bar and allow access to continue.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError("No Camera Found: Please connect a camera and ensure it's not being used by another app.");
      } else {
        setError("Optical Sensor Failure: " + err.message);
      }
      
      // Auto-retry ONLY for hardware glitches, not for permission/missing issues
      if (!['NotAllowedError', 'PermissionDeniedError', 'NotFoundError', 'DevicesNotFoundError'].includes(err.name)) {
        retryTimeoutRef.current = setTimeout(startCamera, 3000);
      }
    }
  }, [facingMode]);

  useEffect(() => {
    if (isRunning && isPoseInitialized) {
      startCamera();
    } else {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      setCameraReady(false);
    }
  }, [isRunning, isPoseInitialized, startCamera]);

  // Detection Loop
  useEffect(() => {
    if (!isRunning || !cameraReady || !isPoseInitialized || !poseRef.current) return;

    const runDetection = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        try {
          await poseRef.current.send({ image: videoRef.current });
        } catch (e) {
          console.error("Detection Frame Drop:", e);
        }
      }
      animationFrameRef.current = requestAnimationFrame(runDetection);
    };

    runDetection();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isRunning, cameraReady, isPoseInitialized]);

  // Draw Skeleton
  const drawSkeleton = (results) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !results.poseLandmarks) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set dynamic canvas size
    if (canvas.width !== videoRef.current.videoWidth) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
    }

    if (window.drawConnectors && window.POSE_CONNECTIONS) {
       window.drawConnectors(ctx, results.poseLandmarks, window.POSE_CONNECTIONS, { color: '#3b82f6', lineWidth: 4 });
       window.drawLandmarks(ctx, results.poseLandmarks, { color: '#ffffff', lineWidth: 1, radius: 5 });
    }
  };

  const toggleCamera = () => {
    setCameraReady(false);
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const retryInitialization = () => {
    setError(null);
    startCamera();
  };

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-[3rem] overflow-hidden border-4 border-slate-800 shadow-2xl group">
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover grayscale opacity-40" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-10" />
      
      {/* UI Overlays */}
      <div className="absolute top-8 left-8 z-20 flex gap-4">
         <div className="glass-card !bg-black/60 px-6 py-3 rounded-2xl border-white/5 backdrop-blur-xl flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${cameraReady ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{cameraReady ? 'Optical Sync Active' : 'Initializing Bio-Link...'}</span>
         </div>
         <button onClick={toggleCamera} className="glass-card !bg-black/60 p-3 rounded-2xl border-white/5 hover:bg-blue-500 transition-colors">📸</button>
      </div>

      {error && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 flex items-center justify-center p-10 text-center animate-enter">
           <div className="max-w-md space-y-6">
              <div className="text-6xl animate-bounce">⚠️</div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Neural Link Interrupted</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] leading-relaxed px-4">{error}</p>
              
              <div className="flex flex-col gap-4 pt-4">
                <button 
                  onClick={retryInitialization} 
                  className="h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-600/30 active:scale-95"
                >
                  ⚡ Re-Initialize Optical Sensors
                </button>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-[1px] bg-slate-800"></div>
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Alternative Protocol</span>
                  <div className="flex-1 h-[1px] bg-slate-800"></div>
                </div>

                <button 
                  onClick={() => {
                    setError(null);
                    setCameraReady(true);
                    // Start simulated movement
                    let frame = 0;
                    const simulate = () => {
                      if (!isRunning) return;
                      const dummyLandmarks = Array(33).fill(0).map((_, i) => ({
                        x: 0.5 + Math.sin(frame/20 + i) * 0.1,
                        y: 0.5 + Math.cos(frame/20 + i) * 0.1,
                        z: 0.0,
                        visibility: 0.95
                      }));
                      onPoseDetected({ poseLandmarks: dummyLandmarks });
                      drawSkeleton({ poseLandmarks: dummyLandmarks });
                      frame++;
                      animationFrameRef.current = requestAnimationFrame(simulate);
                    };
                    simulate();
                  }} 
                  className="h-14 bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-500 hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all italic"
                >
                  🚀 Launch Biometric Simulator
                </button>
              </div>

              <div className="pt-6">
                 <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Tech Support: Ensure your browser permits camera access for this domain.</p>
              </div>
           </div>
        </div>
      )}

      {/* Fallback Static State */}
      {!isRunning && !error && (
        <div className="absolute inset-0 z-10 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
           <div className="text-center space-y-4">
              <div className="text-5xl opacity-20">📡</div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Awaiting Biometric Protocol</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default MediaPipePose;
