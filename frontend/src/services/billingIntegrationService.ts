import api from '../api/axios';

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export interface UsageStats {
  projects: number;
  projectsLimit: number;
  tasks: number;
  tasksLimit: number;
  members: number;
  membersLimit: number;
}

export interface Integration {
  id: string;
  name: string;
  connected: boolean;
  icon?: string;
}

export const billingService = {
  getCurrentPlan: async () => {
    // Placeholder until backend is ready
    // const response = await api.get('/billing/plan');
    // return response.data;
    return {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      features: ['Up to 3 projects', 'Basic task management', 'Limited members'],
    };
  },
  getUsageStats: async () => {
    // Placeholder until backend is ready
    // const response = await api.get('/billing/usage');
    // return response.data;
    return {
      projects: 2,
      projectsLimit: 3,
      tasks: 45,
      tasksLimit: 100,
      members: 1,
      membersLimit: 5,
    };
  },
  upgradePlan: async (planId: string) => {
    const response = await api.post('/billing/upgrade', { planId });
    return response.data;
  },
};

export const integrationService = {
  getIntegrations: async () => {
    // Placeholder until backend is ready
    // const response = await api.get('/integrations');
    // return response.data;
    return [
      { id: 'slack', name: 'Slack', connected: false },
      { id: 'github', name: 'GitHub', connected: false },
    ];
  },
  connectIntegration: async (id: string) => {
    const response = await api.post(`/integrations/${id}/connect`);
    return response.data;
  },
  disconnectIntegration: async (id: string) => {
    const response = await api.post(`/integrations/${id}/disconnect`);
    return response.data;
  },
};
