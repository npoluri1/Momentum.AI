'use client';

import { useState } from 'react';
import {
  Zap, Sparkles, Bot, Workflow, LayoutDashboard, Globe,
  BarChart3, Users, MessageSquare, Plus, ArrowRight,
  ChevronRight, Star, Play, FileText, ShoppingCart,
  GraduationCap, Home, Briefcase,
} from 'lucide-react';

const appTypes = [
  { icon: LayoutDashboard, name: 'Dashboard', desc: 'Analytics, KPIs, and reporting', color: 'from-violet-500 to-purple-600' },
  { icon: Globe, name: 'Website', desc: 'Portals, landing pages, docs', color: 'from-blue-500 to-cyan-600' },
  { icon: Bot, name: 'AI Agent', desc: 'Intelligent assistants and bots', color: 'from-emerald-500 to-teal-600' },
  { icon: Workflow, name: 'Workflow', desc: 'Automations and processes', color: 'from-amber-500 to-orange-600' },
  { icon: Users, name: 'CRM', desc: 'Customer relationships and deals', color: 'from-rose-500 to-pink-600' },
  { icon: BarChart3, name: 'Tracker', desc: 'Goals, metrics, and progress', color: 'from-indigo-500 to-violet-600' },
  { icon: FileText, name: 'Form', desc: 'Surveys and data collection', color: 'from-sky-500 to-blue-600' },
  { icon: ShoppingCart, name: 'Store', desc: 'E-commerce and inventory', color: 'from-green-500 to-emerald-600' },
];

const templates = [
  { name: 'Sales Pipeline', desc: 'Track deals through every stage', icon: Briefcase, color: 'from-violet-500 to-purple-600' },
  { name: 'Customer Portal', desc: 'Self-service client dashboard', icon: Users, color: 'from-blue-500 to-cyan-600' },
  { name: 'Project Tracker', desc: 'Tasks, milestones, and timelines', icon: LayoutDashboard, color: 'from-emerald-500 to-teal-600' },
  { name: 'Content Calendar', desc: 'Plan and schedule content', icon: FileText, color: 'from-amber-500 to-orange-600' },
  { name: 'Employee Onboarding', desc: 'New hire workflow automation', icon: GraduationCap, color: 'from-rose-500 to-pink-600' },
  { name: 'Invoice System', desc: 'Generate and track invoices', icon: ShoppingCart, color: 'from-indigo-500 to-violet-600' },
];

export default function CreatePage() {
  const [prompt, setPrompt] = useState('');
  const [selectedType, setSelectedType] = useState('');

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200/50 dark:border-brand-800/50 text-sm font-medium text-brand-700 dark:text-brand-300 mb-4">
            <Sparkles className="w-4 h-4" />
            AI App Builder
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
            Build your app with AI
          </h1>
          <p className="text-base text-surface-500 dark:text-surface-400">
            Describe what you need and AI builds the full app, agents, and automations in minutes.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the app you want to build...&#10;&#10;Example: Build me a CRM for my real estate agency with lead tracking, deal pipeline, and automated follow-up emails."
              rows={5}
              className="w-full px-5 py-4 text-sm rounded-2xl border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!prompt.trim()}
              >
                <Zap className="w-4 h-4" />
                Build it
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {['CRM for real estate', 'Project management app', 'Invoice generator', 'Customer portal', 'Analytics dashboard'].map((example) => (
              <button
                key={example}
                onClick={() => setPrompt(example)}
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Choose an app type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {appTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.name;
              return (
                <button
                  key={type.name}
                  onClick={() => setSelectedType(isSelected ? '' : type.name)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
                      : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800/50 hover:bg-surface-50 dark:hover:bg-surface-700'
                  }`}
                >
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs font-semibold text-surface-900 dark:text-white">{type.name}</div>
                  <div className="text-[10px] text-surface-500 dark:text-surface-400 mt-0.5">{type.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Start from a template</h2>
            <button className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((tmpl) => {
              const Icon = tmpl.icon;
              return (
                <div key={tmpl.name} className="flex items-center gap-4 p-4 rounded-xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40 hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-all cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tmpl.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-surface-900 dark:text-white">{tmpl.name}</h3>
                    <p className="text-xs text-surface-500 dark:text-surface-400">{tmpl.desc}</p>
                  </div>
                  <button className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1">
                    Use <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
