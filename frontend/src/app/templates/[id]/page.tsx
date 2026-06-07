'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Copy, ArrowLeft, Bot, Workflow, LayoutDashboard,
  Star, Users, Check, Zap, FileText, ShoppingCart, Code,
  Palette, Home, BarChart3, MessageSquare,
  Sparkles, Eye, ChevronRight, RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface TemplateAgent {
  name: string;
  model: string;
  role: string;
  tools: string[];
}

interface TemplateWorkflow {
  trigger: string;
  actions: string[];
}

interface TemplateProject {
  name: string;
  desc: string;
  tasks: number;
}

interface TemplateData {
  name: string;
  desc: string;
  longDesc: string;
  category: string;
  apps: string;
  clones: number;
  color: string;
  features: string[];
  projects: TemplateProject[];
  agentsList: TemplateAgent[];
  workflows: TemplateWorkflow[];
  related: string[];
}

const templateData: Record<string, TemplateData> = {
  't1': {
    name: 'Sales Pipeline',
    desc: 'Track deals through every stage with AI-powered lead scoring and automated follow-ups.',
    longDesc: 'A complete sales pipeline workspace with AI agents that score leads, automate follow-ups, and keep your deals moving. Includes CRM tracking, deal stages, email sequences, and real-time analytics.',
    category: 'sales',
    apps: 'CRM, Dashboard',
    clones: 12470,
    color: 'from-violet-500 to-purple-600',
    features: [
      'AI Lead Scorer that evaluates and prioritizes incoming leads',
      'Email Composer that drafts personalized follow-up sequences',
      'Automated deal stage progression with trigger-based updates',
      'Real-time pipeline analytics with conversion metrics',
      'Lead capture form integration with automatic enrichment',
      'Multi-channel outreach tracking (email, phone, social)',
    ],
    projects: [
      { name: 'Pipeline Dashboard', desc: 'Real-time KPI overview', tasks: 12 },
      { name: 'Deal Tracker', desc: 'Active deals and stages', tasks: 24 },
      { name: 'Lead Pool', desc: 'Incoming and scored leads', tasks: 8 },
      { name: 'Email Sequences', desc: 'Automated outreach campaigns', tasks: 6 },
    ],
    agentsList: [
      { name: 'Lead Scorer', model: 'GPT-4o', role: 'Scores and prioritizes leads based on intent, fit, and engagement', tools: ['web_search', 'data_analyzer'] },
      { name: 'Email Composer', model: 'Claude 3.5', role: 'Drafts personalized email sequences and follow-ups', tools: ['web_search', 'api_caller'] },
    ],
    workflows: [
      { trigger: 'New lead captured', actions: ['Score lead', 'Assign to rep', 'Send welcome email'] },
      { trigger: 'Deal stage changed', actions: ['Update CRM', 'Notify team', 'Log activity'] },
      { trigger: 'Follow-up due', actions: ['Generate email', 'Queue send', 'Track response'] },
    ],
    related: ['t4', 't7'],
  },
  't4': {
    name: 'Content Calendar',
    desc: 'Plan, create, and schedule content across all your channels with AI assistance.',
    longDesc: 'A complete content operations system with AI agents that write, optimize, and schedule content. Includes blog management, social media scheduling, and performance analytics.',
    category: 'marketing',
    apps: 'Dashboard, Agent',
    clones: 15320,
    color: 'from-amber-500 to-orange-600',
    features: [
      'Content Writer agent for blog posts, social media, and email copy',
      'SEO Analyzer agent that optimizes content for search rankings',
      'Automated content calendar with deadline notifications',
      'Multi-channel publishing workflow (blog, social, email)',
      'Content performance analytics and engagement tracking',
      'Editorial review and approval pipeline',
    ],
    projects: [
      { name: 'Content Dashboard', desc: 'Content calendar and metrics', tasks: 15 },
      { name: 'Blog Posts', desc: 'Article pipeline and drafts', tasks: 20 },
      { name: 'Social Media', desc: 'Post scheduling and analytics', tasks: 30 },
      { name: 'Email Newsletter', desc: 'Campaign management', tasks: 10 },
    ],
    agentsList: [
      { name: 'Content Writer', model: 'GPT-4o', role: 'Writes and optimizes content for various channels', tools: ['web_search', 'file_reader'] },
      { name: 'SEO Analyzer', model: 'Claude 3.5', role: 'Analyzes and optimizes content for search performance', tools: ['web_search', 'data_analyzer'] },
    ],
    workflows: [
      { trigger: 'New content draft', actions: ['SEO analyze', 'Generate headline', 'Schedule post'] },
      { trigger: 'Content approved', actions: ['Format publish', 'Notify team', 'Track performance'] },
      { trigger: 'Weekly report due', actions: ['Gather metrics', 'Generate report', 'Send digest'] },
    ],
    related: ['t1', 't7'],
  },
  't7': {
    name: 'Sprint Planner',
    desc: 'Agile sprint planning with story points, velocity tracking, and retrospective boards.',
    longDesc: 'A complete agile project management workspace with sprints, backlog management, burndown charts, and AI-powered estimation assistance.',
    category: 'engineering',
    apps: 'Dashboard, Project',
    clones: 18730,
    color: 'from-indigo-500 to-violet-600',
    features: [
      'Sprint planning board with story point estimation',
      'Velocity tracking and burndown charts',
      'Automated task assignment based on capacity',
      'Retrospective board with action item tracking',
      'Integration with GitHub and GitLab',
      'Sprint goal tracking with progress indicators',
    ],
    projects: [
      { name: 'Current Sprint', desc: 'Active sprint dashboard', tasks: 30 },
      { name: 'Backlog', desc: 'Prioritized task backlog', tasks: 60 },
      { name: 'Retrospectives', desc: 'Sprint retrospectives archive', tasks: 8 },
      { name: 'Release Notes', desc: 'Version release tracking', tasks: 4 },
    ],
    agentsList: [
      { name: 'Sprint Assistant', model: 'GPT-4o', role: 'Helps estimate story points and track velocity', tools: ['web_search', 'api_caller'] },
    ],
    workflows: [
      { trigger: 'Sprint starts', actions: ['Assign tasks', 'Set goals', 'Notify team'] },
      { trigger: 'Task completed', actions: ['Update burndown', 'Log time', 'Notify QA'] },
    ],
    related: ['t1', 't4'],
  },
};

const categoryThemes: Record<string, { icon: React.ElementType; label: string }> = {
  sales: { icon: Users, label: 'Sales & CRM' },
  marketing: { icon: MessageSquare, label: 'Marketing' },
  engineering: { icon: Code, label: 'Engineering' },
  design: { icon: Palette, label: 'Design' },
  product: { icon: LayoutDashboard, label: 'Product' },
  hr: { icon: Home, label: 'HR & Ops' },
  finance: { icon: BarChart3, label: 'Finance' },
  education: { icon: FileText, label: 'Education' },
  ecommerce: { icon: ShoppingCart, label: 'E-Commerce' },
};

const allTemplates: { id: string; name: string; color: string }[] = [
  { id: 't1', name: 'Sales Pipeline', color: 'from-violet-500 to-purple-600' },
  { id: 't4', name: 'Content Calendar', color: 'from-amber-500 to-orange-600' },
  { id: 't7', name: 'Sprint Planner', color: 'from-indigo-500 to-violet-600' },
];

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'preview' | 'features' | 'workflows'>('features');
  const [cloning, setCloning] = useState(false);

  const template = templateData[params.id as keyof typeof templateData];

  if (!template) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
            <LayoutDashboard className="w-8 h-8 text-surface-400" />
          </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-1">Template not found</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">This template doesn't exist or has been removed</p>
          <Link href="/templates" className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1 justify-center">
            <ArrowLeft className="w-4 h-4" /> Browse templates
          </Link>
        </div>
      </div>
    );
  }

  const handleClone = async () => {
    setCloning(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      toast.success(`"${template.name}" cloned successfully! Opening workspace...`);
      router.push('/workspace/dashboard');
    } catch {
      toast.error('Failed to clone template');
    } finally {
      setCloning(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back */}
        <Link href="/templates" className="inline-flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to gallery
        </Link>

        {/* Hero */}
        <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden mb-8">
          {/* Preview Banner */}
          <div className={cn(
            'aspect-[3/1] bg-gradient-to-br relative flex items-center justify-center',
            template.color
          )}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
                <LayoutDashboard className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{template.name}</h1>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/20 text-white backdrop-blur-sm">{template.apps}</span>
                  <span className="text-white/70 text-xs">{template.agentsList.length} agents · {template.workflows.length} workflows</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
            <div className="flex items-center gap-4 text-sm text-surface-500 dark:text-surface-400">
              <span className="flex items-center gap-1.5"><Bot className="w-4 h-4" />{template.agentsList.length} AI agents</span>
              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.08]" />
              <span className="flex items-center gap-1.5"><Workflow className="w-4 h-4" />{template.workflows.length} workflows</span>
              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.08]" />
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-warning-500" />{(template.clones / 1000).toFixed(1)}k clones</span>
            </div>
            <button
              onClick={handleClone}
              disabled={cloning}
              className="apple-button-primary"
            >
              {cloning ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Cloning...</>
              ) : (
                <><Copy className="w-4 h-4" /> Clone This Workspace</>
              )}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-6 border-b border-surface-200/50 dark:border-white/[0.06]">
            {[
              { key: 'features' as const, label: 'Features', icon: Sparkles },
              { key: 'preview' as const, label: 'Preview', icon: Eye },
              { key: 'workflows' as const, label: 'Workflows', icon: Workflow },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all',
                  activeTab === tab.key
                    ? 'text-brand-500 border-brand-500'
                    : 'text-surface-400 dark:text-surface-500 border-transparent hover:text-surface-600 dark:hover:text-surface-300'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Features Tab */}
            {activeTab === 'features' && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-2">About this template</h2>
                    <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{template.longDesc}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                      <Check className="w-4 h-4 text-success-500" /> Key Features
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {template.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
                          <Check className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                          <span className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3 flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-brand-500" /> Projects included
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {template.projects.map(p => (
                        <div key={p.name} className="p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
                          <p className="text-sm font-semibold text-surface-900 dark:text-white">{p.name}</p>
                          <p className="text-xs text-surface-400">{p.desc} · {p.tasks} tasks</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                  {/* Agents */}
                  <div className="apple-card p-4">
                    <h3 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5" /> AI Agents
                    </h3>
                    <div className="space-y-3">
                      {template.agentsList.map(a => (
                        <div key={a.name} className="p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03]">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded bg-gradient-to-br from-brand-500 to-intelligence-500 flex items-center justify-center">
                              <Bot className="w-3 h-3 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-surface-900 dark:text-white">{a.name}</p>
                          </div>
                          <p className="text-[10px] text-surface-400 mb-1.5">{a.role}</p>
                          <div className="flex flex-wrap gap-1">
                            {a.tools.map(t => (
                              <span key={t} className="px-1.5 py-0.5 text-[9px] font-medium rounded-md bg-surface-100 dark:bg-white/[0.04] text-surface-400">{t}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Projects', value: template.projects.length, icon: LayoutDashboard, color: 'text-brand-500' },
                      { label: 'Tasks', value: template.projects.reduce((s, p) => s + p.tasks, 0), icon: Check, color: 'text-success-500' },
                      { label: 'Agents', value: template.agentsList.length, icon: Bot, color: 'text-intelligence-500' },
                      { label: 'Workflows', value: template.workflows.length, icon: Workflow, color: 'text-execution-500' },
                    ].map(s => {
                      const Icon = s.icon;
                      return (
                        <div key={s.label} className="p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
                          <Icon className={cn('w-4 h-4 mb-1', s.color)} />
                          <p className="text-lg font-bold text-surface-900 dark:text-white">{s.value}</p>
                          <p className="text-[10px] text-surface-400">{s.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Preview Tab */}
            {activeTab === 'preview' && (
              <div className="space-y-6">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-700 flex items-center justify-center border border-surface-200/50 dark:border-white/[0.06]">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-surface-200/50 dark:bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
                      <Eye className="w-10 h-10 text-surface-400" />
                    </div>
                    <p className="text-sm text-surface-500 dark:text-surface-400">Preview image coming soon</p>
                    <p className="text-xs text-surface-400 mt-1">Clone the template to see it in action</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {template.projects.map(p => (
                    <div key={p.name} className="apple-card p-4 text-center">
                      <LayoutDashboard className="w-6 h-6 text-brand-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{p.name}</p>
                      <p className="text-[10px] text-surface-400">{p.tasks} tasks</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workflows Tab */}
            {activeTab === 'workflows' && (
              <div className="space-y-4 max-w-3xl">
                {template.workflows.map((wf, i) => (
                  <div key={i} className="apple-card p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-execution-500 to-cyan-500 flex items-center justify-center shrink-0">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Trigger: {wf.trigger}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            {wf.actions.map((action, j) => (
                              <div key={j} className="flex items-center gap-1.5">
                                <div className="px-2 py-1 text-[10px] font-medium rounded-lg bg-surface-100/80 dark:bg-white/[0.06] text-surface-600 dark:text-surface-300 border border-surface-200/30 dark:border-white/[0.04] whitespace-nowrap">
                                  {action}
                                </div>
                                {j < wf.actions.length - 1 && <ChevronRight className="w-3 h-3 text-surface-400 shrink-0" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Templates */}
        <div>
          <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">More templates you might like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allTemplates.filter(t => t.id !== params.id).slice(0, 4).map(t => (
              <Link key={t.id} href={`/templates/${t.id}`} className="apple-card p-4 hover:ring-2 hover:ring-brand-500/20 transition-all group">
                <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3', t.color)}>
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-semibold text-surface-900 dark:text-white group-hover:text-brand-500 transition-colors">{t.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
