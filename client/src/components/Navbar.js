import React, { useState } from 'react';
import { Bell, User, Settings, LogOut, Menu, Search, ChevronDown, ShieldCheck, Activity } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

const Navbar = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/workout') return 'Workouts';
    if (path === '/activity') return 'Activity';
    if (path === '/analytics') return 'Analytics';
    if (path === '/find-trainer') return 'Trainers';
    if (path === '/trainer-dashboard') return 'Trainer Dashboard';
    if (path === '/trainer-bookings') return 'Bookings';
    if (path === '/trainer-clients') return 'Clients';
    if (path === '/profile') return 'Profile';
    if (path === '/notifications') return 'Notifications';
    return 'Smart Gym';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-4 lg:px-10 py-4 flex items-center justify-between sticky top-0 z-40 shadow-2xl">
      <div className="flex items-center gap-6">
        <button 
          className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl hover:text-white transition-all shadow-inner"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </button>
        <div className="flex flex-col">
           <h1 className="text-xl lg:text-2xl font-black text-white tracking-tighter uppercase italic leading-none">{getPageTitle()}</h1>
           <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mt-1 italic hidden sm:block">
              Status: System Online // Connection: Stable
           </p>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-8">
        {/* Search */}
        <div className="hidden lg:flex items-center bg-slate-950 rounded-2xl px-5 py-3 border border-slate-900 group focus-within:border-blue-600/40 transition-all shadow-inner w-72">
          <Search size={16} className="text-slate-600 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search exercises..." 
            className="bg-transparent border-none outline-none px-3 text-[10px] font-black text-white placeholder-slate-700 uppercase tracking-widest w-full"
          />
        </div>

        {/* Action Indicators */}
        <div className="flex items-center gap-2 lg:gap-4">
           <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-[9px] font-black uppercase tracking-widest text-blue-500 hover:bg-blue-600/20 transition-all">
              <ShieldCheck size={10} /> Encrypted
           </button>
           
           <div className="relative">
             <button className="w-12 h-12 flex items-center justify-center text-slate-500 bg-slate-950 border border-slate-900 rounded-2xl hover:text-white transition-all shadow-inner relative group">
               <Bell size={18} />
               <span className="absolute top-3 right-3 w-2 h-2 bg-blue-600 rounded-full border-2 border-slate-950 shadow-[0_0_10px_rgba(37,99,235,0.8)]"></span>
               <div className="absolute inset-0 rounded-2xl border border-blue-600/0 group-hover:border-blue-600/20 transition-all"></div>
             </button>
           </div>
        </div>

        {/* Identity Matrix Dropdown */}
        <div className="relative">
          <button 
            className="flex items-center gap-4 p-1 rounded-2xl hover:bg-slate-900/50 transition-all border border-transparent hover:border-slate-800 group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white text-lg font-black italic shadow-inner relative overflow-hidden group-hover:border-blue-600/40 transition-all">
               {user.imageUrl ? (
                  <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
               ) : user.name?.charAt(0).toUpperCase() || 'U'}
               <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[11px] font-black text-white leading-none uppercase italic tracking-tight">{user.name || 'User'}</p>
              <p className="text-[9px] font-bold text-slate-600 leading-none mt-1.5 uppercase tracking-widest">{user.role?.toUpperCase() || 'USER'} ACCESS</p>
            </div>
            <ChevronDown size={14} className={`text-slate-600 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-4 w-60 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden py-2 animate-enter z-50">
                <div className="px-6 py-4 border-b border-slate-800 flex flex-col gap-1">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">Account Info</p>
                  <p className="text-xs font-bold text-white truncate italic mt-1">{user.email || 'user@formfix.ai'}</p>
                </div>
                
                <div className="p-2 space-y-1">
                   <Link 
                     to="/profile" 
                     className="flex items-center gap-4 px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-800 hover:text-white rounded-2xl transition-all group"
                     onClick={() => setIsDropdownOpen(false)}
                   >
                     <User size={16} className="group-hover:text-blue-500" />
                     <span>View Profile</span>
                   </Link>
                   <Link 
                     to="/settings" 
                     className="flex items-center gap-4 px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-800 hover:text-white rounded-2xl transition-all group"
                     onClick={() => setIsDropdownOpen(false)}
                   >
                     <Settings size={16} className="group-hover:text-amber-500" />
                     <span>Settings</span>
                   </Link>
                </div>

                <div className="border-t border-slate-800 p-2">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full px-4 py-3 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-500/10 rounded-2xl transition-all group"
                  >
                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
