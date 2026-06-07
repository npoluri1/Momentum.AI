'use client';

import { useState } from 'react';
import {
  Monitor, Smartphone, Globe, Chrome, Apple,
  Download, CheckCircle, ChevronDown, ArrowRight,
  Sparkles, Wifi,
} from 'lucide-react';
import SiteNav from '@/components/layout/SiteNav';
import { cn } from '@/lib/utils';

const platforms = [
  {
    id: 'macos',
    name: 'macOS',
    icon: Monitor,
    description: 'Native app for Mac with Apple Silicon & Intel support.',
    version: '3.2.1',
    size: '84 MB',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 'windows',
    name: 'Windows',
    icon: Monitor,
    description: 'Full-featured desktop app for Windows 10 & 11.',
    version: '3.2.1',
    size: '92 MB',
    gradient: 'from-sky-500 to-cyan-600',
  },
  {
    id: 'linux',
    name: 'Linux',
    icon: Monitor,
    description: 'AppImage and Snap packages for all major distros.',
    version: '3.2.0',
    size: '78 MB',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'ios',
    name: 'iOS',
    icon: Smartphone,
    description: 'iPhone and iPad app with full sync and widgets.',
    version: '3.2.1',
    size: '36 MB',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'android',
    name: 'Android',
    icon: Smartphone,
    description: 'Android app with Material Design and offline mode.',
    version: '3.2.0',
    size: '32 MB',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    id: 'chrome',
    name: 'Chrome Extension',
    icon: Chrome,
    description: 'Quick access sidebar and page clipping for Chrome.',
    version: '2.8.4',
    size: '4 MB',
    gradient: 'from-rose-500 to-pink-600',
  },
];

const featureComparison = [
  { feature: 'Task Management', web: true, desktop: true, mobile: true },
  { feature: 'AI Agents', web: true, desktop: true, mobile: true },
  { feature: 'Offline Mode', web: false, desktop: true, mobile: true },
  { feature: 'Automations', web: true, desktop: true, mobile: false },
  { feature: 'Voice Commands', web: false, desktop: true, mobile: true },
  { feature: 'File Attachments', web: true, desktop: true, mobile: true },
  { feature: 'Real-time Sync', web: true, desktop: true, mobile: true },
  { feature: 'Keyboard Shortcuts', web: false, desktop: true, mobile: false },
  { feature: 'Push Notifications', web: true, desktop: false, mobile: true },
  { feature: 'Custom Themes', web: true, desktop: true, mobile: false },
];

const sysRequirements = [
  {
    platform: 'Desktop',
    items: [
      'macOS 12.0+ (Monterey) or later',
      'Windows 10 (64-bit) version 22H2+',
      'Ubuntu 20.04+, Fedora 38+, or equivalent',
      '8GB RAM minimum (16GB recommended)',
      '500MB free disk space',
      'Dual-core 2GHz processor or better',
      'Internet connection for sync features',
    ],
  },
  {
    platform: 'Mobile',
    items: [
      'iOS 16.0+ (iPhone XS or newer)',
      'Android 8.0+ (Oreo) or later',
      '2GB RAM minimum (4GB recommended)',
      '100MB free storage space',
      'Biometric authentication supported',
    ],
  },
  {
    platform: 'Browser',
    items: [
      'Chrome 100+, Firefox 100+, Safari 16+, Edge 100+',
      'JavaScript enabled',
      'Local storage enabled for offline support',
      'WebSocket support for real-time sync',
      'Cookies enabled for authentication',
    ],
  },
];

export default function DownloadPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (platformId: string) => {
    setDownloading(platformId);
    setTimeout(() => setDownloading(null), 2000);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <SiteNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200/50 dark:border-brand-800/50 text-sm font-medium text-brand-700 dark:text-brand-300 mb-4">
            <Sparkles className="w-4 h-4" /> Cross-Platform
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
            Download Momentum AI
          </h1>
          <p className="text-base text-surface-500 dark:text-surface-400">
            Available on all platforms. Work seamlessly across desktop, mobile, and web.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isDownloading = downloading === platform.id;
            return (
              <div
                key={platform.id}
                className="group rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-6 transition-all hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-0.5"
              >
                <div className={cn(
                  'w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-sm',
                  platform.gradient
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">{platform.name}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">{platform.description}</p>
                <div className="flex items-center gap-3 text-xs text-surface-400 mb-4">
                  <span>Version {platform.version}</span>
                  <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600" />
                  <span>{platform.size}</span>
                </div>
                <button
                  onClick={() => handleDownload(platform.id)}
                  className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Downloading...</>
                  ) : (
                    <><Download className="w-4 h-4" /> Download</>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Feature Comparison</h2>
            <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-800">
                    <th className="text-left px-5 py-3.5 font-semibold text-surface-900 dark:text-white">Feature</th>
                    <th className="text-center px-5 py-3.5 font-semibold text-surface-900 dark:text-white">
                      <div className="flex items-center justify-center gap-1.5">
                        <Globe className="w-4 h-4 text-brand-500" /> Web App
                      </div>
                    </th>
                    <th className="text-center px-5 py-3.5 font-semibold text-surface-900 dark:text-white">
                      <div className="flex items-center justify-center gap-1.5">
                        <Monitor className="w-4 h-4 text-brand-500" /> Desktop
                      </div>
                    </th>
                    <th className="text-center px-5 py-3.5 font-semibold text-surface-900 dark:text-white">
                      <div className="flex items-center justify-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-brand-500" /> Mobile
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {featureComparison.map((row) => (
                    <tr key={row.feature} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                      <td className="px-5 py-3 text-surface-700 dark:text-surface-300">{row.feature}</td>
                      <td className="px-5 py-3 text-center">
                        {row.web ? (
                          <CheckCircle className="w-4 h-4 text-success-500 mx-auto" />
                        ) : (
                          <span className="text-surface-300 dark:text-surface-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {row.desktop ? (
                          <CheckCircle className="w-4 h-4 text-success-500 mx-auto" />
                        ) : (
                          <span className="text-surface-300 dark:text-surface-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {row.mobile ? (
                          <CheckCircle className="w-4 h-4 text-success-500 mx-auto" />
                        ) : (
                          <span className="text-surface-300 dark:text-surface-600 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Scan to Download</h2>
            <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-6 text-center">
              <div className="w-44 h-44 mx-auto mb-4 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center border-2 border-dashed border-surface-300 dark:border-surface-600">
                <div className="text-center">
                  <Wifi className="w-10 h-10 text-surface-400 mx-auto mb-2" />
                  <div className="space-y-1">
                    <div className="w-24 h-2 mx-auto rounded-full bg-surface-300 dark:bg-surface-600" />
                    <div className="w-16 h-2 mx-auto rounded-full bg-surface-300 dark:bg-surface-600" />
                    <div className="w-20 h-2 mx-auto rounded-full bg-surface-300 dark:bg-surface-600" />
                    <div className="w-12 h-2 mx-auto rounded-full bg-surface-300 dark:bg-surface-600" />
                    <div className="w-8 h-2 mx-auto rounded-full bg-surface-300 dark:bg-surface-600" />
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-surface-900 dark:text-white mb-1">Mobile Downloads</p>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-4">Scan with your phone camera to download</p>
              <div className="flex items-center justify-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-surface-900 dark:bg-white text-white dark:text-surface-900 hover:bg-surface-800 dark:hover:bg-surface-200 transition-all">
                  <Apple className="w-4 h-4" /> App Store
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-surface-900 dark:bg-white text-white dark:text-surface-900 hover:bg-surface-800 dark:hover:bg-surface-200 transition-all">
                  <Globe className="w-4 h-4" /> Play Store
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">System Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sysRequirements.map((section) => (
              <div
                key={section.platform}
                className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-5"
              >
                <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">{section.platform}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-surface-600 dark:text-surface-400">
                      <CheckCircle className="w-3.5 h-3.5 text-success-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-8 border-t border-surface-200 dark:border-surface-800">
          <a href="#" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
            View all previous versions <ChevronDown className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
