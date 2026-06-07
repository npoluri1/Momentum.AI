'use client';

import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  Upload, X, FileText, Check, AlertCircle,
  FileSpreadsheet, FileJson, File,
  ChevronRight, ArrowRight, RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ImportFormat {
  id: string;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  extensions: string[];
  mimeType: string;
}

const importFormats: ImportFormat[] = [
  { id: 'csv', label: 'CSV', desc: 'Import from CSV spreadsheets', icon: FileSpreadsheet, color: 'text-success-500 bg-success-500/10', extensions: ['.csv'], mimeType: 'text/csv' },
  { id: 'json', label: 'JSON', desc: 'Momentum JSON workspace format', icon: FileJson, color: 'text-brand-500 bg-brand-500/10', extensions: ['.json'], mimeType: 'application/json' },
  { id: 'markdown', label: 'Markdown', desc: 'Task lists from Markdown files', icon: FileText, color: 'text-intelligence-500 bg-intelligence-500/10', extensions: ['.md', '.markdown'], mimeType: 'text/markdown' },
  { id: 'taskade', label: 'Taskade', desc: 'Taskade workspace export', icon: File, color: 'text-memory-500 bg-memory-500/10', extensions: ['.json', '.zip'], mimeType: 'application/json' },
  { id: 'notion', label: 'Notion', desc: 'Notion database export (CSV/JSON)', icon: FileText, color: 'text-warning-500 bg-warning-500/10', extensions: ['.csv', '.json'], mimeType: 'text/csv' },
  { id: 'trello', label: 'Trello', desc: 'Trello JSON board export', icon: FileJson, color: 'text-execution-500 bg-execution-500/10', extensions: ['.json'], mimeType: 'application/json' },
];

const fieldMappingPresets: Record<string, { from: string; to: string }[]> = {
  csv: [
    { from: 'title / name / task', to: 'Task Title' },
    { from: 'description / notes / body', to: 'Description' },
    { from: 'status / stage / state', to: 'Status' },
    { from: 'assignee / owner / assigned to', to: 'Assignee' },
    { from: 'due date / deadline / date', to: 'Due Date' },
    { from: 'priority / level / importance', to: 'Priority' },
  ],
  json: [
    { from: 'title / name', to: 'Task Title' },
    { from: 'description', to: 'Description' },
    { from: 'status', to: 'Status' },
    { from: 'assignee', to: 'Assignee' },
    { from: 'dueDate / deadline', to: 'Due Date' },
    { from: 'priority', to: 'Priority' },
  ],
};

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport?: (format: string, data: any) => Promise<void>;
}

export function ImportModal({ open, onClose, onImport }: ImportModalProps) {
  const [step, setStep] = useState<'select' | 'upload' | 'mapping' | 'preview' | 'done'>('select');
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFormatSelect = (formatId: string) => {
    setSelectedFormat(formatId);
    setStep('upload');
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const format = importFormats.find(f => f.extensions.some(ext => droppedFile.name.toLowerCase().endsWith(ext)));
      if (format) {
        setSelectedFormat(format.id);
        setFile(droppedFile);
        setStep('mapping');
      } else {
        toast.error('Unsupported file format');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStep('mapping');
    }
  };

  const handleImport = async () => {
    if (!selectedFormat || !file) return;
    setImporting(true);
    // Simulate import progress
    for (let i = 0; i <= 100; i += 20) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 300));
    }
    if (onImport) {
      await onImport(selectedFormat, { fileName: file.name, size: file.size });
    }
    setStep('done');
    setImporting(false);
    setTimeout(() => {
      toast.success(`Imported ${file.name} successfully`);
      onClose();
      setStep('select');
      setFile(null);
      setProgress(0);
    }, 1500);
  };

  const handleReset = () => {
    setStep('select');
    setSelectedFormat(null);
    setFile(null);
    setProgress(0);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => !importing && onClose()}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-2xl animate-scale-in overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              step === 'done' ? 'bg-success-500/10' : 'bg-brand-500/10'
            )}>
              {step === 'done' ? (
                <Check className="w-5 h-5 text-success-500" />
              ) : (
                <Upload className="w-5 h-5 text-brand-500" />
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-surface-900 dark:text-white">
                {step === 'select' && 'Import Data'}
                {step === 'upload' && 'Upload File'}
                {step === 'mapping' && 'Map Fields'}
                {step === 'preview' && 'Preview Import'}
                {step === 'done' && 'Import Complete'}
              </h2>
              <p className="text-xs text-surface-400">
                {step === 'select' && 'Choose an import format'}
                {step === 'upload' && 'Select a file to import'}
                {step === 'mapping' && 'Map source fields to workspace fields'}
                {step === 'preview' && 'Review data before importing'}
                {step === 'done' && 'Data imported successfully'}
              </p>
            </div>
          </div>
          <button onClick={() => !importing && onClose()} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps Progress */}
        {step !== 'done' && (
          <div className="flex items-center gap-1 px-6 py-3 bg-surface-50/30 dark:bg-white/[0.02] border-b border-surface-200/30 dark:border-white/[0.04]">
            {['select', 'upload', 'mapping', 'preview'].map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all',
                  step === s ? 'bg-brand-500 text-white' :
                  ['select', 'upload', 'mapping', 'preview'].indexOf(step) > i ? 'bg-success-500 text-white' :
                  'bg-surface-200 dark:bg-white/[0.08] text-surface-400'
                )}>
                  {['select', 'upload', 'mapping', 'preview'].indexOf(step) > i ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span className={cn(
                  'text-[10px] font-medium capitalize',
                  step === s ? 'text-brand-500' : 'text-surface-400'
                )}>
                  {s === 'select' ? 'Format' : s}
                </span>
                {i < 3 && <ChevronRight className="w-3 h-3 text-surface-300 dark:text-surface-600 mx-1" />}
              </div>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5 max-h-96 overflow-y-auto">
          {/* Step 1: Select Format */}
          {step === 'select' && (
            <div className="grid grid-cols-2 gap-3">
              {importFormats.map(f => {
                const Icon = f.icon;
                const isSelected = selectedFormat === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => handleFormatSelect(f.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                      isSelected
                        ? 'border-brand-500 bg-brand-500/5'
                        : 'border-surface-200/50 dark:border-white/[0.06] hover:border-surface-300 dark:hover:border-white/[0.12] bg-surface-50/30 dark:bg-white/[0.02]'
                    )}
                  >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', f.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{f.label}</p>
                      <p className="text-[10px] text-surface-400 mt-0.5">{f.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step 2: Upload */}
          {step === 'upload' && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
                dragOver
                  ? 'border-brand-500 bg-brand-500/5'
                  : 'border-surface-200/50 dark:border-white/[0.08] hover:border-surface-300 dark:hover:border-white/[0.12]'
              )}
            >
              <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-surface-400" />
              </div>
              <p className="text-sm font-semibold text-surface-900 dark:text-white mb-1">
                Drop your file here
              </p>
              <p className="text-xs text-surface-400 mb-4">
                or click to browse
              </p>
              <span className="text-[10px] text-surface-400 bg-surface-100 dark:bg-white/[0.04] px-3 py-1.5 rounded-lg">
                {importFormats.find(f => f.id === selectedFormat)?.extensions.join(', ') || 'Supported formats'}
              </span>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} accept={importFormats.map(f => f.extensions).flat().join(',')} />
            </div>
          )}

          {/* Step 3: Field Mapping */}
          {step === 'mapping' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03]">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-brand-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{file?.name}</p>
                  <p className="text-xs text-surface-400">{(file?.size || 0) / 1024 < 1024 ? `${(file?.size || 0 / 1024).toFixed(1)} KB` : `${((file?.size || 0) / (1024 * 1024)).toFixed(1)} MB`}</p>
                </div>
                <button onClick={() => setStep('upload')} className="text-xs font-medium text-brand-500 hover:text-brand-600">Change</button>
              </div>

              <div>
                <p className="text-xs font-semibold text-surface-500 mb-2 uppercase tracking-wider">Field Mapping</p>
                <div className="space-y-2">
                  {(fieldMappingPresets[selectedFormat || 'csv'] || fieldMappingPresets.csv).map((mapping, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1 p-2.5 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/50 dark:border-white/[0.06]">
                        <p className="text-xs text-surface-500">{mapping.from}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-surface-400 shrink-0" />
                      <div className="flex-1 p-2.5 rounded-xl bg-brand-500/5 border border-brand-500/20">
                        <p className="text-xs font-medium text-brand-500">{mapping.to}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
                <AlertCircle className="w-4 h-4 text-surface-400 shrink-0" />
                <p className="text-xs text-surface-400">Auto-detected field mappings. Review and adjust as needed.</p>
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {step === 'preview' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-surface-200/50 dark:border-white/[0.06]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-50 dark:bg-white/[0.03]">
                      {['Title', 'Description', 'Status', 'Priority', 'Assignee'].map(h => (
                        <th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-surface-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { title: 'Design homepage hero', desc: 'Create hero section with gradient...', status: 'Todo', priority: 'High', assignee: 'Sarah C.' },
                      { title: 'Implement auth flow', desc: 'Set up JWT authentication...', status: 'In Progress', priority: 'Urgent', assignee: 'Alex R.' },
                      { title: 'Write API docs', desc: 'Document all REST endpoints...', status: 'Done', priority: 'Medium', assignee: 'John D.' },
                      { title: 'Setup CI/CD', desc: 'Configure GitHub Actions...', status: 'Todo', priority: 'High', assignee: 'Maria S.' },
                    ].map((row, i) => (
                      <tr key={i} className="border-t border-surface-100/50 dark:border-white/[0.04]">
                        <td className="px-3 py-2 text-xs text-surface-700 dark:text-surface-300">{row.title}</td>
                        <td className="px-3 py-2 text-xs text-surface-400 max-w-[200px] truncate">{row.desc}</td>
                        <td className="px-3 py-2">
                          <span className={cn(
                            'text-[10px] font-medium px-1.5 py-0.5 rounded-md',
                            row.status === 'Done' ? 'text-success-500 bg-success-500/10' :
                            row.status === 'In Progress' ? 'text-memory-500 bg-memory-500/10' :
                            'text-surface-500 bg-surface-100 dark:bg-white/[0.06]'
                          )}>{row.status}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={cn(
                            'text-[10px] font-medium',
                            row.priority === 'Urgent' ? 'text-danger-500' :
                            row.priority === 'High' ? 'text-warning-500' : 'text-surface-400'
                          )}>{row.priority}</span>
                        </td>
                        <td className="px-3 py-2 text-xs text-surface-400">{row.assignee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-surface-400 text-center">Showing 4 of ~24 rows — ready to import</p>
            </div>
          )}

          {/* Step 5: Done */}
          {step === 'done' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-success-500/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-success-500" />
              </div>
              <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">Import Complete</h3>
              <p className="text-sm text-surface-400 mb-2">{file?.name} has been imported successfully</p>
              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mt-4">
                {[
                  { label: 'Tasks', value: '24' },
                  { label: 'Projects', value: '3' },
                  { label: 'Contacts', value: '12' },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/50 dark:border-white/[0.06]">
                    <p className="text-lg font-bold text-surface-900 dark:text-white">{s.value}</p>
                    <p className="text-[10px] text-surface-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-200/50 dark:border-white/[0.06]">
          {step === 'select' && (
            <button onClick={onClose} className="text-sm font-semibold text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 transition-all">Cancel</button>
          )}
          {step === 'upload' && (
            <>
              <button onClick={() => setStep('select')} className="text-sm font-semibold text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 transition-all">Back</button>
              <div />
            </>
          )}
          {step === 'mapping' && (
            <>
              <button onClick={() => setStep('upload')} className="text-sm font-semibold text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 transition-all">Back</button>
              <button onClick={() => setStep('preview')} className="apple-button-primary"><ArrowRight className="w-4 h-4" /> Preview</button>
            </>
          )}
          {step === 'preview' && (
            <>
              <button onClick={() => setStep('mapping')} className="text-sm font-semibold text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 transition-all">Back</button>
              <button onClick={handleImport} disabled={importing} className="apple-button-primary">
                {importing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Importing... ({progress}%)</> : <><Upload className="w-4 h-4" /> Import {file?.name}</>}
              </button>
            </>
          )}
          {step === 'done' && (
            <>
              <button onClick={handleReset} className="text-sm font-semibold text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 transition-all flex items-center gap-1">
                <Upload className="w-4 h-4" /> Import Another
              </button>
              <button onClick={() => { onClose(); handleReset(); }} className="apple-button-primary">
                <Check className="w-4 h-4" /> Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
