'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/layout/SiteNav';
import Footer from '@/components/layout/Footer';
import {
  AppWindow, Zap, Bot, ArrowRight, Sparkles,
  LayoutDashboard, Globe, BarChart3, Copy, Trello, ShoppingCart,
  Palette, FileText, FormInput, ChevronDown, MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const appTypes = [
  { icon: LayoutDashboard, title: 'Dashboards', desc: 'KPI trackers, analytics, and live data views that update in real time.' },
  { icon: Globe, title: 'Client Portals', desc: 'Branded portals with built-in sign-in for clients and stakeholders.' },
  { icon: Trello, title: 'CRMs & Trackers', desc: 'Sales pipelines, project trackers, and workflow management tools.' },
  { icon: ShoppingCart, title: 'Commerce', desc: 'Stripe-wired checkout, subscriptions, and product catalogs.' },
  { icon: FileText, title: 'Documents', desc: 'Rich-text docs, wikis, and knowledge bases with AI search.' },
  { icon: FormInput, title: 'Forms & Surveys', desc: 'Multi-step forms, surveys, and data collection tools.' },
];

const buildSteps = [
  { icon: MessageSquare, title: 'Prompt', desc: 'Describe your app in plain English. Be as specific or as vague as you want.' },
  { icon: AppWindow, title: 'Generate', desc: 'MOMENTUM AI EVE builds the full app — UI, logic, database, and integrations.' },
  { icon: Palette, title: 'Customize', desc: 'Edit design, add pages, connect data sources — all through chat.' },
  { icon: Zap, title: 'Launch', desc: 'Publish to a custom domain in one click. Share with your team instantly.' },
];

const faqs = [
  { q: 'What kind of apps can I build?', a: 'Dashboards, client portals, CRMs, trackers, commerce stores, forms, wikis, internal tools, and more. If you can describe it, MOMENTUM AI can build it. Every app includes live data, user auth, and mobile responsiveness.' },
  { q: 'How long does it take to build an app?', a: 'Most apps are generated in under 30 seconds. Complex apps with multiple pages, custom integrations, and databases take 1-3 minutes. You can iterate instantly by chatting with EVE.' },
  { q: 'Can I connect my own database?', a: 'Yes. Connect PostgreSQL, MySQL, MongoDB, Supabase, or Firebase. EVE will read your schema and generate the app around your existing data. You can also start from scratch with a new database.' },
  { q: 'Are the apps mobile-friendly?', a: 'Every app is fully responsive and works on desktop, tablet, and mobile. You can also generate native mobile apps using the same prompt for iOS and Android deployment.' },
  { q: 'Can multiple people edit the same app?', a: 'Yes. Real-time collaboration is built-in. Multiple team members can edit the app simultaneously, see live cursors, and leave comments — just like Figma for apps.' },
];

export default function VibeAppsPage() {
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
                One prompt. One app. Zero code.
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                <span className="text-surface-900 dark:text-white">Vibe Apps.</span>
                <br />
                <span className="momentum-text">Build anything.</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                Describe the app you need. MOMENTUM AI EVE generates the full frontend, backend, database, and integrations — ready to use in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-xl shadow-brand-500/30 transition-all active:scale-[0.98] flex items-center gap-2">
                  Build Your First App <Zap className="w-4 h-4" />
                </Link>
                <Link href="/gallery" className="px-6 py-3 text-base font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all flex items-center gap-2">
                  Browse Gallery <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* App Types */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Every app you can imagine
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Pick a type. Describe it. Ship it.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appTypes.map((app) => {
                const Icon = app.icon;
                return (
                  <div key={app.title} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 dark:from-brand-400/10 dark:to-intelligence-400/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{app.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{app.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                From prompt to app in 4 steps
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                No code. No setup. Just describe and ship.
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

        {/* Stats */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '150K+', label: 'Live apps built' },
                { value: '<30s', label: 'Average build time' },
                { value: '99.9%', label: 'Uptime' },
                { value: '4.9/5', label: 'User rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl md:text-4xl font-extrabold text-brand-500 dark:text-brand-400 mb-1">{stat.value}</div>
                  <div className="text-sm text-surface-500 dark:text-surface-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-2">FAQ</h2>
              <p className="text-surface-500 dark:text-surface-400">Common questions about Vibe Apps.</p>
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Build Your First App</h2>
                <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
                  Describe what you need. MOMENTUM AI EVE builds it. Ship in 30 seconds.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2">
                    Start Building <Zap className="w-4 h-4" />
                  </Link>
                  <Link href="/gallery" className="px-6 py-3 text-base font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                    Browse Gallery <ArrowRight className="w-4 h-4" />
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
