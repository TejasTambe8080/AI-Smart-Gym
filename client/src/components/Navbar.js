import React, { useState } from 'react';
import { Bell, User, Settings, LogOut, Menu, Search, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/workout') return 'Workouts';
    if (path === '/posture') return 'Posture Correction';
    if (path === '/activity') return 'Your Activity';
    if (path === '/analytics') return 'Analytics';
    if (path === '/suggestions') return 'AI Suggestions';
    if (path === '/diet') return 'Diet Plan';
    if (path === '/ai-workout') return 'AI Planner';
    if (path === '/profile') return 'My Profile';
    if (path === '/settings') return 'Settings';
    if (path === '/notifications') return 'Notifications';
    return 'Home';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden p-1.5 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-white tracking-tight">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search - Hidden on Small screens */}
        <div className="hidden md:flex items-center bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-700 focus-within:border-blue-500/50 transition-all">
          <Search size={18} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none px-2 text-sm text-white placeholder-slate-500 w-48 lg:w-64"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 text-slate-400 hover:bg-slate-800 hover:text-white rounded-full transition-all relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-900"></span>
          </button>
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button 
            className="flex items-center gap-2 p-1 pl-1 pr-2 hover:bg-slate-800 rounded-lg transition-all border border-transparent hover:border-slate-700"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs border border-white/10">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-white leading-none">{user.name || 'User'}</p>
              <p className="text-[10px] text-slate-500 leading-none mt-1">Premium Plan</p>
            </div>
            <ChevronDown size={14} className={`text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in py-1">
              <div className="px-4 py-3 border-b border-slate-800 lg:hidden">
                <p className="text-sm font-bold text-white">{user.name || 'User'}</p>
                <p className="text-xs text-slate-500 truncate">{user.email || 'user@example.com'}</p>
              </div>
              <Link 
                to="/profile" 
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User size={16} />
                <span>My Profile</span>
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings size={16} />
                <span>Settings</span>
              </Link>
              <div className="border-t border-slate-800 mt-1 pt-1">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
