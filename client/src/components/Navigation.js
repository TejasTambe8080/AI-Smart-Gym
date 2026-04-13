// Navigation Component
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/workout', label: 'Workout', icon: '🏋️' },
    { path: '/activity', label: 'Activity', icon: '📝' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/suggestions', label: 'Suggestions', icon: '💡' },
    { path: '/diet', label: 'Diet', icon: '🍎' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Sidebar - Desktop */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:w-64 lg:h-screen lg:bg-gradient-to-b lg:from-blue-600 lg:to-blue-800 lg:shadow-lg lg:flex lg:flex-col lg:z-40">
        {/* Logo */}
        <div className="p-6 border-b border-blue-500">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="text-3xl">🏋️‍♂️</div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Smart Gym</h1>
              <p className="text-xs text-blue-200">Your Fitness Coach</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-white text-blue-600 font-semibold'
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-blue-500">
          <div className="bg-blue-700 rounded-lg p-4 mb-4">
            <p className="text-xs text-blue-200">Logged in as</p>
            <p className="text-white font-semibold truncate">{user.name || 'User'}</p>
            <p className="text-xs text-blue-200">{user.email || 'email@example.com'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Top Bar - Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg z-50 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="text-2xl">🏋️‍♂️</div>
          <div>
            <h1 className="text-lg font-bold">AI Smart Gym</h1>
          </div>
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-blue-700 rounded-lg transition"
        >
          <span className="text-2xl">☰</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-lg z-40 max-h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-white text-blue-600 font-semibold'
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-blue-500">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black opacity-50 z-30 mt-16"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Offset for Desktop */}
      <div className="lg:ml-64" />
    </>
  );
};

export default Navigation;
