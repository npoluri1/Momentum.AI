'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Users, Shield, Activity, Server, Database, Bot,
  Cpu, HardDrive, Globe, Clock, AlertTriangle,
  CheckCircle, XCircle, RefreshCw, Download, Search,
  ChevronDown, MoreHorizontal, UserCheck, UserX,
  BarChart3, TrendingUp, TrendingDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/Avatar';
import { Table, Column } from '@/components/ui/Table';
import { Spinner } from '@/components/ui/Loading';
import { cn, formatRelativeTime } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface AdminUser extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  status: 'active' | 'suspended' | 'invited';
  projects: number;
  lastActive: string;
  createdAt: string;
}

interface ServiceHealth {
  id: string;
  name: string;
  icon: typeof Server;
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  latency: number;
  lastChecked: string;
}

interface AuditEntry {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error';
}

const services: ServiceHealth[] = [
  { id: 'auth', name: 'Authentication', icon: Shield, status: 'healthy', uptime: 99.99, latency: 12, lastChecked: new Date().toISOString() },
  { id: 'api', name: 'API Gateway', icon: Server, status: 'healthy', uptime: 99.97, latency: 8, lastChecked: new Date().toISOString() },
  { id: 'db', name: 'Database', icon: Database, status: 'healthy', uptime: 99.99, latency: 3, lastChecked: new Date().toISOString() },
  { id: 'cache', name: 'Redis Cache', icon: HardDrive, status: 'healthy', uptime: 100, latency: 1, lastChecked: new Date().toISOString() },
  { id: 'agents', name: 'Agent Engine', icon: Bot, status: 'degraded', uptime: 98.5, latency: 45, lastChecked: new Date().toISOString() },
  { id: 'socket', name: 'WebSocket', icon: Globe, status: 'healthy', uptime: 99.95, latency: 5, lastChecked: new Date().toISOString() },
  { id: 'crm', name: 'CRM Service', icon: Users, status: 'healthy', uptime: 99.9, latency: 15, lastChecked: new Date().toISOString() },
  { id: 'worker', name: 'Task Worker', icon: Cpu, status: 'healthy', uptime: 99.85, latency: 20, lastChecked: new Date().toISOString() },
];

const auditLog: AuditEntry[] = [
  { id: '1', action: 'User invited', user: 'John Doe', target: 'jane@company.com', timestamp: new Date(Date.now() - 300000).toISOString(), severity: 'info' },
  { id: '2', action: 'Role changed', user: 'John Doe', target: 'Bob Wilson → Admin', timestamp: new Date(Date.now() - 3600000).toISOString(), severity: 'warning' },
  { id: '3', action: 'Organization deleted', user: 'System', target: 'Project "Old Site"', timestamp: new Date(Date.now() - 7200000).toISOString(), severity: 'error' },
  { id: '4', action: 'Integration connected', user: 'Jane Smith', target: 'Slack', timestamp: new Date(Date.now() - 14400000).toISOString(), severity: 'info' },
  { id: '5', action: 'API key regenerated', user: 'John Doe', target: 'Production Key', timestamp: new Date(Date.now() - 28800000).toISOString(), severity: 'warning' },
  { id: '6', action: 'Billing plan changed', user: 'John Doe', target: 'Starter → Professional', timestamp: new Date(Date.now() - 86400000).toISOString(), severity: 'info' },
];

const usageData = [
  { month: 'Jan', users: 120, tasks: 2400, agents: 45, revenue: 12.4 },
  { month: 'Feb', users: 145, tasks: 2800, agents: 52, revenue: 14.1 },
  { month: 'Mar', users: 180, tasks: 3200, agents: 58, revenue: 16.8 },
  { month: 'Apr', users: 220, tasks: 4100, agents: 67, revenue: 19.2 },
  { month: 'May', users: 265, tasks: 4800, agents: 73, revenue: 22.5 },
  { month: 'Jun', users: 310, tasks: 5200, agents: 81, revenue: 25.3 },
];

const usersData: AdminUser[] = [
  { id: '1', name: 'John Doe', email: 'john@company.com', role: 'admin', status: 'active', projects: 12, lastActive: new Date().toISOString(), createdAt: '2025-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'member', status: 'active', projects: 8, lastActive: new Date(Date.now() - 3600000).toISOString(), createdAt: '2025-03-20' },
  { id: '3', name: 'Bob Wilson', email: 'bob@company.com', role: 'member', status: 'active', projects: 5, lastActive: new Date(Date.now() - 86400000).toISOString(), createdAt: '2025-04-10' },
  { id: '4', name: 'Alice Brown', email: 'alice@company.com', role: 'viewer', status: 'active', projects: 2, lastActive: new Date(Date.now() - 7200000).toISOString(), createdAt: '2025-05-01' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@company.com', role: 'member', status: 'invited', projects: 0, lastActive: '', createdAt: '2026-05-10' },
  { id: '6', name: 'Diana Evans', email: 'diana@company.com', role: 'member', status: 'suspended', projects: 3, lastActive: new Date(Date.now() - 604800000).toISOString(), createdAt: '2025-02-15' },
];

const severityStyles: Record<string, 'default' | 'warning' | 'danger' | 'primary'> = {
  info: 'default',
  warning: 'warning',
  error: 'danger',
};

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899'];

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success('Dashboard refreshed');
    setRefreshing(false);
  }, []);

  const healthScore = services.filter((s) => s.status === 'healthy').length / services.length * 100;

  const filteredUsers = usersData.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userColumns: Column<AdminUser>[] = [
    { key: 'name', header: 'User', render: (u) => <div className="flex items-center gap-3"><Avatar name={u.name} size="sm" /><div><p className="font-medium text-sm">{u.name}</p><p className="text-xs text-surface-500">{u.email}</p></div></div> },
    { key: 'role', header: 'Role', render: (u) => <Badge variant={u.role === 'admin' ? 'primary' : u.role === 'member' ? 'success' : 'warning'}>{u.role}</Badge> },
    { key: 'status', header: 'Status', render: (u) => <Badge variant={u.status === 'active' ? 'primary' : u.status === 'suspended' ? 'danger' : 'default'} dot dotColor={u.status === 'active' ? '#22c55e' : u.status === 'suspended' ? '#ef4444' : '#f59e0b'}>{u.status}</Badge> },
    { key: 'projects', header: 'Projects', className: 'text-center' },
    { key: 'lastActive', header: 'Last Active', render: (u) => <span className="text-sm text-surface-500">{u.lastActive ? formatRelativeTime(u.lastActive) : '—'}</span> },
    { key: 'actions', header: '', render: () => <button className="p-1 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800"><MoreHorizontal className="w-4 h-4" /></button> },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 bg-surface-200 dark:bg-surface-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-surface-500">Manage users, monitor system health, and view usage analytics</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} loading={refreshing} icon={<RefreshCw className="w-4 h-4" />}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-5"><div className="flex items-center justify-between mb-3"><div className="p-2.5 rounded-lg bg-brand-100 dark:bg-brand-900/30"><Users className="w-5 h-5 text-brand-600 dark:text-brand-400" /></div><TrendingUp className="w-4 h-4 text-success-500" /></div><p className="text-2xl font-bold">310</p><p className="text-sm text-surface-500">Total Users</p></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between mb-3"><div className="p-2.5 rounded-lg bg-success-100 dark:bg-success-900/30"><CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" /></div><TrendingUp className="w-4 h-4 text-success-500" /></div><p className="text-2xl font-bold">{healthScore.toFixed(0)}%</p><p className="text-sm text-surface-500">System Health</p></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between mb-3"><div className="p-2.5 rounded-lg bg-warning-100 dark:bg-warning-900/30"><Activity className="w-5 h-5 text-warning-600 dark:text-warning-400" /></div><TrendingUp className="w-4 h-4 text-success-500" /></div><p className="text-2xl font-bold">5,200</p><p className="text-sm text-surface-500">Monthly Tasks</p></CardContent></Card>
        <Card><CardContent className="p-5"><div className="flex items-center justify-between mb-3"><div className="p-2.5 rounded-lg bg-danger-100 dark:bg-danger-900/30"><AlertTriangle className="w-5 h-5 text-danger-600 dark:text-danger-400" /></div><TrendingDown className="w-4 h-4 text-danger-500" /></div><p className="text-2xl font-bold">3</p><p className="text-sm text-surface-500">Open Incidents</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          Service Health
          <Badge variant={healthScore >= 99 ? 'success' : healthScore >= 95 ? 'warning' : 'danger'} size="sm" className="ml-2">
            {healthScore.toFixed(1)}% uptime
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <div key={svc.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
                  <div className={cn('p-2 rounded-lg', svc.status === 'healthy' ? 'bg-success-100 dark:bg-success-900/30 text-success-600' : svc.status === 'degraded' ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-600' : 'bg-danger-100 dark:bg-danger-900/30 text-danger-600')}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{svc.name}</p>
                      <span className={cn('w-2 h-2 rounded-full shrink-0', svc.status === 'healthy' ? 'bg-success-500' : svc.status === 'degraded' ? 'bg-warning-500' : 'bg-danger-500')} />
                    </div>
                    <p className="text-xs text-surface-500 mt-0.5">{svc.latency}ms · {svc.uptime}% uptime</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Usage Analytics</CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                <Bar dataKey="users" name="Users" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tasks" name="Tasks" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            User Management
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="max-w-xs"
            />
          </CardHeader>
          <CardContent padding={false}>
            <Table<AdminUser>
              columns={userColumns}
              data={filteredUsers}
              keyExtractor={(u) => u.id}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Audit Log</CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              {auditLog.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 px-6 py-3">
                  <div className={cn('p-1.5 rounded-lg mt-0.5', entry.severity === 'error' ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-600' : entry.severity === 'warning' ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-600' : 'bg-surface-100 dark:bg-surface-800 text-surface-500')}>
                    {entry.severity === 'error' ? <XCircle className="w-3.5 h-3.5" /> : entry.severity === 'warning' ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm"><span className="font-medium">{entry.user}</span> {entry.action}: <span className="text-surface-500">{entry.target}</span></p>
                    <p className="text-xs text-surface-400 mt-0.5">{formatRelativeTime(entry.timestamp)}</p>
                  </div>
                  <Badge variant={severityStyles[entry.severity]} size="sm">{entry.severity}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
