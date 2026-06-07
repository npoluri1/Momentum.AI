'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import SiteNav from '@/components/layout/SiteNav';
import {
  ArrowRight, Bot, CheckCircle, Globe,
  MessageSquare, Workflow, Zap,
  Sparkles, Play, Share2, FolderKanban,
  GitBranch, BarChart3, Terminal, Palette,
  AppWindow, Copy, Trello, ShoppingCart,
} from 'lucide-react';

type TabId = 'apps' | 'agents' | 'workflows';

const heroApps = [
  { team: 'SALES', name: 'Pipeline that scores every lead', projects: 4, agents: 2, flows: 3, color: 'from-memory-500 to-execution-500' },
  { team: 'SALES', name: 'Neon CRM with deal tracking', projects: 2, agents: 1, flows: 2, color: 'from-intelligence-500 to-brand-500' },
  { team: 'RESEARCH', name: 'AI insight matrix, live drill-down', projects: 16, agents: 10, flows: 7, color: 'from-execution-500 to-memory-500' },
  { team: 'RESEARCH', name: 'Eligibility analytics dashboard', projects: 3, agents: 1, flows: 1, color: 'from-brand-500 to-intelligence-500' },
  { team: 'OPS', name: 'Finance tracker, profit at a glance', projects: 3, agents: 1, flows: 2, color: 'from-memory-500 to-warning-400' },
  { team: 'OPS', name: 'Invoice generator that auto-sends', projects: 3, agents: 1, flows: 4, color: 'from-execution-500 to-brand-500' },
  { team: 'SUPPORT', name: 'Customer health with churn risk', projects: 4, agents: 1, flows: 2, color: 'from-intelligence-500 to-memory-500' },
  { team: 'SUPPORT', name: 'SLA workflow with escalations', projects: 3, agents: 1, flows: 1, color: 'from-brand-500 to-execution-500' },
];

const workplaceCategories = ['Sales', 'Operations', 'Marketing', 'AI Tools', 'Productivity'];
const galleryCategories = ['Featured', 'Quick Apps', 'Tools', 'Websites', 'Dashboards', 'Forms', 'Workflows', 'Commerce', 'Entertainment'];

const allApps = [...heroApps, ...heroApps.map(a => ({ ...a, name: a.name + ' v2' }))];

const tabContent: Record<TabId, { title: string; subtitle: string; pills: string[]; buildLabel: string }> = {
  apps: {
    title: 'One prompt. One live app.',
    subtitle: 'Build a connected app: internal tool, portal, dashboard...',
    pills: ['Internal tool', 'Client portal', 'CRM', 'Dashboard', 'Tracker'],
    buildLabel: 'Build an app',
  },
  agents: {
    title: 'One prompt. One workspace.',
    subtitle: 'Memory. Intelligence. Execution. Three connected layers in a loop.',
    pills: ['Sales', 'Research', 'Ops', 'Support', 'Custom'],
    buildLabel: 'Build an AI agent',
  },
  workflows: {
    title: 'One prompt. One workspace.',
    subtitle: 'Memory. Intelligence. Execution. Three connected layers in a loop.',
    pills: ['Slack → DB', 'Sheets → Email', 'Webhook → AI', 'Form → CRM', 'Custom'],
    buildLabel: 'Build an automation',
  },
};

function AppCard({ app, href }: { app: typeof heroApps[0]; href?: string }) {
  const card = (
    <div className="group relative rounded-xl border border-surface-200/60 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/60 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all duration-300 overflow-hidden">
      <div className={`aspect-video bg-gradient-to-br ${app.color} relative overflow-hidden opacity-80`}>
        <div className="absolute inset-0 bg-grid-white/[0.06] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-white/20 select-none">{app.team}</div>
        </div>
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-black/60 text-white/90 backdrop-blur-sm">
            {app.team}@momentum.ai
          </span>
        </div>            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-500 text-white shadow-lg shadow-brand-500/30 flex items-center gap-1.5">
                <Copy className="w-3 h-3" />
                Clone
              </span>
            </div>
          </div>
          <div className="p-3">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-2 leading-snug line-clamp-1">{app.name}</h3>
            <div className="flex items-center gap-3 text-xs text-surface-500 dark:text-surface-400">
              {app.projects > 0 && <span className="flex items-center gap-1"><FolderKanban className="w-3 h-3" />{app.projects} projects</span>}
              {app.agents > 0 && <span className="flex items-center gap-1"><Bot className="w-3 h-3" />{app.agents} {app.agents === 1 ? 'agent' : 'agents'}</span>}
              {app.flows > 0 && <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />{app.flows} {app.flows === 1 ? 'flow' : 'flows'}</span>}
            </div>
          </div>
        </div>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }
  return card;
}

function FeaturePill({ children, href }: { children: React.ReactNode; href?: string }) {
  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-100 dark:bg-white/[0.06] border border-surface-200 dark:border-white/[0.08] text-xs font-medium text-surface-600 dark:text-surface-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-200/50 dark:hover:border-brand-500/30 transition-all"
      >
        {children}
      </Link>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-100 dark:bg-white/[0.06] border border-surface-200 dark:border-white/[0.08] text-xs font-medium text-surface-600 dark:text-surface-400">
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState('Sales');
  const [activeTab, setActiveTab] = useState<TabId>('apps');

  const tab = tabContent[activeTab];

  const filteredApps = activeCategory === 'Sales' ? allApps.filter(a => a.team === 'SALES')
    : activeCategory === 'Operations' ? allApps.filter(a => a.team === 'OPS')
    : activeCategory === 'Marketing' ? allApps.filter(a => a.team === 'MARKETING' || a.team === 'SALES')
    : activeCategory === 'AI Tools' ? allApps.filter(a => a.team === 'RESEARCH' || a.team === 'AI')
    : activeCategory === 'Productivity' ? allApps.filter(a => a.team === 'OPS' || a.team === 'SUPPORT') : allApps;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />

      <main className="pt-14">
        {/* Cloneable Gallery — Above the Fold */}
        <section className="py-10 md:py-14 bg-surface-50/50 dark:bg-white/[0.02] border-b border-surface-200/50 dark:border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-1">
                  Clone a workspace. Ship in 30 seconds.
                </h2>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Live, cloneable workspaces from the community. Pick one and make it yours.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {workplaceCategories.slice(0, 5).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      activeCategory === cat
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'bg-white dark:bg-white/[0.04] text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-white/[0.08] hover:bg-surface-50 dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <Link href="/gallery" className="text-xs font-semibold text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredApps.slice(0, 6).map((app, i) => (
                <AppCard key={i} app={app} href="/create" />
              ))}
            </div>
          </div>
        </section>

        {/* Hero Section with Tabs */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white dark:from-brand-950/10 dark:to-[#0a0a0f] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-brand-500/10 to-intelligence-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-execution-500/10 to-memory-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
                <Sparkles className="w-4 h-4" />
                Turn one prompt into apps, AI agents, and automated workflows — all in one workspace
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-[1.1]">
                <span className="text-surface-900 dark:text-white">Build apps. Deploy agents.</span>
                <br />
                <span className="momentum-text">Automate everything.</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                Turn one prompt into apps, AI agents, and automated workflows — all in one workspace.
              </p>

              {/* Tabs */}
              <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-surface-100 dark:bg-white/[0.06] border border-surface-200 dark:border-white/[0.08] mb-8">
                {(['apps', 'agents', 'workflows'] as const).map((tabId) => {
                  const icons = { apps: AppWindow, agents: Bot, workflows: GitBranch };
                  const labels = { apps: 'Apps', agents: 'Agents', workflows: 'Workflows' };
                  const TabIcon = icons[tabId];
                  return (
                    <button
                      key={tabId}
                      onClick={() => setActiveTab(tabId)}
                      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                        activeTab === tabId
                          ? 'bg-white dark:bg-surface-700 text-brand-500 shadow-sm'
                          : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
                      }`}
                    >
                      <TabIcon className="w-4 h-4" />
                      {labels[tabId]}
                    </button>
                  );
                })}
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-3">
                {tab.title}
              </h2>
              <p className="text-surface-500 dark:text-surface-400 mb-6">
                {tab.subtitle}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                {tab.pills.map((pill, i) => {
                  if (activeTab === 'apps') {
                    const appsLinks: Record<string, string> = {
                      'Internal tool': '/workspace/dashboard',
                      'Client portal': '/client-portal',
                      'CRM': '/workspace/crm',
                      'Dashboard': '/workspace/dashboard',
                      'Tracker': '/workspace/projects',
                    };
                    return <FeaturePill key={pill} href={appsLinks[pill]}>{pill}</FeaturePill>;
                  }
                  if (activeTab === 'agents') {
                    const agentsLinks: Record<string, string> = {
                      'Sales': '/workspace/agents',
                      'Research': '/workspace/agents',
                      'Ops': '/workspace/agents',
                      'Support': '/workspace/agents',
                      'Custom': '/workspace/agents',
                    };
                    return <FeaturePill key={pill} href={agentsLinks[pill]}>{pill}</FeaturePill>;
                  }
                  if (activeTab === 'workflows') {
                    const workflowsLinks: Record<string, string> = {
                      'Slack → DB': '/workspace/automations',
                      'Sheets → Email': '/workspace/automations',
                      'Webhook → AI': '/workspace/automations',
                      'Form → CRM': '/workspace/automations',
                      'Custom': '/workspace/automations',
                    };
                    return <FeaturePill key={pill} href={workflowsLinks[pill]}>{pill}</FeaturePill>;
                  }
                  return <FeaturePill key={pill}>{pill}</FeaturePill>;
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-xl shadow-brand-500/30 transition-all active:scale-[0.98] flex items-center gap-2">
                  Build it <Zap className="w-4 h-4" />
                </Link>
                <Link href="/features" className="px-6 py-3 text-base font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all flex items-center gap-2">
                  <Play className="w-4 h-4" /> Explore features
                </Link>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-50 dark:bg-white/[0.04] text-sm text-surface-500 dark:text-surface-400">
                <span className="text-warning-500">★</span>
                <span className="font-medium">4.9</span>
                <span className="text-surface-400">·</span>
                <span>100K+ live apps</span>
                <span className="text-surface-400">·</span>
                <span>500K+ agents deployed</span>
                <span className="text-surface-400">·</span>
                <span>Backed by Y Combinator</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {heroApps.slice(0, 4).map((app, i) => (
                <AppCard key={i} app={app} href="/create" />
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/gallery" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors">
                Browse every workspace <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* See it building. Live. */}
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/30 to-white dark:from-brand-950/5 dark:to-[#0a0a0f] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                See it building. Live.
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                Momentum AI EVE narrates while she builds your workspace — projects, agents, flows, media, and connections — then ships it as a live app.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="rounded-2xl border border-surface-200 dark:border-white/[0.08] bg-[#0a0a0f] p-1 shadow-2xl shadow-black/20">
                <div className="rounded-xl bg-[#0d0d14] border border-white/[0.06] overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#0a0a0f]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-xs text-white/40 font-mono">eve — bash — 80×24</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] rounded-md bg-white/[0.06] text-white/50 font-mono">▲</span>
                      <span className="px-2 py-0.5 text-[10px] rounded-md bg-white/[0.06] text-white/50 font-mono">■</span>
                      <span className="px-2 py-0.5 text-[10px] rounded-md bg-white/[0.06] text-white/50 font-mono">●</span>
                    </div>
                  </div>
                  <div className="p-6 md:p-10 font-mono text-sm leading-relaxed">
                    <div className="flex items-center gap-2 text-brand-400 mb-3">
                      <Terminal className="w-4 h-4" />
                      <span className="text-white/60">$</span>
                      <span className="text-green-400">eve</span>
                      <span className="text-white/80">build</span>
                      <span className="text-blue-400">"customer portal with AI agents"</span>
                    </div>
                    <div className="space-y-1 text-white/50">
                      <div className="flex items-center gap-2">
                        <span className="text-white/30">⟡</span>
                        <span>Analyzing requirements...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/30">⟡</span>
                        <span>Generating workspace schema...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/30">⟡</span>
                        <span>Wiring memory layer...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/30">⟡</span>
                        <span>Deploying agent team (3 agents)...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/30">⟡</span>
                        <span>Connecting automations...</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-400 mt-2">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Workspace ready in 12.4s</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-white/30">$</span>
                        <span className="w-2 h-4 bg-brand-400 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Prompt it. Run it. Share it. */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-2">
                Prompt it. Run it. Share it.
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                From ideas to action. Launch instantly. No code, no setup.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto mb-16">
              {[
                { icon: MessageSquare, label: 'Prompt It', href: '/create' },
                { icon: Palette, label: 'Design It', href: '/create' },
                { icon: Workflow, label: 'Automate It', href: '/workspace/automations' },
                { icon: Bot, label: 'Add Agents', href: '/workspace/agents' },
                { icon: Share2, label: 'Share It', href: '/features' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.label} href={item.href} className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 dark:from-brand-400/10 dark:to-intelligence-400/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-brand-500 dark:text-brand-400" />
                    </div>
                    <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mb-8">
              <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-xl shadow-brand-500/30 transition-all active:scale-[0.98] inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Try Instant Demo ✨
              </Link>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="overflow-x-auto rounded-2xl border border-surface-200 dark:border-white/[0.08]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-200 dark:border-white/[0.08] bg-surface-50 dark:bg-white/[0.03]">
                      <th className="text-left px-5 py-3.5 font-semibold text-surface-900 dark:text-white">Capability</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-brand-600 dark:text-brand-400">Momentum AI Genesis</th>
                      <th className="text-center px-5 py-3.5 font-medium text-surface-500 hidden md:table-cell">AI chat</th>
                      <th className="text-center px-5 py-3.5 font-medium text-surface-500 hidden md:table-cell">Code gen</th>
                      <th className="text-center px-5 py-3.5 font-medium text-surface-500 hidden md:table-cell">PM tools</th>
                      <th className="text-center px-5 py-3.5 font-medium text-surface-500 hidden md:table-cell">Automation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-200 dark:divide-white/[0.06]">
                    {[
                      { cap: 'Shared memory', genesis: true, chat: false, code: false, pm: false, auto: false },
                      { cap: 'Agent team', genesis: true, chat: false, code: false, pm: false, auto: false },
                      { cap: 'Real tools', genesis: true, chat: false, code: false, pm: false, auto: false },
                      { cap: '24/7 runtime', genesis: true, chat: false, code: false, pm: false, auto: true },
                      { cap: 'Live apps', genesis: true, chat: false, code: true, pm: false, auto: false },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-surface-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3.5 font-medium text-surface-700 dark:text-surface-300">{row.cap}</td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-1.5 text-memory-500">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">Yes</span>
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center hidden md:table-cell">
                          {row.chat ? <CheckCircle className="w-4 h-4 text-memory-500 mx-auto" /> : <span className="text-surface-300 dark:text-surface-600">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-center hidden md:table-cell">
                          {row.code ? <CheckCircle className="w-4 h-4 text-memory-500 mx-auto" /> : <span className="text-surface-300 dark:text-surface-600">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-center hidden md:table-cell">
                          {row.pm ? <CheckCircle className="w-4 h-4 text-memory-500 mx-auto" /> : <span className="text-surface-300 dark:text-surface-600">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-center hidden md:table-cell">
                          {row.auto ? <CheckCircle className="w-4 h-4 text-memory-500 mx-auto" /> : <span className="text-surface-300 dark:text-surface-600">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-3">
                Humans direct · agents execute · running 24/7
              </p>
            </div>
          </div>
        </section>

        {/* Your Workspace. Alive. */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-2">
                The Origin of Living Software
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Apps. Agents. Automations. All in one workspace. Your docs become a shared brain, your agents take the work, and your workflows run 24/7.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: AppWindow, title: 'One Prompt, One App', desc: 'Describe your idea. Ship a living app with memory, agents, and automations wired in.' },
                { icon: Globe, title: 'Portals & Sign-In', desc: 'Publish branded portals with built-in sign-in. Users land where the work is.' },
                { icon: BarChart3, title: 'Live Dashboards', desc: 'KPI trackers that update in real time. The numbers find you, not the other way around.' },
                { icon: Copy, title: 'Clone & Remix', desc: 'Every great app is a seed. Clone one from the gallery. Make it yours. Ship in minutes.' },
                { icon: Trello, title: 'CRMs, Trackers, Tools', desc: 'CRMs, trackers, calculators — whatever your business needs, built from a prompt.' },
                { icon: ShoppingCart, title: 'Stripe-Wired Payments', desc: 'Sell what you build. Stripe checkout wired into every Genesis app — no plumbing.' },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 dark:from-brand-400/10 dark:to-intelligence-400/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link href="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors">
                Show All Features <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Build Your First Living App
                </h2>
                <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
                  Describe what you need. Momentum AI builds the full app, AI agents, and automations — ready to use in minutes.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2">
                    Start Building <Zap className="w-4 h-4" />
                  </Link>
                  <Link href="/gallery" className="px-6 py-3 text-base font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                    Explore Apps <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-10 border-t border-surface-200 dark:border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-surface-500 dark:text-surface-400">
              <span className="font-semibold text-surface-700 dark:text-surface-300">100K+ live apps</span>
              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
              <span className="font-semibold text-surface-700 dark:text-surface-300">500K+ agents deployed</span>
              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
              <span>Built by teams at</span>
              {['Google', 'Nike', 'Adobe', 'Netflix', 'Airbnb', 'Sony', 'Costco', 'Disney', 'Indeed'].map((company) => (
                <span key={company} className="font-semibold text-surface-400 dark:text-surface-500">{company}</span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
