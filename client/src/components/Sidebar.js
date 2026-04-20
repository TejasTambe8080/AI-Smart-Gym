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
  MessageSquare
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isTrainer = user.role === 'trainer';

  const userMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Elite Trainers', path: '/find-trainer', icon: ShieldCheck },
    { name: 'Workout', path: '/workout', icon: Dumbbell },
    { name: 'Posture', path: '/posture', icon: UserSquare2 },
    { name: 'Activity', path: '/activity', icon: Activity },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'AI Suggestions', path: '/suggestions', icon: Lightbulb },
    { name: 'Diet', path: '/diet', icon: Utensils },
    { name: 'Planner', path: '/ai-workout', icon: CalendarDays },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const trainerMenuItems = [
    { name: 'Trainer Node', path: '/trainer-dashboard', icon: LayoutDashboard },
    { name: 'Active Agents', path: '/trainer-clients', icon: Users },
    { name: 'Intelligence Hub', path: '/trainer-chat', icon: MessageSquare },
    { name: 'Deployment Logs', path: '/analytics', icon: BarChart3 },
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
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-900 flex flex-col justify-between p-4
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-slate-800
      `}>
        <div>
          {/* Logo Section */}
          <div className="flex items-center justify-between mb-8 px-2">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Dumbbell size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">FormFix AI</span>
            </Link>
            <button className="lg:hidden text-slate-400 p-1 hover:bg-slate-800 rounded" onClick={toggleSidebar}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all group
                    ${active 
                      ? 'bg-slate-800 text-blue-400' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                  `}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                >
                  <Icon size={20} className={active ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'} />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="pt-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium text-sm"
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
