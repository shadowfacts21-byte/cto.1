import React, { useState, useEffect } from 'react';
import { User, Building, Bell, Shield, Key, Palette, Globe, Mail, Check, X, Eye, EyeOff, Zap, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { billingService, integrationService, type Plan, type UsageStats, type Integration } from '../services/billingIntegrationService';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'notifications' | 'security' | 'appearance'>('profile');
  
  // Profile state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  
  // Organization state  
  const [orgName, setOrgName] = useState('My Organization');
  const [orgSaveSuccess, setOrgSaveSuccess] = useState(false);
  
  // Billing state
  const [plan, setPlan] = useState<Plan | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  // Notifications state
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [taskAssigned, setTaskAssigned] = useState(true);
  const [taskCompleted, setTaskCompleted] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  
  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  
  // Appearance state
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  
  // Integrations state
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    loadBillingData();
    loadIntegrations();
  }, []);

  const loadBillingData = async () => {
    try {
      const [planData, usageData] = await Promise.all([
        billingService.getCurrentPlan(),
        billingService.getUsageStats()
      ]);
      setPlan(planData);
      setUsage(usageData);
    } catch (error) {
      console.error('Failed to load billing data:', error);
    }
  };

  const loadIntegrations = async () => {
    try {
      const data = await integrationService.getIntegrations();
      setIntegrations(data);
    } catch (error) {
      console.error('Failed to load integrations:', error);
    }
  };

  const handleProfileSave = () => {
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  const handleOrgSave = () => {
    setOrgSaveSuccess(true);
    setTimeout(() => setOrgSaveSuccess(false), 3000);
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const result = await billingService.upgradePlan('pro');
      if (result.success && result.url) {
        window.open(result.url, '_blank');
      } else {
        alert('Upgrade feature coming soon! Configure Stripe in backend to enable payments.');
      }
    } catch (error) {
      alert('Upgrade feature coming soon!');
    } finally {
      setIsUpgrading(false);
    }
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    setPasswordError('');
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleToggleIntegration = async (id: string) => {
    const integration = integrations.find(i => i.id === id);
    if (integration) {
      await integrationService.toggleIntegration(id, !integration.enabled);
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i));
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ] as const;

  const ToggleButton: React.FC<{ enabled: boolean; onClick: () => void }> = ({ enabled, onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: '48px', height: '26px', borderRadius: '13px', position: 'relative',
        background: enabled ? 'var(--primary)' : 'var(--border)',
        border: 'none', cursor: 'pointer', transition: 'all 0.2s'
      }}
    >
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%', background: 'white',
        position: 'absolute', top: '2px',
        left: enabled ? '24px' : '2px',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
      }} />
    </button>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>Profile Information</h3>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '1.75rem', fontWeight: '700', flexShrink: 0
                }}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="form-input"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="form-input"
                      placeholder="your@email.com"
                    />
                  </div>
                  <button onClick={handleProfileSave} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                    {profileSaveSuccess ? <><Check size={16} /> Saved!</> : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'organization':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>Organization Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Organization Name</label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="form-input"
                    placeholder="Your organization name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Organization URL</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>orbit.app/</span>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="your-org"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
                <button onClick={handleOrgSave} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                  {orgSaveSuccess ? <><Check size={16} /> Saved!</> : 'Update Organization'}
                </button>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={18} /> Current Plan
              </h3>
              {plan ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text)' }}>{plan.name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{plan.price === 0 ? 'Free' : `$${plan.price}/${plan.interval}`}</p>
                    </div>
                    {plan.id !== 'enterprise' && (
                      <button onClick={handleUpgrade} className="btn btn-primary" disabled={isUpgrading}>
                        {isUpgrading ? 'Processing...' : 'Upgrade'}
                      </button>
                    )}
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {plan.features.map((feature, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <Check size={16} style={{ color: 'var(--accent)' }} /> {feature}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>Loading plan info...</p>
              )}
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>Usage</h3>
              {usage ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>Projects</p>
                    <div style={{ background: 'var(--bg)', borderRadius: '6px', height: '6px', marginBottom: '8px' }}>
                      <div style={{ 
                        width: usage.projectsLimit === -1 ? '25%' : `${Math.min((usage.projects / usage.projectsLimit) * 100, 100)}%`, 
                        height: '100%', background: 'var(--primary)', borderRadius: '6px' 
                      }} />
                    </div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                      {usage.projects} {usage.projectsLimit === -1 ? '' : `/ ${usage.projectsLimit}`}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>Members</p>
                    <div style={{ background: 'var(--bg)', borderRadius: '6px', height: '6px', marginBottom: '8px' }}>
                      <div style={{ 
                        width: usage.membersLimit === -1 ? '15%' : `${Math.min((usage.members / usage.membersLimit) * 100, 100)}%`, 
                        height: '100%', background: 'var(--accent)', borderRadius: '6px' 
                      }} />
                    </div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                      {usage.members} {usage.membersLimit === -1 ? '' : `/ ${usage.membersLimit}`}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>Storage</p>
                    <div style={{ background: 'var(--bg)', borderRadius: '6px', height: '6px', marginBottom: '8px' }}>
                      <div style={{ 
                        width: `${Math.min((usage.storage / usage.storageLimit) * 100, 100)}%`, 
                        height: '100%', background: 'var(--primary)', borderRadius: '6px' 
                      }} />
                    </div>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{usage.storage} / {usage.storageLimit} GB</p>
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>Loading usage...</p>
              )}
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} /> Integrations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {integrations.map((integration) => (
                  <div key={integration.id} style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '16px', background: 'var(--bg)', borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.5rem' }}>{integration.icon}</span>
                      <div>
                        <p style={{ fontWeight: '600', color: 'var(--text)', marginBottom: '2px' }}>{integration.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{integration.description}</p>
                      </div>
                    </div>
                    <ToggleButton enabled={integration.enabled} onClick={() => handleToggleIntegration(integration.id)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '20px' }}>Email Notifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Email notifications', desc: 'Receive all notifications via email', state: emailNotifs, setState: setEmailNotifs },
                  { label: 'Task assigned', desc: 'When a task is assigned to you', state: taskAssigned, setState: setTaskAssigned },
                  { label: 'Task completed', desc: 'When a task you own is completed', state: taskCompleted, setState: setTaskCompleted },
                  { label: 'Weekly digest', desc: 'Summary of your projects and tasks', state: weeklyDigest, setState: setWeeklyDigest },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                    <div>
                      <p style={{ fontWeight: '500', color: 'var(--text)', marginBottom: '2px' }}>{item.label}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                    </div>
                    <ToggleButton enabled={item.state} onClick={() => item.setState(!item.state)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '20px' }}>
                <Key size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                Change Password
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label">Current Password</label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="form-input"
                    placeholder="Enter current password"
                    style={{ paddingRight: '40px' }}
                  />
                </div>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label">New Password</label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-input"
                    placeholder="Enter new password (min 8 chars)"
                    style={{ paddingRight: '40px' }}
                  />
                </div>
                <div className="form-group" style={{ position: 'relative' }}>
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                    placeholder="Confirm new password"
                    style={{ paddingRight: '40px' }}
                  />
                </div>
                {passwordError && (
                  <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '-8px' }}>{passwordError}</p>
                )}
                {passwordSuccess && (
                  <p style={{ color: 'var(--success)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={16} /> Password changed successfully!
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button onClick={handlePasswordChange} className="btn btn-primary">
                    Update Password
                  </button>
                  <button
                    onClick={() => setShowPasswords(!showPasswords)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}
                  >
                    {showPasswords ? <><EyeOff size={16} /> Hide</> : <><Eye size={16} /> Show</>}
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>Two-Factor Authentication</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '16px' }}>
                Add an extra layer of security to your account.
              </p>
              <button className="btn btn-secondary">Enable 2FA</button>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>Active Sessions</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '16px' }}>
                You're currently signed in on this device.
              </p>
              <button className="btn btn-secondary" style={{ background: 'var(--error-light)', color: 'var(--error)', borderColor: 'var(--error)' }}>
                Sign out all other sessions
              </button>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '20px' }}>Theme</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { id: 'light', label: 'Light', icon: '☀️' },
                  { id: 'dark', label: 'Dark', icon: '🌙' },
                  { id: 'system', label: 'System', icon: '💻' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as typeof theme)}
                    style={{
                      flex: 1, padding: '16px', borderRadius: '12px', border: '2px solid',
                      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                      background: theme === t.id ? 'var(--primary-light)' : 'var(--surface)',
                      borderColor: theme === t.id ? 'var(--primary)' : 'var(--border)',
                    }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{t.icon}</div>
                    <p style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text)' }}>{t.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '16px' }}>Language & Region</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select className="form-input" defaultValue="en">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Timezone</label>
                  <select className="form-input" defaultValue="utc">
                    <option value="utc">UTC (GMT)</option>
                    <option value="est">Eastern Time</option>
                    <option value="pst">Pacific Time</option>
                    <option value="cet">Central European Time</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)', marginBottom: '24px' }}>Settings</h1>

      <div style={{
        display: 'flex', gap: '4px', padding: '4px', background: 'var(--bg)', borderRadius: '12px',
        marginBottom: '24px', overflowX: 'auto'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px',
              borderRadius: '8px', fontSize: '0.875rem', fontWeight: '500', border: 'none',
              cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
              background: activeTab === tab.id ? 'var(--surface)' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
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