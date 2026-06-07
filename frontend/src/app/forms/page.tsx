'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  FileText, Plus, Search, Copy, Edit3,
  Trash2, Check, X, ChevronRight, Sparkles,
  Bot, Workflow, Users, BarChart3, Clock,
  Globe, Download, Upload, Share2, Zap,
  MessageSquare, Calendar, ArrowRight, AlertCircle,
  RefreshCw, ExternalLink, Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

const formTemplates = [
  { name: 'Contact Form', desc: 'Simple contact form with name, email, message fields', responses: 234, fields: 4, color: 'from-brand-500 to-rose-500' },
  { name: 'Lead Capture', desc: 'Capture leads with company, role, and interest fields', responses: 189, fields: 6, color: 'from-intelligence-500 to-violet-500' },
  { name: 'Feedback Survey', desc: 'Collect feedback with rating scale and open text', responses: 567, fields: 5, color: 'from-warning-500 to-orange-500' },
  { name: 'Job Application', desc: 'Full job application with resume upload and screening', responses: 89, fields: 12, color: 'from-success-500 to-emerald-500' },
  { name: 'Event Registration', desc: 'Register attendees with session selection and payment', responses: 345, fields: 8, color: 'from-execution-500 to-cyan-500' },
  { name: 'Bug Report', desc: 'Report bugs with severity, steps to reproduce, screenshots', responses: 456, fields: 7, color: 'from-danger-500 to-rose-500' },
  { name: 'Order Form', desc: 'Place orders with product selection, quantity, shipping', responses: 678, fields: 10, color: 'from-memory-500 to-blue-500' },
  { name: 'Custom Form', desc: 'Start from scratch or describe what you need', responses: 0, fields: 0, color: 'from-surface-500 to-surface-600', custom: true },
];

const myForms = [
  { id: 'f1', name: 'Customer Feedback Q2 2026', responses: 234, fields: 5, status: 'active', updated: '2 hours ago', submissions: 12 },
  { id: 'f2', name: 'Product Waitlist', responses: 89, fields: 4, status: 'active', updated: '1 day ago', submissions: 5 },
  { id: 'f3', name: 'Employee Satisfaction Survey', responses: 45, fields: 8, status: 'draft', updated: '3 days ago', submissions: 0 },
  { id: 'f4', name: 'Webinar Registration', responses: 156, fields: 6, status: 'active', updated: '5 days ago', submissions: 23 },
];

const triggerOptions = [
  { id: 'agent', label: 'Notify AI Agent', desc: 'Trigger an AI agent to process submissions', icon: Bot },
  { id: 'workflow', label: 'Run Workflow', desc: 'Execute an automation workflow', icon: Workflow },
  { id: 'email', label: 'Send Email', desc: 'Send notification to team or submitter', icon: MessageSquare },
  { id: 'webhook', label: 'Webhook', desc: 'POST data to an external URL', icon: Globe },
  { id: 'task', label: 'Create Task', desc: 'Create a new task from each submission', icon: FileText },
  { id: 'slack', label: 'Slack Message', desc: 'Post submission to a Slack channel', icon: Zap },
];

export default function FormsPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'myforms'>('templates');
  const [showBuilder, setShowBuilder] = useState(false);
  const [showTriggers, setShowTriggers] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-xs font-medium text-brand-500 bg-brand-500/10 px-2.5 py-0.5 rounded-full">AI-Powered Forms</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white tracking-tight">Forms</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Build AI-powered forms that capture data and trigger workflows</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setShowBuilder(true); toast.success('Opening AI form builder...'); }} className="apple-button-primary">
            <Sparkles className="w-4 h-4" /> Generate with AI
          </button>
          <button onClick={() => setShowBuilder(true)} className="apple-button-secondary">
            <Plus className="w-4 h-4" /> Create Blank
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-200/50 dark:border-white/[0.06]">
        {[
          { id: 'templates' as const, label: 'Templates', icon: FileText },
          { id: 'myforms' as const, label: 'My Forms', icon: FileText },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all',
              activeTab === tab.id ? 'text-brand-500 border-brand-500' : 'text-surface-400 dark:text-surface-500 border-transparent hover:text-surface-600 dark:hover:text-surface-300'
            )}
          ><tab.icon className="w-4 h-4" />{tab.label}</button>
        ))}
      </div>

      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search form templates..." className="apple-input pl-10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {formTemplates.map((t, i) => (
              <div key={t.name} className="apple-card p-5 cursor-pointer hover:ring-2 hover:ring-brand-500/20 transition-all group" style={{ animationDelay: `${i * 40}ms` }} onClick={() => toast.success(`Opening ${t.name} template`)}>
                <div className={cn('w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-3 group-hover:scale-110 transition-transform', t.color)}>
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1">{t.name}</h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-3 line-clamp-2">{t.desc}</p>
                <div className="flex items-center justify-between pt-3 border-t border-surface-100/50 dark:border-white/[0.06] text-[11px] text-surface-400">
                  <span>{t.fields} fields</span>
                  <span>{t.responses.toLocaleString()} responses</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'myforms' && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input placeholder="Search my forms..." className="apple-input pl-10" />
            </div>
            <select className="text-xs px-3 py-2.5 rounded-xl bg-surface-100/80 dark:bg-white/[0.06] border border-surface-200/50 dark:border-transparent text-surface-600 dark:text-surface-300">
              <option>All Status</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
          </div>
          {myForms.map((form, i) => (
            <div key={form.id} className="apple-card p-4 hover:ring-2 hover:ring-brand-500/20 transition-all cursor-pointer" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', form.status === 'active' ? 'bg-success-500/10 text-success-500' : 'bg-warning-500/10 text-warning-500')}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{form.name}</p>
                      <span className={cn('px-1.5 py-0.5 text-[10px] font-medium rounded-full border', form.status === 'active' ? 'text-success-500 bg-success-500/10 border-success-500/20' : 'text-warning-500 bg-warning-500/10 border-warning-500/20')}>
                        {form.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-surface-400 mt-0.5">
                      <span>{form.fields} fields</span>
                      <span>{form.submissions} new submissions</span>
                      <span>Updated {form.updated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setShowTriggers(true)} className="p-2 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all" title="Configure triggers">
                    <Zap className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all" title="Share form">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all" title="View submissions">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trigger Config Modal */}
      {showTriggers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowTriggers(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-2xl animate-scale-in overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-warning-500/10 flex items-center justify-center"><Zap className="w-5 h-5 text-warning-500" /></div>
                <div><h2 className="text-base font-semibold text-surface-900 dark:text-white">Configure Triggers</h2><p className="text-xs text-surface-400">Choose what happens when a form is submitted</p></div>
              </div>
              <button onClick={() => setShowTriggers(false)} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-5 py-4 space-y-2">
              {triggerOptions.map(t => {
                const Icon = t.icon;
                return (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl border border-surface-200/50 dark:border-white/[0.06] hover:border-brand-500/20 hover:bg-brand-500/5 transition-all cursor-pointer">
                    <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-white/[0.04] flex items-center justify-center"><Icon className="w-4 h-4 text-surface-500" /></div>
                    <div className="flex-1"><p className="text-sm font-semibold text-surface-900 dark:text-white">{t.label}</p><p className="text-xs text-surface-400">{t.desc}</p></div>
                    <ChevronRight className="w-4 h-4 text-surface-300" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


