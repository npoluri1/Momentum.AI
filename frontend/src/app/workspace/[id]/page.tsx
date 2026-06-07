'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Bot, GitBranch, FolderKanban, Users, Clock, Zap,
  Copy, ArrowLeft, Play, Settings, Share2, Star,
  MessageSquare, CheckCircle, BarChart3, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import ThreeDViewer from '@/components/ui/ThreeDViewer';

export default function WorkspaceDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const workspace = {
    id: params.id as string,
    name: 'Pipeline that scores every lead',
    team: 'SALES@momentum.ai',
    description: 'AI-powered sales pipeline with lead scoring, deal tracking, and automated follow-ups. Clone this workspace to get a complete sales system with agents and workflows pre-configured.',
    screenshot: 'https://www.momentum.ai/share/apps/dry36084slddvvrh/screenshot.png',
    projects: 4, agents: 2, flows: 3, clones: 1247,
    category: 'Sales',
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to gallery
        </Link>

        <div className="rounded-2xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40 overflow-hidden mb-6">
          <div className="aspect-video bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-800 dark:to-surface-700 relative">
            <img
              src={workspace.screenshot}
              alt={workspace.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-white/90 dark:bg-surface-900/90 text-surface-700 dark:text-surface-300">
                {workspace.team}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">{workspace.name}</h1>
                <p className="text-sm text-surface-500 dark:text-surface-400 max-w-2xl">{workspace.description}</p>
              </div>
              <button className="shrink-0 px-5 py-2.5 text-sm font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2">
                <Copy className="w-4 h-4" /> Clone Workspace
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-surface-500 dark:text-surface-400 mb-6">
              <span className="flex items-center gap-1.5"><FolderKanban className="w-4 h-4" />{workspace.projects} projects</span>
              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600" />
              <span className="flex items-center gap-1.5"><Bot className="w-4 h-4" />{workspace.agents} agents</span>
              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600" />
              <span className="flex items-center gap-1.5"><GitBranch className="w-4 h-4" />{workspace.flows} flows</span>
              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600" />
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4" />{workspace.clones} clones</span>
            </div>

            <div className="flex items-center gap-2 border-b border-surface-200 dark:border-surface-700">
              {['Overview', 'Projects', 'Agents', 'Workflows', 'Design'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-4 py-2.5 text-sm font-medium transition-all ${
                    activeTab === tab.toLowerCase()
                      ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400'
                      : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Projects</h3>
              <div className="space-y-3">
                {['Lead Management', 'Deal Tracking', 'Analytics Dashboard', 'Email Sequences'].map((p) => (
                  <div key={p} className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">AI Agents</h3>
              <div className="space-y-3">
                {['Lead Scorer', 'Email Composer'].map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
                    <Bot className="w-4 h-4 text-brand-500" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-xl border border-surface-200/60 dark:border-surface-700/60 bg-white dark:bg-surface-900/40">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Workflows</h3>
              <div className="space-y-3">
                {['Lead Assignment', 'Deal Stage Update', 'Follow-up Scheduler'].map((w) => (
                  <div key={w} className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-300">
                    <GitBranch className="w-4 h-4 text-brand-500" />
                    {w}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="space-y-6">
            <ThreeDViewer 
              title="Project 3D Blueprint" 
              sceneData={{
                metadata: { domain: 'mechanical' },
                objects: [{ name: 'Chassis' }, { name: 'Engine Block' }]
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
