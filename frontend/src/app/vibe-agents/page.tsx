'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/layout/SiteNav';
import Footer from '@/components/layout/Footer';
import {
  Bot, Zap, ArrowRight, CheckCircle, Sparkles,
  Brain, Globe, Code, FileText, BarChart3, Mail,
  MessageSquare, ChevronDown, Cpu, Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const agentTypes = [
  { icon: Brain, title: 'Research Agents', desc: 'Scan the web, analyze data, and compile reports autonomously 24/7.' },
  { icon: Globe, title: 'Sales Agents', desc: 'Qualify leads, send outreach, and book meetings while you sleep.' },
  { icon: Code, title: 'Dev Agents', desc: 'Review code, write tests, debug errors, and deploy changes.' },
  { icon: FileText, title: 'Content Agents', desc: 'Write blog posts, social content, and marketing copy on schedule.' },
  { icon: BarChart3, title: 'Analytics Agents', desc: 'Monitor KPIs, detect anomalies, and alert your team instantly.' },
  { icon: Mail, title: 'Support Agents', desc: 'Answer tickets, route issues, and resolve common problems automatically.' },
];

const agentModels = [
  { name: 'GPT-4o', provider: 'OpenAI', speed: 'Fast', quality: 'Best', color: 'from-green-500 to-emerald-600' },
  { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', speed: 'Fast', quality: 'Best', color: 'from-orange-500 to-amber-600' },
  { name: 'Gemini 1.5 Pro', provider: 'Google', speed: 'Fast', quality: 'Great', color: 'from-blue-500 to-indigo-600' },
  { name: 'Llama 3.1 405B', provider: 'Meta', speed: 'Moderate', quality: 'Great', color: 'from-purple-500 to-violet-600' },
];

const buildSteps = [
  { icon: MessageSquare, title: 'Define Role', desc: 'Tell EVE what the agent should do. "Monitor competitor pricing and alert me daily."' },
  { icon: Bot, title: 'Pick Model', desc: 'Choose from 15+ frontier AI models. Assign different models to different tasks.' },
  { icon: Database, title: 'Give Memory', desc: 'Connect documents, databases, and APIs. The agent remembers everything.' },
  { icon: Zap, title: 'Deploy', desc: 'Run the agent manually, schedule it, or trigger it from workflows.' },
];

const faqs = [
  { q: 'What can AI agents do?', a: 'AI agents on MOMENTUM AI are autonomous workers that can research the web, analyze data, write content, review code, answer support tickets, qualify leads, and execute tasks 24/7. Each agent has memory, tools, and the ability to collaborate with other agents.' },
  { q: 'How do agents get their memory?', a: 'Agents connect to your workspace documents, uploaded files, connected databases, and external APIs via integrations. They retain context across conversations and can recall information from any connected source. You control what each agent can access.' },
  { q: 'Can agents work together?', a: 'Yes. Multi-agent orchestration lets you create teams of agents that collaborate on complex tasks. A research agent can find data, a writer agent can draft a report, and a review agent can check it — all automatically.' },
  { q: 'Which AI models power the agents?', a: '15+ frontier models: GPT-4o, GPT-4 Turbo, Claude 3.5 Sonnet, Claude 3 Opus, Gemini 1.5 Pro, Llama 3.1, Mistral Large, and more. You choose which model each agent uses, or let EVE optimize automatically.' },
  { q: 'Are my agents running 24/7?', a: 'Yes. Background agents run continuously, checking triggers, monitoring data, and executing tasks on schedule. You set the cadence: real-time, hourly, daily, or event-driven. Agents never sleep.' },
];

export default function VibeAgentsPage() {
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
                Autonomous AI workers for your team
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                <span className="text-surface-900 dark:text-white">Vibe Agents.</span>
                <br />
                <span className="momentum-text">Never sleep.</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                Build autonomous AI agents that research, write, code, sell, and support — 24/7. Give them memory, tools, and a mission.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-xl shadow-brand-500/30 transition-all active:scale-[0.98] flex items-center gap-2">
                  Build an Agent <Zap className="w-4 h-4" />
                </Link>
                <Link href="/workspace/agents" className="px-6 py-3 text-base font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all flex items-center gap-2">
                  View Agent Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Agent Types */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Specialized agents for every role
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Pick a type. Customize it. Deploy it.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agentTypes.map((agent) => {
                const Icon = agent.icon;
                return (
                  <div key={agent.title} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 dark:from-brand-400/10 dark:to-intelligence-400/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{agent.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{agent.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Models */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                15+ frontier AI models
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Choose the best model for each agent. Or let EVE optimize automatically.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {agentModels.map((model) => (
                <div key={model.name} className="p-5 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center mb-3`}>
                    <Cpu className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-sm font-bold text-surface-900 dark:text-white mb-0.5">{model.name}</div>
                  <div className="text-xs text-surface-500 dark:text-surface-400 mb-3">{model.provider}</div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] rounded-md bg-surface-100 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 font-medium">{model.speed}</span>
                    <span className="px-2 py-0.5 text-[10px] rounded-md bg-surface-100 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400 font-medium">{model.quality}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">
                Build an agent in 4 steps
              </h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                No code. Just describe, configure, and deploy.
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
              <p className="text-surface-500 dark:text-surface-400">Common questions about Vibe Agents.</p>
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Build Your First AI Agent</h2>
                <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
                  Give an agent a mission, tools, and memory. Watch it work 24/7.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/create" className="px-6 py-3 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2">
                    Create Agent <Zap className="w-4 h-4" />
                  </Link>
                  <Link href="/workspace/agents" className="px-6 py-3 text-base font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                    Agent Dashboard <ArrowRight className="w-4 h-4" />
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
