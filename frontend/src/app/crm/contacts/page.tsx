'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, Button, Input, Badge, Modal } from '@/components/ui';
import { Plus, Search, Users, Trash2, Edit3 } from 'lucide-react';
import type { CRMContact } from '@/lib/types';
import toast from 'react-hot-toast';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CRMContact | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', position: '', source: '' });

  useEffect(() => {
    api.getContacts()
      .then(setContacts)
      .catch(() => setError('Failed to load contacts'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  function openEdit(contact: CRMContact) {
    setEditing(contact);
    setForm({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      company: contact.company || '',
      position: contact.position || '',
      source: contact.source || '',
    });
    setShowForm(true);
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: '', email: '', phone: '', company: '', position: '', source: '' });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const updated = await api.updateContact(editing.id, form);
        setContacts((prev) => prev.map((c) => (c.id === editing.id ? updated : c)));
        toast.success('Contact updated');
      } else {
        const created = await api.createContact(form);
        setContacts((prev) => [...prev, created]);
        toast.success('Contact created');
      }
      setShowForm(false);
      setEditing(null);
    } catch {
      toast.error('Failed to save contact');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this contact?')) return;
    try {
      await api.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast.success('Contact deleted');
    } catch {
      toast.error('Failed to delete contact');
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="h-12 w-12 text-red-400 mx-auto mb-3" />
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
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your contact list</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" />Add Contact</Button>
      </div>

      <div className="w-64">
        <Input placeholder="Search contacts..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-gray-800 rounded-lg animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Users className="h-16 w-16 text-gray-700 mb-4" />
          <p className="text-gray-500 text-lg mb-1">{search ? 'No matching contacts' : 'No contacts yet'}</p>
          <p className="text-gray-600 text-sm mb-4">{search ? 'Try a different search' : 'Add your first contact'}</p>
          {!search && <Button onClick={openCreate}><Plus className="h-4 w-4" />Add Contact</Button>}
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
                    <th className="px-4 py-3 font-medium">Position</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((contact) => (
                    <tr key={contact.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="px-4 py-3 text-sm font-medium text-gray-200">{contact.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{contact.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{contact.company || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-400">{contact.position || '-'}</td>
                      <td className="px-4 py-3">
                        <Badge variant={contact.status === 'active' ? 'success' : contact.status === 'lead' ? 'primary' : 'default'}>{contact.status}</Badge>
                      </td>
                      <td className="px-4 py-3"><span className="text-sm text-gray-300">{contact.score}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(contact)} className="p-1.5 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-700"><Edit3 className="h-3.5 w-3.5" /></button>
                          <button onClick={() => handleDelete(contact.id)} className="p-1.5 rounded text-gray-500 hover:text-red-400 hover:bg-gray-700"><Trash2 className="h-3.5 w-3.5" /></button>
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

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Contact' : 'Add Contact'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="name" label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input id="email" label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input id="phone" label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input id="company" label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Input id="position" label="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
          <Input id="source" label="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
