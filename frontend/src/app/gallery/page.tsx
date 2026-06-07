'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, Sparkles, Download, Star, Copy,
  Users, Bot, Globe, Zap, ArrowRight, Check,
  Briefcase, Palette, BarChart3, ShoppingCart,
  MessageSquare, Heart, GraduationCap, LayoutDashboard,
  FolderKanban, GitBranch, FileText,
  Clock, Code, Film, Gamepad2,
} from 'lucide-react';
import SiteNav from '@/components/layout/SiteNav';
import { cn } from '@/lib/utils';

const categories = [
  'Featured', 'Quick Apps', 'Tools', 'Websites',
  'Dashboards', 'Forms', 'Workflows', 'Commerce', 'Entertainment',
];

const galleryApps = [
  { id: 'pet-product-portal', name: 'Pet Product Portal', author: 'Ely Danois', category: 'Quick Apps', agents: 1, automations: 2, projects: 3, gradient: 'from-violet-500 to-purple-600', icon: Briefcase },
  { id: 'vivastat-design', name: 'VivaStat Design Studio', author: 'Cary-Anne Olsen-Landis', category: 'Featured', agents: 0, automations: 0, projects: 0, gradient: 'from-emerald-500 to-teal-600', icon: Palette },
  { id: 'inflation-visualizer', name: 'Inflation Trends Visualizer', author: 'Raymond Pemba', category: 'Dashboards', agents: 0, automations: 0, projects: 0, gradient: 'from-amber-500 to-orange-600', icon: BarChart3 },
  { id: 'meeting-scheduler', name: 'Meeting Scheduler', author: 'Team Momentum', category: 'Tools', agents: 1, automations: 1, projects: 4, gradient: 'from-blue-500 to-cyan-600', icon: Clock },
  { id: 'portfolio-story', name: 'Portfolio Story', author: 'Karan G', category: 'Websites', agents: 0, automations: 0, projects: 1, gradient: 'from-rose-500 to-pink-600', icon: Briefcase },
  { id: 'dev-progress', name: 'Dev Progress Portal', author: 'Mina Demyan Fakious', category: 'Featured', agents: 1, automations: 0, projects: 0, gradient: 'from-sky-500 to-blue-600', icon: Code },
  { id: 'focused-task', name: 'Focused Task App', author: 'Team Momentum', category: 'Quick Apps', agents: 1, automations: 1, projects: 3, gradient: 'from-green-500 to-emerald-600', icon: LayoutDashboard },
  { id: 'recipe-list', name: 'Recipe Shopping List', author: 'Team Momentum', category: 'Tools', agents: 1, automations: 3, projects: 1, gradient: 'from-orange-500 to-red-600', icon: ShoppingCart },
  { id: 'noted-thanks', name: 'Noted with Thanks', author: 'xw2307', category: 'Quick Apps', agents: 1, automations: 1, projects: 13, gradient: 'from-indigo-500 to-violet-600', icon: MessageSquare },
  { id: 'fashion-scroll', name: 'Fashion Scroll Studio', author: 'Juliette Kang', category: 'Websites', agents: 0, automations: 0, projects: 0, gradient: 'from-pink-500 to-rose-600', icon: Palette },
  { id: 'jalaram-journey', name: "Jalaram Journey", author: 'Sanket Thakkar', category: 'Websites', agents: 0, automations: 0, projects: 0, gradient: 'from-amber-500 to-yellow-600', icon: Globe },
  { id: 'atgoodtimes-demo', name: 'AtGoodtimes (Demo)', author: 'Team Momentum', category: 'Featured', agents: 1, automations: 3, projects: 5, gradient: 'from-cyan-500 to-blue-600', icon: LayoutDashboard },
  { id: 'game-mechanics', name: 'Game Mechanics Studio', author: 'Abraham Antigua', category: 'Entertainment', agents: 0, automations: 0, projects: 0, gradient: 'from-purple-500 to-violet-600', icon: Gamepad2 },
  { id: 'cocinando-reagan', name: 'Cocinando con Reagan', author: 'Em Sawyers', category: 'Quick Apps', agents: 0, automations: 0, projects: 0, gradient: 'from-red-500 to-orange-600', icon: Heart },
  { id: 'landing-page-studio', name: 'Landing Page Studio', author: 'thapelo', category: 'Websites', agents: 1, automations: 3, projects: 3, gradient: 'from-blue-500 to-indigo-600', icon: Globe },
  { id: 'breathe-circle', name: 'Breathe Circle', author: 'Team Momentum', category: 'Featured', agents: 0, automations: 1, projects: 2, gradient: 'from-teal-500 to-green-600', icon: Heart },
  { id: 'idecide-mirrored', name: 'iDecide Mirrored', author: 'CSharp', category: 'Tools', agents: 0, automations: 0, projects: 0, gradient: 'from-violet-500 to-purple-600', icon: Code },
  { id: 'mood-tracker', name: 'Mood Tracker', author: 'Team Momentum', category: 'Dashboards', agents: 2, automations: 2, projects: 3, gradient: 'from-pink-500 to-rose-600', icon: Heart },
  { id: 'bay-area-dining', name: 'Bay Area Dining', author: 'Team Momentum', category: 'Quick Apps', agents: 1, automations: 6, projects: 12, gradient: 'from-orange-500 to-amber-600', icon: ShoppingCart },
  { id: 'invoice-generator', name: 'Invoice Generator', author: 'Team Momentum', category: 'Tools', agents: 1, automations: 4, projects: 3, gradient: 'from-green-500 to-emerald-600', icon: Download },
  { id: 'maintenance-tracker', name: 'Maintenance Tracker Dashboard', author: 'Team Momentum', category: 'Dashboards', agents: 1, automations: 2, projects: 3, gradient: 'from-sky-500 to-blue-600', icon: BarChart3 },
  { id: 'internal-docs', name: 'Internal Docs App', author: 'Team Momentum', category: 'Tools', agents: 1, automations: 3, projects: 12, gradient: 'from-indigo-500 to-violet-600', icon: FileText },
  { id: 'simple-store', name: 'Simple Store Manager', author: 'Team Momentum', category: 'Commerce', agents: 1, automations: 2, projects: 40, gradient: 'from-emerald-500 to-teal-600', icon: ShoppingCart },
  { id: 'application-tracker', name: 'Application Tracker Board', author: 'Team Momentum', category: 'Featured', agents: 1, automations: 7, projects: 3, gradient: 'from-rose-500 to-pink-600', icon: LayoutDashboard },
  { id: 'gradient-studio', name: 'Gradient Studio V4', author: 'xw2307', category: 'Featured', agents: 1, automations: 3, projects: 3, gradient: 'from-purple-500 to-violet-600', icon: Palette },
  { id: 'cinematic-journal', name: 'Cinematic Journal TMDB', author: 'xw2307', category: 'Entertainment', agents: 0, automations: 0, projects: 2, gradient: 'from-amber-500 to-orange-600', icon: Film },
  { id: 'finance-tracker', name: 'Finance Tracker Dashboard', author: 'Team Momentum', category: 'Dashboards', agents: 1, automations: 2, projects: 3, gradient: 'from-green-500 to-emerald-600', icon: BarChart3 },
  { id: 'note-auth', name: 'Note Auth App', author: 'Team Momentum', category: 'Tools', agents: 1, automations: 6, projects: 19, gradient: 'from-blue-500 to-cyan-600', icon: Code },
  { id: 'appointment-booking', name: 'Appointment Booking System', author: 'Team Momentum', category: 'Commerce', agents: 1, automations: 1, projects: 2, gradient: 'from-violet-500 to-purple-600', icon: Clock },
  { id: 'fitness-tracker', name: 'Fitness Tracker', author: 'Team Momentum', category: 'Featured', agents: 1, automations: 1, projects: 5, gradient: 'from-green-500 to-emerald-600', icon: Heart },
  { id: 'fortune-cookie', name: 'Fortune Cookie', author: 'xw2307', category: 'Entertainment', agents: 1, automations: 1, projects: 2, gradient: 'from-amber-500 to-yellow-600', icon: Star },
  { id: 'event-management', name: 'Event Management Portal', author: 'Team Momentum', category: 'Tools', agents: 2, automations: 2, projects: 3, gradient: 'from-pink-500 to-rose-600', icon: Globe },
  { id: 'license-manager', name: 'License Manager Dashboard', author: 'Team Momentum', category: 'Dashboards', agents: 1, automations: 2, projects: 3, gradient: 'from-indigo-500 to-violet-600', icon: LayoutDashboard },
  { id: 'consultancy-booking', name: 'Consultancy Booking Form', author: 'Team Momentum', category: 'Forms', agents: 1, automations: 2, projects: 4, gradient: 'from-cyan-500 to-blue-600', icon: MessageSquare },
  { id: 'team-capacity', name: 'Team Capacity Planner', author: 'Team Momentum', category: 'Tools', agents: 3, automations: 2, projects: 2, gradient: 'from-teal-500 to-green-600', icon: Users },
  { id: 'multi-platform', name: 'Multi-Platform Publisher', author: 'Team Momentum', category: 'Workflows', agents: 1, automations: 6, projects: 8, gradient: 'from-orange-500 to-amber-600', icon: GitBranch },
  { id: 'etch-sketch', name: 'Etch-a-Sketch', author: 'xw2307', category: 'Entertainment', agents: 0, automations: 0, projects: 0, gradient: 'from-red-500 to-pink-600', icon: Gamepad2 },
  { id: 'hiring-board', name: 'Hiring Board', author: 'Team Momentum', category: 'Featured', agents: 1, automations: 3, projects: 4, gradient: 'from-blue-500 to-indigo-600', icon: Users },
  { id: 'cover-letter', name: 'Cover Letter Generator', author: 'Team Momentum', category: 'Tools', agents: 3, automations: 1, projects: 7, gradient: 'from-violet-500 to-purple-600', icon: FileText },
  { id: 'focus-task', name: 'FOCUS Task App', author: 'xw2307', category: 'Quick Apps', agents: 1, automations: 1, projects: 3, gradient: 'from-green-500 to-emerald-600', icon: LayoutDashboard },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('Featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [cloned, setCloned] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const filtered = galleryApps.filter((t) => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = t.name.toLowerCase().includes(q) || t.author.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const displayApps = showAll ? filtered : filtered.slice(0, 24);

  const toggleClone = (id: string) => {
    setCloned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white dark:from-brand-950/10 dark:to-[#0a0a0f] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-brand-500/10 to-intelligence-500/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative">
        <section className="pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
                <Sparkles className="w-4 h-4" />
                Browse Creators
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                <span className="text-surface-900 dark:text-white">Community Gallery</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                Explore AI App Kits — complete AI workspaces you can clone and build on.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-surface-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-8 overflow-x-auto scrollbar-hide pb-1 justify-center flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setShowAll(false); }}
                  className={cn(
                    'shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all',
                    activeCategory === cat
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                      : 'bg-white dark:bg-white/[0.04] text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-white/[0.08] hover:bg-surface-50 dark:hover:bg-white/[0.06]'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayApps.map((app) => {
                const Icon = app.icon;
                const isCloned = cloned.has(app.id);
                return (
                  <Link
                    key={app.id}
                    href="/create"
                    className="group rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden transition-all hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-0.5 block"
                  >
                    {/* Card Header Image */}
                    <div className={`h-32 bg-gradient-to-br ${app.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-10 h-10 text-white/30" />
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-black/50 text-white/90 backdrop-blur-sm">
                          {app.author}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={cn(
                          'px-2 py-0.5 text-[10px] font-semibold rounded-md backdrop-blur-sm',
                          app.author === 'Team Momentum'
                            ? 'bg-brand-500/80 text-white'
                            : 'bg-black/50 text-white/90'
                        )}>
                          {app.author === 'Team Momentum' ? 'Clone App' : 'View App'}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-surface-900 dark:text-white leading-snug">{app.name}</h3>
                      </div>
                      <p className="text-xs text-surface-500 dark:text-surface-400 mb-3">{app.author}</p>

                      {/* Stats */}
                      <div className="flex items-center gap-3 text-xs text-surface-500 dark:text-surface-400 mb-3">
                        {app.agents > 0 && <span className="flex items-center gap-1"><Bot className="w-3 h-3" />x{app.agents}</span>}
                        {app.automations > 0 && <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />x{app.automations}</span>}
                        {app.projects > 0 && <span className="flex items-center gap-1"><FolderKanban className="w-3 h-3" />x{app.projects}</span>}
                      </div>

                      {/* Clone Button */}
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleClone(app.id);
                        }}
                        className={cn(
                          'w-full px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                          isCloned
                            ? 'bg-success-500/10 text-success-600 dark:text-success-400 border border-success-500/30'
                            : 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/25 active:scale-[0.98]'
                        )}
                      >
                        {isCloned ? (
                          <><Check className="w-3.5 h-3.5" /> Cloned ✓</>
                        ) : (
                          <><Copy className="w-3.5 h-3.5" /> Clone</>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center">
                  <Search className="w-8 h-8 text-surface-400" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">No apps found</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">Try a different category or search term.</p>
              </div>
            )}

            {!showAll && filtered.length > 24 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-3 text-sm font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all inline-flex items-center gap-2"
                >
                  Load more ({filtered.length - 24} remaining) <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
