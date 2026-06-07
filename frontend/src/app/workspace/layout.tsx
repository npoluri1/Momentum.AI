'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Bot, FolderKanban, Users, Workflow, Puzzle,
  Settings, ChevronLeft, ChevronRight, Zap, BarChart3, MessageSquare,
  FileText, HelpCircle, LogOut, ChevronDown, Search, Plus, Menu,
  X, Sparkles, PanelRight, Sun, Moon, Command, Bell, GalleryVerticalEnd,
  Trash2, Download, BookOpen, Home, Activity, Globe, Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

const navItems = [
  { label: 'Dashboard', href: '/workspace/dashboard', icon: LayoutDashboard },
  { label: 'Team', href: '/workspace/team', icon: Users, badge: 8 },
  { label: 'Agents', href: '/workspace/agents', icon: Bot, badge: 3 },
  { label: 'Projects', href: '/workspace/projects', icon: FolderKanban },
  { label: 'CRM', href: '/workspace/crm', icon: Users },
  { label: 'Automations', href: '/workspace/automations', icon: Workflow },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Reports', href: '/reports', icon: FileText },
  { label: 'Activity', href: '/activity', icon: Activity },
];

const resourcesItems = [
  { label: 'Messages', href: '/workspace/messages', icon: MessageSquare, badge: 5 },
  { label: 'Documents', href: '/workspace/documents', icon: FileText },
  { label: 'Integrations', href: '/integrations', icon: Puzzle },
  { label: 'Gallery', href: '/gallery', icon: GalleryVerticalEnd },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Trash', href: '/trash', icon: Trash2 },
  { label: 'Download', href: '/download', icon: Download },
];

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [eveOpen, setEveOpen] = useState(true);

  // Keyboard shortcut: Cmd+B / Ctrl+B to toggle sidebar
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarCollapsed(prev => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [eveMessage, setEveMessage] = useState('');
  const [eveChat, setEveChat] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: "Hi, I'm EVE. I can build apps, manage projects, deploy agents, or set up workflows. What would you like to build today?" },
  ]);
  const [evePalette, setEvePalette] = useState<'tools' | 'connect' | 'files' | 'models'>('tools');
  const { theme, setTheme } = useTheme();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const handleEveSend = () => {
    if (!eveMessage.trim()) return;
    setEveChat([...eveChat, { role: 'user', content: eveMessage }]);
    setTimeout(() => {
      setEveChat(prev => [...prev, { role: 'assistant', content: "Great! I'll start working on that. I'll set up the project structure, deploy the right agents, and configure the workflows. I'll keep you posted on progress." }]);
    }, 1000);
    setEveMessage('');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-[#0a0a0f]">
      {/* Mobile overlay with Apple blur */}
      <div className={cn(
        'fixed inset-0 z-30 lg:hidden transition-all duration-300',
        mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
      </div>

      {/* Sidebar - Apple-style */}
      <aside className={cn(
        'fixed lg:relative inset-y-0 left-0 z-40 flex flex-col transition-all duration-300 ease-out',
        sidebarCollapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        'bg-white/90 dark:bg-[#0a0a0f]/95 backdrop-blur-2xl',
        'border-r border-surface-200/60 dark:border-white/[0.06]'
      )}>
        {/* Logo - Apple style */}
        <div className={cn(
          'flex items-center h-16 border-b border-surface-200/50 dark:border-white/[0.06]',
          sidebarCollapsed ? 'justify-center px-3' : 'justify-between px-4'
        )}>
          {!sidebarCollapsed && (
            <Link href="/workspace/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/30 transition-shadow">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-base font-bold text-surface-900 dark:text-white" style={{ fontFamily: "'Comfortaa', sans-serif" }}>momentum</span>
                <span className="text-[10px] font-semibold text-brand-500 block -mt-0.5">ai workspace</span>
              </div>
            </Link>
          )}
          {sidebarCollapsed && (
            <Link href="/workspace/dashboard" className="group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              'p-1.5 rounded-lg transition-all',
              'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300',
              'hover:bg-surface-100/80 dark:hover:bg-white/[0.06]',
              sidebarCollapsed && 'hidden'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation - Apple style */}
        <div className="flex-1 overflow-y-auto scrollbar-hide py-4 px-2.5 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'apple-sidebar-item relative',
                  active ? 'apple-sidebar-item-active' : 'apple-sidebar-item-inactive',
                  sidebarCollapsed && 'justify-center px-2'
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={cn('w-5 h-5 shrink-0', active ? 'text-brand-500' : '')} />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-brand-500 text-white min-w-[22px] text-center leading-none">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-bold rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/40">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {!sidebarCollapsed && (
            <>
              <div className="pt-6 pb-2 px-3">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-surface-200/0 via-surface-200/50 dark:via-white/[0.06] to-surface-200/0" />
                  <span className="text-[11px] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-[0.08em]">Resources</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-surface-200/0 via-surface-200/50 dark:via-white/[0.06] to-surface-200/0" />
                </div>
              </div>
              {resourcesItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'apple-sidebar-item',
                      active ? 'apple-sidebar-item-active' : 'apple-sidebar-item-inactive',
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 truncate text-sm">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-brand-500 text-white min-w-[22px] text-center leading-none">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </>
          )}
        </div>

        {/* User section - Apple style */}
        <div className={cn(
          'border-t border-surface-200/50 dark:border-white/[0.06]',
          sidebarCollapsed ? 'flex flex-col items-center gap-3 py-3' : 'p-3'
        )}>
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-surface-100/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer group">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 via-intelligence-500 to-execution-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  JD
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-memory-500 border-2 border-white dark:border-[#0a0a0f]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">John Doe</p>
                <p className="text-[11px] text-surface-400 dark:text-surface-500 truncate">demo@momentum.ai</p>
              </div>
              <button className="p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-500/10 transition-all opacity-0 group-hover:opacity-100">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 via-intelligence-500 to-execution-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  JD
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-memory-500 border-2 border-[#0a0a0f]" />
              </div>
              <button className="p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-500/10 transition-all">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Collapse expand button */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-[#0a0a0f] border border-surface-200 dark:border-white/[0.08] flex items-center justify-center text-surface-400 hover:text-surface-600 shadow-lg transition-all hover:scale-110"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar - Apple style */}
        <header className={cn(
          'h-16 flex items-center justify-between px-4 md:px-6 shrink-0',
          'bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-2xl',
          'border-b border-surface-200/50 dark:border-white/[0.06]'
        )}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100/80 dark:hover:bg-white/[0.06] transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-surface-400">
                <Home className="w-3.5 h-3.5" />
                <span className="text-surface-300 dark:text-surface-500">/</span>
                <span className="text-surface-700 dark:text-surface-300 font-medium">
                  {navItems.find(i => isActive(i.href))?.label || 'Dashboard'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Apple-style command bar */}
            <button className={cn(
              'hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-all',
              'bg-surface-100/80 dark:bg-white/[0.06] border border-surface-200/50 dark:border-white/[0.06]',
              'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300',
              'hover:bg-surface-200/50 dark:hover:bg-white/[0.08]'
            )}>
              <Search className="w-3.5 h-3.5" />
              <span>Quick search...</span>
              <kbd className="ml-2 text-[10px] px-1.5 py-0.5 rounded-md bg-white dark:bg-surface-800 text-surface-400 border border-surface-200 dark:border-white/[0.06] font-mono">⌘K</kbd>
            </button>

            <div className="w-px h-5 bg-surface-200/50 dark:bg-white/[0.06] mx-1 hidden md:block" />

            <button className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100/80 dark:hover:bg-white/[0.06] transition-all relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-[#0a0a0f]" />
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100/80 dark:hover:bg-white/[0.06] transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setEveOpen(!eveOpen)}
              className={cn(
                'p-2 rounded-xl transition-all',
                eveOpen
                  ? 'bg-brand-500/10 text-brand-500 shadow-sm'
                  : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100/80 dark:hover:bg-white/[0.06]'
              )}
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <Link
              href="/settings"
              className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100/80 dark:hover:bg-white/[0.06] transition-all"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Content area with EVE panel */}
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>              {/* EVE AI Chat Panel - Apple style */}
          {eveOpen && (
            <aside className={cn(
              'w-[var(--eve-panel-width)] flex flex-col shrink-0',
              'bg-white/90 dark:bg-[#0a0a0f]/95 backdrop-blur-2xl',
              'border-l border-surface-200/50 dark:border-white/[0.06]'
            )}>
              {/* EVE Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-surface-200/50 dark:border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 via-intelligence-500 to-execution-500 flex items-center justify-center shadow-md">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-memory-500 border-2 border-white dark:border-[#0a0a0f]" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-surface-900 dark:text-white">EVE</span>
                    <p className="text-[10px] text-memory-500 font-medium">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-semibold text-memory-500 bg-memory-500/10 px-2.5 py-1 rounded-full border border-memory-500/20">
                    Genesis AI
                  </span>
                </div>
              </div>

              {/* EVE Palette Tabs */}
              <div className="flex items-center gap-0.5 px-3 py-2 bg-surface-100/50 dark:bg-white/[0.03] border-b border-surface-200/50 dark:border-white/[0.06]">
                {([
                  { id: 'tools' as const, label: 'Tools', icon: Zap },
                  { id: 'connect' as const, label: 'Connect', icon: Globe },
                  { id: 'files' as const, label: 'Files', icon: FileText },
                  { id: 'models' as const, label: 'Models', icon: Cpu },
                ]).map((tab) => {
                  const TabIcon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setEvePalette(tab.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all',
                        evePalette === tab.id
                          ? 'bg-brand-500/10 text-brand-500 shadow-sm'
                          : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06]'
                      )}
                    >
                      <TabIcon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* EVE Palette Content */}
              <div className="overflow-y-auto max-h-[180px] px-3 py-2 space-y-2 scrollbar-thin border-b border-surface-200/50 dark:border-white/[0.06]">
                {evePalette === 'tools' && (
                  <>
                    {[
                      { label: 'Web', items: ['Web Search', 'Web Scraping', 'RSS Reader'] },
                      { label: 'Media', items: ['Image Gen', 'Image Analysis', 'PDF Reader', 'Audio'] },
                      { label: 'Code', items: ['Code Execution', 'Bash', 'Data Processing'] },
                      { label: 'Workspace', items: ['Projects', 'Knowledge', 'Calendar', 'Email'] },
                    ].map((section) => (
                      <div key={section.label}>
                        <p className="text-[10px] font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1 px-1">{section.label}</p>
                        <div className="flex flex-wrap gap-1">
                          {section.items.map((item) => (
                            <button
                              key={item}
                              onClick={() => { setEveMessage(item); }}
                              className="px-2 py-1 text-[10px] font-medium rounded-md bg-surface-100/50 dark:bg-white/[0.04] border border-surface-200/30 dark:border-white/[0.04] text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.08] hover:border-brand-500/30 transition-all"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {evePalette === 'connect' && (
                  <>
                    {[
                      { label: 'Comms', items: ['Slack', 'Discord', 'Teams', 'WhatsApp', 'Telegram', 'Gmail'] },
                      { label: 'CRM & Payments', items: ['HubSpot', 'Stripe', 'Shopify', 'Apollo'] },
                      { label: 'Google', items: ['Sheets', 'Drive', 'Calendar', 'Docs'] },
                      { label: 'Developer', items: ['GitHub', 'Jira', 'Linear', 'Webhook'] },
                      { label: 'Social', items: ['LinkedIn', 'X', 'Reddit', 'YouTube'] },
                      { label: 'Storage', items: ['Airtable', 'Dropbox', 'Box', 'OneDrive'] },
                    ].map((section) => (
                      <div key={section.label}>
                        <p className="text-[10px] font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1 px-1">{section.label}</p>
                        <div className="flex flex-wrap gap-1">
                          {section.items.map((item) => (
                            <button
                              key={item}
                              onClick={() => { setEveMessage(item); }}
                              className="px-2 py-1 text-[10px] font-medium rounded-md bg-surface-100/50 dark:bg-white/[0.04] border border-surface-200/30 dark:border-white/[0.04] text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.08] hover:border-brand-500/30 transition-all"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {evePalette === 'files' && (
                  <>
                    {[
                      { label: 'Docs', items: ['PDF', 'Word', 'Markdown', 'Plain text'] },
                      { label: 'Data', items: ['Excel', 'CSV', 'JSON'] },
                      { label: 'Media', items: ['Images', 'Audio', 'Video'] },
                      { label: 'Bundles', items: ['ZIP', 'Google Drive', 'Dropbox'] },
                    ].map((section) => (
                      <div key={section.label}>
                        <p className="text-[10px] font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1 px-1">{section.label}</p>
                        <div className="flex flex-wrap gap-1">
                          {section.items.map((item) => (
                            <button
                              key={item}
                              onClick={() => { setEveMessage(item); }}
                              className="px-2 py-1 text-[10px] font-medium rounded-md bg-surface-100/50 dark:bg-white/[0.04] border border-surface-200/30 dark:border-white/[0.04] text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.08] hover:border-brand-500/30 transition-all"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {evePalette === 'models' && (
                  <>
                    {[
                      { label: 'OpenAI', items: ['GPT 5.2', 'GPT 5.1', 'o3', 'o4-mini'] },
                      { label: 'Anthropic', items: ['Claude Opus 4.7', 'Claude Sonnet 4.6', 'Claude Haiku 3.5'] },
                      { label: 'Google', items: ['Gemini 3.1 Pro', 'Gemini 3 Pro', 'Gemini 2.5 Flash'] },
                      { label: 'Open-weight', items: ['DeepSeek V4', 'Qwen 3.6', 'Kimi K2.6', 'MiniMax'] },
                    ].map((section) => (
                      <div key={section.label}>
                        <p className="text-[10px] font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1 px-1">{section.label}</p>
                        <div className="flex flex-wrap gap-1">
                          {section.items.map((item) => (
                            <button
                              key={item}
                              onClick={() => { setEveMessage(item); }}
                              className="px-2 py-1 text-[10px] font-medium rounded-md bg-surface-100/50 dark:bg-white/[0.04] border border-surface-200/30 dark:border-white/[0.04] text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.08] hover:border-brand-500/30 transition-all"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* EVE Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {eveChat.map((msg, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-start gap-3 animate-fade-in',
                      msg.role === 'user' ? 'flex-row-reverse' : ''
                    )}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 via-intelligence-500 to-execution-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className={cn(
                      'rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-[88%]',
                      msg.role === 'assistant'
                        ? 'bg-surface-100/80 dark:bg-white/[0.06] text-surface-700 dark:text-surface-300 border border-surface-200/30 dark:border-white/[0.04]'
                        : 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* EVE Input */}
              <div className="p-4 border-t border-surface-200/50 dark:border-white/[0.06]">
                <div className="flex items-center gap-2 bg-surface-100/80 dark:bg-white/[0.06] rounded-2xl px-3 py-2 border border-surface-200/50 dark:border-transparent focus-within:border-brand-500/30 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all">
                  <input
                    value={eveMessage}
                    onChange={e => setEveMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleEveSend()}
                    placeholder="Ask EVE to build something..."
                    className="flex-1 bg-transparent text-sm text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none"
                  />
                  <button
                    onClick={handleEveSend}
                    disabled={!eveMessage.trim()}
                    className="p-1.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.08]" />
                  <p className="text-[10px] text-surface-400 dark:text-surface-500">
                    EVE can build apps, manage projects, deploy agents & create workflows
                  </p>
                  <div className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.08]" />
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
