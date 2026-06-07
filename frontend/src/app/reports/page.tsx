'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  FileText, Download, Calendar, Clock, ArrowRight,
  ChevronRight, Plus, RefreshCw, Check, Globe,
  BarChart3, PieChart, Users, Bot, Workflow,
  DollarSign, Mail, Sparkles, X, Copy,
  Filter, Search,
} from 'lucide-react';
import toast from 'react-hot-toast';

const reportTemplates = [
  { name: 'Workspace Summary', desc: 'Overview of all workspace activity and metrics', icon: BarChart3, color: 'from-brand-500 to-rose-500', category: 'General' },
  { name: 'Task Completion', desc: 'Task progress, completion rates, and trends', icon: PieChart, color: 'from-success-500 to-emerald-500', category: 'Tasks' },
  { name: 'Agent Performance', desc: 'AI agent usage, success rates, and output metrics', icon: Bot, color: 'from-intelligence-500 to-violet-500', category: 'Agents' },
  { name: 'Pipeline Report', desc: 'CRM pipeline velocity, deal stages, and conversion', icon: DollarSign, color: 'from-warning-500 to-orange-500', category: 'CRM' },
  { name: 'User Activity', desc: 'User engagement, adoption, and growth metrics', icon: Users, color: 'from-memory-500 to-blue-500', category: 'Users' },
  { name: 'Workflow Audit', desc: 'Workflow execution history, failures, and performance', icon: Workflow, color: 'from-execution-500 to-cyan-500', category: 'Automation' },
  { name: 'Weekly Digest', desc: 'Weekly summary of all workspace activity', icon: Mail, color: 'from-purple-500 to-pink-500', category: 'General' },
  { name: 'Custom Report', desc: 'Build your own report with custom metrics', icon: FileText, color: 'from-surface-500 to-surface-600', category: 'Custom' },
];

const recentReports = [
  { name: 'Workspace Summary - Q2 2026', type: 'PDF', date: 'Jun 1, 2026', size: '2.4 MB', status: 'ready' },
  { name: 'Agent Performance - May 2026', type: 'CSV', date: 'May 31, 2026', size: '1.2 MB', status: 'ready' },
  { name: 'Weekly Digest - Week 22', type: 'PDF', date: 'May 29, 2026', size: '856 KB', status: 'ready' },
  { name: 'Pipeline Report - May 2026', type: 'XLSX', date: 'May 25, 2026', size: '3.1 MB', status: 'generating' },
];

const scheduledReports = [
  { name: 'Weekly Workspace Summary', frequency: 'Every Monday', format: 'PDF', recipients: 'team@company.com', enabled: true },
  { name: 'Daily Agent Log', frequency: 'Every day at 9AM', format: 'CSV', recipients: 'manager@company.com', enabled: true },
  { name: 'Monthly Pipeline Review', frequency: '1st of month', format: 'PDF', recipients: 'leadership@company.com', enabled: false },
];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  const filteredTemplates = reportTemplates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [activeTab, setActiveTab] = useState<'templates' | 'recent' | 'scheduled'>('templates');

  const handleGenerate = (name: string) => {
    setSelectedTemplate(name);
    setShowExportModal(true);
  };

  const handleExport = () => {
    toast.success(`Generating ${exportFormat.toUpperCase()} report...`);
    setShowExportModal(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-xs font-medium text-brand-500 bg-brand-500/10 px-2.5 py-0.5 rounded-full">
              {reportTemplates.length} templates
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white tracking-tight">Reports</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Generate, export, and schedule workspace reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success('Opening report scheduler...')}
            className="apple-button-secondary"
          >
            <Calendar className="w-4 h-4" /> Schedule
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className="apple-button-primary"
          >
            <FileText className="w-4 h-4" /> New Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-200/50 dark:border-white/[0.06]">
        {[
          { id: 'templates' as const, label: 'Templates', icon: FileText },
          { id: 'recent' as const, label: 'Recent Reports', icon: Clock },
          { id: 'scheduled' as const, label: 'Scheduled', icon: Calendar },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all',
              activeTab === tab.id
                ? 'text-brand-500 border-brand-500'
                : 'text-surface-400 dark:text-surface-500 border-transparent hover:text-surface-600 dark:hover:text-surface-300'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search report templates..."
              className="apple-input pl-10"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTemplates.map((t, i) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.name}
                  className="apple-card p-5 cursor-pointer hover:ring-2 hover:ring-brand-500/20 transition-all group"
                  style={{ animationDelay: `${i * 60}ms` }}
                  onClick={() => handleGenerate(t.name)}
                >
                  <div className={cn('w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform', t.color)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1">{t.name}</h3>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mb-3 line-clamp-2">{t.desc}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-surface-100/50 dark:border-white/[0.06]">
                    <span className="text-[10px] font-medium text-surface-400 bg-surface-50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">{t.category}</span>
                    <span className="text-brand-500 opacity-0 group-hover:opacity-100 transition-all"><ArrowRight className="w-4 h-4" /></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'recent' && (
        <div className="space-y-3">
          {recentReports.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
              <p className="text-sm text-surface-500 dark:text-surface-400">No reports generated yet</p>
            </div>
          ) : (
            recentReports.map((report, i) => (
              <div
                key={report.name}
                className="apple-card flex items-center gap-4 p-4"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0',
                  report.status === 'ready'
                    ? 'bg-brand-500/10 text-brand-500'
                    : 'bg-warning-500/10 text-warning-500'
                )}>
                  {report.type}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{report.name}</p>
                  <p className="text-xs text-surface-400">{report.date} · {report.size}</p>
                </div>
                <div className="flex items-center gap-2">
                  {report.status === 'ready' ? (
                    <>
                      <button
                        onClick={() => toast.success('Downloading...')}
                        className="p-2 rounded-xl bg-surface-100/80 dark:bg-white/[0.06] text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.1] transition-all"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { navigator.clipboard.writeText(report.name); toast.success('Copied!'); }}
                        className="p-2 rounded-xl bg-surface-100/80 dark:bg-white/[0.06] text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.1] transition-all"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-warning-500">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Generating...
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'scheduled' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-surface-500 dark:text-surface-400">{scheduledReports.filter(r => r.enabled).length} active schedules</p>
            <button className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Schedule
            </button>
          </div>
          {scheduledReports.map((report, i) => (
            <div
              key={report.name}
              className="apple-card p-5"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                    report.enabled ? 'bg-brand-500/10' : 'bg-surface-100 dark:bg-white/[0.04]'
                  )}>
                    <Calendar className={cn('w-5 h-5', report.enabled ? 'text-brand-500' : 'text-surface-400')} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-surface-900 dark:text-white">{report.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-surface-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {report.frequency}</span>
                      <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
                      <span className="flex items-center gap-1">{report.format}</span>
                      <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
                      <span className="flex items-center gap-1 truncate max-w-[200px]">{report.recipients}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toast.success(`Email preview sent to ${report.recipients}`)}
                    className="p-2 rounded-xl text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06] transition-all"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      toast.success(report.enabled ? 'Schedule paused' : 'Schedule resumed');
                    }}
                    className={cn(
                      'relative inline-flex h-6 w-11 rounded-full transition-colors border-2 border-transparent',
                      report.enabled ? 'bg-brand-500' : 'bg-surface-300 dark:bg-white/[0.12]'
                    )}
                  >
                    <span className={cn(
                      'inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                      report.enabled ? 'translate-x-5' : 'translate-x-0'
                    )} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowExportModal(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-intelligence-500 flex items-center justify-center shadow-sm">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-surface-900 dark:text-white">Export Report</h2>
                  <p className="text-xs text-surface-400 dark:text-surface-500">{selectedTemplate}</p>
                </div>
              </div>
              <button onClick={() => setShowExportModal(false)} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-2">Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'pdf', label: 'PDF', icon: FileText, desc: 'Formatted document' },
                    { value: 'csv', label: 'CSV', icon: BarChart3, desc: 'Spreadsheet data' },
                    { value: 'xlsx', label: 'XLSX', icon: BarChart3, desc: 'Excel workbook' },
                  ].map(f => (
                    <button
                      key={f.value}
                      onClick={() => setExportFormat(f.value)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all',
                        exportFormat === f.value
                          ? 'bg-brand-500/10 border-brand-500/30'
                          : 'bg-surface-50/50 dark:bg-white/[0.02] border-surface-200/50 dark:border-white/[0.06] hover:bg-surface-100/50 dark:hover:bg-white/[0.04]'
                      )}
                    >
                      <f.icon className={cn('w-5 h-5', exportFormat === f.value ? 'text-brand-500' : 'text-surface-400')} />
                      <span className={cn('text-xs font-semibold', exportFormat === f.value ? 'text-brand-500' : 'text-surface-600 dark:text-surface-300')}>{f.label}</span>
                      <span className="text-[10px] text-surface-400">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-2">Date Range</label>
                <select className="apple-input text-xs">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>This year</option>
                  <option>All time</option>
                  <option>Custom range</option>
                </select>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
                <Globe className="w-4 h-4 text-surface-400 shrink-0" />
                <p className="text-xs text-surface-400">Estimated size: ~2.5 MB</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-surface-200/50 dark:border-white/[0.06]">
              <button onClick={() => setShowExportModal(false)} className="px-4 py-2 text-sm font-semibold rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">Cancel</button>
              <button onClick={handleExport} className="apple-button-primary"><Download className="w-4 h-4" /> Generate Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
