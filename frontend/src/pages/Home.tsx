import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Zap, Shield, Clock, Users, GitBranch, BarChart3 } from 'lucide-react';

const Home: React.FC = () => {
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Navbar */}
      <header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Sign In</Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ 
        padding: '80px 48px', 
        textAlign: 'center',
        background: 'linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="badge badge-accent" style={{ marginBottom: '24px', display: 'inline-flex' }}>
            New: Automation Rules & Guest Portals
          </div>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            fontFamily: 'var(--font-heading)',
            color: 'var(--text)',
            lineHeight: '1.2',
            marginBottom: '24px'
          }}>
            The project management tool your team will actually use
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--text-secondary)', 
            lineHeight: '1.7',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            Task tracking, time management, analytics, and integrations — all in one place. No complicated setup, no steep learning curve.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              View Demo
            </Link>
          </div>
        </div>

        {/* Hero Image/Preview */}
        <div style={{ 
          maxWidth: '1000px', 
          margin: '60px auto 0',
          background: 'var(--surface)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          aspectRatio: '16/9'
        }}>
          <div style={{ 
            height: '100%', 
            background: 'linear-gradient(135deg, var(--primary-light) 0%, rgba(6, 182, 212, 0.2) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>App Preview — Kanban Board</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 48px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
              Everything you need to ship faster
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              From small teams to enterprises, Orbit scales with you. All the features you need, none of the complexity.
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px' 
          }}>
            {features.map((feature, index) => (
              <div key={index} className="card" style={{ padding: '28px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  background: 'var(--primary-light)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <feature.icon size={24} style={{ color: 'var(--primary)' }} />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text)' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '80px 48px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
            Simple, transparent pricing
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '48px' }}>
            Start free, upgrade when you're ready to scale.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', textAlign: 'left' }}>
            {/* Free */}
            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Free</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text)', marginBottom: '24px' }}>$0<span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-muted)' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
                {['1 project', '3 team members', 'Basic Kanban', '5GB storage'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <Check size={16} style={{ color: 'var(--success)' }} /> {item}
                  </li>
                ))}
              </ul>
              <button className="btn btn-secondary w-full">Get Started</button>
            </div>

            {/* Pro */}
            <div className="card" style={{ padding: '32px', border: '2px solid var(--primary)', position: 'relative' }}>
              <div style={{ 
                position: 'absolute', 
                top: '-12px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                background: 'var(--primary)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>Most Popular</div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Pro</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text)', marginBottom: '24px' }}>$19<span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-muted)' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
                {['Unlimited projects', 'Unlimited members', 'Time tracking', 'Analytics dashboard', 'Slack + GitHub', '50GB storage'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <Check size={16} style={{ color: 'var(--success)' }} /> {item}
                  </li>
                ))}
              </ul>
              <button className="btn btn-primary w-full">Start Pro Trial</button>
            </div>

            {/* Enterprise */}
            <div className="card" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Enterprise</h3>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text)', marginBottom: '24px' }}>$49<span style={{ fontSize: '1rem', fontWeight: '400', color: 'var(--text-muted)' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', marginBottom: '24px' }}>
                {['Everything in Pro', 'Automation rules', 'Guest portals', 'Priority support', '200GB storage', 'SSO (coming)'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <Check size={16} style={{ color: 'var(--success)' }} /> {item}
                  </li>
                ))}
              </ul>
              <button className="btn btn-secondary w-full">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 48px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'var(--font-heading)', textAlign: 'center', marginBottom: '48px' }}>
            Loved by teams everywhere
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card" style={{ padding: '28px' }}>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '20px', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text)' }}>{t.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        padding: '80px 48px', 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          fontFamily: 'var(--font-heading)', 
          color: 'white',
          marginBottom: '16px' 
        }}>
          Ready to streamline your workflow?
        </h2>
        <p style={{ 
          color: 'rgba(255,255,255,0.85)', 
          fontSize: '1rem',
          marginBottom: '32px' 
        }}>
          Join thousands of teams using Orbit to ship faster.
        </p>
        <Link to="/register" className="btn btn-lg" style={{ 
          background: 'white', 
          color: 'var(--primary)',
          fontWeight: '600'
        }}>
          Get Started Free <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: '32px 48px', 
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ 
            width: '24px', 
            height: '24px', 
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '700', color: 'var(--text)' }}>Orbit</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          © 2024 Orbit. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;