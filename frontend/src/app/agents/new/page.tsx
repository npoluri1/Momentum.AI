'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, Bot, Sparkles, Globe, Cpu, Database, Zap,
  Check, ChevronRight, Star, Search, Code, FileText,
  Image, Webhook, MessageSquare, Brain, Wand2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const providerOptions = [
  { value: 'openai', label: 'OpenAI', icon: Sparkles, desc: 'GPT-4o, GPT-4 Turbo' },
  { value: 'anthropic', label: 'Anthropic', icon: Globe, desc: 'Claude 3 Opus, Sonnet' },
  { value: 'gemini', label: 'Gemini', icon: Cpu, desc: 'Gemini Pro, Ultra' },
];

const modelByProvider: Record<string, { value: string; label: string }[]> = {
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ],
  anthropic: [
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
  ],
  gemini: [
    { value: 'gemini-pro', label: 'Gemini Pro' },
    { value: 'gemini-ultra', label: 'Gemini Ultra' },
  ],
};

const toolOptions = [
  { value: 'web_search', label: 'Web Search', icon: Globe, desc: 'Search the internet for information' },
  { value: 'code_interpreter', label: 'Code Interpreter', icon: Code, desc: 'Execute Python code' },
  { value: 'file_reader', label: 'File Reader', icon: FileText, desc: 'Read and analyze documents' },
  { value: 'image_gen', label: 'Image Generation', icon: Image, desc: 'Generate images from text' },
  { value: 'api_caller', label: 'API Caller', icon: Webhook, desc: 'Call external APIs' },
];

const agentTemplates = [
  { name: 'Sales Closer', desc: 'Handles inbound sales conversations and closes deals', category: 'Sales', model: 'gpt-4o', icon: Bot, color: 'from-rose-500 to-pink-600', popular: true },
  { name: 'Support Agent', desc: 'Resolves customer tickets with empathy and accuracy', category: 'Support', model: 'claude-3-sonnet', icon: MessageSquare, color: 'from-violet-500 to-purple-600', popular: true },
  { name: 'Lead Enricher', desc: 'Researches and enriches B2B leads with company data', category: 'Sales', model: 'gpt-4o', icon: Database, color: 'from-blue-500 to-cyan-600', popular: false },
  { name: 'Content Writer', desc: 'Generates SEO-optimized blog posts and articles', category: 'Marketing', model: 'gpt-4o', icon: FileText, color: 'from-emerald-500 to-teal-600', popular: true },
  { name: 'Code Reviewer', desc: 'Reviews pull requests and suggests improvements', category: 'Engineering', model: 'claude-3-sonnet', icon: Code, color: 'from-amber-500 to-orange-600', popular: false },
  { name: 'Data Analyst', desc: 'Analyzes datasets and generates visual reports', category: 'Data', model: 'gemini-pro', icon: Cpu, color: 'from-indigo-500 to-violet-600', popular: false },
];

const steps = ['Template', 'Configure', 'Tools', 'Review'];

export default function NewAgentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    provider: 'openai' as 'openai' | 'anthropic' | 'gemini',
    model: 'gpt-4o',
    systemPrompt: '',
    temperature: 0.7,
    tools: [] as string[],
    memory: false,
  });

  const models = modelByProvider[form.provider] || [];
  const ProviderIcon = providerOptions.find(p => p.value === form.provider)?.icon || Sparkles;

  const filteredTemplates = agentTemplates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTemplateSelect = (template: typeof agentTemplates[0]) => {
    setSelectedTemplate(template.name);
    setForm({
      ...form,
      name: template.name,
      description: template.desc,
      model: template.model,
    });
    setCurrentStep(1);
  };

  async function handleCreate() {
    if (!form.name.trim()) {
      toast.error('Agent name is required');
      return;
    }
    setSaving(true);
    try {
      const agent = await api.createAgent(form);
      toast.success('Agent created successfully!');
      router.push(`/agents/${agent.id}`);
    } catch {
      toast.error('Failed to create agent');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100/80 dark:hover:bg-white/[0.06] transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white tracking-tight">Create AI Agent</h1>
              <p className="text-sm text-surface-500 mt-0.5">Deploy a new intelligent agent for your workspace</p>
            </div>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-1">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-1 flex-1">
                <div className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-1 justify-center',
                  i === currentStep
                    ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
                    : i < currentStep
                      ? 'bg-success-500/10 text-success-500'
                      : 'bg-surface-100/50 dark:bg-white/[0.04] text-surface-400'
                )}>
                  {i < currentStep ? <Check className="w-3 h-3" /> : <span>{i + 1}</span>}
                  <span className="hidden sm:inline">{step}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn(
                    'flex-1 h-px',
                    i < currentStep ? 'bg-success-500/50' : 'bg-surface-200 dark:bg-white/[0.06]'
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Step 0: Template Selection */}
          {currentStep === 0 && (
            <div className="space-y-4 animate-fade-in">
              <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="apple-input pl-10"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.name}
                      onClick={() => handleTemplateSelect(template)}
                      className={cn(
                        'flex items-start gap-4 p-5 rounded-2xl border transition-all text-left group',
                        selectedTemplate === template.name
                          ? 'bg-brand-500/10 border-brand-500/30 ring-2 ring-brand-500/20'
                          : 'bg-white dark:bg-[#0a0a0f]/40 border-surface-200/50 dark:border-white/[0.06] hover:bg-surface-50 dark:hover:bg-white/[0.03] hover:border-surface-300 dark:hover:border-white/[0.1]'
                      )}
                    >
                      <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform', template.color)}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-surface-900 dark:text-white">{template.name}</h3>
                          {template.popular && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">Popular</span>
                          )}
                        </div>
                        <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2">{template.desc}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-medium text-surface-400 bg-surface-100/50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">{template.category}</span>
                          <span className="text-[10px] text-surface-400">{template.model}</span>
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        'w-4 h-4 mt-3 transition-all',
                        selectedTemplate === template.name ? 'text-brand-500' : 'text-surface-300 dark:text-surface-600 group-hover:text-surface-400'
                      )} />
                    </button>
                  );
                })}
              </div>
              <div className="text-center">
                <button
                  onClick={() => { setSelectedTemplate('custom'); setCurrentStep(1); }}
                  className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
                >
                  Or create from scratch →
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Configure */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="apple-card p-5">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1.5">Agent Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Market Researcher"
                      className="apple-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1.5">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={2}
                      className="apple-input resize-none"
                      placeholder="What does this agent do?"
                    />
                  </div>
                </div>
              </div>

              <div className="apple-card p-5">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Model Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  {providerOptions.map((p) => {
                    const Icon = p.icon;
                    const active = form.provider === p.value;
                    return (
                      <button
                        key={p.value}
                        onClick={() => setForm({ ...form, provider: p.value as 'openai' | 'anthropic' | 'gemini', model: modelByProvider[p.value]?.[0]?.value || 'gpt-4o' })}
                        className={cn(
                          'flex items-center gap-3 p-3.5 rounded-xl border transition-all',
                          active
                            ? 'bg-brand-500/10 border-brand-500/30'
                            : 'bg-surface-50/50 dark:bg-white/[0.02] border-surface-200/50 dark:border-white/[0.06] hover:bg-surface-100/50 dark:hover:bg-white/[0.04]'
                        )}
                      >
                        <Icon className={cn('w-5 h-5', active ? 'text-brand-500' : 'text-surface-400')} />
                        <div className="text-left">
                          <p className={cn('text-xs font-semibold', active ? 'text-brand-500' : 'text-surface-700 dark:text-surface-300')}>{p.label}</p>
                          <p className="text-[10px] text-surface-400">{p.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1.5">Model</label>
                    <select
                      value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      className="apple-input"
                    >
                      {models.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1.5">
                      Temperature: {form.temperature.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={form.temperature}
                      onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })}
                      className="w-full accent-brand-500 h-1.5 rounded-full appearance-none bg-surface-200 dark:bg-white/[0.08] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-surface-400 mt-1">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="apple-card p-5">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">System Prompt</h3>
                <textarea
                  value={form.systemPrompt}
                  onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
                  rows={5}
                  className="apple-input resize-none font-mono"
                  placeholder="You are a helpful AI assistant that..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Tools */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="apple-card p-5">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1">Tools</h3>
                <p className="text-xs text-surface-400 mb-4">Enable capabilities for your agent</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {toolOptions.map((tool) => {
                    const enabled = form.tools.includes(tool.value);
                    return (
                      <button
                        key={tool.value}
                        onClick={() => {
                          setForm({
                            ...form,
                            tools: enabled
                              ? form.tools.filter((t) => t !== tool.value)
                              : [...form.tools, tool.value],
                          });
                        }}
                        className={cn(
                          'flex items-start gap-3 p-4 rounded-xl border transition-all text-left',
                          enabled
                            ? 'bg-brand-500/10 border-brand-500/30'
                            : 'bg-surface-50/50 dark:bg-white/[0.02] border-surface-200/50 dark:border-white/[0.06] hover:bg-surface-100/50 dark:hover:bg-white/[0.04]'
                        )}
                      >
                        <div className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                          enabled ? 'bg-brand-500/20' : 'bg-surface-100 dark:bg-white/[0.06]'
                        )}>
                          <tool.icon className={cn('w-4 h-4', enabled ? 'text-brand-500' : 'text-surface-400')} />
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            'text-sm font-semibold',
                            enabled ? 'text-brand-500' : 'text-surface-700 dark:text-surface-300'
                          )}>{tool.label}</p>
                          <p className="text-xs text-surface-400 mt-0.5">{tool.desc}</p>
                        </div>
                        {enabled && <Check className="w-4 h-4 text-brand-500 mt-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="apple-card p-5">
                <div className="flex items-center gap-3">
                  <Database className={cn('w-5 h-5', form.memory ? 'text-brand-500' : 'text-surface-400')} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">Enable Memory</p>
                    <p className="text-xs text-surface-400">Agent remembers past conversations and context</p>
                  </div>
                  <button
                    onClick={() => setForm({ ...form, memory: !form.memory })}
                    className={cn(
                      'relative inline-flex h-6 w-11 rounded-full transition-colors border-2 border-transparent',
                      form.memory ? 'bg-brand-500' : 'bg-surface-300 dark:bg-white/[0.12]'
                    )}
                  >
                    <span className={cn(
                      'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                      form.memory ? 'translate-x-5' : 'translate-x-0'
                    )} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="apple-card p-6">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Review & Create</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-100/50 dark:border-white/[0.04]">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-intelligence-500 flex items-center justify-center shadow-sm">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-surface-900 dark:text-white">{form.name || 'Unnamed Agent'}</p>
                      <p className="text-xs text-surface-400">{form.description || 'No description'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Provider', value: form.provider },
                      { label: 'Model', value: form.model },
                      { label: 'Temperature', value: form.temperature.toFixed(1) },
                      { label: 'Memory', value: form.memory ? 'Enabled' : 'Disabled' },
                    ].map((item) => (
                      <div key={item.label} className="p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-100/50 dark:border-white/[0.04]">
                        <p className="text-[10px] font-medium text-surface-400 uppercase tracking-wider">{item.label}</p>
                        <p className="text-sm font-semibold text-surface-900 dark:text-white mt-0.5 capitalize">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {form.tools.length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium text-surface-400 uppercase tracking-wider mb-2">Tools ({form.tools.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.tools.map(t => (
                          <span key={t} className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-brand-500/10 text-brand-500 border border-brand-500/20">
                            {toolOptions.find(to => to.value === t)?.label || t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {form.systemPrompt && (
                    <div>
                      <p className="text-[10px] font-medium text-surface-400 uppercase tracking-wider mb-2">System Prompt</p>
                      <div className="p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-100/50 dark:border-white/[0.04]">
                        <p className="text-xs text-surface-600 dark:text-surface-400 font-mono line-clamp-3">{form.systemPrompt}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : router.back()}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
            >
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </button>
            <div className="flex items-center gap-3">
              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={currentStep === 1 && !form.name.trim()}
                  className={cn(
                    'px-5 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center gap-2',
                    form.name.trim() || currentStep !== 1
                      ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20'
                      : 'bg-surface-100 dark:bg-white/[0.04] text-surface-400 cursor-not-allowed'
                  )}
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleCreate}
                  disabled={saving || !form.name.trim()}
                  className={cn(
                    'px-5 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center gap-2',
                    form.name.trim()
                      ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20'
                      : 'bg-surface-100 dark:bg-white/[0.04] text-surface-400 cursor-not-allowed'
                  )}
                >
                  {saving ? (
                    <>Creating...</>
                  ) : (
                    <><Wand2 className="w-4 h-4" /> Create Agent</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
