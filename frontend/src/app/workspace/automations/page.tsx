'use client';

import React, { useState } from 'react';
import {
  Workflow, Search, Plus, Play, Square, Clock,
  GitBranch, Mail, MessageCircle, Share2, Download,
  Code, AlertCircle, CheckCircle, ArrowRight, Zap,
  Sparkles, MoreHorizontal, Tag, User, RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = ['All', 'Sales', 'Support', 'Marketing', 'Engineering', 'Data'];

const automations = [
  { id: 1, name: 'Lead Email Outreach', trigger: 'New CRM Lead Created', steps: 4, status: 'Running', category: 'Sales', lastRun: '2 min ago', icon: Mail, gradient: 'from-rose-500 to-pink-600' },
  { id: 2, name: 'Support Ticket Escalation', trigger: 'Low Satisfaction Score', steps: 3, status: 'Stopped', category: 'Support', lastRun: '1 day ago', icon: MessageCircle, gradient: 'from-violet-500 to-purple-600' },
  { id: 3, name: 'Slack Notifications', trigger: 'Deal Stage Changed', steps: 2, status: 'Running', category: 'Sales', lastRun: '5 min ago', icon: Share2, gradient: 'from-sky-500 to-cyan-500' },
  { id: 4, name: 'Data Sync Pipeline', trigger: 'Daily Schedule (2AM)', steps: 6, status: 'Running', category: 'Data', lastRun: '3 hours ago', icon: Download, gradient: 'from-emerald-500 to-teal-500' },
  { id: 5, name: 'Welcome Email Series', trigger: 'New User Signup', steps: 5, status: 'Running', category: 'Marketing', lastRun: '1 hour ago', icon: Mail, gradient: 'from-amber-500 to-orange-600' },
  { id: 6, name: 'Code Review Reminder', trigger: 'PR Open > 4 hours', steps: 2, status: 'Paused', category: 'Engineering', lastRun: '2 days ago', icon: Code, gradient: 'from-blue-500 to-indigo-600' },
  { id: 7, name: 'Invoice Generator', trigger: 'Deal Closed Won', steps: 4, status: 'Running', category: 'Sales', lastRun: '30 min ago', icon: Download, gradient: 'from-emerald-500 to-teal-500' },
  { id: 8, name: 'Nurture Campaign', trigger: 'Lead Not Contacted 7d', steps: 8, status: 'Stopped', category: 'Marketing', lastRun: '5 days ago', icon: GitBranch, gradient: 'from-rose-500 to-pink-600' },
];

const statusConfig: Record<string, { icon: any; class: string }> = {
  Running: { icon: Play, class: 'text-memory-500 bg-memory-500/10 border-memory-500/20' },
  Stopped: { icon: Square, class: 'text-danger-500 bg-danger-500/10 border-danger-500/20' },
  Paused: { icon: Clock, class: 'text-warning-500 bg-warning-500/10 border-warning-500/20' },
};

export default function AutomationsPage() {
  const [selectedAutomation, setSelectedAutomation] = useState(automations[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = automations.filter(a => {
    const matchCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.trigger.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">Automation Flows</h1>
            <p className="text-sm text-surface-500 mt-1">{automations.filter(a => a.status === 'Running').length} active workflows <span className="text-surface-300 dark:text-surface-600">·</span> <span className="text-surface-400">{automations.length} total</span></p>
          </div>
          <div className="flex items-center gap-2">
            <button className="apple-button-primary">
              <Plus className="w-4 h-4" /> Create Workflow
            </button>
          </div>
        </div>

        {/* Search & categories */}
        <div className="flex items-center gap-3 mb-7">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search workflows..."
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
                    : 'bg-surface-100/80 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 hover:bg-surface-200/50 dark:hover:bg-white/[0.1]'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Workflow list */}
        <div className="space-y-3">
          {filtered.map((workflow, i) => {
            const StatusIcon = statusConfig[workflow.status].icon;
            const Icon = workflow.icon;
            return (
              <div
                key={workflow.id}
                onClick={() => setSelectedAutomation(workflow)}
                className={cn(
                  'apple-card flex items-center gap-4 p-4 md:p-5 cursor-pointer',
                  selectedAutomation.id === workflow.id ? 'ring-2 ring-brand-500/30' : ''
                )}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={cn('w-11 h-11 rounded-2xl bg-gradient-to-br shrink-0 flex items-center justify-center shadow-sm', workflow.gradient)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="font-semibold text-surface-900 dark:text-white">{workflow.name}</span>
                    <span className={cn('flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border', statusConfig[workflow.status].class)}>
                      <StatusIcon className="w-3 h-3" />
                      {workflow.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-500">
                    <span className="flex items-center gap-1.5 bg-surface-50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">
                      <Zap className="w-3 h-3" /> {workflow.trigger}
                    </span>
                    <span className="flex items-center gap-1.5 bg-surface-50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">
                      <GitBranch className="w-3 h-3" /> {workflow.steps} steps
                    </span>
                    <span className="flex items-center gap-1.5 bg-surface-50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3" /> {workflow.lastRun}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={e => { e.stopPropagation(); }} className={cn(
                    'p-2.5 rounded-xl transition-all',
                    workflow.status === 'Running'
                      ? 'bg-memory-500/10 text-memory-500 hover:bg-memory-500/20 border border-transparent hover:border-memory-500/30'
                      : 'bg-surface-100/80 dark:bg-white/[0.06] text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.1]'
                  )}>
                    {workflow.status === 'Running' ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button className="p-2.5 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100/80 dark:hover:bg-white/[0.06] transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
              <Workflow className="w-8 h-8 text-surface-400" />
            </div>
            <p className="text-surface-500 dark:text-surface-400">No workflows found matching your filters</p>
          </div>
        )}
      </div>

      {/* Detail panel - Apple style */}
      <aside className="hidden lg:block w-[400px] border-l border-surface-200/50 dark:border-white/[0.06] p-6 md:p-8 overflow-y-auto bg-white/50 dark:bg-[#0a0a0f]/50 backdrop-blur-xl">
        <div className="animate-fade-in">
          <div className="flex items-center gap-4 mb-8">
            <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg', selectedAutomation.gradient)}>
              {React.createElement(selectedAutomation.icon, { className: 'w-7 h-7 text-white' })}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white">{selectedAutomation.name}</h2>
              <p className="text-sm text-surface-500 mt-0.5">{selectedAutomation.category} · {selectedAutomation.steps} steps</p>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="apple-card divide-y divide-surface-100/50 dark:divide-white/[0.04]">
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-surface-500">Status</span>
                <div className={cn('flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border', statusConfig[selectedAutomation.status].class)}>
                  {React.createElement(statusConfig[selectedAutomation.status].icon, { className: 'w-3.5 h-3.5' })}
                  {selectedAutomation.status}
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-surface-500">Last Run</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-surface-900 dark:text-white">
                  <Clock className="w-4 h-4 text-surface-400" /> {selectedAutomation.lastRun}
                </span>
              </div>
            </div>

            <div className="apple-card p-4">
              <div className="flex items-center gap-2 text-sm text-surface-400 mb-2.5">
                <Zap className="w-4 h-4 text-brand-500" /> Trigger
              </div>
              <p className="text-sm font-semibold text-surface-900 dark:text-white">{selectedAutomation.trigger}</p>
            </div>

            <div className="apple-card p-4">
              <div className="flex items-center gap-2 text-sm text-surface-400 mb-2.5">
                <GitBranch className="w-4 h-4 text-execution-500" /> Workflow Steps
              </div>
              <p className="text-sm font-semibold text-surface-900 dark:text-white">{selectedAutomation.steps} steps configured</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className={cn(
              'w-full flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all active:scale-[0.98]',
              selectedAutomation.status === 'Running'
                ? 'bg-danger-500 text-white hover:bg-danger-600 shadow-lg shadow-danger-500/25'
                : 'apple-button-primary w-full'
            )}>
              {selectedAutomation.status === 'Running' ? (
                <><Square className="w-4 h-4" /> Stop Workflow</>
              ) : (
                <><Play className="w-4 h-4" /> Start Workflow</>
              )}
            </button>
            <button className="apple-button-secondary w-full">
              <GitBranch className="w-4 h-4" /> Edit Steps
            </button>
            <button className="apple-button-secondary w-full">
              <RefreshCw className="w-4 h-4" /> View Run History
            </button>
          </div>

          {/* Recent runs */}
          <div className="mt-6 pt-6 border-t border-surface-200/50 dark:border-white/[0.06]">
            <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Recent Runs</h4>
            <div className="space-y-2">
              {[
                { time: '2 min ago', status: 'Success', duration: '3.2s' },
                { time: '1 hour ago', status: 'Success', duration: '2.8s' },
                { time: '3 hours ago', status: 'Failed', duration: '1.5s' },
              ].map((run, i) => (
                <div key={i} className="apple-card flex items-center justify-between p-3.5">
                  <div className="flex items-center gap-2.5">
                    {run.status === 'Success' ? (
                      <CheckCircle className="w-4 h-4 text-memory-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-danger-500" />
                    )}
                    <span className="text-sm text-surface-600 dark:text-surface-400">{run.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={cn('px-2 py-0.5 rounded-full font-semibold border', run.status === 'Success' ? 'text-memory-500 bg-memory-500/10 border-memory-500/20' : 'text-danger-500 bg-danger-500/10 border-danger-500/20')}>{run.status}</span>
                    <span className="text-surface-400 font-mono">{run.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
