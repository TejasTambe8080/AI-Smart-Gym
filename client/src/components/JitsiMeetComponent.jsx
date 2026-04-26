import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const JitsiMeetComponent = ({ 
  bookingId, 
  userName, 
  onExit, 
  meetingLink 
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // If meeting link is not available, show message
    if (!meetingLink && !bookingId) {
      toast.error('Meeting link not available');
      return;
    }

    // Direct link to Jitsi Meet
    const jitsiLink = meetingLink || `https://meet.jitsi.si/formfix-${bookingId}`;

    // Option 1: Open in new tab/window
    const openJitsi = () => {
      window.open(jitsiLink, 'jitsi-meeting', 'width=1024,height=768');
    };

    openJitsi();

    return () => {
      if (onExit) {
        onExit();
      }
    };
  }, [bookingId, meetingLink, onExit]);

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-900 flex items-center justify-center rounded-lg">
      <div className="text-center">
        <div className="mb-6">
          <div className="inline-block bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-6">
            <svg className="w-16 h-16 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zm-1 6h-14v-4h14v4zm4-10h-2V5c0-1.1-.9-2-2-2h-4V1h-2v2H8V1H6v2H4c-1.1 0-2 .9-2 2v2H0v2h2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5h2V3z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Starting Video Session</h2>
        <p className="text-slate-400 mb-6">Opening Jitsi Meet in a new window...</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.open(meetingLink || `https://meet.jitsi.si/formfix-${bookingId}`, 'jitsi-meeting')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Open Meeting
          </button>
          <button
            onClick={() => {
              if (onExit) onExit();
              toast.success('Exiting video session');
            }}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default JitsiMeetComponent;
