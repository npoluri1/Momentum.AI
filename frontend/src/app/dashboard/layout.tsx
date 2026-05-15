'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap, Search, Grid3X3, FolderKanban, Play, Bot,
  Share2, ChevronDown, Settings, Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { SearchModal } from '@/components/layout/SearchModal';

const recentNav = [
  { label: 'My Apps', icon: Grid3X3, href: '/dashboard' },
  { label: 'Projects', icon: FolderKanban, href: '/dashboard/projects' },
  { label: 'Media', icon: Play, href: '/dashboard/media' },
  { label: 'AI Agents', icon: Bot, href: '/dashboard/agents' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex h-screen bg-surface-950 text-surface-100 overflow-hidden">
      {mobileSidebar && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileSidebar(false)} />
      )}

      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-56 flex flex-col bg-surface-950 border-r border-surface-800/30 transition-transform duration-300',
        'lg:translate-x-0',
        mobileSidebar ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center gap-2.5 h-14 px-4 border-b border-surface-800/30 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 via-brand-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-brand-400 to-cyan-400">
            Taskade
          </span>
        </div>

        <div className="px-3 pt-3 pb-2 shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-surface-400 bg-surface-900/50 border border-surface-800/50 hover:bg-surface-800 hover:border-surface-700/50 transition-all group"
          >
            <Search className="w-4 h-4 shrink-0 text-surface-500 group-hover:text-surface-400" />
            <span className="flex-1 text-left">Search</span>
            <kbd className="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded bg-surface-800 text-surface-500 font-mono border border-surface-700/50">⌘K</kbd>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 scrollbar-thin">
          <p className="px-3 py-1.5 text-xs font-semibold text-surface-500 uppercase tracking-widest">Recent</p>
          {recentNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebar(false)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
                  active
                    ? 'bg-brand-500/10 text-brand-400 font-medium'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-5">
            <p className="px-3 py-1.5 text-xs font-semibold text-surface-500 uppercase tracking-widest">Shared</p>
            <div className="px-3 py-5 text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-surface-800/50 flex items-center justify-center">
                <Share2 className="w-4 h-4 text-surface-500" />
              </div>
              <p className="text-xs text-surface-500">No shared items</p>
            </div>
          </div>
        </div>

        <div className="px-3 py-3 border-t border-surface-800/30 shrink-0">
          <Link
            href="/dashboard/settings"
            onClick={() => setMobileSidebar(false)}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
              pathname.startsWith('/dashboard/settings')
                ? 'bg-brand-500/10 text-brand-400 font-medium'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
            )}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:pl-56">
        <header className="flex items-center justify-between h-14 px-4 md:px-6 border-b border-surface-800/30 bg-surface-950/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebar(true)}
              className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 cursor-pointer group">
              <span className="text-sm font-medium text-surface-200 group-hover:text-white transition-colors">Workspace</span>
              <ChevronDown className="w-3.5 h-3.5 text-surface-500 group-hover:text-surface-300 transition-colors" />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href="/dashboard/settings"
              className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <Avatar name="Nagasiva poluri" size="sm" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
