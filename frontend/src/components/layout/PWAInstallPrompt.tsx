'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Download, X, Zap, Sparkles } from 'lucide-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed (display-mode: standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    // Check if already installed via localStorage
    if (localStorage.getItem('pwa-installed') === 'true') {
      setInstalled(true);
      return;
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setInstalled(true);
      setShowPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  // Also show prompt for returning visitors who haven't installed yet
  useEffect(() => {
    const hasDismissed = localStorage.getItem('pwa-dismissed') === 'true';
    if (!installed && !hasDismissed && !deferredPrompt) {
      const timer = setTimeout(() => {
        if (!localStorage.getItem('pwa-installed')) {
          setShowPrompt(true);
        }
      }, 30000); // Show after 30 seconds as a fallback
      return () => clearTimeout(timer);
    }
  }, [installed, deferredPrompt]);

  if (installed || !showPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up" style={{ maxWidth: '360px' }}>
      <div className="apple-card p-4 shadow-2xl border-brand-500/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-intelligence-500 flex items-center justify-center shadow-sm shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-surface-900 dark:text-white">Install Momentum AI</p>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">Get the best experience with offline support and instant access</p>
          </div>
          <button onClick={handleDismiss} className="p-1 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-1 flex-1">
            <Sparkles className="w-3 h-3 text-warning-500" />
            <span className="text-[10px] text-surface-400">Works offline</span>
          </div>
          <button onClick={handleInstall} className="apple-button-primary text-xs px-4 py-1.5">
            <Download className="w-3.5 h-3.5" /> Install
          </button>
        </div>
      </div>
    </div>
  );
}
