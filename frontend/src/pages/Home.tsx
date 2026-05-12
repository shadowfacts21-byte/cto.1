import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Zap, Shield, Clock, Users, GitBranch, BarChart3, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section');
            if (id) {
              setVisibleSections((prev) => new Set([...prev, id]));
              if (id === 'stats') setCountersStarted(true);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with Vite + React for instant page loads and smooth interactions.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'JWT authentication, role-based access, and guest portals keep your data safe.'
    },
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Built-in timer, time logs, and reports — no need for extra tools.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Real-time task management with Kanban boards, comments, and activity logs.'
    },
    {
      icon: GitBranch,
      title: 'GitHub Integration',
      description: 'Link commits to tasks automatically. Keep everyone in sync.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Burndown charts, velocity tracking, and team workload insights.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager at TechFlow',
      text: 'Orbit transformed how our team tracks projects. The time tracking alone saved us hours every week.'
    },
    {
      name: 'Marcus Johnson',
      role: 'CTO at BuildRight',
      text: 'The clean interface and powerful integrations make this the best project management tool we have used.'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Design Lead at CreativeStack',
      text: 'Finally a tool my whole team actually wants to use. The UI is intuitive and the guest portal is perfect for client updates.'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Teams' },
    { value: '99.9%', label: 'Uptime' },
    { value: '50+', label: 'Integrations' },
    { value: '4.9/5', label: 'User Rating' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(37, 99, 235, 0.3); }
          50% { box-shadow: 0 0 40px rgba(37, 99, 235, 0.6); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .stagger-1 { transition-delay: 0.1s; }
        .stagger-2 { transition-delay: 0.2s; }
        .stagger-3 { transition-delay: 0.3s; }
        .stagger-4 { transition-delay: 0.4s; }
        .stagger-5 { transition-delay: 0.5s; }
        .stagger-6 { transition-delay: 0.6s; }
        .hero-title {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hero-badge {
          animation: fadeInUp 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .hero-subtitle {
          animation: fadeInUp 0.8s 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .hero-buttons {
          animation: fadeInUp 0.8s 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .hero-image {
          animation: fadeInScale 1s 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .nav-brand {
          animation: slideInLeft 0.6s 0.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .nav-buttons {
          animation: slideInRight 0.6s 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .feature-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
        }
        .feature-icon {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pricing-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pricing-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        .testimonial-card {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .testimonial-card:hover {
          transform: scale(1.02);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }
        .cta-button {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cta-button:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .floating {
          animation: float 6s ease-in-out infinite;
        }
        .floating-slow {
          animation: float 8s ease-in-out infinite;
        }
        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
        .stat-item {
          animation: countUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .cta-section {
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          background-size: 200% 200%;
          animation: gradient-shift 4s ease infinite;
        }
      `}</style>

      {/* Navbar */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
        </div>
        <div className="nav-buttons" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Sign In</Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        padding: '100px 48px 80px', 
        textAlign: 'center',
        background: 'linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating background orbs */}
        <div className="floating-slow" style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)',
          borderRadius: '50%',
          opacity: 0.5,
          filter: 'blur(60px)'
        }} />
        <div className="floating" style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          opacity: 0.5,
          filter: 'blur(60px)'
        }} />
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="hero-badge badge badge-accent" style={{ 
            marginBottom: '24px', 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            <Sparkles size={16} />
            New: Automation Rules & Guest Portals
          </div>
          
          <h1 className="hero-title" style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: '800', 
            fontFamily: 'var(--font-heading)',
            color: 'var(--text)',
            lineHeight: '1.1',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, var(--text) 0%, var(--primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            The project management tool your team will actually use
          </h1>
          
          <p className="hero-subtitle" style={{ 
            fontSize: '1.25rem', 
            color: 'var(--text-secondary)', 
            lineHeight: '1.7',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Task tracking, time management, analytics, and integrations — all in one place. No complicated setup, no steep learning curve.
          </p>
          
          <div className="hero-buttons" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg pulse-glow" style={{ 
              padding: '14px 28px', 
              fontSize: '1rem',
              borderRadius: '12px'
            }}>
              Start Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg" style={{ 
              padding: '14px 28px', 
              fontSize: '1rem',
              borderRadius: '12px'
            }}>
              View Demo
            </Link>
          </div>
        </div>

        {/* Hero Image/Preview */}
        <div className="hero-image" style={{ 
          maxWidth: '1000px', 
          margin: '60px auto 0',
          background: 'var(--surface)',
          borderRadius: '20px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.15)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          aspectRatio: '16/9',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ 
            height: '100%', 
            background: 'linear-gradient(135deg, var(--primary-light) 0%, rgba(6, 182, 212, 0.15) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative kanban preview */}
            <div style={{ display: 'flex', gap: '16px', padding: '24px' }}>
              {['To Do', 'In Progress', 'Done'].map((col, i) => (
                <div key={col} style={{
                  width: '200px',
                  background: 'var(--surface)',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                }}>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: 'var(--text)',
                    marginBottom: '12px',
                    padding: '8px 12px',
                    background: i === 0 ? 'var(--primary-light)' : i === 1 ? 'rgba(6, 182, 212, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '8px'
                  }}>{col}</div>
                  {[1, 2, 3].slice(0, 3-i).map((task) => (
                    <div key={task} style={{
                      height: '40px',
                      background: 'var(--bg)',
                      borderRadius: '8px',
                      marginBottom: '8px'
                    }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section data-section="stats" style={{ 
        padding: '60px 48px', 
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ 
          maxWidth: '1000px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '32px',
          textAlign: 'center'
        }}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`stat-item stagger-${index + 1} ${visibleSections.has('stats') ? 'visible' : ''}`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: '800', 
                fontFamily: 'var(--font-heading)',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '8px'
              }}>{stat.value}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section data-section="features" style={{ padding: '100px 48px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className={`animate-on-scroll ${visibleSections.has('features') ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
              fontWeight: '700', 
              fontFamily: 'var(--font-heading)', 
              marginBottom: '16px'
            }}>
              Everything you need to ship faster
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
              From small teams to enterprises, Orbit scales with you. All the features you need, none of the complexity.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px' 
          }}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card animate-on-scroll ${visibleSections.has('features') ? 'visible' : ''} stagger-${index + 1}`}
                style={{ 
                  background: 'var(--surface)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  padding: '32px',
                  cursor: 'pointer'
                }}
              >
                <div className="feature-icon" style={{ 
                  width: '56px', 
                  height: '56px', 
                  background: 'var(--primary-light)',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <feature.icon size={28} style={{ color: 'var(--primary)' }} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '12px', color: 'var(--text)' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section data-section="pricing" style={{ padding: '100px 48px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div className={`animate-on-scroll ${visibleSections.has('pricing') ? 'visible' : ''}`}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
              fontWeight: '700', 
              fontFamily: 'var(--font-heading)', 
              marginBottom: '16px'
            }}>
              Simple, transparent pricing
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '48px' }}>
              Start free, upgrade when you're ready to scale.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', textAlign: 'left' }}>
            {/* Free */}
            <div className={`pricing-card animate-on-scroll ${visibleSections.has('pricing') ? 'visible' : ''} stagger-1`} style={{ 
              background: 'var(--surface)',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              padding: '32px',
              position: 'relative'
            }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Free</h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text)', marginBottom: '24px' }}>$0<span style={{ fontSize: '1.25rem', fontWeight: '400', color: 'var(--text-muted)' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', marginBottom: '32px' }}>
                {['1 project', '3 team members', 'Basic Kanban', '5GB storage'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      background: 'rgba(16, 185, 129, 0.15)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={12} style={{ color: '#10b981' }} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '14px' }}>Get Started</button>
            </div>

            {/* Pro */}
            <div className={`pricing-card animate-on-scroll ${visibleSections.has('pricing') ? 'visible' : ''} stagger-2`} style={{ 
              background: 'var(--surface)',
              borderRadius: '20px',
              border: '2px solid var(--primary)',
              padding: '32px',
              position: 'relative',
              transform: 'scale(1.02)'
            }}>
              <div style={{ 
                position: 'absolute', 
                top: '-14px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                color: 'white',
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap'
              }}>Most Popular</div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Pro</h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text)', marginBottom: '24px' }}>$19<span style={{ fontSize: '1.25rem', fontWeight: '400', color: 'var(--text-muted)' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', marginBottom: '32px' }}>
                {['Unlimited projects', 'Unlimited members', 'Time tracking', 'Analytics dashboard', 'Slack + GitHub', '50GB storage'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      background: 'rgba(16, 185, 129, 0.15)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={12} style={{ color: '#10b981' }} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>Start Pro Trial</button>
            </div>

            {/* Enterprise */}
            <div className={`pricing-card animate-on-scroll ${visibleSections.has('pricing') ? 'visible' : ''} stagger-3`} style={{ 
              background: 'var(--surface)',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              padding: '32px',
              position: 'relative'
            }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Enterprise</h3>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text)', marginBottom: '24px' }}>$49<span style={{ fontSize: '1.25rem', fontWeight: '400', color: 'var(--text-muted)' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', marginBottom: '32px' }}>
                {['Everything in Pro', 'Automation rules', 'Guest portals', 'Priority support', '200GB storage', 'SSO (coming)'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                    <div style={{ 
                      width: '20px', 
                      height: '20px', 
                      background: 'rgba(16, 185, 129, 0.15)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Check size={12} style={{ color: '#10b981' }} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '14px' }}>Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section data-section="testimonials" style={{ padding: '100px 48px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className={`animate-on-scroll ${visibleSections.has('testimonials') ? 'visible' : ''}`}>
            <h2 style={{ 
              fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
              fontWeight: '700', 
              fontFamily: 'var(--font-heading)', 
              textAlign: 'center', 
              marginBottom: '48px'
            }}>
              Loved by teams everywhere
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {testimonials.map((t, i) => (
              <div 
                key={i} 
                className={`testimonial-card animate-on-scroll ${visibleSections.has('testimonials') ? 'visible' : ''} stagger-${i + 1}`}
                style={{ 
                  background: 'var(--surface)',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  padding: '32px'
                }}
              >
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '1.125rem'
                  }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '0.9375rem', color: 'var(--text)' }}>{t.name}</p>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" style={{ 
        padding: '100px 48px', 
        textAlign: 'center'
      }}>
        <div className="animate-on-scroll" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
            fontWeight: '700', 
            fontFamily: 'var(--font-heading)', 
            color: 'white',
            marginBottom: '20px' 
          }}>
            Ready to streamline your workflow?
          </h2>
          <p style={{ 
            color: 'rgba(255,255,255,0.85)', 
            fontSize: '1.125rem',
            marginBottom: '40px' 
          }}>
            Join thousands of teams using Orbit to ship faster.
          </p>
          <Link to="/register" className="cta-button" style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'white', 
            color: 'var(--primary)',
            fontWeight: '600',
            padding: '16px 32px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '1rem'
          }}>
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '48px 48px', 
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.125rem', color: 'var(--text)' }}>Orbit</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', width: '100%' }}>
              © 2024 Orbit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;