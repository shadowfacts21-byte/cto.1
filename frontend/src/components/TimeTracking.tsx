import React, { useState, useEffect } from 'react';
import { Clock, Loader2, PieChart } from 'lucide-react';
import { timeService } from '../services/timeService';
import type { TimeReport } from '../services/timeService';

interface TimeTrackingProps {
  projectId: string;
}

const TimeTracking: React.FC<TimeTrackingProps> = ({ projectId }) => {
  const [reports, setReports] = useState<TimeReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await timeService.getProjectReport(projectId);
        setReports(data);
      } catch (err) {
        console.error('Error fetching project report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [projectId]);

  const formatMinutes = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="text-indigo-600" size={20} />
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Time by Team Member</h3>
          </div>
          <div className="space-y-4">
            {reports.map((report, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{report.user_name}</span>
                  <span className="text-gray-500">{formatMinutes(report.total_minutes)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ 
                      width: `${(report.total_minutes / Math.max(...reports.map(r => r.total_minutes))) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <p className="text-sm text-gray-400 italic text-center py-4">No time logged yet.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
          <Clock size={48} className="text-gray-100 mb-4" />
          <h3 className="text-3xl font-bold text-gray-900">
            {formatMinutes(reports.reduce((acc, r) => acc + r.total_minutes, 0))}
          </h3>
          <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mt-1">Total Project Time</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Recent Time Entries</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-400 uppercase text-[10px] tracking-widest border-b border-gray-100">
              <th className="px-6 py-3 font-semibold">User</th>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold">Notes</th>
              <th className="px-6 py-3 font-semibold text-right">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Mocking recent entries since we don't have a direct list-all-for-project API yet */}
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[10px]">JD</div>
                John Doe
              </td>
              <td className="px-6 py-4 text-gray-500">Oct 24, 2023</td>
              <td className="px-6 py-4 text-gray-500">Working on API integration</td>
              <td className="px-6 py-4 text-right font-medium">2h 30m</td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-[10px]">JS</div>
                Jane Smith
              </td>
              <td className="px-6 py-4 text-gray-500">Oct 23, 2023</td>
              <td className="px-6 py-4 text-gray-500">UI Design refinements</td>
              <td className="px-6 py-4 text-right font-medium">1h 15m</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeTracking;
