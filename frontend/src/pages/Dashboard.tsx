import React, { useEffect, useState } from 'react';
import { orgService, projectService } from '../services/orgProjectService';
import type { Organization, Project } from '../services/orgProjectService';
import { Layout, Briefcase, Plus, ChevronRight, FolderOpen } from 'lucide-react';
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
  
  // Project creation state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedOrgSlug, setSelectedOrgSlug] = useState<string>('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);

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
  
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !selectedOrgSlug) return;

    try {
      setIsCreatingProject(true);
      const newProject = await projectService.createProject(selectedOrgSlug, { 
        name: newProjectName, 
        description: newProjectDescription 
      });
      setProjectsMap(prev => ({
        ...prev,
        [selectedOrgSlug]: [...(prev[selectedOrgSlug] || []), newProject]
      }));
      setIsProjectModalOpen(false);
      setNewProjectName('');
      setNewProjectDescription('');
      setSelectedOrgSlug('');
    } catch (err) {
      console.error('Error creating project:', err);
    } finally {
      setIsCreatingProject(false);
    }
  };
  
  const openProjectModal = (orgSlug: string) => {
    setSelectedOrgSlug(orgSlug);
    setIsProjectModalOpen(true);
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
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="skeleton skeleton-card" style={{ width: '300px', margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text)' }}>
          Dashboard
        </h1>
        <button 
          onClick={() => setIsOrgModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={18} />
          New Organization
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{ 
          background: 'var(--warning-light)', 
          border: '1px solid var(--warning)', 
          color: 'var(--warning)', 
          padding: '12px 16px', 
          borderRadius: 'var(--radius)', 
          marginBottom: '24px',
          fontSize: '0.875rem'
        }}>
          {error} (Using offline mode)
        </div>
      )}

      {/* Empty State */}
      {orgs.length === 0 ? (
        <div className="card text-center" style={{ padding: '48px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'var(--bg)', 
            borderRadius: 'var(--radius-lg)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 24px'
          }}>
            <FolderOpen size={32} style={{ color: 'var(--text-muted)' }} />
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text)', marginBottom: '8px' }}>
            No organizations yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>
            Get started by creating your first organization.
          </p>
          <button onClick={() => setIsOrgModalOpen(true)} className="btn btn-primary">
            <Plus size={18} />
            Create Organization
          </button>
        </div>
      ) : (
        /* Organizations Grid */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {orgs.map((org) => (
            <div className="card" key={org.id} style={{ padding: '0', overflow: 'hidden' }}>
              {/* Org Header */}
              <div style={{ 
                background: 'var(--bg)', 
                padding: '16px 24px', 
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '36px', 
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Layout size={18} />
                  </div>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text)' }}>
                    {org.name}
                  </h2>
                </div>
                <Link 
                  to={`/orgs/${org.slug}`} 
                  style={{ 
                    color: 'var(--primary)', 
                    fontSize: '0.875rem', 
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  View Details
                  <ChevronRight size={16} />
                </Link>
              </div>
              
              {/* Projects Grid */}
              <div style={{ padding: '24px' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: '16px' 
                }}>
                  {projectsMap[org.slug]?.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="card lift"
                      style={{ 
                        display: 'block',
                        textDecoration: 'none',
                        padding: '20px'
                      }}
                    >
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        background: 'var(--primary-light)', 
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px'
                      }}>
                        <Briefcase size={20} style={{ color: 'var(--primary)' }} />
                      </div>
                      <h3 style={{ 
                        fontSize: '0.9375rem', 
                        fontWeight: '600', 
                        color: 'var(--text)',
                        marginBottom: '8px'
                      }}>
                        {project.name}
                      </h3>
                      <p style={{ 
                        fontSize: '0.8125rem', 
                        color: 'var(--text-muted)',
                        lineHeight: '1.5',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {project.description || 'No description provided.'}
                      </p>
                    </Link>
                  ))}
                  
                  {/* New Project Card */}
                  <button 
                    className="card"
                    onClick={() => openProjectModal(org.slug)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '24px',
                      border: '2px dashed var(--border)',
                      background: 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      gap: '8px'
                    }}
                  >
                    <Plus size={24} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>
                      New Project
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Org Modal */}
      <Modal
        isOpen={isOrgModalOpen}
        onClose={() => setIsOrgModalOpen(false)}
        title="Create New Organization"
      >
        <form onSubmit={handleCreateOrg} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Organization Name</label>
            <input
              type="text"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              className="form-input"
              placeholder="e.g. Acme Corp"
              required
              disabled={isSubmitting}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <button
              type="button"
              onClick={() => setIsOrgModalOpen(false)}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Project Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="form-input"
              placeholder="e.g. Website Redesign"
              required
              disabled={isCreatingProject}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <textarea
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              className="form-input"
              placeholder="Brief description of the project..."
              rows={3}
              disabled={isCreatingProject}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
              className="btn btn-secondary"
              disabled={isCreatingProject}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isCreatingProject}
            >
              {isCreatingProject ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;