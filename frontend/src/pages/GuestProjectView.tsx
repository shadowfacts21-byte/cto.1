import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { projectService } from '../services/orgProjectService';
import type { Project } from '../services/orgProjectService';
import { Loader2, Globe, ShieldAlert, CheckCircle2 } from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard';

const GuestProjectView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGuestData = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const data = await projectService.getGuestProject(token);
        setProject(data.project);
      } catch (err: any) {
        console.error('Error fetching guest project:', err);
        setError('Invalid or expired guest link.');
        
        if (token === 'demo-token') {
          setProject({
            id: '1',
            name: 'Strategic Redesign (Guest View)',
            description: 'This is a high-level shared view of the current project trajectory.',
            organization_id: '1'
          });
          setError('');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGuestData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs animate-pulse">Syncing Shared Workspace</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 animate-fade-in">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-lift p-12 text-center border border-slate-100 dark:border-slate-800">
          <div className="bg-red-50 dark:bg-red-900/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-soft">
            <ShieldAlert size={40} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Portal Locked</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium leading-relaxed">{error}</p>
          <a href="/login" className="btn-primary w-full py-4 shadow-lg shadow-primary/20">
            Request Access
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300 animate-fade-in">
      <header className="glass py-4 px-8 sticky top-0 z-50 shadow-soft border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
              <Globe size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{project?.name}</h1>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Guest Portal • Real-time View</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
             <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg text-slate-400">
                <CheckCircle2 size={16} />
             </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Read-Only Verified
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="py-12 px-8 bg-mesh dark:bg-slate-900/20 border-b border-slate-100 dark:border-slate-800 grain-overlay">
          <div className="max-w-7xl mx-auto">
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl font-medium leading-relaxed italic border-l-4 border-primary pl-8">
              "{project?.description}"
            </p>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden py-12">
          {project && <KanbanBoard projectId={project.id} readOnly={true} />}
        </div>
      </main>
      
      <footer className="py-8 border-t border-slate-100 dark:border-slate-800 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Powered by <span className="text-primary tracking-tight">CollabFlow Enterprise</span>
        </p>
      </footer>
    </div>
  );
};

export default GuestProjectView;
