'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff, Zap, RefreshCw, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (online) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-success-500/10 flex items-center justify-center mx-auto mb-4">
            <Wifi className="w-8 h-8 text-success-500" />
          </div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-white mb-1">You're back online!</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">Your changes will sync automatically.</p>
          <Link href="/workspace/dashboard" className="apple-button-primary inline-flex">
            <Zap className="w-4 h-4" /> Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-warning-50 dark:bg-warning-500/10 flex items-center justify-center mx-auto mb-5 border border-warning-200/30 dark:border-warning-500/20">
          <WifiOff className="w-10 h-10 text-warning-500" />
        </div>

        <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">You're offline</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mb-8 leading-relaxed">
          Don't worry — Momentum AI saves your work locally. Your changes will sync automatically when you're back online.
        </p>

        <div className="apple-card p-4 mb-6 text-left">
          <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">What you can do offline</p>
          <div className="space-y-2.5">
            {[
              { icon: Sparkles, text: 'Browse your workspace and projects' },
              { icon: Clock, text: 'Review recent activity' },
              { icon: RefreshCw, text: 'Changes sync when reconnected' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-2.5 text-sm text-surface-600 dark:text-surface-400">
                  <div className="w-7 h-7 rounded-lg bg-surface-100 dark:bg-white/[0.04] flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-brand-500" />
                  </div>
                  {item.text}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="apple-button-primary"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    </div>
  );
}
