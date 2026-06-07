'use client';

import { useState } from 'react';
import { cn, getInitials } from '@/lib/utils';
import {
  Users, UserPlus, Mail, Shield, MoreHorizontal,
  Search, ChevronDown, X, Check, Clock, Settings,
  Ban, Crown, Copy, Link, ExternalLink, Sparkles,
  Filter, ArrowUpDown, Trash2, CheckCircle2, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'invited' | 'pending' | 'inactive';
  joinedAt: string;
  lastActive?: string;
  tasksAssigned?: number;
}

const initialMembers: TeamMember[] = [
  { id: 'u1', name: 'John Doe', email: 'john@momentum.ai', role: 'owner', status: 'active', joinedAt: '2025-01-15', lastActive: '2m ago', tasksAssigned: 12 },
  { id: 'u2', name: 'Sarah Chen', email: 'sarah@momentum.ai', role: 'admin', status: 'active', joinedAt: '2025-02-01', lastActive: '5m ago', tasksAssigned: 8 },
  { id: 'u3', name: 'Alex Rivera', email: 'alex@momentum.ai', role: 'editor', status: 'active', joinedAt: '2025-02-15', lastActive: '15m ago', tasksAssigned: 15 },
  { id: 'u4', name: 'Maria Santos', email: 'maria@momentum.ai', role: 'editor', status: 'active', joinedAt: '2025-03-01', lastActive: '1h ago', tasksAssigned: 6 },
  { id: 'u5', name: 'David Kim', email: 'david@momentum.ai', role: 'editor', status: 'active', joinedAt: '2025-03-10', lastActive: '2h ago', tasksAssigned: 10 },
  { id: 'u6', name: 'Priya Sharma', email: 'priya@momentum.ai', role: 'viewer', status: 'active', joinedAt: '2025-03-20', lastActive: '1d ago', tasksAssigned: 0 },
  { id: 'u7', name: 'Michael Brown', email: 'michael@client.com', role: 'viewer', status: 'invited', joinedAt: '2025-04-01', tasksAssigned: 0 },
  { id: 'u8', name: 'Emily Wilson', email: 'emily@partner.com', role: 'viewer', status: 'pending', joinedAt: '2025-04-02', tasksAssigned: 0 },
];

const roleColors: Record<string, string> = {
  owner: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  admin: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  editor: 'bg-brand-500/10 text-brand-500 border-brand-500/20',
  viewer: 'bg-surface-500/10 text-surface-500 border-surface-500/20',
};

const statusColors: Record<string, string> = {
  active: 'bg-success-500',
  invited: 'bg-brand-500',
  pending: 'bg-warning-500',
  inactive: 'bg-surface-400',
};

const statusLabels: Record<string, string> = {
  active: 'Active',
  invited: 'Invited',
  pending: 'Pending',
  inactive: 'Inactive',
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMemberMenu, setShowMemberMenu] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const newMember: TeamMember = {
      id: `invite-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole as TeamMember['role'],
      status: 'invited',
      joinedAt: new Date().toISOString(),
      tasksAssigned: 0,
    };
    setMembers(prev => [...prev, newMember]);
    toast.success(`Invitation sent to ${inviteEmail}!`);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const handleRoleChange = (memberId: string, newRole: TeamMember['role']) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    toast.success('Role updated successfully');
    setShowMemberMenu(null);
  };

  const handleRemoveMember = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member?.role === 'owner') {
      toast.error('Cannot remove the workspace owner');
      return;
    }
    setMembers(prev => prev.filter(m => m.id !== memberId));
    toast.success('Member removed from workspace');
    setShowMemberMenu(null);
  };

  const handleResendInvite = (memberId: string) => {
    toast.success('Invitation resent!');
    setShowMemberMenu(null);
  };

  const stats = {
    total: members.filter(m => m.status === 'active').length,
    invited: members.filter(m => m.status === 'invited' || m.status === 'pending').length,
    admins: members.filter(m => m.role === 'admin' || m.role === 'owner').length,
    editors: members.filter(m => m.role === 'editor').length,
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-xs font-medium text-success-500 bg-success-500/10 px-2.5 py-0.5 rounded-full">
              {stats.total} active
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white tracking-tight">Team</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Manage your workspace members and permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="apple-button-secondary">
            <Settings className="w-4 h-4" /> Team Settings
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="apple-button-primary"
          >
            <UserPlus className="w-4 h-4" /> Invite Members
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Members', value: stats.total, icon: Users, gradient: 'from-brand-500 to-rose-500', desc: 'Workspace members' },
          { label: 'Admins', value: stats.admins, icon: Crown, gradient: 'from-amber-500 to-orange-500', desc: 'Full access' },
          { label: 'Editors', value: stats.editors, icon: Shield, gradient: 'from-violet-500 to-purple-500', desc: 'Can edit content' },
          { label: 'Pending Invites', value: stats.invited, icon: Clock, gradient: 'from-blue-500 to-cyan-500', desc: 'Awaiting response' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="apple-stat-card"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm', stat.gradient)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-surface-900 dark:text-white mb-0.5 tracking-tight">{stat.value}</p>
              <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members by name or email..."
            className="apple-input pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="apple-input w-auto text-xs px-3 py-2 pr-8"
          >
            <option value="all">All Roles</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="apple-input w-auto text-xs px-3 py-2 pr-8"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="invited">Invited</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Members list */}
      <div className="apple-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200/50 dark:border-white/[0.06]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">Member</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">Tasks</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">Last Active</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Users className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                    <p className="text-sm text-surface-500 dark:text-surface-400">No members found</p>
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="mt-2 text-sm font-medium text-brand-500 hover:text-brand-600"
                    >
                      Invite your first team member
                    </button>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, i) => (
                  <tr
                    key={member.id}
                    className={cn(
                      'border-b border-surface-100/50 dark:border-white/[0.03] transition-colors hover:bg-surface-50/50 dark:hover:bg-white/[0.02]',
                      'animate-fade-in'
                    )}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div className={cn(
                            'w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm',
                            member.role === 'owner' ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                            member.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-violet-600' :
                            'bg-gradient-to-br from-brand-500 to-brand-600'
                          )}>
                            {getInitials(member.name)}
                          </div>
                          <div className={cn(
                            'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-surface-900',
                            statusColors[member.status]
                          )} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-surface-900 dark:text-white truncate flex items-center gap-1.5">
                            {member.name}
                            {member.role === 'owner' && (
                              <Crown className="w-3.5 h-3.5 text-amber-500" />
                            )}
                          </p>
                          <p className="text-xs text-surface-400 dark:text-surface-500 truncate">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn(
                        'px-2.5 py-1 text-[11px] font-semibold rounded-full border capitalize',
                        roleColors[member.role]
                      )}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-1.5 h-1.5 rounded-full', statusColors[member.status])} />
                        <span className="text-xs text-surface-500 dark:text-surface-400">
                          {statusLabels[member.status]}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-surface-600 dark:text-surface-400 font-medium">
                        {member.tasksAssigned}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-surface-400 dark:text-surface-500">
                        {member.lastActive || member.joinedAt}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {member.role !== ('owner' as const) && (
                        <div className="relative">
                          <button
                            onClick={() => setShowMemberMenu(showMemberMenu === member.id ? null : member.id)}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                          {showMemberMenu === member.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 rounded-xl overflow-hidden border border-surface-200 dark:border-white/[0.06] bg-white dark:bg-surface-800 shadow-xl z-10">
                              {(member.status === 'invited' || member.status === 'pending') && (
                                <button
                                  onClick={() => handleResendInvite(member.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.04] transition-colors"
                                >
                                  <Mail className="w-3.5 h-3.5" /> Resend Invite
                                </button>
                              )}
                              {(member.role as string) !== 'owner' && (
                                <>
                                  {['admin', 'editor', 'viewer'].filter(r => r !== member.role).map(role => (
                                    <button
                                      key={role}
                                      onClick={() => handleRoleChange(member.id, role as TeamMember['role'])}
                                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.04] transition-colors capitalize"
                                    >
                                      <Shield className="w-3.5 h-3.5" /> Make {role}
                                    </button>
                                  ))}
                                  <div className="h-px bg-surface-100 dark:bg-white/[0.04] my-1" />
                                  <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-danger-500 hover:bg-danger-500/10 transition-colors"
                                  >
                                    <Ban className="w-3.5 h-3.5" /> Remove Member
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite link section */}
      <div className="apple-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1">Share invite link</h3>
            <p className="text-xs text-surface-400 dark:text-surface-500">
              Anyone with this link can join your workspace with Editor role
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-100/50 dark:bg-white/[0.04] border border-surface-200/30 dark:border-white/[0.04]">
              <Link className="w-3.5 h-3.5 text-surface-400" />
              <span className="text-xs text-surface-500 dark:text-surface-400 font-mono">momentum.ai/join/abc123</span>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText('https://momentum.ai/join/abc123'); toast.success('Link copied!'); }}
              className="p-2 rounded-xl bg-surface-100/50 dark:bg-white/[0.06] text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.08] transition-all"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowInviteModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-intelligence-500 flex items-center justify-center shadow-sm">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-surface-900 dark:text-white">Invite Members</h2>
                  <p className="text-xs text-surface-400 dark:text-surface-500">Add people to your workspace</p>
                </div>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email address</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                      placeholder="colleague@company.com"
                      className="apple-input pl-9"
                      autoFocus
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['editor', 'viewer', 'admin'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setInviteRole(role)}
                      className={cn(
                        'px-3 py-2.5 text-sm font-medium rounded-xl border transition-all capitalize',
                        inviteRole === role
                          ? 'bg-brand-500/10 border-brand-500/30 text-brand-500'
                          : 'bg-surface-50/50 dark:bg-white/[0.02] border-surface-200/50 dark:border-white/[0.06] text-surface-600 dark:text-surface-300 hover:bg-surface-100/50 dark:hover:bg-white/[0.04]'
                      )}
                    >
                      {role === 'admin' && <Crown className="w-3.5 h-3.5 mx-auto mb-1" />}
                      {role === 'editor' && <Shield className="w-3.5 h-3.5 mx-auto mb-1" />}
                      {role === 'viewer' && <EyeIcon className="w-3.5 h-3.5 mx-auto mb-1" />}
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
                <AlertCircle className="w-4 h-4 text-surface-400 shrink-0" />
                <p className="text-xs text-surface-400 dark:text-surface-500">
                  They'll receive an email invitation to join your workspace.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-surface-200/50 dark:border-white/[0.06]">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-sm font-semibold rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail.trim()}
                className={cn(
                  'px-4 py-2 text-sm font-semibold rounded-xl transition-all',
                  inviteEmail.trim()
                    ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20'
                    : 'bg-surface-100 dark:bg-white/[0.04] text-surface-400 cursor-not-allowed'
                )}
              >
                <UserPlus className="w-4 h-4 mr-1.5 inline-block" />
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-surface-400 dark:text-surface-500 pt-4">
        <p>You can invite up to 25 members on your current plan. <span className="text-brand-500 font-medium cursor-pointer hover:text-brand-600">Upgrade for unlimited</span></p>
      </div>
    </div>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
