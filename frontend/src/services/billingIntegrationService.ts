import api from '../api/axios';

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  limits: { projects: number; members: number; storage: number };
}

export interface UsageStats {
  projects: number;
  projectsLimit: number;
  members: number;
  membersLimit: number;
  storage: number;
  storageLimit: number;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  connected: boolean;
}

// Mock data for demo when API not available
const mockPlan: Plan = {
  id: 'pro',
  name: 'Pro',
  price: 29,
  interval: 'month',
  features: ['Unlimited projects', '20 team members', 'Advanced analytics', '50GB storage', 'Priority support'],
  limits: { projects: -1, members: 20, storage: 50 }
};

const mockUsage: UsageStats = {
  projects: 5,
  projectsLimit: -1,
  members: 3,
  membersLimit: 20,
  storage: 2.5,
  storageLimit: 50
};

const mockIntegrations: Integration[] = [
  { id: 'github', name: 'GitHub', description: 'Link commits to tasks', icon: '🐙', enabled: true, connected: false },
  { id: 'slack', name: 'Slack', description: 'Get notifications in Slack', icon: '💬', enabled: false, connected: false },
  { id: 'drive', name: 'Google Drive', description: 'Attach files from Drive', icon: '📁', enabled: false, connected: false },
];

export const billingService = {
  async getCurrentPlan(): Promise<Plan> {
    try {
      const response = await api.get('/billing/plan');
      return response.data;
    } catch {
      // Return mock data for demo
      return mockPlan;
    }
  },

  async getUsageStats(): Promise<UsageStats> {
    try {
      const response = await api.get('/billing/usage');
      return response.data;
    } catch {
      return mockUsage;
    }
  },

  async getAvailablePlans(): Promise<Plan[]> {
    try {
      const response = await api.get('/billing/plans');
      return response.data;
    } catch {
      return [mockPlan];
    }
  },

  async upgradePlan(planId: string): Promise<{ success: boolean; url?: string }> {
    try {
      const response = await api.post('/billing/checkout', { planId });
      return response.data;
    } catch (error: any) {
      return { success: false };
    }
  },

  async cancelSubscription(): Promise<{ success: boolean }> {
    try {
      await api.post('/billing/cancel');
      return { success: true };
    } catch {
      return { success: false };
    }
  },
};

export const integrationService = {
  async getIntegrations(): Promise<Integration[]> {
    try {
      const response = await api.get('/integrations');
      return response.data;
    } catch {
      return mockIntegrations;
    }
  },

  async toggleIntegration(integrationId: string, enabled: boolean): Promise<void> {
    // In production, call API
    console.log(`Toggling ${integrationId} to ${enabled}`);
  },

  async connectIntegration(integrationId: string): Promise<string | null> {
    // In production, return OAuth URL
    console.log(`Connecting ${integrationId}`);
    return null;
  },

  async disconnectIntegration(integrationId: string): Promise<void> {
    console.log(`Disconnecting ${integrationId}`);
  },
};