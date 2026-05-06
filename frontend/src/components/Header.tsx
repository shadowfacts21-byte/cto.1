import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-indigo-600">SaaS App</span>
      </div>
      
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <UserIcon size={18} />
            <span>{user.name}</span>
          </div>
        )}
        <button
          onClick={logout}
          className="p-2 text-gray-500 hover:text-red-600 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
