'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import SiteNav from '@/components/layout/SiteNav';
import { cn } from '@/lib/utils';
import {
  Zap, Sparkles, ArrowRight, ChevronDown,
  AppWindow, Globe, BarChart3, Copy, Trello,
  ShoppingCart,
} from 'lucide-react';
import { ComparisonPlanCards, ComparisonTable, CapabilitySection } from '@/components/ui';

const coreFeatures = [
  {
    icon: AppWindow,
    title: 'AI App Builder',
    desc: 'One prompt. One app. Transform ideas into living software with memory, agents, and automations wired in — no code, no setup.',
    gradient: 'from-brand-500 to-brand-600',
  },
  {
    icon: Globe,
    title: 'Portals & Sign-In',
    desc: 'Publish branded portals with built-in sign-in. Clients and team members land where the work is — no account required.',
    gradient: 'from-intelligence-500 to-intelligence-600',
  },
  {
    icon: BarChart3,
    title: 'Live Dashboards',
    desc: 'KPI trackers that update in real time. The numbers find you, not the other way around. AI-powered insights included.',
    gradient: 'from-execution-500 to-execution-600',
  },
  {
    icon: Copy,
    title: 'Clone & Remix',
    desc: 'Every great app is a seed. Clone one from the gallery, make it yours, and ship in minutes. Remix without limits.',
    gradient: 'from-memory-500 to-memory-600',
  },
  {
    icon: Trello,
    title: 'CRMs, Trackers & Tools',
    desc: 'CRMs, trackers, calculators, portals — whatever your business needs, built from a single prompt and connected to your data.',
    gradient: 'from-brand-500 to-intelligence-500',
  },
  {
    icon: ShoppingCart,
    title: 'Stripe-Wired Payments',
    desc: 'Sell what you build. Stripe checkout wired into every Genesis app — subscriptions, receipts, cancellations, no plumbing.',
    gradient: 'from-warning-400 to-warning-500',
  },
];

const comparisonPlans = [
  { name: 'Free', price: '$0', period: '/mo', popular: false, badge: '' },
  { name: 'Starter', price: '$6', period: '/mo', popular: false, badge: '' },
  { name: 'Pro', price: '$16', period: '/mo', popular: true, badge: 'Most Popular' },
  { name: 'Business', price: '$40', period: '/mo', popular: false, badge: '' },
  { name: 'Max', price: '$200', period: '/mo', popular: false, badge: '' },
];

const featureRows: { feature: string; free: string | boolean; starter: string | boolean; pro: string | boolean; business: string | boolean; max: string | boolean }[] = [
  { feature: 'Users Included', free: '1', starter: '3', pro: '10', business: 'Unlimited', max: 'Unlimited' },
  { feature: 'AI Apps', free: '3', starter: 'Unlimited', pro: 'Unlimited', business: 'Unlimited', max: 'Unlimited' },
  { feature: 'AI Agents', free: '1', starter: '3', pro: 'Unlimited', business: 'Unlimited', max: 'Unlimited' },
  { feature: 'Automations', free: '3', starter: '10', pro: 'Unlimited', business: 'Unlimited', max: 'Unlimited' },
  { feature: 'Workspaces', free: '1', starter: 'Unlimited', pro: 'Unlimited', business: 'Unlimited', max: 'Unlimited' },
  { feature: 'Storage', free: '250 MB', starter: '5 GB', pro: '100 GB', business: '1 TB', max: '1 TB' },
  { feature: 'AI Credits', free: '3K (one-time)', starter: '10K/mo', pro: '50K/mo', business: '150K/mo', max: '150K+/mo' },
  { feature: 'White-Label', free: false, starter: false, pro: 'Remove branding', business: 'Full white-label', max: 'Full white-label' },
  { feature: 'AI Models', free: 'Basic', starter: 'GPT · Claude · Gemini', pro: 'GPT · Claude · Gemini', business: 'GPT · Claude · Gemini', max: 'GPT · Claude · Gemini' },
  { feature: 'Integrations', free: false, starter: 'Basic', pro: '100+ Apps', business: '100+ Apps', max: '100+ Apps' },
  { feature: 'API Access', free: false, starter: true, pro: true, business: true, max: true },
  { feature: 'SSO/SAML', free: false, starter: false, pro: false, business: true, max: true },
  { feature: 'Support', free: 'Community', starter: 'Email', pro: 'Priority', business: 'Priority + Success', max: 'Dedicated' },
];

const capabilities = [
  {
    name: 'Genesis Platform',
    items: [
      { label: 'AI App Builder', free: true, starter: true, pro: true, business: true, max: true },
      { label: 'Live Dashboards', free: true, starter: true, pro: true, business: true, max: true },
      { label: 'Client Portals', free: false, starter: false, pro: true, business: true, max: true },
      { label: 'Branded Share Links', free: false, starter: false, pro: true, business: true, max: true },
      { label: 'Custom Domains', free: false, starter: false, pro: false, business: true, max: true },
    ],
  },
  {
    name: 'AI Agents',
    items: [
      { label: 'AI Agents', free: '1', starter: '3', pro: 'Unlimited', business: 'Unlimited', max: 'Unlimited' },
      { label: 'Agent Memory', free: 'Basic', starter: 'Expanded', pro: 'Full', business: 'Full', max: 'Full + Custom' },
      { label: 'Background Agents', free: false, starter: false, pro: true, business: true, max: true },
      { label: 'Custom Tools', free: false, starter: false, pro: true, business: true, max: true },
      { label: 'Web Search & Scrape', free: false, starter: false, pro: true, business: true, max: true },
    ],
  },
  {
    name: 'Automations',
    items: [
      { label: 'Workflow Automations', free: '3', starter: '10', pro: 'Unlimited', business: 'Unlimited', max: 'Unlimited' },
      { label: 'Scheduled Workflows', free: false, starter: 'Daily', pro: 'Hourly', business: 'Real-time', max: 'Real-time' },
      { label: 'Conditional Branching', free: false, starter: false, pro: true, business: true, max: true },
      { label: 'Durable Execution', free: false, starter: false, pro: true, business: true, max: true },
    ],
  },
];

const faqs = [
  {
    q: 'What is Momentum AI Genesis?',
    a: 'Momentum AI Genesis is the AI-native workspace where one prompt becomes living software. Build dashboards, client portals, CRM systems, and internal tools — all connected to your projects, AI agents, and automations. AI agents reason and act. Automations execute 24/7. Projects store living data. Everything evolves together. No code. No templates. Just describe what you need.',
  },
  {
    q: 'What can I build with Momentum AI Genesis?',
    a: 'Anything you can describe. Teams build dashboards, client portals, CRM systems, AI assistants, workflow automations, websites, commerce solutions, forms, and lightweight apps for everyday tasks. Every app is connected to your workspace DNA — projects, agents, and automations work together.',
  },
  {
    q: 'Why upgrade from Free to Pro?',
    a: 'Free is great for exploring. Pro unlocks the full power: Apps: 3 → Unlimited, Agents: 1 → Unlimited, Automations: 3 → Unlimited, Credits: 3,000 one-time → 50,000/mo, AI Models: Basic → GPT, Claude, Gemini & more, Integrations: Basic → 100+ apps. Pro users build 20-50x more apps per month.',
  },
  {
    q: 'Which AI models does Momentum AI use?',
    a: 'Momentum AI includes 15+ frontier AI models from OpenAI GPT, Anthropic Claude, Google Gemini, and leading open-weight providers — always the latest releases. Free: Fast models. Starter+: All frontier models. Pro+: Choose which model each agent uses.',
  },
  {
    q: 'How do AI credits work?',
    a: 'Credits power all AI operations — generating apps, running agents, and executing AI actions. Free: Up to 3,000 credits (one-time). Starter: 10,000 credits/month. Pro: 50,000 credits/month. Business: 150,000 credits/month. Credits renew monthly. Pay-as-you-go credit packs available.',
  },
  {
    q: 'Do my apps keep running if I use all my credits?',
    a: 'Yes — your apps never stop. Published apps, projects, collaboration, real-time sync, all views, and non-AI automations continue working normally. Credits are only consumed when generating new AI content.',
  },
  {
    q: 'Which plan includes integrations?',
    a: 'Pro and higher include all 100+ integrations: Slack, Gmail, Microsoft Teams, Discord, WhatsApp, Google Drive, Dropbox, GitHub, GitLab, Stripe, HubSpot, Mailchimp, WordPress, Zapier, Make, and more.',
  },
  {
    q: 'Is my data private and secure?',
    a: 'Yes. Your data is never used to train AI models. Encrypted in transit and at rest (AES-256). Google CASA certified (OWASP ASVS Level 2). SOC 2 Type II compliance in progress. Enterprise SSO/SAML available.',
  },
];

export default function FeaturesPage() {
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
            <div className="text-center max-w-4xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
                <Sparkles className="w-4 h-4" />
                One App. One Prompt. Powered by Real-time Workspace.
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                <span className="text-surface-900 dark:text-white">Momentum AI</span>
                <br />
                <span className="momentum-text">Features</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                Every Momentum AI feature — where projects remember, agents think, and automations execute.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/auth/register" className="px-6 py-3 text-base font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-xl shadow-brand-500/30 transition-all active:scale-[0.98] flex items-center gap-2">
                  Start Building <Zap className="w-4 h-4" />
                </Link>
                <Link href="/pricing" className="px-6 py-3 text-base font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all flex items-center gap-2">
                  View Pricing <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-surface-500 dark:text-surface-400 mb-6">
              <span className="font-semibold text-surface-700 dark:text-surface-300">150K+ live apps</span>
              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
              <span className="font-semibold text-surface-700 dark:text-surface-300">500K+ agents deployed</span>
              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
              <span className="font-semibold text-surface-700 dark:text-surface-300">4.9/5 rating</span>
              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
              <span>Backed by Y Combinator</span>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Everything you need to build, ship, and scale
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                One prompt. One app. Powered by your workspace.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all duration-300"
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300',
                      feature.gradient
                    )}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Capabilities by Category */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Compare Plans and Features
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Everything you need, from solo to enterprise.
              </p>
            </div>

            <ComparisonPlanCards plans={comparisonPlans} />
            <ComparisonTable
              plans={comparisonPlans}
              rows={featureRows.map(r => ({ feature: r.feature, values: [r.free, r.starter, r.pro, r.business, r.max] }))}
              highlightIndex={2}
            />

            <div className="text-center mt-6">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
              >
                See full plan details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Capabilities Detail */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Platform Capabilities
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Detailed breakdown of features across all plans.
              </p>
            </div>

            <CapabilitySection
              categories={capabilities.map(c => ({
                name: c.name,
                rows: c.items.map(item => ({
                  feature: item.label,
                  values: [item.free, item.starter, item.pro, item.business, item.max],
                })),
              }))}
              plans={comparisonPlans}
              highlightIndex={2}
            />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-surface-500 dark:text-surface-400">
                Everything you need to know about Momentum AI.
              </p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-sm font-semibold text-surface-900 dark:text-white pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown className={cn(
                      'w-4 h-4 text-surface-400 shrink-0 transition-transform duration-300',
                      openFaq === i && 'rotate-180'
                    )} />
                  </button>
                  <div className={cn(
                    'overflow-hidden transition-all duration-300',
                    openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  )}>
                    <div className="px-5 pb-5">
                      <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  One prompt. One app. Powered by your workspace.
                </h2>
                <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
                  Build dashboards, client portals, CRM systems, and internal tools — all connected to your projects, AI agents, and automations.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/auth/register" className="px-6 py-3 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2">
                    Start Building Free <Zap className="w-4 h-4" />
                  </Link>
                  <Link href="/gallery" className="px-6 py-3 text-base font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                    Browse Gallery <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="py-10 border-t border-surface-200 dark:border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-surface-500 dark:text-surface-400">
              <span className="font-semibold text-surface-700 dark:text-surface-300">150K+ live apps</span>
              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
              <span className="font-semibold text-surface-700 dark:text-surface-300">500K+ agents deployed</span>
              <span className="w-1 h-1 rounded-full bg-surface-300 dark:bg-white/[0.12]" />
              <span>Loved by teams at</span>
              {['Google', 'Nike', 'Adobe', 'Netflix', 'Airbnb'].map((company) => (
                <span key={company} className="font-semibold text-surface-400 dark:text-surface-500">{company}</span>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
