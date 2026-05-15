'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, CardContent, Button, Input, Badge } from '@/components/ui';
import { ArrowLeft, Plus, Trash2, Play, Zap, Webhook, Calendar } from 'lucide-react';
import type { WorkflowStep, WorkflowTrigger } from '@/lib/types';
import toast from 'react-hot-toast';

const actionOptions = [
  { value: 'send_email', label: 'Send Email' },
  { value: 'create_task', label: 'Create Task' },
  { value: 'update_status', label: 'Update Status' },
  { value: 'send_webhook', label: 'Send Webhook' },
  { value: 'notify_slack', label: 'Notify Slack' },
  { value: 'call_api', label: 'Call API' },
];

export default function NewWorkflowPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState<'webhook' | 'schedule' | 'event'>('webhook');
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: '1', action: 'send_email', config: {}, order: 1 },
  ]);

  function addStep() {
    setSteps((prev) => [
      ...prev,
      { id: Date.now().toString(), action: 'send_email', config: {}, order: prev.length + 1 },
    ]);
  }

  function removeStep(id: string) {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i + 1 })));
  }

  function updateStepAction(id: string, action: string) {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, action } : s)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Workflow name is required');
      return;
    }
    setSaving(true);
    try {
      const trigger: WorkflowTrigger = { type: triggerType, config: {} };
      const workflow = await api.createWorkflow({ name, description, trigger, steps });
      toast.success('Workflow created');
      router.push(`/automations/${workflow.id}`);
    } catch {
      toast.error('Failed to create workflow');
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    if (!name.trim()) {
      toast.error('Name required before testing');
      return;
    }
    setTesting(true);
    try {
      const trigger: WorkflowTrigger = { type: triggerType, config: {} };
      const workflow = await api.createWorkflow({ name, description, trigger, steps });
      await api.testWorkflow(workflow.id);
      toast.success('Test run started');
      router.push(`/automations/${workflow.id}`);
    } catch {
      toast.error('Test run failed');
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Create Workflow</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-300">Workflow Details</h2>
            <Input id="wf-name" label="Name" placeholder="e.g. Daily Report Generation" value={name} onChange={(e) => setName(e.target.value)} required />
            <div className="space-y-2">
              <label htmlFor="wf-desc" className="block text-sm font-medium text-gray-300">Description</label>
              <textarea id="wf-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="What does this workflow do?" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Trigger
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'webhook', label: 'Webhook', icon: Webhook, desc: 'HTTP endpoint trigger' },
                { value: 'schedule', label: 'Schedule', icon: Calendar, desc: 'Cron-based trigger' },
                { value: 'event', label: 'Event', icon: Zap, desc: 'System event trigger' },
              ] as const).map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTriggerType(t.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-colors ${
                    triggerType === t.value
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <t.icon className={`h-6 w-6 ${triggerType === t.value ? 'text-indigo-400' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${triggerType === t.value ? 'text-indigo-400' : 'text-gray-300'}`}>{t.label}</span>
                  <span className="text-xs text-gray-600">{t.desc}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-300">Steps</h2>
              <Button type="button" variant="outline" size="sm" onClick={addStep}>
                <Plus className="h-3 w-3" />Add Step
              </Button>
            </div>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <select
                      value={step.action}
                      onChange={(e) => updateStepAction(step.id, e.target.value)}
                      className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-3 py-2 text-sm text-gray-100"
                    >
                      {actionOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <Badge variant="info">{step.action.replace('_', ' ')}</Badge>
                      <span className="text-xs text-gray-600">Step {step.order}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeStep(step.id)} className="p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-gray-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleTest} isLoading={testing}>
            <Play className="h-4 w-4" />
            Test Run
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" isLoading={saving}>Create Workflow</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
