import React, { useState } from 'react';
import { Users, Mail, MoreHorizontal, Search, Plus, Shield, Clock, CheckCircle, X } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  status: 'online' | 'offline' | 'away';
  avatar: string;
  joinedAt: string;
  lastActive: string;
  tasksAssigned: number;
  tasksCompleted: number;
}

const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Alex Thompson', email: 'alex@company.com', role: 'admin', status: 'online', avatar: 'A', joinedAt: 'Jan 15, 2024', lastActive: 'Now', tasksAssigned: 12, tasksCompleted: 8 },
  { id: '2', name: 'Sarah Chen', email: 'sarah@company.com', role: 'member', status: 'online', avatar: 'S', joinedAt: 'Feb 1, 2024', lastActive: '5m ago', tasksAssigned: 15, tasksCompleted: 12 },
  { id: '3', name: 'Mike Johnson', email: 'mike@company.com', role: 'member', status: 'away', avatar: 'M', joinedAt: 'Feb 15, 2024', lastActive: '1h ago', tasksAssigned: 8, tasksCompleted: 6 },
  { id: '4', name: 'Emma Wilson', email: 'emma@company.com', role: 'member', status: 'offline', avatar: 'E', joinedAt: 'Mar 1, 2024', lastActive: '3h ago', tasksAssigned: 10, tasksCompleted: 9 },
  { id: '5', name: 'John Davis', email: 'john@company.com', role: 'viewer', status: 'online', avatar: 'J', joinedAt: 'Mar 10, 2024', lastActive: '10m ago', tasksAssigned: 4, tasksCompleted: 2 },
  { id: '6', name: 'Lisa Brown', email: 'lisa@company.com', role: 'member', status: 'online', avatar: 'L', joinedAt: 'Apr 5, 2024', lastActive: '2m ago', tasksAssigned: 6, tasksCompleted: 4 },
];

const roleColors = {
  admin: { bg: '#FEE2E2', color: '#DC2626', label: 'Admin' },
  member: { bg: '#DBEAFE', color: '#2563EB', label: 'Member' },
  viewer: { bg: '#D1FAE5', color: '#059669', label: 'Viewer' },
};

const statusColors = {
  online: '#22C55E',
  away: '#F59E0B',
  offline: '#94A3B8',
};

const Team: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: members.length,
    online: members.filter(m => m.status === 'online').length,
    admins: members.filter(m => m.role === 'admin').length,
    totalTasks: members.reduce((acc, m) => acc + m.tasksAssigned, 0),
  };

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'offline',
        avatar: inviteEmail[0].toUpperCase(),
        joinedAt: 'Just now',
        lastActive: 'Never',
        tasksAssigned: 0,
        tasksCompleted: 0,
      };
      setMembers([...members, newMember]);
      setInviteEmail('');
      setShowInviteModal(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
    setSelectedMember(null);
  };

  const handleRoleChange = (memberId: string, newRole: 'admin' | 'member' | 'viewer') => {
    setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>Team</h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Manage your team members and their roles</p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
              background: '#2563EB', color: 'white', borderRadius: '10px',
              fontWeight: '600', fontSize: '0.9rem', border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <Plus size={18} /> Invite Member
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Members', value: stats.total, icon: Users, color: '#2563EB', bg: '#DBEAFE' },
            { label: 'Online Now', value: stats.online, icon: CheckCircle, color: '#22C55E', bg: '#DCFCE7' },
            { label: 'Admins', value: stats.admins, icon: Shield, color: '#DC2626', bg: '#FEE2E2' },
            { label: 'Total Tasks', value: stats.totalTasks, icon: Clock, color: '#7C3AED', bg: '#EDE9FE' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '12px', padding: '20px',
              border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '16px'
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <stat.icon size={24} style={{ color: stat.color }} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '4px' }}>{stat.label}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0F172A' }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px',
                border: '1px solid #E5E7EB', fontSize: '0.9rem', outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'admin', 'member', 'viewer'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                style={{
                  padding: '10px 20px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '500',
                  border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
                  background: roleFilter === role ? '#2563EB' : 'white',
                  color: roleFilter === role ? 'white' : '#64748B',
                  borderColor: roleFilter === role ? '#2563EB' : '#E5E7EB',
                }}
              >
                {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Team Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredMembers.map(member => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              style={{
                background: 'white', borderRadius: '12px', padding: '20px',
                border: '1px solid #E5E7EB', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: '#2563EB', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', fontWeight: '700'
                  }}>
                    {member.avatar}
                  </div>
                  <div style={{
                    position: 'absolute', bottom: '0', right: '0',
                    width: '12px', height: '12px', borderRadius: '50%',
                    background: statusColors[member.status],
                    border: '2px solid white'
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A' }}>{member.name}</h3>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '4px' }}>
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>{member.email}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <span className={roleColors[member.role].bg} style={{
                      fontSize: '0.7rem', fontWeight: '600', padding: '2px 10px',
                      borderRadius: '6px', color: roleColors[member.role].color
                    }}>
                      {roleColors[member.role].label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '12px', background: '#F8FAFC', borderRadius: '8px' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0F172A' }}>{member.tasksAssigned}</p>
                  <p style={{ fontSize: '0.7rem', color: '#64748B' }}>Assigned</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#059669' }}>{member.tasksCompleted}</p>
                  <p style={{ fontSize: '0.7rem', color: '#64748B' }}>Done</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#64748B' }}>{member.lastActive}</p>
                  <p style={{ fontSize: '0.7rem', color: '#64748B' }}>Last active</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Users size={48} style={{ color: '#CBD5E1', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#64748B', marginBottom: '8px' }}>No members found</h3>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '24px', width: '420px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Invite Team Member</h2>
              <button onClick={() => setShowInviteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>
            <input
              type="email"
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                border: '1px solid #E5E7EB', fontSize: '0.95rem', marginBottom: '16px', outline: 'none'
              }}
            />
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '8px', display: 'block' }}>Role</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['admin', 'member', 'viewer'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setInviteRole(role)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', fontWeight: '500',
                      border: '2px solid', cursor: 'pointer', transition: 'all 0.2s',
                      background: inviteRole === role ? roleColors[role].bg : 'white',
                      color: inviteRole === role ? roleColors[role].color : '#64748B',
                      borderColor: inviteRole === role ? roleColors[role].color : '#E5E7EB',
                    }}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowInviteModal(false)}
                style={{
                  padding: '12px 24px', borderRadius: '8px', fontWeight: '600',
                  background: '#F1F5F9', color: '#64748B', border: 'none', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                style={{
                  padding: '12px 24px', borderRadius: '8px', fontWeight: '600',
                  background: '#2563EB', color: 'white', border: 'none', cursor: 'pointer'
                }}
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Detail Panel */}
      {selectedMember && (
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px',
          background: 'white', boxShadow: '-8px 0 32px rgba(0,0,0,0.1)', padding: '24px', zIndex: 1000,
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Member Details</h2>
            <button onClick={() => setSelectedMember(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: '#2563EB', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.75rem', fontWeight: '700', margin: '0 auto 12px'
            }}>
              {selectedMember.avatar}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0F172A' }}>{selectedMember.name}</h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>{selectedMember.email}</p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '8px', display: 'block' }}>Role</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['admin', 'member', 'viewer'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(selectedMember.id, role)}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '500',
                    border: '2px solid', cursor: 'pointer', transition: 'all 0.2s',
                    background: selectedMember.role === role ? roleColors[role].bg : 'white',
                    color: selectedMember.role === role ? roleColors[role].color : '#64748B',
                    borderColor: selectedMember.role === role ? roleColors[role].color : '#E5E7EB',
                  }}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: '16px', background: '#F8FAFC', borderRadius: '8px', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Joined</p>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{selectedMember.joinedAt}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Last Active</p>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{selectedMember.lastActive}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Tasks Assigned</p>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>{selectedMember.tasksAssigned}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Tasks Done</p>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#059669' }}>{selectedMember.tasksCompleted}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleRemoveMember(selectedMember.id)}
            style={{
              width: '100%', padding: '12px', borderRadius: '8px',
              background: '#FEE2E2', color: '#DC2626', fontWeight: '600',
              border: 'none', cursor: 'pointer'
            }}
          >
            Remove from Team
          </button>
        </div>
      )}
    </div>
  );
};

export default Team;