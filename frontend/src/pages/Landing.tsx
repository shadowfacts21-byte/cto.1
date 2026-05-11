import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  Zap, 
  Share2, 
  Shield, 
  ArrowRight, 
  Layout,
  Menu,
  X,
  Plus
} from 'lucide-react';

const Landing: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: 'Kanban Task Board',
      description: 'Organize your work visually with our intuitive drag-and-drop Kanban board.',
      icon: <Layout className="w-6 h-6 text-primary" />,
      delay: 'delay-100'
    },
    {
      title: 'Time Tracking',
      description: 'Track time spent on tasks with built-in timers and generate detailed reports.',
      icon: <Clock className="w-6 h-6 text-primary" />,
      delay: 'delay-200'
    },
    {
      title: 'Powerful Analytics',
      description: 'Gain insights into team productivity with burndown charts and velocity metrics.',
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
      delay: 'delay-300'
    },
    {
      title: 'Workflow Automations',
      description: 'Automate repetitive tasks with simple trigger-based rules to save time.',
      icon: <Zap className="w-6 h-6 text-primary" />,
      delay: 'delay-400'
    },
    {
      title: 'Third-party Integrations',
      description: 'Connect with Slack and GitHub to keep your team synced across platforms.',
      icon: <Share2 className="w-6 h-6 text-primary" />,
      delay: 'delay-500'
    },
    {
      title: 'Guest Portals',
      description: 'Share progress with clients through secure, read-only guest access links.',
      icon: <Shield className="w-6 h-6 text-primary" />,
      delay: 'delay-500'
    }
  ];

  const pricing = [
    {
      name: 'Free',
      price: '0',
      description: 'Perfect for individuals and small side projects.',
      features: ['Up to 3 projects', 'Basic task management', 'Limited members', 'Community support'],
      popular: false
    },
    {
      name: 'Pro',
      price: '19',
      description: 'Ideal for growing teams that need more power.',
      features: ['Unlimited projects', 'Time tracking & reports', 'Advanced analytics', 'Slack & GitHub integrations', 'Priority support'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '49',
      description: 'For large organizations with complex needs.',
      features: ['Everything in Pro', 'Custom automations', 'Dedicated account manager', 'SAML & SSO', 'Custom contracts'],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-3 shadow-soft' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-primary p-1.5 rounded-xl text-white shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                <CheckCircle2 size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">CollabFlow</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">Pricing</a>
              <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">Log in</Link>
              <Link to="/register" className="btn-primary py-2 px-6">
                Get Started
              </Link>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 dark:text-slate-400 p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden glass border-b border-slate-100 dark:border-slate-800 py-6 px-4 space-y-4 shadow-xl animate-slide-up">
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-slate-600 dark:text-slate-400">Features</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="block text-base font-medium text-slate-600 dark:text-slate-400">Pricing</a>
            <Link to="/login" className="block text-base font-medium text-slate-600 dark:text-slate-400">Log in</Link>
            <Link to="/register" className="btn-primary w-full text-center">
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-mesh grain-overlay">
        <div className="max-w-7xl mx-auto relative">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>

          <div className="text-center max-w-4xl mx-auto space-y-10 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              v2.0 is now live — More power, same simplicity
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05] animate-slide-up">
              The project tool your team will <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">actually use</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto animate-slide-up delay-100">
              Task tracking, time management, analytics, and integrations — all in one unified workspace. 
              Designed for clarity, built for speed.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 animate-slide-up delay-200">
              <Link to="/register" className="btn-primary py-4 px-10 text-lg group">
                Start your free trial 
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="btn-secondary py-4 px-10 text-lg shadow-soft">
                View Live Demo
              </Link>
            </div>

            <div className="pt-20 animate-slide-up delay-300">
              <div className="relative mx-auto max-w-6xl rounded-3xl border border-white/20 bg-white/5 p-2 shadow-2xl backdrop-blur-sm card-3d">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl -z-10 blur-xl opacity-50"></div>
                <img 
                  src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                  alt="CollabFlow Dashboard" 
                  className="rounded-2xl w-full h-auto shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 border-y border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-10">Trusted by modern teams worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale dark:invert transition-all hover:grayscale-0">
            <span className="text-3xl font-black italic tracking-tighter">TECHCORP</span>
            <span className="text-3xl font-black italic tracking-tighter">VELOCITY</span>
            <span className="text-3xl font-black italic tracking-tighter">ACME</span>
            <span className="text-3xl font-black italic tracking-tighter">STELLAR</span>
            <span className="text-3xl font-black italic tracking-tighter">GLOBAL</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm">Everything you need</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">Stop juggling multiple tools. Work in one space.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, idx) => (
              <div key={idx} className={`p-8 card hover-lift group animate-slide-up ${feature.delay}`}>
                <div className="mb-6 p-4 rounded-2xl bg-primary/5 w-fit group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-soft">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-3 dark:text-white group-hover:text-primary transition-colors">{feature.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 grain-overlay"></div>
        <div className="max-w-5xl mx-auto px-4 text-center text-white relative z-10 space-y-12">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md">
            <Plus className="text-accent animate-spin-slow" />
          </div>
          <p className="text-4xl md:text-5xl font-medium leading-[1.2] tracking-tight">
            "We switched to CollabFlow from a much more expensive tool and our team velocity increased by 30%. The interface is so clean, everyone just gets it."
          </p>
          <div className="flex flex-col items-center gap-5">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Alex Rivera" 
              className="w-20 h-20 rounded-2xl border-4 border-white/20 shadow-2xl"
            />
            <div className="space-y-1">
              <p className="font-bold text-xl uppercase tracking-wide">Alex Rivera</p>
              <p className="text-primary-100 text-sm font-medium opacity-80 uppercase tracking-[0.2em]">CTO, TechGrowth Labs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm">Pricing</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">Simple, transparent plans for every team.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {pricing.map((plan, idx) => (
              <div key={idx} className={`relative p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border transition-all duration-300 ${plan.popular ? 'border-primary shadow-lift scale-105 z-10' : 'border-slate-200 dark:border-slate-800 shadow-soft'}`}>
                {plan.popular && (
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-primary/30">
                    Most Popular
                  </span>
                )}
                <h4 className="text-2xl font-bold mb-2 dark:text-white">{plan.name}</h4>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-black text-slate-900 dark:text-white">${plan.price}</span>
                  <span className="text-slate-500 font-medium">/mo</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 leading-relaxed">{plan.description}</p>
                <Link to="/register" className={`block w-full text-center py-4 rounded-2xl font-bold transition-all mb-10 ${plan.popular ? 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                  Get Started Now
                </Link>
                <ul className="space-y-5">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <div className="bg-primary/10 p-1 rounded-lg">
                        <CheckCircle2 size={16} className="text-primary shrink-0" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-slate-950 dark:bg-slate-900 rounded-[3rem] p-16 md:p-24 relative overflow-hidden text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] opacity-20 -mr-64 -mt-64"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent rounded-full blur-[120px] opacity-20 -ml-64 -mb-64"></div>
          
          <div className="relative z-10 space-y-10">
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">Ready to transform how <br/> your team works?</h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
              Join 5,000+ high-performing teams who are building better products faster with CollabFlow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link to="/register" className="btn-primary py-5 px-12 text-xl shadow-lg shadow-primary/40 group">
                Start your 14-day free trial
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">No credit card required. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-20">
          <div className="col-span-2 lg:col-span-2 space-y-8">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1 rounded-lg text-white">
                <CheckCircle2 size={20} />
              </div>
              <span className="text-2xl font-bold tracking-tight dark:text-white">CollabFlow</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-lg leading-relaxed">
              The modern collaboration platform for teams who value speed, clarity, and results.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-sm mb-8 uppercase tracking-[0.2em] text-slate-400">Product</h5>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-sm mb-8 uppercase tracking-[0.2em] text-slate-400">Company</h5>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-sm mb-8 uppercase tracking-[0.2em] text-slate-400">Support</h5>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-400">
          <p>© 2024 CollabFlow Inc. All rights reserved. Crafted with precision.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
