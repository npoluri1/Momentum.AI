'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { Topbar } from './Topbar';

interface AppLayoutProps {
  children: React.ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: (collapsed: boolean) => void;
}

export function AppLayout({
  children,
  sidebarCollapsed: controlledCollapsed,
  onSidebarToggle,
}: AppLayoutProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const collapsed = controlledCollapsed ?? internalCollapsed;

  const handleSidebarToggle = () => {
    const next = !collapsed;
    if (onSidebarToggle) onSidebarToggle(next);
    else setInternalCollapsed(next);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity',
          mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileSidebarOpen(false)}
      />

      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:relative lg:transform-none',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <Sidebar collapsed={collapsed} onToggle={handleSidebarToggle} />
      </div>

      <div
        className={cn(
          'transition-all duration-300',
          collapsed ? 'lg:ml-[var(--sidebar-collapsed-width)]' : 'lg:ml-[var(--sidebar-width)]'
        )}
      >
        <Topbar
          sidebarCollapsed={collapsed}
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        <main
          className={cn(
            'pt-[var(--topbar-height)] min-h-screen p-4 md:p-6 lg:p-8',
            'transition-all duration-300'
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
