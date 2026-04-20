import React from 'react';
import { Bell, Info, CheckCircle2, AlertCircle } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      title: 'Workout Complete',
      message: 'Great job! You completed your morning cardio session.',
      time: '2 hours ago',
      type: 'success',
      icon: CheckCircle2,
      color: 'text-green-400'
    },
    {
      id: 2,
      title: 'AI Suggestion',
      message: 'New personalized workout plan is ready for you.',
      time: '5 hours ago',
      type: 'info',
      icon: Info,
      color: 'text-blue-400'
    },
    {
      id: 3,
      title: 'Posture Alert',
      message: 'We noticed some inconsistencies in your last squat set.',
      time: '1 day ago',
      type: 'warning',
      icon: AlertCircle,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Notifications</h2>
          <p className="text-slate-400">Stay updated with your latest fitness progress</p>
        </div>
        <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div key={notification.id} className="saas-card flex items-start gap-4 hover:bg-slate-800/80 cursor-pointer transition-colors group">
              <div className={`p-2 rounded-lg bg-slate-900 border border-slate-700/50 ${notification.color}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    {notification.title}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-medium">{notification.time}</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {notification.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-8 text-center">
        <button className="saas-button mx-auto text-sm">
          Load older notifications
        </button>
      </div>
    </div>
  );
};

export default Notifications;
