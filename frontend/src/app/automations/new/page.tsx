'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, Workflow, Play, Zap, Webhook, Calendar,
  Plus, Trash2, Sparkles, Check, Search, ChevronRight,
  Mail, MessageCircle, FileText, Code, Activity, GitBranch,
  Wand2, Star, Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

const triggerOptions = [
  { value: 'webhook', label: 'Webhook', icon: Webhook, desc: 'HTTP endpoint trigger', color: 'from-blue-500 to-cyan-500' },
  { value: 'schedule', label: 'Schedule', icon: Calendar, desc: 'Run on a schedule (cron)', color: 'from-violet-500 to-purple-500' },
  { value: 'event', label: 'Event', icon: Zap, desc: 'System event trigger', color: 'from-amber-500 to-orange-500' },
];

const actionOptions = [
  { value: 'send_email', label: 'Send Email', icon: Mail, color: 'text-rose-500', grad: 'from-rose-500 to-pink-500' },
  { value: 'create_task', label: 'Create Task', icon: FileText, color: 'text-blue-500', grad: 'from-blue-500 to-cyan-500' },
  { value: 'update_status', label: 'Update Status', icon: Activity, color: 'text-emerald-500', grad: 'from-emerald-500 to-teal-500' },
  { value: 'send_webhook', label: 'Send Webhook', icon: Webhook, color: 'text-cyan-500', grad: 'from-cyan-500 to-sky-500' },
  { value: 'notify_slack', label: 'Notify Slack', icon: MessageCircle, color: 'text-violet-500', grad: 'from-violet-500 to-purple-500' },
  { value: 'call_api', label: 'Call API', icon: Code, color: 'text-amber-500', grad: 'from-amber-500 to-orange-500' },
];

const workflowTemplates = [
  { name: 'Lead Email Outreach', desc: 'Auto-send emails when new leads are created', trigger: 'New CRM Lead', steps: 3, icon: Mail, color: 'from-rose-500 to-pink-600', popular: true },
  { name: 'Slack Notifications', desc: 'Notify Slack when deals change stage', trigger: 'Deal Stage Change', steps: 2, icon: MessageCircle, color: 'from-violet-500 to-purple-600', popular: true },
  { name: 'Welcome Email Series', desc: 'Send welcome emails to new users', trigger: 'User Signup', steps: 4, icon: Mail, color: 'from-emerald-500 to-teal-600', popular: false },
  { name: 'Daily Data Sync', desc: 'Sync data between apps daily', trigger: 'Daily Schedule', steps: 5, icon: GitBranch, color: 'from-blue-500 to-cyan-600', popular: false },
  { name: 'Code Review Reminder', desc: 'Remind about open PRs', trigger: 'PR Open > 4h', steps: 2, icon: Code, color: 'from-amber-500 to-orange-600', popular: false },
  { name: 'Invoice Generator', desc: 'Generate invoices on deal close', trigger: 'Deal Closed Won', steps: 4, icon: FileText, color: 'from-indigo-500 to-violet-600', popular: false },
];

const steps = ['Template', 'Trigger', 'Actions', 'Review'];

export default function NewWorkflowPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    triggerType: 'webhook' as 'webhook' | 'schedule' | 'event',
  });

  const [stepsList, setStepsList] = useState([
    { id: '1', action: 'send_email' },
  ]);

  const filteredTemplates = workflowTemplates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTemplateSelect = (template: typeof workflowTemplates[0]) => {
    setSelectedTemplate(template.name);
    setForm({
      ...form,
      name: template.name,
      description: template.desc,
    });
    setCurrentStep(1);
  };

  const addStep = () => {
    setStepsList(prev => [...prev, { id: Date.now().toString(), action: 'send_email' }]);
  };

  const removeStep = (id: string) => {
    if (stepsList.length <= 1) return;
    setStepsList(prev => prev.filter(s => s.id !== id));
  };

  const updateStepAction = (id: string, action: string) => {
    setStepsList(prev => prev.map(s => s.id === id ? { ...s, action } : s));
  };

  async function handleCreate() {
    if (!form.name.trim()) {
      toast.error('Workflow name is required');
      return;
    }
    setSaving(true);
    try {
      const workflowData = {
        name: form.name,
        description: form.description,
        trigger: { type: form.triggerType, config: {} },
        steps: stepsList.map((s, i) => ({ id: s.id, action: s.action, config: {}, order: i + 1 })),
      };
      const workflow = await api.createWorkflow(workflowData);
      toast.success('Workflow created successfully!');
      router.push(`/automations/${workflow.id}`);
    } catch {
      toast.error('Failed to create workflow');
    } finally {
      setSaving(false);
    }
  }

  const selectedTrigger = triggerOptions.find(t => t.value === form.triggerType);

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
              <h1 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white tracking-tight">Create Workflow</h1>
              <p className="text-sm text-surface-500 mt-0.5">Automate your workspace with intelligent workflows</p>
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
                  placeholder="Search workflow templates..."
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
                      <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-sm shrink-0', template.color)}>
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
                          <span className="text-[10px] text-surface-400 bg-surface-100/50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">{template.steps} steps</span>
                          <span className="text-[10px] text-surface-400">Trigger: {template.trigger}</span>
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        'w-4 h-4 mt-3',
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
                  Or build from scratch →
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Trigger */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="apple-card p-5">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1.5">Workflow Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Lead Email Outreach"
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
                      placeholder="What does this workflow do?"
                    />
                  </div>
                </div>
              </div>

              <div className="apple-card p-5">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Choose Trigger</h3>
                <div className="grid grid-cols-3 gap-3">
                  {triggerOptions.map((t) => {
                    const Icon = t.icon;
                    const active = form.triggerType === t.value;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setForm({ ...form, triggerType: t.value as 'webhook' | 'schedule' | 'event' })}
                        className={cn(
                          'flex flex-col items-center gap-2.5 p-5 rounded-xl border transition-all',
                          active
                            ? 'bg-brand-500/10 border-brand-500/30 ring-2 ring-brand-500/20'
                            : 'bg-surface-50/50 dark:bg-white/[0.02] border-surface-200/50 dark:border-white/[0.06] hover:bg-surface-100/50 dark:hover:bg-white/[0.04]'
                        )}
                      >
                        <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm', t.color)}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-center">
                          <p className={cn('text-sm font-semibold', active ? 'text-brand-500' : 'text-surface-700 dark:text-surface-300')}>{t.label}</p>
                          <p className="text-[10px] text-surface-400 mt-0.5">{t.desc}</p>
                        </div>
                        {active && <Check className="w-4 h-4 text-brand-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Actions */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="apple-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Actions</h3>
                    <p className="text-xs text-surface-400 mt-0.5">Define what happens when triggered</p>
                  </div>
                  <button
                    onClick={addStep}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-500/10 text-brand-500 border border-brand-500/20 hover:bg-brand-500/20 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Step
                  </button>
                </div>

                {/* Pipeline visualization */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto py-3 scrollbar-hide">
                  {/* Trigger pill */}
                  <div className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border-2 border-brand-500/30 bg-brand-500/5 min-w-[100px]">
                    {selectedTrigger && (
                      <>
                        <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-sm', selectedTrigger.color)}>
                          <selectedTrigger.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-semibold text-brand-500">{selectedTrigger.label}</span>
                      </>
                    )}
                  </div>

                  {stepsList.map((step, i) => {
                    const actionDef = actionOptions.find(a => a.value === step.action);
                    const ActionIcon = actionDef?.icon || Zap;
                    return (
                      <div key={step.id} className="flex items-center gap-2">
                        <ChevronRightIcon />
                        <div className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 min-w-[100px] group hover:border-brand-500/30 transition-all">
                          {ActionIcon && <ActionIcon className={cn('w-5 h-5', actionDef?.color || 'text-surface-400')} />}
                          <span className="text-[10px] font-medium text-surface-500">{i + 1}</span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex items-center gap-2">
                    <ChevronRightIcon />
                    <button onClick={addStep} className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border-2 border-dashed border-surface-300 dark:border-surface-600 text-surface-400 hover:border-brand-500/50 hover:text-brand-500 transition-all min-w-[100px]">
                      <Plus className="w-5 h-5" />
                      <span className="text-[10px]">Add</span>
                    </button>
                  </div>
                </div>

                {/* Step list */}
                <div className="space-y-2">
                  {stepsList.map((step, i) => {
                    const actionDef = actionOptions.find(a => a.value === step.action);
                    const ActionIcon = actionDef?.icon || Zap;
                    return (
                      <div
                        key={step.id}
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04] hover:border-surface-300/50 dark:hover:border-white/[0.08] transition-all group"
                      >
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-surface-200/50 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <select
                            value={step.action}
                            onChange={(e) => updateStepAction(step.id, e.target.value)}
                            className="w-full text-sm bg-transparent text-surface-700 dark:text-surface-300 border border-surface-200/50 dark:border-white/[0.06] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500/30"
                          >
                            {actionOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => removeStep(step.id)}
                          className="p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-500/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
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
                    <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-sm', selectedTrigger?.color || 'from-surface-500 to-surface-600')}>
                      {selectedTrigger && <selectedTrigger.icon className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-surface-900 dark:text-white">{form.name || 'Unnamed Workflow'}</p>
                      <p className="text-xs text-surface-400">{form.description || 'No description'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-100/50 dark:border-white/[0.04]">
                      <p className="text-[10px] font-medium text-surface-400 uppercase tracking-wider">Trigger</p>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white mt-0.5 capitalize">{form.triggerType}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-100/50 dark:border-white/[0.04]">
                      <p className="text-[10px] font-medium text-surface-400 uppercase tracking-wider">Steps</p>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white mt-0.5">{stepsList.length}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-100/50 dark:border-white/[0.04]">
                      <p className="text-[10px] font-medium text-surface-400 uppercase tracking-wider">Status</p>
                      <p className="text-sm font-semibold text-success-500 mt-0.5">Ready to create</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-medium text-surface-400 uppercase tracking-wider mb-2">Workflow Actions</p>
                    <div className="flex items-center gap-2">
                      {stepsList.map((s, i) => {
                        const actionDef = actionOptions.find(a => a.value === s.action);
                        return (
                          <div key={s.id} className="flex items-center gap-2">
                            <span className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-brand-500/10 text-brand-500 border border-brand-500/20 capitalize">
                              {actionDef?.label || s.action.replace('_', ' ')}
                            </span>
                            {i < stepsList.length - 1 && (
                              <ChevronRight className="w-3 h-3 text-surface-300 dark:text-surface-600" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
                    <><Wand2 className="w-4 h-4" /> Create Workflow</>
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

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-surface-300 dark:text-surface-600">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
