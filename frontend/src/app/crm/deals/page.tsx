'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, Button, Input, Badge, Modal } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Plus, Search, DollarSign } from 'lucide-react';
import type { CRMDeal } from '@/lib/types';
import toast from 'react-hot-toast';

const pipelineStages = [
  { id: 'lead', label: 'Lead', color: 'border-t-gray-500' },
  { id: 'qualified', label: 'Qualified', color: 'border-t-blue-500' },
  { id: 'proposal', label: 'Proposal', color: 'border-t-amber-500' },
  { id: 'negotiation', label: 'Negotiation', color: 'border-t-orange-500' },
  { id: 'closed_won', label: 'Closed Won', color: 'border-t-green-500' },
  { id: 'closed_lost', label: 'Closed Lost', color: 'border-t-red-500' },
];

export default function DealsPage() {
  const [deals, setDeals] = useState<CRMDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', value: 0, stage: 'lead' as CRMDeal['stage'], priority: 'medium' as CRMDeal['priority'] });

  useEffect(() => {
    api.getDeals()
      .then(setDeals)
      .catch(() => setError('Failed to load deals'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = deals.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.value) {
      toast.error('Title and value are required');
      return;
    }
    setSaving(true);
    try {
      const deal = await api.createDeal(form);
      setDeals((prev) => [...prev, deal]);
      setShowForm(false);
      setForm({ title: '', value: 0, stage: 'lead', priority: 'medium' });
      toast.success('Deal created');
    } catch {
      toast.error('Failed to create deal');
    } finally {
      setSaving(false);
    }
  }

  const dealsByStage = pipelineStages.reduce((acc, stage) => {
    acc[stage.id] = deals.filter((d) => d.stage === stage.id);
    return acc;
  }, {} as Record<string, CRMDeal[]>);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <DollarSign className="h-12 w-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-400 text-lg mb-2">{error}</p>
          <button onClick={() => window.location.reload()} className="text-indigo-400 hover:text-indigo-300 text-sm">Try again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Deals</h1>
          <p className="text-sm text-gray-500 mt-1">Sales pipeline management</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('pipeline')} className={cn('px-3 py-1.5 rounded-lg text-sm', view === 'pipeline' ? 'bg-indigo-500/10 text-indigo-400' : 'text-gray-500')}>Pipeline</button>
          <button onClick={() => setView('table')} className={cn('px-3 py-1.5 rounded-lg text-sm', view === 'table' ? 'bg-indigo-500/10 text-indigo-400' : 'text-gray-500')}>Table</button>
          <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />New Deal</Button>
        </div>
      </div>

      <div className="w-64">
        <Input placeholder="Search deals..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-gray-800 rounded-lg animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <DollarSign className="h-16 w-16 text-gray-700 mb-4" />
          <p className="text-gray-500 text-lg mb-1">{search ? 'No matching deals' : 'No deals yet'}</p>
          <p className="text-gray-600 text-sm mb-4">{search ? 'Try a different search' : 'Create your first deal'}</p>
          {!search && <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />New Deal</Button>}
        </div>
      ) : view === 'pipeline' ? (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {pipelineStages.map((stage) => (
            <div key={stage.id} className={cn('rounded-xl bg-gray-900/50 border border-gray-800 border-t-2', stage.color)}>
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-800">
                <span className="text-xs font-medium text-gray-300">{stage.label}</span>
                <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded-full">{dealsByStage[stage.id]?.length || 0}</span>
              </div>
              <div className="p-2 space-y-2 min-h-[200px]">
                {dealsByStage[stage.id]?.map((deal) => (
                  <div key={deal.id} className="bg-gray-800 rounded-lg p-2.5 border border-gray-700/50 hover:border-gray-600 cursor-pointer">
                    <p className="text-xs font-medium text-gray-200 truncate">{deal.title}</p>
                    <p className="text-xs text-gray-500 mt-1">${deal.value.toLocaleString()}</p>
                    {deal.expectedCloseDate && (
                      <p className="text-xs text-gray-600 mt-1">Due: {new Date(deal.expectedCloseDate).toLocaleDateString()}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 text-left text-xs text-gray-500 uppercase">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Value</th>
                    <th className="px-4 py-3 font-medium">Stage</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Expected Close</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((deal) => (
                    <tr key={deal.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-sm font-medium text-gray-200">{deal.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">${deal.value.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          deal.stage === 'closed_won' ? 'success' :
                          deal.stage === 'closed_lost' ? 'danger' :
                          deal.stage === 'negotiation' ? 'warning' :
                          deal.stage === 'proposal' ? 'primary' : 'default'
                        }>{deal.stage.replace('_', ' ')}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={deal.priority === 'high' ? 'danger' : deal.priority === 'medium' ? 'warning' : 'default'}>{deal.priority}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{deal.contact?.name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="New Deal">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input id="deal-title" label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input id="deal-value" label="Value ($)" type="number" value={form.value || ''} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} required />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">Stage</label>
            <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value as CRMDeal['stage'] })} className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-3 py-2 text-sm text-gray-100">
              {pipelineStages.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">Priority</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as CRMDeal['priority'] })} className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-3 py-2 text-sm text-gray-100">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Create Deal</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
