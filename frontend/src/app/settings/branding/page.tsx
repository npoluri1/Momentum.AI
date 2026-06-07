'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Globe, Palette, Image, Check, X,
  Save, RefreshCw, Plus, Trash2,
  Sparkles, Lock, Copy, ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

const domains = [
  { id: '1', domain: 'app.company.com', status: 'active', ssl: true, verified: true, added: 'Apr 12, 2026' },
  { id: '2', domain: 'portal.company.com', status: 'pending', ssl: false, verified: false, added: 'Jun 1, 2026' },
];

const presetColors = [
  '#ff2d60', '#6366f1', '#22c55e', '#f59e0b', '#ef4444',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
];

export default function BrandingPage() {
  const [activeTab, setActiveTab] = useState<'branding' | 'domains'>('branding');
  const [primaryColor, setPrimaryColor] = useState('#ff2d60');
  const [logo, setLogo] = useState<string | null>(null);
  const [showDomainInput, setShowDomainInput] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('Branding settings saved');
    setSaving(false);
  };

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;
    toast.success(`Domain ${newDomain} added. Configure your DNS CNAME record to point to app.momentum.ai`);
    setNewDomain('');
    setShowDomainInput(false);
  };

  const handleVerifyDomain = (domain: string) => {
    toast.success(`Verifying ${domain}...`);
    setTimeout(() => toast.success(`${domain} verified successfully!`), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white tracking-tight">Branding & Domains</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Customize your workspace appearance and configure custom domains</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-200/50 dark:border-white/[0.06]">
        {[
          { id: 'branding' as const, label: 'Branding', icon: Palette },
          { id: 'domains' as const, label: 'Custom Domains', icon: Globe },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all',
              activeTab === tab.id ? 'text-brand-500 border-brand-500' : 'text-surface-400 dark:text-surface-500 border-transparent hover:text-surface-600 dark:hover:text-surface-300'
            )}
          >
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          {/* Logo */}
          <div className="apple-card p-5">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Logo</h3>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className={cn(
                  'w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md',
                  logo ? '' : 'bg-gradient-to-br from-brand-500 to-brand-600'
                )}>
                  {logo ? <img src={logo} alt="Logo" className="w-full h-full object-contain rounded-2xl" /> : 'M'}
                </div>
                <button onClick={() => { setLogo('/sample-logo.png'); toast.success('Logo uploaded'); }} className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Image className="w-6 h-6 text-white" />
                </button>
              </div>
              <div>
                <button onClick={() => toast.success('Upload dialog opened')} className="px-3 py-1.5 text-sm font-semibold rounded-xl bg-surface-100/80 dark:bg-white/[0.06] text-surface-700 dark:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.1] transition-all">Upload Logo</button>
                <p className="text-xs text-surface-400 mt-1.5">Recommended: 512x512px PNG with transparent background</p>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="apple-card p-5">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4 text-brand-500" /> Brand Colors
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-surface-500 mb-1.5">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-xl border border-surface-200 dark:border-surface-600 cursor-pointer bg-transparent" />
                  <input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-surface-100/80 dark:bg-white/[0.06] border border-surface-200/50 dark:border-transparent text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {presetColors.map(c => (
                  <button key={c} onClick={() => setPrimaryColor(c)} className={cn('w-8 h-8 rounded-xl border-2 transition-all', primaryColor === c ? 'border-surface-900 dark:border-white scale-110 shadow-md' : 'border-transparent hover:scale-105')} style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50/30 dark:bg-white/[0.02] border border-surface-200/30 dark:border-white/[0.04]">
                <span className="text-sm font-medium text-surface-500">Preview</span>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-lg text-white text-xs font-semibold" style={{ backgroundColor: primaryColor }}>Button</div>
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: primaryColor + '20' }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }} />
                </div>
              </div>
            </div>
          </div>

          {/* White-label */}
          <div className="apple-card p-5">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" /> White-Labeling
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">Remove "Powered by Momentum"</p>
                  <p className="text-xs text-surface-400">Hide branding from published apps and shared links</p>
                </div>
                <div className="relative inline-flex h-6 w-11 rounded-full bg-brand-500 border-2 border-transparent">
                  <span className="inline-block h-5 w-5 rounded-full bg-white shadow-sm translate-x-5" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">Custom Login Page</p>
                  <p className="text-xs text-surface-400">Use your brand colors and logo on the login page</p>
                </div>
                <div className="relative inline-flex h-6 w-11 rounded-full bg-surface-300 dark:bg-white/[0.12] border-2 border-transparent">
                  <span className="inline-block h-5 w-5 rounded-full bg-white shadow-sm translate-x-0" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">Custom Email Domain</p>
                  <p className="text-xs text-surface-400">Send notifications from your own domain (e.g., notifications@company.com)</p>
                </div>
                <div className="relative inline-flex h-6 w-11 rounded-full bg-surface-300 dark:bg-white/[0.12] border-2 border-transparent">
                  <span className="inline-block h-5 w-5 rounded-full bg-white shadow-sm translate-x-0" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="apple-button-primary">
              {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </div>
      )}

      {/* Custom Domains Tab */}
      {activeTab === 'domains' && (
        <div className="space-y-4">
          {domains.map(d => (
            <div key={d.id} className="apple-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', d.status === 'active' ? 'bg-success-500/10 text-success-500' : 'bg-warning-500/10 text-warning-500')}>
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-surface-900 dark:text-white">{d.domain}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-surface-400">
                      <span>Added {d.added}</span>
                      <span className="w-1 h-1 rounded-full bg-surface-300" />
                      {d.ssl && <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-success-500" /> SSL Active</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn('px-2 py-0.5 text-[10px] font-semibold rounded-full border', d.status === 'active' ? 'text-success-500 bg-success-500/10 border-success-500/20' : 'text-warning-500 bg-warning-500/10 border-warning-500/20')}>
                        {d.status === 'active' ? 'Active' : 'Pending Verification'}
                      </span>
                      {d.verified && <span className="flex items-center gap-1 text-[10px] text-success-500"><Check className="w-3 h-3" /> Verified</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!d.verified && <button onClick={() => handleVerifyDomain(d.domain)} className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all">Verify</button>}
                  <button onClick={() => { navigator.clipboard.writeText(`CNAME ${d.domain}`); toast.success('DNS record copied'); }} className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all"><Copy className="w-4 h-4" /></button>
                  <button onClick={() => toast.success('Domain removed')} className="p-2 rounded-xl text-surface-400 hover:text-danger-500 hover:bg-danger-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>

              {!d.verified && (
                <div className="mt-4 p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
                  <p className="text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">DNS Configuration</p>
                  <div className="flex items-center gap-2 text-xs text-surface-400">
                    <code className="px-2 py-1 rounded bg-surface-100 dark:bg-white/[0.06] text-surface-600 dark:text-surface-400 font-mono">CNAME</code>
                    <code className="px-2 py-1 rounded bg-surface-100 dark:bg-white/[0.06] text-surface-600 dark:text-surface-400 font-mono">{d.domain}</code>
                    <ArrowRight className="w-3 h-3" />
                    <code className="px-2 py-1 rounded bg-surface-100 dark:bg-white/[0.06] text-surface-600 dark:text-surface-400 font-mono">app.momentum.ai</code>
                    <button onClick={() => toast.success('Copied!')} className="p-1 rounded text-surface-400 hover:text-surface-600"><Copy className="w-3 h-3" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Domain */}
          {!showDomainInput ? (
            <button onClick={() => setShowDomainInput(true)} className="w-full p-4 rounded-2xl border-2 border-dashed border-surface-300 dark:border-white/[0.12] text-surface-500 dark:text-surface-400 hover:border-brand-500/30 hover:text-brand-500 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Custom Domain
            </button>
          ) : (
            <div className="apple-card p-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                  <input value={newDomain} onChange={(e) => setNewDomain(e.target.value)} placeholder="app.yourcompany.com" className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-surface-100/80 dark:bg-white/[0.06] border border-surface-200/50 dark:border-transparent text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30" onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()} />
                </div>
                <button onClick={handleAddDomain} disabled={!newDomain.trim()} className="apple-button-primary"><Plus className="w-4 h-4" /> Add</button>
                <button onClick={() => setShowDomainInput(false)} className="p-2.5 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all"><X className="w-4 h-4" /></button>
              </div>
              <p className="text-xs text-surface-400 mt-2">Point a CNAME record to <code className="px-1 py-0.5 rounded bg-surface-100 dark:bg-white/[0.06] text-surface-600 font-mono">app.momentum.ai</code></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
