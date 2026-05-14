import api from '../api/axios';

export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'annual';
  features: string[];
  limits: {
    projects: number;
    members: number;
    storage: number;
  };
}

export interface UsageStats {
  projects: number;
  projectsLimit: number;
  members: number;
  membersLimit: number;
  storage: number;
  storageLimit: number;
  tasks: number;
  tasksLimit: number;
  apiCalls: number;
}

export interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  connected: boolean;
}

export const billingService = {
  async getCurrentPlan(): Promise<Plan> {
    const response = await api.get('/billing/plan');
    return response.data;
  },

  async getUsageStats(): Promise<UsageStats> {
    const response = await api.get('/billing/usage');
    return response.data;
  },

  async upgradePlan(planId: string): Promise<void> {
    await api.post('/billing/upgrade', { planId });
  },

  async cancelSubscription(): Promise<void> {
    await api.post('/billing/cancel');
  },
};

export const integrationService = {
  async getIntegrations(): Promise<Integration[]> {
    const response = await api.get('/integrations');
    return response.data;
  },

  async toggleIntegration(integrationId: string, enabled: boolean): Promise<void> {
    await api.put(`/integrations/${integrationId}`, { enabled });
  },

  async connectIntegration(integrationId: string): Promise<string> {
    const response = await api.post(`/integrations/${integrationId}/connect`);
    return response.data.oauthUrl;
  },

  async disconnectIntegration(integrationId: string): Promise<void> {
    await api.post(`/integrations/${integrationId}/disconnect`);
  },
};