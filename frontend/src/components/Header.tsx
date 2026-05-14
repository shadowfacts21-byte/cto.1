import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Bell, Search, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-primary p-1 rounded-lg text-white group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
            <CheckCircle2 size={20} />
          </div>
          <span className="text-lg font-black tracking-tight dark:text-white">CollabFlow</span>
        </Link>
        
        <div className="hidden md:flex relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Search projects or tasks..." 
            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl text-sm w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button className="text-slate-500 hover:text-primary transition-colors relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
        
        <div className="flex items-center gap-3 group cursor-pointer relative">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none capitalize">{user?.name || 'User'}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Admin</p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-slate-600 dark:text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-soft overflow-hidden">
            <User size={20} />
          </div>
          
          <button 
            onClick={logout}
            className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lift p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 whitespace-nowrap"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
