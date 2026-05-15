'use client';

import { useState } from 'react';
import {
  Workflow, GitBranch, Zap, Plus, Search, Play, Pause,
  Clock, CheckCircle, AlertCircle, ArrowRight, Bot,
  MessageSquare, Mail, Globe, Database, Settings,
  BarChart3, Users, ExternalLink, Copy, Trash2,
} from 'lucide-react';

const workflowCategories = [
  'All', 'Sales', 'Marketing', 'Support', 'Operations',
  'Engineering', 'HR', 'Finance', 'Agentic',
];

const workflows = [
  { name: 'Lead Scoring Pipeline', category: 'Sales', trigger: 'New lead created', steps: 5, runs: 1247, status: 'active', lastRun: '2 min ago', color: 'from-violet-500 to-purple-600' },
  { name: 'Deal Stage Notification', category: 'Sales', trigger: 'Deal stage changed', steps: 3, runs: 843, status: 'active', lastRun: '5 min ago', color: 'from-blue-500 to-cyan-600' },
  { name: 'Content Publishing Flow', category: 'Marketing', trigger: 'Content approved', steps: 7, runs: 356, status: 'active', lastRun: '1 hour ago', color: 'from-emerald-500 to-teal-600' },
  { name: 'Support Ticket Escalation', category: 'Support', trigger: 'Ticket priority changed', steps: 4, runs: 2156, status: 'active', lastRun: 'Just now', color: 'from-amber-500 to-orange-600' },
  { name: 'Invoice Auto-Send', category: 'Operations', trigger: 'Invoice generated', steps: 3, runs: 567, status: 'active', lastRun: '30 min ago', color: 'from-rose-500 to-pink-600' },
  { name: 'PR Review Assigner', category: 'Engineering', trigger: 'PR opened', steps: 3, runs: 234, status: 'inactive', lastRun: '1 day ago', color: 'from-indigo-500 to-violet-600' },
  { name: 'Employee Onboarding', category: 'HR', trigger: 'New hire created', steps: 8, runs: 89, status: 'active', lastRun: '3 hours ago', color: 'from-sky-500 to-blue-600' },
  { name: 'Expense Report Approval', category: 'Finance', trigger: 'Expense submitted', steps: 4, runs: 445, status: 'active', lastRun: '15 min ago', color: 'from-green-500 to-emerald-600' },
];

export default function AutomationsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? workflows
    : workflows.filter(w => w.category === activeCategory);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Workflow Automations</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
              Build no-code automations with triggers, conditions, and actions across your entire workspace.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-semibold rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-all flex items-center gap-2">
              <Search className="w-4 h-4" />
              Browse Templates
            </button>
            <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/30 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Workflow
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {workflowCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                  : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((wf) => (
            <div key={wf.name} className="group p-5 rounded-xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40 hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${wf.color} flex items-center justify-center shadow-sm`}>
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                  wf.status === 'active'
                    ? 'bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-400'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400'
                }`}>
                  {wf.status === 'active' ? <><Play className="w-2.5 h-2.5" /> Active</> : <><Pause className="w-2.5 h-2.5" /> Inactive</>}
                </div>
              </div>
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1">{wf.name}</h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-3">
                Trigger: {wf.trigger}
              </p>
              <div className="flex items-center gap-3 text-xs text-surface-500 dark:text-surface-400 mb-3">
                <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />{wf.steps} steps</span>
                <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600" />
                <span className="flex items-center gap-1"><Play className="w-3 h-3" />{wf.runs} runs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-surface-400">Last: {wf.lastRun}</span>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                  <Play className="w-3 h-3" /> Run
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <GitBranch className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">No workflows found</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">Create your first automation workflow.</p>
            <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-all flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" /> Create Workflow
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
