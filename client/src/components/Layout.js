// Modern Layout Component - Fully Mobile Responsive
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:w-72 lg:h-screen lg:bg-gradient-to-b lg:from-blue-900 lg:to-blue-800 lg:shadow-2xl lg:flex lg:flex-col lg:z-40 lg:overflow-y-auto">
        {/* Logo Section */}
        <div className="p-6 lg:p-8 border-b border-blue-700">
          <Link to="/dashboard" className="flex items-center gap-3 lg:gap-4 group">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-cyan-500 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-200">
              💪
            </div>
            <div className="hidden lg:block">
              <h1 className="text-xl lg:text-2xl font-bold text-white">AI Gym</h1>
              <p className="text-xs lg:text-sm text-blue-300">Fitness Coach</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 lg:px-4 py-6 lg:py-8 space-y-1 lg:space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl transition-all duration-200 whitespace-nowrap ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow-lg'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-lg lg:text-2xl">{item.icon}</span>
              <span className="font-semibold text-sm lg:text-lg">{item.label}</span>
              {isActive(item.path) && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* User Card - Footer */}
        <div className="p-4 lg:p-6 border-t border-blue-700 bg-blue-950 bg-opacity-50">
          <div className="bg-gradient-to-br from-blue-700 to-blue-600 rounded-lg lg:rounded-xl p-3 lg:p-4 mb-3 lg:mb-4">
            <p className="text-xs text-blue-200 mb-1">LOGGED IN AS</p>
            <p className="text-white font-bold truncate text-sm lg:text-base">{user.name || 'User'}</p>
            <p className="text-xs text-blue-200 truncate">{user.email || 'email@example.com'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-3 lg:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md text-sm lg:text-base"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar - Visible on mobile/tablet only */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white p-3 sm:p-4 shadow-xl z-50 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-cyan-500 rounded-lg flex items-center justify-center text-xl">
            💪
          </div>
          <h1 className="text-lg sm:text-xl font-bold">AI Gym</h1>
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
        </button>
      </header>

      {/* Mobile Menu - Sliding drawer */}
      {isMobileMenuOpen && (
        <>
          <div className="lg:hidden fixed top-16 left-0 right-0 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl z-40 max-h-[calc(100vh-64px)] overflow-y-auto">
            <nav className="p-3 sm:p-4 space-y-1">
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
                  <span className="text-sm sm:text-base">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="p-3 sm:p-4 border-t border-blue-700">
              <div className="bg-gradient-to-br from-blue-700 to-blue-600 rounded-lg p-3 mb-3">
                <p className="text-xs text-blue-200 mb-1">LOGGED IN AS</p>
                <p className="text-white font-bold truncate text-xs sm:text-sm">{user.name || 'User'}</p>
                <p className="text-xs text-blue-200 truncate">{user.email || 'email@example.com'}</p>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black opacity-50 z-30 mt-16"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        </>
      )}

      {/* Main Content Area - Properly responsive */}
      <main className="lg:ml-72 pt-16 lg:pt-0 min-h-screen p-3 sm:p-4 lg:p-6">
        <div className="w-full max-w-full lg:max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

export default Layout;
