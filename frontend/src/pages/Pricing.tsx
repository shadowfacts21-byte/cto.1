import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, CheckCircle2, HelpCircle, ArrowRight, Minus } from 'lucide-react';

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const plans = [
    {
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Ideal for small personal projects.',
      features: ['1 project', '3 team members', 'Basic kanban board', '5GB storage'],
      notIncluded: ['Time tracking', 'Analytics dashboard', 'Integrations', 'Automation rules', 'Guest portals'],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      monthlyPrice: 19,
      annualPrice: 15,
      description: 'Perfect for growing professional teams.',
      features: ['Unlimited projects', 'Unlimited team members', 'Time tracking', 'Analytics dashboard', 'Slack + GitHub integrations', '50GB storage', 'Email support'],
      notIncluded: ['Automation rules', 'Guest portals'],
      cta: 'Try Pro for Free',
      popular: true
    },
    {
      name: 'Enterprise',
      monthlyPrice: 49,
      annualPrice: 39,
      description: 'Advanced features for large organizations.',
      features: ['Everything in Pro', 'Automation rules', 'Guest client portals', 'Priority support', '200GB storage', 'SSO (Coming soon)', 'Dedicated success manager'],
      notIncluded: [],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const faq = [
    {
      q: 'Can I change plans later?',
      a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
    },
    {
      q: 'Do you offer a free trial?',
      a: 'We offer a 14-day free trial of the Pro plan. No credit card is required to start.'
    },
    {
      q: 'Is there a discount for non-profits?',
      a: 'Yes! We offer a 50% discount for registered non-profits and educational institutions.'
    },
    {
      q: 'How secure is my data?',
      a: 'We use industry-standard AES-256 encryption and regular third-party security audits to ensure your data is always safe.'
    }
  ];

  const featuresList = [
    { category: 'General', items: ['Projects', 'Team members', 'Storage'] },
    { category: 'Task Management', items: ['Kanban Board', 'Custom Fields', 'Dependencies'] },
    { category: 'Advanced', items: ['Time Tracking', 'Analytics', 'Automations', 'Guest Portals'] },
    { category: 'Integrations', items: ['Slack', 'GitHub', 'Google Drive'] },
    { category: 'Support', items: ['Email Support', 'Priority Support', 'SSO'] }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <nav className="glass border-b border-slate-100 dark:border-slate-800 py-4 px-6 sticky top-0 z-50 shadow-soft">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-1 rounded-lg text-white group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-xl font-black tracking-tight dark:text-white">CollabFlow</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/#features" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Features</Link>
            <Link to="/pricing" className="text-sm font-bold text-primary">Pricing</Link>
            <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">Log in</Link>
            <Link to="/register" className="btn-primary py-2 px-6">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="py-24 px-6 bg-mesh grain-overlay">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight animate-slide-up">Simple, predictable <br/> productivity.</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto animate-slide-up delay-100">Choose the plan that scales with your ambition. Save 20% with annual commitments.</p>
          
          <div className="flex items-center justify-center gap-6 pt-6 animate-slide-up delay-200">
            <span className={`text-sm font-black uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded-full relative p-1.5 transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-950 outline-none"
            >
              <div className={`w-5 h-5 bg-white dark:bg-primary rounded-full shadow-lg transform transition-transform duration-300 ${billingCycle === 'annual' ? 'translate-x-8' : ''}`}></div>
            </button>
            <span className={`text-sm font-black uppercase tracking-widest ${billingCycle === 'annual' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              Annual <span className="text-primary ml-1">(-20%)</span>
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-10">
          {plans.map((plan, idx) => (
            <div key={idx} className={`relative p-10 rounded-[3rem] border flex flex-col transition-all duration-500 animate-slide-up delay-${(idx + 1) * 100} ${plan.popular ? 'border-primary bg-white dark:bg-slate-900 shadow-lift scale-105 z-10' : 'border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-soft'}`}>
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/30">
                  Most Popular
                </div>
              )}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2">{plan.description}</p>
              </div>
              
              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-6xl font-black text-slate-900 dark:text-white transition-all duration-300">${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}</span>
                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">/ month</span>
              </div>

              <Link 
                to="/register" 
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-center mb-10 transition-all ${plan.popular ? 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                {plan.cta}
              </Link>

              <div className="space-y-5 flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Strategic Assets:</p>
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-4 group">
                    <div className="bg-primary/10 p-1 rounded-lg group-hover:scale-110 transition-transform">
                      <Check size={16} className="text-primary shrink-0" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-4 opacity-30">
                    <Minus size={16} className="text-slate-400 shrink-0" />
                    <span className="text-sm font-medium text-slate-500">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-32 px-6 border-y border-slate-100 dark:border-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-primary font-black uppercase tracking-[0.2em] text-xs">Deep Dive</h2>
            <h3 className="text-4xl font-extrabold dark:text-white tracking-tight">Comprehensive capabilities.</h3>
          </div>
          
          <div className="card overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50">
                  <th className="py-6 px-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Feature Matrix</th>
                  <th className="py-6 px-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Free</th>
                  <th className="py-6 px-8 font-black uppercase tracking-widest text-[10px] text-primary">Pro</th>
                  <th className="py-6 px-8 font-black uppercase tracking-widest text-[10px] text-slate-400">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {featuresList.map((category, cIdx) => (
                  <React.Fragment key={cIdx}>
                    <tr className="bg-slate-50/30 dark:bg-slate-900/20">
                      <td colSpan={4} className="py-4 px-8 text-[10px] font-black text-primary uppercase tracking-[0.2em]">{category.category}</td>
                    </tr>
                    {category.items.map((item, iIdx) => (
                      <tr key={iIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-5 px-8 text-sm font-bold text-slate-700 dark:text-slate-300">{item}</td>
                        <td className="py-5 px-8 text-sm text-slate-600">
                          {['Projects', 'Team members', 'Storage'].includes(item) ? (item === 'Projects' ? '1' : item === 'Team members' ? '3' : '5GB') : (['Kanban Board'].includes(item) ? <Check size={18} className="text-slate-400" /> : <Minus size={18} className="opacity-10"/>)}
                        </td>
                        <td className="py-5 px-8 text-sm text-slate-600 font-bold">
                          {['Projects', 'Team members', 'Storage'].includes(item) ? (item === 'Projects' ? 'Unlimited' : item === 'Team members' ? 'Unlimited' : '50GB') : (['Automation rules', 'Guest Portals', 'SSO'].includes(item) ? <Minus size={18} className="opacity-10"/> : <Check size={18} className="text-primary" />)}
                        </td>
                        <td className="py-5 px-8 text-sm text-slate-600">
                        {['Projects', 'Team members', 'Storage'].includes(item) ? (item === 'Projects' ? 'Unlimited' : item === 'Team members' ? 'Unlimited' : '200GB') : <Check size={18} className="text-slate-400" />}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-20 dark:text-white tracking-tight">Questions & Clarity</h2>
          <div className="space-y-12">
            {faq.map((item, idx) => (
              <div key={idx} className="space-y-3 group animate-slide-up">
                <h4 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-4">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:rotate-12 transition-transform">
                    <HelpCircle size={18} />
                  </div>
                  {item.q}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed ml-12 font-medium">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto bg-primary rounded-[4rem] p-16 md:p-24 text-center text-white space-y-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 grain-overlay"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[120px] opacity-10 -ml-32 -mt-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-[120px] opacity-20 -mr-32 -mb-32"></div>
          
          <div className="relative z-10">
            <h2 className="text-5xl font-black tracking-tight leading-tight">Ignite your team's velocity.</h2>
            <p className="text-primary-100 text-xl max-w-2xl mx-auto font-medium mt-6">Join 5,000+ teams who have already reclaimed their time with CollabFlow.</p>
            <div className="flex justify-center mt-12">
              <Link to="/register" className="bg-white text-primary px-12 py-5 rounded-full text-xl font-black uppercase tracking-widest hover:bg-primary-50 transition-all flex items-center gap-3 shadow-xl group">
                Scale Now <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 dark:border-slate-900 text-center">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">© 2024 CollabFlow Inc. Optimized for efficiency.</p>
      </footer>
    </div>
  );
};

export default Pricing;
