'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/layout/SiteNav';
import Footer from '@/components/layout/Footer';
import {
  Code, Zap, Bot, ArrowRight, CheckCircle, Terminal,
  Sparkles, Workflow, LayoutDashboard, Globe, Play,
  ChevronDown, MessageSquare, GitBranch,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const codingSteps = [
  { icon: MessageSquare, title: 'Describe It', desc: 'Type a prompt in natural language. "Build a customer portal with auth and Stripe."' },
  { icon: Bot, title: 'AI Builds It', desc: 'MOMENTUM AI EVE writes your frontend, backend, database schema, and API endpoints — all wired together.' },
  { icon: Terminal, title: 'Preview Live', desc: 'See your app running instantly in a live preview. Edit by chatting, not by coding.' },
  { icon: GitBranch, title: 'Deploy It', desc: 'Ship to production with one click. Custom domains, SSL, and CI/CD included.' },
];

const codingExamples = [
  { label: 'CRM with pipelines', icon: LayoutDashboard },
  { label: 'Dashboard with charts', icon: LayoutDashboard },
  { label: 'Auth + payments', icon: Globe },
  { label: 'Chat with AI agents', icon: Bot },
  { label: 'Workflow automations', icon: Workflow },
  { label: 'Form builder + DB', icon: Code },
];

const languageSupport = [
  'React · Next.js · TypeScript', 'Python · FastAPI · Django', 'Node.js · Express · Prisma',
  'PostgreSQL · MongoDB · Redis', 'Tailwind · shadcn/ui · Radix', 'Stripe · Clerk · Supabase',
];

const faqs = [
  { q: 'What is Vibe Coding?', a: 'Vibe Coding is building software by describing what you want in plain English. MOMENTUM AI EVE writes the code, connects the services, and deploys the app — no manual coding required. You steer with prompts, iterate by chatting, and ship in minutes.' },
  { q: 'Do I need to know how to code?', a: 'No. Vibe Coding is designed for everyone — founders, product managers, designers, and engineers who want to move 10x faster. You describe, AI builds. If you do know how to code, you can always dive into the generated source and customize.' },
  { q: 'What tech stack does it generate?', a: 'Modern full-stack apps: React + Next.js on the frontend, Python or Node.js on the backend, PostgreSQL or MongoDB for data, Tailwind for styling, and Stripe + Clerk for payments and auth. All production-ready.' },
  { q: 'Can I export the source code?', a: 'Yes. Every app you build is yours. Export as a Git repo, download the ZIP, or push directly to GitHub. Full source code, no lock-in.' },
  { q: 'How is this different from Cursor or Bolt?', a: 'Cursor and Bolt are code editors with AI. MOMENTUM AI is a full workspace: one prompt generates the entire app + database + agents + automations + deployment. It is end-to-end, not just code editing.' },
];

const comparisonData = [
  { feature: 'Natural language to app', momentum: true, cursor: false, bolt: false, lovable: true, devin: true },
  { feature: 'Auto database schema', momentum: true, cursor: false, bolt: false, lovable: true, devin: true },
  { feature: 'Auto API generation', momentum: true, cursor: false, bolt: false, lovable: true, devin: true },
  { feature: 'AI agents included', momentum: true, cursor: false, bolt: false, lovable: false, devin: false },
  { feature: 'Workflow automations', momentum: true, cursor: false, bolt: false, lovable: false, devin: false },
  { feature: 'One-click deploy', momentum: true, cursor: false, bolt: true, lovable: true, devin: false },
  { feature: 'Full source export', momentum: true, cursor: true, bolt: true, lovable: true, devin: false },
  { feature: 'Real-time preview', momentum: true, cursor: false, bolt: true, lovable: true, devin: false },
];

export default function VibeCodingPage() {
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
                Build software by describing it
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                <span className="text-surface-900 dark:text-white">Vibe Coding.</span>
                <br />
                <span className="momentum-text">Ship in minutes.</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                Describe what you need. MOMENTUM AI EVE writes the code, connects the database, generates the APIs, and deploys the app. You iterate by chatting.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
                <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-xl shadow-brand-500/30 transition-all active:scale-[0.98] flex items-center gap-2">
                  Start Vibe Coding <Zap className="w-4 h-4" />
                </Link>
                <Link href="/features" className="px-6 py-3 text-base font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all flex items-center gap-2">
                  <Play className="w-4 h-4" /> See it in action
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
                {codingExamples.map((ex) => {
                  const Icon = ex.icon;
                  return (
                    <button
                      key={ex.label}
                      onClick={() => {}}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-100 dark:bg-white/[0.06] border border-surface-200 dark:border-white/[0.08] text-xs font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-200/50 dark:hover:bg-white/[0.1] transition-all text-left cursor-default"
                    >
                      <Icon className="w-3.5 h-3.5 text-brand-500" />
                      {ex.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Terminal Preview */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                See it building. Live.
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                MOMENTUM AI EVE narrates while she builds your app — frontend, backend, database, and deployment.
              </p>
            </div>
            <div className="rounded-2xl border border-surface-200 dark:border-white/[0.08] bg-[#0a0a0f] p-1 shadow-2xl shadow-black/20">
              <div className="rounded-xl bg-[#0d0d14] border border-white/[0.06] overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#0a0a0f]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-white/40 font-mono">eve — vibe-coding — 80×24</span>
                  </div>
                </div>
                <div className="p-6 md:p-10 font-mono text-sm leading-relaxed">
                  <div className="flex items-center gap-2 text-brand-400 mb-3">
                    <Terminal className="w-4 h-4" />
                    <span className="text-white/60">$</span>
                    <span className="text-green-400">eve</span>
                    <span className="text-white/80">code</span>
                    <span className="text-blue-400">"CRM with pipelines and Stripe billing"</span>
                  </div>
                  <div className="space-y-1 text-white/50">
                    <div className="flex items-center gap-2"><span className="text-white/30">⟡</span><span>Analyzing requirements...</span></div>
                    <div className="flex items-center gap-2"><span className="text-white/30">⟡</span><span>Scaffolding Next.js + Tailwind frontend...</span></div>
                    <div className="flex items-center gap-2"><span className="text-white/30">⟡</span><span>Generating FastAPI backend with Pydantic schemas...</span></div>
                    <div className="flex items-center gap-2"><span className="text-white/30">⟡</span><span>Creating PostgreSQL migrations...</span></div>
                    <div className="flex items-center gap-2"><span className="text-white/30">⟡</span><span>Wiring Stripe checkout + webhooks...</span></div>
                    <div className="flex items-center gap-2"><span className="text-white/30">⟡</span><span>Building Kanban pipeline component...</span></div>
                    <div className="flex items-center gap-2 text-green-400 mt-2">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>App ready in 18.2s — deployed at https://crm-demo.momentum.ai</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-white/30">$</span>
                      <span className="w-2 h-4 bg-brand-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Prompt it. Build it. Ship it.
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Four steps from idea to live app.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {codingSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="relative p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all group">
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

        {/* Tech Stack */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Production-grade stack. Every time.
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Modern, scalable, and battle-tested technologies.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {languageSupport.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#0a0a0f]/60 border border-surface-200 dark:border-white/[0.08] text-sm font-medium text-surface-600 dark:text-surface-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Why teams choose MOMENTUM AI
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Vibe Coding vs. traditional AI coding tools.
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-surface-200 dark:border-white/[0.08] bg-white dark:bg-[#0a0a0f]/40">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-white/[0.08] bg-surface-50 dark:bg-white/[0.03]">
                    <th scope="col" className="text-left px-5 py-3.5 font-semibold text-surface-900 dark:text-white">Feature</th>
                    <th scope="col" className="text-center px-4 py-3.5 font-semibold text-brand-600 dark:text-brand-400">MOMENTUM AI</th>
                    <th scope="col" className="text-center px-4 py-3.5 font-medium text-surface-500 hidden md:table-cell">Cursor</th>
                    <th scope="col" className="text-center px-4 py-3.5 font-medium text-surface-500 hidden md:table-cell">Bolt</th>
                    <th scope="col" className="text-center px-4 py-3.5 font-medium text-surface-500 hidden md:table-cell">Lovable</th>
                    <th scope="col" className="text-center px-4 py-3.5 font-medium text-surface-500 hidden md:table-cell">Devin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-white/[0.04]">
                  {comparisonData.map((row, i) => (
                    <tr key={i} className="hover:bg-surface-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-medium text-surface-700 dark:text-surface-300">{row.feature}</td>
                      <td className="px-4 py-3.5"><CheckCircle className="w-4 h-4 text-memory-500 mx-auto" /></td>
                      <td className="px-4 py-3.5 text-center hidden md:table-cell">{row.cursor ? <CheckCircle className="w-4 h-4 text-memory-500 mx-auto" /> : <span className="text-surface-300 dark:text-surface-600">—</span>}</td>
                      <td className="px-4 py-3.5 text-center hidden md:table-cell">{row.bolt ? <CheckCircle className="w-4 h-4 text-memory-500 mx-auto" /> : <span className="text-surface-300 dark:text-surface-600">—</span>}</td>
                      <td className="px-4 py-3.5 text-center hidden md:table-cell">{row.lovable ? <CheckCircle className="w-4 h-4 text-memory-500 mx-auto" /> : <span className="text-surface-300 dark:text-surface-600">—</span>}</td>
                      <td className="px-4 py-3.5 text-center hidden md:table-cell">{row.devin ? <CheckCircle className="w-4 h-4 text-memory-500 mx-auto" /> : <span className="text-surface-300 dark:text-surface-600">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-2">FAQ</h2>
              <p className="text-surface-500 dark:text-surface-400">Common questions about Vibe Coding.</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Vibe Coding Today</h2>
                <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
                  Describe your idea. Watch MOMENTUM AI EVE build it. Ship in minutes, not months.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2">
                    Start Building <Zap className="w-4 h-4" />
                  </Link>
                  <Link href="/features" className="px-6 py-3 text-base font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                    Explore All Features <ArrowRight className="w-4 h-4" />
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
