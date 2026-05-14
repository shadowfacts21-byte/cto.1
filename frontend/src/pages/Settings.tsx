import React, { useState, useEffect } from 'react';
import { CreditCard, Share2, Users, Moon, Sun, Plus, Check, Globe, MessageSquare, Zap, Trash2, Shield } from 'lucide-react';
import { billingService, integrationService } from '../services/billingIntegrationService';
import { automationService } from '../services/automationService';
import type { Plan, UsageStats, Integration } from '../services/billingIntegrationService';
import type { AutomationRule } from '../services/automationService';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'billing' | 'integrations' | 'automations' | 'notifications' | 'security' | 'appearance'>('profile');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // New rule form state
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRuleTrigger, setNewRuleTrigger] = useState<AutomationRule['trigger_type']>('task_moved_to_done');
  const [newRuleAction, setNewRuleAction] = useState<AutomationRule['action_type']>('post_slack');
  const [newRuleConfig, setNewRuleConfig] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planData, usageData, integrationData, automationData] = await Promise.all([
          billingService.getCurrentPlan(),
          billingService.getUsageStats(),
          integrationService.getIntegrations(),
          automationService.getRules('my-company')
        ]);
        setPlan(planData);
        setUsage(usageData);
        setIntegrations(integrationData);
        setRules(automationData as AutomationRule[]);
      } catch (error) {
        console.error('Error fetching settings data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRule = await automationService.createRule('my-company', {
        trigger_type: newRuleTrigger,
        action_type: newRuleAction,
        config: { value: newRuleConfig },
        enabled: true
      });
      setRules([...rules, newRule]);
      setIsAddingRule(false);
      setNewRuleConfig('');
    } catch (err) {
      console.error('Failed to create rule:', err);
      const mockRule: AutomationRule = {
        id: Math.random().toString(36).substr(2, 9),
        org_id: 'my-company',
        trigger_type: newRuleTrigger,
        action_type: newRuleAction,
        config: { value: newRuleConfig },
        enabled: true
      };
      setRules([...rules, mockRule]);
      setIsAddingRule(false);
      setNewRuleConfig('');
    }
  };

  const toggleRule = async (rule: AutomationRule) => {
    try {
      const updated = await automationService.updateRule('my-company', rule.id, { enabled: !rule.enabled });
      setRules(rules.map(r => r.id === rule.id ? updated : r));
    } catch (err) {
      setRules(rules.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r));
    }
  };

  const deleteRule = async (id: string) => {
    if (!window.confirm('Delete this rule?')) return;
    try {
      await automationService.deleteRule('my-company', id);
      setRules(rules.filter(r => r.id !== id));
    } catch (err) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Inviting ${inviteEmail}...`);
    setInviteEmail('');
  };

  const toggleDarkMode = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    if (newVal) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-full space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Syncing Settings</p>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: Users },
    { id: 'organization', name: 'Organization', icon: Globe },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: MessageSquare },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'integrations', name: 'Integrations', icon: Share2 },
    { id: 'automations', name: 'Automations', icon: Zap },
    { id: 'appearance', name: 'Appearance', icon: Moon },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account, organization, and preferences.</p>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-10 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-6 py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap flex items-center gap-3 ${
              activeTab === tab.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <tab.icon size={18} />
            {tab.name}
          </button>
        ))}
      </div>

      <div className="animate-slide-up">
        {activeTab === 'profile' && (
          <div className="space-y-10">
            <section className="card p-8">
              <h2 className="text-xl font-black mb-8 dark:text-white">Public Profile</h2>
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white text-4xl font-black shadow-2xl group-hover:scale-105 transition-transform duration-500">
                    AR
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hover:text-primary transition-colors">
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                    <input type="text" defaultValue="Alex Rivera" className="input-field" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                    <input type="email" defaultValue="alex@example.com" className="input-field" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Bio</label>
                    <textarea defaultValue="Product Designer & Frontend Engineer at Acme Corp." className="input-field" rows={3} />
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button className="btn-primary px-10">Save Changes</button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'organization' && (
          <div className="space-y-10">
            <section className="card p-8">
              <h2 className="text-xl font-black mb-8 dark:text-white">Organization Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Organization Name</label>
                  <input type="text" defaultValue="Acme Corp" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Website</label>
                  <input type="url" defaultValue="https://acme.com" className="input-field" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Organization Logo</label>
                  <div className="flex items-center gap-6 p-6 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <Globe size={32} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold dark:text-white">Upload a new logo</p>
                      <p className="text-xs text-slate-500">JPG, PNG or SVG. Max size 2MB.</p>
                    </div>
                    <button className="btn-secondary py-2">Select File</button>
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button className="btn-primary px-10">Update Organization</button>
              </div>
            </section>

            <section className="card p-8 border-red-100 dark:border-red-900/20 bg-red-50/20">
              <h2 className="text-xl font-black mb-2 text-red-600">Danger Zone</h2>
              <p className="text-sm text-slate-500 mb-8">Once you delete an organization, there is no going back. Please be certain.</p>
              <button className="bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-2xl transition-all shadow-lg shadow-red-500/20">
                Delete Organization
              </button>
            </section>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-8">
            <section className="card p-8 bg-mesh relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-2">Current Plan</h2>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">{plan?.name}</p>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                      ${plan?.price} <span className="text-xs uppercase">/ month</span>
                    </p>
                  </div>
                  <button className="btn-primary py-3 px-8 shadow-lg shadow-primary/25">
                    Upgrade to Pro
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plan?.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                        <Check size={14} className="text-green-600 dark:text-green-400" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="card p-8">
              <h2 className="text-lg font-bold mb-8 dark:text-white">Organization Usage</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { label: 'Projects', val: usage?.projects, limit: usage?.projectsLimit },
                  { label: 'Tasks', val: usage?.tasks, limit: usage?.tasksLimit },
                  { label: 'Members', val: usage?.members, limit: usage?.membersLimit }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-end mb-3">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                      <p className="text-sm font-bold">{stat.val} <span className="text-slate-400">/ {stat.limit}</span></p>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-1000"
                        style={{ width: `${(stat.val! / stat.limit!) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {integrations.map((integration) => (
              <div key={integration.id} className="card p-6 flex flex-col justify-between hover-lift">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-soft">
                      {integration.id === 'github' ? <Globe size={28} className="text-slate-700 dark:text-slate-300" /> : <MessageSquare size={28} className="text-primary" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg dark:text-white">{integration.name}</h3>
                      <p className={`text-xs font-black uppercase tracking-widest ${integration.connected ? 'text-green-500' : 'text-slate-400'}`}>
                        {integration.connected ? 'Connected' : 'Not linked'}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                    Sync your workflow and receive real-time updates directly in {integration.name}.
                  </p>
                </div>
                <button
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    integration.connected
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600'
                      : 'btn-primary'
                  }`}
                >
                  {integration.connected ? 'Disconnect' : 'Connect Account'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'automations' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Automation Rules</h2>
              <button 
                onClick={() => setIsAddingRule(!isAddingRule)}
                className="btn-primary py-2 px-6"
              >
                <Plus size={18} className="mr-2" />
                Create Rule
              </button>
            </div>

            {isAddingRule && (
              <form onSubmit={handleCreateRule} className="card p-8 border-primary bg-primary/5 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">When this happens (Trigger)</label>
                    <select 
                      value={newRuleTrigger}
                      onChange={(e) => setNewRuleTrigger(e.target.value as any)}
                      className="input-field appearance-none cursor-pointer"
                    >
                      <option value="task_moved_to_done">Task moved to Done</option>
                      <option value="task_assigned">Task assigned to someone</option>
                      <option value="due_date_near">Due date is near (24h)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Do this (Action)</label>
                    <select 
                      value={newRuleAction}
                      onChange={(e) => setNewRuleAction(e.target.value as any)}
                      className="input-field appearance-none cursor-pointer"
                    >
                      <option value="post_slack">Post to Slack</option>
                      <option value="send_email">Send Email</option>
                      <option value="move_task">Move Task</option>
                    </select>
                  </div>
                </div>
                <div className="mb-8">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Configuration Details</label>
                  <input 
                    type="text"
                    value={newRuleConfig}
                    onChange={(e) => setNewRuleConfig(e.target.value)}
                    placeholder="e.g. #general-channel or colleague@example.com"
                    className="input-field"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => setIsAddingRule(false)} className="font-bold text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">Cancel</button>
                  <button type="submit" className="btn-primary py-2 px-8">Save Rule</button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {rules.length > 0 ? (
                rules.map((rule) => (
                  <div key={rule.id} className="card p-6 flex items-center justify-between group">
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-2xl transition-all ${rule.enabled ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                        <Zap size={24} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          When <span className="text-primary">{rule.trigger_type.replace(/_/g, ' ')}</span>, 
                          then <span className="text-primary">{rule.action_type.replace(/_/g, ' ')}</span>
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Config: {JSON.stringify(rule.config)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => toggleRule(rule)}
                        className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                          rule.enabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-300 ease-in-out ${
                            rule.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <button onClick={() => deleteRule(rule.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card p-16 text-center text-slate-400">
                  <Zap size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-bold uppercase tracking-widest">No Automations Active</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-8">
            <section className="card p-8">
              <h2 className="text-xl font-black mb-8 dark:text-white">Email Notifications</h2>
              <div className="space-y-6">
                {[
                  { id: 'n1', label: 'Task Assigned', desc: 'When someone assigns a task to you.' },
                  { id: 'n2', label: 'Due Date Reminders', desc: '24 hours before a task is due.' },
                  { id: 'n3', label: 'New Comments', desc: 'When someone mentions you or comments on your tasks.' },
                  { id: 'n4', label: 'Project Updates', desc: 'Weekly summary of project progress.' }
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-bold dark:text-white">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                    <button className="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 bg-primary">
                      <span className="translate-x-5 pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-300" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            <section className="card p-8">
              <h2 className="text-xl font-black mb-8 dark:text-white">Change Password</h2>
              <div className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Current Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">New Password</label>
                  <input type="password" placeholder="••••••••" className="input-field" />
                </div>
                <button className="btn-primary py-3 px-8">Update Password</button>
              </div>
            </section>

            <section className="card p-8">
              <h2 className="text-xl font-black mb-4 dark:text-white flex items-center gap-3">
                Two-Factor Authentication
                <span className="bg-amber-100 text-amber-600 text-[10px] font-black uppercase px-2 py-1 rounded">Recommended</span>
              </h2>
              <p className="text-sm text-slate-500 mb-8">Add an extra layer of security to your account by requiring more than just a password to log in.</p>
              <button className="btn-secondary py-3 px-8 border-primary text-primary hover:bg-primary/5">
                Enable 2FA
              </button>
            </section>

            <section className="card p-8">
              <h2 className="text-xl font-black mb-8 dark:text-white">API Keys</h2>
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Production Key</p>
                  <p className="font-mono text-sm dark:text-white">sk_live_••••••••••••••••••••••••</p>
                </div>
                <button className="text-primary font-bold text-sm hover:underline">Reveal Key</button>
              </div>
              <button className="btn-secondary mt-6 flex items-center gap-2">
                <Plus size={18} /> Generate New Key
              </button>
            </section>
          </div>
        )}

        {activeTab === 'appearance' && (
          <section className="card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <Moon size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold dark:text-white">Personalization</h2>
                <p className="text-sm text-slate-500">Configure how CollabFlow looks for you.</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-soft">
                  {isDarkMode ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-amber-500" />}
                </div>
                <div>
                  <p className="font-bold dark:text-white">Dark Interface</p>
                  <p className="text-sm text-slate-500">Easier on your eyes in low light.</p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                  isDarkMode ? 'bg-primary' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-xl transition duration-300 ease-in-out ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            <div className="mt-12 p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] text-center">
              <Shield size={40} className="mx-auto mb-4 text-slate-300" />
              <h3 className="font-bold dark:text-white mb-2">More Themes Coming Soon</h3>
              <p className="text-sm text-slate-500">We're working on custom color themes and high-contrast modes.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Settings;
