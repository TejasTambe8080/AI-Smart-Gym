// Premium SaaS Layout Component - FormFix AI
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', color: 'from-blue-500 to-blue-600' },
    { path: '/workout', label: 'Workout', icon: '🏋️', color: 'from-orange-500 to-orange-600' },
    { path: '/ai-workout', label: 'AI Planner', icon: '🤖', color: 'from-purple-500 to-purple-600' },
    { path: '/posture', label: 'Posture', icon: '🧍', color: 'from-green-500 to-green-600' },
    { path: '/activity', label: 'Activity', icon: '📝', color: 'from-cyan-500 to-cyan-600' },
    { path: '/analytics', label: 'Analytics', icon: '📈', color: 'from-pink-500 to-pink-600' },
    { path: '/ai-coach', label: 'AI Coach', icon: '🤖', color: 'from-indigo-500 to-indigo-600' },
    { path: '/diet', label: 'Diet', icon: '🥗', color: 'from-green-500 to-emerald-600' },
    { path: '/profile', label: 'Profile', icon: '👤', color: 'from-yellow-500 to-yellow-600' },
    { path: '/settings', label: 'Settings', icon: '⚙️', color: 'from-gray-500 to-gray-600' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:left-0 lg:top-0 lg:w-72 lg:h-screen lg:bg-gradient-to-b lg:from-slate-900 lg:to-slate-950 lg:border-r lg:border-slate-700 lg:flex lg:flex-col lg:z-40 lg:overflow-y-auto">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-200">
              🚀
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                FormFix AI
              </h1>
              <p className="text-xs text-slate-400">Premium Coach</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Main</p>
          {navItems.slice(0, 2).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? `bg-gradient-to-r ${item.color} text-white font-semibold shadow-lg`
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-4">AI Features</p>
          {navItems.slice(2, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? `bg-gradient-to-r ${item.color} text-white font-semibold shadow-lg`
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-4">Training</p>
          {navItems.slice(4, 8).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? `bg-gradient-to-r ${item.color} text-white font-semibold shadow-lg`
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <p className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mt-4">Account</p>
          {navItems.slice(8).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? `bg-gradient-to-r ${item.color} text-white font-semibold shadow-lg`
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Info Section */}
        <div className="p-4 border-t border-slate-700 bg-gradient-to-t from-slate-900 to-transparent">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name || 'User'}</p>
                <p className="text-xs text-slate-400 truncate">{user.email || 'email@example.com'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg text-sm font-semibold transition-all border border-red-600/30"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Top Navbar - Mobile & Desktop */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-700 text-white z-50 lg:ml-72">
        <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition"
            >
              <span className="text-2xl">☰</span>
            </button>
            <div className="hidden sm:block">
              <h2 className="text-lg font-bold text-slate-100">FormFix AI</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-slate-800 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-slate-300 placeholder-slate-500 outline-none flex-1"
              />
              <span className="text-slate-400">🔍</span>
            </div>

            {/* Notifications */}
            <NotificationDropdown />

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline text-sm text-slate-300">{user.name || 'User'}</span>
              </button>
              
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden">
                  <Link to="/profile" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 transition">
                    👤 Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-slate-300 hover:bg-slate-700 transition">
                    ⚙️ Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-300 hover:bg-slate-700 transition border-t border-slate-700"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden mt-16" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-slate-900 border-b border-slate-700 z-40 lg:hidden max-h-[calc(100vh-64px)] overflow-y-auto">
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? `bg-gradient-to-r ${item.color} text-white font-semibold`
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <main className="lg:ml-72 mt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
