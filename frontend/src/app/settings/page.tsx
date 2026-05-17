'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import {
  User, Building2, Users, Bell, Palette,
  Save, Camera, Mail, Phone, MapPin, Globe,
  Loader2, Check, X, ChevronDown, Plus, Trash2,
  Moon, Sun, Monitor, Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

const tabs = ['profile', 'organization', 'team', 'notifications', 'appearance'] as const;
type Tab = typeof tabs[number];

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  avatar?: string;
  joinedAt: string;
}

interface NotificationPref {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

function SettingsPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as Tab | null;
  const [activeTab, setActiveTab] = useState<Tab>(tabParam ?? 'profile');

  useEffect(() => {
    if (tabParam && tabs.includes(tabParam)) setActiveTab(tabParam);
  }, [tabParam]);

  return (
    <div className="space-y-6 animate-fade-in">
      {activeTab === 'profile' && <ProfileTab />}
      {activeTab === 'organization' && <OrganizationTab />}
      {activeTab === 'team' && <TeamTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'appearance' && <AppearanceTab />}
    </div>
  );
}

function ProfileTab() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: 'John Doe', email: 'john@company.com', phone: '+1 (555) 123-4567', location: 'San Francisco, CA', bio: 'Product manager and team lead at Global Tasks.' });
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState('');

  const handleSave = useCallback(async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Profile updated successfully');
    setSaving(false);
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarSrc(ev.target?.result as string);
      reader.readAsDataURL(file);
      toast.success('Avatar uploaded');
    }
  };

  return (
    <Card>
      <CardHeader>Profile</CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar name={form.name} src={avatarSrc} size="xl" />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{form.name}</h3>
            <p className="text-sm text-surface-500">{form.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} icon={<User className="w-4 h-4" />} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} icon={<Mail className="w-4 h-4" />} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} icon={<Phone className="w-4 h-4" />} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} icon={<MapPin className="w-4 h-4" />} />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Bio</label>
          <textarea
            className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 min-h-[100px] resize-none"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OrganizationTab() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: 'Acme Corp', website: 'https://acme.com', industry: 'Technology', size: '50-200' });
  const plan = 'Professional';

  const handleSave = useCallback(async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Organization updated');
    setSaving(false);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>Organization Details</CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Company Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} icon={<Building2 className="w-4 h-4" />} />
            <Input label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} icon={<Globe className="w-4 h-4" />} />
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Industry</label>
              <select className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
                <option>Technology</option><option>Finance</option><option>Healthcare</option><option>Education</option><option>E-commerce</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Company Size</label>
              <select className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
                <option>1-10</option><option>11-50</option><option>50-200</option><option>201-1000</option><option>1000+</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Plan & Billing</CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
            <div>
              <p className="font-semibold">{plan} Plan</p>
              <p className="text-sm text-surface-500">$49/month per user · Next billing: Jun 15, 2026</p>
            </div>
            <Badge variant="primary" size="lg">{plan}</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
            <div>
              <p className="font-semibold">Usage this month</p>
              <p className="text-sm text-surface-500">12 of 50 team members</p>
            </div>
            <div className="text-right">
              <span className="font-semibold">24%</span>
              <p className="text-xs text-surface-400">used</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline">View Invoices</Button>
            <Button variant="primary">Upgrade Plan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TeamTab() {
  const [members] = useState<TeamMember[]>([
    { id: '1', name: 'John Doe', email: 'john@company.com', role: 'admin', joinedAt: '2025-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'member', joinedAt: '2025-03-20' },
    { id: '3', name: 'Bob Wilson', email: 'bob@company.com', role: 'member', joinedAt: '2025-04-10' },
    { id: '4', name: 'Alice Brown', email: 'alice@company.com', role: 'viewer', joinedAt: '2025-05-01' },
  ]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'member' | 'viewer'>('member');
  const [sending, setSending] = useState(false);

  const handleInvite = useCallback(async () => {
    if (!inviteEmail) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setSending(false);
  }, [inviteEmail]);

  const roleBadge = (role: string) => {
    const map: Record<string, { variant: 'primary' | 'success' | 'warning'; label: string }> = {
      admin: { variant: 'primary', label: 'Admin' },
      member: { variant: 'success', label: 'Member' },
      viewer: { variant: 'warning', label: 'Viewer' },
    };
    const r = map[role] || { variant: 'default', label: role };
    return <Badge variant={r.variant as 'primary' | 'success' | 'warning'}>{r.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>Team Members</CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-surface-100 dark:divide-surface-800">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-4 px-6 py-4">
                <Avatar name={member.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{member.name}</p>
                  <p className="text-sm text-surface-500 truncate">{member.email}</p>
                </div>
                <div className="hidden sm:block text-sm text-surface-400">Joined {member.joinedAt}</div>
                <div className="flex items-center gap-2">
                  {roleBadge(member.role)}
                  <button className="p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Invite Member</CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
              />
            </div>
            <select
              className="px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as 'member' | 'viewer')}
            >
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
            <Button onClick={handleInvite} loading={sending} icon={<Plus className="w-4 h-4" />}>
              Send Invite
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState<NotificationPref[]>([
    { id: 'task_assigned', label: 'Task Assigned', description: 'When a task is assigned to you', enabled: true },
    { id: 'task_mention', label: 'Mentions', description: 'When someone mentions you in a comment', enabled: true },
    { id: 'deadline_reminder', label: 'Deadline Reminders', description: '24h before a task deadline', enabled: true },
    { id: 'agent_complete', label: 'Agent Complete', description: 'When an AI agent finishes a task', enabled: false },
    { id: 'deal_update', label: 'Deal Updates', description: 'When a CRM deal changes stage', enabled: true },
    { id: 'workflow_fail', label: 'Workflow Failures', description: 'When an automation fails', enabled: true },
    { id: 'team_join', label: 'Team Join', description: 'When someone joins your organization', enabled: false },
    { id: 'weekly_digest', label: 'Weekly Digest', description: 'Weekly summary of activity', enabled: true },
  ]);
  const [saving, setSaving] = useState(false);

  const toggle = (id: string) => {
    setPrefs((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success('Notification preferences saved');
    setSaving(false);
  }, []);

  return (
    <Card>
      <CardHeader>Notification Preferences</CardHeader>
      <CardContent className="space-y-1">
        {prefs.map((pref) => (
          <div key={pref.id} className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
            <div>
              <p className="font-medium text-sm">{pref.label}</p>
              <p className="text-xs text-surface-500">{pref.description}</p>
            </div>
            <button
              onClick={() => toggle(pref.id)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50',
                pref.enabled ? 'bg-brand-600' : 'bg-surface-300 dark:bg-surface-600'
              )}
            >
              <span className={cn('inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform', pref.enabled ? 'translate-x-5' : 'translate-x-0')} />
            </button>
          </div>
        ))}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AppearanceTab() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-64" />;

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <Card>
      <CardHeader>Appearance</CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="font-medium mb-1">Theme</h3>
          <p className="text-sm text-surface-500 mb-4">Choose how Global Tasks looks for you.</p>
          <div className="grid grid-cols-3 gap-4">
            {themes.map((t) => {
              const Icon = t.icon;
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    'relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all',
                    active
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50'
                      : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 bg-white dark:bg-surface-800/50'
                  )}
                >
                  {active && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Icon className={cn('w-8 h-8', active ? 'text-brand-600' : 'text-surface-400')} />
                  <span className={cn('text-sm font-medium', active ? 'text-brand-700 dark:text-brand-300' : 'text-surface-600 dark:text-surface-400')}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-surface-200 dark:border-surface-800 pt-6">
          <h3 className="font-medium mb-1">Current Theme</h3>
          <p className="text-sm text-surface-500">
            {theme === 'system'
              ? `System preference (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`
              : theme === 'dark' ? 'Dark mode active' : 'Light mode active'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 animate-pulse bg-surface-100 dark:bg-surface-800 rounded-xl h-96" />}>
      <SettingsPageContent />
    </Suspense>
  );
}
