'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/layout/SiteNav';
import Footer from '@/components/layout/Footer';
import {
  Zap, ArrowRight, CheckCircle, Sparkles,
  Briefcase, Users, TrendingUp, Palette, Code, BarChart3,
  Globe, Bot, Workflow, ChevronDown, Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const industries = [
  {
    icon: Briefcase,
    title: 'Sales',
    desc: 'Pipeline CRMs, lead scoring, automated outreach, and deal tracking — built from a prompt.',
    features: ['Lead scoring agents', 'Email sequences', 'Deal pipelines', 'Revenue dashboards'],
  },
  {
    icon: TrendingUp,
    title: 'Marketing',
    desc: 'Campaign trackers, content calendars, analytics dashboards, and AI content generation.',
    features: ['Campaign tracking', 'Content calendars', 'Analytics dashboards', 'AI copywriting'],
  },
  {
    icon: Users,
    title: 'Operations',
    desc: 'Workflow automation, inventory tracking, finance dashboards, and team management tools.',
    features: ['Workflow automation', 'Finance tracking', 'Inventory management', 'Team dashboards'],
  },
  {
    icon: Code,
    title: 'Engineering',
    desc: 'Bug trackers, sprint planners, CI/CD dashboards, and code review automation.',
    features: ['Bug tracking', 'Sprint planning', 'CI/CD dashboards', 'Code review bots'],
  },
  {
    icon: Palette,
    title: 'Design',
    desc: 'Design systems, asset libraries, feedback portals, and brand guideline tools.',
    features: ['Design systems', 'Asset libraries', 'Feedback portals', 'Brand guidelines'],
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    desc: 'KPI dashboards, data pipelines, anomaly detection, and automated reporting.',
    features: ['KPI dashboards', 'Data pipelines', 'Anomaly detection', 'Auto reports'],
  },
];

const useCases = [
  {
    icon: Globe,
    title: 'Client Portals',
    desc: 'Branded portals where clients log in, view projects, pay invoices, and communicate — all without writing code.',
  },
  {
    icon: Bot,
    title: 'AI Support',
    desc: 'Intelligent support agents that answer tickets, route issues, and resolve problems 24/7 with full context.',
  },
  {
    icon: Workflow,
    title: 'Process Automation',
    desc: 'Replace manual processes with intelligent workflows that run across your tools and teams automatically.',
  },
  {
    icon: Database,
    title: 'Data Management',
    desc: 'Centralize scattered data into live dashboards with real-time sync, alerts, and AI-powered insights.',
  },
];

const faqs = [
  { q: 'Can MOMENTUM AI replace my existing tools?', a: 'Yes. Most teams replace 5-10 separate tools (CRM, project management, forms, dashboards, automations) with a single MOMENTUM AI workspace. Everything is connected, so data flows naturally between apps, agents, and workflows.' },
  { q: 'How quickly can we deploy a solution?', a: 'Most industry solutions are generated in under 5 minutes from a single prompt. You can then customize, add integrations, and invite your team. Full deployment typically takes less than a day.' },
  { q: 'Is it secure for enterprise use?', a: 'Yes. SOC 2 Type II compliance, AES-256 encryption, SSO/SAML, audit logs, and role-based access control. Enterprise plans include custom security addendums and dedicated support.' },
  { q: 'Can we migrate from existing platforms?', a: 'Yes. Import data from Salesforce, HubSpot, Asana, Trello, Notion, Airtable, and 50+ other platforms. MOMENTUM AI maps your data and rebuilds your workflows automatically.' },
];

export default function SolutionsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />

      <main className="pt-14">
        {/* Hero */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white dark:from-brand-950/10 dark:to-[#0a0a0f] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-brand-500/10 to-intelligence-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
                <Sparkles className="w-4 h-4" />
                Industry-specific AI workspaces
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                <span className="text-surface-900 dark:text-white">Solutions for</span>
                <br />
                <span className="momentum-text">every team.</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                Pre-built workspace solutions for Sales, Marketing, Operations, Engineering, and more. Describe your team. Ship the solution.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-xl shadow-brand-500/30 transition-all active:scale-[0.98] flex items-center gap-2">
                  Find Your Solution <Zap className="w-4 h-4" />
                </Link>
                <Link href="/gallery" className="px-6 py-3 text-base font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all flex items-center gap-2">
                  Browse Gallery <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Built for your industry
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Pick your industry. Get a complete workspace in seconds.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industries.map((ind) => {
                const Icon = ind.icon;
                return (
                  <div key={ind.title} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 dark:from-brand-400/10 dark:to-intelligence-400/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{ind.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed mb-4">{ind.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ind.features.map((f) => (
                        <span key={f} className="px-2 py-1 text-[10px] rounded-md bg-surface-100 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 font-medium">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Common use cases
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                How teams use MOMENTUM AI every day.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {useCases.map((uc) => {
                const Icon = uc.icon;
                return (
                  <div key={uc.title} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 dark:from-brand-400/10 dark:to-intelligence-400/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{uc.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{uc.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-2">FAQ</h2>
              <p className="text-surface-500 dark:text-surface-400">Common questions about solutions.</p>
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
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Find Your Team's Solution</h2>
                <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
                  Describe your team and workflow. MOMENTUM AI EVE generates the complete workspace.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2">
                    Get Started <Zap className="w-4 h-4" />
                  </Link>
                  <Link href="/enterprise" className="px-6 py-3 text-base font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                    Enterprise <ArrowRight className="w-4 h-4" />
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
