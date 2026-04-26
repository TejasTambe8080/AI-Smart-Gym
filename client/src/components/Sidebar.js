import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  UserSquare2, 
  Activity, 
  BarChart3, 
  Lightbulb, 
  Utensils, 
  CalendarDays, 
  Bell, 
  User, 
  Settings,
  LogOut,
  X,
  ShieldCheck,
  Users,
  MessageSquare,
  Zap,
  Layers,
  Bot
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isTrainer = user.role === 'trainer';

  const userMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Trainers', path: '/find-trainer', icon: ShieldCheck },
    { name: 'Start Workout', path: '/workout', icon: Zap },
    { name: 'History', path: '/activity', icon: Activity },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'AI Coach', path: '/ai-coach', icon: Bot },
    { name: 'Posture Scan', path: '/posture', icon: UserSquare2 },
    { name: 'AI Suggestions', path: '/suggestions', icon: Lightbulb },
    { name: 'Nutrition', path: '/diet', icon: Utensils },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const trainerMenuItems = [
    { name: 'Dashboard', path: '/trainer-dashboard', icon: LayoutDashboard },
    { name: 'My Clients', path: '/trainer-clients', icon: Users },
    { name: 'Bookings', path: '/trainer-bookings', icon: CalendarDays },
    { name: 'Messages', path: '/notifications', icon: Bell },
    { name: 'My Profile', path: '/trainer-profile', icon: UserSquare2 },
  ];

  const menuItems = isTrainer ? trainerMenuItems : userMenuItems;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-slate-950 flex flex-col justify-between p-6
        transition-all duration-500 ease-in-out
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        border-r border-slate-900
      `}>
        <div className="space-y-12">
          {/* Logo Section */}
          <div className="flex items-center justify-between px-2">
            <Link to="/dashboard" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-12 transition-transform duration-500">
                <Dumbbell size={24} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-white italic uppercase leading-none">FormFix</span>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1 italic">AI COACH</span>
              </div>
            </Link>
            <button className="lg:hidden text-slate-600 p-2 hover:bg-slate-900 rounded-xl transition-all" onClick={toggleSidebar}>
              <X size={24} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mb-4 ml-4 italic underline underline-offset-8 decoration-slate-900">Main Menu</p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-4 px-5 py-4 rounded-2xl transition-all relative group overflow-hidden
                    ${active 
                      ? 'bg-blue-600 shadow-xl shadow-blue-600/20 text-white active:scale-95' 
                      : 'text-slate-500 hover:bg-slate-900 hover:text-slate-200'}
                  `}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                >
                  {active && (
                    <motion.div 
                      layoutId="activeGlow" 
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-transparent opacity-50"
                    />
                  )}
                  <Icon size={20} className={`relative z-10 ${active ? 'text-white' : 'text-slate-600 group-hover:text-blue-500'} transition-colors duration-300`} />
                  <span className="font-black text-[10px] uppercase tracking-widest relative z-10 italic">{item.name}</span>
                  {!active && <div className="absolute right-4 w-1 h-1 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform"></div>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-6">
           {/* Connection Status */}
           <div className="bg-slate-900/50 border border-slate-900 rounded-[2rem] p-5 space-y-4 shadow-inner">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">Security Active</p>
              </div>
              <div className="flex items-center justify-between">
                 <p className="text-[10px] font-black text-white uppercase italic">Level {user.level || 1} Member</p>
                 <Zap size={14} className="text-amber-500" />
              </div>
           </div>

           <button 
             onClick={handleLogout}
             className="flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-slate-600 hover:bg-rose-600/10 hover:text-rose-500 transition-all font-black text-[10px] uppercase tracking-[0.2em] italic border border-transparent hover:border-rose-500/20"
           >
             <LogOut size={20} />
             <span>Logout</span>
           </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
