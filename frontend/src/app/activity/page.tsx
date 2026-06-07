'use client';

import { useState, useMemo } from 'react';
import { cn, formatRelativeTime, getInitials } from '@/lib/utils';
import {
  Activity, Search, Filter, Calendar, Download,
  ChevronDown, Clock, CheckCircle, MessageSquare, Plus,
  Edit3, Trash2, UserPlus, AtSign, Bot, Workflow,
  TrendingUp, ArrowRight, Star, X, RefreshCw,
  Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LogEvent {
  id: string;
  type: 'created' | 'updated' | 'completed' | 'deleted' | 'commented' | 'assigned' | 'mention'
       | 'agent' | 'workflow' | 'deal' | 'status_change' | 'invite' | 'upload' | 'milestone' | 'approved';
  message: string;
  user: string;
  userId: string;
  timestamp: Date;
  resource?: string;
  details?: string;
}

const allEvents: LogEvent[] = [
  { id: '1', type: 'completed', message: 'completed task "API Integration"', user: 'Sarah Chen', userId: 'u1', timestamp: new Date(Date.now() - 120000), resource: 'Project Alpha', details: 'Task completed in 2.5 hours' },
  { id: '2', type: 'commented', message: 'commented on "Q4 Budget Review"', user: 'Alex Rivera', userId: 'u2', timestamp: new Date(Date.now() - 480000), resource: 'Finance Workspace', details: 'Suggested updating the revenue projections' },
  { id: '3', type: 'deal', message: 'closed deal "Enterprise Plan" worth $24,000', user: 'John Doe', userId: 'u3', timestamp: new Date(Date.now() - 900000), resource: 'CRM Pipeline', details: 'Closed-won stage' },
  { id: '4', type: 'agent', message: 'AI agent "Lead Enricher" processed 45 new leads', user: 'Maria Santos', userId: 'u4', timestamp: new Date(Date.now() - 1800000), resource: 'Sales Agents', details: 'Q2 campaign enrichment' },
  { id: '5', type: 'workflow', message: 'automation "Daily Sync" completed successfully', user: 'David Kim', userId: 'u5', timestamp: new Date(Date.now() - 3600000), resource: 'Automations', details: '3 steps executed in 2.8s' },
  { id: '6', type: 'mention', message: 'mentioned you in "Update pricing page copy"', user: 'Alex Rivera', userId: 'u2', timestamp: new Date(Date.now() - 5400000), resource: 'Marketing', details: '@John check the latest draft' },
  { id: '7', type: 'status_change', message: 'moved "Server Migration" to In Progress', user: 'Priya Sharma', userId: 'u6', timestamp: new Date(Date.now() - 7200000), resource: 'Infrastructure' },
  { id: '8', type: 'assigned', message: 'assigned you to "Mobile App v2"', user: 'Sarah Chen', userId: 'u1', timestamp: new Date(Date.now() - 10800000), resource: 'Engineering' },
  { id: '9', type: 'created', message: 'created project "Q4 Marketing Campaign"', user: 'John Doe', userId: 'u3', timestamp: new Date(Date.now() - 14400000), resource: 'Marketing' },
  { id: '10', type: 'milestone', message: 'reached milestone "Alpha Release"', user: 'Maria Santos', userId: 'u4', timestamp: new Date(Date.now() - 21600000), resource: 'Mobile App v2' },
  { id: '11', type: 'upload', message: 'uploaded "wireframes-v2.fig"', user: 'David Kim', userId: 'u5', timestamp: new Date(Date.now() - 28800000), resource: 'Design Assets' },
  { id: '12', type: 'approved', message: 'approved design for "Landing Page"', user: 'Sarah Chen', userId: 'u1', timestamp: new Date(Date.now() - 43200000), resource: 'Website Redesign' },
  { id: '13', type: 'created', message: 'created task "Database migration plan"', user: 'Priya Sharma', userId: 'u6', timestamp: new Date(Date.now() - 54000000), resource: 'Infrastructure' },
  { id: '14', type: 'updated', message: 'updated "Email template" with new branding', user: 'Alex Rivera', userId: 'u2', timestamp: new Date(Date.now() - 64800000), resource: 'Marketing' },
  { id: '15', type: 'deleted', message: 'archived old project "Legacy Dashboard"', user: 'John Doe', userId: 'u3', timestamp: new Date(Date.now() - 86400000), resource: 'Archived' },
  { id: '16', type: 'invite', message: 'invited "Michael Brown" to the workspace', user: 'John Doe', userId: 'u3', timestamp: new Date(Date.now() - 100800000), resource: 'Team' },
  { id: '17', type: 'agent', message: 'AI agent "Content Writer" published blog post', user: 'Maria Santos', userId: 'u4', timestamp: new Date(Date.now() - 129600000), resource: 'Marketing Agents' },
  { id: '18', type: 'workflow', message: 'workflow "Invoice Generator" ran successfully', user: 'David Kim', userId: 'u5', timestamp: new Date(Date.now() - 172800000), resource: 'Automations' },
  { id: '19', type: 'deal', message: 'moved deal "Acme Corp" to Negotiation', user: 'Sarah Chen', userId: 'u1', timestamp: new Date(Date.now() - 216000000), resource: 'CRM Pipeline', details: '$45k deal' },
  { id: '20', type: 'status_change', message: 'completed sprint "Sprint 12" retrospect', user: 'Priya Sharma', userId: 'u6', timestamp: new Date(Date.now() - 259200000), resource: 'Engineering' },
];

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  created:      { icon: Plus, color: 'text-memory-500', bg: 'bg-memory-500/10', label: 'Created' },
  updated:      { icon: Edit3, color: 'text-brand-500', bg: 'bg-brand-500/10', label: 'Updated' },
  completed:    { icon: CheckCircle, color: 'text-success-500', bg: 'bg-success-500/10', label: 'Completed' },
  deleted:      { icon: Trash2, color: 'text-danger-500', bg: 'bg-danger-500/10', label: 'Deleted' },
  commented:    { icon: MessageSquare, color: 'text-intelligence-500', bg: 'bg-intelligence-500/10', label: 'Commented' },
  assigned:     { icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Assigned' },
  mention:      { icon: AtSign, color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Mention' },
  agent:        { icon: Bot, color: 'text-intelligence-500', bg: 'bg-intelligence-500/10', label: 'Agent Run' },
  workflow:     { icon: Workflow, color: 'text-execution-500', bg: 'bg-execution-500/10', label: 'Workflow' },
  deal:         { icon: TrendingUp, color: 'text-warning-500', bg: 'bg-warning-500/10', label: 'Deal Update' },
  status_change: { icon: ArrowRight, color: 'text-cyan-500', bg: 'bg-cyan-500/10', label: 'Status Change' },
  invite:       { icon: UserPlus, color: 'text-memory-500', bg: 'bg-memory-500/10', label: 'Invite' },
  upload:       { icon: Upload, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Upload' },
  milestone:    { icon: Star, color: 'text-warning-500', bg: 'bg-warning-500/10', label: 'Milestone' },
  approved:     { icon: CheckCircle, color: 'text-success-500', bg: 'bg-success-500/10', label: 'Approved' },
};

const filterOptions = [
  { value: 'all', label: 'All Activity' },
  { value: 'created', label: 'Created' },
  { value: 'completed', label: 'Completed' },
  { value: 'commented', label: 'Comments' },
  { value: 'status_change', label: 'Status Changes' },
  { value: 'agent', label: 'AI Agents' },
  { value: 'workflow', label: 'Workflows' },
  { value: 'deal', label: 'Deals' },
  { value: 'mention', label: 'Mentions' },
  { value: 'upload', label: 'Uploads' },
];

const userColors: Record<string, string> = {
  'Sarah Chen': 'from-brand-500 to-brand-600',
  'Alex Rivera': 'from-violet-500 to-violet-600',
  'John Doe': 'from-amber-500 to-amber-600',
  'Maria Santos': 'from-emerald-500 to-emerald-600',
  'David Kim': 'from-blue-500 to-blue-600',
  'Priya Sharma': 'from-purple-500 to-purple-600',
};

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<LogEvent | null>(null);

  const filteredEvents = useMemo(() => {
    return allEvents.filter(e => {
      const matchesSearch = e.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.resource || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || e.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, filterType]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, LogEvent[]> = {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    filteredEvents.forEach(e => {
      const date = e.timestamp.toDateString();
      let label: string;
      if (date === today) label = 'Today';
      else if (date === yesterday) label = 'Yesterday';
      else label = e.timestamp.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      if (!groups[label]) groups[label] = [];
      groups[label].push(e);
    });
    return groups;
  }, [filteredEvents]);

  const counts = useMemo(() => ({
    total: allEvents.length,
    today: allEvents.filter(e => e.timestamp.toDateString() === new Date().toDateString()).length,
    agents: allEvents.filter(e => e.type === 'agent').length,
    workflows: allEvents.filter(e => e.type === 'workflow').length,
  }), []);

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                <span className="text-xs font-medium text-success-500 bg-success-500/10 px-2.5 py-0.5 rounded-full">Live feed</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white tracking-tight">Activity Log</h1>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Track every action across your workspace</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.success('Activity log exported')}
                className="apple-button-secondary"
              >
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Events', value: counts.total, icon: Activity, gradient: 'from-brand-500 to-rose-500', change: '' },
              { label: 'Today', value: counts.today, icon: Clock, gradient: 'from-memory-500 to-blue-500', change: 'active' },
              { label: 'Agent Runs', value: counts.agents, icon: Bot, gradient: 'from-intelligence-500 to-violet-500', change: '' },
              { label: 'Workflows', value: counts.workflows, icon: Workflow, gradient: 'from-execution-500 to-cyan-500', change: '' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="apple-stat-card" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mb-2.5 shadow-sm', stat.gradient)}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-surface-400">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activity by user, message, or resource..."
                className="apple-input pl-10"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-xl transition-all',
                  filterType !== 'all'
                    ? 'bg-brand-500/10 text-brand-500 border border-brand-500/20'
                    : 'bg-surface-100/80 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 border border-surface-200/50 dark:border-transparent hover:bg-surface-200/50 dark:hover:bg-white/[0.1]'
                )}
              >
                <Filter className="w-4 h-4" />
                {filterType !== 'all' ? typeConfig[filterType]?.label || filterType : 'Filter'}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showFilter && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-xl overflow-hidden border border-surface-200 dark:border-white/[0.06] bg-white dark:bg-surface-800 shadow-xl z-10 max-h-72 overflow-y-auto">
                  {filterOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setFilterType(opt.value); setShowFilter(false); }}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors',
                        filterType === opt.value
                          ? 'text-brand-500 bg-brand-500/10'
                          : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.04]'
                      )}
                    >
                      {opt.label}
                      {filterType === opt.value && <CheckCircle className="w-3 h-3 ml-auto text-brand-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {filterType !== 'all' && (
              <button
                onClick={() => setFilterType('all')}
                className="text-xs font-medium text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {/* Activity Feed */}
          <div className="space-y-6">
            {Object.entries(groupedByDate).length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-surface-400" />
                </div>
                <p className="text-sm text-surface-500 dark:text-surface-400">No activity found matching your filters</p>
              </div>
            ) : (
              Object.entries(groupedByDate).map(([dateLabel, events]) => (
                <div key={dateLabel}>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-3.5 h-3.5 text-surface-400" />
                    <span className="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">{dateLabel}</span>
                    <div className="flex-1 h-px bg-surface-200/50 dark:bg-white/[0.04]" />
                    <span className="text-[10px] text-surface-400">{events.length} events</span>
                  </div>
                  <div className="space-y-1">
                    {events.map((event) => {
                      const config = typeConfig[event.type];
                      const Icon = config?.icon || Activity;
                      return (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                          className={cn(
                            'flex items-start gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer',
                            'hover:bg-surface-50/50 dark:hover:bg-white/[0.03]',
                            selectedEvent?.id === event.id && 'bg-surface-50/50 dark:bg-white/[0.03] ring-1 ring-brand-500/20'
                          )}
                        >
                          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', config?.bg || 'bg-surface-100/50 dark:bg-white/[0.06]')}>
                            <Icon className={cn('w-4 h-4', config?.color || 'text-surface-400')} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className={cn(
                                  'w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-[8px] font-bold shrink-0 shadow-sm',
                                  userColors[event.user] || 'from-brand-500 to-brand-600'
                                )}>
                                  {getInitials(event.user)}
                                </div>
                                <p className="text-sm text-surface-700 dark:text-surface-300">
                                  <span className="font-semibold text-surface-900 dark:text-white">{event.user}</span>
                                  {' '}{event.message}
                                </p>
                              </div>
                              <span className="text-[11px] text-surface-400 dark:text-surface-500 whitespace-nowrap shrink-0">
                                {formatRelativeTime(event.timestamp)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 ml-8">
                              {event.resource && (
                                <span className="text-[10px] text-surface-400 bg-surface-100/50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">{event.resource}</span>
                              )}
                              <span className={cn(
                                'text-[10px] font-medium px-1.5 py-0.5 rounded-md',
                                config?.bg || 'bg-surface-100/50 dark:bg-white/[0.04]',
                                config?.color || 'text-surface-400'
                              )}>
                                {config?.label || event.type}
                              </span>
                            </div>
                            {selectedEvent?.id === event.id && event.details && (
                              <div className="mt-2 ml-8 p-2.5 rounded-lg bg-surface-100/50 dark:bg-white/[0.04] border border-surface-200/30 dark:border-white/[0.04] animate-fade-in">
                                <p className="text-xs text-surface-500 dark:text-surface-400">{event.details}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
