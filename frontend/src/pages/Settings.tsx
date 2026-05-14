import React, { useState, useEffect } from 'react';
import { CreditCard, Share2, Users, Moon, Sun, Plus, Check, Globe, MessageSquare } from 'lucide-react';
import { billingService, integrationService } from '../services/billingIntegrationService';
import type { Plan, UsageStats, Integration } from '../services/billingIntegrationService';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'billing' | 'integrations' | 'team' | 'appearance'>('billing');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planData, usageData, integrationData] = await Promise.all([
          billingService.getCurrentPlan(),
          billingService.getUsageStats(),
          integrationService.getIntegrations(),
        ]);
        setPlan(planData);
        setUsage(usageData);
        setIntegrations(integrationData);
      } catch (error) {
        console.error('Error fetching settings data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Inviting ${inviteEmail}... (Backend endpoint coming soon)`);
    setInviteEmail('');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'billing' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('billing')}
        >
          <div className="flex items-center gap-2">
            <CreditCard size={18} />
            Billing
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'integrations' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('integrations')}
        >
          <div className="flex items-center gap-2">
            <Share2 size={18} />
            Integrations
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'team' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('team')}
        >
          <div className="flex items-center gap-2">
            <Users size={18} />
            Team
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'appearance' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('appearance')}
        >
          <div className="flex items-center gap-2">
            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            Appearance
          </div>
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{plan?.name}</p>
                  <p className="text-gray-500">${plan?.price}/month</p>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                  Upgrade Plan
                </button>
              </div>
              <ul className="space-y-2">
                {plan?.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={16} className="text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Usage Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Projects</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(usage!.projects / usage!.projectsLimit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-medium">{usage?.projects} / {usage?.projectsLimit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tasks</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(usage!.tasks / usage!.tasksLimit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-medium">{usage?.tasks} / {usage?.tasksLimit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Members</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(usage!.members / usage!.membersLimit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-medium">{usage?.members} / {usage?.membersLimit}</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="bg-white border border-gray-200 rounded-lg p-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    {integration.id === 'github' ? <Globe size={24} /> : <MessageSquare size={24} />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{integration.name}</h3>
                    <p className="text-sm text-gray-500">
                      {integration.connected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    integration.connected
                      ? 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-6">
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Invite Member</h2>
              <form onSubmit={handleInvite} className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Invite
                </button>
              </form>
            </section>

            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Team Members</h2>
              <div className="divide-y divide-gray-200">
                <div className="py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                      JD
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">John Doe (You)</p>
                      <p className="text-sm text-gray-500">john@example.com</p>
                    </div>
                  </div>
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded">Owner</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'appearance' && (
          <section className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Appearance Settings</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon size={20} className="text-gray-600" /> : <Sun size={20} className="text-gray-600" />}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                </div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  isDarkMode ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isDarkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Settings;
