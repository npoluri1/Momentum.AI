'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Bot, FolderKanban, Users, Workflow, Zap, ArrowRight, Sparkles,
  DollarSign, CheckCircle, Activity,
  GitBranch, AppWindow,
  Code, FileText, Share2, Cpu, Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type PromptCategory = 'apps' | 'agents' | 'workflows' | 'tools' | 'connect' | 'files' | 'models';

interface CategoryConfig {
  id: PromptCategory;
  label: string;
  icon: React.ElementType;
  gradient: string;
  prompts: string[];
}

const categories: CategoryConfig[] = [
  {
    id: 'apps',
    label: 'Apps',
    icon: AppWindow,
    gradient: 'from-violet-500 to-purple-600',
    prompts: [
      'Build a project management dashboard with task tracking and team views',
      'Create a client portal with project tracking, file sharing, and Stripe payments',
      'Design an internal tool for team requests, routing, and status tracking',
      'Build a real-time analytics dashboard with KPIs and live charts',
    ],
  },
  {
    id: 'agents',
    label: 'Agents',
    icon: Bot,
    gradient: 'from-emerald-500 to-teal-600',
    prompts: [
      'Create a sales agent that scores leads and sends follow-up emails',
      'Deploy a support agent that resolves tickets from the knowledge base',
      'Build a research agent that analyzes market trends and writes reports',
      'Set up a code review agent that checks PRs for bugs and security issues',
    ],
  },
  {
    id: 'workflows',
    label: 'Workflows',
    icon: GitBranch,
    gradient: 'from-sky-500 to-cyan-600',
    prompts: [
      'Automate lead capture from web forms into CRM with email follow-up',
      'Set up Slack notifications when deal stages change in the pipeline',
      'Create a daily report generator that emails team metrics every morning',
      'Build an invoice workflow that triggers on closed deals and sends billing',
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: Code,
    gradient: 'from-amber-500 to-orange-600',
    prompts: [
      'Build a data importer that syncs CSV files into project tasks',
      'Create a meeting scheduler with calendar integration and reminders',
      'Design a file converter tool that processes uploads automatically',
      'Build a URL shortener with click tracking and QR code generation',
    ],
  },
  {
    id: 'connect',
    label: 'Connect',
    icon: Share2,
    gradient: 'from-rose-500 to-pink-600',
    prompts: [
      'Sync GitHub issues into project tasks with status updates',
      'Connect Slack to send notifications when workflows complete',
      'Integrate Stripe payments for checkout in client portals',
      'Set up webhook integration for custom API data flows',
    ],
  },
  {
    id: 'files',
    label: 'Files',
    icon: FileText,
    gradient: 'from-blue-500 to-indigo-600',
    prompts: [
      'Create a document management system with version control',
      'Build a file upload portal with automatic OCR processing',
      'Design a knowledge base with AI-powered search and summaries',
      'Set up automated file backups with folder organization',
    ],
  },
  {
    id: 'models',
    label: 'Models',
    icon: Cpu,
    gradient: 'from-cyan-500 to-teal-600',
    prompts: [
      'Set up a custom AI model for sentiment analysis on feedback',
      'Deploy a recommendation engine for personalized content',
      'Create a data pipeline that trains models on workspace activity',
      'Build an intent classifier for routing customer inquiries',
    ],
  },
];

const quickStats = [
  { label: 'Projects', value: '12', icon: FolderKanban, gradient: 'from-emerald-500 to-teal-500', badge: 'active', href: '/workspace/projects' },
  { label: 'AI Agents', value: '5', icon: Bot, gradient: 'from-violet-500 to-purple-600', badge: 'deployed', href: '/workspace/agents' },
  { label: 'Active Workflows', value: '8', icon: Workflow, gradient: 'from-sky-500 to-cyan-500', badge: 'running', href: '/workspace/automations' },
  { label: 'Pipeline Value', value: '$284K', icon: DollarSign, gradient: 'from-rose-500 to-pink-600', badge: 'this quarter', href: '/workspace/crm' },
];

export default function WorkspaceDashboard() {
  const [input, setInput] = useState('');
  const [activeCategory, setActiveCategory] = useState<PromptCategory | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCategoryClick = (cat: PromptCategory) => {
    setActiveCategory(cat === activeCategory ? null : cat);
    setShowSuggestions(true);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    setShowSuggestions(false);
    // Focus the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Auto-resize
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    // Navigate to genesis page with the prompt
    window.location.href = `/create?prompt=${encodeURIComponent(input)}`;
  };

  return (
    <div className="min-h-full">
      {/* Central Chat Interface */}
      <div className="bg-gradient-to-b from-brand-500/[0.03] via-intelligence-500/[0.02] to-transparent dark:from-brand-950/20 dark:via-intelligence-950/10 dark:to-transparent border-b border-surface-200/50 dark:border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-medium text-brand-600 dark:text-brand-400 mb-3">
              <Sparkles className="w-3 h-3" />
              One prompt. One shared brain.
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white tracking-tight">
              What are we building today?
            </h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 max-w-lg mx-auto">
              Describe what you need — apps, agents, workflows, or anything in between. AI builds it.
            </p>
          </div>

          {/* Chat Input Area */}
          <div className="relative mb-5">
            <div className="apple-card p-1">
              <div className="flex items-start gap-2 bg-surface-50/50 dark:bg-white/[0.03] rounded-2xl border border-surface-200/50 dark:border-white/[0.08] focus-within:border-brand-500/40 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all p-2">
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Describe what to build... (e.g. 'Create a CRM dashboard with AI lead scoring')"
                    rows={2}
                    className="w-full bg-transparent px-3 py-2 text-sm text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="shrink-0 p-2.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-sm shadow-brand-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick hints */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-[10px] text-surface-400 dark:text-surface-500">Enter to send · Shift+Enter for new line</span>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all border',
                    isActive
                      ? 'bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-transparent shadow-md'
                      : 'bg-white dark:bg-white/[0.06] text-surface-600 dark:text-surface-400 border-surface-200/50 dark:border-white/[0.08] hover:bg-surface-100 dark:hover:bg-white/[0.1] hover:text-surface-900 dark:hover:text-white'
                  )}
                >
                  <div className={cn('w-5 h-5 rounded-lg bg-gradient-to-br flex items-center justify-center', cat.gradient)}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Prompt Suggestions */}
          {activeCategory && showSuggestions && (
            <div className="animate-fade-in">
              {categories.filter(c => c.id === activeCategory).map((cat) => {
                const Icon = cat.icon;
                return (
                  <div key={cat.id} className="apple-card p-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={cn('w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center', cat.gradient)}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-surface-900 dark:text-white">{cat.label}</span>
                      <span className="text-xs text-surface-400">— try these prompts</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cat.prompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handlePromptClick(prompt)}
                          className="text-left px-3.5 py-2.5 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04] text-xs text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-white/[0.06] hover:border-brand-500/30 transition-all leading-relaxed"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Default suggestions when no category selected */}
          {!activeCategory && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                'Create a sales CRM with deal tracking',
                'Build a project dashboard with team views',
                'Deploy an AI agent for customer support',
                'Automate lead capture into workflows',
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handlePromptClick(prompt)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-white dark:bg-white/[0.04] border border-surface-200/50 dark:border-white/[0.08] text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.08] hover:border-brand-500/30 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="apple-stat-card group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn('w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-sm', stat.gradient)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] font-medium text-surface-400 dark:text-surface-500 bg-surface-100/50 dark:bg-white/[0.04] px-2 py-0.5 rounded-full capitalize">
                    {stat.badge}
                  </span>
                </div>
                <p className="text-3xl font-bold text-surface-900 dark:text-white mb-0.5 tracking-tight">{stat.value}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{stat.label}</p>
                  <ArrowRight className="w-4 h-4 text-surface-300 dark:text-surface-600 group-hover:text-brand-500 transition-colors group-hover:translate-x-0.5 transform transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="apple-card p-6">
            <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-brand-500" />
              Recent Activity
              <span className="text-xs font-normal text-surface-400 ml-auto">Last 24 hours</span>
            </h3>
            <div className="space-y-1">
              {[
                { icon: CheckCircle, text: 'Completed "API Integration" task', time: '2m ago', color: 'text-memory-500' },
                { icon: DollarSign, text: 'Deal closed: Enterprise Plan', time: '15m ago', color: 'text-brand-500' },
                { icon: Sparkles, text: 'Agent drafted Q4 report', time: '1h ago', color: 'text-intelligence-500' },
                { icon: GitBranch, text: 'Workflow "Lead Follow-up" ran', time: '3h ago', color: 'text-execution-500' },
                { icon: Users, text: 'New team member joined', time: '1d ago', color: 'text-memory-500' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer group">
                    <div className={cn('w-8 h-8 rounded-lg bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center', item.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="flex-1 text-sm text-surface-600 dark:text-surface-400 group-hover:text-surface-700 dark:group-hover:text-surface-300 transition-colors">{item.text}</p>
                    <span className="text-xs text-surface-400 dark:text-surface-500 shrink-0 font-medium">{item.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="apple-card p-6">
            <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-brand-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Bot, label: 'Create Agent', gradient: 'from-violet-500 to-purple-600', href: '/workspace/agents', desc: 'Deploy AI team members' },
                { icon: FolderKanban, label: 'New Project', gradient: 'from-emerald-500 to-teal-500', href: '/workspace/projects', desc: 'Start fresh workspace' },
                { icon: GitBranch, label: 'Build Workflow', gradient: 'from-sky-500 to-cyan-500', href: '/workspace/automations', desc: 'Automate processes' },
                { icon: Users, label: 'Add Contact', gradient: 'from-rose-500 to-pink-600', href: '/workspace/crm', desc: 'Grow your pipeline' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.label} href={item.href} className="group flex flex-col gap-3 p-4 rounded-2xl border border-surface-200/40 dark:border-white/[0.06] bg-surface-50/30 dark:bg-white/[0.02] hover:bg-surface-100/50 dark:hover:bg-white/[0.04] transition-all hover:shadow-md">
                    <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm', item.gradient)}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{item.label}</p>
                      <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">{item.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-surface-900 dark:text-white flex items-center gap-2.5">
              <FolderKanban className="w-4 h-4 text-memory-500" />
              Active Projects
            </h3>
            <Link href="/workspace/projects" className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-1">
            {[
              { name: 'Website Redesign', progress: 65, gradient: 'from-brand-500 to-rose-500', members: 3, tasks: '8/12' },
              { name: 'Mobile App v2', progress: 30, gradient: 'from-violet-500 to-purple-600', members: 2, tasks: '7/24' },
              { name: 'CRM Integration', progress: 80, gradient: 'from-emerald-500 to-teal-500', members: 2, tasks: '6/8' },
              { name: 'Q4 Marketing Campaign', progress: 10, gradient: 'from-sky-500 to-cyan-500', members: 1, tasks: '2/18' },
              { name: 'Sales Playbook', progress: 45, gradient: 'from-amber-500 to-orange-600', members: 3, tasks: '5/11' },
            ].map((project, i) => (
              <div key={i} className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-surface-50/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer group">
                <div className={cn('w-2 h-2 rounded-full shrink-0', project.gradient.split(' ')[0].replace('from-', 'bg-'))} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white group-hover:text-brand-500 transition-colors">{project.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-surface-500 dark:text-surface-400">
                    <span>{project.members} {project.members === 1 ? 'member' : 'members'}</span>
                    <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
                    <span>{project.tasks} tasks</span>
                  </div>
                </div>
                <div className="w-36">
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-1.5 rounded-full bg-surface-200/50 dark:bg-white/[0.06] overflow-hidden">
                      <div
                        className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out', project.gradient)}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 w-8 text-right">{project.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="flex items-center justify-center gap-6 text-xs text-surface-400 dark:text-surface-500 pt-2">
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-memory-500" /> 12 projects</span>
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-intelligence-500" /> 5 agents</span>
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-execution-500" /> 8 workflows</span>
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-brand-500" /> $284K pipeline</span>
        </div>
      </div>
    </div>
  );
}
