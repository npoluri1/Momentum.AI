'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Database, FileText, Globe, Plus, Trash2,
  Search, Check, X, RefreshCw, Bot,
  Youtube, AlertCircle, Download, ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

const knowledgeSources = [
  { id: 'k1', name: 'Product Documentation.pdf', type: 'file', size: '2.4 MB', pages: 45, status: 'indexed', added: '2 days ago', chunks: 120 },
  { id: 'k2', name: 'Company Website', type: 'web', url: 'https://company.com', status: 'indexed', added: '3 days ago', chunks: 85 },
  { id: 'k3', name: 'Support Knowledge Base', type: 'web', url: 'https://help.company.com', status: 'indexed', added: '5 days ago', chunks: 230 },
  { id: 'k4', name: 'FAQ Document.docx', type: 'file', size: '856 KB', pages: 12, status: 'indexed', added: '1 week ago', chunks: 45 },
  { id: 'k5', name: 'Product Demo Transcript', type: 'youtube', url: 'https://youtube.com/watch?v=...', status: 'indexing', added: '1 hour ago', chunks: 0 },
  { id: 'k6', name: 'Competitor Analysis.xlsx', type: 'file', size: '1.2 MB', pages: 8, status: 'error', added: '2 hours ago', chunks: 0, error: 'Unsupported format' },
];

const sourceTypes = [
  { id: 'file', label: 'Files', icon: FileText, desc: 'Upload PDFs, docs, spreadsheets, and images', color: 'from-brand-500 to-rose-500' },
  { id: 'web', label: 'Websites', icon: Globe, desc: 'Scrape website content and documentation', color: 'from-intelligence-500 to-violet-500' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, desc: 'Transcribe and index video content', color: 'from-danger-500 to-rose-500' },
  { id: 'manual', label: 'Manual Input', icon: FileText, desc: 'Paste text directly as knowledge source', color: 'from-success-500 to-emerald-500' },
  { id: 'drive', label: 'Google Drive', icon: ExternalLink, desc: 'Sync files from Google Drive', color: 'from-warning-500 to-orange-500' },
  { id: 'dropbox', label: 'Dropbox', icon: Download, desc: 'Sync files from Dropbox', color: 'from-memory-500 to-blue-500' },
];

export default function AgentKnowledgePage() {
  const [activeAgents] = useState([
    { id: 'ag1', name: 'Lead Enricher', sources: 4, status: 'active' },
    { id: 'ag2', name: 'Content Writer', sources: 2, status: 'active' },
    { id: 'ag3', name: 'Support Agent', sources: 6, status: 'inactive' },
  ]);
  const [selectedAgent, setSelectedAgent] = useState('ag1');
  const [showAddSource, setShowAddSource] = useState(false);

  const agentSources = knowledgeSources.filter(k => k.status !== 'error');
  const totalChunks = agentSources.reduce((s, k) => s + k.chunks, 0);

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-xs font-medium text-database-500 bg-database-500/10 px-2.5 py-0.5 rounded-full">Agent Memory</span>
              </div>
              <h1 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">Knowledge Base</h1>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Train your AI agents on files, websites, and data sources</p>
            </div>
            <button onClick={() => setShowAddSource(true)} className="apple-button-primary"><Plus className="w-4 h-4" /> Add Source</button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Sources', value: knowledgeSources.length, icon: Database, color: 'text-brand-500', gradient: 'from-brand-500 to-rose-500' },
              { label: 'Indexed Chunks', value: totalChunks.toLocaleString(), icon: FileText, color: 'text-intelligence-500', gradient: 'from-intelligence-500 to-violet-500' },
              { label: 'Storage Used', value: '4.5 MB', icon: Database, color: 'text-success-500', gradient: 'from-success-500 to-emerald-500' },
              { label: 'Active Agents', value: activeAgents.filter(a => a.status === 'active').length, icon: Bot, color: 'text-memory-500', gradient: 'from-memory-500 to-blue-500' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="apple-stat-card">
                  <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mb-2', s.gradient)}><Icon className="w-4 h-4 text-white" /></div>
                  <p className="text-xl font-bold text-surface-900 dark:text-white">{s.value}</p>
                  <p className="text-xs text-surface-400">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Agent Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {activeAgents.map(agent => (
              <button key={agent.id} onClick={() => setSelectedAgent(agent.id)}
                className={cn('flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all', selectedAgent === agent.id ? 'bg-brand-500 text-white shadow-sm' : 'bg-surface-100/80 dark:bg-white/[0.06] text-surface-600 dark:text-surface-300')}
              >
                <Bot className="w-4 h-4" />{agent.name}<span className="text-[10px] opacity-70">({agent.sources})</span>
              </button>
            ))}
          </div>

          {/* Knowledge Sources */}
          <div className="space-y-2">
            {knowledgeSources.map((source, i) => {
              const typeConfig = sourceTypes.find(t => t.id === source.type);
              return (
                <div key={source.id} className={cn('flex items-center justify-between p-4 rounded-xl border transition-all', source.status === 'error' ? 'border-danger-200/50 dark:border-danger-500/20 bg-danger-50/30 dark:bg-danger-500/5' : 'border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:border-surface-300 dark:hover:border-white/[0.12]')}>
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', typeConfig?.color || 'bg-surface-100 dark:bg-white/[0.04]') + ' bg-opacity-10'}>
                      {source.type === 'file' && <FileText className="w-5 h-5 text-brand-500" />}
                      {source.type === 'web' && <Globe className="w-5 h-5 text-intelligence-500" />}
                      {source.type === 'youtube' && <Youtube className="w-5 h-5 text-danger-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-surface-900 dark:text-white">{source.name}</p>
                        <span className={cn('px-1.5 py-0.5 text-[9px] font-medium rounded-full border', source.status === 'indexed' ? 'text-success-500 bg-success-500/10 border-success-500/20' : source.status === 'indexing' ? 'text-warning-500 bg-warning-500/10 border-warning-500/20' : 'text-danger-500 bg-danger-500/10 border-danger-500/20')}>
                          {source.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-surface-400 mt-0.5">
                        {source.type === 'file' && <span>{source.size} · {source.pages} pages</span>}
                        {source.type === 'web' && <span className="truncate max-w-[200px]">{source.url}</span>}
                        {source.type === 'youtube' && <span>YouTube video</span>}
                        <span>·</span>
                        <span>Added {source.added}</span>
                        {source.chunks > 0 && <><span>·</span><span>{source.chunks} chunks</span></>}
                      </div>
                      {source.error && <p className="text-xs text-danger-500 mt-1">{source.error}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {source.status === 'indexing' && <RefreshCw className="w-4 h-4 text-warning-500 animate-spin" />}
                    <button onClick={() => toast.success('Source removed')} className="p-2 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Source Modal */}
      {showAddSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAddSource(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-2xl animate-scale-in overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-brand-500" />
                <div><h2 className="text-base font-semibold text-surface-900 dark:text-white">Add Knowledge Source</h2><p className="text-xs text-surface-400">Train your agent with data</p></div>
              </div>
              <button onClick={() => setShowAddSource(false)} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"><X className="w-4 h-4" /></button>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 gap-3">
              {sourceTypes.map(s => {
                const Icon = s.icon;
                return (
                  <button key={s.id} onClick={() => { toast.success(`Adding ${s.label} source...`); setShowAddSource(false); }} className="flex items-start gap-3 p-4 rounded-xl border border-surface-200/50 dark:border-white/[0.06] hover:border-brand-500/20 hover:bg-brand-500/5 transition-all text-left">
                    <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0', s.color)}><Icon className="w-5 h-5 text-white" /></div>
                    <div><p className="text-sm font-semibold text-surface-900 dark:text-white">{s.label}</p><p className="text-[10px] text-surface-400 mt-0.5">{s.desc}</p></div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
