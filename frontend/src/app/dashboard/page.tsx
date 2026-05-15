'use client';

import { useState } from 'react';
import {
  Bot, Workflow, FolderKanban, GitBranch, Plus, Search,
  Grid3X3, BarChart3, Users, Settings, Zap, Sparkles,
  Copy, ExternalLink, ChevronRight, Clock, Star, TrendingUp,
} from 'lucide-react';

const workspaceApps = [
  { name: 'Sales Pipeline', team: 'SALES', agents: 2, projects: 4, flows: 3, status: 'active', color: 'from-violet-500 to-purple-600' },
  { name: 'CRM Dashboard', team: 'SALES', agents: 1, projects: 2, flows: 2, status: 'active', color: 'from-blue-500 to-cyan-600' },
  { name: 'Customer Support', team: 'SUPPORT', agents: 2, projects: 3, flows: 4, status: 'active', color: 'from-emerald-500 to-teal-600' },
  { name: 'Finance Tracker', team: 'OPS', agents: 1, projects: 3, flows: 2, status: 'active', color: 'from-amber-500 to-orange-600' },
  { name: 'AI Research', team: 'RESEARCH', agents: 4, projects: 8, flows: 5, status: 'active', color: 'from-rose-500 to-pink-600' },
  { name: 'Marketing Analytics', team: 'MARKETING', agents: 2, projects: 5, flows: 3, status: 'active', color: 'from-indigo-500 to-violet-600' },
];

const agentTemplates = [
  { name: 'Lead Enrichment', desc: 'Research and enrich B2B leads', icon: Bot, color: 'from-violet-500 to-purple-600' },
  { name: 'SDR Agent', desc: 'Automate sales development outreach', icon: Users, color: 'from-blue-500 to-cyan-600' },
  { name: 'Code Reviewer', desc: 'Review code and suggest improvements', icon: Workflow, color: 'from-emerald-500 to-teal-600' },
  { name: 'Content Writer', desc: 'Generate SEO-optimized content', icon: Sparkles, color: 'from-amber-500 to-orange-600' },
];

const recentActivity = [
  { action: 'Sales Pipeline workflow completed', time: '2 min ago', type: 'workflow' },
  { action: 'Lead enrichment agent processed 45 leads', time: '15 min ago', type: 'agent' },
  { action: 'New deal added: Acme Corp - $50K', time: '1 hour ago', type: 'crm' },
  { action: 'Customer support ticket escalated', time: '2 hours ago', type: 'task' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">My Workspace</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
              Projects hold the memory. Agents do the thinking. Automations run the work.
            </p>
          </div>
          <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/30 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New App
          </button>
        </div>

        <div className="flex items-center gap-1 mb-8 border-b border-surface-200 dark:border-surface-800 pb-0.5">
          {['Overview', 'Apps', 'Agents', 'Workflows', 'Projects', 'Analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                activeTab === tab.toLowerCase()
                  ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Apps</h2>
              <button className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {workspaceApps.slice(0, 4).map((app) => (
                <div key={app.name} className="group p-4 rounded-xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40 hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-sm`}>
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-all">
                      <Copy className="w-3.5 h-3.5 text-surface-400" />
                    </button>
                  </div>
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1">{app.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400 mb-3">
                    <span className="px-1.5 py-0.5 rounded bg-surface-100 dark:bg-surface-800 font-medium">{app.team}</span>
                    <span>Updated 2h ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-500 dark:text-surface-400">
                    <span className="flex items-center gap-1"><Bot className="w-3 h-3" />{app.agents}</span>
                    <span className="flex items-center gap-1"><FolderKanban className="w-3 h-3" />{app.projects}</span>
                    <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />{app.flows}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-2">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white">AI Agents</h2>
              <button className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {agentTemplates.map((agent) => {
                const Icon = agent.icon;
                return (
                  <div key={agent.name} className="flex items-start gap-3 p-4 rounded-xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40 hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-all cursor-pointer group">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-0.5">{agent.name}</h3>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{agent.desc}</p>
                    </div>
                    <button className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 opacity-0 group-hover:opacity-100 transition-all">
                      Use
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Quick Stats</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Active Apps', value: '6', change: '+2 this week' },
                  { label: 'AI Agents', value: '12', change: '4 running now' },
                  { label: 'Workflows', value: '18', change: '142 runs today' },
                  { label: 'Tasks Completed', value: '847', change: '+23% vs last week' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-2 border-b border-surface-100 dark:border-surface-800 last:border-0">
                    <div>
                      <div className="text-xs text-surface-500 dark:text-surface-400">{stat.label}</div>
                      <div className="text-lg font-bold text-surface-900 dark:text-white">{stat.value}</div>
                    </div>
                    <span className="text-xs text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-950/30 px-2 py-0.5 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-surface-500" />
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                    <div>
                      <p className="text-sm text-surface-700 dark:text-surface-300">{item.action}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-white" />
                  <h3 className="text-sm font-semibold text-white">AI App Builder</h3>
                </div>
                <p className="text-xs text-brand-100 mb-4">
                  One prompt. One app. Describe what you need and AI builds it instantly.
                </p>
                <button className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-white text-brand-700 hover:bg-brand-50 transition-all">
                  Build an App
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
