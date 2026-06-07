'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Download, X, FileText, Check, FileSpreadsheet,
  FileJson, File, Calendar, ChevronRight,
  RefreshCw, Archive,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ExportFormat {
  id: string;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  extensions: string;
}

const exportFormats: ExportFormat[] = [
  { id: 'csv', label: 'CSV', desc: 'Comma-separated values — open in Excel, Sheets', icon: FileSpreadsheet, color: 'from-emerald-500 to-emerald-600', extensions: '.csv' },
  { id: 'json', label: 'JSON', desc: 'Structured data format for developers', icon: FileJson, color: 'from-brand-500 to-rose-500', extensions: '.json' },
  { id: 'markdown', label: 'Markdown', desc: 'Formatted text with task checklists', icon: FileText, color: 'from-intelligence-500 to-violet-500', extensions: '.md' },
  { id: 'pdf', label: 'PDF', desc: 'Formatted document ready to share', icon: File, color: 'from-amber-500 to-orange-500', extensions: '.pdf' },
  { id: 'xlsx', label: 'Excel', desc: 'Microsoft Excel workbook format', icon: FileSpreadsheet, color: 'from-success-500 to-emerald-500', extensions: '.xlsx' },
  { id: 'taskade', label: 'Taskade', desc: 'Taskade-compatible workspace format', icon: FileJson, color: 'from-memory-500 to-blue-500', extensions: '.taskade.json' },
];

const scopeOptions = [
  { value: 'workspace', label: 'Full Workspace', desc: 'All projects, tasks, agents, and workflows' },
  { value: 'projects', label: 'Selected Projects', desc: 'Only the projects you choose' },
  { value: 'tasks', label: 'Tasks Only', desc: 'Export just the task data' },
  { value: 'contacts', label: 'Contacts & CRM', desc: 'CRM contacts and deal data' },
];

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  onExport?: (format: string, scope: string, options: any) => Promise<void>;
}

export function ExportModal({ open, onClose, onExport }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('csv');
  const [scope, setScope] = useState('workspace');
  const [includeCompleted, setIncludeCompleted] = useState(true);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [dateRange, setDateRange] = useState('all');
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    setProgress(0);
    for (let i = 0; i <= 100; i += 25) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 400));
    }
    if (onExport) {
      await onExport(selectedFormat, scope, {
        includeCompleted,
        includeArchived,
        dateRange,
      });
    }
    setDone(true);
    setExporting(false);
    toast.success(`Export complete — ${exportFormats.find(f => f.id === selectedFormat)?.label} file ready`);
    setTimeout(() => {
      onClose();
      setTimeout(() => {
        setDone(false);
        setProgress(0);
        setSelectedFormat('csv');
        setScope('workspace');
      }, 300);
    }, 2000);
  };

  if (!open) return null;

  const format = exportFormats.find(f => f.id === selectedFormat);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => !exporting && onClose()}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-2xl animate-scale-in overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', done ? 'bg-success-500/10' : 'bg-brand-500/10')}>
              {done ? <Check className="w-5 h-5 text-success-500" /> : <Download className="w-5 h-5 text-brand-500" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-surface-900 dark:text-white">{done ? 'Export Complete' : 'Export Data'}</h2>
              <p className="text-xs text-surface-400">{done ? 'Your file is ready for download' : 'Choose format and options for export'}</p>
            </div>
          </div>
          <button onClick={() => !exporting && onClose()} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-96 overflow-y-auto">
          {/* Format Selection */}
          <div>
            <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">Export Format</label>
            <div className="grid grid-cols-3 gap-2">
              {exportFormats.map(f => {
                const Icon = f.icon;
                const isSelected = selectedFormat === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => { setSelectedFormat(f.id); setDone(false); }}
                    className={cn(
                      'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all',
                      isSelected
                        ? 'border-brand-500 bg-brand-500/5'
                        : 'border-surface-200/50 dark:border-white/[0.06] hover:border-surface-300 dark:hover:border-white/[0.12]'
                    )}
                  >
                    <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center', f.color)}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-surface-900 dark:text-white">{f.label}</span>
                    <span className="text-[10px] text-surface-400">{f.extensions}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format Description */}
          {format && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
              <FileText className="w-4 h-4 text-surface-400 shrink-0" />
              <p className="text-xs text-surface-400">{format.desc}</p>
            </div>
          )}

          {/* Scope */}
          <div>
            <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">Export Scope</label>
            <div className="grid grid-cols-2 gap-2">
              {scopeOptions.map(s => (
                <button
                  key={s.value}
                  onClick={() => setScope(s.value)}
                  className={cn(
                    'flex flex-col items-start p-3 rounded-xl border-2 transition-all text-left',
                    scope === s.value
                      ? 'border-brand-500 bg-brand-500/5'
                      : 'border-surface-200/50 dark:border-white/[0.06] hover:border-surface-300 dark:hover:border-white/[0.12]'
                  )}
                >
                  <span className="text-xs font-semibold text-surface-900 dark:text-white">{s.label}</span>
                  <span className="text-[10px] text-surface-400 mt-0.5">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">Options</label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className={cn('w-4 h-4', includeCompleted ? 'text-success-500' : 'text-surface-300')} />
                  <span className="text-sm text-surface-700 dark:text-surface-300">Include completed tasks</span>
                </div>
                <button
                  onClick={() => setIncludeCompleted(!includeCompleted)}
                  className={cn('relative inline-flex h-5 w-9 rounded-full transition-colors border-2 border-transparent', includeCompleted ? 'bg-brand-500' : 'bg-surface-300 dark:bg-white/[0.12]')}
                >
                  <span className={cn('inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform', includeCompleted ? 'translate-x-4' : 'translate-x-0')} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Archive className={cn('w-4 h-4', includeArchived ? 'text-warning-500' : 'text-surface-300')} />
                  <span className="text-sm text-surface-700 dark:text-surface-300">Include archived items</span>
                </div>
                <button
                  onClick={() => setIncludeArchived(!includeArchived)}
                  className={cn('relative inline-flex h-5 w-9 rounded-full transition-colors border-2 border-transparent', includeArchived ? 'bg-brand-500' : 'bg-surface-300 dark:bg-white/[0.12]')}
                >
                  <span className={cn('inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform', includeArchived ? 'translate-x-4' : 'translate-x-0')} />
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1.5">Date Range</label>
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="apple-input text-xs">
                  <option value="all">All time</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>
            </div>
          </div>

          {/* Progress */}
          {exporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-surface-500">Exporting...</span>
                <span className="text-surface-400 font-mono">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface-200 dark:bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-intelligence-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {done && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-400 border border-success-200/50 dark:border-success-500/20">
              <Check className="w-4 h-4 shrink-0" />
              <p className="text-xs font-medium">Export complete — <strong>workspace-export{format?.extensions || '.csv'}</strong> ready</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-200/50 dark:border-white/[0.06]">
          <button onClick={onClose} disabled={exporting} className="text-sm font-semibold text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 transition-all disabled:opacity-50">Cancel</button>
          {!done && (
            <button onClick={handleExport} disabled={exporting} className="apple-button-primary">
              {exporting ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Exporting...</>
              ) : (
                <><Download className="w-4 h-4" /> Export as {format?.label || 'CSV'}</>
              )}
            </button>
          )}
          {done && (
            <button onClick={() => { onClose(); setTimeout(() => { setDone(false); setProgress(0); }, 300); }} className="apple-button-primary">
              <Check className="w-4 h-4" /> Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
