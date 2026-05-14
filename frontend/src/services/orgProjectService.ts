import api from '../api/axios';

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  organization_id: string;
}

export const orgService = {
  getOrganizations: async () => {
    const response = await api.get('/orgs');
    return response.data as Organization[];
  },
  createOrganization: async (data: { name: string }) => {
    const response = await api.post('/orgs', data);
    return response.data as Organization;
  },
};

export const projectService = {
  getProjects: async (orgSlug: string) => {
    const response = await api.get(`/orgs/${orgSlug}/projects`);
    return response.data as Project[];
  },
  createProject: async (orgSlug: string, data: { name: string; description: string }) => {
    const response = await api.post(`/orgs/${orgSlug}/projects`, data);
    return response.data as Project;
  },
  inviteGuest: async (projectId: string, email: string) => {
    const response = await api.post(`/projects/${projectId}/guest-invites`, { email });
    return response.data;
  },
  getGuestProject: async (token: string) => {
    const response = await api.get(`/guest/projects/${token}`);
    return response.data as { project: Project; tasks: any[] };
  }
};

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  status: 'online' | 'offline';
}

export const teamService = {
  getMembers: async (orgSlug: string) => {
    const response = await api.get(`/orgs/${orgSlug}/members`);
    return response.data as Member[];
  },
  inviteMember: async (orgSlug: string, email: string, role: string) => {
    const response = await api.post(`/orgs/${orgSlug}/members`, { email, role });
    return response.data as Member;
  },
  updateMemberRole: async (orgSlug: string, memberId: string, role: string) => {
    const response = await api.patch(`/orgs/${orgSlug}/members/${memberId}`, { role });
    return response.data as Member;
  },
  removeMember: async (orgSlug: string, memberId: string) => {
    await api.delete(`/orgs/${orgSlug}/members/${memberId}`);
  }
};

export interface DashboardSummary {
  stats: {
    tasksCompletedToday: number;
    overdueTasks: number;
    upcomingDeadlines: number;
    activeProjects: number;
  };
  recentProjects: (Project & { progress: number; taskCount: number })[];
  recentTasks: any[];
  activity: {
    id: string;
    user: string;
    action: string;
    target: string;
    time: string;
  }[];
}

export const dashboardService = {
  getSummary: async () => {
    try {
      const response = await api.get('/dashboard/summary');
      return response.data as DashboardSummary;
    } catch (err) {
      // Mock data fallback
      return {
        stats: {
          tasksCompletedToday: 12,
          overdueTasks: 3,
          upcomingDeadlines: 5,
          activeProjects: 4
        },
        recentProjects: [
          { id: '1', name: 'Website Redesign', description: 'New landing page', organization_id: '1', progress: 65, taskCount: 24 },
          { id: '2', name: 'Mobile App', description: 'React Native project', organization_id: '1', progress: 30, taskCount: 42 }
        ],
        recentTasks: [
          { id: '1', title: 'Design System Update', project: 'Website Redesign', status: 'in-progress', priority: 'high' },
          { id: '2', title: 'API Integration', project: 'Mobile App', status: 'todo', priority: 'medium' },
          { id: '3', title: 'User Testing', project: 'Website Redesign', status: 'review', priority: 'low' }
        ],
        activity: [
          { id: '1', user: 'Alex Rivera', action: 'completed', target: 'Login Screen Design', time: '10m ago' },
          { id: '2', user: 'Jordan Smith', action: 'moved', target: 'Database Migration', time: '45m ago' },
          { id: '3', user: 'Taylor Wong', action: 'commented on', target: 'OAuth Flow', time: '2h ago' }
        ]
      } as DashboardSummary;
    }
  }
};
