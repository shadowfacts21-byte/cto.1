import React, { useEffect, useState } from 'react';
import { orgService } from '../services/orgProjectService';
import type { Organization } from '../services/orgProjectService';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Filter,
  Loader2,
  ChevronRight,
  Target,
  Clock,
  CheckCircle2
} from 'lucide-react';
import AnalyticsCharts from '../components/AnalyticsCharts';

const Analytics: React.FC = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const organizations = await orgService.getOrganizations();
        setOrgs(organizations);
        if (organizations.length > 0) {
          setSelectedOrg(organizations[0].slug);
        } else {
          // Fallback
          const mockOrg = { id: '1', name: 'My Company', slug: 'my-company' };
          setOrgs([mockOrg]);
          setSelectedOrg(mockOrg.slug);
        }
      } catch (err) {
        console.error('Error fetching organizations:', err);
        const mockOrg = { id: '1', name: 'My Company', slug: 'my-company' };
        setOrgs([mockOrg]);
        setSelectedOrg(mockOrg.slug);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Visualize team performance and project velocity.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <select className="input-field pl-9 w-44 text-sm">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>
          <select 
            className="input-field w-48 text-sm"
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
          >
            {orgs.map(org => (
              <option key={org.id} value={org.slug}>{org.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="card p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-blue-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Target size={20} />
            </div>
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-blue-100 text-sm font-medium">Tasks Completed</p>
          <h3 className="text-3xl font-bold mt-1">128</h3>
        </div>
        
        <div className="card p-6 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg. Cycle Time</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">4.2d</h3>
        </div>

        <div className="card p-6 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Team Velocity</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">32 pts</h3>
        </div>

        <div className="card p-6 bg-white dark:bg-slate-900">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Success Rate</p>
          <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">94%</h3>
        </div>
      </div>

      <div className="space-y-10">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <BarChart3 size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Performance Overview</h2>
          </div>
          <div className="card p-8">
            <AnalyticsCharts orgSlug={selectedOrg} />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Trends</h2>
              <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                Export Report <ChevronRight size={14} />
              </button>
            </div>
            <div className="card p-10 h-80 flex items-center justify-center border-dashed border-2">
              <div className="text-center">
                <TrendingUp size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Historical trend analysis coming in v2.1</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Top Contributors</h2>
            <div className="card p-6 space-y-6">
              {[
                { name: 'Alex Rivera', tasks: 42, score: 98 },
                { name: 'Jordan Smith', tasks: 38, score: 92 },
                { name: 'Taylor Wong', tasks: 31, score: 89 },
                { name: 'Morgan Lee', tasks: 27, score: 85 }
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.tasks} tasks completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">{user.score}%</p>
                    <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${user.score}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
