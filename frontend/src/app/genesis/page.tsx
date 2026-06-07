'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Sparkles, Bot, Workflow, Zap, ArrowRight, Copy,
  Check, Globe, ShoppingCart, LayoutDashboard, Users,
  MessageSquare, Code, Palette, FileText, BarChart3,
  Home, RefreshCw, X, Play,
  ChevronRight, Clock,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const domains = [
  { value: 'crm', label: 'CRM & Sales', icon: Users, desc: 'Customer relationships, deals, and pipeline' },
  { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'KPI tracking, analytics, and reporting' },
  { value: 'portal', label: 'Client Portal', icon: Globe, desc: 'Customer-facing portal with sign-in' },
  { value: 'ecommerce', label: 'E-Commerce', icon: ShoppingCart, desc: 'Online store with Stripe checkout' },
  { value: 'workflow', label: 'Workflow', icon: Workflow, desc: 'Process automation and task management' },
  { value: 'website', label: 'Website', icon: Globe, desc: 'Landing pages and documentation' },
  { value: 'agent', label: 'AI Agent', icon: Bot, desc: 'Custom AI assistant with tools' },
  { value: 'forms', label: 'Forms & Data', icon: FileText, desc: 'Data collection with triggers' },
];

const generatedApps = [
  { name: 'E-Commerce Analytics Dashboard', prompt: 'A React dashboard with real-time sales data, inventory tracking, and AI-powered forecasting', domain: 'dashboard', agents: 2, flows: 3, status: 'ready' },
  { name: 'Customer Support Portal', prompt: 'Multi-agent customer support system with RAG, ticket management, and live chat', domain: 'portal', agents: 3, flows: 5, status: 'ready' },
  { name: 'Sales Pipeline CRM', prompt: 'Complete CRM with lead scoring, deal stages, email sequences, and revenue forecasting', domain: 'crm', agents: 2, flows: 4, status: 'generating' },
];

export default function GenesisPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('dashboard');
  const [generating, setGenerating] = useState(false);
  const [activeStep, setActiveStep] = useState<'describe' | 'generate' | 'preview'>('describe');
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Describe what you want to build');
      return;
    }
    setGenerating(true);
    setActiveStep('generate');
    setProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 200));
    }
    setGenerating(false);
    setActiveStep('preview');
    toast.success('App generated successfully!');
  };

  const handleClone = (name: string) => {
    toast.success(`"${name}" cloned to your workspace!`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-500/10 to-intelligence-500/10 border border-brand-500/20 text-xs font-medium text-brand-600 dark:text-brand-400 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered App Builder
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-surface-900 dark:text-white tracking-tight mb-3">
            Describe. Generate. Launch.
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 max-w-xl mx-auto leading-relaxed">
            Describe your idea in plain English. AI builds a complete workspace with projects, agents, and workflows — ready to use in seconds.
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { key: 'describe', label: 'Describe', icon: Sparkles },
            { key: 'generate', label: 'Generate', icon: Bot },
            { key: 'preview', label: 'Launch', icon: Rocket },
          ].map((step, i) => {
            const isActive = activeStep === step.key;
            const isDone = ['generate', 'preview'].indexOf(activeStep) > ['describe', 'generate', 'launch'].indexOf(step.key);
            return (
              <div key={step.key} className="flex items-center gap-2">
                <div className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                  isActive ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/25' :
                  isDone ? 'bg-success-500 text-white' :
                  'bg-surface-100 dark:bg-white/[0.06] text-surface-400'
                )}>
                  {isDone ? <Check className="w-3 h-3" /> : <step.icon className="w-3 h-3" />}
                  {step.label}
                </div>
                {i < 2 && <ChevronRight className="w-3.5 h-3.5 text-surface-300" />}
              </div>
            );
          })}
        </div>

        {/* Step: Describe */}
        {activeStep === 'describe' && (
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="apple-card p-6">
              <label className="block text-sm font-semibold text-surface-900 dark:text-white mb-2">What do you want to build?</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your app in plain English...&#10;&#10;Example: 'Build me a CRM dashboard for my sales team with AI-powered lead scoring, deal pipeline tracking, automated email sequences, and a customer portal with Stripe checkout.'"
                rows={5}
                className="w-full bg-surface-50/50 dark:bg-white/[0.04] border border-surface-200/50 dark:border-white/[0.06] rounded-xl px-4 py-3 text-sm text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 text-xs text-surface-400">
                  <Clock className="w-3 h-3" />
                  Takes ~30 seconds
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  className="apple-button-primary"
                >
                  <Sparkles className="w-4 h-4" /> Generate App
                </button>
              </div>
            </div>

            {/* Domain Selection */}
            <div>
              <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">Choose a domain (optional)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {domains.map(d => {
                  const Icon = d.icon;
                  const isSelected = selectedDomain === d.value;
                  return (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDomain(d.value)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left',
                        isSelected
                          ? 'border-brand-500 bg-brand-500/5'
                          : 'border-surface-200/50 dark:border-white/[0.06] hover:border-surface-300 dark:hover:border-white/[0.12]'
                      )}
                    >
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', isSelected ? 'bg-brand-500/10 text-brand-500' : 'bg-surface-100 dark:bg-white/[0.04] text-surface-400')}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-surface-900 dark:text-white">{d.label}</p>
                        <p className="text-[10px] text-surface-400 truncate">{d.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Example Prompts */}
            <div className="apple-card p-4">
              <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">Try an example</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'E-Commerce Analytics Dashboard with real-time sales, inventory, and AI forecasting',
                  'Customer Support Portal with RAG, ticket management, and AI agents',
                  'Sales Pipeline CRM with lead scoring, email sequences, and revenue tracking',
                  'Client Portal with project tracking, file sharing, and Stripe payments',
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(example)}
                    className="text-xs text-left px-3 py-2.5 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04] text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100/50 dark:hover:bg-white/[0.06] transition-all"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step: Generating */}
        {activeStep === 'generate' && (
          <div className="apple-card p-10 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-intelligence-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/20">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Generating Your App</h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-8 max-w-md mx-auto">
              AI is building your workspace structure, configuring agents, setting up workflows, and deploying everything...
            </p>
            <div className="max-w-md mx-auto space-y-4">
              <div className="h-2 rounded-full bg-surface-200 dark:bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-500 via-intelligence-500 to-execution-500 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs text-surface-400">
                <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Building workspace...</span>
                <span className="font-mono">{progress}%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-8">
              {[
                { label: 'Projects', value: '4', desc: 'Workspace structure' },
                { label: 'Agents', value: '2', desc: 'AI configuration' },
                { label: 'Workflows', value: '3', desc: 'Automation setup' },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
                  <p className="text-xl font-bold text-surface-900 dark:text-white">{s.value}</p>
                  <p className="text-[10px] text-surface-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step: Preview */}
        {activeStep === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-success-50 dark:bg-success-500/10 border border-success-200/50 dark:border-success-500/20">
              <div className="w-10 h-10 rounded-xl bg-success-500/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-success-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-success-700 dark:text-success-400">App generated successfully!</p>
                <p className="text-xs text-success-600/70 dark:text-success-500/70">Your workspace is ready with projects, agents, and workflows configured.</p>
              </div>
              <button onClick={() => { toast.success('Opening workspace...'); }} className="apple-button-primary">
                <Play className="w-4 h-4" /> Open Workspace
              </button>
            </div>

            <div className="grid gap-4">
              {generatedApps.slice(0, 1).map(app => (
                <div key={app.name} className="apple-card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-surface-900 dark:text-white">{app.name}</h3>
                      <p className="text-xs text-surface-500 mt-1 max-w-xl">{app.prompt}</p>
                    </div>
                    <button onClick={() => handleClone(app.name)} className="apple-button-primary"><Copy className="w-4 h-4" /> Clone</button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-surface-400">
                    <span className="flex items-center gap-1"><Bot className="w-3.5 h-3.5" />{app.agents} agents</span>
                    <span className="w-1 h-1 rounded-full bg-surface-300" />
                    <span className="flex items-center gap-1"><Workflow className="w-3.5 h-3.5" />{app.flows} workflows</span>
                    <span className="w-1 h-1 rounded-full bg-surface-300" />
                    <span className="flex items-center gap-1 text-success-500"><Check className="w-3.5 h-3.5" />Ready to use</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="apple-card p-5">
              <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-3">Included Components</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: LayoutDashboard, label: 'Dashboard', desc: 'Analytics overview' },
                  { icon: Users, label: 'CRM Pipeline', desc: 'Deal tracking' },
                  { icon: Bot, label: 'AI Agents', desc: '2 configured' },
                  { icon: Workflow, label: 'Workflows', desc: '3 automations' },
                ].map(comp => {
                  const Icon = comp.icon;
                  return (
                    <div key={comp.label} className="p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
                      <Icon className="w-5 h-5 text-brand-500 mb-2" />
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{comp.label}</p>
                      <p className="text-[10px] text-surface-400">{comp.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Recent Generations */}
        {activeStep !== 'generate' && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">Recently Generated</h2>
            <div className="space-y-2">
              {generatedApps.map((app, i) => (
                <div key={app.name} className="flex items-center justify-between p-4 rounded-xl border border-surface-200/50 dark:border-white/[0.06] hover:border-brand-500/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      i === 0 ? 'bg-brand-500/10 text-brand-500' : 'bg-surface-100 dark:bg-white/[0.04] text-surface-400'
                    )}>
                      <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{app.name}</p>
                      <p className="text-[10px] text-surface-400">{app.domain} · {app.agents} agents · {app.flows} flows</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.status === 'generating' ? (
                      <span className="text-xs text-warning-500 flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Generating...</span>
                    ) : (
                      <button onClick={() => handleClone(app.name)} className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1">
                        <Copy className="w-3 h-3" /> Clone
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Rocket(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}
