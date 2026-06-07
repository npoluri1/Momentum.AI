'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cn, formatDate } from '@/lib/utils';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Calendar,
  User, AlertCircle, ArrowRight, Zap, Maximize2,
} from 'lucide-react';

interface GanttTask {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  startDate: string;
  endDate: string;
  progress: number;
  parentId?: string;
  subtasks?: GanttTask[];
  dependencies?: string[];
  isMilestone?: boolean;
}

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

function formatShort(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const mockGanttData: GanttTask[] = [
  {
    id: 'g1', title: 'Sales Pipeline', status: 'done', priority: 'high',
    startDate: '2026-06-01', endDate: '2026-06-28', progress: 100,
    subtasks: [
      {
        id: 'g1-1', title: 'Research', status: 'done', priority: 'medium',
        startDate: '2026-06-01', endDate: '2026-06-05', progress: 100,
        assignee: 'Alice',
      },
      {
        id: 'g1-2', title: 'Design', status: 'done', priority: 'high',
        startDate: '2026-06-05', endDate: '2026-06-10', progress: 100,
        assignee: 'Bob', dependencies: ['g1-1'],
      },
      {
        id: 'g1-3', title: 'Develop API', status: 'done', priority: 'urgent',
        startDate: '2026-06-10', endDate: '2026-06-18', progress: 100,
        assignee: 'Charlie', dependencies: ['g1-2'],
      },
      {
        id: 'g1-4', title: 'Integration Tests', status: 'review', priority: 'high',
        startDate: '2026-06-18', endDate: '2026-06-23', progress: 75,
        assignee: 'Alice', dependencies: ['g1-3'],
      },
      {
        id: 'g1-5', title: 'Documentation', status: 'in_progress', priority: 'medium',
        startDate: '2026-06-20', endDate: '2026-06-25', progress: 40,
        assignee: 'Bob', dependencies: ['g1-3'],
      },
      {
        id: 'g1-6', title: 'Staging Deploy', status: 'done', priority: 'high',
        startDate: '2026-06-23', endDate: '2026-06-25', progress: 100,
        assignee: 'Charlie', dependencies: ['g1-4'],
      },
    ],
  },
  {
    id: 'g2', title: 'CRM Integration', status: 'in_progress', priority: 'high',
    startDate: '2026-06-10', endDate: '2026-07-05', progress: 45,
    subtasks: [
      {
        id: 'g2-1', title: 'Data Mapping', status: 'done', priority: 'high',
        startDate: '2026-06-10', endDate: '2026-06-14', progress: 100,
        assignee: 'Alice',
      },
      {
        id: 'g2-2', title: 'Webhook Setup', status: 'in_progress', priority: 'urgent',
        startDate: '2026-06-14', endDate: '2026-06-22', progress: 60,
        assignee: 'Charlie', dependencies: ['g2-1'],
      },
      {
        id: 'g2-3', title: 'Sync Testing', status: 'todo', priority: 'medium',
        startDate: '2026-06-22', endDate: '2026-06-28', progress: 0,
        assignee: 'Bob', dependencies: ['g2-2'],
      },
    ],
  },
  {
    id: 'g3', title: 'Q4 Planning', status: 'todo', priority: 'medium',
    startDate: '2026-06-25', endDate: '2026-07-05', progress: 0,
    assignee: 'Alice',
  },
  {
    id: 'g4', title: 'Milestone: Beta Release', status: 'in_progress', priority: 'urgent',
    startDate: '2026-06-28', endDate: '2026-06-28', progress: 0,
    isMilestone: true,
  },
];

const statusBarColors: Record<string, string> = {
  todo: 'bg-execution-500',
  in_progress: 'bg-brand-500',
  review: 'bg-intelligence-500',
  done: 'bg-memory-500',
};

const statusBarLight: Record<string, string> = {
  todo: 'bg-execution-500/20',
  in_progress: 'bg-brand-500/20',
  review: 'bg-intelligence-500/20',
  done: 'bg-memory-500/20',
};

const priorityIconColor: Record<string, string> = {
  urgent: 'text-danger-500',
  high: 'text-warning-500',
  medium: 'text-execution-500',
  low: 'text-surface-400',
};

type TimeScale = 'days' | 'weeks' | 'months';

function getDates(start: Date, end: Date, scale: TimeScale): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    if (scale === 'days') current.setDate(current.getDate() + 1);
    else if (scale === 'weeks') current.setDate(current.getDate() + 7);
    else current.setMonth(current.getMonth() + 1);
  }
  return dates;
}

function getProjectRange(tasks: GanttTask[]): { start: Date; end: Date } {
  let min = new Date('2026-06-01');
  let max = new Date('2026-07-05');
  const flatten = (ts: GanttTask[]) => {
    ts.forEach(t => {
      const s = new Date(t.startDate);
      const e = new Date(t.endDate);
      if (s < min) min = s;
      if (e > max) max = e;
      if (t.subtasks) flatten(t.subtasks);
    });
  };
  flatten(tasks);
  max.setDate(max.getDate() + 2);
  return { start: min, end: max };
}

export default function GanttPage() {
  const params = useParams();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [timeScale, setTimeScale] = useState<TimeScale>('days');
  const [offset, setOffset] = useState(0);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editDates, setEditDates] = useState({ start: '', end: '' });
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  
  const [tasks, setTasks] = useState<GanttTask[]>([]);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projResp, kanbanResp] = await Promise.all([
          fetch(`/api/v1/projects/${params.id}/`),
          fetch(`/api/v1/projects/${params.id}/kanban/`)
        ]);

        if (!projResp.ok || !kanbanResp.ok) throw new Error('Failed to fetch project data');

        const projData = await projResp.json();
        const kanbanData = await kanbanResp.json();

        setProject(projData);
        
        // Transform kanban lists into Gantt structure
        const ganttTasks: GanttTask[] = kanbanData.map((list: any) => ({
          id: list.id,
          title: list.name,
          status: 'in_progress',
          priority: 'medium',
          startDate: projData.start_date || todayStr,
          endDate: projData.end_date || todayStr,
          progress: 50,
          subtasks: list.tasks.map((t: any) => ({
            id: t.id,
            title: t.title,
            status: t.status,
            priority: t.priority,
            assignee: t.assignee_name || 'Unassigned',
            startDate: t.due_date || todayStr,
            endDate: t.due_date || todayStr,
            progress: t.status === 'done' ? 100 : t.status === 'in_progress' ? 50 : 0,
          }))
        }));
        
        setTasks(ganttTasks);
        setExpanded(new Set(ganttTasks.map(t => t.id)));
      } catch (err) {
        console.error('Error fetching gantt data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchData();
  }, [params.id]);

  const projectName = project?.name || 'Project';

  const allTasks = useMemo(() => {
    const flat: GanttTask[] = [];
    const walk = (ts: GanttTask[]) => {
      ts.forEach(t => {
        flat.push(t);
        if (t.subtasks) walk(t.subtasks);
      });
    };
    walk(tasks);
    return flat;
  }, [tasks]);

  const range = useMemo(() => getProjectRange(tasks), [tasks]);
  
  const headerDates = useMemo(() => {
    const start = new Date(range.start);
    if (offset > 0) start.setDate(start.getDate() + offset);
    const end = new Date(range.end);
    return getDates(start, end, timeScale);
  }, [range, offset, timeScale]);

  const dayWidth = timeScale === 'days' ? 36 : timeScale === 'weeks' ? 100 : 200;
  const headerHeight = 44;

  const taskRows = useMemo(() => {
    const rows: { task: GanttTask; depth: number }[] = [];
    const walk = (ts: GanttTask[], depth: number) => {
      ts.forEach(t => {
        rows.push({ task: t, depth });
        const isExpanded = expanded.has(t.id);
        if (t.subtasks && isExpanded) walk(t.subtasks, depth + 1);
      });
    };
    walk(tasks, 0);
    return rows;
  }, [tasks, expanded]);

  const sidebarWidth = 260;

  const taskBarStyle = useCallback((task: GanttTask) => {
    const start = new Date(task.startDate);
    const left = daysBetween(range.start.toISOString().split('T')[0], task.startDate) * dayWidth;
    const duration = Math.max(1, daysBetween(task.startDate, task.endDate) + 1);
    const width = Math.max(duration * dayWidth, task.isMilestone ? 14 : dayWidth);
    return { left: `${left}px`, width: `${width}px` };
  }, [range, dayWidth]);

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-surface-500 animate-pulse">Scheduling your timeline...</p>
        </div>
      </div>
    );
  }

  const handleDoubleClick = useCallback((task: GanttTask) => {
    setEditingTask(task.id);
    setEditDates({ start: task.startDate, end: task.endDate });
  }, []);

  const handleDateSave = useCallback((taskId: string) => {
    setEditingTask(null);
  }, []);

  const todayOffset = daysBetween(range.start.toISOString().split('T')[0], todayStr);

  const toggleExpand = useCallback((id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{projectName}</h1>
          <p className="text-sm text-surface-500">Timeline / Gantt</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-0.5">
            {(['days', 'weeks', 'months'] as TimeScale[]).map((s) => (
              <button
                key={s}
                onClick={() => setTimeScale(s)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize',
                  timeScale === s
                    ? 'bg-brand-500 text-white'
                    : 'text-surface-500 hover:text-surface-200'
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="w-px h-6 bg-surface-300 dark:bg-surface-700" />
          <button
            onClick={() => setOffset(o => o - (timeScale === 'days' ? 7 : timeScale === 'weeks' ? 28 : 60))}
            className="p-2 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-500 hover:text-surface-200 hover:bg-surface-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setOffset(0)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-surface-300 dark:border-surface-600 text-surface-500 hover:text-surface-200 hover:bg-surface-800"
          >
            Today
          </button>
          <button
            onClick={() => setOffset(o => o + (timeScale === 'days' ? 7 : timeScale === 'weeks' ? 28 : 60))}
            className="p-2 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-500 hover:text-surface-200 hover:bg-surface-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden">
        <div className="flex">
          <div className="flex-shrink-0 border-r border-surface-200/50 dark:border-white/[0.06]" style={{ width: sidebarWidth }}>
            <div className="flex items-center px-4 border-b border-surface-200/50 dark:border-white/[0.06]" style={{ height: headerHeight }}>
              <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Task</span>
            </div>
            {taskRows.map(({ task, depth }) => (
              <div
                key={task.id}
                className="flex items-center gap-2 px-3 border-b border-surface-200/30 dark:border-white/[0.03] hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors"
                style={{ height: 48, paddingLeft: 12 + depth * 16 }}
                onDoubleClick={() => handleDoubleClick(task)}
              >
                {task.subtasks && (
                  <button
                    onClick={() => toggleExpand(task.id)}
                    className="p-0.5 rounded text-surface-400 hover:text-surface-200"
                  >
                    <ChevronRight className={cn('w-3 h-3 transition-transform', expanded.has(task.id) && 'rotate-90')} />
                  </button>
                )}
                {!task.subtasks && <div className="w-4" />}
                {task.isMilestone && <Zap className="w-3.5 h-3.5 text-warning-500 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-surface-900 dark:text-white truncate">{task.title}</p>
                  {task.assignee && (
                    <p className="text-[10px] text-surface-500 truncate">{task.assignee}</p>
                  )}
                </div>
                <AlertCircle className={cn('w-3 h-3 flex-shrink-0', priorityIconColor[task.priority])} />
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-x-auto scrollbar-hide" ref={scrollRef}>
            <div style={{ minWidth: headerDates.length * dayWidth }}>
              <div
                className="flex border-b border-surface-200/50 dark:border-white/[0.06] sticky top-0 z-10 bg-white dark:bg-[#0a0a0f]/90 backdrop-blur-xl"
                style={{ height: headerHeight }}
              >
                {headerDates.map((date, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 flex items-center justify-center border-r border-surface-200/30 dark:border-white/[0.03]"
                    style={{ width: dayWidth }}
                  >
                    <span className={cn(
                      'text-[10px] font-medium',
                      date.toDateString() === today.toDateString()
                        ? 'text-brand-500'
                        : 'text-surface-500'
                    )}>
                      {timeScale === 'days'
                        ? `${date.getMonth() + 1}/${date.getDate()}`
                        : timeScale === 'weeks'
                          ? `W${Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7)}`
                          : date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
                      }
                    </span>
                  </div>
                ))}
              </div>

              <div className="relative">
                {todayOffset >= 0 && (
                  <div
                    className="absolute top-0 bottom-0 w-px bg-danger-500/60 z-20 pointer-events-none"
                    style={{ left: `${todayOffset * dayWidth}px` }}
                  >
                    <div className="absolute -top-0.5 -left-2 w-4 h-4 rounded-full bg-danger-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                )}

                {headerDates.map((date, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 border-l border-surface-200/20 dark:border-white/[0.02] pointer-events-none"
                    style={{ left: `${i * dayWidth}px` }}
                  />
                ))}

                {taskRows.map(({ task }, rowIndex) => {
                  const pos = taskBarStyle(task);
                  const top = rowIndex * 48 + 8;
                  const barHeight = task.isMilestone ? 32 : 28;

                  return (
                    <div key={task.id}>
                      {task.isMilestone ? (
                        <div
                          className="absolute z-10 cursor-pointer group"
                          style={{ left: pos.left, top, transform: 'translateX(-50%)' }}
                          onDoubleClick={() => handleDoubleClick(task)}
                        >
                          <div className="w-4 h-4 rotate-45 bg-warning-500 border-2 border-warning-300 shadow-lg shadow-warning-500/30" />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            'absolute z-10 rounded-full flex items-center gap-1.5 px-2 cursor-pointer group transition-all duration-150',
                            statusBarColors[task.status],
                          )}
                          style={{ left: pos.left, width: pos.width, height: barHeight, top }}
                          onDoubleClick={() => handleDoubleClick(task)}
                        >
                          {task.progress > 0 && (
                            <div
                              className="absolute inset-0 rounded-full opacity-30"
                              style={{
                                width: `${task.progress}%`,
                                background: 'rgba(255,255,255,0.3)',
                              }}
                            />
                          )}
                          {pos.width && parseInt(pos.width) > 50 && (
                            <span className="text-[10px] text-white font-medium truncate relative z-10">
                              {task.title.length > 15 ? task.title.slice(0, 15) + '...' : task.title}
                            </span>
                          )}
                          {task.progress > 0 && parseInt(pos.width) > 80 && (
                            <span className="text-[9px] text-white/70 font-medium relative z-10 ml-auto">
                              {task.progress}%
                            </span>
                          )}
                        </div>
                      )}

                      {task.dependencies?.map(depId => {
                        const depTask = allTasks.find(t => t.id === depId);
                        if (!depTask) return null;
                        const depRow = taskRows.findIndex(r => r.task.id === depId);
                        if (depRow < 0) return null;
                        const depPos = taskBarStyle(depTask);
                        const depEnd = parseInt(depPos.left) + parseInt(depPos.width);
                        const taskLeft = parseInt(pos.left);
                        const depY = depRow * 48 + 24;
                        const taskY = rowIndex * 48 + 24;

                        return (
                          <svg
                            key={`dep-${task.id}-${depId}`}
                            className="absolute inset-0 pointer-events-none z-5"
                            style={{ width: '100%', height: '100%' }}
                          >
                            <path
                              d={`M ${depEnd} ${depY} L ${depEnd + 6} ${depY} L ${depEnd + 6} ${(depY + taskY) / 2} L ${depEnd + 10} ${(depY + taskY) / 2} L ${taskLeft - 4} ${(depY + taskY) / 2} L ${taskLeft - 4} ${taskY - 6} L ${taskLeft} ${taskY}`}
                              fill="none"
                              className="stroke-surface-400 dark:stroke-surface-500"
                              strokeWidth={1.5}
                              strokeDasharray="3 2"
                            />
                            <polygon
                              points={`${taskLeft},${taskY} ${taskLeft - 5},${taskY - 3.5} ${taskLeft - 5},${taskY + 3.5}`}
                              className="fill-surface-400 dark:fill-surface-500"
                            />
                          </svg>
                        );
                      })}

                      {editingTask === task.id && (
                        <div
                          className="absolute z-20 flex items-center gap-1 bg-white dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-1 shadow-xl"
                          style={{ left: `calc(${pos.left} + 4px)`, top: top - 32 }}
                        >
                          <input
                            type="date"
                            value={editDates.start}
                            onChange={(e) => setEditDates(prev => ({ ...prev, start: e.target.value }))}
                            className="text-[10px] bg-transparent border border-surface-200 dark:border-surface-700 rounded px-1 py-0.5 text-surface-900 dark:text-white w-24"
                          />
                          <span className="text-[10px] text-surface-500">→</span>
                          <input
                            type="date"
                            value={editDates.end}
                            onChange={(e) => setEditDates(prev => ({ ...prev, end: e.target.value }))}
                            className="text-[10px] bg-transparent border border-surface-200 dark:border-surface-700 rounded px-1 py-0.5 text-surface-900 dark:text-white w-24"
                          />
                          <button
                            onClick={() => handleDateSave(task.id)}
                            className="p-0.5 rounded bg-brand-500 text-white"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-surface-500 uppercase tracking-wider">Legend</span>
          {[
            { key: 'todo', label: 'To Do', color: 'bg-execution-500' },
            { key: 'in_progress', label: 'In Progress', color: 'bg-brand-500' },
            { key: 'review', label: 'Review', color: 'bg-intelligence-500' },
            { key: 'done', label: 'Done', color: 'bg-memory-500' },
          ].map((l) => (
            <div key={l.key} className="flex items-center gap-1.5">
              <div className={cn('w-2.5 h-2.5 rounded', l.color)} />
              <span className="text-xs text-surface-500">{l.label}</span>
            </div>
          ))}
          <div className="w-px h-4 bg-surface-300 dark:bg-surface-700" />
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-surface-400" style={{ borderTop: '2px dashed #64748b' }} />
            <span className="text-xs text-surface-500">Dependency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rotate-45 bg-warning-500" />
            <span className="text-xs text-surface-500">Milestone</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-px h-4 bg-danger-500/50" />
          <span className="text-xs text-surface-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(todayStr)}
          </span>
        </div>
      </div>
    </div>
  );
}
