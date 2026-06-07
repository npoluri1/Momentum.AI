'use client';

import { useState } from 'react';
import {
  FileText, Search, Folder, Download, Star,
  Trash2, Clock, User, Plus, Grid3X3, List,
  File, Image, FileSpreadsheet, FileCode,
  Sparkles, ArrowUpDown, Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const folders = [
  { name: 'Project Files', count: 24, icon: Folder, color: 'text-brand-500' },
  { name: 'Templates', count: 12, icon: Folder, color: 'text-intelligence-500' },
  { name: 'Reports', count: 8, icon: Folder, color: 'text-execution-500' },
  { name: 'Archived', count: 15, icon: Folder, color: 'text-surface-400' },
];

const documents = [
  { name: 'Q4 Strategy Document', type: 'doc', modified: '2h ago', owner: 'Sarah Chen', size: '2.4 MB', icon: FileText, color: 'from-blue-500 to-cyan-600' },
  { name: 'API Design Specs', type: 'code', modified: '5h ago', owner: 'Mike Ross', size: '1.8 MB', icon: FileCode, color: 'from-violet-500 to-purple-600' },
  { name: 'Q3 Financial Report', type: 'sheet', modified: '1d ago', owner: 'Alice Wu', size: '3.2 MB', icon: FileSpreadsheet, color: 'from-emerald-500 to-teal-600' },
  { name: 'Brand Guidelines v3', type: 'image', modified: '2d ago', owner: 'James Wilson', size: '15.7 MB', icon: Image, color: 'from-rose-500 to-pink-600' },
  { name: 'Product Roadmap', type: 'doc', modified: '3d ago', owner: 'Emma Liu', size: '1.1 MB', icon: FileText, color: 'from-amber-500 to-orange-600' },
  { name: 'Meeting Notes - Sprint 12', type: 'doc', modified: '4d ago', owner: 'David Park', size: '0.8 MB', icon: FileText, color: 'from-sky-500 to-blue-600' },
  { name: 'User Research Findings', type: 'doc', modified: '5d ago', owner: 'Lisa Brown', size: '4.5 MB', icon: FileText, color: 'from-indigo-500 to-violet-600' },
  { name: 'Deployment Scripts', type: 'code', modified: '1w ago', owner: 'Tom Harris', size: '0.3 MB', icon: FileCode, color: 'from-green-500 to-emerald-600' },
  { name: 'Marketing Assets Bundle', type: 'image', modified: '1w ago', owner: 'Sarah Chen', size: '45.2 MB', icon: Image, color: 'from-orange-500 to-red-600' },
];

const sortOptions = ['Name', 'Date Modified', 'Type', 'Size'];

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Date Modified');

  const filtered = documents.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full p-6 md:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">Documents</h1>
          <p className="text-sm text-surface-500 mt-1">{documents.length} files · {folders.reduce((s, f) => s + f.count, 0)} total items</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="apple-button-primary">
            <Plus className="w-4 h-4" /> Upload
          </button>
          <button className="apple-button-secondary">
            <Sparkles className="w-4 h-4" /> Generate with AI
          </button>
          <div className="flex items-center bg-surface-100/80 dark:bg-white/[0.06] rounded-xl p-0.5 border border-surface-200/50 dark:border-white/[0.06]">
            <button onClick={() => setViewMode('grid')} className={cn('p-2 rounded-lg transition-all', viewMode === 'grid' ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm' : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300')}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={cn('p-2 rounded-lg transition-all', viewMode === 'list' ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm' : 'text-surface-400 hover:text-surface-600 dark:hover:text-surface-300')}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-7">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="apple-input pl-10"
          />
        </div>
        <button className="apple-button-secondary flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </button>
        <button className="apple-button-secondary flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4" /> {sortBy}
        </button>
      </div>

      {/* Folders */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {folders.map((folder) => {
          const FolderIcon = folder.icon;
          return (
            <div key={folder.name} className="apple-card p-4 flex items-center gap-3 cursor-pointer hover:bg-surface-50 dark:hover:bg-white/[0.04] transition-all group">
              <div className={cn('w-10 h-10 rounded-xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center group-hover:scale-110 transition-transform', folder.color)}>
                <FolderIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-900 dark:text-white">{folder.name}</p>
                <p className="text-xs text-surface-400">{folder.count} files</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Documents Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc, i) => {
            const DocIcon = doc.icon;
            return (
              <div
                key={doc.name}
                className="apple-card p-5 cursor-pointer group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn('w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-sm', doc.color)}>
                    <DocIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06]">
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06]">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-500/10 dark:hover:bg-danger-500/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1 group-hover:text-brand-500 transition-colors">{doc.name}</h3>
                <div className="flex items-center gap-2 text-xs text-surface-400 mb-3">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {doc.modified}</span>
                  <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
                  <span>{doc.size}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-surface-100/50 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2 text-xs text-surface-500">
                    <User className="w-3 h-3" />
                    <span>{doc.owner}</span>
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-surface-400 bg-surface-50 dark:bg-white/[0.04] px-2 py-0.5 rounded-md">{doc.type}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="apple-card divide-y divide-surface-100/50 dark:divide-white/[0.04]">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold text-surface-400 uppercase tracking-wider">
            <span className="col-span-4">Name</span>
            <span className="col-span-2">Type</span>
            <span className="col-span-2">Size</span>
            <span className="col-span-2">Modified</span>
            <span className="col-span-2">Owner</span>
          </div>
          {filtered.map((doc) => {
            const DocIcon = doc.icon;
            return (
              <div key={doc.name} className="grid grid-cols-12 gap-4 px-5 py-3.5 text-sm items-center hover:bg-surface-50/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer group">
                <div className="col-span-4 flex items-center gap-3">
                  <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0', doc.color)}>
                    <DocIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-surface-900 dark:text-white truncate">{doc.name}</span>
                </div>
                <span className="col-span-2 text-xs text-surface-400 uppercase">{doc.type}</span>
                <span className="col-span-2 text-xs text-surface-500">{doc.size}</span>
                <span className="col-span-2 text-xs text-surface-500">{doc.modified}</span>
                <div className="col-span-2 flex items-center justify-between">
                  <span className="text-xs text-surface-500">{doc.owner}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 rounded text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-white/[0.06]">
                      <Download className="w-3 h-3" />
                    </button>
                    <button className="p-1 rounded text-surface-400 hover:text-danger-500 hover:bg-danger-500/10">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-surface-400" />
          </div>
          <p className="text-surface-500 dark:text-surface-400">No documents found matching your search</p>
        </div>
      )}
    </div>
  );
}
