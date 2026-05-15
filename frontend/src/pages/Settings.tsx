import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Check, Zap, Crown, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'billing' | 'integrations' | 'notifications' | 'security' | 'appearance'>('profile');
  
  // State
  const [profileName, setProfileName] = useState(user?.name || 'User');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 500);
  };

  const plans = [
    { id: 'free', name: 'Free', price: 0, features: ['3 Projects', '5 Team Members', 'Basic Analytics', '1GB Storage'] },
    { id: 'pro', name: 'Pro', price: 29, features: ['Unlimited Projects', '20 Team Members', 'Advanced Analytics', '50GB Storage', 'Priority Support', 'Custom Integrations'], popular: true },
    { id: 'enterprise', name: 'Enterprise', price: 99, features: ['Unlimited Everything', 'SSO/SAML', 'Dedicated Support', 'Custom SLA', '500GB Storage'] },
  ];

  const currentPlan: string = 'pro'; // Mock current plan

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Profile Information</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '16px',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '1.75rem', fontWeight: '700'
                }}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p style={{ fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>{user?.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.email}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button onClick={handleSave} className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? 'Saving...' : showSuccess ? <><Check size={16} /> Saved!</> : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subscription Plan</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {plans.map((plan) => (
                  <div key={plan.id} style={{
                    padding: '20px', borderRadius: '12px', border: '2px solid',
                    borderColor: currentPlan === plan.id ? 'var(--primary)' : 'var(--border)',
                    background: currentPlan === plan.id ? 'var(--primary-light)' : 'var(--surface)',
                    position: 'relative'
                  }}>
                    {plan.popular && (
                      <div style={{
                        position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                        background: 'var(--primary)', color: 'white', padding: '4px 12px',
                        borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', whiteSpace: 'nowrap'
                      }}>
                        Current Plan
                      </div>
                    )}
                    <h4 style={{ fontWeight: '700', color: 'var(--text)', marginBottom: '8px' }}>{plan.name}</h4>
                    <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)', marginBottom: '16px' }}>
                      ${plan.price}<span style={{ fontSize: '0.875rem', fontWeight: '400', color: 'var(--text-muted)' }}>/mo</span>
                    </p>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                      {plan.features.map((f, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <Check size={14} style={{ color: 'var(--accent)' }} /> {f}
                        </li>
                      ))}
                    </ul>
                    <button 
                      className={currentPlan === plan.id ? 'btn btn-secondary' : 'btn btn-primary'}
                      style={{ width: '100%' }}
                      disabled={currentPlan === plan.id}
                    >
                      {currentPlan === plan.id ? 'Current' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Usage This Month</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {[
                  { label: 'Projects', value: '5', max: 'Unlimited', icon: '📁' },
                  { label: 'Team Members', value: '3', max: '20', icon: '👥' },
                  { label: 'Storage', value: '2.5 GB', max: '50 GB', icon: '💾' },
                  { label: 'API Calls', value: '12.4K', max: '100K', icon: '⚡' },
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: 'center', padding: '16px', background: 'var(--bg)', borderRadius: '12px' }}>
                    <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                    <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text)', marginTop: '8px' }}>{stat.value}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.max}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Connected Apps</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { name: 'GitHub', desc: 'Link commits to tasks', icon: '🐙', connected: true, tier: 'pro' },
                  { name: 'Slack', desc: 'Get notifications in Slack', icon: '💬', connected: false, tier: 'pro' },
                  { name: 'Google Drive', desc: 'Attach files from Drive', icon: '📁', connected: false, tier: 'pro' },
                  { name: 'Notion', desc: 'Sync docs with Notion', icon: '📓', connected: false, tier: 'enterprise' },
                ].map((app, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px', background: 'var(--bg)', borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{app.icon}</span>
                      <div>
                        <p style={{ fontWeight: '600', color: 'var(--text)', marginBottom: '2px' }}>{app.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.desc}</p>
                      </div>
                    </div>
                    {app.tier !== 'free' && currentPlan !== 'pro' && currentPlan !== 'enterprise' ? (
                      <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Lock size={14} /> Upgrade
                      </button>
                    ) : (
                      <button className={app.connected ? 'btn btn-secondary' : 'btn btn-primary'}>
                        {app.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notification Preferences</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Email notifications', desc: 'Receive all updates via email', enabled: true },
                { label: 'Task assigned', desc: 'When a task is assigned to you', enabled: true },
                { label: 'Task completed', desc: 'When a task you own is done', enabled: true },
                { label: 'Weekly digest', desc: 'Summary of your projects', enabled: false },
                { label: 'Mentions', desc: 'When someone @mentions you', enabled: true },
                { label: 'Due date reminders', desc: '1 day before deadline', enabled: true },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none' }}>
                  <div>
                    <p style={{ fontWeight: '500', color: 'var(--text)' }}>{item.label}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                  </div>
                  <button
                    style={{
                      width: '44px', height: '24px', borderRadius: '12px', position: 'relative',
                      background: item.enabled ? 'var(--primary)' : 'var(--border)', border: 'none', cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                      position: 'absolute', top: '2px',
                      left: item.enabled ? '22px' : '2px',
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-input" placeholder="Enter current password" />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" placeholder="Enter new password" />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-input" placeholder="Confirm new password" />
                </div>
                <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Update Password</button>
              </div>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontWeight: '600', color: 'var(--text)', marginBottom: '4px' }}>Two-Factor Authentication</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Add extra security to your account</p>
                </div>
                <button className="btn btn-secondary">Enable 2FA</button>
              </div>
            </div>

            <div className="card" style={{ padding: '24px', border: '1px solid var(--error)', background: 'var(--error-light)' }}>
              <h3 style={{ fontWeight: '600', color: 'var(--error)', marginBottom: '8px' }}>Danger Zone</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Sign out of all other sessions. This won't affect your current device.</p>
              <button className="btn" style={{ background: 'var(--error)', color: 'white', border: 'none' }}>Sign Out All Sessions</button>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Theme</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { id: 'light', label: 'Light', icon: '☀️', color: '#F8FAFC' },
                  { id: 'dark', label: 'Dark', icon: '🌙', color: '#1E293B' },
                  { id: 'system', label: 'System', icon: '💻', color: 'linear-gradient(135deg, #fff 50%, #1E293B 50%)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    style={{
                      flex: 1, padding: '20px', borderRadius: '12px', border: '2px solid var(--border)',
                      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                      background: 'var(--surface)'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{t.icon}</div>
                    <p style={{ fontWeight: '600', color: 'var(--text)' }}>{t.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing', icon: Crown },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ] as const;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)', marginBottom: '24px' }}>Settings</h1>

      <div style={{
        display: 'flex', gap: '4px', padding: '6px', background: 'var(--surface)',
        borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--border)',
        overflowX: 'auto'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
              borderRadius: '8px', fontSize: '0.8rem', fontWeight: '500', border: 'none',
              cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
              background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
};

export default Settings;