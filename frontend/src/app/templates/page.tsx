'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/layout/SiteNav';
import Footer from '@/components/layout/Footer';
import {
  Star, Zap, ArrowRight, Sparkles, Copy, FolderKanban,
  Bot, GitBranch,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = ['All', 'Featured', 'Sales', 'Operations', 'Marketing', 'Productivity', 'AI Tools', 'Commerce', 'Dashboards'];

const templates = [
  { id: 1, name: 'Sales Pipeline CRM', category: 'Sales', projects: 4, agents: 2, flows: 3, clones: 1247, rating: 4.9, color: 'from-brand-500 to-intelligence-500' },
  { id: 2, name: 'Customer Health Dashboard', category: 'Operations', projects: 3, agents: 1, flows: 2, clones: 892, rating: 4.8, color: 'from-intelligence-500 to-memory-500' },
  { id: 3, name: 'AI Research Matrix', category: 'AI Tools', projects: 16, agents: 10, flows: 7, clones: 2341, rating: 4.9, color: 'from-execution-500 to-brand-500' },
  { id: 4, name: 'Finance Tracker', category: 'Operations', projects: 3, agents: 1, flows: 2, clones: 1567, rating: 4.7, color: 'from-memory-500 to-warning-400' },
  { id: 5, name: 'Invoice Generator', category: 'Operations', projects: 3, agents: 1, flows: 4, clones: 983, rating: 4.8, color: 'from-execution-500 to-brand-500' },
  { id: 6, name: 'Support SLA Workflow', category: 'Productivity', projects: 3, agents: 1, flows: 1, clones: 756, rating: 4.7, color: 'from-brand-500 to-execution-500' },
  { id: 7, name: 'E-commerce Store', category: 'Commerce', projects: 5, agents: 2, flows: 4, clones: 1845, rating: 4.9, color: 'from-warning-400 to-execution-500' },
  { id: 8, name: 'Marketing Campaign Tracker', category: 'Marketing', projects: 4, agents: 2, flows: 3, clones: 1123, rating: 4.8, color: 'from-intelligence-500 to-brand-500' },
  { id: 9, name: 'Team Wiki', category: 'Productivity', projects: 2, agents: 0, flows: 1, clones: 654, rating: 4.6, color: 'from-memory-500 to-intelligence-500' },
  { id: 10, name: 'Hiring Pipeline', category: 'Operations', projects: 4, agents: 1, flows: 2, clones: 876, rating: 4.7, color: 'from-brand-500 to-memory-500' },
  { id: 11, name: 'Event Planner', category: 'Productivity', projects: 3, agents: 1, flows: 2, clones: 543, rating: 4.6, color: 'from-execution-500 to-intelligence-500' },
  { id: 12, name: 'Bug Tracker', category: 'Productivity', projects: 3, agents: 1, flows: 2, clones: 1234, rating: 4.8, color: 'from-brand-500 to-execution-500' },
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = templates.filter((t) => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />

      <main className="pt-14">
        {/* Hero */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white dark:from-brand-950/10 dark:to-[#0a0a0f] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
                <Sparkles className="w-4 h-4" />
                Clone, remix, and ship in minutes
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                <span className="text-surface-900 dark:text-white">Templates</span>
              </h1>
              <p className="text-lg text-surface-500 dark:text-surface-400 mb-8">
                Browse 150K+ cloneable workspaces built by the community. Pick one, make it yours, ship instantly.
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  id="template-search"
                  name="template-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#0a0a0f]/60 border border-surface-200 dark:border-white/[0.08] text-sm text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                      activeCategory === cat
                        ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                        : 'bg-white dark:bg-white/[0.04] text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-white/[0.08] hover:bg-surface-50 dark:hover:bg-white/[0.06]'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Templates Grid */}
        <section className="pb-16 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((app) => (
                <Link href="/create" key={app.id} className="group">
                  <div className="relative rounded-xl border border-surface-200/60 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/60 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all duration-300 overflow-hidden">
                    <div className={`aspect-video bg-gradient-to-br ${app.color} relative overflow-hidden opacity-80`}>
                      <div className="absolute inset-0 bg-grid-white/[0.06] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-black/60 text-white/90 backdrop-blur-sm">
                          {app.category}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-500 text-white shadow-lg shadow-brand-500/30 flex items-center gap-1.5">
                          <Copy className="w-3 h-3" />
                          Clone
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-2 leading-snug">{app.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-surface-500 dark:text-surface-400 mb-2">
                        {app.projects > 0 && <span className="flex items-center gap-1"><FolderKanban className="w-3 h-3" />{app.projects}</span>}
                        {app.agents > 0 && <span className="flex items-center gap-1"><Bot className="w-3 h-3" />{app.agents}</span>}
                        {app.flows > 0 && <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />{app.flows}</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-surface-400">
                          <Star className="w-3 h-3 text-warning-400 fill-warning-400" />
                          <span className="font-medium text-surface-600 dark:text-surface-300">{app.rating}</span>
                        </div>
                        <div className="text-xs text-surface-400">{app.clones.toLocaleString()} clones</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-surface-500 dark:text-surface-400">No templates found. Try a different search or category.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Build Your Own Template</h2>
                <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
                  Describe your idea. MOMENTUM AI EVE generates the full workspace. Share it with the community.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2">
                    Start Building <Zap className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
