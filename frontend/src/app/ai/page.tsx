'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/layout/SiteNav';
import Footer from '@/components/layout/Footer';
import {
  Zap, Sparkles, Bot, Workflow, AppWindow, Brain, Cpu, Globe,
  ArrowRight, CheckCircle, MessageSquare, BarChart3, Shield,
  Layers, GitBranch, Play, ChevronDown, ChevronUp,
} from 'lucide-react';

const aiModels = [
  { name: 'GPT-4o', provider: 'OpenAI', tag: 'Best for reasoning' },
  { name: 'Claude 3.5', provider: 'Anthropic', tag: 'Best for writing' },
  { name: 'Gemini Pro', provider: 'Google', tag: 'Best for multimodal' },
  { name: 'Llama 3', provider: 'Meta', tag: 'Best for speed' },
];

const agentTypes = [
  {
    icon: Bot,
    title: 'Research Agents',
    desc: 'Deep-dive research on any topic. Scrape websites, analyze PDFs, and synthesize findings into actionable reports.',
    color: 'from-brand-500 to-brand-600',
  },
  {
    icon: MessageSquare,
    title: 'Writing Agents',
    desc: 'Draft emails, blog posts, documentation, and social content in your brand voice. Edit and iterate in real time.',
    color: 'from-intelligence-500 to-intelligence-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics Agents',
    desc: 'Connect to your data sources. Generate reports, spot trends, and surface insights automatically.',
    color: 'from-execution-500 to-execution-600',
  },
  {
    icon: Workflow,
    title: 'Automation Agents',
    desc: 'Build durable workflows that run 24/7. Branch, loop, retry, and hand off between agents seamlessly.',
    color: 'from-memory-500 to-memory-600',
  },
];

const buildSteps = [
  {
    step: '01',
    title: 'Describe what you need',
    desc: 'Type a prompt in plain English. "Build a CRM for my real estate team with lead scoring and automated follow-ups."',
    icon: MessageSquare,
  },
  {
    step: '02',
    title: 'AI architects your system',
    desc: 'Momentum AI designs the database schema, UI layouts, agent roles, and automation flows in seconds.',
    icon: Brain,
  },
  {
    step: '03',
    title: 'Ship as a live app',
    desc: 'Deploy instantly. Share with your team. Add custom domains. Your app is live and ready to use.',
    icon: AppWindow,
  },
];

const comparisonFeatures = [
  { feature: 'Shared workspace memory', genesis: true, chatgpt: false, claude: false, auto: false },
  { feature: 'Multi-agent teams', genesis: true, chatgpt: false, claude: false, auto: false },
  { feature: '100+ tool integrations', genesis: true, chatgpt: false, claude: false, auto: false },
  { feature: 'Live app deployment', genesis: true, chatgpt: false, claude: false, auto: false },
  { feature: '24/7 background execution', genesis: true, chatgpt: false, claude: false, auto: true },
  { feature: 'One prompt → full system', genesis: true, chatgpt: false, claude: false, auto: false },
];

const faqs = [
  {
    q: 'What makes Momentum AI different from ChatGPT or Claude?',
    a: 'ChatGPT and Claude are conversational AI. Momentum AI is an AI-native workspace where agents work together, share memory across your projects, and execute real workflows with 100+ integrations. One prompt builds the entire system — not just a conversation.',
  },
  {
    q: 'How many AI models can I use?',
    a: 'Momentum AI includes 15+ frontier AI models from OpenAI, Anthropic, Google, and leading open-weight providers. You can assign different models to different agents, or let Auto mode pick the best model for each task.',
  },
  {
    q: 'Can agents work while I sleep?',
    a: 'Yes. Background agents run 24/7, monitoring inboxes, tracking metrics, and executing workflows without human intervention. They wake you up only when a decision is needed.',
  },
  {
    q: 'Is my data used to train AI models?',
    a: 'No. Your data is never used to train AI models. All data is encrypted in transit and at rest (AES-256). We are Google CASA certified and working toward SOC 2 Type II.',
  },
  {
    q: 'What can I build with Genesis?',
    a: 'Dashboards, client portals, CRMs, internal tools, AI assistants, workflow automations, websites, booking systems, forms, and lightweight apps. If you can describe it, Genesis can build it.',
  },
];

export default function AIPage() {
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
                AI System Builder
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                <span className="text-surface-900 dark:text-white">Complete Business Systems</span>
                <br />
                <span className="momentum-text">From One Prompt</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                Momentum AI Genesis builds your entire app, agent team, and automation layer from a single prompt.
                Memory. Intelligence. Execution. One living system.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
                <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-xl shadow-brand-500/30 transition-all active:scale-[0.98] flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Build with AI
                </Link>
                <Link href="/features" className="px-6 py-3 text-base font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all flex items-center gap-2">
                  <Play className="w-4 h-4" /> Watch Demo
                </Link>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-50 dark:bg-white/[0.04] text-sm text-surface-500 dark:text-surface-400">
                <span className="text-warning-500">★</span>
                <span className="font-medium">4.9</span>
                <span className="text-surface-400">·</span>
                <span>100K+ live apps</span>
                <span className="text-surface-400">·</span>
                <span>500K+ agents deployed</span>
              </div>
            </div>
          </div>
        </section>

        {/* AI Models */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                15+ Frontier AI Models
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                Auto-routed to the best model for each task. Or choose your own.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {aiModels.map((model) => (
                <div key={model.name} className="p-5 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 text-center hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all">
                  <div className="text-sm font-bold text-surface-900 dark:text-white mb-1">{model.name}</div>
                  <div className="text-xs text-surface-500 dark:text-surface-400 mb-2">{model.provider}</div>
                  <div className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 inline-block">
                    {model.tag}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Including GPT-4o, Claude 3.5, Gemini Pro, Llama 3, Mistral, and more. Always the latest releases.
              </p>
            </div>
          </div>
        </section>

        {/* Agent Types */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Specialized AI Agents
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                Build a team of agents, each with a specific role, memory, and set of tools.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {agentTypes.map((agent) => {
                const Icon = agent.icon;
                return (
                  <div key={agent.title} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{agent.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{agent.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                From Prompt to Live App
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                Describe what you need. AI builds the rest.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {buildSteps.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
                    <div className="text-3xl font-extrabold momentum-text mb-4">{item.step}</div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 dark:from-brand-400/10 dark:to-intelligence-400/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Built for Humans. Architected for Agents.
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Why teams choose Momentum AI over point solutions.
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-surface-200 dark:border-white/[0.08]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-white/[0.08] bg-surface-50 dark:bg-white/[0.03]">
                    <th className="text-left px-5 py-3.5 font-semibold text-surface-900 dark:text-white">Capability</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-brand-600 dark:text-brand-400">Momentum AI</th>
                    <th className="text-center px-5 py-3.5 font-medium text-surface-500 hidden md:table-cell">AI Chat</th>
                    <th className="text-center px-5 py-3.5 font-medium text-surface-500 hidden md:table-cell">Code Gen</th>
                    <th className="text-center px-5 py-3.5 font-medium text-surface-500 hidden md:table-cell">Automation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200 dark:divide-white/[0.06]">
                  {comparisonFeatures.map((row, i) => (
                    <tr key={i} className="hover:bg-surface-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 font-medium text-surface-700 dark:text-surface-300">{row.feature}</td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1.5 text-memory-500">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Yes</span>
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center hidden md:table-cell">
                        {row.chatgpt ? <CheckCircle className="w-4 h-4 text-memory-500 mx-auto" /> : <span className="text-surface-300 dark:text-surface-600">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-center hidden md:table-cell">
                        {row.claude ? <CheckCircle className="w-4 h-4 text-memory-500 mx-auto" /> : <span className="text-surface-300 dark:text-surface-600">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-center hidden md:table-cell">
                        {row.auto ? <CheckCircle className="w-4 h-4 text-memory-500 mx-auto" /> : <span className="text-surface-300 dark:text-surface-600">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-center text-sm text-surface-500 dark:text-surface-400 mt-3">
              Humans direct · agents execute · running 24/7
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Build Your First AI System
                </h2>
                <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
                  One prompt. One app. One team of agents. Ready in minutes.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2">
                    Start Building <Zap className="w-4 h-4" />
                  </Link>
                  <Link href="/gallery" className="px-6 py-3 text-base font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                    Explore Gallery <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-2">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-sm font-semibold text-surface-900 dark:text-white pr-4">{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-4 h-4 text-surface-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-surface-400 shrink-0" />
                    )}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-5">
                      <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
