import api from '../api/axios';

export interface BurndownData {
  date: string;
  remaining: number;
  ideal: number;
}

export interface VelocityData {
  week: string;
  completed: number;
}

export interface WorkloadData {
  user: string;
  tasks: number;
}

export const analyticsService = {
  getBurndownData: async (projectId: string) => {
    try {
      const response = await api.get(`/analytics/project/${projectId}/burndown`);
      return response.data as BurndownData[];
    } catch (err) {
      // Mock data
      return [
        { date: '2023-10-01', remaining: 50, ideal: 50 },
        { date: '2023-10-05', remaining: 45, ideal: 40 },
        { date: '2023-10-10', remaining: 38, ideal: 30 },
        { date: '2023-10-15', remaining: 25, ideal: 20 },
        { date: '2023-10-20', remaining: 15, ideal: 10 },
        { date: '2023-10-25', remaining: 5, ideal: 0 },
      ];
    }
  },
  getVelocityData: async (projectId: string) => {
    try {
      const response = await api.get(`/analytics/project/${projectId}/velocity`);
      return response.data as VelocityData[];
    } catch (err) {
      // Mock data
      return [
        { week: 'Week 1', completed: 12 },
        { week: 'Week 2', completed: 18 },
        { week: 'Week 3', completed: 15 },
        { week: 'Week 4', completed: 22 },
      ];
    }
  },
  getWorkloadData: async (orgSlug: string) => {
    try {
      const response = await api.get(`/analytics/org/${orgSlug}/workload`);
      return response.data as WorkloadData[];
    } catch (err) {
      // Mock data
      return [
        { user: 'John Doe', tasks: 8 },
        { user: 'Jane Smith', tasks: 12 },
        { user: 'Bob Johnson', tasks: 5 },
        { user: 'Alice Brown', tasks: 10 },
      ];
    }
  }
};
