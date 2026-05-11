import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, MessageSquare, User, AlertCircle, Loader2, Send, Clock, Trash2 } from 'lucide-react';
import { taskService } from '../services/taskService';
import type { Task, Comment, Activity } from '../services/taskService';
import Modal from './Modal';
import Timer from './Timer';
import AttachmentList from './AttachmentList';

interface KanbanBoardProps {
  projectId: string;
  readOnly?: boolean;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId, readOnly = false }) => {
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
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const columns: { id: Task['status']; title: string; color: string }[] = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-400' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-primary' },
    { id: 'done', title: 'Done', color: 'bg-green-500' },
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
    setDraggingTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: Task['status']) => {
    const taskId = e.dataTransfer.getData('taskId');
    setDraggingTaskId(null);
    setActiveColumnId(null);
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== status) {
      const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status } : t);
      setTasks(updatedTasks);
      try {
        await taskService.updateTask(taskId, { status });
        if (selectedTask?.id === taskId) {
          fetchTaskDetails(taskId);
        }
      } catch (err) {
        console.error('Failed to update task status:', err);
        fetchTasks();
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
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Board</p>
      </div>
    );
  }

  return (
    <div className="flex gap-8 h-full min-h-[calc(100vh-12rem)] pb-10 px-8 overflow-x-auto no-scrollbar animate-fade-in">
      {columns.map((column) => (
        <div
          key={column.id}
          className={`flex-shrink-0 w-80 flex flex-col rounded-3xl transition-all duration-300 ${activeColumnId === column.id ? 'bg-primary/5 ring-2 ring-primary ring-inset' : draggingTaskId ? 'bg-slate-50/50 dark:bg-slate-900/30' : 'bg-transparent'}`}
          onDragOver={handleDragOver}
          onDragEnter={() => setActiveColumnId(column.id)}
          onDragLeave={() => setActiveColumnId(null)}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="p-4 mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-6 rounded-full ${column.color}`}></div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-2 tracking-tight">
                {column.title}
                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </h3>
            </div>
            {!readOnly && (
              <button
                onClick={() => openCreateModal(column.id)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary transition-all"
              >
                <Plus size={18} />
              </button>
            )}
          </div>

          <div className={`flex-1 flex flex-col gap-4 p-2 rounded-[2rem] border-2 border-transparent transition-all duration-200 ${draggingTaskId ? 'border-dashed border-slate-200 dark:border-slate-800' : ''}`}>
            {tasks.filter(t => t.status === column.id).map((task, idx) => (
              <div
                key={task.id}
                draggable={!readOnly}
                onDragStart={(e) => !readOnly && handleDragStart(e, task.id)}
                onDragEnd={() => setDraggingTaskId(null)}
                onClick={() => handleTaskClick(task)}
                className={`card p-5 group cursor-grab active:cursor-grabbing hover-lift animate-slide-up delay-${(idx + 1) * 100} ${draggingTaskId === task.id ? 'opacity-40 rotate-2' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <button className="text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreVertical size={14} />
                  </button>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-primary transition-colors">{task.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">{task.description || 'No description provided.'}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-slate-400">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <MessageSquare size={14} />
                      <span>{task.id.length % 3}</span>
                    </div>
                    {task.total_minutes !== undefined && task.total_minutes > 0 && (
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <Clock size={14} className="text-primary" />
                        <span className="text-slate-600 dark:text-slate-300">{Math.floor(task.total_minutes / 60)}h {task.total_minutes % 60}m</span>
                      </div>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-accent border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-[10px] font-black shadow-soft">
                    {task.assigned_to ? task.assigned_to.substring(0, 2).toUpperCase() : '??'}
                  </div>
                </div>
              </div>
            ))}
            
            {!readOnly && (
              <button 
                onClick={() => openCreateModal(column.id)}
                className="group w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all text-sm font-bold uppercase tracking-widest mt-2"
              >
                <Plus size={18} className="group-hover:scale-125 transition-transform" />
                Add Card
              </button>
            )}
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
          <div className="space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar pr-2">
            <div>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{selectedTask.description || 'Deliver amazing results with your team in this task.'}</p>
            </div>

            <div className="p-1 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50">
              <AttachmentList taskId={selectedTask.id} />
            </div>

            <div className="p-1 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50">
              <Timer taskId={selectedTask.id} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-y border-slate-100 dark:border-slate-800 py-6">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <AlertCircle size={14} className="text-primary"/> Priority
                </span>
                <span className={`text-sm font-black px-3 py-1 rounded-full w-fit flex items-center capitalize ${
                  selectedTask.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                  selectedTask.priority === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' : 'bg-green-100 text-green-600 dark:bg-green-900/30'
                }`}>
                  {selectedTask.priority}
                </span>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <User size={14} className="text-primary"/> Assignee
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
                    {selectedTask.assigned_to ? selectedTask.assigned_to.substring(0, 2).toUpperCase() : '??'}
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedTask.assigned_to || 'Unassigned'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
              {/* Comments Section */}
              <div className="space-y-6">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary"><MessageSquare size={16} /></div>
                  Discussions
                </h4>
                
                <div className="space-y-4">
                  {loadingDetails ? (
                    <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary"/></div>
                  ) : comments.length > 0 ? (
                    comments.map(comment => (
                      <div key={comment.id} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all group">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-[10px]">
                              {comment.user_name.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{comment.user_name}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No comments yet</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-3 mt-8">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Contribute to the discussion..."
                    className="flex-1 input-field"
                  />
                  <button 
                    type="submit"
                    disabled={!newComment.trim()}
                    className="btn-primary p-3 rounded-2xl shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>

              {/* Activity Section */}
              <div className="space-y-6">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary"><Clock size={16} /></div>
                  Activity Timeline
                </h4>
                <div className="space-y-6 pl-4 border-l-2 border-slate-100 dark:border-slate-800">
                  {loadingDetails ? (
                    <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary"/></div>
                  ) : activities.length > 0 ? (
                    activities.map(activity => (
                      <div key={activity.id} className="relative flex gap-4 text-sm">
                        <div className="absolute -left-[25px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-4 border-primary shadow-soft"></div>
                        <div className="flex-1">
                          <p className="text-slate-600 dark:text-slate-300 font-medium">
                            <span className="font-black text-slate-900 dark:text-white">{activity.user_name}</span> {activity.action}
                          </p>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(activity.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-400 italic text-xs">Awaiting first activity...</div>
                  )}
                </div>
              </div>
            </div>
            
            {!readOnly && (
              <div className="flex justify-end pt-10">
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
                  className="text-xs font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-700 flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <Trash2 size={14} />
                  Burn Task
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <form onSubmit={handleCreateTask} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Task Title</label>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="input-field"
              placeholder="e.g. Design Login Page"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Detailed Description</label>
            <textarea
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              className="input-field"
              placeholder="What needs to be accomplished?"
              rows={4}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary py-3 px-10"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Architecting...' : 'Deploy Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default KanbanBoard;
