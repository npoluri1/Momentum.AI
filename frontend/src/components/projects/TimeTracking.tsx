'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Clock, Play, Square, Plus, Trash2, Pause,
  Timer, Calendar, BarChart3, ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, formatDate, formatRelativeTime } from '@/lib/utils';

interface TimeEntry {
  id: string;
  taskId?: string;
  description: string;
  duration: number;
  date: string;
  createdAt: string;
}

interface TimeTrackingProps {
  entries: TimeEntry[];
  onAddEntry: (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => void;
  onDeleteEntry: (id: string) => void;
  taskOptions?: { id: string; title: string }[];
  className?: string;
  loading?: boolean;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatDurationInput(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 || m > 0) return `${h}h ${m}m`;
  return '';
}

function DurationInput({ value, onChange }: { value: number; onChange: (seconds: number) => void }) {
  const [h, setH] = useState(Math.floor(value / 3600) || 0);
  const [m, setM] = useState(Math.floor((value % 3600) / 60) || 0);

  useEffect(() => {
    setH(Math.floor(value / 3600) || 0);
    setM(Math.floor((value % 3600) / 60) || 0);
  }, [value]);

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        min="0"
        max="99"
        value={h}
        onChange={(e) => { const v = parseInt(e.target.value) || 0; setH(v); onChange(v * 3600 + m * 60); }}
        className="w-14 px-2 py-1.5 rounded-md text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-center focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />
      <span className="text-sm text-surface-400">h</span>
      <input
        type="number"
        min="0"
        max="59"
        value={m}
        onChange={(e) => { const v = parseInt(e.target.value) || 0; setM(v); onChange(h * 3600 + v * 60); }}
        className="w-14 px-2 py-1.5 rounded-md text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-center focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />
      <span className="text-sm text-surface-400">m</span>
    </div>
  );
}

export function TimeTracking({
  entries,
  onAddEntry,
  onDeleteEntry,
  taskOptions = [],
  className,
  loading = false,
}: TimeTrackingProps) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [manualDesc, setManualDesc] = useState('');
  const [manualDuration, setManualDuration] = useState(0);
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualTask, setManualTask] = useState('');
  const [viewFilter, setViewFilter] = useState<'all' | 'today' | 'week'>('all');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const handleStartStop = useCallback(() => {
    if (running) {
      if (startTime) {
        const now = Date.now();
        const duration = Math.floor((now - startTime) / 1000);
        onAddEntry({
          taskId: undefined,
          description: 'Manual tracking session',
          duration,
          date: new Date().toISOString(),
        });
      }
      setRunning(false);
      setElapsed(0);
      setStartTime(null);
    } else {
      setRunning(true);
      setStartTime(Date.now());
      setElapsed(0);
    }
  }, [running, startTime, onAddEntry]);

  const handleManualSubmit = useCallback(() => {
    if (!manualDesc || manualDuration <= 0) return;
    onAddEntry({
      taskId: manualTask || undefined,
      description: manualDesc,
      duration: manualDuration,
      date: new Date(manualDate).toISOString(),
    });
    setManualDesc('');
    setManualDuration(0);
    setManualDate(new Date().toISOString().split('T')[0]);
    setManualTask('');
    setShowManual(false);
  }, [manualDesc, manualDuration, manualDate, manualTask, onAddEntry]);

  const filteredEntries = useCallback(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return entries.filter((e) => {
      const entryDate = new Date(e.date).toISOString().split('T')[0];
      if (viewFilter === 'today') return entryDate === today;
      if (viewFilter === 'week') return new Date(e.date) >= weekAgo;
      return true;
    });
  }, [entries, viewFilter]);

  const dailySummary = useCallback(() => {
    const summary: Record<string, number> = {};
    entries.forEach((e) => {
      const day = new Date(e.date).toISOString().split('T')[0];
      summary[day] = (summary[day] || 0) + e.duration;
    });
    return Object.entries(summary)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 7);
  }, [entries]);

  const weeklyTotal = entries
    .filter((e) => new Date(e.date) >= new Date(Date.now() - 7 * 86400000))
    .reduce((sum, e) => sum + e.duration, 0);

  const dailyTotal = entries
    .filter((e) => new Date(e.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0])
    .reduce((sum, e) => sum + e.duration, 0);

  const filtered = filteredEntries();

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="h-32 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
        <div className="h-64 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {running && (
        <Card className="border-brand-500/50 bg-brand-50/50 dark:bg-brand-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-danger-500 animate-pulse" />
                <div>
                  <p className="text-sm font-medium">Tracking time</p>
                  <p className="text-2xl font-bold font-mono">
                    {String(Math.floor(elapsed / 3600)).padStart(2, '0')}:
                    {String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')}:
                    {String(elapsed % 60).padStart(2, '0')}
                  </p>
                </div>
              </div>
              <Button variant="danger" size="md" onClick={handleStartStop} icon={<Square className="w-4 h-4 fill-current" />}>
                Stop
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant={running ? 'danger' : 'primary'}
            size="md"
            onClick={handleStartStop}
            icon={running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          >
            {running ? 'Stop Timer' : 'Start Timer'}
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setShowManual(!showManual)}
            icon={<Plus className="w-4 h-4" />}
          >
            Manual Entry
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setViewFilter('all')}
            className={cn('px-3 py-1.5 rounded-lg transition-colors', viewFilter === 'all' ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium' : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300')}
          >
            All
          </button>
          <button
            onClick={() => setViewFilter('today')}
            className={cn('px-3 py-1.5 rounded-lg transition-colors', viewFilter === 'today' ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium' : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300')}
          >
            Today
          </button>
          <button
            onClick={() => setViewFilter('week')}
            className={cn('px-3 py-1.5 rounded-lg transition-colors', viewFilter === 'week' ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-medium' : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300')}
          >
            Week
          </button>
        </div>
      </div>

      {showManual && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Input
                placeholder="What did you work on?"
                value={manualDesc}
                onChange={(e) => setManualDesc(e.target.value)}
                icon={<Clock className="w-4 h-4" />}
              />
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Duration</label>
                  <DurationInput value={manualDuration} onChange={setManualDuration} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-500 mb-1">Date</label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="px-3 py-1.5 rounded-md text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>
                {taskOptions.length > 0 && (
                  <div>
                    <label className="block text-xs font-medium text-surface-500 mb-1">Task</label>
                    <select
                      value={manualTask}
                      onChange={(e) => setManualTask(e.target.value)}
                      className="px-3 py-1.5 rounded-md text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                    >
                      <option value="">No task</option>
                      {taskOptions.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={() => setShowManual(false)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleManualSubmit} disabled={!manualDesc || manualDuration <= 0}>
                  Add Entry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{formatDuration(dailyTotal)}</p>
            <p className="text-xs text-surface-500">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{formatDuration(weeklyTotal)}</p>
            <p className="text-xs text-surface-500">This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{formatDuration(entries.reduce((s, e) => s + e.duration, 0))}</p>
            <p className="text-xs text-surface-500">Total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            Time Log
            <span className="text-sm font-normal text-surface-500">{filtered.length} entries</span>
          </CardHeader>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-surface-400 text-sm">
                <Clock className="w-8 h-8 mb-2 opacity-50" />
                <p>No time entries</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-100 dark:divide-surface-800">
                {filtered.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-4 px-6 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                    <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800">
                      <Timer className="w-4 h-4 text-surface-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{entry.description}</p>
                      <p className="text-xs text-surface-500">
                        {formatDate(entry.date)} · {formatRelativeTime(entry.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatDuration(entry.duration)}</p>
                    </div>
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            Daily Summary
            <BarChart3 className="w-4 h-4 text-surface-400" />
          </CardHeader>
          <CardContent className="p-0">
            {dailySummary().length === 0 ? (
              <div className="flex items-center justify-center h-32 text-surface-400 text-sm">
                No data
              </div>
            ) : (
              <div className="divide-y divide-surface-100 dark:divide-surface-800">
                {dailySummary().map(([day, duration]) => {
                  const maxDuration = dailySummary()[0]?.[1] || 1;
                  const pct = (duration / maxDuration) * 100;
                  return (
                    <div key={day} className="px-6 py-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-surface-500 text-xs">{formatDate(day)}</span>
                        <span className="font-medium text-xs">{formatDuration(duration)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
