'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/layout/SiteNav';
import { cn } from '@/lib/utils';
import {
  Users, Palette, MessageSquare, Paperclip, BarChart3,
  CheckSquare, ArrowRight, Play, Shield, Fingerprint,
  FileText, Lock, ChevronDown, Sparkles, ExternalLink,
  Monitor, Building2, Briefcase, User,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Guest Access',
    description: 'Clients can view workspaces, projects, and tasks without signing up or creating an account.',
    gradient: 'from-brand-500 to-brand-600',
  },
  {
    icon: Palette,
    title: 'White Label',
    description: 'Custom branding with your own logo, colors, and domain for a seamless client experience.',
    gradient: 'from-intelligence-500 to-intelligence-600',
  },
  {
    icon: MessageSquare,
    title: 'Comments & Feedback',
    description: 'Clients can leave comments on tasks, projects, and files directly in the portal.',
    gradient: 'from-memory-500 to-memory-600',
  },
  {
    icon: Paperclip,
    title: 'File Sharing',
    description: 'Secure file uploads and downloads with version history and access controls.',
    gradient: 'from-execution-500 to-execution-600',
  },
  {
    icon: BarChart3,
    title: 'Progress Views',
    description: 'Read-only project progress views so clients stay informed without disrupting workflows.',
    gradient: 'from-brand-500 to-intelligence-500',
  },
  {
    icon: CheckSquare,
    title: 'Approval Workflows',
    description: 'Client approval gates for milestones, deliverables, and project sign-offs.',
    gradient: 'from-warning-400 to-warning-500',
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Create a workspace',
    description: 'Set up your projects, tasks, and team just like you normally would in Momentum AI.',
  },
  {
    step: 2,
    title: 'Share a portal link',
    description: 'Generate a unique client portal link with optional passcode protection.',
  },
  {
    step: 3,
    title: 'Clients interact in real-time',
    description: 'Clients view progress, leave feedback, and approve work — all in real-time.',
  },
];

const securityItems = [
  { icon: Shield, title: 'End-to-End Encryption', description: 'All data encrypted at rest (AES-256) and in transit (TLS 1.3).' },
  { icon: Fingerprint, title: 'SSO & SAML', description: 'Support for Google, Microsoft, Okta, and custom SAML providers.' },
  { icon: FileText, title: 'Audit Logs', description: 'Full audit trail of all client actions and portal access.' },
  { icon: Lock, title: 'Granular Permissions', description: 'Control exactly what clients can see, comment on, and approve.' },
];

const useCases = [
  {
    icon: Building2,
    title: 'Agency',
    description: 'Share campaign progress, creative assets, and client deliverables in a branded portal.',
    gradient: 'from-brand-500 to-brand-600',
  },
  {
    icon: Briefcase,
    title: 'Consulting',
    description: 'Provide clients with real-time access to project milestones, reports, and recommendations.',
    gradient: 'from-intelligence-500 to-intelligence-600',
  },
  {
    icon: User,
    title: 'Freelancer',
    description: 'Give clients a professional portal to track project status, share files, and approve work.',
    gradient: 'from-memory-500 to-memory-600',
  },
  {
    icon: Monitor,
    title: 'Enterprise',
    description: 'Scalable client portals with SSO, custom branding, and enterprise-grade security.',
    gradient: 'from-execution-500 to-execution-600',
  },
];

const plans = [
  {
    name: 'Free', price: '$0', period: '/month',
    features: ['1 workspace', '1 AI agent', '1K credits/mo', 'Basic automations', '100MB storage'],
    cta: 'Get Started', popular: false,
  },
  {
    name: 'Starter', price: '$6', period: '/month',
    features: ['3 workspaces', '3 AI agents', '10K credits/mo', 'Advanced automations', '10GB storage', 'API access'],
    cta: 'Start Free Trial', popular: false,
  },
  {
    name: 'Pro', price: '$16', period: '/month',
    features: ['Unlimited workspaces', 'Unlimited agents', '50K credits/mo', 'Advanced automations', '100GB storage', 'API access', 'Priority support', 'Client Portal'],
    cta: 'Start Free Trial', popular: true,
  },
  {
    name: 'Business', price: '$40', period: '/month',
    features: ['Unlimited workspaces', 'Unlimited agents', '150K credits/mo', 'Enterprise automations', '1TB storage', 'API access', '24/7 support', 'SSO & SAML', 'Client Portal'],
    cta: 'Contact Sales', popular: false,
  },
];

const faqs = [
  {
    question: 'Do clients need to create an account to use the portal?',
    answer: 'No. Clients can access the portal via a shareable link without signing up. You can optionally add passcode protection for extra security.',
  },
  {
    question: 'Can I customize the portal with my own branding?',
    answer: 'Yes. Pro and Business plans include white labeling — upload your logo, set custom colors, and use your own domain for a fully branded client experience.',
  },
  {
    question: 'What can clients see and do in the portal?',
    answer: 'You control permissions per workspace. Clients can view projects and tasks, leave comments, upload files, and approve milestones. All views are read-only for non-editors.',
  },
  {
    question: 'Is the client portal secure?',
    answer: 'Absolutely. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We offer SSO/SAML, granular permission controls, and full audit logging.',
  },
  {
    question: 'Which plans include the client portal?',
    answer: 'The client portal is included in Pro and Business plans. Free and Starter plans can try it with limited features during the trial period.',
  },
];

export default function ClientPortalPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white dark:from-brand-950/10 dark:to-[#0a0a0f] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-gradient-to-r from-brand-500/10 to-intelligence-500/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative">
        <section className="pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
                <Sparkles className="w-4 h-4" />
                Client Portal
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
                <span className="text-surface-900 dark:text-white">Client Portal</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-10">
                Share workspaces, projects, and tasks with clients — no account required
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="px-8 py-4 text-base font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/30 flex items-center gap-2"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="px-8 py-4 text-base font-semibold rounded-xl border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Watch Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-3">
                Everything you need to share with clients
              </h2>
              <p className="text-surface-500 dark:text-surface-400">
                A complete toolkit for client collaboration, built into Momentum AI.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    className="group p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all"
                  >
                    <div className={cn(
                      'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform',
                      feature.gradient
                    )}>
                      <Icon className="w-5.5 h-5.5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-3">
                How it works
              </h2>
              <p className="text-surface-500 dark:text-surface-400">
                Get your client portal up and running in minutes.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {howItWorks.map((item, i) => (
                <div key={i} className="relative text-center">
                  {i < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px border-t-2 border-dashed border-surface-300 dark:border-surface-600" />
                  )}
                  <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-5">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 max-w-xs mx-auto">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-500 via-intelligence-500 to-execution-500 p-1">
              <div className="rounded-3xl bg-surface-900 dark:bg-[#0a0a0f] p-10 md:p-14">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 cursor-pointer group hover:bg-white/20 transition-all">
                    <Play className="w-7 h-7 text-white ml-0.5 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    See the Client Portal in action
                  </h3>
                  <p className="text-surface-400 max-w-md mx-auto">
                    Watch a 2-minute demo of how to set up and share a client portal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-3">
                Enterprise-grade security
              </h2>
              <p className="text-surface-500 dark:text-surface-400">
                Your data is protected by industry-leading security standards.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {securityItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40"
                  >
                    <Icon className="w-8 h-8 text-brand-500 mb-4" />
                    <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-3">
                Perfect for every workflow
              </h2>
              <p className="text-surface-500 dark:text-surface-400">
                Teams of all sizes use the Momentum AI Client Portal to collaborate with clients.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {useCases.map((useCase, i) => {
                const Icon = useCase.icon;
                return (
                  <div
                    key={i}
                    className="group p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all"
                  >
                    <div className={cn(
                      'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform',
                      useCase.gradient
                    )}>
                      <Icon className="w-5.5 h-5.5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                      {useCase.title}
                    </h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
                <Sparkles className="w-4 h-4" />
                Pricing
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-3">
                Included in Pro and Business plans
              </h2>
              <p className="text-surface-500 dark:text-surface-400 mb-10">
                The Client Portal is available on every plan. Start free, upgrade when you need more.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div key={plan.name} className={`relative p-6 rounded-2xl border transition-all ${
                  plan.popular
                    ? 'bg-white dark:bg-surface-800 border-brand-500 shadow-xl shadow-brand-500/10 scale-105'
                    : 'bg-white dark:bg-surface-900/50 border-surface-200 dark:border-surface-700'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xs font-semibold">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">{plan.features.slice(0, 2).join(', ')}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-surface-900 dark:text-white">{plan.price}</span>
                    <span className="text-surface-400 dark:text-surface-500">{plan.period}</span>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckSquare className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                        <span className="text-surface-600 dark:text-surface-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                    plan.popular
                      ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/30'
                      : 'border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                  }`}>
                    {plan.cta} <ArrowRight className="w-3.5 h-3.5 ml-1 inline-block" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-surface-500 dark:text-surface-400">
                Everything you need to know about the Client Portal.
              </p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
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
                  Start sharing with clients today
                </h2>
                <p className="text-brand-100 mb-8 max-w-md mx-auto">
                  Create your first client portal in minutes. No credit card required.
                </p>
                <Link
                  href="/register"
                  className="inline-flex px-8 py-4 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg items-center gap-2"
                >
                  Get Started Free <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
