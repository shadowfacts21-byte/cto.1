import React, { useEffect, useState } from 'react';
import { orgService, projectService } from '../services/orgProjectService';
import type { Organization, Project } from '../services/orgProjectService';
import { Layout, Briefcase, Plus, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';

const Dashboard: React.FC = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [projectsMap, setProjectsMap] = useState<Record<string, Project[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const organizations = await orgService.getOrganizations();
        setOrgs(organizations);

        const projectPromises = organizations.map(async (org) => {
          const projects = await projectService.getProjects(org.slug);
          return { slug: org.slug, projects };
        });

        const results = await Promise.all(projectPromises);
        const map: Record<string, Project[]> = {};
        results.forEach((res) => {
          map[res.slug] = res.projects;
        });
        setProjectsMap(map);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        
        if (err.response?.status === 404 || err.code === 'ERR_NETWORK') {
          const mockOrgs = [{ id: '1', name: 'My Company', slug: 'my-company' }];
          setOrgs(mockOrgs);
          setProjectsMap({
            'my-company': [
              { id: '1', name: 'Website Redesign', description: 'New landing page', organization_id: '1' },
              { id: '2', name: 'Mobile App', description: 'React Native project', organization_id: '1' }
            ]
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div className="space-y-2">
            <div className="h-10 w-48 skeleton"></div>
            <div className="h-4 w-64 skeleton"></div>
          </div>
          <div className="h-10 w-40 skeleton rounded-full"></div>
        </div>
        <div className="space-y-12">
          {[1, 2].map(i => (
            <div key={i} className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 skeleton rounded-2xl"></div>
                  <div className="space-y-2">
                    <div className="h-8 w-40 skeleton"></div>
                    <div className="h-3 w-20 skeleton"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-48 skeleton rounded-2xl"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your organizations and active projects.</p>
        </div>
        <button 
          onClick={() => setIsOrgModalOpen(true)}
          className="btn-primary"
        >
          <Plus size={18} className="mr-2" />
          New Organization
        </button>
      </div>

      {error && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 px-6 py-4 rounded-2xl mb-8 text-sm flex items-center gap-3">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          {error} (Using offline mode)
        </div>
      )}

      {orgs.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <Layout className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-700" />
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No organizations found</h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Get started by creating your first organization.</p>
          <button 
            onClick={() => setIsOrgModalOpen(true)}
            className="btn-primary mt-8"
          >
            Create Organization
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          {orgs.map((org, idx) => (
            <div key={org.id} className={`animate-slide-up delay-${(idx + 1) * 100}`}>
              <div className="flex justify-between items-end mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-2xl">
                    <Layout size={24} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{org.name}</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{org.slug}</p>
                  </div>
                </div>
                <Link 
                  to={`/orgs/${org.slug}`} 
                  className="text-primary hover:text-primary-hover text-sm font-bold flex items-center gap-1 group"
                >
                  Organization Settings
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectsMap[org.slug]?.map((project) => (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="card p-6 flex flex-col group hover-lift"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary/5 p-3 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-soft">
                        <Briefcase size={22} />
                      </div>
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                            U{i}
                          </div>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 flex-grow">
                      {project.description || 'Deliver amazing results with your team in this project.'}
                    </p>
                    <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span>12 Tasks</span>
                      <span className="text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Open Board <ChevronRight size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
                
                <button className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group">
                  <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-full group-hover:bg-primary/10 transition-colors mb-3">
                    <Plus size={32} />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest">Add Project</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isOrgModalOpen}
        onClose={() => setIsOrgModalOpen(false)}
        title="Create New Organization"
      >
        <form onSubmit={handleCreateOrg} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Organization Name</label>
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
              className="btn-primary"
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
