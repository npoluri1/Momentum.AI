'use client';

import { useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cn, formatDate } from '@/lib/utils';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Plus,
  Calendar as CalendarIcon, List, Grid3X3,
  Clock, AlertCircle, User, X, Flag,
} from 'lucide-react';

interface CalendarTask {
  id: string;
  title: string;
  date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  time?: string;
}

const priorityDots: Record<string, string> = {
  urgent: 'bg-danger-500',
  high: 'bg-warning-500',
  medium: 'bg-execution-500',
  low: 'bg-surface-400',
};

const priorityColors: Record<string, string> = {
  urgent: 'text-danger-500',
  high: 'text-warning-500',
  medium: 'text-execution-500',
  low: 'text-surface-400',
};

const statusColors: Record<string, string> = {
  todo: 'text-execution-500',
  in_progress: 'text-brand-500',
  review: 'text-intelligence-500',
  done: 'text-memory-500',
};

const mockCalendarTasks: CalendarTask[] = [
  { id: 'c1', title: 'Project kickoff meeting', date: '2026-06-02', priority: 'high', assignee: 'Alice', status: 'done', time: '9:00 AM' },
  { id: 'c2', title: 'Submit Q2 report', date: '2026-06-05', priority: 'urgent', assignee: 'Bob', status: 'done' },
  { id: 'c3', title: 'Design review session', date: '2026-06-08', priority: 'medium', assignee: 'Charlie', status: 'in_progress', time: '2:00 PM' },
  { id: 'c4', title: 'API documentation due', date: '2026-06-10', priority: 'high', assignee: 'Alice', status: 'in_progress' },
  { id: 'c5', title: 'Sprint planning', date: '2026-06-12', priority: 'medium', status: 'todo', time: '10:00 AM' },
  { id: 'c6', title: 'Deploy to staging', date: '2026-06-15', priority: 'urgent', assignee: 'Charlie', status: 'todo' },
  { id: 'c7', title: 'Client presentation', date: '2026-06-18', priority: 'high', assignee: 'Alice', status: 'todo', time: '11:00 AM' },
  { id: 'c8', title: 'Code freeze', date: '2026-06-22', priority: 'urgent', status: 'review' },
  { id: 'c9', title: 'Beta release', date: '2026-06-28', priority: 'high', assignee: 'Bob', status: 'review' },
  { id: 'c10', title: 'Team retro', date: '2026-06-30', priority: 'low', status: 'todo', time: '3:30 PM' },
];

type CalendarView = 'month' | 'week' | 'agenda';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const today = new Date();
const todayStr = today.toISOString().split('T')[0];

function getMonthDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  const remaining = 42 - days.length;
  for (let i = 0; i < remaining; i++) days.push(null);
  return days;
}

function getWeekDays(year: number, month: number, weekOffset: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  const start = new Date(firstOfMonth);
  start.setDate(start.getDate() - start.getDay() + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function isToday(date: Date): boolean {
  return date.toDateString() === today.toDateString();
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

function formatMonthYear(year: number, month: number): string {
  return new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function CalendarPage() {
  const params = useParams();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr);
  const [weekOffset, setWeekOffset] = useState(0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthDays = useMemo(() => getMonthDays(year, month), [year, month]);

  const weekDays = useMemo(() => getWeekDays(year, month, weekOffset), [year, month, weekOffset]);

  const tasksByDate = useMemo(() => {
    const map: Record<string, CalendarTask[]> = {};
    mockCalendarTasks.forEach(t => {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    });
    return map;
  }, []);

  const selectedTasks = useMemo(() => {
    return selectedDate ? (tasksByDate[selectedDate] || []) : [];
  }, [selectedDate, tasksByDate]);

  const allTasksSorted = useMemo(() => {
    return [...mockCalendarTasks].sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  const navigateMonth = useCallback((dir: -1 | 1) => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
    setWeekOffset(0);
  }, [currentDate]);

  const goToday = useCallback(() => {
    setCurrentDate(new Date());
    setSelectedDate(todayStr);
    setWeekOffset(0);
  }, []);

  const handleDateClick = useCallback((dateKey: string) => {
    setSelectedDate(dateKey);
  }, []);

  const isCurrentMonth = (day: number | null): boolean => day !== null;
  const isLeadingTrailing = (day: number | null, index: number): boolean => {
    if (day === null) return true;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return index < firstDay || index >= firstDay + daysInMonth;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">MomentumAI</h1>
          <p className="text-sm text-surface-500">Calendar</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/30 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => navigateMonth(-1)} className="p-2 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-500 hover:text-surface-200 hover:bg-surface-800">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white min-w-[200px] text-center">
              {formatMonthYear(year, month)}
            </h2>
            <button onClick={() => navigateMonth(1)} className="p-2 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-500 hover:text-surface-200 hover:bg-surface-800">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={goToday}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-surface-300 dark:border-surface-600 text-surface-500 hover:text-surface-200 hover:bg-surface-800"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-0.5">
          {([
            { key: 'month', icon: Grid3X3, label: 'Month' },
            { key: 'week', icon: CalendarIcon, label: 'Week' },
            { key: 'agenda', icon: List, label: 'Agenda' },
          ] as const).map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5',
                view === v.key
                  ? 'bg-brand-500 text-white'
                  : 'text-surface-500 hover:text-surface-200'
              )}
            >
              <v.icon className="w-3.5 h-3.5" />
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          {view === 'month' && (
            <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden">
              <div className="grid grid-cols-7 border-b border-surface-200/50 dark:border-white/[0.06]">
                {DAYS.map((day) => (
                  <div key={day} className="px-3 py-2.5 text-xs font-semibold text-surface-500 uppercase tracking-wider text-center">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {monthDays.map((day, i) => {
                  if (day === null) return <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-surface-200/30 dark:border-white/[0.03]" />;

                  const dateKey = formatDateKey(year, month, day);
                  const dayDate = new Date(year, month, day);
                  const tasks = tasksByDate[dateKey] || [];
                  const isSel = selectedDate === dateKey;
                  const isTod = isToday(dayDate);
                  const trailing = isLeadingTrailing(day, i);
                  const overdue = dateKey < todayStr && tasks.length > 0;

                  return (
                    <div
                      key={dateKey}
                      className={cn(
                        'min-h-[100px] border-b border-r border-surface-200/30 dark:border-white/[0.03] p-1.5 cursor-pointer transition-colors',
                        trailing && 'opacity-40',
                        isSel && 'bg-brand-500/10 ring-1 ring-brand-500/40',
                        'hover:bg-surface-50 dark:hover:bg-surface-800/30'
                      )}
                      onClick={() => handleDateClick(dateKey)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={cn(
                            'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full',
                            isTod && 'bg-brand-500 text-white font-bold ring-2 ring-brand-500/30',
                            isSel && !isTod && 'bg-brand-500/20 text-brand-500',
                            !isTod && !isSel && 'text-surface-600 dark:text-surface-300',
                          )}
                        >
                          {day}
                        </span>
                        {overdue && (
                          <span className="w-1.5 h-1.5 rounded-full bg-danger-500" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        {tasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-1 px-1 py-0.5 rounded text-[10px] truncate"
                            title={task.title}
                          >
                            <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', priorityDots[task.priority])} />
                            <span className="text-surface-700 dark:text-surface-300 truncate">{task.title}</span>
                          </div>
                        ))}
                        {tasks.length > 3 && (
                          <span className="text-[10px] text-surface-500 px-1">+{tasks.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === 'week' && (
            <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden">
              <div className="grid grid-cols-7 border-b border-surface-200/50 dark:border-white/[0.06]">
                {DAYS.map((day, i) => {
                  const d = weekDays[i];
                  const isTod = isToday(d);
                  const dateKey = d.toISOString().split('T')[0];
                  const tasks = tasksByDate[dateKey] || [];
                  return (
                    <div
                      key={day}
                      className={cn(
                        'px-3 py-2.5 text-center border-r border-surface-200/30 dark:border-white/[0.03] cursor-pointer transition-colors',
                        selectedDate === dateKey && 'bg-brand-500/10',
                        'hover:bg-surface-50 dark:hover:bg-surface-800/30'
                      )}
                      onClick={() => handleDateClick(dateKey)}
                    >
                      <div className="text-xs text-surface-500 font-medium">{day}</div>
                      <div className={cn(
                        'text-lg font-semibold w-8 h-8 mx-auto flex items-center justify-center rounded-full mt-0.5',
                        isTod && 'bg-brand-500 text-white',
                        selectedDate === dateKey && !isTod && 'bg-brand-500/20 text-brand-500',
                        !isTod && selectedDate !== dateKey && 'text-surface-900 dark:text-white'
                      )}>
                        {d.getDate()}
                      </div>
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        {tasks.slice(0, 4).map(t => (
                          <div key={t.id} className={cn('w-1.5 h-1.5 rounded-full', priorityDots[t.priority])} />
                        ))}
                        {tasks.length > 4 && (
                          <span className="text-[9px] text-surface-500">+{tasks.length - 4}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                {weekDays.map((d) => {
                  const dateKey = d.toISOString().split('T')[0];
                  const tasks = tasksByDate[dateKey] || [];
                  if (tasks.length === 0) return null;
                  return (
                    <div key={dateKey}>
                      <h4 className="text-xs font-semibold text-surface-500 uppercase mb-1.5">
                        {d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </h4>
                      <div className="space-y-1 mb-3">
                        {tasks.map(t => (
                          <div key={t.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                            <div className={cn('w-2 h-2 rounded-full', priorityDots[t.priority])} />
                            <span className="text-xs text-surface-900 dark:text-white flex-1">{t.title}</span>
                            {t.time && <span className="text-[10px] text-surface-500">{t.time}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {weekDays.every(d => (tasksByDate[d.toISOString().split('T')[0]] || []).length === 0) && (
                  <p className="text-sm text-surface-500 text-center py-8">No tasks this week</p>
                )}
              </div>
            </div>
          )}

          {view === 'agenda' && (
            <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-5">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">All Tasks (Chronological)</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {allTasksSorted.length === 0 ? (
                  <p className="text-sm text-surface-500 text-center py-8">No tasks</p>
                ) : (
                  allTasksSorted.map((task) => {
                    const isOverdue = task.date < todayStr && task.status !== 'done';
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer hover:shadow-md',
                          'border-surface-200/50 dark:border-white/[0.06]',
                          'hover:bg-surface-50 dark:hover:bg-surface-800/30',
                          isOverdue && 'border-l-2 border-l-danger-500'
                        )}
                        onClick={() => {
                          setSelectedDate(task.date);
                          setView('month');
                        }}
                      >
                        <div className={cn('w-2 h-2 rounded-full flex-shrink-0', priorityDots[task.priority])} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-surface-900 dark:text-white">{task.title}</span>
                            <span className={cn(
                              'text-[10px] font-medium px-1.5 py-0.5 rounded-full border',
                              priorityColors[task.priority].replace('text-', 'bg-/20 text-'),
                              `border-${priorityColors[task.priority].replace('text-', '')}/30`
                            )}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-surface-500 flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {formatDate(task.date)}
                            </span>
                            {task.time && (
                              <span className="text-xs text-surface-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.time}
                              </span>
                            )}
                            {task.assignee && (
                              <span className="text-xs text-surface-500 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {task.assignee}
                              </span>
                            )}
                            {isOverdue && (
                              <span className="text-[10px] font-medium text-danger-500 flex items-center gap-0.5">
                                <AlertCircle className="w-3 h-3" />
                                Overdue
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={cn('text-[10px] font-medium capitalize', statusColors[task.status])}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
                {selectedDate ? formatDate(selectedDate) : 'Select a date'}
              </h3>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="p-1 rounded text-surface-400 hover:text-surface-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {selectedDate ? (
              <div className="space-y-2">
                {selectedTasks.length === 0 ? (
                  <p className="text-xs text-surface-500 text-center py-4">No tasks for this day</p>
                ) : (
                  selectedTasks.map((task) => {
                    const isOverdue = task.date < todayStr && task.status !== 'done';
                    return (
                      <div
                        key={task.id}
                        className={cn(
                          'p-2.5 rounded-xl border transition-colors',
                          'border-surface-200/50 dark:border-white/[0.06]',
                          'hover:bg-surface-50 dark:hover:bg-surface-800/30',
                          isOverdue && 'border-l-2 border-l-danger-500'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={cn('w-2 h-2 rounded-full flex-shrink-0', priorityDots[task.priority])} />
                          <span className="text-xs font-medium text-surface-900 dark:text-white flex-1">{task.title}</span>
                          <Flag className={cn('w-3 h-3', priorityColors[task.priority])} />
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {task.time && (
                            <span className="text-[10px] text-surface-500 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {task.time}
                            </span>
                          )}
                          {task.assignee && (
                            <span className="text-[10px] text-surface-500 flex items-center gap-0.5">
                              <User className="w-2.5 h-2.5" />
                              {task.assignee}
                            </span>
                          )}
                          <span className={cn('text-[10px] font-medium capitalize', statusColors[task.status])}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                        {isOverdue && (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-[9px] font-semibold text-danger-500 uppercase">Overdue</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <button className="w-full mt-2 py-2 text-xs font-medium text-brand-500 hover:text-brand-400 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-surface-300 dark:border-surface-600 hover:border-brand-500/50 transition-colors">
                  <Plus className="w-3 h-3" /> Add Task
                </button>
              </div>
            ) : (
              <p className="text-xs text-surface-500 text-center py-4">Click a date to see tasks</p>
            )}
          </div>

          <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-4">
            <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-danger-500" />
                <span className="text-xs text-surface-600 dark:text-surface-300">Urgent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-warning-500" />
                <span className="text-xs text-surface-600 dark:text-surface-300">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-execution-500" />
                <span className="text-xs text-surface-600 dark:text-surface-300">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-surface-400" />
                <span className="text-xs text-surface-600 dark:text-surface-300">Low</span>
              </div>
              <div className="h-px bg-surface-200 dark:bg-surface-700" />
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-danger-500" />
                <span className="text-xs text-surface-600 dark:text-surface-300 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-danger-500" /> Overdue
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-4">
            <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Mini Calendar</h3>
            <div className="grid grid-cols-7 gap-0">
              {DAYS.map(d => (
                <div key={d} className="text-[9px] text-surface-400 text-center py-1 font-medium">{d[0]}</div>
              ))}
              {getMonthDays(year, month).map((day, i) => {
                if (day === null) return <div key={`m-${i}`} />;
                const dateKey = formatDateKey(year, month, day);
                const dayDate = new Date(year, month, day);
                const isTod = isToday(dayDate);
                const isSel = selectedDate === dateKey;
                const hasTask = !!tasksByDate[dateKey];
                return (
                  <button
                    key={dateKey}
                    onClick={() => handleDateClick(dateKey)}
                    className={cn(
                      'text-[10px] w-7 h-7 mx-auto flex items-center justify-center rounded-full relative',
                      isTod && 'bg-brand-500 text-white font-bold',
                      isSel && !isTod && 'bg-brand-500/20 text-brand-500',
                      !isTod && !isSel && 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                    )}
                  >
                    {day}
                    {hasTask && !isTod && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-200/50 dark:border-white/[0.06]">
              <span className="text-[10px] text-surface-500">
                {mockCalendarTasks.length} tasks
              </span>
              <span className="text-[10px] text-surface-500">
                {mockCalendarTasks.filter(t => t.date < todayStr && t.status !== 'done').length} overdue
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
