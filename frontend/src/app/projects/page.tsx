"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FolderKanban, Plus, Search, MoreHorizontal, Clock,
  Users, CheckCircle, AlertCircle, BarChart3, Bot,
  Calendar, Filter, Grid3X3, List, GitBranch,
} from 'lucide-react';

const projects = [
  { name: 'Sales Pipeline', status: 'active', progress: 75, tasks: 24, completed: 18, members: 5, due: 'Dec 20', color: 'from-violet-500 to-purple-600', priority: 'high' },
  { name: 'CRM Implementation', status: 'active', progress: 45, tasks: 32, completed: 14, members: 3, due: 'Jan 15', color: 'from-blue-500 to-cyan-600', priority: 'high' },
  { name: 'Customer Portal', status: 'active', progress: 90, tasks: 18, completed: 16, members: 4, due: 'Dec 5', color: 'from-emerald-500 to-teal-600', priority: 'medium' },
  { name: 'Marketing Site Redesign', status: 'on_hold', progress: 30, tasks: 15, completed: 5, members: 2, due: 'Feb 1', color: 'from-amber-500 to-orange-600', priority: 'low' },
  { name: 'Q4 Financial Reports', status: 'active', progress: 60, tasks: 12, completed: 7, members: 3, due: 'Dec 30', color: 'from-rose-500 to-pink-600', priority: 'medium' },
  { name: 'Employee Onboarding', status: 'completed', progress: 100, tasks: 20, completed: 20, members: 2, due: 'Nov 30', color: 'from-indigo-500 to-violet-600', priority: 'low' },
];

const statusColors: Record<string, string> = {
  active: 'bg-success-500',
  on_hold: 'bg-warning-500',
  completed: 'bg-blue-500',
};

export default function ProjectsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Projects</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
              {projects.length} projects · {projects.filter(p => p.status === 'active').length} active
            </p>
          </div>
          <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="Search projects..."
                  className="pl-9 pr-4 py-2 text-sm rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 w-56"
                />
              </div>
            <div className="flex items-center gap-1 bg-white dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-0.5">
              <button onClick={() => setView('grid')} className={`p-1.5 rounded ${view === 'grid' ? 'bg-surface-100 dark:bg-surface-700 text-surface-900 dark:text-white' : 'text-surface-400'}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-surface-100 dark:bg-surface-700 text-surface-900 dark:text-white' : 'text-surface-400'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
            <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/30 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Project
            </button>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((project) => (
              <Link key={project.name} href={`/projects/${encodeURIComponent(project.name)}`} className="group block">
                <div className="p-5 rounded-xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40 hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-sm`}>
                    <FolderKanban className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${statusColors[project.status] || 'bg-surface-400'}`} />
                    <span className="text-xs text-surface-500 dark:text-surface-400 capitalize">{project.status.replace('_', ' ')}</span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1">{project.name}</h3>
                <div className="flex items-center gap-3 text-xs text-surface-500 dark:text-surface-400 mb-3">
                  <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />{project.completed}/{project.tasks}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{project.members}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{project.due}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${project.color} transition-all duration-500`} style={{ width: `${project.progress}%` }} />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-surface-400">{project.progress}%</span>
                </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40 overflow-hidden">
            <div className="grid grid-cols-6 gap-4 px-5 py-3 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
              <span className="col-span-2">Project</span>
              <span>Progress</span>
              <span>Tasks</span>
              <span>Due</span>
              <span></span>
            </div>
            {filtered.map((project) => (
              <Link key={project.name} href={`/projects/${encodeURIComponent(project.name)}`} className="block">
                <div className="grid grid-cols-6 gap-4 px-5 py-3.5 text-sm items-center hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors border-b border-surface-100 dark:border-surface-800 last:border-0">
                <div className="col-span-2 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                    <FolderKanban className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-surface-900 dark:text-white">{project.name}</span>
                    <div className={`w-2 h-2 rounded-full ${statusColors[project.status] || 'bg-surface-400'} inline-block ml-2`} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${project.color}`} style={{ width: `${project.progress}%` }} />
                  </div>
                  <span className="text-xs text-surface-500">{project.progress}%</span>
                </div>
                <span className="text-surface-600 dark:text-surface-300">{project.completed}/{project.tasks}</span>
                <span className="text-surface-500">{project.due}</span>
                  <div className="flex justify-end">
                    <button className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-400">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
