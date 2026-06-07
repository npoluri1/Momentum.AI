'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import {
  User, Camera, Mail, Phone, MapPin, Globe,
  Save, Lock, Bell, Palette, Shield, Monitor,
  Moon, Sun, Check, Eye, EyeOff, Key,
  Smartphone, Chrome, Fingerprint,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'general', label: 'General', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-[#0a0a0f]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Profile</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Manage your personal information and preferences.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap',
                  active
                    ? 'bg-surface-900 dark:bg-white text-white dark:text-surface-900 shadow-md'
                    : 'bg-white dark:bg-white/[0.06] text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-white/[0.08] hover:bg-surface-50 dark:hover:bg-white/[0.1]'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'general' && <GeneralTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'appearance' && <AppearanceTab />}
      </div>
    </div>
  );
}

function GeneralTab() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: 'John Doe',
    email: 'john@company.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    bio: 'Product manager and team lead. Passionate about AI and building great products.',
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarSrc(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Profile updated');
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 via-intelligence-500 to-execution-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                'JD'
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-white">{form.name}</h2>
            <p className="text-sm text-surface-500">{form.email}</p>
            <p className="text-xs text-surface-400 mt-1">Member since January 2025</p>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
        <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-surface-50 dark:bg-white/[0.06] border border-surface-200 dark:border-white/[0.08] text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-surface-50 dark:bg-white/[0.06] border border-surface-200 dark:border-white/[0.08] text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-surface-50 dark:bg-white/[0.06] border border-surface-200 dark:border-white/[0.08] text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-surface-50 dark:bg-white/[0.06] border border-surface-200 dark:border-white/[0.08] text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Timezone</label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <select value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} className="w-full pl-10 pr-8 py-2.5 rounded-xl text-sm bg-surface-50 dark:bg-white/[0.06] border border-surface-200 dark:border-white/[0.08] text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 appearance-none">
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Berlin">Berlin (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
                <option value="Australia/Sydney">Sydney (AEST)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Language</label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <select defaultValue="en" className="w-full pl-10 pr-8 py-2.5 rounded-xl text-sm bg-surface-50 dark:bg-white/[0.06] border border-surface-200 dark:border-white/[0.08] text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 appearance-none">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl text-sm bg-surface-50 dark:bg-white/[0.06] border border-surface-200 dark:border-white/[0.08] text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
          />
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-surface-100 dark:border-white/[0.06]">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all disabled:opacity-50 shadow-lg shadow-brand-500/25 flex items-center gap-2"
          >
            {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [sessions] = useState([
    { device: 'Chrome on macOS', location: 'San Francisco, CA', lastActive: 'Active now', current: true },
    { device: 'Safari on iPhone', location: 'San Francisco, CA', lastActive: '2h ago', current: false },
    { device: 'Firefox on Windows', location: 'New York, NY', lastActive: '3 days ago', current: false },
  ]);

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Password updated');
    setPasswords({ current: '', new: '', confirm: '' });
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
        <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">Change Password</h3>
        <p className="text-sm text-surface-500 mb-4">Update your password to keep your account secure.</p>
        <div className="space-y-3 max-w-md">
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} type={showCurrent ? 'text' : 'password'} placeholder="Current password" className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-surface-50 dark:bg-white/[0.06] border border-surface-200 dark:border-white/[0.08] text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"><EyeOff className="w-4 h-4" /></button>
          </div>
          <div className="relative">
            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} type={showNew ? 'text' : 'password'} placeholder="New password" className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-surface-50 dark:bg-white/[0.06] border border-surface-200 dark:border-white/[0.08] text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"><EyeOff className="w-4 h-4" /></button>
          </div>
          <div className="relative">
            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} type={showConfirm ? 'text' : 'password'} placeholder="Confirm new password" className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-surface-50 dark:bg-white/[0.06] border border-surface-200 dark:border-white/[0.08] text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
            <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"><EyeOff className="w-4 h-4" /></button>
          </div>
          {passwords.confirm && passwords.new !== passwords.confirm && (
            <p className="text-xs text-danger-500">Passwords do not match</p>
          )}
          <div className="flex justify-end">
            <button
              onClick={handlePasswordChange}
              disabled={!passwords.current || !passwords.new || passwords.new !== passwords.confirm || saving}
              className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all disabled:opacity-50 shadow-lg shadow-brand-500/25 flex items-center gap-2"
            >
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-base font-semibold text-surface-900 dark:text-white">Two-Factor Authentication</h3>
            <p className="text-sm text-surface-500">Add an extra layer of security to your account.</p>
          </div>
          <button
            onClick={() => setMfaEnabled(!mfaEnabled)}
            className={cn(
              'relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50',
              mfaEnabled ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'
            )}
          >
            <span className={cn('inline-block h-6 w-6 rounded-full bg-white shadow transform transition-transform', mfaEnabled ? 'translate-x-5' : 'translate-x-0')} />
          </button>
        </div>
        {mfaEnabled && (
          <div className="mt-4 p-4 rounded-xl bg-memory-500/10 border border-memory-500/20">
            <p className="text-sm text-memory-600 dark:text-memory-400 flex items-center gap-2">
              <Fingerprint className="w-4 h-4" />
              Two-factor authentication is enabled. You&apos;ll be prompted for a code from your authenticator app on sign-in.
            </p>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
        <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">Active Sessions</h3>
        <p className="text-sm text-surface-500 mb-4">Devices that are currently signed in to your account.</p>
        <div className="space-y-3">
          {sessions.map((session, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-white/[0.04]">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-surface-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-surface-900 dark:text-white">{session.device}</span>
                    {session.current && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-memory-500/10 text-memory-500 border border-memory-500/20">Current</span>
                    )}
                  </div>
                  <p className="text-xs text-surface-500">{session.location} · {session.lastActive}</p>
                </div>
              </div>
              {!session.current && (
                <button className="text-xs text-surface-400 hover:text-danger-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-danger-500/10">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState([
    { id: 'task_assigned', label: 'Task Assigned', description: 'When a task is assigned to you', enabled: true },
    { id: 'mentions', label: 'Mentions', description: 'When someone mentions you in a comment', enabled: true },
    { id: 'deadlines', label: 'Deadline Reminders', description: '24h before a task deadline', enabled: true },
    { id: 'agent_complete', label: 'Agent Complete', description: 'When an AI agent finishes a task', enabled: false },
    { id: 'deal_update', label: 'Deal Updates', description: 'When a CRM deal changes stage', enabled: true },
    { id: 'workflow_fail', label: 'Workflow Failures', description: 'When an automation fails', enabled: true },
    { id: 'team_join', label: 'Team Join', description: 'When someone joins your organization', enabled: false },
    { id: 'weekly_digest', label: 'Weekly Digest', description: 'Weekly summary of activity', enabled: true },
  ]);
  const [saving, setSaving] = useState(false);

  const toggle = (id: string) => {
    setPrefs(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    toast.success('Preferences saved');
    setSaving(false);
  };

  const channels = [
    { id: 'email', label: 'Email', icon: Mail, description: 'Receive notifications via email' },
    { id: 'push', label: 'Push', icon: Bell, description: 'Browser push notifications' },
    { id: 'sms', label: 'SMS', icon: Smartphone, description: 'Text message notifications' },
  ];

  return (
    <div className="space-y-6">
      {/* Channels */}
      <div className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
        <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">Notification Channels</h3>
        <p className="text-sm text-surface-500 mb-4">Choose how you receive notifications.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {channels.map(channel => {
            const Icon = channel.icon;
            return (
              <div key={channel.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-white/[0.04]">
                <Icon className="w-5 h-5 text-brand-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{channel.label}</p>
                  <p className="text-xs text-surface-500">{channel.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preferences */}
      <div className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
        <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-4">Notification Preferences</h3>
        <div className="space-y-1">
          {prefs.map(pref => (
            <div key={pref.id} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-colors">
              <div>
                <p className="text-sm font-medium text-surface-700 dark:text-surface-300">{pref.label}</p>
                <p className="text-xs text-surface-500">{pref.description}</p>
              </div>
              <button
                onClick={() => toggle(pref.id)}
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50',
                  pref.enabled ? 'bg-brand-500' : 'bg-surface-300 dark:bg-surface-600'
                )}
              >
                <span className={cn('inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform', pref.enabled ? 'translate-x-5' : 'translate-x-0')} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-surface-100 dark:border-white/[0.06]">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all disabled:opacity-50 shadow-lg shadow-brand-500/25 flex items-center gap-2"
          >
            {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Preferences</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function AppearanceTab() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-64" />;

  const themes = [
    { id: 'light', label: 'Light', icon: Sun, desc: 'Clean, bright interface' },
    { id: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes at night' },
    { id: 'system', label: 'System', icon: Monitor, desc: 'Follows your device settings' },
  ];

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
        <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">Theme</h3>
        <p className="text-sm text-surface-500 mb-4">Customize the appearance of your workspace.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((t) => {
            const Icon = t.icon;
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  'relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all',
                  active
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/5'
                    : 'border-surface-200 dark:border-white/[0.08] bg-surface-50 dark:bg-white/[0.04] hover:border-surface-300 dark:hover:border-white/[0.12]'
                )}
              >
                {active && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center shadow-lg">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center',
                  t.id === 'dark' ? 'bg-surface-900' : t.id === 'light' ? 'bg-white border border-surface-200' : 'bg-gradient-to-br from-white to-surface-900'
                )}>
                  <Icon className={cn('w-8 h-8', t.id === 'dark' ? 'text-white' : t.id === 'light' ? 'text-surface-900' : 'text-brand-500')} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{t.label}</p>
                  <p className="text-xs text-surface-500">{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-4 p-3 rounded-xl bg-surface-50 dark:bg-white/[0.04]">
          <p className="text-xs text-surface-500">
            Current: <span className="font-medium text-surface-700 dark:text-surface-300">
              {theme === 'system' ? `System preference (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})` : theme === 'dark' ? 'Dark mode' : 'Light mode'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
