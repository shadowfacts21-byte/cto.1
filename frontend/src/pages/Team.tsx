import React, { useEffect, useState } from 'react';
import { teamService, orgService } from '../services/orgProjectService';
import type { Member, Organization } from '../services/orgProjectService';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  MoreVertical, 
  Trash2, 
  Search,
  Filter,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import Modal from '../components/Modal';

const Team: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteEmailRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchByTerm] = useState('');

  const fetchMembers = async (orgSlug: string) => {
    try {
      setLoading(true);
      const data = await teamService.getMembers(orgSlug);
      setMembers(data);
    } catch (err: any) {
      console.error('Error fetching members:', err);
      if (err.response?.status === 404 || err.code === 'ERR_NETWORK') {
        // Mock data fallback
        setMembers([
          { id: '1', name: 'Alex Rivera', email: 'alex@example.com', role: 'admin', status: 'online' },
          { id: '2', name: 'Jordan Smith', email: 'jordan@example.com', role: 'member', status: 'online' },
          { id: '3', name: 'Taylor Wong', email: 'taylor@example.com', role: 'member', status: 'offline' },
          { id: '4', name: 'Morgan Lee', email: 'morgan@example.com', role: 'viewer', status: 'offline' },
        ]);
      } else {
        setError('Failed to load team members.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const organizations = await orgService.getOrganizations();
        setOrgs(organizations);
        if (organizations.length > 0) {
          setSelectedOrg(organizations[0].slug);
          fetchMembers(organizations[0].slug);
        } else {
          // Fallback for mock org
          const mockOrg = { id: '1', name: 'My Company', slug: 'my-company' };
          setOrgs([mockOrg]);
          setSelectedOrg(mockOrg.slug);
          fetchMembers(mockOrg.slug);
        }
      } catch (err) {
        console.error('Error fetching organizations:', err);
        const mockOrg = { id: '1', name: 'My Company', slug: 'my-company' };
        setOrgs([mockOrg]);
        setSelectedOrg(mockOrg.slug);
        fetchMembers(mockOrg.slug);
      }
    };
    fetchOrgs();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !selectedOrg) return;

    try {
      setIsSubmitting(true);
      const newMember = await teamService.inviteMember(selectedOrg, inviteEmail, inviteRole);
      setMembers([...members, newMember]);
      setIsInviteModalOpen(false);
      setInviteEmail('');
    } catch (err) {
      console.error('Error inviting member:', err);
      // Mock add for demo purposes if backend fails
      const mockMember: Member = {
        id: Math.random().toString(36).substr(2, 9),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'offline'
      };
      setMembers([...members, mockMember]);
      setIsInviteModalOpen(false);
      setInviteEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    
    try {
      await teamService.removeMember(selectedOrg, memberId);
      setMembers(members.filter(m => m.id !== memberId));
    } catch (err) {
      console.error('Error removing member:', err);
      // Local removal for UI feedback
      setMembers(members.filter(m => m.id !== memberId));
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Team Collaboration</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your team members and their access levels.</p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="btn-primary"
        >
          <UserPlus size={18} className="mr-2" />
          Invite Member
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search members by name or email..." 
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchByTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="input-field w-48"
            value={selectedOrg}
            onChange={(e) => {
              setSelectedOrg(e.target.value);
              fetchMembers(e.target.value);
            }}
          >
            {orgs.map(org => (
              <option key={org.id} value={org.slug}>{org.name}</option>
            ))}
          </select>
          <button className="btn-secondary px-4">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Member</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Role</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredMembers.map((member, idx) => (
              <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{member.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Mail size={12} /> {member.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className={member.role === 'admin' ? 'text-amber-500' : 'text-slate-400'} />
                    <span className={`text-sm font-medium capitalize ${member.role === 'admin' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'}`}>
                      {member.role}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300'}`}></div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 capitalize">{member.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                      <MoreVertical size={18} />
                    </button>
                    <button 
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredMembers.length === 0 && (
          <div className="text-center py-20">
            <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No members found</h3>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Try adjusting your search or organization.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
      >
        <form onSubmit={handleInvite} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="input-field"
              placeholder="colleague@example.com"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Assign Role</label>
            <div className="grid grid-cols-3 gap-4">
              {(['member', 'admin', 'viewer'] as const).map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setInviteEmailRole(role)}
                  className={`py-3 rounded-xl border-2 transition-all capitalize font-bold text-sm ${
                    inviteRole === role 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-slate-100 dark:border-slate-800 text-slate-500'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed">
              {inviteRole === 'admin' && 'Admins can manage projects, members, and settings.'}
              {inviteRole === 'member' && 'Members can create tasks, track time, and collaborate on projects.'}
              {inviteRole === 'viewer' && 'Viewers have read-only access to projects and tasks.'}
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsInviteModalOpen(false)}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Team;
