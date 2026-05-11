import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orgService, projectService } from '../services/orgProjectService';
import type { Organization, Project } from '../services/orgProjectService';
import { Briefcase, Plus, Loader2, ChevronLeft, BarChart3, ChevronRight } from 'lucide-react';
import Modal from '../components/Modal';
import AnalyticsCharts from '../components/AnalyticsCharts';

const OrganizationDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [org, setOrg] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !newProjectName.trim()) return;

    try {
      setIsSubmitting(true);
      const newProject = await projectService.createProject(slug, {
        name: newProjectName,
        description: newProjectDesc
      });
      setProjects([...projects, newProject]);
      setIsProjectModalOpen(false);
      setNewProjectName('');
      setNewProjectDesc('');
    } catch (err) {
      console.error('Error creating project:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const organizations = await orgService.getOrganizations();
        const foundOrg = organizations.find(o => o.slug === slug);
        
        if (foundOrg) {
          setOrg(foundOrg);
          const orgProjects = await projectService.getProjects(slug);
          setProjects(orgProjects);
        } else {
          setError('Organization not found');
        }
      } catch (err: any) {
        console.error('Error fetching org data:', err);
        setError('Failed to load organization data.');
        
        if (slug === 'my-company') {
          setOrg({ id: '1', name: 'My Company', slug: 'my-company' });
          setProjects([
            { id: '1', name: 'Website Redesign', description: 'New landing page', organization_id: '1' },
            { id: '2', name: 'Mobile App', description: 'React Native project', organization_id: '1' }
          ]);
          setError('');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-10">
          <div className="h-4 w-20 skeleton mb-4"></div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 skeleton rounded-2xl"></div>
              <div className="space-y-2">
                <div className="h-10 w-64 skeleton"></div>
                <div className="h-4 w-32 skeleton"></div>
              </div>
            </div>
            <div className="h-10 w-40 skeleton rounded-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 skeleton rounded-[2rem]"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !org) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-[2.5rem] inline-block mb-8">
          <h2 className="text-2xl font-black text-red-600 dark:text-red-400 mb-2">{error}</h2>
          <p className="text-red-500/60 font-medium">We couldn't find the organization you were looking for.</p>
        </div>
        <br/>
        <Link to="/dashboard" className="btn-secondary py-3 px-8">
          <ChevronLeft size={18} className="mr-2" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-10">
        <Link to="/dashboard" className="text-sm font-bold text-slate-400 hover:text-primary flex items-center gap-1 mb-4 group w-fit transition-colors">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-primary to-accent p-4 rounded-2xl text-white shadow-lg shadow-primary/20">
              <Briefcase size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{org?.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mt-1">{org?.slug}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsProjectModalOpen(true)}
            className="btn-primary"
          >
            <Plus size={18} className="mr-2" />
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {projects.map((project, idx) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className={`card p-8 group hover-lift animate-slide-up delay-${(idx + 1) * 100}`}
          >
            <div className="bg-primary/5 w-14 h-14 flex items-center justify-center rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 mb-6 shadow-soft group-hover:rotate-3 group-hover:scale-110">
              <Briefcase size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
              {project.description || 'Deliver amazing results with your team in this project.'}
            </p>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
              <span>Updated recently</span>
              <span className="text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Details <ChevronRight size={14} />
              </span>
            </div>
          </Link>
        ))}
        
        <button 
          onClick={() => setIsProjectModalOpen(true)}
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all min-h-[250px] group animate-slide-up"
        >
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-full group-hover:bg-primary/10 transition-colors mb-4">
            <Plus size={40} className="group-hover:rotate-90 transition-transform" />
          </div>
          <span className="font-black uppercase tracking-[0.2em] text-xs">Create Project</span>
        </button>
      </div>

      {slug && (
        <div className="mt-24 mb-12 animate-slide-up delay-300">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-accent/10 rounded-xl text-accent">
              <BarChart3 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Ecosystem Insights</h2>
              <p className="text-sm text-slate-500 font-medium">Real-time performance metrics for {org?.name}.</p>
            </div>
          </div>
          <div className="card p-10">
            <AnalyticsCharts orgSlug={slug} />
          </div>
        </div>
      )}

      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Architect New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Project Identity</label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="input-field"
              placeholder="e.g. Website Redesign"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Strategic Goals</label>
            <textarea
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="input-field"
              placeholder="Brief description of the project"
              rows={4}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
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
              {isSubmitting ? 'Architecting...' : 'Deploy Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrganizationDetail;
