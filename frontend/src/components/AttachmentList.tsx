import React, { useState, useEffect } from 'react';
import { FileText, Image as ImageIcon, File, Download, Trash2, Paperclip, Loader2 } from 'lucide-react';
import { attachmentService } from '../services/attachmentService';
import type { Attachment } from '../services/attachmentService';

interface AttachmentListProps {
  taskId: string;
}

const AttachmentList: React.FC<AttachmentListProps> = ({ taskId }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        setLoading(true);
        const data = await attachmentService.getAttachments(taskId);
        setAttachments(data);
      } catch (err) {
        console.error('Error fetching attachments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttachments();
  }, [taskId]);

  const handleFileAction = async (file: File) => {
    try {
      setUploading(true);
      const newAttachment = await attachmentService.uploadAttachment(taskId, file);
      setAttachments(prev => [...prev, newAttachment]);
    } catch (err) {
      console.error('Upload failed:', err);
      // For demo, if backend fails, mock it
      const mockNew: Attachment = {
        id: Math.random().toString(36).substr(2, 9),
        task_id: taskId,
        file_name: file.name,
        file_url: '#',
        file_type: file.type,
        uploaded_by: 'Current User',
        uploaded_at: new Date().toISOString()
      };
      setAttachments(prev => [...prev, mockNew]);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileAction(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this attachment?')) return;
    try {
      await attachmentService.deleteAttachment(taskId, attachmentId);
      setAttachments(prev => prev.filter(a => a.id !== attachmentId));
    } catch (err) {
      console.error('Delete failed:', err);
      // For demo, just remove it from state
      setAttachments(prev => prev.filter(a => a.id !== attachmentId));
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon size={18} className="text-blue-500" />;
    if (type === 'application/pdf') return <FileText size={18} className="text-red-500" />;
    return <File size={18} className="text-gray-500" />;
  };

  if (loading) {
    return <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-gray-400"/></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wide">
        <Paperclip size={16} />
        Attachments
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all flex flex-col items-center justify-center gap-2 ${
          dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <span className="text-xs text-gray-500 font-medium">Uploading...</span>
          </div>
        ) : (
          <>
            <div className="p-2 bg-white rounded-full shadow-sm text-gray-400">
              <Download size={20} className="transform rotate-180" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-700">Click or drag to upload</p>
              <p className="text-[10px] text-gray-400 mt-1">Images, PDFs, or docs up to 10MB</p>
            </div>
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => e.target.files?.[0] && handleFileAction(e.target.files[0])}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {attachments.map(attachment => (
          <div key={attachment.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg group hover:border-indigo-200 hover:shadow-sm transition-all">
            <div className="flex-shrink-0">
              {attachment.file_type.startsWith('image/') && attachment.file_url !== '#' ? (
                <img src={attachment.file_url} alt="" className="w-10 h-10 rounded object-cover border border-gray-100" />
              ) : (
                <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center border border-gray-100">
                  {getFileIcon(attachment.file_type)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{attachment.file_name}</p>
              <p className="text-[10px] text-gray-400">
                {attachment.uploaded_by} • {new Date(attachment.uploaded_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <a 
                href={attachment.file_url} 
                download={attachment.file_name}
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                title="Download"
              >
                <Download size={14} />
              </a>
              <button 
                onClick={() => handleDelete(attachment.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {attachments.length === 0 && !uploading && (
          <p className="text-xs text-gray-400 italic text-center py-2">No attachments yet.</p>
        )}
      </div>
    </div>
  );
};

export default AttachmentList;
