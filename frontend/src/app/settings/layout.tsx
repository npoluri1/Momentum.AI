'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  Building2,
  Users,
  Bell,
  Palette,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User, href: '/settings?tab=profile' },
  { id: 'organization', label: 'Organization', icon: Building2, href: '/settings?tab=organization' },
  { id: 'team', label: 'Team', icon: Users, href: '/settings?tab=team' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/settings?tab=notifications' },
  { id: 'appearance', label: 'Appearance', icon: Palette, href: '/settings?tab=appearance' },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentTab = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('tab') || 'profile'
    : 'profile';

  return (
    <div className="flex gap-0 lg:gap-8 max-w-7xl mx-auto">
      <div className="hidden lg:block w-64 shrink-0">
        <nav className="sticky top-24 space-y-1">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Settings</h2>
            <p className="text-sm text-surface-500">Manage your account and workspace</p>
          </div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = currentTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{tab.label}</span>
                <ChevronRight className={cn('w-3.5 h-3.5 transition-opacity', active ? 'opacity-100' : 'opacity-0')} />
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 min-w-0">
        <div className="lg:hidden mb-6">
          <h2 className="text-lg font-semibold mb-1">Settings</h2>
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = currentTab === tab.id;
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                    active
                      ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
