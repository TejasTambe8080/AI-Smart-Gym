// Notification System - Frontend Component
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notifications?limit=10', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:5000/api/notifications/mark-all/read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const clearAll = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/notifications/clear/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'achievement':
        return 'bg-green-500/20 border-green-500/30';
      case 'posture_alert':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'workout_reminder':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'streak_achievement':
        return 'bg-orange-500/20 border-orange-500/30';
      case 'weak_muscle':
        return 'bg-red-500/20 border-red-500/30';
      default:
        return 'bg-slate-500/20 border-slate-500/30';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Notification Dropdown */}
          <div className="absolute right-0 mt-2 w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-40 max-h-[600px] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 bg-slate-900 flex items-center justify-between">
              <h3 className="text-white font-bold flex items-center gap-2">
                🔔 Notifications
                {unreadCount > 0 && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-slate-400 text-sm">🎉 No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 border-l-4 ${getNotificationColor(notification.type)} ${
                        !notification.isRead ? 'bg-slate-700/50' : ''
                      } hover:bg-slate-700 transition cursor-pointer`}
                    >
                      <div className="flex gap-3 justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{notification.icon}</span>
                            <h4 className="text-white font-semibold text-sm">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm mt-1">
                            {notification.message}
                          </p>
                          <p className="text-slate-500 text-xs mt-2">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="p-1 text-blue-400 hover:bg-slate-600 rounded transition"
                              title="Mark as read"
                            >
                              ✓
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="p-1 text-red-400 hover:bg-slate-600 rounded transition"
                            title="Delete"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-700 bg-slate-900 flex gap-2">
                <button
                  onClick={clearAll}
                  className="flex-1 px-3 py-2 text-sm text-red-300 hover:bg-slate-700 rounded transition"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
