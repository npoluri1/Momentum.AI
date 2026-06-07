'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';
import {
  Trash2, Search, FolderKanban, CheckSquare, Bot, Workflow, File,
  RotateCcw, XCircle, AlertTriangle, Clock, User, Archive,
  RefreshCw, X, FolderOpen, FileText, Terminal, Box,
} from 'lucide-react';

type ItemType = 'project' | 'task' | 'agent' | 'workflow' | 'file';

interface TrashItem {
  id: string;
  type: ItemType;
  name: string;
  deletedBy: string;
  deletedAt: Date;
  size?: string;
}

const mockItems: TrashItem[] = [
  { id: '1', type: 'project', name: 'Old Marketing Site', deletedBy: 'Alex Chen', deletedAt: new Date(Date.now() - 2 * 86400000) },
  { id: '2', type: 'project', name: 'Test Project', deletedBy: 'Sarah J.', deletedAt: new Date(Date.now() - 5 * 86400000) },
  { id: '3', type: 'project', name: 'Archive 2025', deletedBy: 'Marcus W.', deletedAt: new Date(Date.now() - 12 * 86400000) },
  { id: '4', type: 'task', name: 'Fix login bug', deletedBy: 'David K.', deletedAt: new Date(Date.now() - 1 * 86400000) },
  { id: '5', type: 'task', name: 'Update docs', deletedBy: 'Emily R.', deletedAt: new Date(Date.now() - 3 * 86400000) },
  { id: '6', type: 'task', name: 'Design review', deletedBy: 'Lisa P.', deletedAt: new Date(Date.now() - 7 * 86400000) },
  { id: '7', type: 'task', name: 'Cleanup', deletedBy: 'Alex Chen', deletedAt: new Date(Date.now() - 10 * 86400000) },
  { id: '8', type: 'agent', name: 'Legacy Chatbot', deletedBy: 'David K.', deletedAt: new Date(Date.now() - 4 * 86400000) },
  { id: '9', type: 'agent', name: 'Old Classifier', deletedBy: 'Sarah J.', deletedAt: new Date(Date.now() - 8 * 86400000) },
  { id: '10', type: 'workflow', name: 'Email blast v1', deletedBy: 'Marcus W.', deletedAt: new Date(Date.now() - 6 * 86400000) },
  { id: '11', type: 'workflow', name: 'Old sync', deletedBy: 'Lisa P.', deletedAt: new Date(Date.now() - 14 * 86400000) },
  { id: '12', type: 'workflow', name: 'Test flow', deletedBy: 'Emily R.', deletedAt: new Date(Date.now() - 9 * 86400000) },
  { id: '13', type: 'file', name: 'logo_v1.png', deletedBy: 'Emily R.', deletedAt: new Date(Date.now() - 2 * 86400000), size: '2.4 MB' },
  { id: '14', type: 'file', name: 'report_q4.pdf', deletedBy: 'Lisa P.', deletedAt: new Date(Date.now() - 11 * 86400000), size: '4.1 MB' },
  { id: '15', type: 'file', name: 'backup.sql', deletedBy: 'Marcus W.', deletedAt: new Date(Date.now() - 15 * 86400000), size: '12.8 MB' },
];

const typeConfig: Record<ItemType, { icon: React.ElementType; color: string; label: string }> = {
  project: { icon: FolderKanban, color: 'text-brand-500', label: 'Project' },
  task: { icon: CheckSquare, color: 'text-memory-500', label: 'Task' },
  agent: { icon: Bot, color: 'text-intelligence-500', label: 'Agent' },
  workflow: { icon: Workflow, color: 'text-execution-500', label: 'Workflow' },
  file: { icon: File, color: 'text-warning-500', label: 'File' },
};

const tabs = [
  { key: 'all', label: 'All Items' },
  { key: 'project', label: 'Projects' },
  { key: 'task', label: 'Tasks' },
  { key: 'agent', label: 'Agents' },
  { key: 'workflow', label: 'Workflows' },
  { key: 'file', label: 'Files' },
];

export default function TrashPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [restoring, setRestoring] = useState<Set<string>>(new Set());
  const [items, setItems] = useState(mockItems);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTab = activeTab === 'all' || item.type === activeTab;
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [items, activeTab, search]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map((i) => i.id)));
    }
  };

  const handleRestore = (id: string) => {
    setRestoring((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      setRestoring((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 600);
  };

  const handleBulkRestore = () => {
    const ids = Array.from(selectedIds);
    ids.forEach((id) => {
      setRestoring((prev) => new Set(prev).add(id));
    });
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => !selectedIds.has(i.id)));
      setRestoring(new Set());
      setSelectedIds(new Set());
    }, 600);
  };

  const handlePermanentDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    setItems((prev) => prev.filter((i) => !selectedIds.has(i.id)));
    setSelectedIds(new Set());
  };

  const handleEmptyTrash = () => {
    setItems([]);
    setSelectedIds(new Set());
    setShowEmptyConfirm(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-danger-50 dark:bg-danger-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-danger-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Trash</h1>
                <p className="text-sm text-surface-500 dark:text-surface-400">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <>
                <button
                  onClick={handleBulkRestore}
                  className="px-3 py-2 text-sm font-semibold rounded-xl bg-memory-500 text-white hover:bg-memory-600 shadow-sm shadow-memory-500/25 transition-all active:scale-[0.98] flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  Restore Selected ({selectedIds.size})
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-2 text-sm font-semibold rounded-xl bg-danger-500 text-white hover:bg-danger-600 shadow-sm shadow-danger-500/25 transition-all active:scale-[0.98] flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  Delete Selected ({selectedIds.size})
                </button>
              </>
            )}
            <button
              onClick={() => setShowEmptyConfirm(true)}
              disabled={items.length === 0}
              className="px-3 py-2 text-sm font-semibold rounded-xl border border-danger-300 dark:border-danger-700 text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              Empty Trash
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search trash..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-surface-200 dark:border-white/[0.08] bg-white dark:bg-[#0a0a0f]/60 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-3.5 py-2 text-sm font-medium rounded-lg transition-all',
                activeTab === tab.key
                  ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/25'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-white/[0.04]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredItems.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors"
            >
              <div className={cn(
                'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                selectedIds.size === filteredItems.length
                  ? 'bg-brand-500 border-brand-500'
                  : 'border-surface-300 dark:border-surface-600'
              )}>
                {selectedIds.size === filteredItems.length && (
                  <CheckSquare className="w-3 h-3 text-white" />
                )}
              </div>
              Select All
            </button>
          </div>
        )}

        <div className="space-y-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                <Archive className="w-8 h-8 text-surface-400" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">Trash is empty</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400">Deleted items will appear here</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const config = typeConfig[item.type];
              const Icon = config.icon;
              const isRestoring = restoring.has(item.id);

              return (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-2xl border transition-all',
                    'bg-white dark:bg-[#0a0a0f]/40',
                    selectedIds.has(item.id)
                      ? 'border-brand-300 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-500/5'
                      : 'border-surface-200/50 dark:border-white/[0.06] hover:border-surface-300 dark:hover:border-white/[0.12]',
                    isRestoring && 'animate-slide-up opacity-0 scale-95'
                  )}
                >
                  <button
                    onClick={() => toggleSelect(item.id)}
                    className={cn(
                      'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                      selectedIds.has(item.id)
                        ? 'bg-brand-500 border-brand-500'
                        : 'border-surface-300 dark:border-surface-600'
                    )}
                  >
                    {selectedIds.has(item.id) && <CheckSquare className="w-3 h-3 text-white" />}
                  </button>

                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-surface-100 dark:bg-white/[0.04]',
                    config.color
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-surface-900 dark:text-white truncate">{item.name}</span>
                      <span className={cn(
                        'px-2 py-0.5 text-[10px] font-medium rounded-full shrink-0',
                        item.type === 'project' && 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400',
                        item.type === 'task' && 'bg-memory-50 dark:bg-memory-500/10 text-memory-600 dark:text-memory-400',
                        item.type === 'agent' && 'bg-intelligence-50 dark:bg-intelligence-500/10 text-intelligence-600 dark:text-intelligence-400',
                        item.type === 'workflow' && 'bg-execution-50 dark:bg-execution-500/10 text-execution-600 dark:text-execution-400',
                        item.type === 'file' && 'bg-warning-50 dark:bg-warning-500/10 text-warning-600 dark:text-warning-400',
                      )}>
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-surface-500 dark:text-surface-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.deletedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Deleted {formatRelativeTime(item.deletedAt)}
                      </span>
                      {item.size && (
                        <span className="text-surface-400">{item.size}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRestore(item.id)}
                      disabled={isRestoring}
                      className="px-3 py-2 text-xs font-semibold rounded-xl bg-memory-500 text-white hover:bg-memory-600 shadow-sm shadow-memory-500/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restore
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(item.id)}
                      className="p-2 rounded-xl text-surface-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-all"
                      title="Delete permanently"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-6 flex items-center gap-2 px-4 py-3 rounded-2xl bg-warning-50/50 dark:bg-warning-500/5 border border-warning-200/50 dark:border-warning-500/10 text-sm text-warning-600 dark:text-warning-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Items in trash are automatically deleted after 30 days
          </div>
        )}
      </div>

      {showEmptyConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowEmptyConfirm(false)}>
          <div
            className="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-800 animate-slide-up p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-danger-50 dark:bg-danger-500/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-danger-500" />
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white text-center mb-2">Empty Trash?</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 text-center mb-6">
              This action cannot be undone. {items.length} {items.length === 1 ? 'item' : 'items'} will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmptyConfirm(false)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEmptyTrash}
                className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-danger-500 text-white hover:bg-danger-600 shadow-sm shadow-danger-500/25 transition-all"
              >
                Empty Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
