import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Settings, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-light)',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <div style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        </div>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.25rem', color: 'var(--text)' }}>Orbit</span>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button style={{
          background: 'transparent',
          border: 'none',
          padding: '8px',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--text-muted)',
          transition: 'all 0.2s ease'
        }} title="Notifications">
          <Bell size={20} />
        </button>
        <Link to="/settings" style={{
          background: 'transparent',
          border: 'none',
          padding: '8px',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          color: 'var(--text-muted)',
          transition: 'all 0.2s ease',
          textDecoration: 'none'
        }} title="Settings">
          <Settings size={20} />
        </Link>
        {user && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            paddingLeft: '16px',
            borderLeft: '1px solid var(--border)',
            marginLeft: '4px'
          }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '700',
              boxShadow: '0 2px 8px rgba(6, 182, 212, 0.3)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text)' }}>
              {user.name}
            </span>
          </div>
        )}
        <button
          onClick={logout}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-muted)',
            transition: 'all 0.2s ease'
          }}
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;