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
