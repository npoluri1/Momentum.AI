'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cn, formatDate } from '@/lib/utils';
import {
  ArrowLeft, Search, Filter, Calendar,
  User, Flag, Clock, ChevronLeft, ChevronRight,
  Circle, Plus, MoreHorizontal, Sparkles,
  Target, CheckCircle2, Zap,
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: 'task' | 'milestone' | 'phase';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  duration?: string;
}

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

const mockEvents: TimelineEvent[] = [
  { id: 'p1', title: 'Phase 1: Foundation', date: '2026-06-01', type: 'phase', status: 'done', priority: 'high', description: 'Core architecture and infrastructure setup' },
  { id: 'm1', title: 'Architecture Sign-off', date: '2026-06-05', type: 'milestone', status: 'done', priority: 'urgent', assignee: 'Alice' },
  { id: 't1', title: 'Design system architecture', date: '2026-06-03', type: 'task', status: 'done', priority: 'high', assignee: 'Alice', duration: '3 days', description: 'Define component hierarchy and design tokens' },
  { id: 't2', title: 'Set up CI/CD pipeline', date: '2026-06-04', type: 'task', status: 'done', priority: 'medium', assignee: 'Bob', duration: '2 days' },
  { id: 't3', title: 'Create database schema', date: '2026-06-06', type: 'task', status: 'done', priority: 'medium', assignee: 'Bob', duration: '2 days' },
  
  { id: 'p2', title: 'Phase 2: Core Features', date: '2026-06-08', type: 'phase', status: 'in_progress', priority: 'high', description: 'Authentication, API, and main features' },
  { id: 'm2', title: 'API v1 Complete', date: '2026-06-15', type: 'milestone', status: 'in_progress', priority: 'urgent', assignee: 'Charlie' },
  { id: 't4', title: 'Implement authentication', date: '2026-06-09', type: 'task', status: 'in_progress', priority: 'urgent', assignee: 'Alice', duration: '4 days', description: 'OAuth 2.0 with JWT tokens and refresh flow' },
  { id: 't5', title: 'Build API endpoints', date: '2026-06-10', type: 'task', status: 'in_progress', priority: 'high', assignee: 'Charlie', duration: '5 days' },
  { id: 't6', title: 'Code review API layer', date: '2026-06-12', type: 'task', status: 'review', priority: 'high', assignee: 'Alice', duration: '2 days' },
  { id: 't7', title: 'Write unit tests', date: '2026-06-13', type: 'task', status: 'todo', priority: 'medium', assignee: 'Charlie', duration: '3 days' },

  { id: 'p3', title: 'Phase 3: Polish & Launch', date: '2026-06-16', type: 'phase', status: 'todo', priority: 'medium', description: 'Testing, documentation, and deployment' },
  { id: 'm3', title: 'Beta Release', date: '2026-06-20', type: 'milestone', status: 'todo', priority: 'urgent' },
  { id: 't8', title: 'Design landing page', date: '2026-06-16', type: 'task', status: 'review', priority: 'low', assignee: 'Alice', duration: '3 days' },
  { id: 't9', title: 'Test integration flows', date: '2026-06-17', type: 'task', status: 'review', priority: 'high', assignee: 'Charlie', duration: '2 days' },
  { id: 't10', title: 'Performance optimization', date: '2026-06-18', type: 'task', status: 'todo', priority: 'medium', assignee: 'Bob', duration: '3 days' },
  { id: 't11', title: 'Write documentation', date: '2026-06-19', type: 'task', status: 'todo', priority: 'low', duration: '2 days' },
  { id: 't12', title: 'User acceptance testing', date: '2026-06-20', type: 'task', status: 'todo', priority: 'high', assignee: 'Charlie', duration: '3 days' },
  
  { id: 'm4', title: '🚀 Production Launch', date: '2026-06-25', type: 'milestone', status: 'todo', priority: 'urgent', description: 'Go-live date' },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  todo: { label: 'To Do', color: 'text-execution-500', bg: 'bg-execution-500' },
  in_progress: { label: 'In Progress', color: 'text-brand-500', bg: 'bg-brand-500' },
  review: { label: 'Review', color: 'text-intelligence-500', bg: 'bg-intelligence-500' },
  done: { label: 'Done', color: 'text-memory-500', bg: 'bg-memory-500' },
};

const typeConfig: Record<string, { bg: string; gradient: string }> = {
  task: { bg: 'bg-surface-100 dark:bg-white/[0.06]', gradient: 'from-brand-500/10 to-intelligence-500/10' },
  milestone: { bg: 'bg-amber-50 dark:bg-amber-500/10', gradient: 'from-amber-500 to-amber-600' },
  phase: { bg: 'bg-brand-50 dark:bg-brand-500/10', gradient: 'from-brand-500 to-brand-600' },
};

const priorityColors: Record<string, string> = {
  urgent: 'text-danger-500',
  high: 'text-warning-500',
  medium: 'text-execution-500',
  low: 'text-surface-400',
};

export default function TimelinePage() {
  const params = useParams();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      setEvents(mockEvents);
      setProject({ name: 'Project Alpha' });
      setLoading(false);
    }
  }, [params.id]);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      return true;
    });
  }, [events, search, statusFilter]);

  const groupedByPhase = useMemo(() => {
    const groups: { phase: TimelineEvent; items: TimelineEvent[] }[] = [];
    let currentPhase: TimelineEvent | null = null;
    let currentItems: TimelineEvent[] = [];

    filteredEvents.forEach(e => {
      if (e.type === 'phase') {
        if (currentPhase) {
          groups.push({ phase: currentPhase, items: currentItems });
        }
        currentPhase = e;
        currentItems = [];
      } else {
        currentItems.push(e);
      }
    });
    if (currentPhase) {
      groups.push({ phase: currentPhase, items: currentItems });
    }
    return groups;
  }, [filteredEvents]);

  const todayOffset = events.length > 0 ? events.findIndex(e => e.date >= todayStr) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-surface-500 animate-pulse">Loading timeline...</p>
        </div>
      </div>
    );
  }

  const projectName = project?.name || 'Project';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{projectName}</h1>
          <p className="text-sm text-surface-500">Timeline · {events.filter(e => e.type !== 'phase').length} events</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search timeline..."
              className="pl-9 pr-4 py-2 text-sm rounded-xl border border-surface-200 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 w-48"
            />
          </div>
          <div className="flex items-center gap-1 bg-surface-100 dark:bg-white/[0.06] rounded-xl p-0.5 border border-surface-200 dark:border-white/[0.06]">
            <button onClick={() => setViewMode('timeline')} className={cn('px-3 py-1.5 text-xs font-medium rounded-lg transition-all', viewMode === 'timeline' ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm' : 'text-surface-400')}>Timeline</button>
            <button onClick={() => setViewMode('list')} className={cn('px-3 py-1.5 text-xs font-medium rounded-lg transition-all', viewMode === 'list' ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm' : 'text-surface-400')}>List</button>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {['all', 'todo', 'in_progress', 'review', 'done'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap',
                  statusFilter === s
                    ? 'bg-surface-900 dark:bg-white text-white dark:text-surface-900 shadow-md'
                    : 'bg-white dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 border border-surface-200 dark:border-white/[0.08] hover:bg-surface-50'
                )}
              >
                {s === 'all' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline or List View */}
      {viewMode === 'timeline' ? (
        <div className="space-y-8">
          {groupedByPhase.map(({ phase, items }, gi) => {
            const phaseStatus = statusConfig[phase.status];
            return (
              <div key={phase.id}>
                {/* Phase Header */}
                <div className="relative mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn('w-2 h-2 rounded-full', phaseStatus.bg)} />
                    <h3 className="text-lg font-bold text-surface-900 dark:text-white">{phase.title}</h3>
                    <span className={cn('px-2.5 py-0.5 text-[10px] font-semibold rounded-full border', phaseStatus.color.replace('text-', 'text-'), `${phaseStatus.bg}/10 border-${phaseStatus.bg}/25`)}>
                      {phaseStatus.label}
                    </span>
                  </div>
                  {phase.description && (
                    <p className="text-sm text-surface-500 ml-5">{phase.description}</p>
                  )}
                  <div className="mt-2 ml-5 text-xs text-surface-400 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {formatDate(phase.date)}
                  </div>
                </div>

                {/* Timeline items */}
                <div className="relative ml-6">
                  <div className="absolute left-[7px] top-3 bottom-3 w-px bg-surface-200 dark:bg-white/[0.08]" />

                  <div className="space-y-4">
                    {items.map((event, ei) => {
                      const typeStyle = typeConfig[event.type];
                      const statusStyle = statusConfig[event.status];
                      const isOverdue = event.date < todayStr && event.status !== 'done' && event.type !== 'phase';
                      const isToday = event.date === todayStr;
                      const isSelected = selectedEvent?.id === event.id;

                      return (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(isSelected ? null : event)}
                          className={cn(
                            'relative pl-8 cursor-pointer group',
                            isOverdue && 'opacity-80'
                          )}
                        >
                          {/* Dot */}
                          <div className="absolute left-0 top-3">
                            {event.type === 'milestone' ? (
                              <div className={cn(
                                'w-[17px] h-[17px] rotate-45 border-2 flex items-center justify-center',
                                event.status === 'done' ? 'bg-memory-500 border-memory-300' :
                                event.status === 'in_progress' ? 'bg-brand-500 border-brand-300' :
                                'bg-white dark:bg-[#0a0a0f] border-surface-300 dark:border-white/[0.15]'
                              )}>
                                {event.status === 'done' && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                            ) : (
                              <div className={cn(
                                'w-[15px] h-[15px] rounded-full border-2',
                                event.status === 'done' ? 'bg-memory-500 border-memory-300' :
                                event.status === 'in_progress' ? 'bg-brand-500 border-brand-300' :
                                'bg-white dark:bg-[#0a0a0f] border-surface-300 dark:border-white/[0.15]'
                              )} />
                            )}
                          </div>

                          {/* Card */}
                          <div className={cn(
                            'p-4 rounded-2xl border transition-all',
                            isSelected
                              ? 'border-brand-500/30 ring-2 ring-brand-500/20 bg-brand-500/5'
                              : isOverdue
                                ? 'border-danger-500/20 bg-danger-500/5'
                                : 'border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03]'
                          )}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  {event.type === 'milestone' && <Zap className="w-4 h-4 text-amber-500" />}
                                  <h4 className={cn(
                                    'text-sm font-semibold',
                                    event.type === 'milestone' ? 'text-amber-600 dark:text-amber-400' : 'text-surface-900 dark:text-white'
                                  )}>
                                    {event.title}
                                  </h4>
                                  {event.type === 'milestone' && (
                                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">Milestone</span>
                                  )}
                                </div>

                                {event.description && (
                                  <p className="text-xs text-surface-500 mt-1 line-clamp-2">{event.description}</p>
                                )}

                                <div className="flex items-center gap-3 mt-2 text-xs text-surface-400">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(event.date)}
                                    {isToday && <span className="text-brand-500 font-medium ml-1">Today</span>}
                                  </span>
                                  {event.assignee && (
                                    <span className="flex items-center gap-1">
                                      <User className="w-3 h-3" />
                                      {event.assignee}
                                    </span>
                                  )}
                                  {event.duration && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {event.duration}
                                    </span>
                                  )}
                                  <span className={cn('flex items-center gap-1', priorityColors[event.priority])}>
                                    <Flag className="w-3 h-3" />
                                    {event.priority}
                                  </span>
                                  {isOverdue && (
                                    <span className="text-danger-500 font-medium flex items-center gap-0.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-danger-500" />
                                      Overdue
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className={cn('px-2 py-0.5 text-[10px] font-semibold rounded-full border', statusStyle.color.replace('text-', 'text-'), `${statusStyle.bg}/10 border-${statusStyle.bg}/25`)}>
                                  {statusStyle.label}
                                </span>
                                <button className="p-1 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all opacity-0 group-hover:opacity-100">
                                  <MoreHorizontal className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Progress indicator for tasks */}
                            {event.type === 'task' && (
                              <div className="mt-3 flex items-center gap-2">
                                <div className="flex-1 h-1 rounded-full bg-surface-200 dark:bg-white/[0.06] overflow-hidden">
                                  <div className={cn(
                                    'h-full rounded-full',
                                    event.status === 'done' ? 'bg-memory-500' :
                                    event.status === 'in_progress' ? 'bg-brand-500' :
                                    event.status === 'review' ? 'bg-intelligence-500' :
                                    'bg-execution-500/50'
                                  )} style={{ width: event.status === 'done' ? '100%' : event.status === 'review' ? '75%' : event.status === 'in_progress' ? '40%' : '0%' }} />
                                </div>
                                <span className="text-[10px] text-surface-400">
                                  {event.status === 'done' ? 'Done' : event.status === 'review' ? '75%' : event.status === 'in_progress' ? '40%' : '0%'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {groupedByPhase.length === 0 && (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-7 h-7 text-surface-400" />
              </div>
              <p className="text-sm text-surface-500">No events match your filters</p>
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {filteredEvents.filter(e => e.type !== 'phase').map((event, i) => {
            const statusStyle = statusConfig[event.status];
            const isOverdue = event.date < todayStr && event.status !== 'done';
            return (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all',
                  selectedEvent?.id === event.id
                    ? 'border-brand-500/30 ring-2 ring-brand-500/20 bg-brand-500/5'
                    : 'border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03]'
                )}
              >
                <div className={cn(
                  'w-3 h-3 rounded-full shrink-0',
                  event.type === 'milestone' ? 'bg-amber-500' : statusStyle.bg
                )} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {event.type === 'milestone' && <Zap className="w-3.5 h-3.5 text-amber-500" />}
                    <span className="text-sm font-medium text-surface-900 dark:text-white">{event.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-400 mt-0.5">
                    <span>{formatDate(event.date)}</span>
                    {event.assignee && <><span className="w-1 h-1 rounded-full bg-surface-300" /><span>{event.assignee}</span></>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('px-2 py-0.5 text-[10px] font-semibold rounded-full border', statusStyle.color.replace('text-', 'text-'), `${statusStyle.bg}/10 border-${statusStyle.bg}/25`)}>
                    {statusStyle.label}
                  </span>
                  {isOverdue && <span className="text-[10px] text-danger-500 font-medium">Overdue</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4 text-xs text-surface-400">
          <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-memory-500" /> Done</span>
          <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-brand-500" /> In Progress</span>
          <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-intelligence-500" /> Review</span>
          <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-execution-500" /> To Do</span>
          <span className="w-px h-4 bg-surface-300 dark:bg-white/[0.08]" />
          <span className="flex items-center gap-1.5"><div className="w-3 h-3 rotate-45 bg-amber-500" /> Milestone</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-surface-400">
          <Calendar className="w-3 h-3" />
          {formatDate(todayStr)}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" onClick={() => setSelectedEvent(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-96 animate-slide-up rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/90 backdrop-blur-xl p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {selectedEvent.type === 'milestone' ? (
                  <Zap className="w-4 h-4 text-amber-500" />
                ) : (
                  <Circle className={cn('w-4 h-4', statusConfig[selectedEvent.status].color)} />
                )}
                <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  {selectedEvent.type === 'milestone' ? 'Milestone' : selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                </span>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="p-1 rounded text-surface-400 hover:text-surface-600">✕</button>
            </div>
            <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-3">{selectedEvent.title}</h3>
            {selectedEvent.description && (
              <p className="text-sm text-surface-500 mb-4">{selectedEvent.description}</p>
            )}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-500">Status</span>
                <span className={cn('px-2 py-0.5 text-xs font-semibold rounded-full border', statusConfig[selectedEvent.status].color.replace('text-', 'text-'), `${statusConfig[selectedEvent.status].bg}/10 border-${statusConfig[selectedEvent.status].bg}/25`)}>
                  {statusConfig[selectedEvent.status].label}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-500">Date</span>
                <span className="flex items-center gap-1.5 text-surface-700 dark:text-surface-300">
                  <Calendar className="w-3.5 h-3.5 text-surface-400" />
                  {formatDate(selectedEvent.date)}
                </span>
              </div>
              {selectedEvent.assignee && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-surface-500">Assignee</span>
                  <span className="flex items-center gap-1.5 text-surface-700 dark:text-surface-300">
                    <User className="w-3.5 h-3.5 text-surface-400" />
                    {selectedEvent.assignee}
                  </span>
                </div>
              )}
              {selectedEvent.duration && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-surface-500">Duration</span>
                  <span className="flex items-center gap-1.5 text-surface-700 dark:text-surface-300">
                    <Clock className="w-3.5 h-3.5 text-surface-400" />
                    {selectedEvent.duration}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-500">Priority</span>
                <span className={cn('flex items-center gap-1.5', priorityColors[selectedEvent.priority])}>
                  <Flag className="w-3.5 h-3.5" />
                  {selectedEvent.priority}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
