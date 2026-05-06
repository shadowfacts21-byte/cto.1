import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orgService, projectService } from '../services/orgProjectService';
import type { Organization, Project } from '../services/orgProjectService';
import { Briefcase, Plus, Loader2, ChevronLeft } from 'lucide-react';
import Modal from '../components/Modal';

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
        // In a real app, we might have a getOrganizationBySlug endpoint
        // For now, we list all and find the one with the slug
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
        
        // Mock data fallback
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
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error && !org) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">{error}</h2>
        <Link to="/dashboard" className="mt-4 text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1">
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 mb-2">
          <ChevronLeft size={14} />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{org?.name}</h1>
          <button 
            onClick={() => setIsProjectModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
          >
            <Plus size={18} />
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all"
          >
            <div className="bg-indigo-50 w-12 h-12 flex items-center justify-center rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors mb-4">
              <Briefcase size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {project.name}
            </h3>
            <p className="mt-2 text-sm text-gray-500 line-clamp-3">
              {project.description || 'No description provided.'}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
              <span>Updated recently</span>
              <span className="text-indigo-600 font-medium">View Project →</span>
            </div>
          </Link>
        ))}
        
        <button 
          onClick={() => setIsProjectModalOpen(true)}
          className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-all min-h-[200px]"
        >
          <Plus size={32} />
          <span className="mt-2 font-medium">Create New Project</span>
        </button>
      </div>

      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g. Website Redesign"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Brief description of the project"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrganizationDetail;
