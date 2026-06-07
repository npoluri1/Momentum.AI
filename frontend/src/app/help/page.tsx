'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import SiteNav from '@/components/layout/SiteNav';
import {
  Search, ChevronDown, Mail, MessageCircle, BookOpen,
  Rocket, Bot, CheckSquare, Workflow, Database, Shield,
  Puzzle, Wrench, LifeBuoy, ArrowRight,
} from 'lucide-react';

const categories = [
  {
    icon: Rocket,
    title: 'Getting Started',
    description: 'Set up your workspace, create your first project, and invite your team.',
    articleCount: 12,
    gradient: 'from-brand-500 to-brand-600',
  },
  {
    icon: Bot,
    title: 'AI Agents',
    description: 'Create, configure, and deploy AI agents to automate your workflows.',
    articleCount: 18,
    gradient: 'from-intelligence-500 to-intelligence-600',
  },
  {
    icon: CheckSquare,
    title: 'Projects & Tasks',
    description: 'Manage projects, assign tasks, and track progress across your team.',
    articleCount: 15,
    gradient: 'from-memory-500 to-memory-600',
  },
  {
    icon: Workflow,
    title: 'Automations',
    description: 'Build powerful workflows with triggers, actions, and conditional logic.',
    articleCount: 14,
    gradient: 'from-execution-500 to-execution-600',
  },
  {
    icon: Database,
    title: 'CRM',
    description: 'Manage contacts, deals, pipelines, and customer relationships.',
    articleCount: 10,
    gradient: 'from-brand-500 to-intelligence-500',
  },
  {
    icon: Shield,
    title: 'Account & Billing',
    description: 'Manage your account settings, subscription, and payment methods.',
    articleCount: 8,
    gradient: 'from-warning-400 to-warning-500',
  },
  {
    icon: Puzzle,
    title: 'Integrations',
    description: 'Connect Momentum AI with Slack, Google, Microsoft, and 100+ apps.',
    articleCount: 22,
    gradient: 'from-memory-500 to-execution-500',
  },
  {
    icon: Wrench,
    title: 'Troubleshooting',
    description: 'Common issues, error messages, and how to resolve them.',
    articleCount: 9,
    gradient: 'from-brand-500 to-memory-500',
  },
];

const faqs = [
  {
    question: 'How do I create my first AI agent?',
    answer: 'Navigate to the Agents section in your workspace and click "Create Agent". Choose a template or start from scratch. Give your agent a name, define its role and goals, and configure its memory sources. Once created, you can assign it to projects and tasks where it will begin learning and executing autonomously.',
  },
  {
    question: 'Can I connect external tools to my agents?',
    answer: 'Yes. Momentum AI agents support integrations with over 100 external services including Slack, Google Workspace, Microsoft 365, Salesforce, HubSpot, and more. You can also use our API to build custom integrations. Agents can read from and write to connected services based on their configured permissions and triggers.',
  },
  {
    question: 'How does the workflow automation engine work?',
    answer: 'Our workflow engine uses a trigger-action model. You define triggers (e.g., "when a deal stage changes" or "at 9 AM daily") and actions (e.g., "send Slack notification" or "create task"). Version 2.3+ supports conditional branching with if/else logic, loops, and parallel execution paths for complex automations.',
  },
  {
    question: 'How do I set up CRM pipeline stages?',
    answer: 'Go to the CRM section and open Pipeline Settings. You can create custom stages like "Lead", "Qualified", "Proposal", "Negotiation", and "Closed Won". For each stage, set automation rules, assignment logic, and notification preferences. You can reorder stages with drag-and-drop.',
  },
  {
    question: 'Can I collaborate with my team in real time?',
    answer: 'Absolutely. Momentum AI supports real-time collaborative editing with cursor presence, live updates, and built-in chat. Multiple team members can work on the same project simultaneously with changes synced instantly via our CRDT-based collaboration engine. Permissions can be set per project or workspace.',
  },
  {
    question: 'How do I integrate with Slack?',
    answer: 'Go to Settings > Integrations > Slack and click "Connect". Authorize Momentum AI in Slack, then configure which channels receive notifications. You can set up Slack commands to create tasks, search projects, and trigger workflows directly from Slack without leaving your chat.',
  },
  {
    question: 'What happens when I clone a workspace?',
    answer: 'Cloning creates an exact copy of the workspace including all projects, tasks, agents, automations, and settings. The cloned workspace starts with a fresh state — no connected data or live agent sessions are transferred. You can use cloning to create templates, onboard new teams, or experiment with new setups.',
  },
  {
    question: 'How does billing work?',
    answer: 'Momentum AI offers a free tier with core features and paid plans starting at $19/month per user. Billing is monthly or annual (annual saves 20%). Each plan includes a set number of AI agent credits, workflow runs, and storage. You can upgrade, downgrade, or cancel anytime. Invoices are sent via email.',
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes. You can export your workspace data in multiple formats including JSON, CSV, and Markdown. Go to Workspace Settings > Export Data to download your projects, tasks, contacts, and automation configurations. We also support direct migration to Notion, Asana, and Linear.',
  },
  {
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page. Enter your registered email address and we\'ll send you a password reset link. The link expires in 1 hour. If you don\'t receive the email, check your spam folder or contact support for assistance.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Momentum AI takes security seriously. We encrypt data at rest (AES-256) and in transit (TLS 1.3). Our infrastructure is hosted on AWS with SOC 2 compliance. We offer SSO via Google, Microsoft, and Okta, and support role-based access control for granular permissions.',
  },
  {
    question: 'How do I invite team members?',
    answer: 'Go to your workspace settings and click "Invite Members". You can invite via email or share a workspace invite link. Set each member\'s role — Admin, Editor, or Viewer. Invited members receive an email with instructions to join. You can manage all members from the workspace dashboard.',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white dark:from-brand-950/10 dark:to-[#0a0a0f] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-brand-500/10 to-intelligence-500/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative">
        <section className="pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
                <LifeBuoy className="w-4 h-4" />
                Support Center
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                <span className="text-surface-900 dark:text-white">Help Center</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8">
                Find answers, explore guides, and get the most out of Momentum AI.
              </p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 text-base rounded-2xl border border-surface-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredCategories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={i}
                    className="group p-5 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all cursor-pointer"
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform',
                      cat.gradient
                    )}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mb-3 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-surface-400 dark:text-surface-500">
                        {cat.articleCount} articles
                      </span>
                      <span className="text-xs font-medium text-brand-500 dark:text-brand-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        View articles <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-surface-500 dark:text-surface-400">
                Quick answers to common questions about Momentum AI.
              </p>
            </div>

            <div className="space-y-3">
              {(searchQuery ? filteredFaqs : faqs).map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-sm font-semibold text-surface-900 dark:text-white pr-4">
                      {faq.question}
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
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Still have questions?
                </h2>
                <p className="text-brand-100 mb-8 max-w-md mx-auto">
                  Our team is here to help. Get in touch and we&apos;ll get back to you within 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="mailto:support@momentum.ai"
                    className="px-6 py-3 text-sm font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Support
                  </Link>
                  <button className="px-6 py-3 text-sm font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Live Chat
                  </button>
                  <button className="px-6 py-3 text-sm font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Documentation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
