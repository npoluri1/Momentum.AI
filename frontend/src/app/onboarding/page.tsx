'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap, Sparkles, ArrowRight, Check, ChevronRight,
  Code, Briefcase, Palette, GraduationCap, Heart,
  Building, Users, Mail, Plus, X, Rocket,
  LayoutDashboard, Bot, Workflow, CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const steps = [
  { id: 'welcome', label: 'Welcome', icon: Sparkles },
  { id: 'role', label: 'Your Role', icon: Briefcase },
  { id: 'workspace', label: 'Workspace', icon: Building },
  { id: 'templates', label: 'Templates', icon: LayoutDashboard },
  { id: 'invite', label: 'Invite Team', icon: Users },
  { id: 'complete', label: 'Ready', icon: Rocket },
];

const roles = [
  { id: 'developer', label: 'Developer / Engineer', icon: Code, desc: 'Build and ship software' },
  { id: 'designer', label: 'Designer', icon: Palette, desc: 'Create beautiful experiences' },
  { id: 'product', label: 'Product Manager', icon: Briefcase, desc: 'Plan and manage features' },
  { id: 'marketing', label: 'Marketing', icon: Heart, desc: 'Grow the business' },
  { id: 'founder', label: 'Founder / CEO', icon: Building, desc: 'Run the company' },
  { id: 'other', label: 'Other', icon: GraduationCap, desc: 'Something else' },
];

const teamSizes = [
  { id: '1', label: 'Just me' },
  { id: '2-5', label: '2-5 people' },
  { id: '6-20', label: '6-20 people' },
  { id: '21-50', label: '21-50 people' },
  { id: '50+', label: '50+ people' },
];

const useCases = [
  { id: 'project', label: 'Project Management' },
  { id: 'crm', label: 'CRM & Sales' },
  { id: 'content', label: 'Content Creation' },
  { id: 'support', label: 'Customer Support' },
  { id: 'ops', label: 'Operations' },
  { id: 'other', label: 'Other' },
];

const templates = [
  { id: 'sales-pipeline', name: 'Sales Pipeline', desc: 'Track deals through every stage with AI lead scoring', icon: LayoutDashboard, gradient: 'from-violet-500 to-purple-600', agents: 2, automations: 3 },
  { id: 'crm-dashboard', name: 'CRM Dashboard', desc: 'Complete customer relationship system with Kanban pipeline', icon: Users, gradient: 'from-blue-500 to-cyan-600', agents: 1, automations: 4 },
  { id: 'project-tracker', name: 'Project Tracker', desc: 'Tasks, milestones, Gantt charts, and AI project assistants', icon: Workflow, gradient: 'from-emerald-500 to-teal-600', agents: 1, automations: 2 },
  { id: 'content-studio', name: 'Content Studio', desc: 'AI-powered content calendar with auto-generation', icon: Bot, gradient: 'from-amber-500 to-orange-600', agents: 3, automations: 5 },
  { id: 'customer-portal', name: 'Customer Portal', desc: 'Self-service portal with ticket tracking and knowledge base', icon: Heart, gradient: 'from-rose-500 to-pink-600', agents: 2, automations: 6 },
  { id: 'analytics-hub', name: 'Analytics Hub', desc: 'Live dashboards with AI-powered insights and reporting', icon: LayoutDashboard, gradient: 'from-indigo-500 to-violet-600', agents: 1, automations: 3 },
  { id: 'employee-onboarding', name: 'Employee Onboarding', desc: 'Automated onboarding with task checklists and HR workflows', icon: Users, gradient: 'from-sky-500 to-blue-600', agents: 1, automations: 4 },
  { id: 'kickstart-blank', name: 'Kickstart Blank', desc: 'Start from scratch with a clean workspace', icon: Sparkles, gradient: 'from-surface-500 to-surface-600', agents: 0, automations: 0 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [role, setRole] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [useCase, setUseCase] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [inviteInput, setInviteInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const addInviteEmail = () => {
    const email = inviteInput.trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !inviteEmails.includes(email)) {
      setInviteEmails([...inviteEmails, email]);
      setInviteInput('');
    }
  };

  const removeInviteEmail = (email: string) => {
    setInviteEmails(inviteEmails.filter(e => e !== email));
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      toast.success('Workspace ready! 🚀');
      router.push('/workspace/dashboard');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return !!role;
      case 2: return workspaceName.length >= 2;
      case 3: return !!selectedTemplate;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const progress = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-surface-900 dark:text-white">momentum ai</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-surface-400">
            Step {currentStep + 1} of {steps.length}
          </span>
          <button
            onClick={() => router.push('/workspace/dashboard')}
            className="text-xs font-medium text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 px-3 py-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all"
          >
            Skip {currentStep < steps.length - 1 && '→'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-surface-100 dark:bg-white/[0.06]">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl animate-fade-in">
          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-0 mb-10">
            {steps.map((step, i) => {
              const isActive = i === currentStep;
              const isDone = i < currentStep;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                    isActive && 'bg-brand-500/10 text-brand-500',
                    isDone && 'bg-memory-500/10 text-memory-500',
                    !isActive && !isDone && 'text-surface-400'
                  )}>
                    <div className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold',
                      isActive && 'bg-brand-500 text-white',
                      isDone && 'bg-memory-500 text-white',
                      !isActive && !isDone && 'bg-surface-200 dark:bg-white/[0.08] text-surface-400'
                    )}>
                      {isDone ? <Check className="w-3 h-3" /> : i + 1}
                    </div>
                    <span className="hidden sm:inline">{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn(
                      'w-6 h-px mx-1',
                      isDone ? 'bg-memory-500' : 'bg-surface-200 dark:bg-white/[0.08]'
                    )} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 via-intelligence-500 to-execution-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-500/20">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Welcome to Momentum AI
              </h1>
              <p className="text-base text-surface-500 dark:text-surface-400 max-w-lg mx-auto mb-8 leading-relaxed">
                Let&apos;s set up your workspace in just a few steps. You&apos;ll have AI agents,
                automations, and projects running in minutes.
              </p>
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
                {[
                  { icon: Bot, label: 'AI Agents', desc: 'Deploy AI team members' },
                  { icon: Workflow, label: 'Automations', desc: 'Run 24/7 workflows' },
                  { icon: LayoutDashboard, label: 'Projects', desc: 'Manage with ease' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="p-4 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
                      <Icon className="w-6 h-6 text-brand-500 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-surface-900 dark:text-white">{item.label}</p>
                      <p className="text-[10px] text-surface-400 mt-0.5">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 1: Role Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2 text-center">What do you do?</h2>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 text-center">Help us tailor Momentum AI to your needs.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const selected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-2xl border text-left transition-all',
                        selected
                          ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                          : 'border-surface-200 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03]'
                      )}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                        selected ? 'bg-brand-500 text-white' : 'bg-surface-100 dark:bg-white/[0.06] text-surface-500'
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-surface-900 dark:text-white">{r.label}</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">{r.desc}</p>
                      </div>
                      {selected && <Check className="w-5 h-5 text-brand-500 shrink-0 ml-auto" />}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6">
                <p className="text-xs font-medium text-surface-500 mb-2">Team size</p>
                <div className="flex flex-wrap gap-2">
                  {teamSizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setTeamSize(s.id)}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-full transition-all',
                        teamSize === s.id
                          ? 'bg-surface-900 dark:bg-white text-white dark:text-surface-900 shadow-md'
                          : 'bg-surface-100/80 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 hover:bg-surface-200/50 dark:hover:bg-white/[0.1]'
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium text-surface-500 mb-2">Primary use case</p>
                <div className="flex flex-wrap gap-2">
                  {useCases.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setUseCase(u.id)}
                      className={cn(
                        'px-4 py-2 text-sm font-medium rounded-full transition-all',
                        useCase === u.id
                          ? 'bg-surface-900 dark:bg-white text-white dark:text-surface-900 shadow-md'
                          : 'bg-surface-100/80 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 hover:bg-surface-200/50 dark:hover:bg-white/[0.1]'
                      )}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Workspace Setup */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2 text-center">Name your workspace</h2>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 text-center">Give your workspace a name that reflects your team or project.</p>
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Workspace Name</label>
                  <input
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="e.g. Acme Corp, My Startup, Design Team"
                    className="w-full px-4 py-3 text-base rounded-2xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800/50 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
                    autoFocus
                  />
                </div>
                {workspaceName && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-500/5 to-intelligence-500/5 border border-brand-500/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-surface-900 dark:text-white">{workspaceName}</span>
                    </div>
                    <p className="text-xs text-surface-500">Your workspace will be created with projects, AI agents, and automations ready to go.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Template Selection */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2 text-center">Choose a starting template</h2>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 text-center">Pick a pre-built workspace to get started faster.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
                {templates.map((t) => {
                  const Icon = t.icon;
                  const selected = selectedTemplate === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTemplate(t.id)}
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-2xl border text-left transition-all',
                        selected
                          ? 'border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20'
                          : 'border-surface-200 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03]'
                      )}
                    >
                      <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0', t.gradient)}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-surface-900 dark:text-white">{t.name}</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 line-clamp-1">{t.desc}</p>
                        {(t.agents > 0 || t.automations > 0) && (
                          <div className="flex items-center gap-2 mt-1.5">
                            {t.agents > 0 && <span className="text-[10px] text-surface-400">✨ {t.agents} agents</span>}
                            {t.automations > 0 && <span className="text-[10px] text-surface-400">⚡ {t.automations} workflows</span>}
                          </div>
                        )}
                      </div>
                      {selected && <Check className="w-5 h-5 text-brand-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Invite Team */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2 text-center">Invite your team</h2>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 text-center">Invite teammates to collaborate. You can always add more later.</p>
              <div className="max-w-md mx-auto">
                <div className="flex gap-2 mb-3">
                  <input
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addInviteEmail()}
                    placeholder="Enter email address..."
                    className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800/50 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500"
                  />
                  <button
                    onClick={addInviteEmail}
                    disabled={!inviteInput.trim()}
                    className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                {inviteEmails.length > 0 ? (
                  <div className="space-y-1.5 mb-4">
                    {inviteEmails.map((email) => (
                      <div key={email} className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-50 dark:bg-white/[0.04] border border-surface-200 dark:border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-surface-400" />
                          <span className="text-sm text-surface-700 dark:text-surface-300">{email}</span>
                        </div>
                        <button onClick={() => removeInviteEmail(email)} className="p-1 rounded text-surface-400 hover:text-danger-500 hover:bg-danger-500/10 transition-all">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-surface-400" />
                    </div>
                    <p className="text-xs text-surface-500">No team members added yet. You can always invite them later.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <div className="text-center">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-memory-500 to-execution-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-memory-500/20 animate-scale-in">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                You&apos;re all set!
              </h1>
              <p className="text-base text-surface-500 dark:text-surface-400 max-w-lg mx-auto mb-8 leading-relaxed">
                Your workspace <strong className="text-surface-700 dark:text-surface-300">{workspaceName}</strong> is ready.
                We&apos;re setting up your projects, AI agents, and automations.
              </p>

              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-8">
                {[
                  { label: 'Workspace', value: workspaceName },
                  { label: 'Template', value: templates.find(t => t.id === selectedTemplate)?.name || 'Custom' },
                  { label: 'Team', value: `${inviteEmails.length} invited` },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
                    <p className="text-[10px] text-surface-400 mb-0.5">{item.label}</p>
                    <p className="text-xs font-semibold text-surface-900 dark:text-white truncate">{item.value}</p>
                  </div>
                ))}
              </div>

              {isProcessing ? (
                <div className="flex items-center justify-center gap-2 text-sm text-surface-500">
                  <div className="w-4 h-4 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                  Setting up your workspace...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-xs text-surface-400 bg-surface-50 dark:bg-white/[0.04] px-4 py-2 rounded-full mx-auto w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  Ready to launch
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-surface-200/50 dark:border-white/[0.06]">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              className={cn(
                'px-5 py-2.5 text-sm font-medium rounded-xl transition-all flex items-center gap-1.5',
                currentStep === 0
                  ? 'text-surface-300 dark:text-surface-600 cursor-not-allowed'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-white/[0.06]'
              )}
              disabled={currentStep === 0}
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Back
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-brand-500/25 flex items-center gap-1.5"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isProcessing}
                className="px-8 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/25 flex items-center gap-2"
              >
                {isProcessing ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Setting up...</>
                ) : (
                  <><Rocket className="w-4 h-4" /> Launch Workspace</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
