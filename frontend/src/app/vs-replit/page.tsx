'use client';

import Link from 'next/link';
import SiteNav from '@/components/layout/SiteNav';
import Footer from '@/components/layout/Footer';
import {
  Sparkles, ArrowRight, CheckCircle, XCircle, Zap, Bot, Workflow,
  Globe, Users,
} from 'lucide-react';

const comparisons = [
  { feature: 'AI App Builder', momentum: 'Genesis with workspace DNA', replit: 'Replit Agent', },
  { feature: 'No-Code Option', momentum: true, replit: true, },
  { feature: 'Team Workspaces', momentum: 'Multi-player, real-time', replit: 'Multiplayer available', },
  { feature: 'AI Agents', momentum: 'Autonomous task agents', replit: 'Agent available', },
  { feature: 'Workflow Automations', momentum: 'Visual automation engine', replit: 'Not available', },
  { feature: 'CRM & Project Tools', momentum: 'Built-in CRM, Kanban', replit: 'Not available', },
  { feature: 'Client Portals', momentum: 'Branded portals with auth', replit: 'Not available', },
  { feature: 'Live Dashboards', momentum: 'Real-time KPI dashboards', replit: 'Not available', },
  { feature: 'Data Persistence', momentum: 'Projects store living data', replit: 'Repl DB', },
  { feature: 'Integrations', momentum: '100+ native integrations', replit: 'Limited', },
  { feature: 'White-Label', momentum: 'Full white-label support', replit: 'Not available', },
  { feature: 'Pricing', momentum: 'Free tier + $16/mo Pro', replit: 'Free + $7/mo', },
];

export default function VsReplitPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />
      <main className="pt-14">
        <section className="py-20 md:py-28 relative overflow-hidden opacity-0 animate-fade-in-up">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white dark:from-brand-950/10 dark:to-[#0a0a0f] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-brand-500/10 to-intelligence-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
              <Sparkles className="w-4 h-4" /> Comparison
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              <span className="text-surface-900 dark:text-white">The best </span>
              <span className="momentum-text">Replit alternative</span>
            </h1>
            <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8">
              Momentum AI goes beyond coding environments — it gives you a complete workspace with agents, automations, and business tools.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/auth/register" className="px-6 py-3 text-base font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-xl shadow-brand-500/30 transition-all flex items-center gap-2">
                Try Momentum AI Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/features" className="px-6 py-3 text-base font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all flex items-center gap-2">
                See Features <Zap className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 opacity-0 animate-fade-in-up delay-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">Feature Comparison</h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">Why teams are switching from Replit to Momentum AI.</p>
            </div>
            <div className="rounded-2xl border border-surface-200 dark:border-white/[0.08] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-white/[0.08] bg-surface-50 dark:bg-white/[0.03]">
                    <th scope="col" className="text-left px-5 py-4 font-semibold text-surface-900 dark:text-white">Feature</th>
                    <th scope="col" className="text-center px-5 py-4 font-bold text-brand-600 dark:text-brand-400">Momentum AI</th>
                    <th scope="col" className="text-center px-5 py-4 font-medium text-surface-500">Replit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-white/[0.04]">
                  {comparisons.map((row) => (
                    <tr key={row.feature} className="hover:bg-surface-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-medium text-surface-700 dark:text-surface-300">{row.feature}</td>
                      <td className="px-5 py-3.5 text-center">
                        {typeof row.momentum === 'boolean' ? (
                          row.momentum ? <CheckCircle className="w-4 h-4 text-memory-500 mx-auto" /> : <XCircle className="w-4 h-4 text-surface-300 mx-auto" />
                        ) : (
                          <span className="text-xs font-medium text-surface-900 dark:text-white">{row.momentum}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {typeof row.replit === 'boolean' ? (
                          row.replit ? <CheckCircle className="w-4 h-4 text-memory-500 mx-auto" /> : <XCircle className="w-4 h-4 text-surface-300 mx-auto" />
                        ) : (
                          <span className="text-xs text-surface-500">{row.replit}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02] opacity-0 animate-fade-in-up delay-300">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-8 text-center">Why Teams Switch</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Bot, title: 'Business Tools, Not Just Code', desc: 'Momentum AI includes CRM, Kanban, Gantt, and dashboards. Replit is primarily a coding environment.' },
                { icon: Workflow, title: 'Automations Built-In', desc: 'Visual workflow engine with 100+ integrations. Replit has no automation layer.' },
                { icon: Globe, title: 'Client Portals & Dashboards', desc: 'Publish branded portals with Stripe and auth. Go beyond coding demos.' },
                { icon: Users, title: 'True Team Collaboration', desc: 'Real-time multiplayer with role-based access. Built for cross-functional teams.' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 flex items-start gap-4 hover-lift">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 opacity-0 animate-fade-in-up delay-400">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-10 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
              <div className="relative">
                <h2 className="text-3xl font-bold text-white mb-4">Make the switch today</h2>
                <p className="text-brand-100 mb-8 max-w-md mx-auto">One prompt. One living system. Replace your entire stack.</p>
                <Link href="/auth/register" className="px-8 py-3 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg inline-flex items-center gap-2">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
