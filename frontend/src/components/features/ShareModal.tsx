'use client';

import React, { useState } from 'react';
import { cn, getInitials } from '@/lib/utils';
import {
  X, Link as LinkIcon, Copy, Check, Mail, Users, Globe,
  Lock, Shield, Settings, ChevronDown, Plus,
  ExternalLink, Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  shareLink?: string;
  resourceType?: 'project' | 'workspace' | 'agent' | 'task';
  resourceId?: string;
}

const mockTeamMembers = [
  { id: 'u1', name: 'Sarah Chen', email: 'sarah@company.com', role: 'Editor' },
  { id: 'u2', name: 'Alex Rivera', email: 'alex@company.com', role: 'Editor' },
  { id: 'u3', name: 'Maria Santos', email: 'maria@company.com', role: 'Viewer' },
  { id: 'u4', name: 'David Kim', email: 'david@company.com', role: 'Viewer' },
  { id: 'u5', name: 'Priya Sharma', email: 'priya@company.com', role: 'Editor' },
];

const roleOptions = [
  { value: 'full_access', label: 'Full Access', desc: 'Can edit, share, and manage' },
  { value: 'editor', label: 'Editor', desc: 'Can view and edit' },
  { value: 'commenter', label: 'Commenter', desc: 'Can view and comment' },
  { value: 'viewer', label: 'Viewer', desc: 'Read-only access' },
];

const linkAccessOptions = [
  { value: 'restricted', label: 'Restricted', Icon: Lock, desc: 'Only invited people can access' },
  { value: 'anyone_link', label: 'Anyone with link', Icon: LinkIcon, desc: 'No sign-in required' },
  { value: 'organization', label: 'Organization', Icon: Users, desc: 'Anyone in your workspace' },
  { value: 'public', label: 'Public', Icon: Globe, desc: 'Visible to everyone' },
];

export default function ShareModal({
  isOpen,
  onClose,
  title = 'Share Project',
  shareLink = 'https://momentum.ai/share/project-abc123',
  resourceType = 'project',
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [linkAccess, setLinkAccess] = useState('restricted');
  const [showLinkOptions, setShowLinkOptions] = useState(false);
  const [showInviteInput, setShowInviteInput] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [members] = useState(mockTeamMembers);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    toast.success(`Invite sent to ${inviteEmail}`);
    setInviteEmail('');
    setShowInviteInput(false);
  };

  const selectedAccess = linkAccessOptions.find(o => o.value === linkAccess) || linkAccessOptions[0];
  const CurrentAccessIcon = selectedAccess.Icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-scale-in">
        <div className="rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-intelligence-500 flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-surface-900 dark:text-white">{title}</h2>
                <p className="text-xs text-surface-400 dark:text-surface-500 capitalize">{resourceType}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-5 py-4 space-y-5">
            {/* Link sharing */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Share link</label>
                <div className="relative">
                  <button
                    onClick={() => setShowLinkOptions(!showLinkOptions)}
                    className="flex items-center gap-1.5 text-xs font-medium text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
                  >
                    <CurrentAccessIcon className="w-3.5 h-3.5" />
                    {selectedAccess.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {showLinkOptions && (
                    <div className="absolute right-0 top-full mt-1 w-52 rounded-xl overflow-hidden border border-surface-200 dark:border-white/[0.06] bg-white dark:bg-surface-800 shadow-xl z-10">
                      {linkAccessOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setLinkAccess(opt.value); setShowLinkOptions(false); }}
                          className={cn(
                            'w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors',
                            linkAccess === opt.value
                              ? 'bg-brand-500/10'
                              : 'hover:bg-surface-50 dark:hover:bg-white/[0.04]'
                          )}
                        >
                          <opt.Icon className={cn(
                            'w-4 h-4 mt-0.5',
                            linkAccess === opt.value ? 'text-brand-500' : 'text-surface-400'
                          )} />
                          <div>
                            <p className={cn(
                              'text-xs font-semibold',
                              linkAccess === opt.value ? 'text-brand-500' : 'text-surface-700 dark:text-surface-300'
                            )}>
                              {opt.label}
                            </p>
                            <p className="text-[10px] text-surface-400 dark:text-surface-500">{opt.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-100/50 dark:bg-white/[0.04] border border-surface-200/30 dark:border-white/[0.04]">
                  <LinkIcon className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                  <span className="text-xs text-surface-500 dark:text-surface-400 truncate">{shareLink}</span>
                </div>
                <button
                  onClick={handleCopyLink}
                  className={cn(
                    'p-2.5 rounded-xl transition-all shrink-0',
                    copied
                      ? 'bg-success-500 text-white'
                      : 'bg-surface-100/50 dark:bg-white/[0.06] text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-200/50 dark:hover:bg-white/[0.08]'
                  )}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-surface-200/50 dark:bg-white/[0.06]" />
              <span className="text-[11px] font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                People with access
              </span>
              <div className="flex-1 h-px bg-surface-200/50 dark:bg-white/[0.06]" />
            </div>

            {/* Team members list */}
            <div className="space-y-1 max-h-48 overflow-y-auto">
              <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-surface-50/50 dark:bg-white/[0.03]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 via-intelligence-500 to-execution-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">You (Owner)</p>
                  <p className="text-xs text-surface-400 dark:text-surface-500 truncate">demo@momentum.ai</p>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-brand-500/10 text-brand-500">
                  Owner
                </span>
              </div>
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-50/50 dark:hover:bg-white/[0.03] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-intelligence-500 to-memory-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {getInitials(member.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">{member.name}</p>
                    <p className="text-xs text-surface-400 dark:text-surface-500 truncate">{member.email}</p>
                  </div>
                  <select
                    defaultValue={member.role.toLowerCase()}
                    onChange={(e) => toast.success(`Permission updated to ${e.target.value}`)}
                    className="text-xs bg-transparent text-surface-500 dark:text-surface-400 border border-surface-200/50 dark:border-white/[0.06] rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500/30 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {roleOptions.map(opt => (
                      <option key={opt.value} value={opt.value.replace('_', '')}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Invite input */}
            {showInviteInput ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                      placeholder="Enter email address..."
                      className="w-full px-3 py-2 text-sm rounded-xl bg-surface-100/50 dark:bg-white/[0.04] border border-surface-200/50 dark:border-white/[0.06] text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      autoFocus
                    />
                  </div>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="text-xs bg-surface-100/50 dark:bg-white/[0.04] text-surface-500 dark:text-surface-400 border border-surface-200/50 dark:border-white/[0.06] rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-brand-500/30"
                  >
                    {roleOptions.map(opt => (
                      <option key={opt.value} value={opt.value.replace('_', '')}>{opt.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleInvite}
                    disabled={!inviteEmail.trim()}
                    className={cn(
                      'px-3 py-2 text-sm font-semibold rounded-xl transition-all',
                      inviteEmail.trim()
                        ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20'
                        : 'bg-surface-100 dark:bg-white/[0.04] text-surface-400 cursor-not-allowed'
                    )}
                  >
                    Invite
                  </button>
                  <button
                    onClick={() => { setShowInviteInput(false); setInviteEmail(''); }}
                    className="p-2 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-surface-400 dark:text-surface-500 pl-1">
                  They'll receive an email with a link to access this {resourceType}.
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowInviteInput(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-dashed border-surface-300 dark:border-surface-600 text-surface-500 dark:text-surface-400 hover:border-brand-500/50 hover:text-brand-500 dark:hover:text-brand-400 hover:bg-brand-500/5 transition-all"
              >
                <Plus className="w-4 h-4" />
                Invite people
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-surface-200/50 dark:border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-surface-400 dark:text-surface-500">
              <Shield className="w-3.5 h-3.5" />
              <span>End-to-end encrypted</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-sm font-semibold rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
