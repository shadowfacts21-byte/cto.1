import React, { useEffect, useState } from 'react';
import { orgService, dashboardService } from '../services/orgProjectService';
import type { Organization, DashboardSummary } from '../services/orgProjectService';
import { 
  Layout, 
  Briefcase, 
  Plus, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Zap,
  ArrowUpRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';

const Dashboard: React.FC = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [organizations, summaryData] = await Promise.all([
          orgService.getOrganizations(),
          dashboardService.getSummary()
        ]);
        setOrgs(organizations);
        setSummary(summaryData);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    try {
      setIsSubmitting(true);
      const newOrg = await orgService.createOrganization({ name: newOrgName });
      setOrgs([...orgs, newOrg]);
      setIsOrgModalOpen(false);
      setNewOrgName('');
    } catch (err) {
      console.error('Error creating organization:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { label: 'Completed Today', value: summary?.stats.tasksCompletedToday, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Overdue Tasks', value: summary?.stats.overdueTasks, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Upcoming Deadlines', value: summary?.stats.upcomingDeadlines, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Active Projects', value: summary?.stats.activeProjects, icon: Briefcase, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back, <span className="text-primary">Alex</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Here's what's happening across your organizations today.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsOrgModalOpen(true)} className="btn-secondary">
            <Plus size={18} className="mr-2" /> New Org
          </button>
          <Link to="/projects/new" className="btn-primary">
            <Zap size={18} className="mr-2" /> New Project
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card p-6 flex items-center gap-5 hover-lift">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content: Recent Projects */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <TrendingUp size={20} className="text-primary" />
                Recent Projects
              </h2>
              <Link to="/dashboard" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {summary?.recentProjects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`} className="card p-6 group hover-lift border-l-4 border-l-primary">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                      <Briefcase size={20} className="text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <ArrowUpRight size={18} className="text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{project.name}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Progress</p>
                      <p className="text-sm font-black text-primary">{project.progress}%</p>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{project.taskCount} active tasks</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <CheckCircle2 size={20} className="text-primary" />
                Recent Tasks
              </h2>
            </div>
            <div className="card divide-y divide-slate-100 dark:divide-slate-800">
              {summary?.recentTasks.map((task) => (
                <div key={task.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{task.title}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{task.project}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-slate-500">
                      {task.status.replace('-', ' ')}
                    </span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: Activity Feed */}
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-3">
              <Zap size={20} className="text-primary" />
              Live Activity
            </h2>
            <div className="card p-6 space-y-8">
              {summary?.activity.map((item, i) => (
                <div key={item.id} className="relative flex gap-4">
                  {i !== summary.activity.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-[-20px] w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                  )}
                  <div className="relative z-10 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-primary border-2 border-white dark:border-slate-900">
                    {item.user.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                      <span className="font-black text-slate-900 dark:text-white">{item.user}</span> {item.action} <span className="font-bold text-slate-800 dark:text-slate-200">{item.target}</span>
                    </p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-8 bg-primary text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700">
              <MessageSquare size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-2">Need Help?</h3>
              <p className="text-primary-foreground/80 text-sm font-medium mb-6">Our support team is available 24/7 to help you optimize your workflow.</p>
              <button className="bg-white text-primary px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all">
                Contact Support
              </button>
            </div>
          </section>
        </div>
      </div>

      <Modal
        isOpen={isOrgModalOpen}
        onClose={() => setIsOrgModalOpen(false)}
        title="Create New Organization"
      >
        <form onSubmit={handleCreateOrg} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Organization Name</label>
            <input
              type="text"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              className="input-field"
              placeholder="e.g. Acme Corp"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOrgModalOpen(false)}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
