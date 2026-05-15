import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Clock, CheckCircle, Target, Calendar, Filter } from 'lucide-react';

// Simple chart components since we can't install recharts easily
const BarChart: React.FC<{ data: { label: string; value: number; color?: string }[]; height?: number }> = ({ data, height = 200 }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: `${height}px`, padding: '16px 0' }}>
    {data.map((item, i) => (
      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div style={{
          width: '100%', background: item.color || '#2563EB', borderRadius: '4px 4px 0 0',
          height: `${(item.value / Math.max(...data.map(d => d.value))) * (height - 40)}px`,
          transition: 'height 0.5s ease'
        }} />
        <span style={{ fontSize: '0.7rem', color: '#64748B', textAlign: 'center' }}>{item.label}</span>
      </div>
    ))}
  </div>
);

const LineChart: React.FC<{ data: { label: string; value: number }[]; color?: string }> = ({ data, color = '#2563EB' }) => {
  const max = Math.max(...data.map(d => d.value));
  const points = data.map((d, i) => `${(i / (data.length - 1)) * 100}%,${(1 - d.value / max) * 100}`).join(' ');
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '120px' }}>
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill={`url(#gradient-${color.replace('#', '')})`} stroke="none"
        points={`0,100 ${points} 100,100`} />
      <polyline fill="none" stroke={color} strokeWidth="2"
        points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${(1 - d.value / max) * 100}`).join(' ')} />
    </svg>
  );
};

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [selectedProject, setSelectedProject] = useState('all');

  const burndownData = [
    { label: 'Mon', value: 40 }, { label: 'Tue', value: 35 }, { label: 'Wed', value: 28 },
    { label: 'Thu', value: 22 }, { label: 'Fri', value: 18 }, { label: 'Sat', value: 12 },
    { label: 'Sun', value: 5 },
  ];

  const velocityData = [
    { label: 'W1', value: 12, color: '#94A3B8' },
    { label: 'W2', value: 18, color: '#94A3B8' },
    { label: 'W3', value: 15, color: '#94A3B8' },
    { label: 'W4', value: 22, color: '#94A3B8' },
    { label: 'W5', value: 28, color: '#2563EB' },
    { label: 'W6', value: 25, color: '#2563EB' },
  ];

  const workloadData = [
    { label: 'Alex', value: 85, color: '#2563EB' },
    { label: 'Sarah', value: 72, color: '#7C3AED' },
    { label: 'Mike', value: 58, color: '#059669' },
    { label: 'Emma', value: 91, color: '#DC2626' },
    { label: 'John', value: 45, color: '#06B6D4' },
  ];

  const taskCompletionData = [
    { label: 'Jan', value: 45 }, { label: 'Feb', value: 52 }, { label: 'Mar', value: 48 },
    { label: 'Apr', value: 61 }, { label: 'May', value: 55 }, { label: 'Jun', value: 68 },
  ];

  const stats = {
    totalTasks: 156,
    completedTasks: 98,
    overdueTasks: 7,
    teamVelocity: 24,
    avgCompletionTime: '2.3 days',
    activeMembers: 12,
  };

  const recentActivity = [
    { user: 'Alex', action: 'completed', target: 'Design dashboard mockup', time: '2m ago' },
    { user: 'Sarah', action: 'commented on', target: 'API integration task', time: '15m ago' },
    { user: 'Mike', action: 'created', target: 'Mobile App v2 project', time: '1h ago' },
    { user: 'Emma', action: 'moved', target: 'User auth to Review', time: '2h ago' },
    { user: 'John', action: 'logged', target: '4h on backend optimization', time: '3h ago' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Analytics</h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Track your team's performance and productivity</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{
                padding: '10px 16px', borderRadius: '8px', border: '1px solid #E5E7EB',
                fontSize: '0.9rem', background: 'white', cursor: 'pointer'
              }}
            >
              <option value="all">All Projects</option>
              <option value="1">Website Redesign</option>
              <option value="2">Mobile App v2</option>
              <option value="3">API Integration</option>
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                padding: '10px 16px', borderRadius: '8px', border: '1px solid #E5E7EB',
                fontSize: '0.9rem', background: 'white', cursor: 'pointer'
              }}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="custom">Custom range</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Tasks', value: stats.totalTasks, icon: Target, color: '#2563EB', bg: '#DBEAFE' },
            { label: 'Completed', value: stats.completedTasks, icon: CheckCircle, color: '#059669', bg: '#D1FAE5' },
            { label: 'Overdue', value: stats.overdueTasks, icon: Clock, color: '#DC2626', bg: '#FEE2E2' },
            { label: 'Team Velocity', value: `${stats.teamVelocity}/wk`, icon: TrendingUp, color: '#7C3AED', bg: '#EDE9FE' },
            { label: 'Avg Completion', value: stats.avgCompletionTime, icon: Calendar, color: '#06B6D4', bg: '#CFFAFE' },
            { label: 'Active Members', value: stats.activeMembers, icon: Users, color: '#F59E0B', bg: '#FEF3C7' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '12px', padding: '20px',
              border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '500' }}>{stat.label}</span>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <stat.icon size={16} style={{ color: stat.color }} />
                </div>
              </div>
              <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A' }}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
          {/* Burndown Chart */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A' }}>Task Burndown</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>Remaining tasks over time</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '3px', background: '#2563EB', borderRadius: '2px' }} />
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Current</span>
              </div>
            </div>
            <LineChart data={burndownData} color="#2563EB" />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Start: 40 tasks</span>
              <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '600' }}>On track: 5 remaining</span>
            </div>
          </div>

          {/* Team Velocity */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A' }}>Team Velocity</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>Tasks completed per week</p>
              </div>
              <span style={{
                background: '#D1FAE5', color: '#059669', padding: '4px 12px',
                borderRadius: '16px', fontSize: '0.75rem', fontWeight: '600'
              }}>
                +18% vs last month
              </span>
            </div>
            <BarChart data={velocityData} height={160} />
          </div>

          {/* Workload Distribution */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A' }}>Workload Distribution</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>Team capacity utilization</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {workloadData.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '50px', fontSize: '0.85rem', color: '#334155', fontWeight: '500' }}>{item.label}</span>
                  <div style={{ flex: 1, background: '#F1F5F9', borderRadius: '6px', height: '24px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${item.value}%`, height: '100%', background: item.color,
                      borderRadius: '6px', transition: 'width 0.5s ease'
                    }} />
                  </div>
                  <span style={{ width: '40px', fontSize: '0.85rem', color: '#64748B', textAlign: 'right' }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Task Completion Trend */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A' }}>Task Completion Trend</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>Monthly completion rates</p>
              </div>
            </div>
            <BarChart data={taskCompletionData.map(d => ({ ...d, color: '#7C3AED' }))} height={160} />
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A', marginBottom: '16px' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivity.map((activity, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                background: '#F8FAFC', borderRadius: '8px'
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%', background: '#2563EB',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: '700', flexShrink: 0
                }}>
                  {activity.user[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', color: '#334155' }}>
                    <span style={{ fontWeight: '600' }}>{activity.user}</span>
                    <span style={{ color: '#64748B' }}> {activity.action} </span>
                    <span style={{ fontWeight: '500' }}>{activity.target}</span>
                  </p>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;