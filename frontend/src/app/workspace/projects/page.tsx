'use client';

import React, { useState } from 'react';
import {
  FolderKanban, Search, Grid3x3, List, Plus, MoreHorizontal,
  Circle, Users, Clock, CheckCircle, AlertCircle, ArrowRight,
  Calendar, Target, BarChart3, Sparkles, Github,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const projects = [
  { id: 1, name: 'Website Redesign', status: 'In Progress', progress: 65, members: 3, tasks: { done: 8, total: 12 }, due: 'Jul 15', priority: 'High', category: 'Design' },
  { id: 2, name: 'Mobile App v2', status: 'Planning', progress: 30, members: 2, tasks: { done: 7, total: 24 }, due: 'Sep 01', priority: 'Medium', category: 'Engineering' },
  { id: 3, name: 'CRM Integration', status: 'In Progress', progress: 80, members: 2, tasks: { done: 6, total: 8 }, due: 'Jun 30', priority: 'High', category: 'Engineering' },
  { id: 4, name: 'Q4 Marketing Campaign', status: 'Planning', progress: 10, members: 1, tasks: { done: 2, total: 18 }, due: 'Oct 01', priority: 'Medium', category: 'Marketing' },
  { id: 5, name: 'API Documentation', status: 'Completed', progress: 100, members: 2, tasks: { done: 15, total: 15 }, due: 'Jun 10', priority: 'Low', category: 'Engineering' },
  { id: 6, name: 'Sales Playbook', status: 'In Progress', progress: 45, members: 3, tasks: { done: 5, total: 11 }, due: 'Aug 20', priority: 'High', category: 'Sales' },
];

const statusColors: Record<string, string> = {
  'In Progress': 'bg-execution-500',
  'Planning': 'bg-intelligence-500',
  'Completed': 'bg-memory-500',
};

const statusBadgeColors: Record<string, string> = {
  'In Progress': 'text-execution-500 bg-execution-500/10 border-execution-500/20',
  'Planning': 'text-intelligence-500 bg-intelligence-500/10 border-intelligence-500/20',
  'Completed': 'text-memory-500 bg-memory-500/10 border-memory-500/20',
};

const priorityColors: Record<string, string> = {
  High: 'text-danger-500 bg-danger-500/10 border-danger-500/20',
  Medium: 'text-warning-500 bg-warning-500/10 border-warning-500/20',
  Low: 'text-surface-400 bg-surface-100 dark:bg-white/[0.06] border-surface-200 dark:border-white/[0.06]',
};

const categories = ['All', 'Engineering', 'Design', 'Marketing', 'Sales'];

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = projects.filter(p => {
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">Projects</h1>
            <p className="text-sm text-surface-500 mt-1">{projects.length} active projects <span className="text-surface-300 dark:text-surface-600">·</span> <span className="text-memory-500 font-medium">{projects.filter(p => p.status === 'In Progress').length} in progress</span></p>
          </div>
          <div className="flex items-center gap-2">
            <button className="apple-button-primary">
              <Plus className="w-4 h-4" /> New Project
            </button>
            <div className="flex items-center bg-surface-100/80 dark:bg-white/[0.06] rounded-xl p-0.5 border border-surface-200/50 dark:border-white/[0.06]">
              <button onClick={() => setViewMode('grid')} className={cn('p-2 rounded-lg transition-all', viewMode === 'grid' ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm' : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300')}>
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={cn('p-2 rounded-lg transition-all', viewMode === 'list' ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm' : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300')}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search & filters - Apple style */}
        <div className="flex items-center gap-3 mb-7">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="apple-input pl-10"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all',
                  selectedCategory === cat
                    ? 'bg-surface-900 dark:bg-white text-white dark:text-surface-900 shadow-md'
                    : 'bg-surface-100/80 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 hover:bg-surface-200/50 dark:hover:bg-white/[0.1] border border-transparent'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid/List view */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((project, i) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={cn(
                  'apple-card p-5 cursor-pointer',
                  selectedProject.id === project.id
                    ? 'ring-2 ring-brand-500/30'
                    : ''
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-brand-500" />
                  </div>
                  <div className={cn('px-2.5 py-0.5 rounded-full text-[11px] font-semibold border', priorityColors[project.priority])}>
                    {project.priority}
                  </div>
                </div>

                <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-3">{project.name}</h3>

                {/* Progress bar - Apple style */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-surface-400 mb-2">
                    <span>Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <div className="apple-progress">
                    <div className={cn('apple-progress-bar', statusColors[project.status])} style={{ width: `${project.progress}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3.5 border-t border-surface-100/50 dark:border-white/[0.06]">
                  <div className="flex items-center gap-3 text-xs text-surface-400">
                    <span className="flex items-center gap-1.5 bg-surface-50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">
                      <Users className="w-3 h-3" /> {project.members}
                    </span>
                    <span className="flex items-center gap-1.5 bg-surface-50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">
                      <CheckCircle className="w-3 h-3" /> {project.tasks.done}/{project.tasks.total}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-surface-400 bg-surface-50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">
                    <Calendar className="w-3 h-3" /> {project.due}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(project => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={cn(
                  'apple-card flex items-center gap-4 p-4 cursor-pointer',
                  selectedProject.id === project.id
                    ? 'ring-2 ring-brand-500/30'
                    : ''
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 flex items-center justify-center shrink-0">
                  <FolderKanban className="w-4 h-4 text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-surface-900 dark:text-white">{project.name}</span>
                    <div className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold border', statusBadgeColors[project.status])}>
                      {project.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-400 mt-0.5">
                    <span>{project.category}</span>
                    <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
                    <span>{project.members} {project.members === 1 ? 'member' : 'members'}</span>
                    <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
                    <span>Due {project.due}</span>
                  </div>
                </div>
                <div className="w-28">
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 apple-progress">
                      <div className={cn('apple-progress-bar', statusColors[project.status])} style={{ width: `${project.progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-surface-500 w-8 text-right">{project.progress}%</span>
                  </div>
                </div>
                <div className={cn('px-2.5 py-0.5 rounded-full text-[11px] font-semibold border', priorityColors[project.priority])}>
                  {project.priority}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel - Apple style */}
      <aside className="hidden lg:block w-[400px] border-l border-surface-200/50 dark:border-white/[0.06] p-6 md:p-8 overflow-y-auto bg-white/50 dark:bg-[#0a0a0f]/50 backdrop-blur-xl">
        <div className="animate-fade-in">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-intelligence-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <FolderKanban className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white">{selectedProject.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-surface-500">{selectedProject.category}</span>
                <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
                <div className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold border', statusBadgeColors[selectedProject.status])}>
                  {selectedProject.status}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {/* Progress */}
            <div className="apple-card p-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-surface-500">Progress</span>
                <span className="font-bold text-surface-900 dark:text-white">{selectedProject.progress}%</span>
              </div>
              <div className="apple-progress h-2">
                <div className={cn('apple-progress-bar', statusColors[selectedProject.status])} style={{ width: `${selectedProject.progress}%` }} />
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="apple-card p-4">
                <div className="flex items-center gap-2 text-sm text-surface-400 mb-1.5">
                  <CheckCircle className="w-4 h-4 text-memory-500" /> Tasks
                </div>
                <span className="text-xl font-bold text-surface-900 dark:text-white">{selectedProject.tasks.done}/{selectedProject.tasks.total}</span>
              </div>
              <div className="apple-card p-4">
                <div className="flex items-center gap-2 text-sm text-surface-400 mb-1.5">
                  <Users className="w-4 h-4 text-intelligence-500" /> Members
                </div>
                <span className="text-xl font-bold text-surface-900 dark:text-white">{selectedProject.members}</span>
              </div>
            </div>

            {/* Detail rows */}
            <div className="apple-card divide-y divide-surface-100/50 dark:divide-white/[0.04]">
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-surface-500">Status</span>
                <div className={cn('flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border', statusBadgeColors[selectedProject.status])}>
                  <Circle className={cn('w-2 h-2 fill-current', statusColors[selectedProject.status].replace('bg-', 'text-'))} />
                  {selectedProject.status}
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-surface-500">Due Date</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-surface-900 dark:text-white">
                  <Calendar className="w-4 h-4 text-surface-400" /> {selectedProject.due}
                </span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-surface-500">Priority</span>
                <div className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold border', priorityColors[selectedProject.priority])}>
                  {selectedProject.priority}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button className="apple-button-primary w-full">
              <Target className="w-4 h-4" /> View Project Board
            </button>
            <button className="apple-button-secondary w-full">
              <BarChart3 className="w-4 h-4" /> View Analytics
            </button>
            <button className="apple-button-secondary w-full">
              <Sparkles className="w-4 h-4" /> AI Insights
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
