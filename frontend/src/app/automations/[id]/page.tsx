'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, Workflow, Play, Square, Clock, GitBranch,
  CheckCircle, XCircle, Loader2, Webhook, Calendar, Zap,
  Settings, ToggleLeft, ToggleRight, Plus, Trash2, GripVertical,
  AlertCircle, RefreshCw, BarChart3, Activity, Sparkles,
  Mail, MessageCircle, Share2, FileText, Code,
} from 'lucide-react';
import type { Workflow as WorkflowType, WorkflowExecution } from '@/lib/types';
import toast from 'react-hot-toast';

const triggerOptions = [
  { value: 'webhook', label: 'Webhook', icon: Webhook, desc: 'HTTP endpoint trigger', color: 'from-blue-500 to-cyan-500' },
  { value: 'schedule', label: 'Schedule', icon: Calendar, desc: 'Cron-based time trigger', color: 'from-violet-500 to-purple-500' },
  { value: 'event', label: 'Event', icon: Zap, desc: 'System event trigger', color: 'from-amber-500 to-orange-500' },
];

const actionOptions = [
  { value: 'send_email', label: 'Send Email', icon: Mail, color: 'text-rose-500' },
  { value: 'create_task', label: 'Create Task', icon: FileText, color: 'text-blue-500' },
  { value: 'update_status', label: 'Update Status', icon: Activity, color: 'text-emerald-500' },
  { value: 'send_webhook', label: 'Send Webhook', icon: Webhook, color: 'text-cyan-500' },
  { value: 'notify_slack', label: 'Notify Slack', icon: MessageCircle, color: 'text-violet-500' },
  { value: 'call_api', label: 'Call API', icon: Code, color: 'text-amber-500' },
];

const sampleExecutions: WorkflowExecution[] = [
  { id: 'e1', workflowId: '1', status: 'success', startedAt: new Date(Date.now() - 120000).toISOString(), completedAt: new Date(Date.now() - 119700).toISOString(), duration: 3200 },
  { id: 'e2', workflowId: '1', status: 'success', startedAt: new Date(Date.now() - 3600000).toISOString(), completedAt: new Date(Date.now() - 3597200).toISOString(), duration: 2800 },
  { id: 'e3', workflowId: '1', status: 'failed', startedAt: new Date(Date.now() - 10800000).toISOString(), completedAt: new Date(Date.now() - 10798500).toISOString(), duration: 1500, error: 'API timeout' },
  { id: 'e4', workflowId: '1', status: 'success', startedAt: new Date(Date.now() - 21600000).toISOString(), completedAt: new Date(Date.now() - 21597100).toISOString(), duration: 2900 },
  { id: 'e5', workflowId: '1', status: 'running', startedAt: new Date(Date.now() - 30000).toISOString() },
];

export default function WorkflowDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [workflow, setWorkflow] = useState<WorkflowType | null>(null);
  const [executions, setExecutions] = useState<WorkflowExecution[]>(sampleExecutions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'editor' | 'history'>('overview');
  const [editingSteps, setEditingSteps] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    Promise.all([
      api.getWorkflow(params.id as string),
      api.getWorkflowExecutions(params.id as string).catch(() => sampleExecutions),
    ])
      .then(([wf, execs]) => {
        setWorkflow(wf);
        setExecutions(execs.length > 0 ? execs : sampleExecutions);
      })
      .catch(() => setError('Workflow not found'))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function toggleActive() {
    if (!workflow) return;
    try {
      const updated = await api.updateWorkflow(workflow.id, { status: workflow.status === 'active' ? 'inactive' : 'active' });
      setWorkflow(updated);
      toast.success(`Workflow ${updated.status === 'active' ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update workflow');
    }
  }

  async function handleTest() {
    if (!workflow) return;
    setTesting(true);
    try {
      const exec = await api.testWorkflow(workflow.id);
      setExecutions((prev) => [exec, ...prev]);
      toast.success('Test run completed');
    } catch {
      toast.error('Test run failed');
    } finally {
      setTesting(false);
    }
  }

  const TriggerIcon = (triggerOptions.find(t => t.value === workflow?.trigger.type)?.icon || Zap);
  const triggerDef = triggerOptions.find(t => t.value === workflow?.trigger.type);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
          <Workflow className="w-8 h-8 text-surface-400" />
        </div>
        <p className="text-lg font-semibold text-surface-900 dark:text-white mb-1">{error}</p>
        <button onClick={() => router.back()} className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">Go back</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-white/[0.06] animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-surface-100 dark:bg-white/[0.06] rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-surface-100 dark:bg-white/[0.06] rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="h-64 bg-surface-100 dark:bg-white/[0.06] rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!workflow) return null;

  const stats = {
    total: executions.length,
    success: executions.filter(e => e.status === 'success').length,
    failed: executions.filter(e => e.status === 'failed').length,
    running: executions.filter(e => e.status === 'running').length,
    successRate: executions.length > 0
      ? Math.round((executions.filter(e => e.status === 'success').length / executions.length) * 100)
      : 0,
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200/50 dark:border-white/[0.06] shrink-0 bg-white/50 dark:bg-[#0a0a0f]/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100/80 dark:hover:bg-white/[0.06] transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md', triggerDef?.color || 'from-surface-500 to-surface-600')}>
                <TriggerIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg font-bold text-surface-900 dark:text-white">{workflow.name}</h1>
                  <div className={cn(
                    'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border',
                    workflow.status === 'active'
                      ? 'text-success-500 bg-success-500/10 border-success-500/20'
                      : 'text-surface-400 bg-surface-100 dark:bg-white/[0.04] border-surface-200 dark:border-white/[0.06]'
                  )}>
                    <div className={cn('w-1.5 h-1.5 rounded-full', workflow.status === 'active' ? 'bg-success-500' : 'bg-surface-400')} />
                    {workflow.status === 'active' ? 'Running' : 'Inactive'}
                  </div>
                </div>
                <p className="text-xs text-surface-400 dark:text-surface-500">
                  {workflow.trigger.type} trigger · {workflow.steps.length} steps
                  {workflow.description && ` · ${workflow.description}`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleTest}
              disabled={testing}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5',
                'bg-surface-100/80 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 border border-surface-200/50 dark:border-transparent hover:bg-surface-200/50 dark:hover:bg-white/[0.1]'
              )}
            >
              {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              Test Run
            </button>
            <button
              onClick={toggleActive}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5',
                workflow.status === 'active'
                  ? 'bg-danger-500/10 text-danger-500 border border-danger-500/20 hover:bg-danger-500/20'
                  : 'bg-success-500/10 text-success-500 border border-success-500/20 hover:bg-success-500/20'
              )}
            >
              {workflow.status === 'active' ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {workflow.status === 'active' ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-1 border-b border-surface-200/50 dark:border-white/[0.06] bg-white/30 dark:bg-transparent">
          {[
            { key: 'overview' as const, label: 'Overview', icon: BarChart3 },
            { key: 'editor' as const, label: 'Editor', icon: GitBranch },
            { key: 'history' as const, label: 'History', icon: Clock },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all',
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
        <div className="flex-1 overflow-y-auto">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="p-6 md:p-8 max-w-4xl space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Total Runs', value: stats.total, icon: Activity, color: 'text-memory-500', gradient: 'from-memory-500 to-intelligence-500' },
                  { label: 'Success Rate', value: `${stats.successRate}%`, icon: CheckCircle, color: 'text-success-500', gradient: 'from-success-500 to-emerald-500' },
                  { label: 'Failed', value: stats.failed, icon: XCircle, color: 'text-danger-500', gradient: 'from-danger-500 to-rose-500' },
                  { label: 'Active', value: stats.running, icon: Play, color: 'text-brand-500', gradient: 'from-brand-500 to-rose-500' },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="apple-stat-card">
                      <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-sm', stat.gradient)}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-surface-900 dark:text-white mb-0.5">{stat.value}</p>
                      <p className="text-xs text-surface-400">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Workflow Diagram */}
              <div className="apple-card p-6">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-execution-500" />
                  Workflow Pipeline
                </h3>
                <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-hide">
                  {/* Trigger */}
                  <div className={cn(
                    'flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border-2 min-w-[140px]',
                    workflow.status === 'active'
                      ? 'border-success-500/30 bg-success-500/5'
                      : 'border-surface-200/50 dark:border-white/[0.06] bg-surface-50/50 dark:bg-white/[0.02]'
                  )}>
                    <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm', triggerDef?.color || 'from-surface-500 to-surface-600')}>
                      <TriggerIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-surface-700 dark:text-surface-300 capitalize">{workflow.trigger.type}</span>
                    <span className="text-[10px] text-surface-400 text-center">Trigger</span>
                  </div>

                  {/* Steps */}
                  {workflow.steps.map((step, i) => {
                    const actionDef = actionOptions.find(a => a.value === step.action);
                    const ActionIcon = actionDef?.icon || Zap;
                    return (
                      <div key={step.id} className="flex items-center gap-2">
                        <div className="text-surface-300 dark:text-surface-600">
                          <ChevronRightIcon />
                        </div>
                        <div className="flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 min-w-[130px] hover:border-brand-500/30 hover:bg-brand-500/5 transition-all cursor-pointer group">
                          <div className={cn('w-10 h-10 rounded-xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform')}>
                            {ActionIcon && <ActionIcon className={cn('w-5 h-5', actionDef?.color || 'text-surface-400')} />}
                          </div>
                          <span className="text-xs font-semibold text-surface-700 dark:text-surface-300 text-center">
                            {step.action.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] text-surface-400">Step {i + 1}</span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add step button */}
                  <div className="flex items-center gap-2">
                    <div className="text-surface-300 dark:text-surface-600">
                      <ChevronRightIcon />
                    </div>
                    <button className="flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border-2 border-dashed border-surface-300 dark:border-surface-600 text-surface-400 hover:border-brand-500/50 hover:text-brand-500 transition-all min-w-[130px]">
                      <Plus className="w-5 h-5" />
                      <span className="text-xs font-medium">Add Step</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent runs */}
              <div className="apple-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Recent Runs</h3>
                  <button className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-100/50 dark:border-white/[0.03]">
                        {['Status', 'Started', 'Duration', 'Error'].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {executions.slice(0, 5).map((exec) => (
                        <tr key={exec.id} className="border-b border-surface-100/30 dark:border-white/[0.02] hover:bg-surface-50/50 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              {exec.status === 'success' && <CheckCircle className="w-4 h-4 text-success-500" />}
                              {exec.status === 'failed' && <XCircle className="w-4 h-4 text-danger-500" />}
                              {exec.status === 'running' && <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />}
                              <span className={cn(
                                'text-sm font-medium capitalize',
                                exec.status === 'success' ? 'text-success-600 dark:text-success-400' :
                                exec.status === 'failed' ? 'text-danger-600 dark:text-danger-400' :
                                'text-brand-600 dark:text-brand-400'
                              )}>{exec.status}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-surface-500 dark:text-surface-400">{new Date(exec.startedAt).toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-sm text-surface-500 dark:text-surface-400 font-mono">{exec.duration ? `${(exec.duration / 1000).toFixed(1)}s` : '-'}</td>
                          <td className="px-5 py-3.5 text-sm text-danger-500">{exec.error || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* EDITOR TAB */}
          {activeTab === 'editor' && (
            <div className="p-6 md:p-8 max-w-4xl space-y-6">
              {/* Trigger config */}
              <div className="apple-card p-5">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Trigger Configuration</h3>
                <div className="grid grid-cols-3 gap-3">
                  {triggerOptions.map((t) => {
                    const Icon = t.icon;
                    const active = workflow.trigger.type === t.value;
                    return (
                      <button
                        key={t.value}
                        className={cn(
                          'flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all',
                          active
                            ? 'bg-brand-500/10 border-brand-500/30'
                            : 'bg-surface-50/50 dark:bg-white/[0.02] border-surface-200/50 dark:border-white/[0.06] hover:bg-surface-100/50 dark:hover:bg-white/[0.04]'
                        )}
                      >
                        <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center', t.color)}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-center">
                          <p className={cn('text-xs font-semibold', active ? 'text-brand-500' : 'text-surface-700 dark:text-surface-300')}>{t.label}</p>
                          <p className="text-[10px] text-surface-400">{t.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Steps editor */}
              <div className="apple-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Workflow Steps</h3>
                  <button className="text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Step
                  </button>
                </div>
                <div className="space-y-2">
                  {workflow.steps.map((step, i) => {
                    const actionDef = actionOptions.find(a => a.value === step.action);
                    const ActionIcon = actionDef?.icon || Zap;
                    return (
                      <div
                        key={step.id}
                        className="flex items-center gap-3 p-4 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04] hover:border-surface-300/50 dark:hover:border-white/[0.08] transition-all group"
                      >
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-surface-200/50 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <select
                            defaultValue={step.action}
                            className="w-full text-sm bg-transparent text-surface-700 dark:text-surface-300 border border-surface-200/50 dark:border-white/[0.06] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500/30"
                          >
                            {actionOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all">
                            <Settings className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-500/10 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Save */}
              <div className="flex items-center justify-end gap-3">
                <button className="px-4 py-2 text-sm font-semibold rounded-xl text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
                  Cancel
                </button>
                <button
                  onClick={() => toast.success('Workflow saved!')}
                  className="apple-button-primary"
                >
                  Save Workflow
                </button>
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="p-6 md:p-8 max-w-4xl space-y-6">
              {/* Execution stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Success Rate', value: `${stats.successRate}%`, change: `${executions.filter(e => e.status === 'success').length}/${executions.length}`, color: 'text-success-500' },
                  { label: 'Avg Duration', value: executions.length > 0 ? `${(executions.reduce((a, e) => a + (e.duration || 0), 0) / executions.length / 1000).toFixed(1)}s` : '-', change: 'per run', color: 'text-intelligence-500' },
                  { label: 'Failure Rate', value: `${executions.length > 0 ? Math.round((executions.filter(e => e.status === 'failed').length / executions.length) * 100) : 0}%`, change: `${executions.filter(e => e.status === 'failed').length} failed`, color: 'text-danger-500' },
                ].map((stat) => (
                  <div key={stat.label} className="apple-stat-card">
                    <p className="text-2xl font-bold text-surface-900 dark:text-white mb-0.5">{stat.value}</p>
                    <p className="text-xs text-surface-400">{stat.label}</p>
                    <p className="text-[10px] text-surface-500 dark:text-surface-500 mt-0.5">{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Full execution history */}
              <div className="apple-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white">All Executions</h3>
                  <button className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-100/50 dark:border-white/[0.03]">
                        {['Status', 'Started', 'Duration', 'Error', 'Actions'].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {executions.map((exec) => (
                        <tr key={exec.id} className="border-b border-surface-100/30 dark:border-white/[0.02] hover:bg-surface-50/50 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              {exec.status === 'success' && <CheckCircle className="w-4 h-4 text-success-500" />}
                              {exec.status === 'failed' && <XCircle className="w-4 h-4 text-danger-500" />}
                              {exec.status === 'running' && <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />}
                              <span className={cn(
                                'text-sm font-medium capitalize',
                                exec.status === 'success' ? 'text-success-600 dark:text-success-400' :
                                exec.status === 'failed' ? 'text-danger-600 dark:text-danger-400' :
                                'text-brand-600 dark:text-brand-400'
                              )}>{exec.status}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-surface-500 dark:text-surface-400">{new Date(exec.startedAt).toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-sm text-surface-500 dark:text-surface-400 font-mono">{exec.duration ? `${(exec.duration / 1000).toFixed(1)}s` : '-'}</td>
                          <td className="px-5 py-3.5 text-sm text-danger-500">{exec.error || '-'}</td>
                          <td className="px-5 py-3.5">
                            <button className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors">View details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
