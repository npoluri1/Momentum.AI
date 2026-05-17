'use client';

import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, CreditCard, Receipt, Gift,
  Puzzle, Bell, Clock, Bookmark, ChevronRight,
  Save, Loader2, Check, Plus, Trash2,
  HelpCircle, ExternalLink, Crown, Sparkles,
  Globe, User, Mail, Shield, Link, Archive,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const tabs = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'plans', label: 'Plans', icon: CreditCard },
  { id: 'billing', label: 'Usage & Billing', icon: Receipt },
  { id: 'credits', label: 'Credits & Rewards', icon: Gift },
  { id: 'integrations', label: 'Integrations', icon: Puzzle },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'archives', label: 'Archives', icon: Clock },
  { id: 'workspace', label: 'Workspace Settings', icon: Bookmark },
];

function SettingsLoading() {
  return (
    <div className="p-4 md:p-6 animate-pulse">
      <div className="flex gap-6">
        <div className="hidden lg:block w-52 space-y-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-9 bg-surface-800/50 rounded-lg" />
          ))}
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-7 w-32 bg-surface-800/50 rounded-lg" />
          <div className="h-48 bg-surface-800/30 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SettingsLoading />;

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      <div className="flex gap-0 lg:gap-8 max-w-6xl">
        <div className="hidden lg:block w-52 shrink-0">
          <nav className="sticky top-0 space-y-0.5">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-surface-100">Settings</h2>
              <p className="text-xs text-surface-500 mt-0.5">Manage your workspace</p>
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left',
                    active
                      ? 'bg-brand-500/10 text-brand-400 font-medium'
                      : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{tab.label}</span>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-brand-400/50" />}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="lg:hidden w-full mb-6">
          <h2 className="text-base font-semibold text-surface-100 mb-3">Settings</h2>
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all',
                    active
                      ? 'bg-brand-500/10 text-brand-400 font-medium'
                      : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === 'general' && <GeneralTab />}
          {activeTab === 'plans' && <PlansTab />}
          {activeTab === 'billing' && <UsageBillingTab />}
          {activeTab === 'credits' && <CreditsRewardsTab />}
          {activeTab === 'integrations' && <IntegrationsTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'archives' && <ArchivesTab />}
          {activeTab === 'workspace' && <WorkspaceSettingsTab />}
        </div>
      </div>
    </div>
  );
}

function GeneralTab() {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('My Workspace');
  const [slug, setSlug] = useState('my-workspace');

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-surface-200 mb-1">General</h3>
        <p className="text-xs text-surface-500">Manage your workspace general settings.</p>
      </div>
      <div className="rounded-xl border border-surface-800/50 bg-surface-900/30 p-5 space-y-4">
        <Input
          label="Workspace Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<Bookmark className="w-4 h-4" />}
        />
        <Input
          label="Workspace Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          icon={<Link className="w-4 h-4" />}
          helperText="URL-friendly identifier for your workspace"
        />
        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

function PlansTab() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-surface-200 mb-1">Plans</h3>
        <p className="text-xs text-surface-500">Choose the right plan for your team.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            name: 'Free',
            price: '$0',
            badge: 'Current',
            features: ['2 projects', '1 AI agent', '100 MB storage', 'Basic integrations'],
            gradient: 'from-surface-600 to-surface-500',
          },
          {
            name: 'Pro',
            price: '$12',
            badge: 'Popular',
            features: ['Unlimited projects', '10 AI agents', '10 GB storage', 'All integrations', 'Priority support'],
            gradient: 'from-brand-500 to-cyan-500',
            popular: true,
          },
          {
            name: 'Business',
            price: '$29',
            badge: 'Enterprise',
            features: ['Everything in Pro', 'Unlimited AI agents', '100 GB storage', 'Custom integrations', 'Dedicated support', 'SSO & audit logs'],
            gradient: 'from-amber-500 to-rose-500',
          },
        ].map((plan) => (
          <div
            key={plan.name}
            className={cn(
              'rounded-xl border p-5 flex flex-col',
              plan.popular
                ? 'border-brand-500/30 bg-brand-500/5'
                : 'border-surface-800/50 bg-surface-900/30'
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-surface-200">{plan.name}</span>
              <Badge variant={plan.popular ? 'primary' : 'default'} size="sm">{plan.badge}</Badge>
            </div>
            <div className="mb-4">
              <span className="text-2xl font-bold text-surface-100">{plan.price}</span>
              <span className="text-xs text-surface-500">/month</span>
            </div>
            <ul className="space-y-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-surface-400">
                  <Check className="w-3.5 h-3.5 text-brand-400 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.popular ? 'primary' : 'outline'}
              size="sm"
              className="mt-5 w-full"
            >
              {plan.name === 'Free' ? 'Current Plan' : 'Upgrade'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsageBillingTab() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-surface-200 mb-1">Usage & Billing</h3>
        <p className="text-xs text-surface-500">Monitor your usage and manage billing.</p>
      </div>
      <div className="rounded-xl border border-surface-800/50 bg-surface-900/30 p-5 space-y-5">
        <div className="flex items-center justify-between p-4 rounded-lg bg-surface-800/30">
          <div>
            <p className="text-sm font-medium text-surface-200">Current Period Usage</p>
            <p className="text-xs text-surface-500 mt-1">2 / 5 projects &middot; 80 MB / 1 GB storage</p>
          </div>
          <Badge variant="success" size="sm">Active</Badge>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Billing History</h4>
          <div className="divide-y divide-surface-800/30">
            {[
              { date: 'Apr 1, 2026', amount: '$0.00', status: 'Free Plan' },
              { date: 'Mar 1, 2026', amount: '$0.00', status: 'Free Plan' },
              { date: 'Feb 1, 2026', amount: '$0.00', status: 'Free Plan' },
            ].map((b) => (
              <div key={b.date} className="flex items-center justify-between py-3">
                <span className="text-sm text-surface-300">{b.date}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-surface-400">{b.amount}</span>
                  <span className="text-xs text-surface-500">{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm">Download Invoices</Button>
        </div>
      </div>
    </div>
  );
}

function CreditsRewardsTab() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-surface-200 mb-1">Credits & Rewards</h3>
        <p className="text-xs text-surface-500">View your credits, rewards, and referral bonuses.</p>
      </div>
      <div className="rounded-xl border border-surface-800/50 bg-surface-900/30 p-5 space-y-5">
        <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-surface-200">0 Credits Available</p>
            <p className="text-xs text-surface-500 mt-0.5">Earn credits by referring friends and completing milestones.</p>
          </div>
          <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3 h-3" />}>
            Earn Credits
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Reward History</h4>
          <p className="text-sm text-surface-500 text-center py-6">No rewards earned yet. Start earning credits to unlock rewards.</p>
        </div>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  const integrations = [
    { name: 'Slack', description: 'Send notifications and updates to Slack channels.', connected: false, color: 'bg-emerald-500' },
    { name: 'GitHub', description: 'Sync issues, PRs, and commits with your projects.', connected: true, color: 'bg-surface-500' },
    { name: 'Google Drive', description: 'Attach files from Google Drive to tasks.', connected: false, color: 'bg-blue-500' },
    { name: 'Notion', description: 'Import and sync pages from Notion.', connected: false, color: 'bg-surface-500' },
    { name: 'Jira', description: 'Two-way sync between Jira and your projects.', connected: false, color: 'bg-blue-600' },
    { name: 'Figma', description: 'Embed Figma designs directly in tasks.', connected: false, color: 'bg-amber-600' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-surface-200 mb-1">Integrations</h3>
        <p className="text-xs text-surface-500">Connect your favorite tools to your workspace.</p>
      </div>
      <div className="rounded-xl border border-surface-800/50 bg-surface-900/30 divide-y divide-surface-800/30">
        {integrations.map((int) => (
          <div key={int.name} className="flex items-center gap-4 px-5 py-4">
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold', int.color)}>
              {int.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-200">{int.name}</p>
              <p className="text-xs text-surface-500 truncate">{int.description}</p>
            </div>
            <Button
              variant={int.connected ? 'outline' : 'primary'}
              size="xs"
            >
              {int.connected ? 'Connected' : 'Connect'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState([
    { id: 'task_assigned', label: 'Task Assigned', description: 'When a task is assigned to you', enabled: true },
    { id: 'mentions', label: 'Mentions', description: 'When someone mentions you', enabled: true },
    { id: 'deadlines', label: 'Deadline Reminders', description: '24h before a task deadline', enabled: true },
    { id: 'agent_complete', label: 'Agent Complete', description: 'When an AI agent finishes', enabled: false },
    { id: 'weekly', label: 'Weekly Digest', description: 'Weekly summary of workspace activity', enabled: false },
  ]);
  const [saving, setSaving] = useState(false);

  const toggle = (id: string) => {
    setPrefs((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-surface-200 mb-1">Notifications</h3>
        <p className="text-xs text-surface-500">Configure how you receive notifications.</p>
      </div>
      <div className="rounded-xl border border-surface-800/50 bg-surface-900/30 p-5 space-y-1">
        {prefs.map((pref) => (
          <div key={pref.id} className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-surface-800/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-surface-200">{pref.label}</p>
              <p className="text-xs text-surface-500">{pref.description}</p>
            </div>
            <button
              onClick={() => toggle(pref.id)}
              className={cn(
                'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50',
                pref.enabled ? 'bg-brand-600' : 'bg-surface-600'
              )}
            >
              <span className={cn(
                'inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform',
                pref.enabled ? 'translate-x-5' : 'translate-x-0'
              )} />
            </button>
          </div>
        ))}
        <div className="flex justify-end pt-4">
          <Button variant="primary" size="sm" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}

function ArchivesTab() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-surface-200 mb-1">Archives</h3>
        <p className="text-xs text-surface-500">View and manage your archived workspaces and projects.</p>
      </div>
      <div className="rounded-xl border border-surface-800/50 bg-surface-900/30 p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-surface-800/50 flex items-center justify-center">
          <Clock className="w-6 h-6 text-surface-500" />
        </div>
        <h3 className="text-sm font-medium text-surface-300 mb-1">No archived items</h3>
        <p className="text-xs text-surface-500">Archived workspaces and projects will appear here.</p>
      </div>
    </div>
  );
}

function WorkspaceSettingsTab() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-surface-200 mb-1">Workspace Settings</h3>
        <p className="text-xs text-surface-500">Manage advanced workspace settings and ownership.</p>
      </div>

      <div className="rounded-xl border border-surface-800/50 bg-surface-900/30 p-5 space-y-5">
        <div>
          <h4 className="text-sm font-medium text-surface-200 mb-3">Transfer Ownership</h4>
          <p className="text-xs text-surface-500 mb-3">Transfer workspace ownership to another member.</p>
          <Button variant="outline" size="sm" disabled>
            <User className="w-4 h-4 mr-1.5" />
            Transfer
          </Button>
        </div>

        <div className="border-t border-surface-800/30 pt-5">
          <h4 className="text-sm font-medium text-surface-200 mb-3">Danger Zone</h4>
          <p className="text-xs text-surface-500 mb-3">Irreversible actions for your workspace.</p>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" icon={<Archive className="w-4 h-4" />}>
              Archive Workspace
            </Button>
            <Button variant="danger" size="sm" icon={<Trash2 className="w-4 h-4" />}>
              Delete Workspace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
