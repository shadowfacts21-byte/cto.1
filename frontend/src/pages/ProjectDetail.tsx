import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService } from '../services/orgProjectService';
import type { Project } from '../services/orgProjectService';
import { Briefcase, Loader2, ChevronLeft, Layout, List, Settings as SettingsIcon } from 'lucide-react';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'board' | 'list' | 'settings'>('board');

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await projectService.getProjects('my-company'); // Dummy slug
        const found = data.find(p => p.id === id);
        if (found) {
          setProject(found);
        } else {
          setError('Project not found');
        }
      } catch (err: any) {
        console.error('Error fetching project:', err);
        setError('Failed to load project details.');
        
        // Mock data
        if (id === '1' || id === '2') {
          setProject({
            id,
            name: id === '1' ? 'Website Redesign' : 'Mobile App',
            description: id === '1' ? 'New landing page' : 'React Native project',
            organization_id: '1'
          });
          setError('');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error && !project) {
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
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <Link to="/dashboard" className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 mb-2">
          <ChevronLeft size={14} />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Briefcase size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
              <p className="text-sm text-gray-500">{project?.description}</p>
            </div>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('board')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'board' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Layout size={16} />
              Board
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List size={16} />
              List
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <SettingsIcon size={16} />
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 p-6">
        {activeTab === 'board' && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Layout size={48} className="mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-gray-900">Kanban Board</h3>
            <p className="text-sm">The interactive task board is coming soon in the next update.</p>
          </div>
        )}
        
        {activeTab === 'list' && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <List size={48} className="mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-gray-900">Task List</h3>
            <p className="text-sm">Detailed task listing and filtering will be available here.</p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Project Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input
                  type="text"
                  defaultValue={project?.name}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  defaultValue={project?.description}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  Delete Project
                </button>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
