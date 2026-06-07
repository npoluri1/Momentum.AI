'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/layout/SiteNav';
import Footer from '@/components/layout/Footer';
import {
  Workflow, Zap, ArrowRight, CheckCircle, Sparkles,
  GitBranch, Mail, Database, Globe, Slack,
  MessageSquare, ChevronDown, Calendar,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const workflowTypes = [
  { icon: Mail, title: 'Email Automation', desc: 'Trigger emails based on events, schedules, or user actions. Personalize with AI.' },
  { icon: Database, title: 'Data Pipelines', desc: 'Sync, transform, and route data between apps, databases, and APIs automatically.' },
  { icon: Globe, title: 'Web Scraping', desc: 'Monitor websites, extract data, and feed it into your apps and agents on schedule.' },
  { icon: Slack, title: 'Team Notifications', desc: 'Route alerts, summaries, and reports to Slack, Teams, Discord, or email.' },
  { icon: Calendar, title: 'Scheduled Jobs', desc: 'Run reports, backups, and maintenance tasks on any schedule — no cron needed.' },
  { icon: GitBranch, title: 'Conditional Logic', desc: 'Branch workflows based on data, user actions, or AI decisions.' },
];

const integrations = [
  'Slack', 'Gmail', 'Microsoft Teams', 'Discord', 'WhatsApp',
  'Google Drive', 'Dropbox', 'GitHub', 'GitLab', 'Stripe',
  'HubSpot', 'Mailchimp', 'WordPress', 'Zapier', 'Make',
];

const buildSteps = [
  { icon: MessageSquare, title: 'Describe Flow', desc: '"When a new lead signs up, enrich it, add to CRM, and notify sales."' },
  { icon: GitBranch, title: 'Build Steps', desc: 'EVE breaks your description into steps, conditions, and triggers automatically.' },
  { icon: Layers, title: 'Connect Tools', desc: 'Wire in your apps via 100+ integrations. OAuth, webhooks, and APIs handled for you.' },
  { icon: Zap, title: 'Activate', desc: 'Run manually, schedule it, or trigger in real time. Monitor runs in the dashboard.' },
];

const faqs = [
  { q: 'What are Vibe Workflows?', a: 'Vibe Workflows are intelligent automations you build by describing what should happen. No drag-and-drop canvas. No complex logic builders. Just describe the flow in English, and MOMENTUM AI EVE generates the steps, conditions, and integrations automatically.' },
  { q: 'How many integrations are supported?', a: '100+ native integrations including Slack, Gmail, Microsoft Teams, Discord, Google Drive, Dropbox, GitHub, Stripe, HubSpot, Mailchimp, and more. Plus custom webhook and API support for anything else.' },
  { q: 'Can workflows trigger AI agents?', a: 'Yes. Any workflow step can invoke an AI agent to make decisions, generate content, or process data. For example: "When a support ticket arrives, have the AI agent analyze sentiment and route to the right team."' },
  { q: 'Do workflows run in the background?', a: 'Yes. All workflows run on MOMENTUM AI\'s infrastructure with durable execution. If a step fails, it retries automatically. You get full logs, error handling, and recovery built-in.' },
  { q: 'Can I schedule recurring workflows?', a: 'Yes. Schedule workflows to run hourly, daily, weekly, monthly, or on custom cron expressions. Recurring reports, data syncs, and maintenance tasks are all fully supported.' },
];

export default function VibeWorkflowsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />

      <main className="pt-14">
        {/* Hero */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white dark:from-brand-950/10 dark:to-[#0a0a0f] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-brand-500/10 to-intelligence-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-execution-500/10 to-memory-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
                <Sparkles className="w-4 h-4" />
                Automations that build themselves
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                <span className="text-surface-900 dark:text-white">Vibe Workflows.</span>
                <br />
                <span className="momentum-text">Always running.</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                Describe your automation in plain English. MOMENTUM AI EVE generates the steps, connects your tools, and runs it 24/7.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-xl shadow-brand-500/30 transition-all active:scale-[0.98] flex items-center gap-2">
                  Build a Workflow <Zap className="w-4 h-4" />
                </Link>
                <Link href="/workspace/automations" className="px-6 py-3 text-base font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all flex items-center gap-2">
                  Automation Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Types */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Automate anything
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                From simple alerts to complex multi-step pipelines.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflowTypes.map((wf) => {
                const Icon = wf.icon;
                return (
                  <div key={wf.title} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 dark:from-brand-400/10 dark:to-intelligence-400/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{wf.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{wf.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                100+ integrations
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Connect your favorite tools in one click.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
              {integrations.map((app) => (
                <span
                  key={app}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#0a0a0f]/60 border border-surface-200 dark:border-white/[0.08] text-sm font-medium text-surface-600 dark:text-surface-400"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Build a workflow in 4 steps
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Describe it. Let EVE handle the rest.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {buildSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 group">
                    <div className="absolute -top-3 -left-1 w-8 h-8 rounded-full bg-brand-500 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-brand-500/30">
                      {i + 1}
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 dark:from-brand-400/10 dark:to-intelligence-400/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-2">FAQ</h2>
              <p className="text-surface-500 dark:text-surface-400">Common questions about Vibe Workflows.</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                    <span className="text-sm font-semibold text-surface-900 dark:text-white pr-4">{faq.q}</span>
                    <ChevronDown className={cn('w-4 h-4 text-surface-400 shrink-0 transition-transform', openFaq === i && 'rotate-180')} />
                  </button>
                  <div className={cn('overflow-hidden transition-all', openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}>
                    <div className="px-5 pb-5"><p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{faq.a}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Automate Your First Task</h2>
                <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
                  Describe what you want automated. MOMENTUM AI EVE builds the workflow and runs it 24/7.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2">
                    Build Workflow <Zap className="w-4 h-4" />
                  </Link>
                  <Link href="/workspace/automations" className="px-6 py-3 text-base font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                    View Automations <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
