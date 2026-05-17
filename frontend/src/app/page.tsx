'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Bot, Brain, CheckCircle, ChevronRight, Cpu, Database, Globe,
  LayoutDashboard, MessageSquare, Shield, Users, Workflow, Zap, Menu, X,
  Moon, Sun, Star, Sparkles, Grid3X3, Play, Share2, FolderKanban,
  ExternalLink, GitFork, Clock, BarChart3, Layers, Terminal, Palette,
  Code, Figma, AppWindow, Blocks, PanelRight, Radio, Search,
  ChevronDown, Copy, Plus, Download, BookOpen, HelpCircle, MessageCircle,
  Settings, Home, Box, LineChart, Trello, GitBranch,
} from 'lucide-react';

const heroApps = [
  { team: 'SALES@taskade', name: 'Pipeline that scores every lead', screenshot: 'https://www.taskade.com/share/apps/dry36084slddvvrh/screenshot.png', projects: 4, agents: 2, flows: 3 },
  { team: 'SALES@taskade', name: 'Neon CRM with deal tracking', screenshot: 'https://www.taskade.com/share/apps/nsrm12wns3e1cgni/screenshot.png', projects: 2, agents: 1, flows: 2 },
  { team: 'RESEARCH@taskade', name: 'AI insight matrix, live drill-down', screenshot: 'https://www.taskade.com/share/apps/aauj1flqzp21lhxn/screenshot.png', projects: 16, agents: 10, flows: 7 },
  { team: 'RESEARCH@taskade', name: 'Eligibility analytics dashboard', screenshot: 'https://www.taskade.com/share/apps/4ejkdd6ecdhujryh/screenshot.png', projects: 3, agents: 1, flows: 1 },
  { team: 'OPS@taskade', name: 'Finance tracker, profit at a glance', screenshot: 'https://www.taskade.com/share/apps/tmnju1vsp3ggajo7/screenshot.png', projects: 3, agents: 1, flows: 2 },
  { team: 'OPS@taskade', name: 'Invoice generator that auto-sends', screenshot: 'https://www.taskade.com/share/apps/v71ywf2zs5bu9a5m/screenshot.png', projects: 3, agents: 1, flows: 4 },
  { team: 'SUPPORT@taskade', name: 'Customer health with churn risk', screenshot: 'https://www.taskade.com/share/apps/564685gvoq7j7oua/screenshot.png', projects: 4, agents: 1, flows: 2 },
  { team: 'SUPPORT@taskade', name: 'SLA workflow with escalations', screenshot: 'https://www.taskade.com/share/apps/s4pf46i9wi60h0rv/screenshot.png', projects: 3, agents: 1, flows: 1 },
];

const allApps = [
  ...heroApps,
  { team: 'SALES@taskade', name: 'Sales Pipeline Workflow', screenshot: 'https://www.taskade.com/share/apps/dry36084slddvvrh/screenshot.png', projects: 4, agents: 2, flows: 3 },
  { team: 'SALES@taskade', name: 'Neon CRM Dashboard', screenshot: 'https://www.taskade.com/share/apps/nsrm12wns3e1cgni/screenshot.png', projects: 2, agents: 1, flows: 2 },
  { team: 'SALES@taskade', name: 'Sales Pipeline Dashboard', screenshot: 'https://www.taskade.com/share/apps/j1n0746e1z0olf6r/screenshot.png', projects: 3, agents: 1, flows: 0 },
  { team: 'SALES@taskade', name: 'Broker Calendar', screenshot: 'https://www.taskade.com/share/apps/ncmibyh4dgh6q0py/screenshot.png', projects: 2, agents: 1, flows: 3 },
  { team: 'SALES@taskade', name: 'Shopify-Style Storefront', screenshot: 'https://www.taskade.com/share/apps/sqe69c1zmfbkrexu/screenshot.png', projects: 4, agents: 1, flows: 4 },
  { team: 'SALES@taskade', name: 'Simple Store Manager', screenshot: 'https://www.taskade.com/share/apps/ujtqojrsimcct6io/screenshot.png', projects: 34, agents: 1, flows: 2 },
  { team: 'SALES@taskade', name: 'Minimalist E-commerce Storefront', screenshot: 'https://www.taskade.com/share/apps/jiz9qqa3pono9ntq/screenshot.png', projects: 3, agents: 1, flows: 4 },
  { team: 'SALES@taskade', name: 'Client Connect Dashboard', screenshot: 'https://www.taskade.com/share/apps/avl35iqxc8t7wk3e/screenshot.png', projects: 3, agents: 1, flows: 4 },
  { team: 'SALES@taskade', name: 'Investor Dashboard', screenshot: 'https://www.taskade.com/share/apps/5q9h9ufuofnx1agv/screenshot.png', projects: 5, agents: 2, flows: 4 },
  { team: 'SALES@taskade', name: 'Invoice Generator', screenshot: 'https://www.taskade.com/share/apps/v71ywf2zs5bu9a5m/screenshot.png', projects: 3, agents: 1, flows: 4 },
  { team: 'SALES@taskade', name: 'Finance Tracker Dashboard', screenshot: 'https://www.taskade.com/share/apps/tmnju1vsp3ggajo7/screenshot.png', projects: 3, agents: 1, flows: 2 },
  { team: 'SALES@taskade', name: 'Invoice Tracker', screenshot: 'https://www.taskade.com/share/apps/rsltpd5cegha5ulc/screenshot.png', projects: 1, agents: 1, flows: 2 },
];

const categories = ['Sales', 'Operations', 'Marketing', 'AI Tools', 'Productivity'];

function AppCard({ app, compact = false }: { app: typeof allApps[0]; compact?: boolean }) {
  return (
    <div className="group relative rounded-xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40 hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-all duration-300 overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-700 relative overflow-hidden">
        <img
          src={app.screenshot}
          alt={app.name}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-white/90 dark:bg-surface-900/90 text-surface-600 dark:text-surface-300">
            {app.team}
          </span>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/30 flex items-center gap-1.5">
            <Copy className="w-3 h-3" />
            Clone
          </button>
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
}

function FeaturePill({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-xs font-medium text-surface-600 dark:text-surface-300">
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState('light');
  const [activeCategory, setActiveCategory] = useState('Sales');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setThemeState(stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
  };

  const filteredApps = activeCategory === 'Sales' ? allApps.filter(a => a.team.includes('SALES'))
    : activeCategory === 'Operations' ? allApps.filter(a => a.team.includes('OPS'))
    : activeCategory === 'Support' ? allApps.filter(a => a.team.includes('SUPPORT'))
    : activeCategory === 'Research' ? allApps.filter(a => a.team.includes('RESEARCH'))
    : allApps;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-surface-950/90 backdrop-blur-xl border-b border-surface-200/50 dark:border-surface-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm shadow-brand-500/30">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-base font-bold text-surface-900 dark:text-white">taskade</span>
              </div>
              <div className="hidden md:flex items-center gap-1">
                {['Create', 'Connect', 'Clone'].map((menu) => (
                  <div
                    key={menu}
                    className="relative"
                    onMouseEnter={() => { if (menuTimeout.current) clearTimeout(menuTimeout.current); setActiveMenu(menu); }}
                    onMouseLeave={() => { menuTimeout.current = setTimeout(() => setActiveMenu(null), 150); }}
                  >
                    <button className="px-3 py-1.5 text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors flex items-center gap-1">
                      {menu}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {activeMenu === menu && (
                      <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-2xl shadow-black/10 p-2">
                        {menu === 'Create' && (
                          <>
                            <MenuItem icon={AppWindow} label="App Gallery" sub="Browse and clone example apps" />
                            <MenuItem icon={GitFork} label="Compare Taskade" sub="See how we stack up" />
                            <MenuItem icon={Bot} label="AI Agents" sub="Pre-built agent templates" />
                            <MenuItem icon={Workflow} label="Automations" sub="Workflow automation templates" />
                            <MenuItem icon={LayoutDashboard} label="Templates" sub="Ready-to-use project templates" />
                            <MenuItem icon={Box} label="Genesis Kits" sub="Pre-built workspace DNA" />
                          </>
                        )}
                        {menu === 'Connect' && (
                          <>
                            <MenuItem icon={Grid3X3} label="Integrations" sub="Connect 100+ apps" />
                            <MenuItem icon={Download} label="Download Apps" sub="Web, mobile, desktop" />
                            <MenuItem icon={Code} label="Developer API" sub="Build custom integrations" />
                            <MenuItem icon={Users} label="Community" sub="Discover Genesis apps" />
                            <MenuItem icon={HelpCircle} label="Help Center" sub="Docs and guides" />
                            <MenuItem icon={BookOpen} label="Blog" sub="Latest insights" />
                          </>
                        )}
                        {menu === 'Clone' && (
                          <>
                            <MenuItem icon={Star} label="Featured Apps" sub="Curated app showcase" />
                            <MenuItem icon={Users} label="Community Apps" sub="Apps built by users" />
                            <MenuItem icon={BarChart3} label="Dashboards" sub="Analytics and reporting" />
                            <MenuItem icon={Workflow} label="Workflows" sub="Automation workflows" />
                            <MenuItem icon={Trello} label="Tools" sub="Productivity utilities" />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/pricing" className="text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/login" className="text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors">
                Login
              </Link>
              <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/30 transition-all">
                Sign up for free
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 inline-block" />
              </button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button onClick={toggleTheme} className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800">
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              <Link href="/pricing" className="block px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">Pricing</Link>
              <Link href="/login" className="block px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">Login</Link>
              <div className="pt-2 border-t border-surface-200 dark:border-surface-800">
                <p className="px-3 py-1 text-xs font-semibold text-surface-400 uppercase tracking-wider">Create</p>
                <MenuItem icon={AppWindow} label="App Gallery" sub="Browse and clone example apps" />
                <MenuItem icon={Bot} label="AI Agents" sub="Pre-built agent templates" />
                <MenuItem icon={Workflow} label="Automations" sub="Workflow automation templates" />
                <p className="px-3 py-1 mt-2 text-xs font-semibold text-surface-400 uppercase tracking-wider">Connect</p>
                <MenuItem icon={Grid3X3} label="Integrations" sub="Connect 100+ apps" />
                <MenuItem icon={Download} label="Downloads" sub="Web, mobile, desktop" />
                <MenuItem icon={Code} label="Developer API" sub="Build custom integrations" />
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-14">
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/40 to-white dark:from-brand-950/10 dark:to-surface-950 pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-brand-500/8 to-violet-500/8 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200/50 dark:border-brand-800/50 text-sm font-medium text-brand-700 dark:text-brand-300 mb-6">
                <Sparkles className="w-4 h-4" />
                AI App Builder: Vibe Code Apps, AI Agents & Workflow Automations
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                <span className="text-surface-900 dark:text-white">One prompt.</span>
                <br />
                <span className="gradient-text">One living app.</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                Projects hold the memory. Agents do the thinking. Automations run the work — wired together on day one.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
                <button className="px-6 py-3 text-base font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2">
                  Build it <Zap className="w-4 h-4" />
                </button>
                <button className="px-6 py-3 text-base font-semibold rounded-xl border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-all flex items-center gap-2">
                  <Play className="w-4 h-4" /> Watch demo
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                <FeaturePill><AppWindow className="w-3 h-3" /> Internal tool</FeaturePill>
                <FeaturePill><Users className="w-3 h-3" /> Client portal</FeaturePill>
                <FeaturePill><LayoutDashboard className="w-3 h-3" /> CRM</FeaturePill>
                <FeaturePill><BarChart3 className="w-3 h-3" /> Dashboard</FeaturePill>
                <FeaturePill><Search className="w-3 h-3" /> Tracker</FeaturePill>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-50 dark:bg-surface-900 text-sm text-surface-500 dark:text-surface-400">
                <span className="text-warning-500">★</span>
                <span className="font-medium">4.9</span>
                <span className="text-surface-400">·</span>
                <span>150K+ apps shipped</span>
                <span className="text-surface-400">·</span>
                <span>Backed by Y Combinator</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {heroApps.map((app, i) => (
                <AppCard key={i} app={app} compact />
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                Browse every workspace <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-surface-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4">
                Pick a team. Clone the workspace.
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                Real agent workspaces with Memory, Intelligence, and Execution wired in — click any one to clone in 30 seconds.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {['Sales', 'Operations', 'Marketing', 'AI Tools', 'Productivity'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeCategory === cat
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                      : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredApps.map((app, i) => (
                <AppCard key={i} app={app} />
              ))}
            </div>

            <div className="text-center mt-10">
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                Explore the full Community Gallery <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

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
                { icon: MessageSquare, label: 'Prompt It' },
                { icon: Palette, label: 'Design It' },
                { icon: Workflow, label: 'Automate It' },
                { icon: Bot, label: 'Add Agents' },
                { icon: Share2, label: 'Share It' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 bg-white dark:bg-surface-900/30 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-all cursor-pointer group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/10 to-violet-500/10 dark:from-brand-400/10 dark:to-violet-400/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-brand-600 dark:text-brand-400" />
                    </div>
                    <span className="text-sm font-semibold text-surface-700 dark:text-surface-300">{item.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">
                  One agent. Or one workspace.
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Memory, intelligence, execution. Every lane wired together.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-surface-200 dark:border-surface-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
                      <th className="text-left px-5 py-3.5 font-semibold text-surface-900 dark:text-white">Lane</th>
                      <th className="text-left px-5 py-3.5 font-semibold text-surface-900 dark:text-white">What they ship</th>
                      <th className="text-center px-5 py-3.5 font-semibold text-surface-900 dark:text-white hidden md:table-cell">Agent team?</th>
                      <th className="text-center px-5 py-3.5 font-semibold text-surface-900 dark:text-white hidden md:table-cell">Runs business processes?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                    {[
                      { lane: 'One-agent chat', desc: 'ChatGPT · Claude · Gemini', ship: 'Answers in a session', team: false, ops: false },
                      { lane: 'Vibe coding', desc: 'Lovable · Bolt · v0 · Cursor · Replit', ship: 'Static code from a prompt', team: false, ops: false },
                      { lane: 'Workspace for humans', desc: 'Notion · Linear · ClickUp · Asana', ship: 'Docs, tasks, dashboards for people', team: false, ops: false },
                      { lane: 'Workflow automation', desc: 'Zapier · n8n · Make', ship: 'Trigger → action chains', team: true, ops: false },
                      { lane: 'Taskade Genesis', desc: '', ship: 'AI operations workspace', team: true, ops: true, highlight: true },
                    ].map((row, i) => (
                      <tr key={i} className={`${row.highlight ? 'bg-brand-50/50 dark:bg-brand-950/20' : ''} hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors`}>
                        <td className={`px-5 py-3.5 font-semibold ${row.highlight ? 'text-brand-700 dark:text-brand-300' : 'text-surface-900 dark:text-white'}`}>
                          <div>{row.lane}</div>
                          {row.desc && <div className="text-xs text-surface-500 dark:text-surface-400 font-normal mt-0.5">{row.desc}</div>}
                        </td>
                        <td className="px-5 py-3.5 text-surface-600 dark:text-surface-300">{row.ship}</td>
                        <td className="px-5 py-3.5 text-center hidden md:table-cell">
                          {row.team ? <CheckCircle className="w-4 h-4 text-success-500 mx-auto" /> : <span className="text-surface-400">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-center hidden md:table-cell">
                          {row.ops ? <CheckCircle className="w-4 h-4 text-success-500 mx-auto" /> : <span className="text-surface-400">—</span>}
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

            <div className="text-center mt-12">
              <h3 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">
                One workspace. Every agent. Every workflow.
              </h3>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Alive 24/7.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-surface-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-2">
                Your Workspace. Alive.
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Memory. Intelligence. Execution. One living system.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: AppWindow, title: 'AI App Builder', desc: 'One prompt. One app. Transform ideas into living software, no setup required.' },
                { icon: Globe, title: 'Websites & Portals', desc: 'Build portals, landing pages, and documentation sites. Share your systems with the world.' },
                { icon: BarChart3, title: 'Dashboards', desc: 'Build analytics dashboards, KPI trackers, and real-time reports to stay in sync.' },
                { icon: Copy, title: 'Clone & Remix', desc: 'Copy, adapt, and refine any app. Every idea is a seed that grows.' },
                { icon: Trello, title: 'Business Tools', desc: 'Create CRM systems, trackers, calculators, and custom business apps with AI.' },
                { icon: Terminal, title: 'Prompt as Creation', desc: 'Describe what you need. Genesis turns your words into structure and flow.' },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="p-6 rounded-2xl border border-surface-200/50 dark:border-surface-700/50 bg-white dark:bg-surface-900/30 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-violet-500/10 dark:from-brand-400/10 dark:to-violet-400/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Build Your First Living System
                </h2>
                <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
                  Describe what you need and Taskade builds the full app, AI agents, and automations. Ready to use in minutes.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button className="px-6 py-3 text-base font-semibold rounded-xl bg-white text-brand-700 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2">
                    Start Building <Zap className="w-4 h-4" />
                  </button>
                  <button className="px-6 py-3 text-base font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                    Explore Apps <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 border-t border-surface-200 dark:border-surface-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-surface-500 dark:text-surface-400">
              <span className="font-semibold text-surface-700 dark:text-surface-300">100K+ live apps</span>
              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600" />
              <span className="font-semibold text-surface-700 dark:text-surface-300">500K+ agents deployed</span>
              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600" />
              <span>Built by teams at</span>
              {['Google', 'Nike', 'Adobe', 'Netflix', 'Airbnb'].map((company) => (
                <span key={company} className="font-semibold text-surface-400 dark:text-surface-500">{company}</span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-surface-200 dark:border-surface-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-base font-bold">taskade</span>
              </div>
              <div className="space-y-1.5 text-sm">
                {['About', 'Press', 'Pricing', 'Features', 'Integrations', 'Changelog', 'Contact us'].map((link) => (
                  <div key={link} className="text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white cursor-pointer transition-colors">{link}</div>
                ))}
              </div>
            </div>
            {[
              { title: 'See all', links: ['Gallery', 'Productivity', 'Kits', 'Videos', 'Reviews', 'Learn', 'Help', 'Docs', 'FAQ'] },
              { title: 'Vibe', links: ['Vibe Apps', 'Vibe Agents', 'Vibe Coding', 'Vibe Workflows', 'Vibe Marketing', 'Vibe Dashboards', 'Vibe CRM', 'Vibe Automation'] },
              { title: 'Community', links: ['Featured', 'Quick Apps', 'Tools', 'Dashboards', 'Websites', 'Workflows', 'Projects', 'Forms'] },
              { title: 'Downloads', links: ['Android', 'iOS', 'Mac', 'Windows', 'Chrome', 'Firefox', 'Edge'] },
              { title: 'Compare', links: ['vs Cursor', 'vs Bolt', 'vs Lovable', 'vs V0', 'vs Windsurf', 'vs Replit', 'vs Devin', 'vs Claude Code'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm text-surface-900 dark:text-white mb-3">{col.title}</h4>
                <div className="space-y-1.5">
                  {col.links.map((link) => (
                    <div key={link} className="text-sm text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white cursor-pointer transition-colors">{link}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-surface-200 dark:border-surface-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-surface-500 dark:text-surface-400">
            <div className="flex items-center gap-4">
              <span>&copy; {new Date().getFullYear()} Taskade.</span>
              <span>Privacy</span>
              <span>Terms</span>
              <span>Security</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded">Made with Taskade AI for Builders</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MenuItem({ icon: Icon, label, sub }: { icon: React.ElementType; label: string; sub: string }) {
  return (
    <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer transition-colors group">
      <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 group-hover:bg-brand-50 dark:group-hover:bg-brand-950 transition-colors">
        <Icon className="w-4 h-4 text-surface-600 dark:text-surface-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-surface-900 dark:text-white">{label}</div>
        <div className="text-xs text-surface-500 dark:text-surface-400 truncate">{sub}</div>
      </div>
    </div>
  );
}
