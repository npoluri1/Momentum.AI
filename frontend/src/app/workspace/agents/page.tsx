'use client';

import React, { useState } from 'react';
import {
  Bot, Search, SlidersHorizontal, Grid3x3, List, Circle, MoreHorizontal,
  Sparkles, Play, Clock, Star, Zap, ArrowRight, CheckCircle, XCircle,
  Activity, Cpu, Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = ['All', 'Sales', 'Support', 'Marketing', 'Engineering', 'Data'];

const agents = [
  { id: 1, name: 'Sales Closer Agent', model: 'GPT-4o', status: 'Active', tasks: 124, category: 'Sales', description: 'Handles inbound sales conversations and closes deals autonomously.', rating: 4.8, gradient: 'from-rose-500 to-pink-600' },
  { id: 2, name: 'Support Bot', model: 'Claude 3.5', status: 'Training', tasks: 45, category: 'Support', description: 'Resolves customer tickets with human-like empathy and accuracy.', rating: 4.6, gradient: 'from-violet-500 to-purple-600' },
  { id: 3, name: 'Lead Qualifier', model: 'Gemini 1.5', status: 'Paused', tasks: 89, category: 'Sales', description: 'Scores and qualifies inbound leads before routing to sales.', rating: 4.7, gradient: 'from-sky-500 to-cyan-500' },
  { id: 4, name: 'Code Reviewer', model: 'GPT-4o', status: 'Active', tasks: 256, category: 'Engineering', description: 'Reviews pull requests and suggests optimizations.', rating: 4.9, gradient: 'from-emerald-500 to-teal-500' },
  { id: 5, name: 'Content Writer', model: 'Claude 3.5', status: 'Active', tasks: 178, category: 'Marketing', description: 'Generates blog posts, social content, and email campaigns.', rating: 4.5, gradient: 'from-amber-500 to-orange-600' },
  { id: 6, name: 'Data Analyst', model: 'Gemini 1.5', status: 'Active', tasks: 312, category: 'Data', description: 'Analyzes datasets and generates visual reports.', rating: 4.3, gradient: 'from-blue-500 to-indigo-600' },
  { id: 7, name: 'Email Assistant', model: 'GPT-4o', status: 'Training', tasks: 67, category: 'Marketing', description: 'Drafts, schedules, and optimizes email campaigns.', rating: 4.4, gradient: 'from-rose-500 to-pink-600' },
  { id: 8, name: 'QA Tester', model: 'Claude 3.5', status: 'Paused', tasks: 93, category: 'Engineering', description: 'Automates test generation and runs regression suites.', rating: 4.2, gradient: 'from-emerald-500 to-teal-500' },
];

const statusConfig: Record<string, { icon: any; class: string }> = {
  Active: { icon: CheckCircle, class: 'text-memory-500 bg-memory-500/10 border-memory-500/20' },
  Training: { icon: Clock, class: 'text-execution-500 bg-execution-500/10 border-execution-500/20' },
  Paused: { icon: XCircle, class: 'text-surface-400 bg-surface-100 dark:bg-white/[0.06] border-surface-200 dark:border-white/[0.06]' },
};

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAgents = agents.filter(a => {
    const matchCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">AI Agent Teams</h1>
            <p className="text-sm text-surface-500 mt-1">{agents.length} agents <span className="text-surface-300 dark:text-surface-600">·</span> <span className="text-memory-500 font-medium">{agents.filter(a => a.status === 'Active').length} active</span></p>
          </div>
          <div className="flex items-center gap-2">
            <button className="apple-button-secondary">
              <Sparkles className="w-4 h-4" /> Create Agent
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

        {/* Search & filter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search agents..."
              className="apple-input pl-10"
            />
          </div>
          <button className="p-2.5 rounded-xl apple-button-secondary border-0">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide">
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

        {/* Agent grid/list */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAgents.map((agent, i) => {
              const StatusIcon = statusConfig[agent.status].icon;
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={cn(
                    'apple-card p-5 cursor-pointer',
                    selectedAgent.id === agent.id ? 'ring-2 ring-brand-500/30' : ''
                  )}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn('w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-sm', agent.gradient)}>
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className={cn('flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border', statusConfig[agent.status].class)}>
                      <StatusIcon className="w-3 h-3" />
                      {agent.status}
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">{agent.name}</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mb-4 line-clamp-2 leading-relaxed">{agent.description}</p>
                  <div className="flex items-center justify-between pt-3.5 border-t border-surface-100/50 dark:border-white/[0.06]">
                    <span className="text-xs font-medium text-surface-400 bg-surface-50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">{agent.model}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-surface-400 bg-surface-50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">{agent.tasks} tasks</span>
                      {selectedAgent.id === agent.id && (
                        <span className="text-brand-500"><ArrowRight className="w-4 h-4" /></span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAgents.map(agent => {
              const StatusIcon = statusConfig[agent.status].icon;
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={cn(
                    'apple-card flex items-center gap-4 p-4 cursor-pointer',
                    selectedAgent.id === agent.id ? 'ring-2 ring-brand-500/30' : ''
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br shrink-0 flex items-center justify-center shadow-sm', agent.gradient)}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-surface-900 dark:text-white">{agent.name}</div>
                    <div className="text-sm text-surface-500 truncate mt-0.5">{agent.description}</div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-xs text-surface-400 bg-surface-50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">{agent.model}</span>
                    <span className="text-xs text-surface-400 bg-surface-50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">{agent.tasks} tasks</span>
                    <div className={cn('flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border', statusConfig[agent.status].class)}>
                      <StatusIcon className="w-3 h-3" />
                      {agent.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-surface-400" />
            </div>
            <p className="text-surface-500 dark:text-surface-400">No agents found matching your filters</p>
          </div>
        )}
      </div>

      {/* Detail panel - Apple style */}
      <aside className="hidden lg:block w-[400px] border-l border-surface-200/50 dark:border-white/[0.06] p-6 md:p-8 overflow-y-auto bg-white/50 dark:bg-[#0a0a0f]/50 backdrop-blur-xl">
        <div className="animate-fade-in">
          <div className="flex items-center gap-4 mb-8">
            <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg', selectedAgent.gradient)}>
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white">{selectedAgent.name}</h2>
              <p className="text-sm text-surface-500 mt-0.5">{selectedAgent.model} · {selectedAgent.category}</p>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="apple-card divide-y divide-surface-100/50 dark:divide-white/[0.04]">
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-surface-500">Status</span>
                <div className={cn('flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border', statusConfig[selectedAgent.status].class)}>
                  {React.createElement(statusConfig[selectedAgent.status].icon, { className: 'w-3.5 h-3.5' })}
                  {selectedAgent.status}
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-surface-500">Tasks Completed</span>
                <span className="text-xl font-bold text-surface-900 dark:text-white">{selectedAgent.tasks.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-surface-500">Rating</span>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-warning-400 fill-warning-400" />
                  <span className="font-bold text-surface-900 dark:text-white">{selectedAgent.rating}</span>
                  <span className="text-xs text-surface-400">/5</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-sm text-surface-500">Model</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-intelligence-500" /> {selectedAgent.model}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button className="apple-button-primary w-full">
              <Play className="w-4 h-4" /> {selectedAgent.status === 'Paused' ? 'Resume Agent' : 'Train Agent'}
            </button>
            <button className="apple-button-secondary w-full">
              <Activity className="w-4 h-4" /> View Logs
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl text-surface-400 hover:text-danger-500 hover:bg-danger-500/5 transition-all">
              <MoreHorizontal className="w-4 h-4" /> More Options
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
