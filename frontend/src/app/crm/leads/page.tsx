'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, Button, Input, Select, Badge, Modal } from '@/components/ui';
import { Plus, Search, Target, Trash2, Edit3 } from 'lucide-react';
import type { CRMLead } from '@/lib/types';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'converted', label: 'Converted' },
  { value: 'lost', label: 'Lost' },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', source: '', notes: '' });

  useEffect(() => {
    api.getLeads()
      .then(setLeads)
      .catch(() => setError('Failed to load leads'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setSaving(true);
    try {
      const lead = await api.createLead(form);
      setLeads((prev) => [...prev, lead]);
      setShowForm(false);
      setForm({ name: '', email: '', company: '', phone: '', source: '', notes: '' });
      toast.success('Lead created');
    } catch {
      toast.error('Failed to create lead');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this lead?')) return;
    try {
      await api.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l.id !== id));
      toast.success('Lead deleted');
    } catch {
      toast.error('Failed to delete lead');
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Target className="h-12 w-12 text-red-400 mx-auto mb-3" />
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
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Manage incoming leads</p>
        </div>
        <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />Add Lead</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="w-64">
          <Input placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={statusOptions} />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-gray-800 rounded-lg animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Target className="h-16 w-16 text-gray-700 mb-4" />
          <p className="text-gray-500 text-lg mb-1">{search ? 'No matching leads' : 'No leads yet'}</p>
          <p className="text-gray-600 text-sm mb-4">{search ? 'Try a different search' : 'Add your first lead'}</p>
          {!search && <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />Add Lead</Button>}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 text-left text-xs text-gray-500 uppercase">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Company</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Assigned To</th>
                    <th className="px-4 py-3 font-medium w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-sm font-medium text-gray-200">{lead.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{lead.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{lead.company || '-'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          lead.status === 'converted' ? 'success' :
                          lead.status === 'lost' ? 'danger' :
                          lead.status === 'qualified' ? 'primary' :
                          lead.status === 'contacted' ? 'warning' : 'default'
                        }>{lead.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{lead.source || '-'}</td>
                      <td className="px-4 py-3"><span className="text-sm text-gray-300">{lead.score}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-500">{lead.assignedTo?.name || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-700"><Edit3 className="h-3.5 w-3.5" /></button>
                          <button onClick={() => handleDelete(lead.id)} className="p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-gray-700"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Add New Lead">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input id="lead-name" label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input id="lead-email" label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input id="lead-company" label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Input id="lead-phone" label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input id="lead-source" label="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          <div className="space-y-2">
            <label htmlFor="lead-notes" className="block text-sm font-medium text-gray-300">Notes</label>
            <textarea id="lead-notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Create Lead</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
