import api from '../api/axios';

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigned_to?: string;
  due_date?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface Activity {
  id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  action: string;
  created_at: string;
}

export const taskService = {
  getTasks: async (projectId: string) => {
    const response = await api.get(`/tasks?project_id=${projectId}`);
    return response.data as Task[];
  },
  getTaskDetails: async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data as Task;
  },
  createTask: async (data: Partial<Task>) => {
    const response = await api.post('/tasks', data);
    return response.data as Task;
  },
  updateTask: async (taskId: string, data: Partial<Task>) => {
    const response = await api.patch(`/tasks/${taskId}`, data);
    return response.data as Task;
  },
  deleteTask: async (taskId: string) => {
    await api.delete(`/tasks/${taskId}`);
  },
  getComments: async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}/comments`);
    return response.data as Comment[];
  },
  addComment: async (taskId: string, content: string) => {
    const response = await api.post(`/tasks/${taskId}/comments`, { content });
    return response.data as Comment;
  },
  getActivity: async (taskId: string) => {
    const response = await api.get(`/tasks/${taskId}/activity`);
    return response.data as Activity[];
  }
};
