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
        
        // Mock data for development if backend fails
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
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button 
          onClick={() => setIsOrgModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm font-medium"
        >
          <Plus size={18} />
          New Organization
        </button>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error} (Using offline mode)
        </div>
      )}

      {orgs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Layout className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new organization.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orgs.map((org) => (
            <div key={org.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Layout size={20} className="text-indigo-600" />
                  <h2 className="text-lg font-semibold text-gray-900">{org.name}</h2>
                </div>
                <Link 
                  to={`/orgs/${org.slug}`} 
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                >
                  View Details
                  <ChevronRight size={16} />
                </Link>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectsMap[org.slug]?.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="group p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="bg-indigo-50 p-2 rounded-md text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                          <Briefcase size={20} />
                        </div>
                      </div>
                      <h3 className="mt-3 font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {project.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {project.description || 'No description provided.'}
                      </p>
                    </Link>
                  ))}
                  
                  <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:text-indigo-600 hover:border-indigo-300 transition-all">
                    <Plus size={24} />
                    <span className="mt-2 text-sm font-medium">New Project</span>
                  </button>
                </div>
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
        <form onSubmit={handleCreateOrg} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Organization Name</label>
            <input
              type="text"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="e.g. Acme Corp"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOrgModalOpen(false)}
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
              {isSubmitting ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
