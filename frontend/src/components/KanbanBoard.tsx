import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, MessageSquare, User, AlertCircle, Loader2, Send, Clock } from 'lucide-react';
import { taskService } from '../services/taskService';
import type { Task, Comment, Activity } from '../services/taskService';
import Modal from './Modal';
import Timer from './Timer';
import AttachmentList from './AttachmentList';

interface KanbanBoardProps {
  projectId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newComment, setNewComment] = useState('');
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('todo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns: { id: Task['status']; title: string }[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ];

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks(projectId);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTaskDetails = async (taskId: string) => {
    try {
      setLoadingDetails(true);
      const [commentsData, activityData] = await Promise.all([
        taskService.getComments(taskId),
        taskService.getActivity(taskId)
      ]);
      setComments(commentsData);
      setActivities(activityData);
    } catch (err) {
      console.error('Error fetching task details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
    fetchTaskDetails(task.id);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: Task['status']) => {
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== status) {
      const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status } : t);
      setTasks(updatedTasks);
      try {
        await taskService.updateTask(taskId, { status });
        // Optionally refresh activity if the task was already open
        if (selectedTask?.id === taskId) {
          fetchTaskDetails(taskId);
        }
      } catch (err) {
        console.error('Failed to update task status:', err);
        fetchTasks(); // Rollback
      }
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      setIsSubmitting(true);
      const newTask = await taskService.createTask({
        project_id: projectId,
        title: newTaskTitle,
        description: newTaskDesc,
        status: newTaskStatus,
        priority: 'medium'
      });
      setTasks([...tasks, newTask]);
      setIsCreateModalOpen(false);
      setNewTaskTitle('');
      setNewTaskDesc('');
    } catch (err) {
      console.error('Error creating task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !newComment.trim()) return;

    try {
      const comment = await taskService.addComment(selectedTask.id, newComment);
      setComments([...comments, comment]);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const openCreateModal = (status: Task['status']) => {
    setNewTaskStatus(status);
    setIsCreateModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4 px-6">
      {columns.map(column => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80 flex flex-col bg-gray-50 rounded-xl border border-gray-200"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="p-4 flex items-center justify-between">
            <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm uppercase tracking-wider">
              {column.title}
              <span className="bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full text-xs">
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </h3>
            <button 
              onClick={() => openCreateModal(column.id)}
              className="text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-3 pb-4">
            {tasks.filter(t => t.status === column.id).map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onClick={() => handleTaskClick(task)}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-400 cursor-pointer group transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    task.priority === 'high' ? 'bg-red-50 text-red-600' :
                    task.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {task.priority}
                  </span>
                  <MoreVertical size={14} className="text-gray-300 group-hover:text-gray-500" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm leading-snug">{task.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">{task.description}</p>
                
                <div className="flex items-center justify-between text-gray-400">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px]">
                      <MessageSquare size={12} />
                      <span>{task.id.length % 3}</span> {/* Just a dummy count for now */}
                    </div>
                    {task.total_minutes !== undefined && task.total_minutes > 0 && (
                      <div className="flex items-center gap-1 text-[10px]">
                        <Clock size={12} />
                        <span>{Math.floor(task.total_minutes / 60)}h {task.total_minutes % 60}m</span>
                      </div>
                    )}
                  </div>
                  <div className="w-6 h-6 rounded-full bg-indigo-100 border border-white flex items-center justify-center text-indigo-600 text-[10px] font-bold">
                    {task.assigned_to ? task.assigned_to.substring(0, 2).toUpperCase() : '??'}
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => openCreateModal(column.id)}
              className="w-full flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all text-xs font-medium border border-transparent hover:border-gray-200"
            >
              <Plus size={14} />
              Add Task
            </button>
          </div>
        </div>
      ))}

      {/* Task Details Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={selectedTask?.title || 'Task Details'}
      >
        {selectedTask && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 leading-relaxed">{selectedTask.description || 'No description provided.'}</p>
            </div>

            <AttachmentList taskId={selectedTask.id} />

            <Timer taskId={selectedTask.id} />
            
            <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-4">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 flex items-center gap-1 uppercase font-semibold tracking-tighter">
                  <AlertCircle size={12}/> Priority
                </span>
                <span className="text-sm font-medium capitalize">{selectedTask.priority}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 flex items-center gap-1 uppercase font-semibold tracking-tighter">
                  <User size={12}/> Assignee
                </span>
                <span className="text-sm font-medium">{selectedTask.assigned_to || 'Unassigned'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Comments Section */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <MessageSquare size={16} /> Comments
                </h4>
                
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                  {loadingDetails ? (
                    <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-gray-400"/></div>
                  ) : comments.length > 0 ? (
                    comments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-gray-700">{comment.user_name}</span>
                          <span className="text-[10px] text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-600">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-400 italic">No comments yet.</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 border border-gray-300 rounded-md p-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  <button 
                    type="submit"
                    disabled={!newComment.trim()}
                    className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>

              {/* Activity Section */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <User size={16} /> Activity
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
                  {loadingDetails ? (
                    <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-gray-400"/></div>
                  ) : activities.length > 0 ? (
                    activities.map(activity => (
                      <div key={activity.id} className="flex gap-3 text-xs border-l-2 border-indigo-100 pl-3 py-1">
                        <div className="flex-1">
                          <p className="text-gray-700">
                            <span className="font-bold">{activity.user_name}</span> {activity.action}
                          </p>
                          <span className="text-[10px] text-gray-400">{new Date(activity.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-400 italic">No activity yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <button 
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    try {
                      await taskService.deleteTask(selectedTask.id);
                      setTasks(tasks.filter(t => t.id !== selectedTask.id));
                      setIsTaskModalOpen(false);
                    } catch (err) {
                      console.error('Delete failed:', err);
                    }
                  }
                }}
                className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Delete Task
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="e.g. Design Login Page"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="What needs to be done?"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors border border-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default KanbanBoard;
