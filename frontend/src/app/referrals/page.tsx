'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Copy, Share2, Users, Star,
  Check, Mail, MessageSquare,
  Award, Clock, BarChart3, AtSign,
} from 'lucide-react';
import toast from 'react-hot-toast';

const rewards = [
  { name: 'Friend Signs Up', points: 500, desc: 'When your referral creates an account', icon: Users, achieved: true },
  { name: 'Friend Upgrades', points: 2500, desc: 'When your referral upgrades to Pro', icon: Star, achieved: false },
  { name: 'Friend Stays 30 Days', points: 1000, desc: 'Active after first month', icon: Clock, achieved: false },
  { name: '10 Referrals', points: 5000, desc: 'Bonus for referring 10 people', icon: Award, achieved: false },
];

const referrals = [
  { id: 'r1', name: 'Sarah Chen', email: 'sarah@company.com', status: 'active', joined: 'May 15, 2026', earned: 500 },
  { id: 'r2', name: 'Alex Rivera', email: 'alex@company.com', status: 'active', joined: 'May 28, 2026', earned: 500 },
  { id: 'r3', name: 'Maria Santos', email: 'maria@corp.com', status: 'pending', joined: 'Jun 1, 2026', earned: 0 },
  { id: 'r4', name: 'David Kim', email: 'david@startup.io', status: 'pending', joined: 'Jun 2, 2026', earned: 0 },
];

export default function ReferralsPage() {
  const [referralLink] = useState('https://momentum.ai/refer?ref=JD123');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const totalEarned = referrals.filter(r => r.status === 'active').reduce((s, r) => s + r.earned, 0);
  const totalPoints = totalEarned;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-xs font-medium text-warning-500 bg-warning-500/10 px-2.5 py-0.5 rounded-full">Earn Rewards</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white tracking-tight">Referral Program</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Invite friends and earn AI credits for every person who joins</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Referrals', value: referrals.length, icon: Users, gradient: 'from-brand-500 to-rose-500' },
          { label: 'Active', value: referrals.filter(r => r.status === 'active').length, icon: Check, gradient: 'from-success-500 to-emerald-500' },
          { label: 'Credits Earned', value: totalPoints.toLocaleString(), icon: Star, gradient: 'from-warning-500 to-orange-500' },
          { label: 'Rewards Unlocked', value: rewards.filter(r => r.achieved).length + '/' + rewards.length, icon: Award, gradient: 'from-intelligence-500 to-violet-500' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="apple-stat-card" style={{ animationDelay: `${i * 60}ms` }}>
              <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mb-2', stat.gradient)}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-surface-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Referral Link */}
      <div className="apple-card p-5">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">Your Referral Link</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 p-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/50 dark:border-white/[0.06] font-mono text-sm text-surface-600 dark:text-surface-300 truncate">
            {referralLink}
          </div>
          <button onClick={handleCopy} className={cn('apple-button-primary shrink-0', copied && 'bg-success-500')}>
            {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
          </button>
          <button onClick={() => toast.success('Opening share dialog...')} className="p-3 rounded-xl bg-surface-100/80 dark:bg-white/[0.06] text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.1] transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          {[
            { icon: AtSign, label: 'Social' },
            { icon: MessageSquare, label: 'Message' },
            { icon: Mail, label: 'Email' },
            { icon: Copy, label: 'Link' },
          ].map(s => {
            const Icon = s.icon;
            return (
              <button key={s.label} onClick={() => toast.success(`Share on ${s.label}`)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-surface-100/80 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 hover:bg-surface-200/50 dark:hover:bg-white/[0.1] transition-all">
                <Icon className="w-3.5 h-3.5" /> {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rewards */}
      <div>
        <h2 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">Rewards</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {rewards.map(r => {
            const Icon = r.icon;
            return (
              <div key={r.name} className={cn('apple-card p-4', r.achieved && 'ring-2 ring-success-500/30')}>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', r.achieved ? 'bg-success-500/10 text-success-500' : 'bg-surface-100 dark:bg-white/[0.04] text-surface-400')}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{r.points.toLocaleString()}</p>
                  {r.achieved && <Check className="w-4 h-4 text-success-500" />}
                </div>
                <p className="text-xs text-surface-500">{r.name}</p>
                <p className="text-[10px] text-surface-400 mt-0.5">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Referrals List */}
      <div className="apple-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Your Referrals</h3>
          <span className="text-xs text-surface-400">{referrals.length} total</span>
        </div>
        <div className="divide-y divide-surface-100/50 dark:divide-white/[0.03]">
          {referrals.map(r => (
            <div key={r.id} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-semibold text-surface-900 dark:text-white">{r.name}</p>
                <p className="text-xs text-surface-400">{r.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn('px-2 py-0.5 text-[10px] font-semibold rounded-full border', r.status === 'active' ? 'text-success-500 bg-success-500/10 border-success-500/20' : 'text-warning-500 bg-warning-500/10 border-warning-500/20')}>
                  {r.status}
                </span>
                <span className="text-sm font-semibold text-surface-900 dark:text-white">{r.earned > 0 ? `+${r.earned}` : '-'}</span>
                <span className="text-xs text-surface-400">{r.joined}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
        <Award className="w-4 h-4 text-surface-400 shrink-0" />
        <p className="text-xs text-surface-400">Referral credits are added to your account after your friend's trial period ends. No limit on referrals — invite as many as you like!</p>
      </div>
    </div>
  );
}
