'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Bot, Search, Copy, Star, Users, MessageSquare,
  Code, Palette, BarChart3, ShoppingCart, Globe,
  Zap, Check, ChevronRight, Clock, Sparkles,
  Database, X,
} from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  { id: 'all', label: 'All Agents', icon: Bot },
  { id: 'sales', label: 'Sales & CRM', icon: Users },
  { id: 'marketing', label: 'Marketing', icon: MessageSquare },
  { id: 'engineering', label: 'Engineering', icon: Code },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'ecommerce', label: 'E-Commerce', icon: ShoppingCart },
  { id: 'support', label: 'Support', icon: Globe },
];

const agentTemplates = [
  { id: 'a1', name: 'Lead Enricher', role: 'Enriches lead data with company info, social profiles, and intent signals', category: 'sales', model: 'GPT-4o', tools: ['web_search', 'api_caller'], runs: 12470, rating: 4.8, color: 'from-violet-500 to-purple-600' },
  { id: 'a2', name: 'SDR Agent', role: 'Automates outbound sales outreach with personalized email sequences', category: 'sales', model: 'Claude 3.5', tools: ['web_search', 'api_caller', 'file_reader'], runs: 8920, rating: 4.7, color: 'from-blue-500 to-cyan-600' },
  { id: 'a3', name: 'Content Writer', role: 'Writes blog posts, social media content, and email copy in brand voice', category: 'marketing', model: 'GPT-4o', tools: ['web_search', 'file_reader'], runs: 15320, rating: 4.9, color: 'from-amber-500 to-orange-600' },
  { id: 'a4', name: 'SEO Analyst', role: 'Analyzes content for SEO optimization, keyword gaps, and ranking opportunities', category: 'marketing', model: 'Claude 3.5', tools: ['web_search', 'data_analyzer'], runs: 5670, rating: 4.6, color: 'from-green-500 to-emerald-600' },
  { id: 'a5', name: 'Code Reviewer', role: 'Reviews pull requests for bugs, security issues, and code quality', category: 'engineering', model: 'GPT-4o', tools: ['code_interpreter', 'api_caller'], runs: 18730, rating: 4.9, color: 'from-indigo-500 to-violet-600' },
  { id: 'a6', name: 'Bug Hunter', role: 'Automatically finds, triages, and suggests fixes for software bugs', category: 'engineering', model: 'Claude 3.5', tools: ['code_interpreter', 'web_search'], runs: 12340, rating: 4.8, color: 'from-red-500 to-rose-600' },
  { id: 'a7', name: 'UI Designer', role: 'Generates UI mockups, design systems, and component libraries', category: 'design', model: 'Gemini Pro', tools: ['image_gen', 'file_reader'], runs: 4560, rating: 4.5, color: 'from-pink-500 to-rose-600' },
  { id: 'a8', name: 'Data Analyst', role: 'Analyzes datasets, creates visualizations, and generates insights', category: 'analytics', model: 'GPT-4o', tools: ['code_interpreter', 'data_analyzer', 'file_reader'], runs: 8910, rating: 4.7, color: 'from-teal-500 to-cyan-600' },
  { id: 'a9', name: 'Customer Support', role: 'Handles customer inquiries with RAG from knowledge base', category: 'support', model: 'Claude 3.5', tools: ['web_search', 'file_reader', 'api_caller'], runs: 15670, rating: 4.8, color: 'from-emerald-500 to-teal-600' },
  { id: 'a10', name: 'Social Media Manager', role: 'Creates and schedules social media content across platforms', category: 'marketing', model: 'GPT-4o', tools: ['web_search', 'image_gen'], runs: 7230, rating: 4.6, color: 'from-purple-500 to-pink-600' },
  { id: 'a11', name: 'QA Tester', role: 'Generates test cases, runs test suites, and reports failures', category: 'engineering', model: 'GPT-4o', tools: ['code_interpreter', 'api_caller'], runs: 6340, rating: 4.7, color: 'from-cyan-500 to-sky-600' },
  { id: 'a12', name: 'Email Campaigner', role: 'Designs and executes email marketing campaigns with A/B testing', category: 'marketing', model: 'Claude 3.5', tools: ['web_search', 'api_caller'], runs: 5120, rating: 4.5, color: 'from-orange-500 to-amber-600' },
];

export default function AgentMarketplacePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<typeof agentTemplates[0] | null>(null);

  const filtered = agentTemplates.filter(a => {
    const matchCategory = activeCategory === 'all' || a.category === activeCategory;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-xs font-medium text-intelligence-500 bg-intelligence-500/10 px-2.5 py-0.5 rounded-full">{agentTemplates.length} Agent Templates</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white tracking-tight">Agent Marketplace</h1>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Browse, clone, and customize pre-built AI agents for any role</p>
            </div>
            <button className="apple-button-primary"><Sparkles className="w-4 h-4" /> Create Custom Agent</button>
          </div>

          {/* Search & Categories */}
          <div className="flex flex-col gap-3">
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search agents by name or role..." className="apple-input pl-10" />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map(cat => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                    className={cn('flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all', isActive ? 'bg-brand-500 text-white shadow-sm' : 'bg-surface-100/80 dark:bg-white/[0.06] text-surface-600 dark:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.1] border border-surface-200/50 dark:border-transparent')}
                  ><Icon className="w-4 h-4" />{cat.label}</button>
                );
              })}
            </div>
          </div>

          {/* Agent Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16"><Bot className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-3" /><p className="text-sm text-surface-500">No agents found matching your search</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((agent, i) => (
                <div key={agent.id} onClick={() => setSelectedAgent(agent)} className="apple-card p-5 hover:ring-2 hover:ring-brand-500/20 transition-all cursor-pointer group" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-3 group-hover:scale-110 transition-transform', agent.color)}>
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-surface-900 dark:text-white">{agent.name}</h3>
                    <span className="flex items-center gap-0.5 text-xs text-warning-500"><Star className="w-3 h-3 fill-warning-500" />{agent.rating}</span>
                  </div>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mb-3 line-clamp-2">{agent.role}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-intelligence-500/10 text-intelligence-600 dark:text-intelligence-400 border border-intelligence-500/20">{agent.model}</span>
                    {agent.tools.slice(0, 2).map(t => (
                      <span key={t} className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-surface-100 dark:bg-white/[0.04] text-surface-400">{t}</span>
                    ))}
                    {agent.tools.length > 2 && <span className="text-[10px] text-surface-400">+{agent.tools.length - 2}</span>}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-surface-100/50 dark:border-white/[0.06] text-[11px] text-surface-400">
                    <span>{(agent.runs / 1000).toFixed(1)}k runs</span>
                    <button onClick={(e) => { e.stopPropagation(); toast.success(`Cloned ${agent.name}!`); }} className="text-brand-500 hover:text-brand-600 transition-colors font-medium flex items-center gap-1"><Copy className="w-3 h-3" /> Clone</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Agent Detail Panel */}
      {selectedAgent && (
        <aside className="w-96 border-l border-surface-200/50 dark:border-white/[0.06] overflow-y-auto bg-white dark:bg-[#0a0a0f]/50 p-5 animate-slide-left">
          <div className="flex items-center justify-between mb-4">
            <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center', selectedAgent.color)}>
              <Bot className="w-6 h-6 text-white" />
            </div>
            <button onClick={() => setSelectedAgent(null)} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all"><X className="w-4 h-4" /></button>
          </div>
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-1">{selectedAgent.name}</h2>
          <p className="text-sm text-surface-500 mb-3">{selectedAgent.role}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 text-xs font-semibold rounded-md bg-intelligence-500/10 text-intelligence-600 dark:text-intelligence-400">{selectedAgent.model}</span>
            <span className="flex items-center gap-1 text-xs text-surface-400"><Star className="w-3 h-3 text-warning-500 fill-warning-500" />{selectedAgent.rating} · {(selectedAgent.runs / 1000).toFixed(1)}k runs</span>
          </div>
          <div className="space-y-3 mb-5">
            <h4 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Tools</h4>
            <div className="flex flex-wrap gap-2">
              {selectedAgent.tools.map(t => (
                <div key={t} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
                  <Database className="w-3.5 h-3.5 text-surface-400" />
                  <span className="text-xs text-surface-600 dark:text-surface-400">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3 mb-5">
            <h4 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Stats</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Total Runs', value: (selectedAgent.runs / 1000).toFixed(1) + 'k' },
                { label: 'Rating', value: selectedAgent.rating + '/5' },
                { label: 'Tools', value: selectedAgent.tools.length.toString() },
                { label: 'Model', value: selectedAgent.model.split(' ')[0] },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
                  <p className="text-lg font-bold text-surface-900 dark:text-white">{s.value}</p>
                  <p className="text-[10px] text-surface-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => { toast.success(`Cloned ${selectedAgent.name}!`); setSelectedAgent(null); }} className="w-full apple-button-primary">
            <Copy className="w-4 h-4" /> Clone Agent
          </button>
        </aside>
      )}
    </div>
  );
}
