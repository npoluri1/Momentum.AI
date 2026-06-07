'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, Users, UserPlus, Search, ChevronDown,
  ChevronRight, Plus, Mail,
  MoreHorizontal, User, Circle,
  Award, Briefcase, Star, Bot,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface OrgMember {
  id: string;
  name: string;
  role: string;
  title: string;
  email: string;
  avatar?: string;
  directReports: string[];
  managerId?: string;
  status: 'active' | 'away' | 'offline';
  skills: string[];
  projects: number;
}

const orgData: Record<string, OrgMember> = {
  'ceo': { id: 'ceo', name: 'Sarah Chen', role: 'CEO', title: 'Chief Executive Officer', email: 'sarah@company.com', directReports: ['cto', 'cmo', 'cfo', 'coo'], status: 'active', skills: ['Leadership', 'Strategy', 'Vision'], projects: 3 },
  'cto': { id: 'cto', name: 'Alex Rivera', role: 'CTO', title: 'Chief Technology Officer', email: 'alex@company.com', directReports: ['vp-eng', 'vp-product'], managerId: 'ceo', status: 'active', skills: ['Engineering', 'Architecture', 'AI'], projects: 5 },
  'cmo': { id: 'cmo', name: 'Maria Santos', role: 'CMO', title: 'Chief Marketing Officer', email: 'maria@company.com', directReports: ['vp-marketing'], managerId: 'ceo', status: 'active', skills: ['Marketing', 'Brand', 'Growth'], projects: 4 },
  'cfo': { id: 'cfo', name: 'David Kim', role: 'CFO', title: 'Chief Financial Officer', email: 'david@company.com', directReports: ['vp-finance'], managerId: 'ceo', status: 'away', skills: ['Finance', 'Operations', 'Planning'], projects: 2 },
  'coo': { id: 'coo', name: 'Priya Sharma', role: 'COO', title: 'Chief Operations Officer', email: 'priya@company.com', directReports: ['vp-hr'], managerId: 'ceo', status: 'active', skills: ['Operations', 'Process', 'Scale'], projects: 3 },
  'vp-eng': { id: 'vp-eng', name: 'James Wilson', role: 'VP Engineering', title: 'VP of Engineering', email: 'james@company.com', directReports: ['eng-lead-1', 'eng-lead-2'], managerId: 'cto', status: 'active', skills: ['Engineering', 'Team Building', 'DevOps'], projects: 4 },
  'vp-product': { id: 'vp-product', name: 'Emma Thompson', role: 'VP Product', title: 'VP of Product', email: 'emma@company.com', directReports: ['pm-1', 'pm-2'], managerId: 'cto', status: 'active', skills: ['Product', 'Strategy', 'Design'], projects: 3 },
  'vp-marketing': { id: 'vp-marketing', name: 'Lisa Park', role: 'VP Marketing', title: 'VP of Marketing', email: 'lisa@company.com', directReports: ['content-lead', 'growth-lead'], managerId: 'cmo', status: 'active', skills: ['Demand Gen', 'Content', 'Analytics'], projects: 3 },
  'eng-lead-1': { id: 'eng-lead-1', name: 'Tom Baker', role: 'Engineering Lead', title: 'Frontend Engineering Lead', email: 'tom@company.com', directReports: [], managerId: 'vp-eng', status: 'active', skills: ['React', 'TypeScript', 'UI'], projects: 2 },
  'eng-lead-2': { id: 'eng-lead-2', name: 'Anna Lee', role: 'Engineering Lead', title: 'Backend Engineering Lead', email: 'anna@company.com', directReports: [], managerId: 'vp-eng', status: 'away', skills: ['Python', 'Go', 'Kubernetes'], projects: 2 },
  'pm-1': { id: 'pm-1', name: 'Ryan Cooper', role: 'Product Manager', title: 'Senior Product Manager', email: 'ryan@company.com', directReports: [], managerId: 'vp-product', status: 'active', skills: ['Product', 'Analytics', 'User Research'], projects: 2 },
  'content-lead': { id: 'content-lead', name: 'Mia Johnson', role: 'Content Lead', title: 'Content Marketing Lead', email: 'mia@company.com', directReports: [], managerId: 'vp-marketing', status: 'active', skills: ['Writing', 'SEO', 'Social'], projects: 2 },
  'growth-lead': { id: 'growth-lead', name: 'Noah Brown', role: 'Growth Lead', title: 'Growth Marketing Lead', email: 'noah@company.com', directReports: [], managerId: 'vp-marketing', status: 'offline', skills: ['Growth', 'Experiments', 'CRO'], projects: 1 },
};

const roleColors: Record<string, string> = {
  'CEO': 'from-amber-400 to-amber-600',
  'CTO': 'from-violet-400 to-violet-600',
  'CMO': 'from-blue-400 to-blue-600',
  'CFO': 'from-emerald-400 to-emerald-600',
  'COO': 'from-rose-400 to-rose-600',
  'VP Engineering': 'from-indigo-400 to-indigo-600',
  'VP Product': 'from-purple-400 to-purple-600',
  'VP Marketing': 'from-cyan-400 to-cyan-600',
};

function OrgNode({ member, level = 0 }: { member: OrgMember; level?: number }) {
  const [expanded, setExpanded] = useState(true);
  const reports = member.directReports.map(id => orgData[id]).filter(Boolean);
  const hasReports = reports.length > 0;

  return (
    <div className="relative">
      <div className={cn(
        'flex items-center gap-3 p-3 rounded-xl transition-all border',
        level === 0
          ? 'bg-gradient-to-r from-brand-500/10 to-intelligence-500/5 border-brand-500/20'
          : 'bg-white dark:bg-[#0a0a0f]/40 border-surface-200/50 dark:border-white/[0.06] hover:border-brand-500/20'
      )}>
        {/* Expand/Collapse */}
        {hasReports && (
          <button onClick={() => setExpanded(!expanded)} className="p-0.5 rounded text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        )}
        {!hasReports && <div className="w-4" />}

        {/* Avatar */}
        <div className={cn(
          'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm',
          roleColors[member.role] || 'from-brand-500 to-brand-600'
        )}>
          {member.name.split(' ').map(n => n[0]).join('')}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-surface-900 dark:text-white">{member.name}</p>
            <span className={cn(
              'w-2 h-2 rounded-full',
              member.status === 'active' ? 'bg-success-500' : member.status === 'away' ? 'bg-warning-500' : 'bg-surface-400'
            )} />
            <span className={cn(
              'px-1.5 py-0.5 text-[10px] font-semibold rounded-md',
              level === 0 ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'bg-surface-100 dark:bg-white/[0.06] text-surface-500'
            )}>
              {member.role}
            </span>
          </div>
          <p className="text-xs text-surface-500 mt-0.5">{member.title}</p>
        </div>

        {/* Skills */}
        <div className="hidden md:flex items-center gap-1.5">
          {member.skills.slice(0, 3).map(s => (
            <span key={s} className="px-1.5 py-0.5 text-[9px] font-medium rounded-md bg-surface-100 dark:bg-white/[0.04] text-surface-400">{s}</span>
          ))}
        </div>

        {/* Actions */}
        <button className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Children */}
      {expanded && hasReports && (
        <div className="ml-6 mt-2 space-y-2 border-l-2 border-surface-200/50 dark:border-white/[0.06] pl-4">
          {reports.map(report => (
            <OrgNode key={report.id} member={report} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrgChartPage() {
  const params = useParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');
  const [selectedMember, setSelectedMember] = useState<OrgMember | null>(null);

  const rootMembers = Object.values(orgData).filter(m => !m.managerId);

  const filteredRoot = rootMembers.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-surface-900 dark:text-white">Organization Chart</h1>
            <p className="text-xs text-surface-500">{Object.keys(orgData).length} team members</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-surface-100/80 dark:bg-white/[0.06] border border-surface-200/50 dark:border-transparent text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 w-48"
            />
          </div>
          <div className="flex items-center bg-surface-100/80 dark:bg-white/[0.06] rounded-lg p-0.5">
            <button onClick={() => setViewMode('tree')} className={cn('px-2.5 py-1 text-xs font-medium rounded-md transition-all', viewMode === 'tree' ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm' : 'text-surface-400')}>
              Tree
            </button>
            <button onClick={() => setViewMode('grid')} className={cn('px-2.5 py-1 text-xs font-medium rounded-md transition-all', viewMode === 'grid' ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm' : 'text-surface-400')}>
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Members', value: Object.keys(orgData).length, icon: Users, color: 'text-brand-500' },
          { label: 'Active Now', value: Object.values(orgData).filter(m => m.status === 'active').length, icon: Circle, color: 'text-success-500' },
          { label: 'Departments', value: [...new Set(Object.values(orgData).map(m => m.role))].length, icon: Briefcase, color: 'text-intelligence-500' },
          { label: 'Openings', value: 3, icon: UserPlus, color: 'text-warning-500' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="apple-stat-card" style={{ animationDelay: `${i * 60}ms` }}>
              <Icon className={cn('w-4 h-4 mb-2', stat.color)} />
              <p className="text-xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-surface-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Org Chart */}
      <div className="apple-card p-4 md:p-6">
        {viewMode === 'tree' ? (
          <div className="space-y-3">
            {filteredRoot.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                <p className="text-sm text-surface-500">No matching members found</p>
              </div>
            ) : (
              filteredRoot.map(root => (
                <OrgNode key={root.id} member={root} level={0} />
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.values(orgData).filter(m =>
              m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              m.role.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(member => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="p-4 rounded-xl border border-surface-200/50 dark:border-white/[0.06] hover:border-brand-500/20 hover:bg-brand-500/5 transition-all cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center mb-3">
                  <div className={cn(
                    'w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-lg font-bold mb-2 shadow-sm',
                    roleColors[member.role] || 'from-brand-500 to-brand-600'
                  )}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <p className="text-sm font-bold text-surface-900 dark:text-white">{member.name}</p>
                  <p className="text-[10px] text-surface-500">{member.role}</p>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  {member.skills.slice(0, 2).map(s => (
                    <span key={s} className="px-1.5 py-0.5 text-[9px] font-medium rounded-md bg-surface-100 dark:bg-white/[0.04] text-surface-400">{s}</span>
                  ))}
                  <span className={cn('w-2 h-2 rounded-full', member.status === 'active' ? 'bg-success-500' : member.status === 'away' ? 'bg-warning-500' : 'bg-surface-400')} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Person Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedMember(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-2xl animate-scale-in overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-500/10 to-intelligence-500/10 p-6 text-center">
              <div className={cn(
                'w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-md',
                roleColors[selectedMember.role] || 'from-brand-500 to-brand-600'
              )}>
                {selectedMember.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-xl font-bold text-surface-900 dark:text-white">{selectedMember.name}</h2>
              <p className="text-sm text-surface-500">{selectedMember.title}</p>
              <span className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-full mt-2 inline-block border',
                selectedMember.role === 'CEO' ? 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10' :
                selectedMember.role.startsWith('VP') ? 'border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' :
                'border-surface-300 dark:border-white/[0.12] text-surface-500 bg-surface-100 dark:bg-white/[0.04]'
              )}>
                {selectedMember.role}
              </span>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03]">
                <Mail className="w-4 h-4 text-surface-400" />
                <span className="text-sm text-surface-600 dark:text-surface-400">{selectedMember.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03]">
                <Award className="w-4 h-4 text-surface-400" />
                <div className="flex flex-wrap gap-1.5">
                  {selectedMember.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03]">
                <Bot className="w-4 h-4 text-surface-400" />
                <span className="text-sm text-surface-600 dark:text-surface-400">{selectedMember.projects} active projects</span>
              </div>
              {selectedMember.managerId && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03]">
                  <Users className="w-4 h-4 text-surface-400" />
                  <span className="text-sm text-surface-600 dark:text-surface-400">Reports to: {orgData[selectedMember.managerId]?.name}</span>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-surface-200/50 dark:border-white/[0.06]">
              <button onClick={() => setSelectedMember(null)} className="px-4 py-2 text-sm font-semibold rounded-xl text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">Close</button>
              <button onClick={() => { toast.success(`Message ${selectedMember.name}`); setSelectedMember(null); }} className="apple-button-primary"><Mail className="w-4 h-4" /> Message</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
