'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Search, Calculator, Timer, CheckSquare, FileText,
  Clock, Calendar, Wallet, Users,
  BarChart3, BookOpen, Copy, Star,
  Zap, Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  { id: 'all', label: 'All Apps', icon: Layers },
  { id: 'productivity', label: 'Productivity', icon: CheckSquare },
  { id: 'calculators', label: 'Calculators', icon: Calculator },
  { id: 'trackers', label: 'Trackers', icon: BarChart3 },
  { id: 'utilities', label: 'Utilities', icon: Zap },
  { id: 'finance', label: 'Finance', icon: Wallet },
  { id: 'social', label: 'Social', icon: Users },
];

const quickApps = [
  { id: 'qa1', name: 'Task Timer', desc: 'Pomodoro timer with task tracking and productivity stats', category: 'productivity', icon: Timer, color: 'from-brand-500 to-rose-500', uses: 12470, rating: 4.8 },
  { id: 'qa2', name: 'Quick Notes', desc: 'Simple note-taking with markdown, tags, and search', category: 'productivity', icon: FileText, color: 'from-memory-500 to-blue-500', uses: 8920, rating: 4.7 },
  { id: 'qa3', name: 'Checklist Pro', desc: 'Smart checklists with recurring items and progress tracking', category: 'productivity', icon: CheckSquare, color: 'from-success-500 to-emerald-500', uses: 15320, rating: 4.9 },
  { id: 'qa4', name: 'Tip Calculator', desc: 'Split bills, calculate tips, and track shared expenses', category: 'calculators', icon: Calculator, color: 'from-intelligence-500 to-violet-500', uses: 5670, rating: 4.6 },
  { id: 'qa5', name: 'Currency Converter', desc: 'Real-time currency conversion with 170+ currencies', category: 'calculators', icon: Wallet, color: 'from-warning-500 to-orange-500', uses: 7890, rating: 4.5 },
  { id: 'qa6', name: 'Time Zone Converter', desc: 'Convert time zones and schedule across time zones', category: 'utilities', icon: Clock, color: 'from-execution-500 to-cyan-500', uses: 4560, rating: 4.7 },
  { id: 'qa7', name: 'Expense Tracker', desc: 'Track daily expenses with categories and monthly reports', category: 'finance', icon: Wallet, color: 'from-emerald-500 to-teal-500', uses: 12340, rating: 4.8 },
  { id: 'qa8', name: 'Budget Planner', desc: 'Monthly budget planning with goal tracking', category: 'finance', icon: BarChart3, color: 'from-teal-500 to-cyan-500', uses: 8910, rating: 4.6 },
  { id: 'qa9', name: 'Meeting Scheduler', desc: 'Schedule meetings with availability polling', category: 'utilities', icon: Calendar, color: 'from-purple-500 to-pink-500', uses: 6780, rating: 4.5 },
  { id: 'qa10', name: 'Habit Tracker', desc: 'Track daily habits with streaks and statistics', category: 'trackers', icon: CheckSquare, color: 'from-amber-500 to-orange-500', uses: 11230, rating: 4.9 },
  { id: 'qa11', name: 'Mood Journal', desc: 'Daily mood tracking with notes and trends', category: 'trackers', icon: BookOpen, color: 'from-pink-500 to-rose-500', uses: 3450, rating: 4.4 },
  { id: 'qa12', name: 'Countdown Timer', desc: 'Set countdown timers for events and deadlines', category: 'utilities', icon: Clock, color: 'from-indigo-500 to-violet-500', uses: 5670, rating: 4.3 },
];

export default function QuickAppsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = quickApps.filter(a => {
    const matchCategory = activeCategory === 'all' || a.category === activeCategory;
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-xs font-medium text-brand-500 bg-brand-500/10 px-2.5 py-0.5 rounded-full">{quickApps.length} Quick Apps</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white tracking-tight">Quick Apps</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Lightweight tools for everyday tasks — add to any workspace in one click</p>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col gap-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search quick apps..." className="apple-input pl-10" />
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

      {/* Apps Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16"><Layers className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-3" /><p className="text-sm text-surface-500">No apps found matching your search</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((app, i) => (
            <div key={app.id} className="apple-card p-5 hover:ring-2 hover:ring-brand-500/20 transition-all group cursor-pointer" style={{ animationDelay: `${i * 40}ms` }} onClick={() => toast.success(`Added ${app.name} to workspace!`)}>
              <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-3 group-hover:scale-110 transition-transform', app.color)}>
                <app.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-surface-900 dark:text-white">{app.name}</h3>
                <span className="flex items-center gap-0.5 text-xs text-warning-500"><Star className="w-3 h-3 fill-warning-500" />{app.rating}</span>
              </div>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-3 line-clamp-2">{app.desc}</p>
              <div className="flex items-center justify-between pt-3 border-t border-surface-100/50 dark:border-white/[0.06] text-[11px] text-surface-400">
                <span>{(app.uses / 1000).toFixed(1)}k uses</span>
                <button onClick={(e) => { e.stopPropagation(); toast.success(`Added ${app.name} to workspace!`); }} className="text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1"><Copy className="w-3 h-3" /> Add to Workspace</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
