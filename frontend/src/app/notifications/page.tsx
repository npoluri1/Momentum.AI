'use client';

import { useState } from 'react';
import {
  Bell, CheckCheck, Trash2, UserPlus, AtSign,
  CheckCircle2, MessageSquare, Bot, Workflow,
  TrendingUp, User, X, Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = ['All', 'Unread', 'Mentions', 'Updates'] as const;
type Tab = typeof tabs[number];

interface Notification {
  id: string;
  type: 'assigned' | 'mention' | 'complete' | 'comment' | 'agent' | 'workflow' | 'deal' | 'invite';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: '1', type: 'assigned', title: 'Assigned to "Q4 Budget Review"', description: 'Sarah Chen assigned you to a task in Finance Workspace', timestamp: '2m ago', read: false },
  { id: '2', type: 'mention', title: 'Mentioned in a comment', description: 'Alex mentioned you in "Update pricing page copy"', timestamp: '8m ago', read: false },
  { id: '3', type: 'complete', title: 'Task completed', description: 'John marked "Design new landing page" as complete', timestamp: '15m ago', read: false },
  { id: '4', type: 'comment', title: 'New comment on "SEO Audit"', description: 'Maria replied: "I reviewed the findings and..."', timestamp: '28m ago', read: false },
  { id: '5', type: 'agent', title: 'AI Agent finished research', description: 'Lead Enricher processed 45 new leads from Q2 campaign', timestamp: '42m ago', read: false },
  { id: '6', type: 'workflow', title: 'Workflow "Daily Sync" completed', description: 'Data sync between CRM and HubSpot finished successfully', timestamp: '1h ago', read: false },
  { id: '7', type: 'deal', title: 'Deal moved to "Negotiation"', description: 'Acme Corp - $24k deal moved by Rachel from Proposal', timestamp: '1h ago', read: false },
  { id: '8', type: 'invite', title: 'Invited to "Marketing Team"', description: 'You have been invited to join the Marketing workspace', timestamp: '2h ago', read: false },
  { id: '9', type: 'assigned', title: 'Assigned to "Server Migration"', description: 'DevOps team assigned you infrastructure migration tasks', timestamp: '3h ago', read: true },
  { id: '10', type: 'mention', title: 'Mentioned in "Project Alpha"', description: 'Priya mentioned you in the weekly standup thread', timestamp: '4h ago', read: true },
  { id: '11', type: 'complete', title: 'Sprint retrospective done', description: 'Team completed sprint review with 32 story points', timestamp: '5h ago', read: true },
  { id: '12', type: 'agent', title: 'Content Writer published post', description: 'AI drafted and published "10 SEO Tips for 2026"', timestamp: '6h ago', read: true },
  { id: '13', type: 'workflow', title: 'Invoice workflow triggered', description: 'Monthly billing automation sent 128 invoices', timestamp: '8h ago', read: true },
  { id: '14', type: 'deal', title: 'Deal closed "TechStart Pro"', description: '$18k deal closed by Michael - congratulations!', timestamp: '12h ago', read: true },
  { id: '15', type: 'comment', title: 'Replied to your thread', description: 'David commented on your feature request post', timestamp: '1d ago', read: true },
];

const typeStyles: Record<string, { bg: string; iconBg: string; Icon: typeof Bell }> = {
  assigned: { bg: 'bg-blue-50 dark:bg-blue-950/30', iconBg: 'bg-blue-500', Icon: User },
  mention: { bg: 'bg-purple-50 dark:bg-purple-950/30', iconBg: 'bg-purple-500', Icon: AtSign },
  complete: { bg: 'bg-success-50 dark:bg-success-950/30', iconBg: 'bg-success-500', Icon: CheckCircle2 },
  comment: { bg: 'bg-brand-50 dark:bg-brand-950/30', iconBg: 'bg-brand-500', Icon: MessageSquare },
  agent: { bg: 'bg-intelligence-50 dark:bg-intelligence-950/30', iconBg: 'bg-intelligence-500', Icon: Bot },
  workflow: { bg: 'bg-execution-50 dark:bg-execution-950/30', iconBg: 'bg-execution-500', Icon: Workflow },
  deal: { bg: 'bg-warning-50 dark:bg-warning-950/30', iconBg: 'bg-warning-500', Icon: TrendingUp },
  invite: { bg: 'bg-memory-50 dark:bg-memory-950/30', iconBg: 'bg-memory-500', Icon: UserPlus },
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.read;
    if (activeTab === 'Mentions') return n.type === 'mention';
    if (activeTab === 'Updates') return ['agent', 'workflow', 'deal', 'complete'].includes(n.type);
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-500 text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all flex items-center gap-1.5"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark All as Read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-surface-300 dark:border-surface-600 text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-950/30 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                activeTab === tab
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                  : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'
              )}
            >
              {tab}
              {tab === 'Unread' && unreadCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-white/20 text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center border border-surface-200 dark:border-surface-700">
              {activeTab === 'Unread' ? (
                <Bell className="w-10 h-10 text-surface-400" />
              ) : (
                <Inbox className="w-10 h-10 text-surface-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">
              {activeTab === 'Unread' ? 'No unread notifications' : 'All caught up!'}
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              {activeTab === 'Unread'
                ? 'You have no unread notifications right now.'
                : 'You\'re all caught up. Check back later for new updates.'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((notification) => {
              const { Icon } = typeStyles[notification.type];
              return (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={cn(
                    'relative flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer',
                    !notification.read
                      ? 'border-brand-500/20 dark:border-brand-500/20 bg-brand-500/5 dark:bg-brand-500/5'
                      : 'border-transparent bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-surface-800/40'
                  )}
                >
                  {!notification.read && (
                    <span className="absolute top-4 left-4 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-brand-500/20" />
                  )}
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                    typeStyles[notification.type].iconBg
                  )}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={cn(
                        'text-sm',
                        !notification.read ? 'font-semibold text-surface-900 dark:text-white' : 'font-medium text-surface-700 dark:text-surface-300'
                      )}>
                        {notification.title}
                      </h3>
                      <span className="shrink-0 text-xs text-surface-400 whitespace-nowrap">{notification.timestamp}</span>
                    </div>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{notification.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
