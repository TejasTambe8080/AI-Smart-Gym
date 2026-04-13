// Modern Layout Component - Sidebar + Navbar
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/workout', label: 'Workout', icon: '🏋️' },
    { path: '/posture', label: 'Posture Check', icon: '👁️' },
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
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:w-72 lg:h-screen lg:bg-gradient-to-b lg:from-blue-900 lg:to-blue-800 lg:shadow-2xl lg:flex lg:flex-col lg:z-40 lg:overflow-y-auto">
        {/* Logo Section */}
        <div className="p-8 border-b border-blue-700">
          <Link to="/dashboard" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-500 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
              💪
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Gym</h1>
              <p className="text-sm text-blue-300">Fitness Coach</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow-lg scale-105'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-semibold text-lg">{item.label}</span>
              {isActive(item.path) && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-6 border-t border-blue-700">
          <div className="bg-gradient-to-br from-blue-700 to-blue-600 rounded-xl p-4 mb-4">
            <p className="text-xs text-blue-200 mb-1">LOGGED IN AS</p>
            <p className="text-white font-bold truncate">{user.name || 'User'}</p>
            <p className="text-xs text-blue-200 truncate">{user.email || 'email@example.com'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 shadow-xl z-50 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-cyan-500 rounded-lg flex items-center justify-center text-xl">
            💪
          </div>
          <h1 className="text-xl font-bold">AI Gym</h1>
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-blue-700 rounded-lg transition"
        >
          <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
        </button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="lg:hidden fixed top-16 left-0 right-0 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl z-40 max-h-[calc(100vh-64px)] overflow-y-auto">
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold'
                      : 'text-blue-100 hover:bg-blue-700'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-blue-700">
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
          <div
            className="lg:hidden fixed inset-0 bg-black opacity-50 z-30 mt-16"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </>
      )}

      {/* Main Content */}
      <main className="lg:ml-72 pt-20 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
