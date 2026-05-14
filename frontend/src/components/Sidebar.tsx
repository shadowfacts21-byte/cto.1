import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Settings, Users, Plus, Star, BarChart3 } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const favorites = [
    { name: 'Mobile Redesign', color: 'text-primary' },
    { name: 'Q2 Marketing', color: 'text-accent' },
  ];

  return (
    <aside className="bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-900 w-full h-full flex flex-col transition-colors duration-300">
      <div className="flex-1 py-8 px-4 flex flex-col gap-10">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 px-4">Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all group ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`
                }
              >
                <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6 px-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Favorites</p>
            <button className="text-slate-400 hover:text-primary transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <div className="space-y-1">
            {favorites.map((fav, i) => (
              <button key={i} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl transition-all group">
                <Star size={18} className={fav.color} />
                {fav.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl p-6 border border-primary/10 relative overflow-hidden group hover:border-primary/30 transition-all">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
          <p className="text-sm font-bold dark:text-white mb-2 relative z-10">Pro Version</p>
          <p className="text-xs text-slate-500 mb-4 relative z-10">Get unlimited projects and advanced analytics.</p>
          <button className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary-hover flex items-center gap-1 group relative z-10">
            Upgrade Now
            <Plus size={12} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
