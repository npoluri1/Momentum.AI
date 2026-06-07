'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bot, FolderKanban, Users, Workflow, Zap, ArrowRight, Sparkles,
  DollarSign, CheckCircle, Activity, GitBranch, Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const quickStats = [
    { label: 'Projects', value: '12', icon: FolderKanban, gradient: 'from-emerald-500 to-teal-500', badge: 'active', href: '/workspace/projects', color: 'text-emerald-500' },
    { label: 'AI Agents', value: '5', icon: Bot, gradient: 'from-violet-500 to-purple-600', badge: 'deployed', href: '/workspace/agents', color: 'text-violet-500' },
    { label: 'Active Workflows', value: '8', icon: Workflow, gradient: 'from-sky-500 to-cyan-500', badge: 'running', href: '/workspace/automations', color: 'text-sky-500' },
    { label: 'Pipeline Value', value: '$284K', icon: DollarSign, gradient: 'from-rose-500 to-pink-600', badge: 'this quarter', href: '/workspace/crm', color: 'text-rose-500' },
  ];

  const recentActivity = [
    { icon: CheckCircle, text: 'Completed "API Integration" task', time: '2m ago', color: 'text-memory-500' },
    { icon: DollarSign, text: 'Deal closed: Enterprise Plan', time: '15m ago', color: 'text-brand-500' },
    { icon: Sparkles, text: 'Agent drafted Q4 report', time: '1h ago', color: 'text-intelligence-500' },
    { icon: GitBranch, text: 'Workflow "Lead Follow-up" ran', time: '3h ago', color: 'text-execution-500' },
    { icon: Users, text: 'New team member joined', time: '1d ago', color: 'text-memory-500' },
  ];

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-memory-500 animate-pulse" />
              <span className="text-xs font-medium text-memory-500 dark:text-memory-400 bg-memory-500/10 px-2.5 py-0.5 rounded-full">Live</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white tracking-tight">Dashboard</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Your workspace at a glance</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white hover:shadow-lg hover:shadow-brand-500/25 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Project
            </button>
            <button className="px-4 py-2 text-sm font-semibold rounded-xl bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700 transition-all flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Generate with AI
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="group p-5 rounded-2xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40 hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-all hover:shadow-md"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn('w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-sm', stat.gradient)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[11px] font-medium text-surface-400 dark:text-surface-500 bg-surface-100/50 dark:bg-white/[0.04] px-2 py-0.5 rounded-full capitalize">
                    {stat.badge}
                  </span>
                </div>
                <p className="text-3xl font-bold text-surface-900 dark:text-white mb-0.5 tracking-tight">{stat.value}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{stat.label}</p>
                  <ArrowRight className="w-4 h-4 text-surface-300 dark:text-surface-600 group-hover:text-brand-500 transition-colors group-hover:translate-x-0.5 transform transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="p-6 rounded-2xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40">
            <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-brand-500" />
              Recent Activity
              <span className="text-xs font-normal text-surface-400 ml-auto">Last 24 hours</span>
            </h3>
            <div className="space-y-1">
              {recentActivity.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-50/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer group">
                    <div className={cn('w-8 h-8 rounded-lg bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center', item.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="flex-1 text-sm text-surface-600 dark:text-surface-400 group-hover:text-surface-700 dark:group-hover:text-surface-300 transition-colors">{item.text}</p>
                    <span className="text-xs text-surface-400 dark:text-surface-500 shrink-0 font-medium">{item.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 rounded-2xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40">
            <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-brand-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Bot, label: 'Create Agent', gradient: 'from-violet-500 to-purple-600', href: '/workspace/agents', desc: 'Deploy AI team members' },
                { icon: FolderKanban, label: 'New Project', gradient: 'from-emerald-500 to-teal-500', href: '/workspace/projects', desc: 'Start fresh workspace' },
                { icon: GitBranch, label: 'Build Workflow', gradient: 'from-sky-500 to-cyan-500', href: '/workspace/automations', desc: 'Automate processes' },
                { icon: Users, label: 'Add Contact', gradient: 'from-rose-500 to-pink-600', href: '/workspace/crm', desc: 'Grow your pipeline' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.label} href={item.href} className="group flex flex-col gap-3 p-4 rounded-2xl border border-surface-200/40 dark:border-white/[0.06] bg-surface-50/30 dark:bg-white/[0.02] hover:bg-surface-100/50 dark:hover:bg-white/[0.04] transition-all hover:shadow-md">
                    <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm', item.gradient)}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{item.label}</p>
                      <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">{item.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="p-6 rounded-2xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-surface-900 dark:text-white flex items-center gap-2.5">
              <FolderKanban className="w-4 h-4 text-memory-500" />
              Active Projects
            </h3>
            <Link href="/workspace/projects" className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-1">
            {[
              { name: 'Website Redesign', progress: 65, gradient: 'from-brand-500 to-rose-500', members: 3, tasks: '8/12' },
              { name: 'Mobile App v2', progress: 30, gradient: 'from-violet-500 to-purple-600', members: 2, tasks: '7/24' },
              { name: 'CRM Integration', progress: 80, gradient: 'from-emerald-500 to-teal-500', members: 2, tasks: '6/8' },
              { name: 'Q4 Marketing Campaign', progress: 10, gradient: 'from-sky-500 to-cyan-500', members: 1, tasks: '2/18' },
              { name: 'Sales Playbook', progress: 45, gradient: 'from-amber-500 to-orange-600', members: 3, tasks: '5/11' },
            ].map((project, i) => (
              <div key={i} className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-surface-50/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer group">
                <div className={cn('w-2 h-2 rounded-full shrink-0', project.gradient.split(' ')[0].replace('from-', 'bg-'))} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white group-hover:text-brand-500 transition-colors">{project.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-surface-500 dark:text-surface-400">
                    <span>{project.members} {project.members === 1 ? 'member' : 'members'}</span>
                    <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
                    <span>{project.tasks} tasks</span>
                  </div>
                </div>
                <div className="w-36">
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-1.5 rounded-full bg-surface-200/50 dark:bg-white/[0.06] overflow-hidden">
                      <div
                        className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out', project.gradient)}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 w-8 text-right">{project.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="flex items-center justify-center gap-6 text-xs text-surface-400 dark:text-surface-500 pt-2">
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-memory-500" /> 12 projects</span>
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-intelligence-500" /> 5 agents</span>
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-execution-500" /> 8 workflows</span>
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-brand-500" /> $284K pipeline</span>
        </div>
      </div>
    </div>
  );
}
