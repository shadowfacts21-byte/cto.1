import api from '../api/axios';

export interface TimeEntry {
  id: string;
  task_id: string;
  user_id: string;
  user_name?: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  notes?: string;
  created_at: string;
}

export interface TimeReport {
  project_id: string;
  project_name: string;
  user_id: string;
  user_name: string;
  total_minutes: number;
}

// Mock storage for local development/demo
const mockEntries: Record<string, TimeEntry[]> = {};

export const timeService = {
  getTimeEntries: async (taskId: string) => {
    try {
      const response = await api.get(`/tasks/${taskId}/time-entries`);
      return response.data as TimeEntry[];
    } catch (err) {
      console.warn('Backend time-entries not found, using mock data');
      return mockEntries[taskId] || [];
    }
  },
  startTimer: async (taskId: string, notes?: string) => {
    try {
      const response = await api.post(`/tasks/${taskId}/time-entries/start`, { notes });
      return response.data as TimeEntry;
    } catch (err) {
      const newEntry: TimeEntry = {
        id: Math.random().toString(36).substr(2, 9),
        task_id: taskId,
        user_id: 'current-user',
        user_name: 'John Doe',
        start_time: new Date().toISOString(),
        created_at: new Date().toISOString(),
        notes
      };
      if (!mockEntries[taskId]) mockEntries[taskId] = [];
      mockEntries[taskId].push(newEntry);
      return newEntry;
    }
  },
  stopTimer: async (taskId: string) => {
    try {
      const response = await api.post(`/tasks/${taskId}/time-entries/stop`);
      return response.data as TimeEntry;
    } catch (err) {
      const entries = mockEntries[taskId] || [];
      const activeEntry = entries.find(e => !e.end_time);
      if (activeEntry) {
        activeEntry.end_time = new Date().toISOString();
        const start = new Date(activeEntry.start_time);
        const end = new Date(activeEntry.end_time);
        activeEntry.duration_minutes = Math.floor((end.getTime() - start.getTime()) / 60000);
        return activeEntry;
      }
      throw new Error('No active timer');
    }
  },
  addTimeEntry: async (taskId: string, data: { start_time: string; end_time: string; notes?: string }) => {
    try {
      const response = await api.post(`/tasks/${taskId}/time-entries`, data);
      return response.data as TimeEntry;
    } catch (err) {
      const start = new Date(data.start_time);
      const end = new Date(data.end_time);
      const newEntry: TimeEntry = {
        id: Math.random().toString(36).substr(2, 9),
        task_id: taskId,
        user_id: 'current-user',
        user_name: 'John Doe',
        start_time: data.start_time,
        end_time: data.end_time,
        duration_minutes: Math.floor((end.getTime() - start.getTime()) / 60000),
        notes: data.notes,
        created_at: new Date().toISOString()
      };
      if (!mockEntries[taskId]) mockEntries[taskId] = [];
      mockEntries[taskId].push(newEntry);
      return newEntry;
    }
  },
  getProjectReport: async (projectId: string) => {
    try {
      const response = await api.get(`/analytics/project/${projectId}/time`);
      return response.data as TimeReport[];
    } catch (err) {
      return [
        { project_id: projectId, project_name: 'Project 1', user_id: 'u1', user_name: 'John Doe', total_minutes: 450 },
        { project_id: projectId, project_name: 'Project 1', user_id: 'u2', user_name: 'Jane Smith', total_minutes: 320 }
      ];
    }
  },
  getUserReport: async (userId: string) => {
    try {
      const response = await api.get(`/analytics/user/${userId}/time`);
      return response.data as TimeReport[];
    } catch (err) {
      return [
        { project_id: 'p1', project_name: 'Website Redesign', user_id: userId, user_name: 'John Doe', total_minutes: 1200 },
        { project_id: 'p2', project_name: 'Mobile App', user_id: userId, user_name: 'John Doe', total_minutes: 800 }
      ];
    }
  }
};
