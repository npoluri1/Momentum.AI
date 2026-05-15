'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  BarChart3, TrendingUp, Users, CheckCircle2, Bot,
  DollarSign, Workflow, Download, Calendar,
  ChevronDown, Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, formatCurrency } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend,
} from 'recharts';

const userGrowth = [
  { month: 'Jan', users: 120, newUsers: 25, activeUsers: 85 },
  { month: 'Feb', users: 145, newUsers: 30, activeUsers: 98 },
  { month: 'Mar', users: 180, newUsers: 40, activeUsers: 120 },
  { month: 'Apr', users: 220, newUsers: 45, activeUsers: 155 },
  { month: 'May', users: 265, newUsers: 55, activeUsers: 190 },
  { month: 'Jun', users: 310, newUsers: 60, activeUsers: 230 },
];

const taskCompletion = [
  { month: 'Jan', completed: 1800, created: 2400, rate: 75 },
  { month: 'Feb', completed: 2100, created: 2800, rate: 75 },
  { month: 'Mar', completed: 2600, created: 3200, rate: 81 },
  { month: 'Apr', completed: 3400, created: 4100, rate: 83 },
  { month: 'May', completed: 4000, created: 4800, rate: 83 },
  { month: 'Jun', completed: 4500, created: 5200, rate: 87 },
];

const agentUsage = [
  { name: 'Code Review', value: 35, color: '#6366f1' },
  { name: 'Data Analysis', value: 25, color: '#22c55e' },
  { name: 'Writing', value: 20, color: '#f59e0b' },
  { name: 'Research', value: 12, color: '#ef4444' },
  { name: 'Other', value: 8, color: '#3b82f6' },
];

const pipelineVelocity = [
  { stage: 'Lead', value: 120, count: 45 },
  { stage: 'Qualified', value: 85, count: 28 },
  { stage: 'Proposal', value: 52, count: 15 },
  { stage: 'Negotiation', value: 38, count: 10 },
  { stage: 'Closed Won', value: 25, count: 8 },
];

const workflowStats = [
  { name: 'Task Automation', success: 95, failed: 5 },
  { name: 'Email Campaign', success: 88, failed: 12 },
  { name: 'Data Sync', success: 99, failed: 1 },
  { name: 'Lead Scoring', success: 92, failed: 8 },
  { name: 'Report Generation', success: 97, failed: 3 },
];

const timeRangeOptions = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'This year', value: '1y' },
];

const statCards = [
  { label: 'Total Users', value: '310', change: '+22.5%', icon: Users, color: 'text-brand-500', bg: 'bg-brand-100 dark:bg-brand-900/30' },
  { label: 'Tasks Completed', value: '4,500', change: '+12.5%', icon: CheckCircle2, color: 'text-success-500', bg: 'bg-success-100 dark:bg-success-900/30' },
  { label: 'Active Agents', value: '81', change: '+11.0%', icon: Bot, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { label: 'Pipeline Value', value: '$253k', change: '+8.3%', icon: DollarSign, color: 'text-warning-500', bg: 'bg-warning-100 dark:bg-warning-900/30' },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('1y');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleExport = (format: string) => {
    toast.success(`Exporting as ${format.toUpperCase()}...`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-surface-200 dark:bg-surface-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
          <div className="h-80 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-surface-500">Track growth, usage, and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              className="px-3 py-2 pr-8 rounded-lg text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30 appearance-none"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              {timeRangeOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400 pointer-events-none" />
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')} icon={<Download className="w-4 h-4" />}>CSV</Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')} icon={<Download className="w-4 h-4" />}>PDF</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn('p-2.5 rounded-lg', stat.bg)}><Icon className={cn('w-5 h-5', stat.color)} /></div>
                  <span className="text-xs font-medium text-success-600 dark:text-success-400 bg-success-100 dark:bg-success-900/30 px-2 py-0.5 rounded-full">{stat.change}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-surface-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>User Growth</CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowth}>
                  <defs>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                    <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="users" stroke="#6366f1" fill="url(#userGradient)" name="Total Users" />
                  <Area type="monotone" dataKey="activeUsers" stroke="#22c55e" fill="url(#activeGradient)" name="Active Users" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Task Completion Rate</CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={taskCompletion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="rate" stroke="#6366f1" name="Completion Rate %" strokeWidth={2} dot={{ fill: '#6366f1' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-8 mt-4 text-sm">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-brand-500" /> Completed: {taskCompletion[taskCompletion.length - 1].completed.toLocaleString()}</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-surface-300" /> Created: {taskCompletion[taskCompletion.length - 1].created.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>Agent Usage Distribution</CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={agentUsage} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {agentUsage.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {agentUsage.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>CRM Pipeline Velocity</CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineVelocity} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={90} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="value" name="Value ($k)" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>Workflow Success Rates</CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflowStats.map((wf) => (
                <div key={wf.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{wf.name}</span>
                    <span className="text-surface-500">{wf.success}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-success-500 to-brand-500 transition-all" style={{ width: `${wf.success}%` }} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-400 mt-0.5">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success-500" />{wf.success}% success</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-danger-500" />{wf.failed}% failed</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>Monthly Overview</CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="newUsers" name="New Users" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="activeUsers" name="Active Users" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
