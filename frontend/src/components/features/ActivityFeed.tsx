'use client';

import { useState, useMemo } from 'react';
import { cn, formatRelativeTime, getInitials } from '@/lib/utils';
import {
  Activity, CheckCircle2, MessageSquare, UserPlus, AtSign,
  Bot, Workflow, TrendingUp, Edit3, Trash2, Plus, ArrowRight,
  GitBranch, Star, Clock, Filter, ChevronDown, Calendar,
} from 'lucide-react';
import type { User } from '@/lib/types';

interface ActivityEvent {
  id: string;
  type: 'created' | 'updated' | 'completed' | 'commented' | 'assigned' | 'mention'
       | 'agent' | 'workflow' | 'deal' | 'status_change' | 'invite' | 'upload'
       | 'milestone' | 'approved';
  message: string;
  user: { id: string; name: string; avatar?: string };
  timestamp: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

interface ActivityFeedProps {
  events: ActivityEvent[];
  maxItems?: number;
  showFilter?: boolean;
  compact?: boolean;
  className?: string;
  onEventClick?: (event: ActivityEvent) => void;
}

const typeConfig: Record<string, { icon: typeof Activity; color: string; bg: string }> = {
  created:     { icon: Plus, color: 'text-memory-500', bg: 'bg-memory-500/10' },
  updated:     { icon: Edit3, color: 'text-brand-500', bg: 'bg-brand-500/10' },
  completed:   { icon: CheckCircle2, color: 'text-success-500', bg: 'bg-success-500/10' },
  commented:   { icon: MessageSquare, color: 'text-intelligence-500', bg: 'bg-intelligence-500/10' },
  assigned:    { icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  mention:     { icon: AtSign, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  agent:       { icon: Bot, color: 'text-intelligence-500', bg: 'bg-intelligence-500/10' },
  workflow:    { icon: Workflow, color: 'text-execution-500', bg: 'bg-execution-500/10' },
  deal:        { icon: TrendingUp, color: 'text-warning-500', bg: 'bg-warning-500/10' },
  status_change: { icon: ArrowRight, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  invite:      { icon: UserPlus, color: 'text-memory-500', bg: 'bg-memory-500/10' },
  upload:      { icon: Plus, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  milestone:   { icon: Star, color: 'text-warning-500', bg: 'bg-warning-500/10' },
  approved:    { icon: CheckCircle2, color: 'text-success-500', bg: 'bg-success-500/10' },
};

const filterOptions = [
  { value: 'all', label: 'All Activity' },
  { value: 'created', label: 'Created' },
  { value: 'commented', label: 'Comments' },
  { value: 'completed', label: 'Completed' },
  { value: 'status_change', label: 'Status Changes' },
  { value: 'agent', label: 'AI Agents' },
  { value: 'workflow', label: 'Workflows' },
  { value: 'mention', label: 'Mentions' },
];

export default function ActivityFeed({
  events,
  maxItems = 20,
  showFilter = true,
  compact = false,
  className,
  onEventClick,
}: ActivityFeedProps) {
  const [filter, setFilter] = useState('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filteredEvents = useMemo(() => {
    const filtered = filter === 'all'
      ? events
      : events.filter(e => e.type === filter);
    return filtered.slice(0, maxItems);
  }, [events, filter, maxItems]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, ActivityEvent[]> = {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    filteredEvents.forEach(event => {
      const date = new Date(event.timestamp).toDateString();
      let label: string;
      if (date === today) label = 'Today';
      else if (date === yesterday) label = 'Yesterday';
      else label = new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      if (!groups[label]) groups[label] = [];
      groups[label].push(event);
    });
    return groups;
  }, [filteredEvents]);

  if (events.length === 0) {
    return (
      <div className={cn('text-center py-10', className)}>
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center">
          <Activity className="w-7 h-7 text-surface-400" />
        </div>
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1">No activity yet</h3>
        <p className="text-xs text-surface-400 dark:text-surface-500">
          Activity from your team will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with filter */}
      {showFilter && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Activity</h3>
            <span className="text-xs text-surface-400 dark:text-surface-500 font-medium">
              {filteredEvents.length} events
            </span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-surface-500 dark:text-surface-400 hover:bg-surface-100/50 dark:hover:bg-white/[0.04] transition-all"
            >
              <Filter className="w-3.5 h-3.5" />
              {filterOptions.find(f => f.value === filter)?.label || 'Filter'}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-1 w-44 rounded-xl overflow-hidden border border-surface-200 dark:border-white/[0.06] bg-white dark:bg-surface-800 shadow-xl z-10 animate-fade-in">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setFilter(opt.value); setShowFilterDropdown(false); }}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors',
                      filter === opt.value
                        ? 'text-brand-500 bg-brand-500/10'
                        : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.04]'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activity list grouped by date */}
      <div className="space-y-5">
        {Object.entries(groupedByDate).map(([dateLabel, dateEvents]) => (
          <div key={dateLabel}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3 h-3 text-surface-400" />
              <span className="text-[11px] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                {dateLabel}
              </span>
              <div className="flex-1 h-px bg-surface-200/50 dark:bg-white/[0.04]" />
            </div>

            <div className="space-y-1">
              {dateEvents.map((event, index) => {
                const config = typeConfig[event.type] || typeConfig.updated;
                const Icon = config.icon;

                return (
                  <div
                    key={event.id || index}
                    onClick={() => onEventClick?.(event)}
                    className={cn(
                      'flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer',
                      'hover:bg-surface-50/50 dark:hover:bg-white/[0.03]',
                      compact && 'py-2'
                    )}
                  >
                    {/* Icon */}
                    <div className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm',
                      config.bg
                    )}>
                      <Icon className={cn('w-4 h-4', config.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="shrink-0">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-[9px] font-bold">
                              {getInitials(event.user.name)}
                            </div>
                          </div>
                          <p className={cn(
                            'text-sm leading-snug',
                            compact ? 'text-surface-600 dark:text-surface-400' : 'text-surface-700 dark:text-surface-300'
                          )}>
                            <span className="font-semibold text-surface-900 dark:text-white">
                              {event.user.name}
                            </span>
                            {!compact && (
                              <span className="text-surface-500 dark:text-surface-400">
                                {' '}{event.message}
                              </span>
                            )}
                          </p>
                        </div>
                        <span className="text-[11px] text-surface-400 dark:text-surface-500 whitespace-nowrap shrink-0">
                          {formatRelativeTime(event.timestamp)}
                        </span>
                      </div>
                      {compact && (
                        <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 ml-7 line-clamp-1">
                          {event.message}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {events.length > maxItems && (
        <div className="text-center pt-2">
          <button className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors">
            View all activity
          </button>
        </div>
      )}
    </div>
  );
}

// Sample activity data for demo/preview
export const sampleActivity: ActivityEvent[] = [
  { id: 'a1', type: 'completed', message: 'completed task "API Integration"', user: { id: 'u1', name: 'Sarah Chen' }, timestamp: new Date(Date.now() - 120000).toISOString() },
  { id: 'a2', type: 'commented', message: 'commented on "Q4 Budget Review"', user: { id: 'u2', name: 'Alex Rivera' }, timestamp: new Date(Date.now() - 480000).toISOString() },
  { id: 'a3', type: 'deal', message: 'closed deal "Enterprise Plan" worth $24,000', user: { id: 'u3', name: 'John Doe' }, timestamp: new Date(Date.now() - 900000).toISOString() },
  { id: 'a4', type: 'agent', message: 'AI agent "Lead Enricher" processed 45 new leads', user: { id: 'u4', name: 'Maria Santos' }, timestamp: new Date(Date.now() - 1800000).toISOString() },
  { id: 'a5', type: 'workflow', message: 'automation "Daily Sync" completed successfully', user: { id: 'u5', name: 'David Kim' }, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'a6', type: 'mention', message: 'mentioned you in "Update pricing page copy"', user: { id: 'u2', name: 'Alex Rivera' }, timestamp: new Date(Date.now() - 5400000).toISOString() },
  { id: 'a7', type: 'status_change', message: 'moved "Server Migration" to In Progress', user: { id: 'u6', name: 'Priya Sharma' }, timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 'a8', type: 'assigned', message: 'assigned you to "Mobile App v2"', user: { id: 'u1', name: 'Sarah Chen' }, timestamp: new Date(Date.now() - 10800000).toISOString() },
  { id: 'a9', type: 'created', message: 'created project "Q4 Marketing Campaign"', user: { id: 'u3', name: 'John Doe' }, timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: 'a10', type: 'milestone', message: 'reached milestone "Alpha Release"', user: { id: 'u4', name: 'Maria Santos' }, timestamp: new Date(Date.now() - 21600000).toISOString() },
  { id: 'a11', type: 'upload', message: 'uploaded "wireframes-v2.fig"', user: { id: 'u5', name: 'David Kim' }, timestamp: new Date(Date.now() - 28800000).toISOString() },
  { id: 'a12', type: 'approved', message: 'approved design for "Landing Page"', user: { id: 'u1', name: 'Sarah Chen' }, timestamp: new Date(Date.now() - 43200000).toISOString() },
];
