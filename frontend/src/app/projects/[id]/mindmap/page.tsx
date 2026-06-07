'use client';

import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, ZoomIn, ZoomOut, Maximize2, Minimize2,
  Search, X, Filter, User, AlertCircle, Info,
} from 'lucide-react';

interface TaskNode {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: { name: string };
  description?: string;
}

const mockTasks: TaskNode[] = [
  { id: '1', title: 'Research requirements', status: 'todo', priority: 'high', assignee: { name: 'Alice' } },
  { id: '2', title: 'Design system architecture', status: 'todo', priority: 'urgent', assignee: { name: 'Bob' } },
  { id: '3', title: 'Set up CI/CD pipeline', status: 'todo', priority: 'medium' },
  { id: '4', title: 'Implement authentication', status: 'in_progress', priority: 'high', assignee: { name: 'Alice' } },
  { id: '5', title: 'Build API endpoints', status: 'in_progress', priority: 'urgent', assignee: { name: 'Charlie' } },
  { id: '6', title: 'Create database schema', status: 'in_progress', priority: 'medium', assignee: { name: 'Bob' } },
  { id: '7', title: 'Code review API layer', status: 'review', priority: 'high', assignee: { name: 'Alice' } },
  { id: '8', title: 'Test integration flows', status: 'review', priority: 'medium', assignee: { name: 'Charlie' } },
  { id: '9', title: 'Write documentation', status: 'review', priority: 'low' },
  { id: '10', title: 'Deploy to staging', status: 'done', priority: 'high', assignee: { name: 'Bob' } },
  { id: '11', title: 'User acceptance testing', status: 'done', priority: 'medium', assignee: { name: 'Charlie' } },
  { id: '12', title: 'Production rollout', status: 'done', priority: 'urgent', assignee: { name: 'Alice' } },
];

const statusConfig = [
  { id: 'todo', label: 'To Do', color: 'text-execution-500', lineColor: 'stroke-execution-500', bg: 'bg-execution-500/10 border-execution-500/30' },
  { id: 'in_progress', label: 'In Progress', color: 'text-brand-500', lineColor: 'stroke-brand-500', bg: 'bg-brand-500/10 border-brand-500/30' },
  { id: 'review', label: 'Review', color: 'text-intelligence-500', lineColor: 'stroke-intelligence-500', bg: 'bg-intelligence-500/10 border-intelligence-500/30' },
  { id: 'done', label: 'Done', color: 'text-memory-500', lineColor: 'stroke-memory-500', bg: 'bg-memory-500/10 border-memory-500/30' },
];

const priorityBadge: Record<string, string> = {
  urgent: 'bg-danger-500/20 text-danger-400 border-danger-500/30',
  high: 'bg-warning-500/20 text-warning-400 border-warning-500/30',
  medium: 'bg-execution-500/20 text-execution-400 border-execution-500/30',
  low: 'bg-surface-500/20 text-surface-400 border-surface-500/30',
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function generateCurvePath(x1: number, y1: number, x2: number, y2: number) {
  const midY = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}

export default function MindMapPage() {
  const params = useParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedTask, setSelectedTask] = useState<TaskNode | null>(null);
  const [showMinimap, setShowMinimap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [tasks, setTasks] = useState<TaskNode[]>([]);
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
        
        // Flatten tasks from kanban lists
        const flattenedTasks: TaskNode[] = [];
        kanbanData.forEach((list: any) => {
          list.tasks.forEach((t: any) => {
            flattenedTasks.push({
              id: t.id,
              title: t.title,
              status: t.status,
              priority: t.priority,
              assignee: t.assignee ? { name: t.assignee_name || 'Assigned' } : undefined,
              description: t.description
            });
          });
        });
        setTasks(flattenedTasks);
      } catch (err) {
        console.error('Error fetching mindmap data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchData();
  }, [params.id]);

  const projectName = project?.name || 'Project';

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    return tasks.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, tasks]);

  const tasksByStatus = useMemo(() => {
    return statusConfig.reduce((acc, col) => {
      acc[col.id] = filteredTasks.filter(t => t.status === col.id);
      return acc;
    }, {} as Record<string, TaskNode[]>);
  }, [filteredTasks]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(z => Math.max(0.25, Math.min(2, z + delta)));
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).closest('[data-pan]')) {
      setDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [dragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const fitToScreen = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const taskPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const rootX = 600;
    const rootY = 300;
    const statusStartX = 300;
    const statusGap = 250;
    const statusY = 300;
    const taskStartY = 400;
    const taskGap = 100;

    positions['root'] = { x: rootX, y: rootY };

    statusConfig.forEach((status, si) => {
      const sx = statusStartX + si * statusGap;
      const sy = statusY + 80;
      positions[`status-${status.id}`] = { x: sx, y: sy };

      const tasks = tasksByStatus[status.id] || [];
      tasks.forEach((task, ti) => {
        positions[`task-${task.id}`] = {
          x: sx,
          y: taskStartY + ti * taskGap,
        };
      });
    });

    return positions;
  }, [tasksByStatus]);

  const lines = useMemo(() => {
    const result: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
    const root = taskPositions['root'];
    if (!root) return result;

    statusConfig.forEach((status) => {
      const sp = taskPositions[`status-${status.id}`];
      if (!sp) return;
      result.push({ x1: root.x + 80, y1: root.y, x2: sp.x, y2: sp.y, color: status.lineColor });

      const tasks = tasksByStatus[status.id] || [];
      tasks.forEach((task) => {
        const tp = taskPositions[`task-${task.id}`];
        if (!tp) return;
        result.push({ x1: sp.x, y1: sp.y + 60, x2: tp.x, y2: tp.y, color: status.lineColor });
      });
    });

    return result;
  }, [taskPositions, tasksByStatus]);

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-surface-500 animate-pulse">Designing your mind map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{projectName}</h1>
          <p className="text-sm text-surface-500">Mind Map</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 w-48"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-200">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button className="p-2 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-500 hover:text-surface-200 hover:bg-surface-800">
            <Filter className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-surface-300 dark:bg-surface-700" />
          <button
            onClick={() => setZoom(z => Math.min(2, z + 0.2))}
            className="p-2 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-500 hover:text-surface-200 hover:bg-surface-800"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-sm text-surface-500 min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.max(0.25, z - 0.2))}
            className="p-2 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-500 hover:text-surface-200 hover:bg-surface-800"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={fitToScreen}
            className="p-2 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-500 hover:text-surface-200 hover:bg-surface-800"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className={cn(
              'p-2 rounded-lg border transition-colors',
              showMinimap
                ? 'border-brand-500/50 text-brand-400 bg-brand-500/10'
                : 'border-surface-300 dark:border-surface-600 text-surface-500 hover:text-surface-200 hover:bg-surface-800'
            )}
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
        <div
          ref={containerRef}
          data-pan
          className={cn(
            'relative w-full h-[600px] overflow-hidden cursor-grab',
            dragging && 'cursor-grabbing'
          )}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className="absolute inset-0 transition-transform duration-75"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: 1200, minHeight: 800 }}>
              {lines.map((line, i) => (
                <path
                  key={i}
                  d={generateCurvePath(line.x1, line.y1, line.x2, line.y2)}
                  fill="none"
                  className={cn('opacity-40', line.color)}
                  strokeWidth={1.5}
                />
              ))}
            </svg>

            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <div className="relative p-[1px] rounded-xl bg-gradient-to-r from-brand-500 via-intelligence-500 to-execution-500 shadow-lg shadow-brand-500/20">
                <div className="px-5 py-3 rounded-xl bg-white dark:bg-[#0a0a0f]">
                  <h3 className="text-sm font-bold text-surface-900 dark:text-white">{projectName}</h3>
                  <p className="text-xs text-surface-500">12 tasks</p>
                </div>
              </div>
            </div>

            {statusConfig.map((status, si) => {
              const sp = taskPositions[`status-${status.id}`];
              if (!sp) return null;
              const tasks = tasksByStatus[status.id] || [];
              return (
                <div key={status.id}>
                  <div
                    className="absolute px-4 py-2 rounded-lg border backdrop-blur-sm cursor-pointer hover:shadow-lg transition-shadow"
                    style={{
                      left: sp.x,
                      top: sp.y,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className={cn('text-sm font-semibold', status.color)}>
                      {status.label}
                    </div>
                    <div className="text-xs text-surface-500 text-center">{tasks.length}</div>
                  </div>

                  {tasks.map((task) => {
                    const tp = taskPositions[`task-${task.id}`];
                    if (!tp) return null;
                    return (
                      <div
                        key={task.id}
                        className="absolute group cursor-pointer"
                        style={{
                          left: tp.x,
                          top: tp.y,
                          transform: 'translate(-50%, -50%)',
                        }}
                        onClick={() => setSelectedTask(task)}
                      >
                        <div className={cn(
                          'px-3 py-2 rounded-xl border bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-sm min-w-[160px] transition-all duration-200',
                          'border-surface-200/50 dark:border-white/[0.06]',
                          'hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-0.5',
                          selectedTask?.id === task.id && 'ring-2 ring-brand-500/50'
                        )}>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className={cn(
                              'text-[10px] font-medium px-1.5 py-0.5 rounded border',
                              priorityBadge[task.priority] || priorityBadge.low
                            )}>
                              {task.priority}
                            </span>
                            {task.assignee && (
                              <div className="h-5 w-5 rounded-full bg-brand-500 flex items-center justify-center text-white text-[10px] font-medium flex-shrink-0">
                                {getInitials(task.assignee.name)}
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-medium text-surface-900 dark:text-white leading-snug line-clamp-2">
                            {task.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {showMinimap && (
          <div className="absolute bottom-4 right-4 w-48 h-32 rounded-xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/90 backdrop-blur-xl overflow-hidden">
            <div className="p-2">
              <p className="text-[10px] text-surface-500 font-medium uppercase tracking-wider">Minimap</p>
              <div className="mt-1 space-y-1">
                {statusConfig.map((s) => {
                  const count = tasksByStatus[s.id]?.length || 0;
                  return (
                    <div key={s.id} className="flex items-center gap-1.5">
                      <div className={cn('w-1.5 h-1.5 rounded-full', s.bg.replace('bg-', 'bg-').split(' ')[0])} />
                      <span className="text-[10px] text-surface-400">{s.label}: {count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="px-2.5 py-1.5 rounded-lg border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/80 backdrop-blur-xl">
            <span className="text-xs text-surface-500">Drag to pan · Scroll to zoom</span>
          </div>
        </div>
      </div>

      {selectedTask && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-20"
          onClick={() => setSelectedTask(null)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-80 animate-slide-up rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/90 backdrop-blur-xl p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-brand-500" />
                <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Task Detail</span>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-surface-400 hover:text-surface-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-3">{selectedTask.title}</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-3.5 h-3.5 text-surface-400" />
                <span className={cn(
                  'text-xs font-medium px-1.5 py-0.5 rounded border',
                  priorityBadge[selectedTask.priority]
                )}>
                  {selectedTask.priority}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-3.5 h-3.5 text-surface-400" />
                <span className="text-sm text-surface-600 dark:text-surface-300">
                  {selectedTask.assignee?.name || 'Unassigned'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  statusConfig.find(s => s.id === selectedTask.status)?.color.replace('text-', 'bg-')
                )} />
                <span className="text-sm text-surface-600 dark:text-surface-300 capitalize">
                  {selectedTask.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
