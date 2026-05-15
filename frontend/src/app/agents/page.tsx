'use client';

import { useState } from 'react';
import {
  Bot, Brain, Cpu, MessageSquare, Plus, Search, Sparkles,
  Zap, Settings, Play, Pause, Clock, User, Code,
  Globe, Database, Shield, Workflow, Users, Star,
  ChevronRight, BarChart3, Copy, ExternalLink,
} from 'lucide-react';

const agentCategories = [
  'Featured', 'Sales', 'Marketing', 'Support', 'Productivity',
  'Research', 'Engineering', 'Design', 'Finance', 'HR',
];

const agents = [
  { name: 'Lead Enricher', desc: 'Research and enrich B2B leads with company data', category: 'Sales', model: 'GPT-4o', status: 'active', conversations: 1247, color: 'from-violet-500 to-purple-600' },
  { name: 'SDR Agent', desc: 'Automate outbound sales development sequences', category: 'Sales', model: 'Claude 3.5', status: 'active', conversations: 843, color: 'from-blue-500 to-cyan-600' },
  { name: 'Content Writer', desc: 'Generate SEO-optimized blog posts and articles', category: 'Marketing', model: 'GPT-4o', status: 'active', conversations: 2156, color: 'from-emerald-500 to-teal-600' },
  { name: 'Customer Support AI', desc: 'Handle support tickets and automate responses', category: 'Support', model: 'Gemini Pro', status: 'active', conversations: 3421, color: 'from-amber-500 to-orange-600' },
  { name: 'Code Reviewer', desc: 'Review pull requests and suggest improvements', category: 'Engineering', model: 'Claude 3.5', status: 'active', conversations: 567, color: 'from-rose-500 to-pink-600' },
  { name: 'Data Analyst', desc: 'Analyze datasets and generate visualizations', category: 'Research', model: 'GPT-4o', status: 'inactive', conversations: 234, color: 'from-indigo-500 to-violet-600' },
  { name: 'Social Media Manager', desc: 'Schedule and optimize social media content', category: 'Marketing', model: 'GPT-4o', status: 'active', conversations: 1892, color: 'from-sky-500 to-blue-600' },
  { name: 'Financial Analyst', desc: 'Track expenses and generate financial reports', category: 'Finance', model: 'Claude 3.5', status: 'active', conversations: 456, color: 'from-green-500 to-emerald-600' },
];

export default function AgentsPage() {
  const [activeCategory, setActiveCategory] = useState('Featured');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = agents.filter(a => {
    const matchesCategory = activeCategory === 'Featured' || a.category === activeCategory;
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">AI Agents</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
              Deploy intelligent agents that automate workflows, answer questions, and execute tasks autonomously.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 w-56"
              />
            </div>
            <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/30 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Agent
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {agentCategories.map((cat) => (
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
          {filtered.map((agent) => (
            <div key={agent.name} className="group p-5 rounded-xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40 hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-sm`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  agent.status === 'active'
                    ? 'bg-success-50 dark:bg-success-950/30 text-success-700 dark:text-success-400'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400'
                }`}>
                  {agent.status === 'active' ? 'Active' : 'Inactive'}
                </div>
              </div>
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1">{agent.name}</h3>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-3 line-clamp-2">{agent.desc}</p>
              <div className="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400 mb-3">
                <span className="flex items-center gap-1"><Cpu className="w-3 h-3" />{agent.model}</span>
                <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600" />
                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{agent.conversations}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-1.5">
                  <Play className="w-3 h-3" /> Chat
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 opacity-0 group-hover:opacity-100 transition-all">
                  <Settings className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
              <Bot className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">No agents found</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">Create your first AI agent to get started.</p>
            <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-all flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" /> Create Agent
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
