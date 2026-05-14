import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header 
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        isMenuOpen={isMobileMenuOpen} 
      />
      <div className="flex flex-1 relative">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Sidebar Container */}
        <div className={`
          lg:static lg:block fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Sidebar />
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div key={location.pathname} className="animate-page-transition">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
