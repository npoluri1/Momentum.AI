'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  MessageSquare,
  Settings,
  LogOut,
  User,
  Building2,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  timestamp: Date;
}

interface TopbarProps {
  onMenuToggle?: () => void;
  sidebarCollapsed?: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Task completed',
    message: 'AI agent finished data analysis for Q4 report',
    type: 'success',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    title: 'New team member',
    message: 'Sarah Chen joined the Design team',
    type: 'info',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '3',
    title: 'Automation failed',
    message: 'Slack integration encountered an error',
    type: 'error',
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: '4',
    title: 'Project deadline',
    message: 'Website redesign is due in 2 days',
    type: 'warning',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: '5',
    title: 'New integration',
    message: 'GitHub integration is now active',
    type: 'success',
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
  },
];

export function Topbar({ onMenuToggle, sidebarCollapsed }: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const notifTypeStyles: Record<string, string> = {
    info: 'bg-brand-500',
    warning: 'bg-warning-500',
    success: 'bg-success-500',
    error: 'bg-danger-500',
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-[var(--topbar-height)] bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-200/50 dark:border-surface-800/50 z-30 transition-all duration-300',
        sidebarCollapsed
          ? 'left-[var(--sidebar-collapsed-width)]'
          : 'left-[var(--sidebar-width)]'
      )}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg text-surface-500 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-64 md:w-80 pl-9 pr-3 py-2 text-sm rounded-lg bg-surface-100 dark:bg-surface-800 border border-transparent focus:border-brand-500/50 focus:bg-white dark:focus:bg-surface-800 text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            />
            {searchOpen && (
              <div className="absolute top-full mt-2 left-0 w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 shadow-xl py-2 animate-slide-down">
                <div className="px-3 py-2 text-xs text-surface-400 font-semibold uppercase tracking-wider">
                  Quick Actions
                </div>
                {['Create new project', 'Invite team members', 'Run automation', 'View reports'].map(
                  (action) => (
                    <button
                      key={action}
                      className="w-full px-3 py-2 text-left text-sm text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    >
                      {action}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dropdown
            trigger={
              <button
                className={cn(
                  'hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
                  'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200',
                  'hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors'
                )}
              >
                <Building2 className="w-4 h-4" />
                <span>Acme Corp</span>
                <ChevronDown className="w-3.5 h-3.5 text-surface-400" />
              </button>
            }
            items={[
              { key: 'org1', label: 'Acme Corp', onClick: () => {} },
              { key: 'org2', label: 'Startup Inc', onClick: () => {} },
              { key: 'divider', label: '', divider: true, onClick: () => {} },
              { key: 'create', label: 'Create Organization', onClick: () => {} },
            ]}
          />

          <button
            onClick={toggleTheme}
            className={cn(
              'p-2 rounded-lg text-surface-500 hover:text-surface-700 dark:hover:text-surface-200',
              'hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors'
            )}
          >
            {mounted && theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className={cn(
                'relative p-2 rounded-lg text-surface-500 hover:text-surface-700 dark:hover:text-surface-200',
                'hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors'
              )}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[10px] font-bold rounded-full bg-danger-500 text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 md:w-96 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 shadow-xl animate-slide-down">
                <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200 dark:border-surface-700">
                  <span className="text-sm font-semibold">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-brand-500 hover:text-brand-600 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-surface-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={cn(
                          'w-full text-left px-4 py-3 transition-colors hover:bg-surface-50 dark:hover:bg-surface-700/50',
                          !notif.read && 'bg-brand-50/50 dark:bg-brand-950/20'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'w-2 h-2 rounded-full mt-1.5 shrink-0',
                              notifTypeStyles[notif.type]
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{notif.title}</p>
                            <p className="text-xs text-surface-500 mt-0.5 truncate">
                              {notif.message}
                            </p>
                            <p className="text-xs text-surface-400 mt-1">
                              {formatNotifTime(notif.timestamp)}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <div className="border-t border-surface-200 dark:border-surface-700 px-4 py-2.5">
                  <button className="w-full text-center text-sm text-brand-500 hover:text-brand-600 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <Dropdown
            trigger={
              <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                <Avatar name="John Doe" size="sm" status="online" />
                <ChevronDown className="w-3.5 h-3.5 text-surface-400 hidden md:block" />
              </button>
            }
            align="right"
            items={[
              { key: 'profile', label: 'Profile', icon: <User className="w-4 h-4" />, onClick: () => {} },
              { key: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" />, onClick: () => {} },
              { key: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, onClick: () => {} },
              { key: 'divider', label: '', divider: true, onClick: () => {} },
              { key: 'logout', label: 'Sign Out', icon: <LogOut className="w-4 h-4" />, danger: true, onClick: () => {} },
            ]}
          />
        </div>
      </div>
    </header>
  );
}

function formatNotifTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
