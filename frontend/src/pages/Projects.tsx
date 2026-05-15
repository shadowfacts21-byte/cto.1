import React, { useState } from 'react';
import { Plus, Search, Calendar, MoreHorizontal } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: { name: string; avatar: string };
  dueDate?: string;
  projectId: string;
}

interface Project {
  id: string;
  name: string;
  slug: string;
  color: string;
}

const mockProjects: Project[] = [
  { id: '1', name: 'Website Redesign', slug: 'website-redesign', color: '#2563EB' },
  { id: '2', name: 'Mobile App v2', slug: 'mobile-app-v2', color: '#7C3AED' },
  { id: '3', name: 'API Integration', slug: 'api-integration', color: '#059669' },
];

const mockTasks: Task[] = [
  { id: '1', title: 'Design new landing page', status: 'done', priority: 'high', assignee: { name: 'Alex', avatar: 'A' }, projectId: '1' },
  { id: '2', title: 'Implement auth flow', status: 'in-progress', priority: 'high', assignee: { name: 'Sarah', avatar: 'S' }, projectId: '1' },
  { id: '3', title: 'Write API documentation', status: 'todo', priority: 'medium', projectId: '1' },
  { id: '4', title: 'Setup CI/CD pipeline', status: 'review', priority: 'medium', assignee: { name: 'Mike', avatar: 'M' }, projectId: '2' },
  { id: '5', title: 'Fix navigation bug', status: 'todo', priority: 'high', projectId: '2' },
  { id: '6', title: 'Update dependencies', status: 'done', priority: 'low', assignee: { name: 'Emma', avatar: 'E' }, projectId: '2' },
  { id: '7', title: 'Database optimization', status: 'in-progress', priority: 'high', assignee: { name: 'Alex', avatar: 'A' }, projectId: '3' },
  { id: '8', title: 'Write unit tests', status: 'todo', priority: 'medium', projectId: '3' },
];

const priorityColors = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};

const statusConfig = {
  'todo': { label: 'To Do', color: '#6B7280', bg: '#F3F4F6' },
  'in-progress': { label: 'In Progress', color: '#2563EB', bg: '#DBEAFE' },
  'review': { label: 'Review', color: '#7C3AED', bg: '#EDE9FE' },
  'done': { label: 'Done', color: '#059669', bg: '#D1FAE5' },
};

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesProject = selectedProject === 'all' || task.projectId === selectedProject;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesSearch;
  });

  const getTasksByStatus = (status: Task['status']) => filteredTasks.filter(t => t.status === status);

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Task['status']) => {
    if (draggedTask) {
      setTasks(tasks.map(t => t.id === draggedTask ? { ...t, status } : t));
      setDraggedTask(null);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const getColumnCounts = () => ({
    todo: getTasksByStatus('todo').length,
    'in-progress': getTasksByStatus('in-progress').length,
    review: getTasksByStatus('review').length,
    done: getTasksByStatus('done').length,
  });

  const counts = getColumnCounts();

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>Projects</h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Manage your tasks with our Kanban board</p>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '200px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px',
                border: '1px solid #E5E7EB', fontSize: '0.9rem', outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', ...mockProjects.map(p => p.id)].map(projectId => (
              <button
                key={projectId}
                onClick={() => setSelectedProject(projectId)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '500',
                  border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
                  background: selectedProject === projectId ? '#2563EB' : 'white',
                  color: selectedProject === projectId ? 'white' : '#64748B',
                  borderColor: selectedProject === projectId ? '#2563EB' : '#E5E7EB',
                }}
              >
                {projectId === 'all' ? 'All Projects' : mockProjects.find(p => p.id === projectId)?.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px',
              background: '#2563EB', color: 'white', borderRadius: '8px', fontWeight: '600',
              fontSize: '0.9rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Plus size={18} /> New Task
          </button>
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          {Object.entries(counts).map(([status, count]) => (
            <div key={status} style={{
              padding: '12px 20px', background: 'white', borderRadius: '10px',
              border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: statusConfig[status as keyof typeof statusConfig].color
              }} />
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                {statusConfig[status as keyof typeof statusConfig].label}:
              </span>
              <span style={{ fontWeight: '700', color: '#0F172A' }}>{count}</span>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px',
          minHeight: '500px'
        }}>
          {(['todo', 'in-progress', 'review', 'done'] as const).map(status => (
            <div
              key={status}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(status)}
              style={{
                background: '#F1F5F9', borderRadius: '12px', padding: '16px',
                border: draggedTask ? '2px dashed #2563EB' : '2px solid transparent',
                transition: 'border-color 0.2s'
              }}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '16px', paddingBottom: '12px',
                borderBottom: `2px solid ${statusConfig[status].color}`
              }}>
                <h3 style={{
                  fontSize: '0.9rem', fontWeight: '700', color: '#334155',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: statusConfig[status].color
                  }} />
                  {statusConfig[status].label}
                </h3>
                <span style={{
                  background: statusConfig[status].bg, color: statusConfig[status].color,
                  padding: '2px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600'
                }}>
                  {getTasksByStatus(status).length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {getTasksByStatus(status).map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    style={{
                      background: 'white', borderRadius: '10px', padding: '14px',
                      border: '1px solid #E5E7EB', cursor: 'grab',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className={priorityColors[task.priority]} style={{
                        fontSize: '0.7rem', fontWeight: '600', padding: '2px 8px',
                        borderRadius: '6px', border: '1px solid'
                      }}>
                        {task.priority.toUpperCase()}
                      </span>
                      <button style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF',
                        padding: '2px'
                      }}>
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>
                      {task.title}
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {task.assignee ? (
                        <div style={{
                          width: '26px', height: '26px', borderRadius: '50%',
                          background: '#2563EB', color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', fontWeight: '700'
                        }}>
                          {task.assignee.avatar}
                        </div>
                      ) : (
                        <div style={{ width: '26px' }} />
                      )}
                      {task.dueDate && (
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {task.dueDate}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '10px' }}>
                      {(['todo', 'in-progress', 'review', 'done'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(task.id, s)}
                          title={`Move to ${statusConfig[s].label}`}
                          style={{
                            flex: 1, padding: '4px', borderRadius: '4px', fontSize: '0.6rem',
                            background: task.status === s ? statusConfig[s].bg : 'transparent',
                            color: task.status === s ? statusConfig[s].color : '#CBD5E1',
                            border: `1px solid ${task.status === s ? statusConfig[s].color : '#E2E8F0'}`,
                            cursor: 'pointer', transition: 'all 0.2s'
                          }}
                        >
                          {statusConfig[s].label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '24px', width: '400px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px' }}>Create New Task</h2>
            <input
              type="text"
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                border: '1px solid #E5E7EB', fontSize: '0.95rem', marginBottom: '16px', outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: '10px 20px', borderRadius: '8px', fontWeight: '600',
                  background: '#F1F5F9', color: '#64748B', border: 'none', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newTaskTitle.trim()) {
                    setTasks([...tasks, {
                      id: Date.now().toString(),
                      title: newTaskTitle,
                      status: 'todo',
                      priority: 'medium',
                      projectId: '1'
                    }]);
                    setNewTaskTitle('');
                    setShowCreateModal(false);
                  }
                }}
                style={{
                  padding: '10px 20px', borderRadius: '8px', fontWeight: '600',
                  background: '#2563EB', color: 'white', border: 'none', cursor: 'pointer'
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;