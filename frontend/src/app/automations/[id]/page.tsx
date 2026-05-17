'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, ToggleLeft, ToggleRight, Play, Clock,
  CheckCircle2, XCircle, Loader2, Webhook, Calendar, Zap,
} from 'lucide-react';
import type { Workflow, WorkflowExecution } from '@/lib/types';
import toast from 'react-hot-toast';

const triggerIcons: Record<string, typeof Zap> = {
  webhook: Webhook, schedule: Calendar, event: Zap,
};

export default function WorkflowDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    Promise.all([
      api.getWorkflow(params.id as string),
      api.getWorkflowExecutions(params.id as string),
    ])
      .then(([wf, execs]) => {
        setWorkflow(wf);
        setExecutions(execs);
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-red-400 text-lg mb-2">{error}</p>
        <button onClick={() => router.back()} className="text-indigo-400 hover:text-indigo-300 text-sm">Go back</button>
      </div>
    );
  }

  if (loading) {
    return <div className="space-y-4">
      <div className="h-8 w-64 bg-gray-800 rounded-lg animate-pulse" />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-64 bg-gray-800 rounded-xl animate-pulse" />
        <div className="h-64 bg-gray-800 rounded-xl animate-pulse" />
      </div>
    </div>;
  }

  if (!workflow) return null;

  const Icon = triggerIcons[workflow.trigger.type] || Zap;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{workflow.name}</h1>
            <Badge variant={workflow.status === 'active' ? 'success' : 'default'}>{workflow.status}</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">{workflow.description || 'No description'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleTest} loading={testing}>
            <Play className="h-4 w-4" />
            Test Run
          </Button>
          <Button variant="outline" size="sm" onClick={toggleActive}>
            {workflow.status === 'active' ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
            {workflow.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Icon className="h-4 w-4" />
                Workflow Diagram
              </h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 overflow-x-auto py-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-sm text-indigo-400 whitespace-nowrap">
                  <Icon className="h-4 w-4" />
                  Trigger: {workflow.trigger.type}
                </div>
                {workflow.steps.map((step, i) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <div className="text-gray-600 text-lg">→</div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 whitespace-nowrap">
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-gray-700 text-xs text-gray-400">{i + 1}</span>
                      {step.action.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-gray-300">Execution History</h3>
            </CardHeader>
            <CardContent className="p-0">
              {executions.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-600">No executions yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800 text-left text-xs text-gray-500 uppercase">
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Started</th>
                        <th className="px-4 py-3 font-medium">Duration</th>
                        <th className="px-4 py-3 font-medium">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {executions.map((exec) => (
                        <tr key={exec.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {exec.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                              {exec.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                              {exec.status === 'running' && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                              <span className="text-sm text-gray-300 capitalize">{exec.status}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{new Date(exec.startedAt).toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{exec.duration ? `${exec.duration}ms` : '-'}</td>
                          <td className="px-4 py-3 text-sm text-red-400">{exec.error || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-gray-300">Step Configuration</h3>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {workflow.steps.map((step, i) => (
                <div key={step.id} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-indigo-500/10 text-xs text-indigo-400">{i + 1}</span>
                    <span className="text-sm text-gray-300 capitalize">{step.action.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <select className="mt-1 w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-300">
                      <option>Configure...</option>
                    </select>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium text-gray-300">Details</h3>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <Badge variant={workflow.status === 'active' ? 'success' : 'default'}>{workflow.status}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Trigger</span>
                <Badge variant="primary">{workflow.trigger.type}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Steps</span>
                <span className="text-gray-300">{workflow.steps.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="text-gray-300">{new Date(workflow.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
