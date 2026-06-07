'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  BarChart3, TrendingUp, Users, CheckCircle, Bot,
  DollarSign, Workflow, Download, Calendar,
  ChevronDown, Filter, Activity, Target, Globe,
  PieChart, ArrowUp, ArrowDown,
  RefreshCw, Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart as ReLineChart, Line, AreaChart, Area, PieChart as RePieChart, Pie, Cell,
} from 'recharts';

const userGrowth = [
  { month: 'Jan', users: 120, activeUsers: 85 },
  { month: 'Feb', users: 145, activeUsers: 98 },
  { month: 'Mar', users: 180, activeUsers: 120 },
  { month: 'Apr', users: 220, activeUsers: 155 },
  { month: 'May', users: 265, activeUsers: 190 },
  { month: 'Jun', users: 310, activeUsers: 230 },
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
  { name: 'Code Review', value: 35, color: '#8b5cf6' },
  { name: 'Data Analysis', value: 25, color: '#22c55e' },
  { name: 'Writing', value: 20, color: '#f59e0b' },
  { name: 'Research', value: 12, color: '#ef4444' },
  { name: 'Other', value: 8, color: '#3b82f6' },
];

const pipelineVelocity = [
  { stage: 'Lead', value: 120 },
  { stage: 'Qualified', value: 85 },
  { stage: 'Proposal', value: 52 },
  { stage: 'Negotiation', value: 38 },
  { stage: 'Closed Won', value: 25 },
];

const monthlyRevenue = [
  { month: 'Jan', revenue: 120000, cost: 85000 },
  { month: 'Feb', revenue: 145000, cost: 92000 },
  { month: 'Mar', revenue: 180000, cost: 105000 },
  { month: 'Apr', revenue: 220000, cost: 128000 },
  { month: 'May', revenue: 265000, cost: 145000 },
  { month: 'Jun', revenue: 310000, cost: 168000 },
];

const timeRanges = ['7d', '30d', '90d', '1y'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white/90 dark:bg-surface-800/90 backdrop-blur-xl border border-surface-200/50 dark:border-white/[0.06] rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-semibold text-surface-900 dark:text-white mb-1.5">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-surface-500 dark:text-surface-400">{entry.name}:</span>
          <span className="font-semibold text-surface-900 dark:text-white">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('1y');
  const [showRange, setShowRange] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6 animate-fade-in">
        <div className="flex items-center gap-4"><div className="h-8 w-48 bg-surface-200 dark:bg-white/[0.06] rounded-xl animate-pulse" /><div className="flex-1" /><div className="h-9 w-32 bg-surface-200 dark:bg-white/[0.06] rounded-xl animate-pulse" /></div>
        <div className="grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 bg-surface-200 dark:bg-white/[0.06] rounded-2xl animate-pulse" />)}</div>
        <div className="grid grid-cols-2 gap-6"><div className="h-80 bg-surface-200 dark:bg-white/[0.06] rounded-2xl animate-pulse" /><div className="h-80 bg-surface-200 dark:bg-white/[0.06] rounded-2xl animate-pulse" /></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-xs font-medium text-brand-500 bg-brand-500/10 px-2.5 py-0.5 rounded-full">Real-time</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white tracking-tight">Analytics</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Track growth, usage, and performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowRange(!showRange)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl bg-surface-100/80 dark:bg-white/[0.06] border border-surface-200/50 dark:border-transparent text-surface-600 dark:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.1] transition-all"
            >
              <Calendar className="w-4 h-4" />
              {timeRanges.find(r => r === timeRange) || '1y'}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showRange && (
              <div className="absolute right-0 top-full mt-1 w-32 rounded-xl overflow-hidden border border-surface-200 dark:border-white/[0.06] bg-white dark:bg-surface-800 shadow-xl z-10">
                {timeRanges.map(r => (
                  <button
                    key={r}
                    onClick={() => { setTimeRange(r); setShowRange(false); }}
                    className={cn(
                      'w-full px-3 py-2 text-xs text-left transition-colors',
                      timeRange === r
                        ? 'text-brand-500 bg-brand-500/10'
                        : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.04]'
                    )}
                  >
                    Last {r === '1y' ? 'year' : r}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => toast.success('Exporting report...')}
            className="px-3 py-2 text-sm font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '310', change: '+22.5%', up: true, icon: Users, gradient: 'from-brand-500 to-rose-500' },
          { label: 'Tasks Completed', value: '4,500', change: '+12.5%', up: true, icon: CheckCircle, gradient: 'from-success-500 to-emerald-500' },
          { label: 'Active Agents', value: '81', change: '+11.0%', up: true, icon: Bot, gradient: 'from-intelligence-500 to-violet-500' },
          { label: 'Pipeline Value', value: '$253k', change: '+8.3%', up: true, icon: DollarSign, gradient: 'from-warning-500 to-orange-500' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="apple-stat-card" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className={cn('w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-sm', stat.gradient)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className={cn(
                  'text-xs font-semibold flex items-center gap-0.5',
                  stat.up ? 'text-success-500' : 'text-danger-500'
                )}>
                  {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">{stat.value}</p>
              <p className="text-sm font-medium text-surface-400 dark:text-surface-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              User Growth
            </h3>
            <span className="text-[10px] text-surface-400">Total vs Active</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth}>
                <defs>
                  <linearGradient id="userG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff2d60" stopOpacity={0.3}/><stop offset="95%" stopColor="#ff2d60" stopOpacity={0}/></linearGradient>
                  <linearGradient id="activeG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="users" stroke="#ff2d60" fill="url(#userG)" strokeWidth={2} name="Total Users" />
                <Area type="monotone" dataKey="activeUsers" stroke="#22c55e" fill="url(#activeG)" strokeWidth={2} name="Active Users" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-success-500" />
              Task Completion Rate
            </h3>
            <span className="text-[10px] text-surface-400">Last 6 months</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={taskCompletion}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="rate" stroke="#ff2d60" strokeWidth={2.5} dot={{ fill: '#ff2d60', strokeWidth: 0, r: 4 }} name="Rate %" />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-surface-500 dark:text-surface-400">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-500" /> 87% current rate</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-success-500" /> 4,500 completed</span>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="apple-card p-6">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-intelligence-500" />
            Agent Usage
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={agentUsage} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                  {agentUsage.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {agentUsage.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</div>
                <span className="font-semibold text-surface-700 dark:text-surface-300">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="apple-card p-6">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2">
            <Activity className="w-4 h-4 text-execution-500" />
            Pipeline Velocity
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineVelocity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} horizontal={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={90} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="apple-card p-6">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-warning-500" />
            Revenue vs Cost
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="cost" fill="#ff2d60" radius={[4, 4, 0, 0]} name="Cost" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Full Overview Table */}
      <div className="apple-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-memory-500" />
            Monthly Overview
          </h3>
          <div className="flex items-center gap-2">
            <button className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100/50 dark:border-white/[0.03]">
                {['Month', 'Users', 'Active', 'Tasks Created', 'Tasks Done', 'Rate', 'Revenue'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-[11px] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {userGrowth.map((row, i) => {
                const tasks = taskCompletion[i];
                const rev = monthlyRevenue[i];
                return (
                  <tr key={row.month} className="border-b border-surface-100/30 dark:border-white/[0.02] hover:bg-surface-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-surface-900 dark:text-white">{row.month}</td>
                    <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400">{row.users}</td>
                    <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400">{row.activeUsers}</td>
                    <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400">{tasks.created.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400">{tasks.completed.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'px-2 py-0.5 text-[11px] font-semibold rounded-full border',
                        tasks.rate >= 80
                          ? 'text-success-500 bg-success-500/10 border-success-500/20'
                          : 'text-warning-500 bg-warning-500/10 border-warning-500/20'
                      )}>{tasks.rate}%</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-surface-900 dark:text-white">${(rev.revenue / 1000).toFixed(0)}k</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
