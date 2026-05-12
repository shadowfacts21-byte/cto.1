import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Zap, Shield, Clock, Users, GitBranch, BarChart3, Sparkles, Play, ChevronDown, Quote, Star } from 'lucide-react';

const Home: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        setMousePos({ x, y });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
      { threshold: 0.05 }
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 30px rgba(37, 99, 235, 0.4); } 50% { box-shadow: 0 0 60px rgba(37, 99, 235, 0.7); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes typing { from { width: 0; } to { width: 100%; } }
        @keyframes blink { 50% { border-color: transparent; } }
        @keyframes orbit { from { transform: rotate(0deg) translateX(120px) rotate(0deg); } to { transform: rotate(360deg) translateX(120px) rotate(-360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        .animate-on-scroll { opacity: 0; transform: translateY(30px); transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
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
        .hero-image { animation: scaleIn 1s 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        .orb-1 { animation: float 8s ease-in-out infinite; }
        .orb-2 { animation: float 10s ease-in-out infinite 1s; }
        .orb-3 { animation: float 6s ease-in-out infinite 2s; }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .gradient-animate { background-size: 200% 200%; animation: gradient-shift 4s ease infinite; }
        .cta-button { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .cta-button:hover { transform: scale(1.05) translateY(-2px); box-shadow: 0 20px 40px rgba(37, 99, 235, 0.4); }
        .feature-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .feature-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 25px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(37, 99, 235, 0.1); }
        .pricing-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .pricing-card:hover { transform: translateY(-10px) scale(1.02); box-shadow: 0 25px 50px rgba(0,0,0,0.15), 0 0 0 1px var(--primary); }
        .testimonial-card { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .testimonial-card:hover { transform: scale(1.02) translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .stat-item { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .stat-item:hover { transform: scale(1.05); }
        .trusted-logo { transition: all 0.3s ease; }
        .trusted-logo:hover { transform: scale(1.1); opacity: 1; }
        .navbar-scrolled { background: rgba(255,255,255,0.98) !important; box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; }
        .scroll-indicator { animation: float 2s ease-in-out infinite; }
      `}</style>

      {/* Navbar */}
      <header className={scrolled ? 'navbar-scrolled' : ''} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)', padding: '0 48px', height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.375rem', color: 'var(--text)' }}>Orbit</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9375rem' }}>Sign In</Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9375rem' }}>Get Started Free</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} style={{
        padding: '140px 48px 100px', textAlign: 'center', minHeight: '100vh',
        background: 'linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%)',
        position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        {/* Animated background orbs */}
        <div className="orb-1" style={{
          position: 'absolute', top: '5%', left: '-5%', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)'
        }} />
        <div className="orb-2" style={{
          position: 'absolute', bottom: '10%', right: '-10%', width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)'
        }} />
        <div className="orb-3" style={{
          position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)'
        }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="hero-badge badge badge-accent" style={{
            marginBottom: '28px', display: 'inline-flex', alignItems: 'center', gap: '10px',
            padding: '10px 20px', fontSize: '0.9375rem', fontWeight: '600',
            borderRadius: '100px', border: '1px solid rgba(6, 182, 212, 0.3)'
          }}>
            <Sparkles size={18} />
            New: AI-Powered Automation & Guest Portals
          </div>

          <h1 className="hero-title" style={{
            fontSize: 'clamp(3rem, 7vw, 4.5rem)', fontWeight: '800', fontFamily: 'var(--font-heading)',
            color: 'var(--text)', lineHeight: '1.05', marginBottom: '28px', letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, var(--text) 30%, var(--primary) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            The project management tool
            <br />your team will actually use
          </h1>

          <p className="hero-subtitle" style={{
            fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', color: 'var(--text-secondary)',
            lineHeight: '1.7', marginBottom: '44px', maxWidth: '680px', margin: '0 auto 44px'
          }}>
            Task tracking, time management, analytics, and integrations — all in one place.
            <br />No complicated setup, no steep learning curve.
          </p>

          <div className="hero-buttons" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="cta-button pulse-glow" style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '18px 36px', fontSize: '1.0625rem', fontWeight: '700',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              color: 'white', borderRadius: '14px', textDecoration: 'none',
              boxShadow: '0 8px 30px rgba(37, 99, 235, 0.4)'
            }}>
              Start Free Trial <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{
              padding: '18px 36px', fontSize: '1.0625rem', fontWeight: '600',
              borderRadius: '14px', display: 'inline-flex', alignItems: 'center', gap: '10px'
            }}>
              <Play size={18} style={{ fill: 'currentColor' }} /> Watch Demo
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="hero-image" style={{
          width: '100%', maxWidth: '1100px', margin: '60px auto 0',
          background: 'var(--surface)', borderRadius: '24px',
          boxShadow: '0 40px 100px rgba(0,0,0,0.2), 0 0 0 1px var(--border)',
          overflow: 'hidden', position: 'relative', zIndex: 1
        }}>
          <div style={{ background: 'var(--bg)', padding: '20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {['#FF5F56', '#FFBD2E', '#27C93F'].map((c, i) => <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />)}
            </div>
          </div>
          <div style={{ display: 'flex', minHeight: '400px' }}>
            {/* Sidebar */}
            <div style={{ width: '220px', background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', padding: '10px', background: 'var(--primary-light)', borderRadius: '10px' }}>
                <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /></svg>
                </div>
                <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>Orbit</span>
              </div>
              {['Dashboard', 'Projects', 'Tasks', 'Time', 'Analytics', 'Settings'].map((item, i) => (
                <div key={item} style={{
                  padding: '10px 12px', borderRadius: '8px', marginBottom: '4px', fontSize: '0.8125rem',
                  fontWeight: i === 0 ? '600' : '500', color: i === 0 ? 'var(--primary)' : 'var(--text-secondary)',
                  background: i === 0 ? 'var(--primary-light)' : 'transparent',
                  cursor: 'pointer'
                }}>{item}</div>
              ))}
            </div>
            {/* Main content */}
            <div style={{ flex: 1, padding: '24px', background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Sprint Dashboard</h3>
                <div style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: '600' }}>+ New Task</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[
                  { title: 'To Do', color: 'var(--text-muted)', tasks: 8 },
                  { title: 'In Progress', color: 'var(--primary)', tasks: 5 },
                  { title: 'Done', color: '#10b981', tasks: 12 }
                ].map((col) => (
                  <div key={col.title} style={{ background: 'var(--surface)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: col.color }}>{col.title}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', background: 'var(--bg)', padding: '2px 8px', borderRadius: '100px' }}>{col.tasks}</span>
                    </div>
                    {[1, 2, 3].map((task) => (
                      <div key={task} style={{ background: 'var(--bg)', borderRadius: '8px', height: '48px', marginBottom: '8px', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color === 'var(--text-muted)' ? 'var(--border)' : col.color, marginRight: '10px' }} />
                        <div style={{ flex: 1, height: '8px', background: 'var(--border)', borderRadius: '4px', opacity: 0.5 }} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator" style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', color: 'var(--text-muted)' }}>
          <ChevronDown size={28} />
        </div>
      </section>

      {/* Trusted By Section */}
      <section style={{ padding: '48px 48px', background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px', fontWeight: '600' }}>
            Trusted by forward-thinking teams
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', alignItems: 'center' }}>
            {trustedByLogos.map((logo) => (
              <div key={logo.name} className="trusted-logo" style={{ opacity: 0.5, cursor: 'pointer' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.125rem', fontWeight: '800',
                  color: 'var(--text-secondary)', fontFamily: 'var(--font-heading)'
                }}>
                  <div style={{
                    width: '36px', height: '36px', background: 'var(--bg)', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700'
                  }}>{logo.logo}</div>
                  {logo.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section data-section="stats" style={{ padding: '80px 48px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', textAlign: 'center' }}>
          {stats.map((stat, index) => (
            <div key={index} className={`stat-item animate-on-scroll stagger-${index + 1} ${visibleSections.has('stats') ? 'visible' : ''}`}>
              <div style={{ fontSize: '3rem', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '8px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{stat.value}</div>
              <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section data-section="features" style={{ padding: '100px 48px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className={`animate-on-scroll ${visibleSections.has('features') ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '20px', letterSpacing: '-0.02em' }}>
              Everything you need to ship faster
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
              From small teams to enterprises, Orbit scales with you. All the features you need, none of the complexity.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {features.map((feature, index) => (
              <div key={index} className={`feature-card animate-on-scroll stagger-${index + 1} ${visibleSections.has('features') ? 'visible' : ''}`} style={{ background: 'var(--surface)', borderRadius: '20px', border: '1px solid var(--border)', padding: '36px', cursor: 'pointer' }}>
                <div style={{ width: '60px', height: '60px', background: 'var(--primary-light)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  <feature.icon size={30} style={{ color: 'var(--primary)' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '12px', color: 'var(--text)' }}>{feature.title}</h3>
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section data-section="pricing" style={{ padding: '100px 48px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div className={`animate-on-scroll ${visibleSections.has('pricing') ? 'visible' : ''}`}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '20px', letterSpacing: '-0.02em' }}>Simple, transparent pricing</h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '56px' }}>Start free, upgrade when you're ready to scale.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', textAlign: 'left' }}>
            {[
              { name: 'Free', price: '$0', features: ['1 project', '3 team members', 'Basic Kanban', '5GB storage'], popular: false },
              { name: 'Pro', price: '$19', features: ['Unlimited projects', 'Unlimited members', 'Time tracking', 'Analytics dashboard', 'Slack + GitHub', '50GB storage'], popular: true },
              { name: 'Enterprise', price: '$49', features: ['Everything in Pro', 'Automation rules', 'Guest portals', 'Priority support', '200GB storage'], popular: false }
            ].map((plan, i) => (
              <div key={plan.name} className={`pricing-card animate-on-scroll stagger-${i + 1} ${visibleSections.has('pricing') ? 'visible' : ''}`} style={{ background: 'var(--surface)', borderRadius: '24px', border: plan.popular ? '2px solid var(--primary)' : '1px solid var(--border)', padding: '36px', position: 'relative', transform: plan.popular ? 'scale(1.03)' : 'scale(1)' }}>
                {plan.popular && <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white', padding: '6px 20px', borderRadius: '100px', fontSize: '0.8125rem', fontWeight: '700' }}>Most Popular</div>}
                <h3 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>{plan.name}</h3>
                <div style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '28px' }}>{plan.price}<span style={{ fontSize: '1.25rem', fontWeight: '400', color: 'var(--text-muted)' }}>/mo</span></div>
                <ul style={{ listStyle: 'none', marginBottom: '32px' }}>
                  {plan.features.map((f, j) => <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', fontSize: '0.9375rem', color: 'var(--text-secondary)' }}><div style={{ width: '20px', height: '20px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Check size={12} style={{ color: '#10b981' }} /></div>{f}</li>)}
                </ul>
                <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', padding: '16px' }}>{plan.popular ? 'Start Pro Trial' : plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section data-section="testimonials" style={{ padding: '100px 48px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className={`animate-on-scroll ${visibleSections.has('testimonials') ? 'visible' : ''}`}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', textAlign: 'center', marginBottom: '56px' }}>Loved by teams everywhere</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {testimonials.map((t, i) => (
              <div key={i} className={`testimonial-card animate-on-scroll stagger-${i + 1} ${visibleSections.has('testimonials') ? 'visible' : ''}`} style={{ background: 'var(--surface)', borderRadius: '20px', border: '1px solid var(--border)', padding: '36px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>{[...Array(t.rating)].map((_, j) => <Star key={j} size={18} style={{ fill: '#fbbf24', color: '#fbbf24' }} />)}</div>
                <Quote size={32} style={{ color: 'var(--primary)', opacity: 0.3, marginBottom: '16px' }} />
                <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '28px' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '1.25rem' }}>{t.name.charAt(0)}</div>
                  <div><p style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text)' }}>{t.name}</p><p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-animate" style={{ padding: '120px 48px', textAlign: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' }}>
        <div className="animate-on-scroll" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'white', marginBottom: '24px' }}>Ready to streamline your workflow?</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', marginBottom: '48px' }}>Join thousands of teams using Orbit to ship faster.</p>
          <Link to="/register" className="cta-button" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'white', color: 'var(--primary)', fontWeight: '700', padding: '20px 40px', borderRadius: '14px', textDecoration: 'none', fontSize: '1.125rem' }}>
            Get Started Free <ArrowRight size={22} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '60px 48px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /></svg>
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.25rem' }}>Orbit</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>© 2024 Orbit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;