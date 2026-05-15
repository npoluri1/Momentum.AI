'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  FolderKanban,
  Users,
  Workflow,
  Puzzle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  BarChart3,
  MessageSquare,
  FileText,
  HelpCircle,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const mainNav: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Agents', href: '/dashboard/agents', icon: Bot, badge: 3 },
  { label: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
  { label: 'CRM', href: '/dashboard/crm', icon: Users },
  { label: 'Automations', href: '/dashboard/automations', icon: Workflow },
  { label: 'Integrations', href: '/dashboard/integrations', icon: Puzzle },
];

const secondaryNav: NavItem[] = [
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare, badge: 5 },
  { label: 'Documents', href: '/dashboard/documents', icon: FileText },
];

const bottomNav: NavItem[] = [
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Help', href: '/dashboard/help', icon: HelpCircle },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed: controlledCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [showProjects, setShowProjects] = useState(false);

  const collapsed = controlledCollapsed ?? internalCollapsed;

  const toggleCollapse = () => {
    if (onToggle) onToggle();
    else setInternalCollapsed(!internalCollapsed);
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  const renderNavItems = (items: NavItem[]) =>
    items.map((item) => {
      const Icon = item.icon;
      const active = isActive(item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'sidebar-item',
            active ? 'sidebar-item-active' : 'sidebar-item-inactive',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? item.label : undefined}
        >
          <Icon className="w-5 h-5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-brand-500 text-white min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </>
          )}
          {collapsed && item.badge && (
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold rounded-full bg-brand-500 text-white flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </Link>
      );
    });

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen flex flex-col border-r border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 z-40 transition-all duration-300',
        collapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]'
      )}
    >
      <div className={cn(
        'flex items-center h-16 border-b border-surface-200 dark:border-surface-800 px-4',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-brand-700">
              Global Tasks
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
          </Link>
        )}
        <button
          onClick={toggleCollapse}
          className={cn(
            'p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors',
            collapsed && 'hidden'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3 space-y-1">
        {renderNavItems(mainNav)}

        {!collapsed && (
          <>
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                Workspace
              </p>
            </div>
          </>
        )}
        {renderNavItems(secondaryNav)}
      </div>

      {!collapsed && (
        <div className="px-3 py-2 border-t border-surface-200 dark:border-surface-800">
          <button
            onClick={() => setShowProjects(!showProjects)}
            className="w-full sidebar-item sidebar-item-inactive"
          >
            <FolderKanban className="w-5 h-5 shrink-0" />
            <span className="flex-1 truncate">Quick Projects</span>
            <ChevronDown className={cn('w-4 h-4 transition-transform', showProjects && 'rotate-180')} />
          </button>
          {showProjects && (
            <div className="ml-8 mt-1 space-y-1">
              {['Website Redesign', 'Mobile App', 'Q4 Planning'].map((project) => (
                <Link
                  key={project}
                  href="#"
                  className="block px-3 py-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  {project}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={cn(
        'border-t border-surface-200 dark:border-surface-800 p-3',
        collapsed && 'flex flex-col items-center gap-2'
      )}>
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <Avatar name="John Doe" size="sm" status="online" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-surface-500 truncate">john@company.com</p>
            </div>
            <button className="p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <Avatar name="John Doe" size="sm" status="online" />
            <button className="p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {collapsed && (
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 flex items-center justify-center text-surface-400 hover:text-surface-600 shadow-sm"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </aside>
  );
}
