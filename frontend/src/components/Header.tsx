import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Settings, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="navbar-brand-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        </div>
        <span>Orbit</span>
      </Link>
      
      <div className="navbar-actions">
        <button className="btn btn-ghost" style={{ padding: '8px' }} title="Notifications">
          <Bell size={20} style={{ color: 'var(--text-muted)' }} />
        </button>
        <Link to="/settings" className="btn btn-ghost" style={{ padding: '8px' }} title="Settings">
          <Settings size={20} style={{ color: 'var(--text-muted)' }} />
        </Link>
        {user && (
          <div className="flex items-center gap-3" style={{ padding: '0 12px', borderLeft: '1px solid var(--border)', marginLeft: '4px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '700'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text)' }}>
              {user.name}
            </span>
          </div>
        )}
        <button
          onClick={logout}
          className="btn btn-ghost"
          style={{ padding: '8px' }}
          title="Logout"
        >
          <LogOut size={20} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
    </header>
  );
};

export default Header;