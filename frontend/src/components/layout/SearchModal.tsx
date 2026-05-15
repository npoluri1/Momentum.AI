'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, FileText, MessageSquare, Users, Building2, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  onClose: () => void;
}

const typeFilters = [
  { id: 'project', label: 'Project', icon: FileText },
  { id: 'task', label: 'Task', icon: MessageSquare },
  { id: 'comment', label: 'Comment', icon: MessageSquare },
];

const workspaceTeams = [
  { id: 'personal', label: 'Personal Workspace' },
  { id: 'team', label: 'Team Workspace' },
];

export function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const toggleType = (id: string) => {
    setSelectedTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-surface-900 rounded-2xl border border-surface-700/50 shadow-2xl shadow-black/50 overflow-hidden animate-slide-down">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-surface-700/50">
          <Search className="w-5 h-5 text-surface-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-surface-100 placeholder:text-surface-500 focus:outline-none"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-surface-800 text-surface-500 font-mono border border-surface-700/50">ESC</kbd>
        </div>

        <div className="flex min-h-[300px]">
          <div className="w-52 border-r border-surface-700/50 p-3 space-y-4 shrink-0">
            <div>
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2 px-2">Type</p>
              <div className="space-y-0.5">
                {typeFilters.map((filter) => {
                  const checked = selectedTypes.includes(filter.id);
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => toggleType(filter.id)}
                      className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 transition-colors text-left"
                    >
                      <div className={cn(
                        'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors shrink-0',
                        checked
                          ? 'bg-brand-500 border-brand-500'
                          : 'border-surface-600 hover:border-surface-500'
                      )}>
                        {checked && <span className="text-white text-[8px] font-bold">&#10003;</span>}
                      </div>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{filter.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2 px-2">Workspace &amp; Teams</p>
              <div className="space-y-0.5">
                {workspaceTeams.map((ws) => (
                  <button
                    key={ws.id}
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 transition-colors text-left"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{ws.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg">
              <Search className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-base font-semibold text-surface-100 mb-1">Global Search</h3>
            <p className="text-sm text-surface-400 max-w-sm">
              Search across all your workspaces, folders, and projects.
            </p>
            <a
              href="#"
              className="mt-4 text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1"
            >
              Learn more
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
