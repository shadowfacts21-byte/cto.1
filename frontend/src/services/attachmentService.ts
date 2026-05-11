import api from '../api/axios';

export interface Attachment {
  id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_by: string;
  uploaded_at: string;
}

export const attachmentService = {
  getAttachments: async (taskId: string) => {
    try {
      const response = await api.get(`/tasks/${taskId}/attachments`);
      return response.data as Attachment[];
    } catch (err) {
      // Mock data
      return [
        { 
          id: '1', 
          task_id: taskId, 
          file_name: 'design-spec.pdf', 
          file_url: '#', 
          file_type: 'application/pdf', 
          uploaded_by: 'John Doe', 
          uploaded_at: new Date().toISOString() 
        },
        { 
          id: '2', 
          task_id: taskId, 
          file_name: 'hero-image.png', 
          file_url: 'https://picsum.photos/200', 
          file_type: 'image/png', 
          uploaded_by: 'Jane Smith', 
          uploaded_at: new Date().toISOString() 
        },
      ];
    }
  },
  uploadAttachment: async (taskId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as Attachment;
  },
  deleteAttachment: async (taskId: string, attachmentId: string) => {
    await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
  }
};
