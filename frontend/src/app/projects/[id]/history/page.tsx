'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cn, formatRelativeTime } from '@/lib/utils';
import {
  History, ArrowLeft, RotateCcw, Clock, User,
  GitBranch, Check, X, RefreshCw,
  FileText, Bot, Search,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Version {
  id: string;
  version: number;
  label: string;
  description: string;
  author: string;
  timestamp: Date;
  type: 'manual' | 'auto' | 'restore' | 'agent';
  size: string;
  changes: number;
  tags: string[];
  current?: boolean;
}

const versions: Version[] = [
  { id: 'v8', version: 8, label: 'Latest version', description: 'Updated task descriptions and added priority labels', author: 'Sarah Chen', timestamp: new Date(Date.now() - 3600000), type: 'manual', size: '12.4 KB', changes: 5, tags: ['tasks', 'labels'], current: true },
  { id: 'v7', version: 7, label: 'AI optimization pass', description: 'Agent optimized task assignments and due dates', author: 'Lead Scorer AI', timestamp: new Date(Date.now() - 7200000), type: 'agent', size: '12.1 KB', changes: 8, tags: ['ai', 'optimization'] },
  { id: 'v6', version: 6, label: 'Sprint planning update', description: 'Added sprint 12 tasks and adjusted milestones', author: 'Alex Rivera', timestamp: new Date(Date.now() - 14400000), type: 'manual', size: '11.8 KB', changes: 12, tags: ['sprint', 'planning'] },
  { id: 'v5', version: 5, label: 'Restore from backup', description: 'Restored to version from May 28 after data issue', author: 'System', timestamp: new Date(Date.now() - 28800000), type: 'restore', size: '10.2 KB', changes: 0, tags: ['restore', 'backup'] },
  { id: 'v4', version: 4, label: 'Client feedback applied', description: 'Updated scope based on client review meeting', author: 'Maria Santos', timestamp: new Date(Date.now() - 86400000), type: 'manual', size: '11.5 KB', changes: 15, tags: ['feedback', 'scope'] },
  { id: 'v3', version: 3, label: 'Auto-save checkpoint', description: 'Automatic save after 20 minutes of editing', author: 'System', timestamp: new Date(Date.now() - 172800000), type: 'auto', size: '10.8 KB', changes: 6, tags: ['auto-save', 'checkpoint'] },
  { id: 'v2', version: 2, label: 'Initial task setup', description: 'Created initial task structure with milestones and assignments', author: 'David Kim', timestamp: new Date(Date.now() - 259200000), type: 'manual', size: '8.2 KB', changes: 25, tags: ['initial', 'setup'] },
  { id: 'v1', version: 1, label: 'Project created', description: 'Project workspace created from template', author: 'John Doe', timestamp: new Date(Date.now() - 432000000), type: 'auto', size: '4.1 KB', changes: 0, tags: ['creation'] },
];

const typeConfig = {
  manual: { icon: FileText, label: 'Manual Save', color: 'text-brand-500', bg: 'bg-brand-500/10' },
  auto: { icon: Clock, label: 'Auto-Save', color: 'text-memory-500', bg: 'bg-memory-500/10' },
  restore: { icon: RotateCcw, label: 'Restore', color: 'text-warning-500', bg: 'bg-warning-500/10' },
  agent: { icon: Bot, label: 'AI Action', color: 'text-intelligence-500', bg: 'bg-intelligence-500/10' },
};

export default function VersionHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [showCompare, setShowCompare] = useState<Version | null>(null);
  const [restoring, setRestoring] = useState(false);

  const handleTagClick = (tag: string) => {
    setSearch(tag);
  };

  const filteredVersions = useMemo(() => {
    return versions.filter(v => {
      const matchSearch = v.label.toLowerCase().includes(search.toLowerCase()) || v.description.toLowerCase().includes(search.toLowerCase()) || v.author.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'all' || v.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [search, typeFilter]);

  const handleRestore = (version: Version) => {
    setRestoring(true);
    setTimeout(() => {
      toast.success(`Restored to version ${version.version}: ${version.label}`);
      setRestoring(false);
      setSelectedVersion(null);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-surface-900 dark:text-white">Version History</h1>
            <p className="text-xs text-surface-500">{versions.length} versions · Auto-saves every 20 minutes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search versions..." className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-surface-100/80 dark:bg-white/[0.06] border border-surface-200/50 dark:border-transparent text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 w-48" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="text-xs px-2.5 py-1.5 rounded-lg bg-surface-100/80 dark:bg-white/[0.06] border border-surface-200/50 dark:border-transparent text-surface-600 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30">
            <option value="all">All Types</option>
            <option value="manual">Manual</option>
            <option value="auto">Auto-Save</option>
            <option value="agent">AI Action</option>
            <option value="restore">Restore</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      {filteredVersions.length === 0 ? (
        <div className="text-center py-16">
          <History className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
          <p className="text-sm text-surface-500">No versions found matching your search</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredVersions.map((version, i) => {
            const config = typeConfig[version.type];
            const Icon = config.icon;
            const isSelected = selectedVersion?.id === version.id;

            return (
              <div key={version.id} className={cn(
                'flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer',
                version.current
                  ? 'border-brand-500/30 bg-brand-500/5'
                  : isSelected
                  ? 'border-brand-500/20 bg-surface-50/50 dark:bg-white/[0.03]'
                  : 'border-surface-200/50 dark:border-white/[0.06] hover:border-surface-300 dark:hover:border-white/[0.12] bg-white dark:bg-[#0a0a0f]/40'
              )} onClick={() => setSelectedVersion(isSelected ? null : version)}>
                {/* Version Number */}
                <div className="flex flex-col items-center gap-1 min-w-[40px]">
                  <div className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold border-2',
                    version.current
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'bg-surface-100 dark:bg-white/[0.06] text-surface-600 dark:text-surface-400 border-surface-200 dark:border-white/[0.08]'
                  )}>
                    v{version.version}
                  </div>
                  {i < filteredVersions.length - 1 && <div className="w-0.5 h-6 bg-surface-200 dark:bg-white/[0.06]" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">{version.label}</p>
                    <span className={cn('px-1.5 py-0.5 text-[9px] font-medium rounded-md border', config.bg, config.color)}>
                      <Icon className="w-2.5 h-2.5 inline-block mr-0.5" />{config.label}
                    </span>
                    {version.current && (
                      <span className="px-1.5 py-0.5 text-[9px] font-medium rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">Current</span>
                    )}
                  </div>
                  <p className="text-xs text-surface-500 mb-1.5">{version.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-surface-400">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{version.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatRelativeTime(version.timestamp)}</span>
                    <span>{version.size}</span>
                    {version.changes > 0 && <span>{version.changes} changes</span>}
                  </div>
                  {version.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {version.tags.map(tag => (
                        <button key={tag} onClick={(e) => { e.stopPropagation(); handleTagClick(tag); }}
                          className="px-1.5 py-0.5 text-[9px] font-medium rounded-md bg-surface-100 dark:bg-white/[0.04] text-surface-400 hover:text-brand-500 transition-all"
                        >{tag}</button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {!version.current && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); setShowCompare(version); }} className="p-2 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all" title="Compare">
                        <GitBranch className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleRestore(version); }} disabled={restoring} className="p-2 rounded-lg text-warning-500 hover:bg-warning-500/10 transition-all" title="Restore this version">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compare Panel */}
      {showCompare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowCompare(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-2xl animate-scale-in overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-surface-900 dark:text-white">Compare Versions</h2>
                  <p className="text-xs text-surface-400">Current vs v{showCompare.version}</p>
                </div>
              </div>
              <button onClick={() => setShowCompare(null)} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 divide-x divide-surface-200 dark:divide-surface-700">
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-surface-100 dark:border-white/[0.04]">
                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                  <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">Current (v{versions.find(v => v.current)?.version || 8})</span>
                </div>
                {['Design homepage hero', 'Implement auth flow', 'Write API docs', 'Setup CI/CD', 'Add tests'].map((task, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-surface-50/30 dark:bg-white/[0.02]">
                    <Check className="w-3.5 h-3.5 text-success-500 shrink-0" />
                    <span className="text-xs text-surface-700 dark:text-surface-300">{task}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-surface-100 dark:border-white/[0.04]">
                  <div className="w-2 h-2 rounded-full bg-surface-400" />
                  <span className="text-xs font-semibold text-surface-500">v{showCompare.version}</span>
                </div>
                {['Design homepage hero', 'Implement auth flow', 'Write API docs'].map((task, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-surface-50/30 dark:bg-white/[0.02]">
                    <Check className="w-3.5 h-3.5 text-success-500 shrink-0" />
                    <span className="text-xs text-surface-700 dark:text-surface-300">{task}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-danger-50/50 dark:bg-danger-500/10 border border-danger-200/30">
                  <X className="w-3.5 h-3.5 text-danger-500 shrink-0" />
                  <span className="text-xs text-danger-600 dark:text-danger-400 line-through">Setup CI/CD</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-danger-50/50 dark:bg-danger-500/10 border border-danger-200/30">
                  <X className="w-3.5 h-3.5 text-danger-500 shrink-0" />
                  <span className="text-xs text-danger-600 dark:text-danger-400 line-through">Add tests</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-surface-200/50 dark:border-white/[0.06]">
              <button onClick={() => setShowCompare(null)} className="px-4 py-2 text-sm font-semibold rounded-xl text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">Close</button>
              <button onClick={() => { handleRestore(showCompare); setShowCompare(null); }} disabled={restoring} className="px-4 py-2 text-sm font-semibold rounded-xl bg-warning-500 text-white hover:bg-warning-600 shadow-sm transition-all flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4" /> Restore v{showCompare.version}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
