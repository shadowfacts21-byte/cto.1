import React, { useEffect, useState } from 'react';
import { 
  Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  Cell
} from 'recharts';
import { analyticsService } from '../services/analyticsService';
import type { BurndownData, VelocityData, WorkloadData } from '../services/analyticsService';
import { Loader2, TrendingUp, Zap, Users } from 'lucide-react';

interface AnalyticsChartsProps {
  projectId?: string;
  orgSlug?: string;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ projectId, orgSlug }) => {
  const [burndown, setBurndown] = useState<BurndownData[]>([]);
  const [velocity, setVelocity] = useState<VelocityData[]>([]);
  const [workload, setWorkload] = useState<WorkloadData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (projectId) {
          const [burndownData, velocityData] = await Promise.all([
            analyticsService.getBurndownData(projectId),
            analyticsService.getVelocityData(projectId)
          ]);
          setBurndown(burndownData);
          setVelocity(velocityData);
        }
        if (orgSlug) {
          const workloadData = await analyticsService.getWorkloadData(orgSlug);
          setWorkload(workloadData);
        }
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, orgSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Burndown Chart */}
        {projectId && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-indigo-600" size={20} />
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Project Burndown</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={burndown}>
                  <defs>
                    <linearGradient id="colorRemaining" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                  <Area type="monotone" dataKey="remaining" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRemaining)" strokeWidth={2} name="Remaining Tasks" />
                  <Line type="monotone" dataKey="ideal" stroke="#9ca3af" strokeDasharray="5 5" name="Ideal Burndown" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Velocity Chart */}
        {projectId && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="text-amber-500" size={20} />
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Team Velocity</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={velocity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="week" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f9fafb' }}
                  />
                  <Bar dataKey="completed" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Tasks Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Workload Chart */}
        {orgSlug && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Users className="text-green-500" size={20} />
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Team Workload Visualization</h3>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workload} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="user" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} width={100} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f9fafb' }}
                  />
                  <Bar dataKey="tasks" radius={[0, 4, 4, 0]} name="Active Tasks">
                    {workload.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCharts;
