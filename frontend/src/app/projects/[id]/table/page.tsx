'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, Search, Filter, ChevronDown, ChevronUp,
  ArrowUpDown, MoreHorizontal, Check, X, Edit3,
  User, Calendar, Flag, Trash2, Copy, Clock,
  Plus, Sparkles, SlidersHorizontal,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface TableTask {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: string;
  dueDate?: string;
  tags: string[];
  progress: number;
  createdAt: string;
}

const mockTasks: TableTask[] = [
  { id: '1', title: 'Design system architecture', status: 'in_progress', priority: 'high', assignee: 'Alice', dueDate: '2026-06-10', tags: ['design', 'frontend'], progress: 60, createdAt: '2026-06-01' },
  { id: '2', title: 'Set up CI/CD pipeline', status: 'todo', priority: 'medium', assignee: 'Bob', dueDate: '2026-06-15', tags: ['devops'], progress: 0, createdAt: '2026-06-02' },
  { id: '3', title: 'Implement authentication', status: 'in_progress', priority: 'urgent', assignee: 'Alice', dueDate: '2026-06-08', tags: ['security', 'backend'], progress: 40, createdAt: '2026-06-01' },
  { id: '4', title: 'Build API endpoints', status: 'in_progress', priority: 'high', assignee: 'Charlie', dueDate: '2026-06-12', tags: ['backend', 'api'], progress: 30, createdAt: '2026-06-03' },
  { id: '5', title: 'Code review API layer', status: 'review', priority: 'high', assignee: 'Alice', dueDate: '2026-06-09', tags: ['backend'], progress: 80, createdAt: '2026-06-04' },
  { id: '6', title: 'Write unit tests', status: 'todo', priority: 'medium', assignee: 'Charlie', dueDate: '2026-06-14', tags: ['testing'], progress: 0, createdAt: '2026-06-05' },
  { id: '7', title: 'Create database schema', status: 'done', priority: 'medium', assignee: 'Bob', dueDate: '2026-06-06', tags: ['backend', 'database'], progress: 100, createdAt: '2026-05-28' },
  { id: '8', title: 'Design landing page', status: 'review', priority: 'low', assignee: 'Alice', dueDate: '2026-06-11', tags: ['design'], progress: 85, createdAt: '2026-06-05' },
  { id: '9', title: 'Test integration flows', status: 'review', priority: 'high', assignee: 'Charlie', dueDate: '2026-06-10', tags: ['testing'], progress: 70, createdAt: '2026-06-02' },
  { id: '10', title: 'Write documentation', status: 'todo', priority: 'low', dueDate: '2026-06-20', tags: ['docs'], progress: 0, createdAt: '2026-06-06' },
  { id: '11', title: 'Performance optimization', status: 'todo', priority: 'medium', assignee: 'Bob', dueDate: '2026-06-18', tags: ['performance'], progress: 0, createdAt: '2026-06-07' },
  { id: '12', title: 'User acceptance testing', status: 'done', priority: 'high', assignee: 'Charlie', dueDate: '2026-06-07', tags: ['testing'], progress: 100, createdAt: '2026-05-30' },
];

type SortField = 'title' | 'status' | 'priority' | 'assignee' | 'dueDate' | 'progress' | 'createdAt';
type SortDir = 'asc' | 'desc';

const statusColors: Record<string, string> = {
  todo: 'bg-execution-500/15 text-execution-500 border-execution-500/25',
  in_progress: 'bg-brand-500/15 text-brand-500 border-brand-500/25',
  review: 'bg-intelligence-500/15 text-intelligence-500 border-intelligence-500/25',
  done: 'bg-memory-500/15 text-memory-500 border-memory-500/25',
};

const priorityColors: Record<string, string> = {
  urgent: 'text-danger-500',
  high: 'text-warning-500',
  medium: 'text-execution-500',
  low: 'text-surface-400',
};

const statusOptions = ['todo', 'in_progress', 'review', 'done'];
const priorityOptions = ['low', 'medium', 'high', 'urgent'];

export default function TableViewPage() {
  const params = useParams();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [tasks, setTasks] = useState<TableTask[]>([]);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (params.id) {
      setTasks(mockTasks);
      setProject({ name: 'Project Alpha' });
      setLoading(false);
    }
  }, [params.id]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedAndFiltered = useMemo(() => {
    let filtered = [...tasks];
    
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q)));
    }
    if (statusFilter !== 'all') filtered = filtered.filter(t => t.status === statusFilter);
    if (priorityFilter !== 'all') filtered = filtered.filter(t => t.priority === priorityFilter);

    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'title': cmp = a.title.localeCompare(b.title); break;
        case 'status': cmp = a.status.localeCompare(b.status); break;
        case 'priority': {
          const order = { urgent: 0, high: 1, medium: 2, low: 3 };
          cmp = (order[a.priority] || 0) - (order[b.priority] || 0);
          break;
        }
        case 'assignee': cmp = (a.assignee || '').localeCompare(b.assignee || ''); break;
        case 'dueDate': cmp = (a.dueDate || '').localeCompare(b.dueDate || ''); break;
        case 'progress': cmp = a.progress - b.progress; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return filtered;
  }, [tasks, search, sortField, sortDir, statusFilter, priorityFilter]);

  const toggleRow = (id: string) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === sortedAndFiltered.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(sortedAndFiltered.map(t => t.id)));
    }
  };

  const updateTask = (id: string, field: string, value: any) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
    setEditingCell(null);
    // Toast removed for rapid editing UX
  };

  const SortHeader = ({ field, label, className }: { field: SortField; label: string; className?: string }) => (
    <button
      onClick={() => handleSort(field)}
      className={cn('flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wider hover:text-surface-900 dark:hover:text-white transition-colors', className)}
    >
      {label}
      <ArrowUpDown className={cn('w-3 h-3', sortField === field ? 'text-brand-500' : 'opacity-40')} />
      {sortField === field && (
        sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-brand-500" /> : <ChevronDown className="w-3 h-3 text-brand-500" />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-surface-500 animate-pulse">Loading table...</p>
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
          <p className="text-sm text-surface-500">Table View · {tasks.length} tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter rows..."
              className="pl-9 pr-4 py-2 text-sm rounded-xl border border-surface-200 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 w-48"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn('p-2 rounded-xl border transition-all', showFilters ? 'bg-brand-500/10 border-brand-500/30 text-brand-500' : 'border-surface-200 dark:border-white/[0.06] text-surface-400 hover:text-surface-600')}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 text-sm font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/25 flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      {showFilters && (
        <div className="p-4 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-surface-500">Status:</span>
              {['all', 'todo', 'in_progress', 'review', 'done'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    'px-3 py-1 text-xs font-medium rounded-full transition-all',
                    statusFilter === s
                      ? 'bg-surface-900 dark:bg-white text-white dark:text-surface-900'
                      : 'bg-surface-100 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-white/[0.1]'
                  )}
                >
                  {s === 'all' ? 'All' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="w-px h-6 bg-surface-200 dark:bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-surface-500">Priority:</span>
              {['all', 'urgent', 'high', 'medium', 'low'].map(p => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={cn(
                    'px-3 py-1 text-xs font-medium rounded-full transition-all',
                    priorityFilter === p
                      ? 'bg-surface-900 dark:bg-white text-white dark:text-surface-900'
                      : 'bg-surface-100 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-white/[0.1]'
                  )}
                >
                  {p === 'all' ? 'All' : p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-white/[0.06]">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === sortedAndFiltered.length && sortedAndFiltered.length > 0}
                    onChange={toggleAll}
                    className="rounded border-surface-300 dark:border-surface-600 text-brand-500 focus:ring-brand-500/30"
                  />
                </th>
                <th className="px-4 py-3 text-left"><SortHeader field="title" label="Task" /></th>
                <th className="px-4 py-3 text-left"><SortHeader field="status" label="Status" /></th>
                <th className="px-4 py-3 text-left"><SortHeader field="priority" label="Priority" /></th>
                <th className="px-4 py-3 text-left"><SortHeader field="assignee" label="Assignee" /></th>
                <th className="px-4 py-3 text-left"><SortHeader field="dueDate" label="Due Date" /></th>
                <th className="px-4 py-3 text-left"><SortHeader field="progress" label="Progress" /></th>
                <th className="w-16 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-white/[0.04]">
              {sortedAndFiltered.map((task) => (
                <tr
                  key={task.id}
                  className={cn(
                    'hover:bg-surface-50 dark:hover:bg-white/[0.02] transition-colors',
                    selectedRows.has(task.id) && 'bg-brand-500/5'
                  )}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(task.id)}
                      onChange={() => toggleRow(task.id)}
                      className="rounded border-surface-300 dark:border-surface-600 text-brand-500 focus:ring-brand-500/30"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-surface-900 dark:text-white">{task.title}</span>
                      <div className="flex items-center gap-1">
                        {task.tags.map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 text-[9px] font-medium rounded-md bg-surface-100 dark:bg-white/[0.06] text-surface-500">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {editingCell?.id === task.id && editingCell?.field === 'status' ? (
                      <select
                        value={task.status}
                        onChange={e => updateTask(task.id, 'status', e.target.value)}
                        autoFocus
                        onBlur={() => setEditingCell(null)}
                        className="px-2 py-1 text-xs rounded-lg border border-brand-500/30 bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                      </select>
                    ) : (
                      <span
                        onClick={() => setEditingCell({ id: task.id, field: 'status' })}
                        className={cn('px-2.5 py-0.5 text-[11px] font-semibold rounded-full border cursor-pointer', statusColors[task.status])}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('flex items-center gap-1 text-xs font-medium', priorityColors[task.priority])}>
                      <Flag className="w-3 h-3" />
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-surface-600 dark:text-surface-400">{task.assignee || <span className="text-surface-400 italic">Unassigned</span>}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-surface-600 dark:text-surface-400">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-surface-200 dark:bg-white/[0.08] overflow-hidden">
                        <div className={cn('h-full rounded-full', task.progress >= 100 ? 'bg-memory-500' : 'bg-brand-500')} style={{ width: `${task.progress}%` }} />
                      </div>
                      <span className="text-xs text-surface-500 w-8">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {sortedAndFiltered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center mx-auto mb-3">
              <Search className="w-7 h-7 text-surface-400" />
            </div>
            <p className="text-sm text-surface-500">No tasks match your filters</p>
            <button
              onClick={() => { setSearch(''); setStatusFilter('all'); setPriorityFilter('all'); }}
              className="mt-2 text-sm text-brand-500 hover:text-brand-600 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200 dark:border-white/[0.06] bg-surface-50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3 text-xs text-surface-500">
            <span>{sortedAndFiltered.length} tasks</span>
            {selectedRows.size > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-surface-300" />
                <span className="font-medium text-surface-700 dark:text-surface-300">{selectedRows.size} selected</span>
                <button className="text-surface-400 hover:text-danger-500 transition-colors flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
                <button className="text-surface-400 hover:text-surface-600 transition-colors flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Duplicate
                </button>
              </>
            )}
          </div>
          <button className="text-xs text-surface-400 hover:text-brand-500 transition-colors flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI Sort
          </button>
        </div>
      </div>
    </div>
  );
}
