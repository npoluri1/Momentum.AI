'use client';

import { useState, useEffect } from 'react';
import {
  Users, Archive, Trash2, Crown, Check,
  HelpCircle, ChevronRight, Zap,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

function WorkspaceLoading() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-pulse">
      <div className="h-7 w-48 bg-surface-800/50 rounded-lg" />
      <div className="flex gap-2">
        <div className="h-8 w-24 bg-surface-800/50 rounded-lg" />
        <div className="h-8 w-20 bg-surface-800/30 rounded-lg" />
        <div className="h-8 w-16 bg-surface-800/30 rounded-lg" />
      </div>
      <div className="h-40 bg-surface-800/30 rounded-xl" />
      <div className="h-48 bg-surface-800/30 rounded-xl" />
    </div>
  );
}

export default function WorkspacePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <WorkspaceLoading />;

  return (
    <div className="p-4 md:p-6 space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-lg font-semibold text-surface-100 mb-3">Workspace</h1>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1.5 text-sm font-medium text-brand-400 bg-brand-500/10 rounded-lg">
            Overview
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-surface-400 hover:text-surface-200 rounded-lg hover:bg-surface-800/50 transition-colors">
            Members
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-surface-400 hover:text-surface-200 rounded-lg hover:bg-surface-800/50 transition-colors">
            Apps
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-surface-800/50 bg-surface-900/30 p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Badge variant="primary" size="sm">Free Plan</Badge>
            <p className="text-sm text-surface-400">0 apps &middot; 2 projects</p>
            <p className="text-xs text-surface-500">Unlock unlimited AI agents & apps to supercharge your workflow.</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shrink-0">
            <Crown className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-surface-200">Workspace Members (1)</h2>
          <button className="p-0.5 rounded text-surface-500 hover:text-surface-300 transition-colors">
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="rounded-xl border border-surface-800/50 bg-surface-900/30 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Avatar name="Nagasiva poluri" size="md" />
            <div>
              <p className="text-sm font-medium text-surface-200">Nagasiva poluri</p>
              <p className="text-xs text-surface-500">Workspace Owner</p>
            </div>
          </div>
          <div className="pt-2 border-t border-surface-800/30">
            <p className="text-xs text-surface-500">Invite teammates to collaborate on projects and tasks.</p>
            <Button variant="secondary" size="sm" className="mt-3">
              <Users className="w-4 h-4 mr-1.5" />
              Invite Members
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-surface-200 mb-3">Workspace Actions</h2>
        <div className="rounded-xl border border-surface-800/50 divide-y divide-surface-800/30">
          <button className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-surface-400 hover:text-surface-200 hover:bg-surface-800/30 transition-colors rounded-t-xl">
            <Archive className="w-4 h-4" />
            <span>Archive workspace</span>
          </button>
          <button className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-danger-400 hover:text-danger-300 hover:bg-surface-800/30 transition-colors rounded-b-xl">
            <Trash2 className="w-4 h-4" />
            <span>Delete workspace</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-surface-900 via-surface-900 to-brand-950/50 border border-brand-500/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-brand-500 to-cyan-500 flex items-center justify-center shadow-lg shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-base font-bold text-surface-100">Unlock the Full Power of AI ⚡</h3>
            <ul className="space-y-2">
              {[
                'Unlimited AI agents & automations',
                'Custom integrations & API access',
                'Priority support & advanced analytics',
                'Unlimited projects & team members',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-surface-300">
                  <Check className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3 pt-2">
              <Button variant="primary" size="md">
                Go Unlimited
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <button className="text-sm text-brand-400 hover:text-brand-300 transition-colors">
                Compare Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
