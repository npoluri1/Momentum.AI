'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  Link2, Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatDate } from '@/lib/utils';
import type { Task, User } from '@/lib/types';

interface GanttTask extends Task {
  startDate: string;
  endDate: string;
  dependencies?: string[];
  progress: number;
  group?: string;
}

interface GanttChartProps {
  tasks: GanttTask[];
  onTaskResize?: (taskId: string, newStartDate: string, newEndDate: string) => void;
  onTaskClick?: (task: GanttTask) => void;
  zoom?: 'day' | 'week' | 'month';
  onZoomChange?: (zoom: 'day' | 'week' | 'month') => void;
  className?: string;
  loading?: boolean;
}

const ZOOM_LEVELS = ['day', 'week', 'month'] as const;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getDateRange(tasks: GanttTask[]): { start: Date; end: Date } {
  if (!tasks.length) {
    const now = new Date();
    return { start: addDays(now, -7), end: addDays(now, 30) };
  }
  let min = new Date(tasks[0].startDate);
  let max = new Date(tasks[0].endDate);
  tasks.forEach((t) => {
    const s = new Date(t.startDate);
    const e = new Date(t.endDate);
    if (s < min) min = s;
    if (e > max) max = e;
  });
  min = addDays(min, -3);
  max = addDays(max, 3);
  return { start: min, end: max };
}

function getDayWidth(zoom: 'day' | 'week' | 'month'): number {
  switch (zoom) {
    case 'day': return 36;
    case 'week': return 120;
    case 'month': return 200;
  }
}

function getHeaderCells(start: Date, end: Date, zoom: 'day' | 'week' | 'month'): { label: string; colSpan: number; date: Date }[] {
  const cells: { label: string; colSpan: number; date: Date }[] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    switch (zoom) {
      case 'day': {
        cells.push({ label: String(cursor.getDate()), colSpan: 1, date: new Date(cursor) });
        cursor.setDate(cursor.getDate() + 1);
        break;
      }
      case 'week': {
        const sunday = new Date(cursor);
        sunday.setDate(cursor.getDate() - cursor.getDay());
        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        cells.push({
          label: `${sunday.getDate()} ${MONTHS[sunday.getMonth()]}`,
          colSpan: 7,
          date: new Date(sunday),
        });
        cursor.setDate(cursor.getDate() + 7);
        break;
      }
      case 'month': {
        cells.push({
          label: `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`,
          colSpan: new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate(),
          date: new Date(cursor),
        });
        cursor.setMonth(cursor.getMonth() + 1);
        break;
      }
    }
  }
  return cells;
}

function TaskBar({ task, dayWidth, startDate, zoom, onClick }: {
  task: GanttTask;
  dayWidth: number;
  startDate: Date;
  zoom: 'day' | 'week' | 'month';
  onClick?: (task: GanttTask) => void;
}) {
  const taskStart = new Date(task.startDate);
  const taskEnd = new Date(task.endDate);
  const totalDays = differenceInDays(taskEnd, taskStart) + 1;
  const offsetDays = differenceInDays(taskStart, startDate);

  const left = offsetDays * dayWidth;
  const width = Math.max(totalDays * dayWidth, 20);

  const barColor = task.priority === 'urgent' ? '#ef4444' :
    task.priority === 'high' ? '#f59e0b' :
    task.priority === 'medium' ? '#6366f1' : '#22c55e';

  return (
    <div
      onClick={() => onClick?.(task)}
      className="relative h-8 flex items-center cursor-pointer group"
    >
      <div
        className="absolute h-6 rounded-md flex items-center px-2 overflow-hidden transition-all group-hover:shadow-md group-hover:opacity-90 cursor-pointer"
        style={{
          left: `${left}px`,
          width: `${width}px`,
          backgroundColor: barColor,
        }}
      >
        <div
          className="absolute inset-0 bg-white/20 rounded-md"
          style={{ width: `${task.progress}%` }}
        />
        {width > 50 && (
          <span className="relative text-xs text-white font-medium truncate z-10">
            {task.title}
          </span>
        )}
      </div>
    </div>
  );
}

export function GanttChart({
  tasks,
  onTaskResize,
  onTaskClick,
  zoom: externalZoom,
  onZoomChange,
  className,
  loading = false,
}: GanttChartProps) {
  const [internalZoom, setInternalZoom] = useState<'day' | 'week' | 'month'>('week');
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const zoom = externalZoom ?? internalZoom;

  const setZoom = useCallback((z: 'day' | 'week' | 'month') => {
    if (onZoomChange) onZoomChange(z);
    else setInternalZoom(z);
  }, [onZoomChange]);

  const { start, end } = useMemo(() => getDateRange(tasks), [tasks]);
  const dayWidth = useMemo(() => getDayWidth(zoom), [zoom]);
  const totalDays = useMemo(() => differenceInDays(end, start) + 1, [start, end]);
  const totalWidth = totalDays * dayWidth;

  const headerCells = useMemo(() => getHeaderCells(start, end, zoom), [start, end, zoom]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaX || e.deltaY;
    }
  }, []);

  if (loading) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="h-10 bg-surface-200 dark:bg-surface-800 rounded-lg animate-pulse" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 bg-surface-200 dark:bg-surface-800 rounded-lg animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className={cn('flex flex-col items-center justify-center h-64 text-surface-400', className)}>
        <Clock className="w-10 h-10 mb-3 opacity-50" />
        <p className="font-medium">No timeline data</p>
        <p className="text-sm mt-1">Add tasks with start and end dates to view the Gantt chart.</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 overflow-hidden', className)}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(ZOOM_LEVELS[Math.max(0, ZOOM_LEVELS.indexOf(zoom) - 1)])}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            disabled={zoom === 'day'}
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium capitalize min-w-[60px] text-center">{zoom}</span>
          <button
            onClick={() => setZoom(ZOOM_LEVELS[Math.min(ZOOM_LEVELS.length - 1, ZOOM_LEVELS.indexOf(zoom) + 1)])}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            disabled={zoom === 'month'}
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => { if (scrollRef.current) scrollRef.current.scrollLeft -= 200; }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-surface-500">
            {formatDate(start)} - {formatDate(end)}
          </span>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => { if (scrollRef.current) scrollRef.current.scrollLeft += 200; }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex" style={{ height: '500px' }}>
        <div className="w-56 shrink-0 border-r border-surface-200 dark:border-surface-800 overflow-y-auto bg-surface-50 dark:bg-surface-950/50">
          <div className="h-12 border-b border-surface-200 dark:border-surface-800 px-4 flex items-center">
            <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Tasks</span>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-800">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onTaskClick?.(task)}
                className="flex items-center gap-2 h-8 px-4 cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <span className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  task.priority === 'urgent' ? 'bg-danger-500' :
                  task.priority === 'high' ? 'bg-warning-500' :
                  task.priority === 'medium' ? 'bg-brand-500' : 'bg-success-500'
                )} />
                <span className="text-xs truncate font-medium">{task.title}</span>
                {task.dependencies && task.dependencies.length > 0 && (
                  <Link2 className="w-3 h-3 text-surface-400 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto" ref={scrollRef} onWheel={handleWheel}>
          <div className="min-w-full" style={{ width: `${Math.max(totalWidth, 600)}px` }}>
            <div className="sticky top-0 z-10 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800">
              {zoom === 'month' && (
                <div className="flex" style={{ height: '24px' }}>
                  {(() => {
                    const monthMap = new Map<string, { label: string; count: number; dates: Date[] }>();
                    let cursor = new Date(start);
                    while (cursor <= end) {
                      const key = `${cursor.getFullYear()}-${cursor.getMonth()}`;
                      if (!monthMap.has(key)) {
                        monthMap.set(key, {
                          label: `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`,
                          count: 0,
                          dates: [],
                        });
                      }
                      monthMap.get(key)!.count++;
                      monthMap.get(key)!.dates.push(new Date(cursor));
                      cursor.setDate(cursor.getDate() + 1);
                    }
                    return Array.from(monthMap.entries()).map(([key, info]) => (
                      <div
                        key={key}
                        className="flex items-center px-2 text-xs font-medium text-surface-500 border-r border-surface-200 dark:border-surface-800"
                        style={{ width: `${info.count * dayWidth}px` }}
                      >
                        {info.label}
                      </div>
                    ));
                  })()}
                </div>
              )}
              <div className="flex" style={{ height: '24px' }}>
                {headerCells.map((cell, i) => (
                  <div
                    key={`${cell.label}-${i}`}
                    className="flex items-center justify-center text-[11px] text-surface-500 font-medium border-r border-surface-200 dark:border-surface-800"
                    style={{ width: `${(zoom === 'week' ? 1 : zoom === 'month' ? 1 : 1) * dayWidth}px`, minWidth: dayWidth }}
                  >
                    {cell.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: totalDays }).map((_, i) => {
                  const d = new Date(start);
                  d.setDate(d.getDate() + i);
                  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                  return (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 border-r border-surface-100 dark:border-surface-800/50"
                      style={{ left: `${i * dayWidth}px`, width: `${dayWidth}px`, backgroundColor: isWeekend ? 'rgba(0,0,0,0.02)' : undefined }}
                    />
                  );
                })}
              </div>
              <div className="relative divide-y divide-surface-100 dark:divide-surface-800">
                {tasks.map((task) => (
                  <TaskBar
                    key={task.id}
                    task={task}
                    dayWidth={dayWidth}
                    startDate={start}
                    zoom={zoom}
                    onClick={onTaskClick}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function differenceInDays(date1: Date, date2: Date): number {
  const diff = date1.getTime() - date2.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
