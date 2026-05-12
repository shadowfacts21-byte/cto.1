import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Zap, Shield, Clock, Users, GitBranch, BarChart3, Sparkles, Play, ChevronDown, Quote, Star, TrendingUp, Folder, Plus, Settings, Bell as BellIcon, Target, ArrowUpRight, ArrowDownRight, CheckCircle, Grid } from 'lucide-react';

const Home: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section');
            if (id) setVisibleSections((prev) => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.03 }
    );
    document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const trustedByLogos = [
    { name: 'TechFlow', logo: 'TF' },
    { name: 'BuildRight', logo: 'BR' },
    { name: 'CreativeStack', logo: 'CS' },
    { name: 'DataPro', logo: 'DP' },
    { name: 'CloudBase', logo: 'CB' },
  ];

  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Built with Vite + React for instant page loads and smooth interactions.' },
    { icon: Shield, title: 'Enterprise Security', description: 'JWT authentication, role-based access, and guest portals keep your data safe.' },
    { icon: Clock, title: 'Time Tracking', description: 'Built-in timer, time logs, and reports — no need for extra tools.' },
    { icon: Users, title: 'Team Collaboration', description: 'Real-time task management with Kanban boards, comments, and activity logs.' },
    { icon: GitBranch, title: 'GitHub Integration', description: 'Link commits to tasks automatically. Keep everyone in sync.' },
    { icon: BarChart3, title: 'Analytics Dashboard', description: 'Burndown charts, velocity tracking, and team workload insights.' },
  ];

  const testimonials = [
    { name: 'Sarah Chen', role: 'Product Manager at TechFlow', text: 'Orbit transformed how our team tracks projects. The time tracking alone saved us hours every week.', rating: 5 },
    { name: 'Marcus Johnson', role: 'CTO at BuildRight', text: 'The clean interface and powerful integrations make this the best project management tool we have used.', rating: 5 },
    { name: 'Elena Rodriguez', role: 'Design Lead at CreativeStack', text: 'Finally a tool my whole team actually wants to use. The UI is intuitive and the guest portal is perfect for client updates.', rating: 5 },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Teams' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '50+', label: 'Integrations' },
    { value: '4.9/5', label: 'User Rating' },
  ];

  const teamMembers = [
    { name: 'Alex', avatar: 'A', color: '#2563EB' },
    { name: 'Sarah', avatar: 'S', color: '#7C3AED' },
    { name: 'Mike', avatar: 'M', color: '#059669' },
    { name: 'Emma', avatar: 'E', color: '#DC2626' },
  ];

  const activityItems = [
    { user: 'Alex', action: 'completed task', target: 'Design dashboard mockup', time: '2m ago', type: 'complete' },
    { user: 'Sarah', action: 'added comment on', target: 'API integration', time: '5m ago', type: 'comment' },
    { user: 'Mike', action: 'created project', target: 'Mobile App v2', time: '12m ago', type: 'create' },
    { user: 'Emma', action: 'updated status of', target: 'User Authentication', time: '18m ago', type: 'update' },
  ];

  const upcomingTasks = [
    { title: 'Review pull requests', priority: 'high', due: 'Today' },
    { title: 'Update documentation', priority: 'medium', due: 'Tomorrow' },
    { title: 'Team sync meeting', priority: 'low', due: 'Jan 15' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-25px) rotate(3deg); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 40px rgba(37, 99, 235, 0.4), 0 0 0 1px rgba(37, 99, 235, 0.1); } 50% { box-shadow: 0 0 60px rgba(37, 99, 235, 0.6), 0 0 0 1px rgba(37, 99, 235, 0.2); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes orbit { from { transform: rotate(0deg) translateX(150px) rotate(0deg); } to { transform: rotate(360deg) translateX(150px) rotate(-360deg); } }
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
        @keyframes glass-shine { 0% { transform: translateX(-100%) rotate(45deg); } 100% { transform: translateX(200%) rotate(45deg); } }
        @keyframes countUp { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
        .animate-on-scroll { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-on-scroll.visible { opacity: 1; transform: translateY(0); }
        .stagger-1 { transition-delay: 0.05s; }
        .stagger-2 { transition-delay: 0.1s; }
        .stagger-3 { transition-delay: 0.15s; }
        .stagger-4 { transition-delay: 0.2s; }
        .stagger-5 { transition-delay: 0.25s; }
        .stagger-6 { transition-delay: 0.3s; }
        .hero-title { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .hero-badge { animation: fadeInUp 0.8s 0.1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .hero-subtitle { animation: fadeInUp 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .hero-buttons { animation: fadeInUp 0.8s 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .hero-image { animation: scaleIn 1s 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .orb-1 { animation: float 10s ease-in-out infinite; }
        .orb-2 { animation: float 12s ease-in-out infinite 2s; }
        .orb-3 { animation: float 8s ease-in-out infinite 4s; }
        .pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }
        .gradient-animate { background-size: 200% 200%; animation: gradient-shift 4s ease infinite; }
        .cta-button { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .cta-button:hover { transform: scale(1.06) translateY(-3px); box-shadow: 0 25px 50px rgba(37, 99, 235, 0.45), 0 0 0 1px rgba(37, 99, 235, 0.3); }
        .cta-button:active { transform: scale(0.98) translateY(0); }
        .feature-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .feature-card:hover { transform: translateY(-10px) scale(1.03); box-shadow: 0 30px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(37, 99, 235, 0.15), 0 0 40px rgba(37, 99, 235, 0.1); }
        .feature-card:hover .feature-icon { transform: scale(1.15) rotate(-5deg); }
        .feature-icon { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .pricing-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .pricing-card:hover { transform: translateY(-12px) scale(1.04); box-shadow: 0 30px 60px rgba(0,0,0,0.18), 0 0 0 1px var(--primary), 0 0 50px rgba(37, 99, 235, 0.15); }
        .testimonial-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .testimonial-card:hover { transform: scale(1.03) translateY(-6px); box-shadow: 0 25px 50px rgba(0,0,0,0.12); }
        .stat-item { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .stat-item:hover { transform: scale(1.08); }
        .stat-item:hover .stat-value { transform: scale(1.05); }
        .stat-value { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .trusted-logo { transition: all 0.3s ease; }
        .trusted-logo:hover { transform: scale(1.15); opacity: 1 !important; }
        .navbar-scrolled { background: rgba(255,255,255,0.98) !important; box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important; backdrop-filter: blur(24px) !important; }
        .scroll-indicator { animation: bounce 2s ease-in-out infinite; }
        .glass { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.3); }
        .glass-dark { background: rgba(0, 0, 0, 0.3); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); }
        .card-glass { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.5); }
        .card-elevated { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05); }
        .electric-blue { color: #2563EB; }
        .bg-electric-blue { background: #2563EB; }
        .progress-bar { animation: progress 1.5s ease-out forwards; }
        .activity-item { transition: all 0.3s ease; }
        .activity-item:hover { background: rgba(37, 99, 235, 0.05); transform: translateX(4px); }
        .task-item { transition: all 0.3s ease; }
        .task-item:hover { transform: translateX(6px); background: rgba(37, 99, 235, 0.05); }
        .sidebar-item { transition: all 0.3s ease; }
        .sidebar-item:hover { background: rgba(37, 99, 235, 0.08); }
        .sidebar-item.active { background: rgba(37, 99, 235, 0.12); box-shadow: inset 3px 0 0 #2563EB; }
        .sidebar-item.active .sidebar-icon { color: #2563EB; }
        .metric-card { transition: all 0.4s ease; }
        .metric-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .chart-bar { transition: all 0.4s ease; }
        .chart-bar:hover { fill: #2563EB; transform: scaleY(1.05); }
      `}</style>

      {/* Navbar */}
      <header className={scrolled ? 'navbar-scrolled' : ''} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)', padding: '0 48px', height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px', height: '44px', background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            boxShadow: '0 4px 16px rgba(37, 99, 235, 0.35)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.5rem', color: 'var(--text)' }}>Orbit</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: '600' }}>Sign In</Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: '600' }}>Get Started Free</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '100px 48px 60px', textAlign: 'center', minHeight: '85vh',
        background: 'linear-gradient(180deg, #fef2f2 0%, #fee2e2 50%, #fecaca 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Animated orbs */}
        <div className="orb-1" style={{
          position: 'absolute', top: '0%', left: '-10%', width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.12) 0%, transparent 60%)', borderRadius: '50%', filter: 'blur(100px)'
        }} />
        <div className="orb-2" style={{
          position: 'absolute', bottom: '10%', right: '-15%', width: '700px', height: '700px',
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.12) 0%, transparent 60%)', borderRadius: '50%', filter: 'blur(100px)'
        }} />
        <div className="orb-3" style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 60%)', borderRadius: '50%', filter: 'blur(80px)'
        }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="hero-badge" style={{
            marginBottom: '32px', display: 'inline-flex', alignItems: 'center', gap: '12px',
            padding: '12px 24px', fontSize: '1rem', fontWeight: '700',
            background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.2)',
            borderRadius: '100px', color: '#2563EB'
          }}>
            <Sparkles size={20} />
            New: AI-Powered Automation & Guest Portals
          </div>

          <h1 className="hero-title" style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '900', fontFamily: 'var(--font-heading)',
            color: '#0f172a', lineHeight: '1.05', marginBottom: '20px', letterSpacing: '-0.03em'
          }}>
            <span style={{ background: 'linear-gradient(135deg, #0f172a 40%, #2563EB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              The project management tool
            </span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              your team will actually use
            </span>
          </h1>

          <p className="hero-subtitle" style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', color: '#475569',
            lineHeight: '1.65', marginBottom: '48px', maxWidth: '680px', margin: '0 auto 48px'
          }}>
            Task tracking, time management, analytics, and integrations — all in one place.
            <br /><strong style={{ color: '#0f172a' }}>No complicated setup, no steep learning curve.</strong>
          </p>

          <div className="hero-buttons" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="cta-button pulse-glow" style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              padding: '20px 40px', fontSize: '1.125rem', fontWeight: '700',
              background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)',
              color: 'white', borderRadius: '16px', textDecoration: 'none',
              boxShadow: '0 12px 40px rgba(37, 99, 235, 0.4)'
            }}>
              Start Free Trial <ArrowRight size={22} />
            </Link>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '20px 40px', fontSize: '1.125rem', fontWeight: '600',
              background: 'white', color: '#0f172a', borderRadius: '16px', textDecoration: 'none',
              border: '2px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              <Play size={20} style={{ fill: '#2563EB' }} /> Watch Demo
            </Link>
          </div>
        </div>

        {/* Enhanced Dashboard Preview */}
        <div className="hero-image" style={{
          width: '100%', maxWidth: '1200px', margin: '20px auto 0',
          background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)',
          borderRadius: '28px', boxShadow: '0 50px 120px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
          border: '1px solid rgba(255,255,255,0.8)', overflow: 'hidden', position: 'relative', zIndex: 1
        }}>
          {/* Browser chrome */}
          <div style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['#FF5F56', '#FFBD2E', '#27C93F'].map((c, i) => <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', background: c }} />)}
            </div>
            <div style={{ flex: 1, height: '36px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /></svg>
              <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>app.orbit.com/dashboard</span>
            </div>
          </div>

          <div style={{ display: 'flex', minHeight: '320px' }}>
            {/* Sidebar */}
            <div style={{ width: '260px', background: 'white', borderRight: '1px solid #e2e8f0', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', padding: '12px', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)', borderRadius: '12px', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #2563EB, #06B6D4)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /></svg>
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.9375rem', color: '#0f172a' }}>Orbit</div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Workspace</div>
                </div>
              </div>
              
              {[
                { icon: Grid, label: 'Dashboard', active: true },
                { icon: Folder, label: 'Projects' },
                { icon: Target, label: 'Tasks' },
                { icon: Clock, label: 'Time' },
                { icon: BarChart3, label: 'Analytics' },
                { icon: Users, label: 'Team' },
                { icon: Settings, label: 'Settings' },
              ].map((item, i) => (
                <div key={i} className={`sidebar-item ${item.active ? 'active' : ''}`} style={{
                  padding: '12px 16px', borderRadius: '10px', marginBottom: '4px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem',
                  fontWeight: item.active ? '700' : '500', color: item.active ? '#2563EB' : '#475569',
                  background: item.active ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  boxShadow: item.active ? 'inset 3px 0 0 #2563EB' : 'none'
                }}>
                  <item.icon size={18} className="sidebar-icon" style={{ color: item.active ? '#2563EB' : '#94a3b8' }} />
                  {item.label}
                </div>
              ))}

              {/* Team avatars */}
              <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Online Now</div>
                <div style={{ display: 'flex' }}>
                  {teamMembers.map((m, i) => (
                    <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: m.color, border: '2px solid white', marginLeft: i > 0 ? '-8px' : '0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.6875rem', fontWeight: '700' }}>
                      {m.avatar}
                    </div>
                  ))}
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', border: '2px solid white', marginLeft: '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '0.6875rem', fontWeight: '600' }}>+8</div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div style={{ flex: 1, padding: '24px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>Good morning, Alex! 👋</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Here's what's happening with your projects today.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ padding: '10px 16px', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#64748b' }}>
                    <BellIcon size={16} /> <span>3</span>
                  </div>
                  <div style={{ padding: '10px 16px', background: '#2563EB', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'white', fontWeight: '600' }}>
                    <Plus size={16} /> New Task
                  </div>
                </div>
              </div>

              {/* Metrics row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Active Tasks', value: '24', change: '+12%', up: true, icon: Target },
                  { label: 'Completed', value: '156', change: '+8%', up: true, icon: CheckCircle },
                  { label: 'Team Velocity', value: '89%', change: '-3%', up: false, icon: TrendingUp },
                  { label: 'Hours Tracked', value: '42h', change: '+18%', up: true, icon: Clock },
                ].map((metric, i) => (
                  <div key={i} className="metric-card" style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>{metric.label}</span>
                      <metric.icon size={16} style={{ color: '#2563EB' }} />
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>{metric.value}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: metric.up ? '#059669' : '#dc2626', fontWeight: '600' }}>
                      {metric.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {metric.change} vs last week
                    </div>
                  </div>
                ))}
              </div>

              {/* Kanban board */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {[
                  { title: 'To Do', color: '#64748b', count: 8, tasks: ['Design system updates', 'API documentation', 'User research synthesis'] },
                  { title: 'In Progress', color: '#2563EB', count: 5, tasks: ['Dashboard redesign', 'Auth flow improvements', 'Performance optimization'] },
                  { title: 'Done', color: '#059669', count: 12, tasks: ['Landing page', 'Onboarding flow', 'CI/CD setup'] },
                ].map((col) => (
                  <div key={col.title} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: col.color }} />
                        <span style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#0f172a' }}>{col.title}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', background: '#f1f5f9', padding: '4px 10px', borderRadius: '100px', color: '#64748b' }}>{col.count}</span>
                    </div>
                    {col.tasks.map((task, i) => (
                      <div key={i} style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', marginBottom: '10px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>{task}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${60 + i * 15}%`, height: '100%', background: col.color, borderRadius: '2px' }} />
                          </div>
                          <span style={{ fontSize: '0.6875rem', fontWeight: '600', color: '#94a3b8' }}>{60 + i * 15}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Activity sidebar */}
            <div style={{ width: '280px', background: 'white', borderLeft: '1px solid #e2e8f0', padding: '20px' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>Recent Activity</h4>
              {activityItems.map((item, i) => (
                <div key={i} className="activity-item" style={{ display: 'flex', gap: '12px', marginBottom: '16px', padding: '12px', borderRadius: '10px', cursor: 'pointer' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: '700', flexShrink: 0 }}>
                    {item.user.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.8125rem', color: '#0f172a', marginBottom: '2px' }}>
                      <strong>{item.user}</strong> {item.action}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: '600' }}>{item.target}</p>
                    <p style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '4px' }}>{item.time}</p>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>Upcoming Tasks</h4>
                {upcomingTasks.map((task, i) => (
                  <div key={i} className="task-item" style={{ padding: '14px', background: '#f8fafc', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: task.priority === 'high' ? '#dc2626' : task.priority === 'medium' ? '#f59e0b' : '#10b981' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a' }}>{task.title}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Due: {task.due}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator" style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', color: '#94a3b8' }}>
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Trusted By */}
      <section style={{ padding: '56px 48px', background: 'white', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '28px', fontWeight: '700' }}>
            Trusted by forward-thinking teams
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '56px', flexWrap: 'wrap', alignItems: 'center' }}>
            {trustedByLogos.map((logo) => (
              <div key={logo.name} className="trusted-logo" style={{ opacity: 0.4, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', fontWeight: '800', color: '#475569', fontFamily: 'var(--font-heading)' }}>
                  <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: '800' }}>{logo.logo}</div>
                  {logo.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section data-section="stats" style={{ padding: '80px 48px', background: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', textAlign: 'center' }}>
          {stats.map((stat, index) => (
            <div key={index} className={`stat-item animate-on-scroll stagger-${index + 1} ${visibleSections.has('stats') ? 'visible' : ''}`}>
              <div className="stat-value" style={{ fontSize: '3.5rem', fontWeight: '900', fontFamily: 'var(--font-heading)', marginBottom: '8px', background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{stat.value}</div>
              <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section data-section="features" style={{ padding: '100px 48px', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className={`animate-on-scroll ${visibleSections.has('features') ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: '72px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', fontFamily: 'var(--font-heading)', marginBottom: '20px', letterSpacing: '-0.02em', color: '#0f172a' }}>
              Everything you need to ship faster
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#475569', maxWidth: '650px', margin: '0 auto', lineHeight: '1.7' }}>
              From small teams to enterprises, Orbit scales with you. All the features you need, none of the complexity.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
            {features.map((feature, index) => (
              <div key={index} className={`feature-card animate-on-scroll stagger-${index + 1} ${visibleSections.has('features') ? 'visible' : ''}`} style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '40px', cursor: 'pointer' }}>
                <div className="feature-icon" style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px' }}>
                  <feature.icon size={32} style={{ color: '#2563EB' }} />
                </div>
                <h3 style={{ fontSize: '1.375rem', fontWeight: '800', marginBottom: '14px', color: '#0f172a' }}>{feature.title}</h3>
                <p style={{ fontSize: '1.0625rem', color: '#475569', lineHeight: '1.7' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section data-section="pricing" style={{ padding: '100px 48px', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div className={`animate-on-scroll ${visibleSections.has('pricing') ? 'visible' : ''}`}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', fontFamily: 'var(--font-heading)', marginBottom: '20px', letterSpacing: '-0.02em' }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: '1.125rem', color: '#475569', marginBottom: '56px' }}>Start free, upgrade when you're ready to scale.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', textAlign: 'left' }}>
            {[
              { name: 'Free', price: '$0', features: ['1 project', '3 team members', 'Basic Kanban', '5GB storage'], popular: false },
              { name: 'Pro', price: '$19', features: ['Unlimited projects', 'Unlimited members', 'Time tracking', 'Analytics dashboard', 'Slack + GitHub', '50GB storage'], popular: true },
              { name: 'Enterprise', price: '$49', features: ['Everything in Pro', 'Automation rules', 'Guest portals', 'Priority support', '200GB storage'], popular: false }
            ].map((plan, i) => (
              <div key={plan.name} className={`pricing-card animate-on-scroll stagger-${i + 1} ${visibleSections.has('pricing') ? 'visible' : ''}`} style={{ background: 'white', borderRadius: '24px', border: plan.popular ? '2px solid #2563EB' : '1px solid #e2e8f0', padding: '40px', position: 'relative', transform: plan.popular ? 'scale(1.04)' : 'scale(1)' }}>
                {plan.popular && <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #2563EB, #06B6D4)', color: 'white', padding: '8px 24px', borderRadius: '100px', fontSize: '0.8125rem', fontWeight: '700', whiteSpace: 'nowrap' }}>Most Popular</div>}
                <h3 style={{ fontSize: '0.875rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>{plan.name}</h3>
                <div style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '32px', color: '#0f172a' }}>{plan.price}<span style={{ fontSize: '1.5rem', fontWeight: '500', color: '#94a3b8' }}>/mo</span></div>
                <ul style={{ listStyle: 'none', marginBottom: '36px' }}>
                  {plan.features.map((f, j) => <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', fontSize: '1rem', color: '#475569' }}><div style={{ width: '24px', height: '24px', background: 'rgba(16, 185, 129, 0.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={14} style={{ color: '#059669' }} /></div>{f}</li>)}
                </ul>
                <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', padding: '18px' }}>{plan.popular ? 'Start Pro Trial' : plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section data-section="testimonials" style={{ padding: '100px 48px', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className={`animate-on-scroll ${visibleSections.has('testimonials') ? 'visible' : ''}`}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', fontFamily: 'var(--font-heading)', textAlign: 'center', marginBottom: '56px' }}>Loved by teams everywhere</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
            {testimonials.map((t, i) => (
              <div key={i} className={`testimonial-card animate-on-scroll stagger-${i + 1} ${visibleSections.has('testimonials') ? 'visible' : ''}`} style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '40px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>{[...Array(t.rating)].map((_, j) => <Star key={j} size={20} style={{ fill: '#fbbf24', color: '#fbbf24' }} />)}</div>
                <Quote size={36} style={{ color: '#2563EB', opacity: 0.2, marginBottom: '20px' }} />
                <p style={{ fontSize: '1.125rem', color: '#475569', lineHeight: '1.7', marginBottom: '28px' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #2563EB, #06B6D4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '1.25rem' }}>{t.name.charAt(0)}</div>
                  <div><p style={{ fontWeight: '700', fontSize: '1.0625rem', color: '#0f172a' }}>{t.name}</p><p style={{ fontSize: '0.875rem', color: '#64748b' }}>{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-animate" style={{ padding: '120px 48px', textAlign: 'center', background: 'linear-gradient(135deg, #2563EB 0%, #1d4ed8 50%, #06B6D4 100%)', backgroundSize: '200% 200%' }}>
        <div className="animate-on-scroll" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', fontFamily: 'var(--font-heading)', color: 'white', marginBottom: '24px' }}>Ready to streamline your workflow?</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', marginBottom: '48px' }}>Join thousands of teams using Orbit to ship faster.</p>
          <Link to="/register" className="cta-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', background: 'white', color: '#2563EB', fontWeight: '800', padding: '22px 48px', borderRadius: '16px', textDecoration: 'none', fontSize: '1.25rem', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            Get Started Free <ArrowRight size={24} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '64px 48px', background: 'white', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #2563EB, #06B6D4)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /></svg>
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.375rem' }}>Orbit</span>
          </div>
          <p style={{ fontSize: '0.9375rem', color: '#94a3b8' }}>© 2024 Orbit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;