'use client';

import { useState } from 'react';
import SiteNav from '@/components/layout/SiteNav';
import { cn } from '@/lib/utils';
import {
  Code2,
  BookOpen,
  ArrowRight,
  Github,
  MessageSquare,
  Globe,
  FileText,
  Terminal,
  Braces,
  Database,
  Webhook,
  Wrench,
  Key,
  Gauge,
  Zap,
  Sparkles,
  Star,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const sdkCards = [
  {
    name: 'Python SDK',
    icon: Braces,
    description: 'Build AI-powered applications with our native Python SDK. Full type hints and async support.',
    install: 'pip install momentum-ai',
    gradient: 'from-execution-500 to-brand-500',
  },
  {
    name: 'JavaScript/TypeScript SDK',
    icon: Code2,
    description: 'Integrate Momentum AI into your Node.js and browser applications with full TypeScript definitions.',
    install: 'npm install @momentum/sdk',
    gradient: 'from-warning-400 to-warning-500',
  },
  {
    name: 'REST API',
    icon: Globe,
    description: 'Full RESTful API for all Momentum AI resources. JSON-based with comprehensive documentation.',
    install: 'curl https://api.momentum.ai/v1/projects',
    gradient: 'from-memory-500 to-memory-600',
  },
  {
    name: 'GraphQL API',
    icon: Database,
    description: 'Flexible GraphQL API for complex queries and real-time subscriptions with schema stitching.',
    install: 'query { projects { id name tasks { title } } }',
    gradient: 'from-intelligence-500 to-intelligence-600',
  },
  {
    name: 'Webhooks',
    icon: Webhook,
    description: 'Receive real-time event notifications for projects, tasks, agents, and workflow changes.',
    install: 'POST /webhooks { "url": "https://example.com/hook" }',
    gradient: 'from-brand-500 to-intelligence-500',
  },
  {
    name: 'CLI Tool',
    icon: Terminal,
    description: 'Manage workspaces, deploy agents, and trigger workflows directly from your terminal.',
    install: 'npm install -g @momentum/cli',
    gradient: 'from-surface-700 to-surface-800',
  },
];

const gettingStarted = [
  {
    step: 1,
    title: 'Get API Key',
    description: 'Sign up and generate your API key from the developer dashboard.',
    icon: Key,
  },
  {
    step: 2,
    title: 'Install SDK',
    description: 'Choose your preferred SDK and install it with a single command.',
    icon: Terminal,
  },
  {
    step: 3,
    title: 'Make First Call',
    description: 'Authenticate and make your first API request to create a project.',
    icon: Code2,
  },
  {
    step: 4,
    title: 'Build Your App',
    description: 'Explore the docs and start building your integration.',
    icon: Zap,
  },
];

const endpoints = [
  { method: 'GET', path: '/v1/projects', description: 'List all projects' },
  { method: 'POST', path: '/v1/projects', description: 'Create a project' },
  { method: 'GET', path: '/v1/projects/{id}', description: 'Get project details' },
  { method: 'PUT', path: '/v1/projects/{id}', description: 'Update a project' },
  { method: 'DELETE', path: '/v1/projects/{id}', description: 'Delete a project' },
  { method: 'GET', path: '/v1/agents', description: 'List all AI agents' },
  { method: 'POST', path: '/v1/agents/{id}/run', description: 'Execute an agent' },
  { method: 'GET', path: '/v1/workflows', description: 'List all workflows' },
];

const webhookEvents = [
  'project.created', 'project.updated', 'project.deleted',
  'task.created', 'task.updated', 'task.completed',
  'agent.started', 'agent.completed', 'agent.error',
  'workflow.triggered', 'workflow.completed', 'workflow.failed',
];

export default function DevelopersPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);
  const [showAllEndpoints, setShowAllEndpoints] = useState(false);

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const selected = endpoints[selectedEndpoint];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />
      <div className="absolute inset-0 bg-gradient-to-b from-execution-50/60 to-white dark:from-execution-950/10 dark:to-[#0a0a0f] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-execution-500/10 to-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative">
        <section className="pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-execution-50 dark:bg-execution-500/10 border border-execution-200/50 dark:border-execution-500/20 text-sm font-medium text-execution-600 dark:text-execution-400 mb-6">
                <Code2 className="w-4 h-4" />
                Developer Platform
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                <span className="text-surface-900 dark:text-white">Build on Momentum AI</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8">
                Everything you need to integrate and extend the Momentum AI platform
              </p>
              <div className="flex items-center justify-center gap-3">
                <button className="px-6 py-3 text-sm font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/25 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  View Documentation
                </button>
                <button className="px-6 py-3 text-sm font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Get API Key
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-16">
              {[
                { label: 'Endpoints', value: '50+' },
                { label: 'SDKs', value: '6' },
                { label: 'Apps Built', value: '1,200+' },
                { label: 'API Uptime', value: '99.9%' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-4 text-center">
                  <div className="text-xl font-bold text-surface-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-surface-500 dark:text-surface-400">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
              {sdkCards.map((sdk, i) => {
                const Icon = sdk.icon;
                return (
                  <div
                    key={sdk.name}
                    className="group rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-6 transition-all hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-0.5"
                  >
                    <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-sm', sdk.gradient)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">{sdk.name}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">{sdk.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1 px-3 py-2 rounded-lg bg-surface-100 dark:bg-white/[0.06] font-mono text-xs text-surface-600 dark:text-surface-400 truncate">
                        {sdk.install}
                      </div>
                      <button
                        onClick={() => handleCopy(i, sdk.install)}
                        className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all"
                      >
                        {copiedIndex === i ? (
                          <Check className="w-4 h-4 text-memory-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-surface-400" />
                        )}
                      </button>
                    </div>
                    <button className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      View Docs
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
              <div className="space-y-6">
                <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-surface-100 dark:bg-white/[0.06]">
                      <Key className="w-5 h-5 text-brand-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-surface-900 dark:text-white">Authentication</h3>
                      <p className="text-xs text-surface-500 dark:text-surface-400">API Key or OAuth 2.0</p>
                    </div>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
                    All API requests require authentication via an API key in the Authorization header or OAuth 2.0 bearer token.
                  </p>
                  <div className="rounded-xl bg-surface-100 dark:bg-white/[0.06] p-4 font-mono text-xs">
                    <div className="text-surface-500 dark:text-surface-500 mb-2">// Authorization header</div>
                    <div className="text-surface-800 dark:text-surface-200">Authorization: Bearer tk_key_xxxxxxxxxxxx</div>
                    <div className="text-surface-500 dark:text-surface-500 my-2">// Or with OAuth 2.0</div>
                    <div className="text-surface-800 dark:text-surface-200">Authorization: Bearer ya29.a0AfH6SMC...</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-surface-100 dark:bg-white/[0.06]">
                      <Gauge className="w-5 h-5 text-warning-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-surface-900 dark:text-white">Rate Limiting</h3>
                      <p className="text-xs text-surface-500 dark:text-surface-400">Fair usage guarantees</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-white/[0.04]">
                      <span className="text-sm text-surface-600 dark:text-surface-400">Standard plan</span>
                      <span className="text-sm font-semibold text-surface-900 dark:text-white">1,000 req/min</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-white/[0.04]">
                      <span className="text-sm text-surface-600 dark:text-surface-400">Enterprise plan</span>
                      <span className="text-sm font-semibold text-surface-900 dark:text-white">5,000 req/min</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-surface-100 dark:bg-white/[0.06]">
                      <Webhook className="w-5 h-5 text-intelligence-500" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-surface-900 dark:text-white">Webhooks</h3>
                      <p className="text-xs text-surface-500 dark:text-surface-400">Event-driven integration</p>
                    </div>
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
                    Receive real-time HTTP callbacks when events happen in your workspace. Configure endpoints per event type with retry and signing.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {webhookEvents.map((evt) => (
                      <span key={evt} className="px-2 py-1 text-[10px] font-mono rounded-md bg-surface-100 dark:bg-white/[0.06] text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-white/[0.06]">
                        {evt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-surface-100 dark:bg-white/[0.06]">
                    <Terminal className="w-5 h-5 text-memory-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-surface-900 dark:text-white">API Playground</h3>
                    <p className="text-xs text-surface-500 dark:text-surface-400">Test endpoints in real time</p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4">
                  {(showAllEndpoints ? endpoints : endpoints.slice(0, 4)).map((ep, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedEndpoint(i)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm transition-all',
                        selectedEndpoint === i
                          ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400'
                          : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-white/[0.04]'
                      )}
                    >
                      <span className={cn(
                        'px-1.5 py-0.5 text-[10px] font-bold rounded font-mono',
                        ep.method === 'GET' && 'text-memory-500 bg-memory-500/10',
                        ep.method === 'POST' && 'text-execution-500 bg-execution-500/10',
                        ep.method === 'PUT' && 'text-warning-500 bg-warning-500/10',
                        ep.method === 'DELETE' && 'text-brand-500 bg-brand-500/10',
                      )}>
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs truncate">{ep.path}</span>
                    </button>
                  ))}
                  {endpoints.length > 4 && (
                    <button
                      onClick={() => setShowAllEndpoints(!showAllEndpoints)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-all"
                    >
                      {showAllEndpoints ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      {showAllEndpoints ? 'Show less' : 'Show all endpoints'}
                    </button>
                  )}
                </div>

                <div className="rounded-xl bg-surface-900 dark:bg-[#0a0a0f] p-4 font-mono text-xs">
                  <div className="text-gray-500 mb-2">// curl example</div>
                  <div className="text-white/90">curl -X {selected.method} \</div>
                  <div className="text-white/90 pl-4">https://api.momentum.ai{selected.path} \</div>
                  <div className="text-white/90 pl-4">-H &quot;Authorization: Bearer tk_key_xxxx&quot;</div>
                  <div className="text-gray-500 mt-2">// Response</div>
                  <div className="text-memory-400">{'{'}</div>
                  <div className="text-memory-400 pl-4">&quot;data&quot;: [{'{ ... }'}]</div>
                  <div className="text-memory-400">{'}'}</div>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6">Getting Started</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {gettingStarted.map((step) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={step.step} className="relative rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-5">
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-brand-500 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-brand-500/25">
                        {step.step}
                      </div>
                      <div className="pt-3">
                        <StepIcon className="w-6 h-6 text-brand-500 mb-3" />
                        <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">{step.title}</h3>
                        <p className="text-sm text-surface-500 dark:text-surface-400">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-16">
              <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-8 text-center">
                <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">Join the Developer Community</h2>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 max-w-lg mx-auto">
                  Connect with other developers building on Momentum AI. Share ideas, ask questions, and contribute.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-surface-900 dark:bg-white text-white dark:text-surface-900 hover:bg-surface-800 dark:hover:bg-surface-200 transition-all">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                  <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all">
                    <MessageSquare className="w-4 h-4" /> Discord
                  </a>
                  <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all">
                    <Globe className="w-4 h-4" /> Stack Overflow
                  </a>
                  <a href="#" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all">
                    <FileText className="w-4 h-4" /> Developer Blog
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center pb-16">
              <div className="inline-block p-10 md:p-14 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden max-w-2xl mx-auto w-full">
                <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
                <div className="relative">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Ready to build?</h2>
                  <p className="text-brand-100 mb-6 max-w-sm mx-auto">Get your API key and start building with Momentum AI today.</p>
                  <button className="px-8 py-3 text-sm font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2 mx-auto">
                    <Zap className="w-4 h-4" />
                    Start Building
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
