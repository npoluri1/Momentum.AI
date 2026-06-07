'use client';

import { useState, useEffect } from 'react';
import SiteNav from '@/components/layout/SiteNav';
import { cn } from '@/lib/utils';
import {
  ArrowUp, Rss, Bell, Sparkles, Zap, Wrench, AlertTriangle,
  CheckCircle, ChevronDown, Clock,
} from 'lucide-react';

type TagType = 'New' | 'Improved' | 'Fixed' | 'Deprecated';

interface VersionEntry {
  version: string;
  date: string;
  title: string;
  items: { tag: TagType; description: string }[];
  major?: boolean;
}

const tagStyles: Record<TagType, string> = {
  New: 'bg-memory-500/15 text-memory-500 border-memory-500/25',
  Improved: 'bg-execution-500/15 text-execution-500 border-execution-500/25',
  Fixed: 'bg-brand-500/15 text-brand-500 border-brand-500/25',
  Deprecated: 'bg-warning-500/15 text-warning-500 border-warning-500/25',
};

const versions: VersionEntry[] = [
  {
    version: 'v2.8.0',
    date: 'May 29, 2026',
    title: 'Custom Domains, Secured Faster',
    items: [
      { tag: 'New', description: 'Custom domains now provision automatically with SSL certificates in under 60 seconds' },
      { tag: 'Improved', description: 'Domain verification flow streamlined — just point your DNS and go' },
      { tag: 'Fixed', description: 'Edge case where subdomain provisioning failed on certain DNS providers' },
    ],
    major: true,
  },
  {
    version: 'v2.7.0',
    date: 'May 28, 2026',
    title: 'Automate from Agents, Teams & Media',
    items: [
      { tag: 'New', description: 'Agent decision triggers — start workflows based on what your AI agents choose to do' },
      { tag: 'New', description: 'Team member change triggers — react when users join, leave, or change roles' },
      { tag: 'New', description: 'Media upload triggers — kick off workflows when images, videos, or files are added' },
    ],
  },
  {
    version: 'v2.6.0',
    date: 'May 26, 2026',
    title: 'Connect Any Service, Keys Stay Safe',
    items: [
      { tag: 'New', description: 'Secure credential storage for API keys and secrets — encrypted at rest, never logged' },
      { tag: 'New', description: 'OAuth 2.0 PKCE flow for all new integrations — no more sharing secrets' },
      { tag: 'Improved', description: 'Credential rotation UI with one-click refresh for connected services' },
    ],
  },
  {
    version: 'v2.5.0',
    date: 'May 15, 2026',
    title: 'AI Micro Apps & Genesis v2',
    items: [
      { tag: 'New', description: 'AI Micro Apps — lightweight single-purpose apps built from one prompt' },
      { tag: 'New', description: 'Genesis v2 app builder with improved memory wiring and faster generation' },
      { tag: 'Improved', description: 'App cloning now preserves all agent configurations and automation triggers' },
    ],
    major: true,
  },
  {
    version: 'v2.4.0',
    date: 'Apr 28, 2026',
    title: 'Workflow Engine v2',
    items: [
      { tag: 'New', description: 'Conditional branching with if/else logic in workflow automations' },
      { tag: 'New', description: 'Wait-for-condition blocks that pause workflows until criteria are met' },
      { tag: 'Improved', description: 'Drag-and-drop step builder with live preview and instant feedback' },
    ],
  },
  {
    version: 'v2.3.0',
    date: 'Apr 10, 2026',
    title: 'Agent Teams',
    items: [
      { tag: 'New', description: 'Multi-agent collaboration — agents can hand off tasks and co-edit projects' },
      { tag: 'New', description: 'Agent role definitions — assign specific roles like researcher, writer, reviewer' },
      { tag: 'Fixed', description: 'Agent memory conflict resolution when multiple agents access the same project' },
    ],
  },
  {
    version: 'v2.2.0',
    date: 'Mar 22, 2026',
    title: 'Integrations Hub',
    items: [
      { tag: 'New', description: 'Slack, Google Workspace, Microsoft 365, and 50+ app integrations' },
      { tag: 'New', description: 'Zapier and Make (Integromat) native connectors with 138+ total apps' },
      { tag: 'Improved', description: 'OAuth 2.0 token management with automatic refresh and rotation' },
    ],
  },
  {
    version: 'v2.1.0',
    date: 'Mar 1, 2026',
    title: 'Performance & Reliability',
    items: [
      { tag: 'Improved', description: 'Page load times reduced by 60% with code splitting and lazy loading' },
      { tag: 'Improved', description: 'Real-time collaboration latency reduced to under 100ms' },
      { tag: 'Fixed', description: 'Memory leak in long-running workspace sessions with many agents' },
    ],
  },
];

export default function ChangelogPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white dark:from-brand-950/10 dark:to-[#0a0a0f] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-execution-500/10 to-memory-500/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative">
        <section className="pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
                <Sparkles className="w-4 h-4" />
                What&apos;s New
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                <span className="text-surface-900 dark:text-white">Changelog</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8">
                Track every update, improvement, and fix
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setSubscribed(!subscribed)}
                  className={cn(
                    'px-5 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center gap-2',
                    subscribed
                      ? 'bg-memory-500 text-white shadow-lg shadow-memory-500/25'
                      : 'border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06]'
                  )}
                >
                  <Bell className="w-4 h-4" />
                  {subscribed ? 'Subscribed' : 'Subscribe to updates'}
                </button>
                <button className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all flex items-center gap-2">
                  <Rss className="w-4 h-4" />
                  RSS Feed
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-surface-200 dark:bg-white/[0.08]" />

              <div className="space-y-10">
                {versions.map((entry, idx) => (
                  <div key={idx} className="relative pl-14">
                    <div className={cn(
                      'absolute left-2.5 w-[25px] h-[25px] rounded-full border-2 bg-white dark:bg-[#0a0a0f] flex items-center justify-center',
                      entry.major
                        ? 'border-brand-500 shadow-lg shadow-brand-500/25'
                        : 'border-surface-300 dark:border-white/[0.15]'
                    )}>
                      <div className={cn(
                        'w-2.5 h-2.5 rounded-full',
                        entry.major ? 'bg-brand-500' : 'bg-surface-400 dark:bg-surface-500'
                      )} />
                    </div>

                    <div className={cn(
                      'rounded-2xl border p-6 transition-all',
                      entry.major
                        ? 'border-brand-500/30 dark:border-brand-500/20 bg-gradient-to-br from-brand-50/50 to-white dark:from-brand-950/20 dark:to-[#0a0a0f]/60'
                        : 'border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40'
                    )}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h2 className={cn(
                              'text-xl font-bold',
                              entry.major
                                ? 'text-brand-600 dark:text-brand-400'
                                : 'text-surface-900 dark:text-white'
                            )}>
                              {entry.version}
                            </h2>
                            {entry.major && (
                              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-brand-500/15 text-brand-500 border border-brand-500/25 uppercase tracking-wider">
                                Major Release
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-surface-500 dark:text-surface-400 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {entry.date}
                          </p>
                        </div>
                        <div className="shrink-0">
                          <span className="text-lg font-bold text-surface-900 dark:text-white">
                            {entry.title}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mt-4">
                        {entry.items.map((item, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className={cn(
                              'shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-md border uppercase tracking-wider',
                              tagStyles[item.tag]
                            )}>
                              {item.tag}
                            </span>
                            <span className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                              {item.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-surface-50 dark:bg-white/[0.04] border border-surface-200 dark:border-white/[0.08]">
                <CheckCircle className="w-4 h-4 text-memory-500" />
                <span className="text-sm text-surface-500 dark:text-surface-400">
                  We ship often. Check back for the latest updates.
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-brand-500 text-white shadow-xl shadow-brand-500/30 hover:bg-brand-600 transition-all active:scale-90"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
