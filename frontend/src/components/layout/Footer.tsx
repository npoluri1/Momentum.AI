'use client';

import Link from 'next/link';
import { Zap, Github, Twitter, MessageSquare } from 'lucide-react';

const footerSections = [
  {
    title: '',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Press', href: '/about' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Features', href: '/features' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Contact us', href: '/help' },
    ],
  },
  {
    title: 'Vibe',
    links: [
      { label: 'Vibe Apps', href: '/gallery' },
      { label: 'Vibe Agents', href: '/gallery' },
      { label: 'Vibe Coding', href: '/gallery' },
      { label: 'Vibe Workflows', href: '/gallery' },
      { label: 'Vibe Marketing', href: '/gallery' },
      { label: 'Vibe Dashboards', href: '/gallery' },
      { label: 'Vibe CRM', href: '/gallery' },
      { label: 'Vibe Automation', href: '/gallery' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Featured', href: '/gallery' },
      { label: 'Quick Apps', href: '/gallery' },
      { label: 'Tools', href: '/gallery' },
      { label: 'Dashboards', href: '/gallery' },
      { label: 'Websites', href: '/gallery' },
      { label: 'Workflows', href: '/gallery' },
      { label: 'Projects', href: '/gallery' },
      { label: 'Forms', href: '/gallery' },
    ],
  },
  {
    title: 'Downloads',
    links: [
      { label: 'Android', href: '/download' },
      { label: 'iOS', href: '/download' },
      { label: 'Mac', href: '/download' },
      { label: 'Windows', href: '/download' },
      { label: 'Chrome', href: '/download' },
      { label: 'Firefox', href: '/download' },
      { label: 'Edge', href: '/download' },
    ],
  },
  {
    title: 'Compare',
    links: [
      { label: 'vs Cursor', href: '/vs-cursor' },
      { label: 'vs Bolt', href: '/vs-bolt' },
      { label: 'vs Lovable', href: '/vs-lovable' },
      { label: 'vs V0', href: '/vs-v0' },
      { label: 'vs Windsurf', href: '/vs-windsurf' },
      { label: 'vs Replit', href: '/vs-replit' },
      { label: 'vs Devin', href: '/vs-devin' },
      { label: 'vs Claude Code', href: '/vs-claude-code' },
    ],
  },
  {
    title: 'Genesis AI',
    links: [
      { label: 'Video Guide', href: '/help' },
      { label: 'App Builder', href: '/features' },
      { label: 'Vibe Coding', href: '/gallery' },
      { label: 'Workspace DNA', href: '/features' },
      { label: 'Prompt Library', href: '/gallery' },
    ],
  },
  {
    title: 'AI Agents',
    links: [
      { label: 'Featured', href: '/gallery' },
      { label: 'Project Management', href: '/gallery' },
      { label: 'Productivity', href: '/gallery' },
      { label: 'Sales & CRM', href: '/gallery' },
      { label: 'Research', href: '/gallery' },
    ],
  },
  {
    title: 'Automations',
    links: [
      { label: 'Featured', href: '/gallery' },
      { label: 'Business-in-a-Box', href: '/gallery' },
      { label: 'Investor Operations', href: '/gallery' },
      { label: 'Marketing', href: '/gallery' },
      { label: 'Support', href: '/gallery' },
    ],
  },
  {
    title: 'Templates',
    links: [
      { label: 'Featured', href: '/gallery' },
      { label: 'ChatGPT', href: '/gallery' },
      { label: 'Table', href: '/gallery' },
      { label: 'Kanban', href: '/gallery' },
      { label: 'Mind Map', href: '/gallery' },
    ],
  },
  {
    title: 'Generators',
    links: [
      { label: 'AI Software', href: '#' },
      { label: 'No-Code AI App', href: '#' },
      { label: 'AI App', href: '#' },
      { label: 'AI Website', href: '#' },
      { label: 'AI Dashboard', href: '#' },
    ],
  },
  {
    title: 'Converters',
    links: [
      { label: 'AI Featured', href: '#' },
      { label: 'AI PDF', href: '#' },
      { label: 'AI CSV', href: '#' },
      { label: 'AI JSON', href: '#' },
      { label: 'AI Markdown', href: '#' },
    ],
  },
  {
    title: 'Prompts',
    links: [
      { label: 'Blog Writing', href: '#' },
      { label: 'Branding', href: '#' },
      { label: 'Personal Finance', href: '#' },
      { label: 'Marketing', href: '#' },
      { label: 'Sales', href: '#' },
    ],
  },
  {
    title: 'Blog',
    links: [
      { label: 'AI Micro Apps Explained: Why 150,000+ Have Already Been Built', href: '/blog' },
      { label: 'AI Agent Teams Collaboration: How They Co-Edit Work With Humans in 2026', href: '/blog' },
      { label: 'AI App Builder vs AI Workspace Builder: The 2026 Category Split', href: '/blog' },
      { label: 'How to Build an Internal Tool Without Code in 2026', href: '/blog' },
      { label: 'See all', href: '/blog' },
    ],
  },
  {
    title: 'Changelog',
    links: [
      { label: 'Custom Domains, Secured Faster (May 29, 2026)', href: '/changelog' },
      { label: 'Automate from Agents, Teams & Media (May 28, 2026)', href: '/changelog' },
      { label: 'Connect Any Service, Keys Stay Safe (May 26, 2026)', href: '/changelog' },
      { label: 'See all', href: '/changelog' },
    ],
  },
  {
    title: 'Wiki',
    links: [
      { label: 'Momentum AI Genesis', href: '/features' },
      { label: 'AI Agents', href: '/features' },
      { label: 'Automation', href: '/features' },
      { label: 'Workspace', href: '/features' },
      { label: 'Security', href: '/enterprise' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Brand */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900 dark:text-white" style={{ fontFamily: "'Comfortaa', sans-serif" }}>momentum ai</span>
          </Link>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 max-w-xs">
            One prompt. One living system. Build apps, deploy AI agents, and automate workflows.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="w-9 h-9 rounded-xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center text-surface-400 hover:text-brand-500 hover:bg-brand-500/10 transition-all">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center text-surface-400 hover:text-brand-500 hover:bg-brand-500/10 transition-all">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-xl bg-surface-100 dark:bg-white/[0.06] flex items-center justify-center text-surface-400 hover:text-brand-500 hover:bg-brand-500/10 transition-all">
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 mb-12">
          {footerSections.map((col) => (
            <div key={col.title || 'about'}>
              {col.title && (
                <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">{col.title}</h4>
              )}
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-surface-500 dark:text-surface-400 hover:text-brand-500 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-surface-200 dark:border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-surface-400">&copy; 2026 Momentum AI Inc.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors">Terms</Link>
            <Link href="/security" className="text-xs text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors">Security</Link>
            <Link href="/status" className="text-xs text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors">Status</Link>
          </div>
          <span className="text-xs text-surface-400">Made with Momentum AI for Builders</span>
        </div>
      </div>
    </footer>
  );
}
