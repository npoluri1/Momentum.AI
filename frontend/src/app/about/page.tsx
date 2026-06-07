'use client';


import Link from 'next/link';
import {
  Users, Globe, Shield, Lightbulb, Handshake, Eye, Zap,
  Sparkles, ArrowRight, Calendar, MapPin, Building,
} from 'lucide-react';
import SiteNav from '@/components/layout/SiteNav';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

const stats = [
  { icon: Users, value: '5M+', label: 'Users' },
  { icon: Users, value: '500K+', label: 'Teams' },
  { icon: Globe, value: '50+', label: 'Countries' },
  { icon: Shield, value: '99.9%', label: 'Uptime' },
];

const founders = [
  { name: 'John Xie', role: 'CEO & Co-Founder', description: 'Previously founded multiple startups. Obsessed with building tools that help teams think and work better.', gradient: 'from-brand-500 to-brand-600' },
  { name: 'Dionis Loire', role: 'Co-Founder', description: 'Product visionary who believes the future of work is AI-native. Leads product strategy and growth.', gradient: 'from-intelligence-500 to-brand-500' },
  { name: 'Stan Chang', role: 'CTO & Co-Founder', description: 'Engineering leader with deep expertise in distributed systems and AI infrastructure. Ex-Google.', gradient: 'from-execution-500 to-intelligence-500' },
];

const timeline = [
  { year: '2017', title: 'Founded', description: 'Momentum AI was founded in San Francisco with a vision to build the first AI-native workspace.' },
  { year: '2018', title: 'Y Combinator', description: 'Accepted into Y Combinator W18 batch. Refining the core workspace and collaboration engine.' },
  { year: '2019', title: 'Public Launch', description: 'Launched the first version of Momentum AI with real-time collaborative task management.' },
  { year: '2020', title: 'Remote Work', description: 'Doubled down on remote-first features as the world shifted to distributed work.' },
  { year: '2021', title: 'AI-Powered', description: 'Introduced AI writing and editing assistance directly inside the workspace.' },
  { year: '2022', title: 'Automations', description: 'Launched the workflow automation engine with trigger-based actions and integrations.' },
  { year: '2023', title: 'Genesis', description: 'Unveiled Genesis — build entire apps, agents, and automations from a single prompt.' },
  { year: '2024', title: 'Enterprise', description: 'Launched Enterprise with SSO, SAML, custom domains, and advanced security controls.' },
  { year: '2025', title: 'Agentic AI', description: 'Released multi-agent systems with shared memory, background execution, and 24/7 runtime.' },
  { year: '2026', title: 'Living Software', description: 'The platform reaches maturity with 100K+ live apps, 500K+ deployed agents, and 100+ integrations.' },
];const team = [
  ...founders,
  { name: 'Marcus Williams', role: 'VP of Engineering', description: '20+ years building distributed systems at scale. Ex-Google, ex-Amazon.',  gradient: 'from-execution-500 to-intelligence-500' },
  { name: 'Emily Rodriguez', role: 'Head of Design', description: 'Award-winning product designer who believes AI should feel human.', gradient: 'from-memory-500 to-execution-500' },
  { name: 'David Kim', role: 'Head of AI', description: 'PhD in Machine Learning. Building the next generation of autonomous work agents.', gradient: 'from-brand-500 to-memory-500' },
  { name: 'Lisa Patel', role: 'VP of Product', description: 'Product leader who turns complex problems into intuitive user experiences.', gradient: 'from-intelligence-500 to-execution-500' },
];

const values = [
  { icon: Lightbulb, title: 'Innovation', description: 'We push the boundaries of what\'s possible with AI. Every day is an opportunity to build something that didn\'t exist yesterday.' },
  { icon: Handshake, title: 'Collaboration', description: 'Great things happen when diverse minds come together. We build in the open and ship together.' },
  { icon: Eye, title: 'Transparency', description: 'We communicate openly with each other and our users. Trust is earned through honesty and clarity.' },
  { icon: Zap, title: 'Impact', description: 'We measure success by the value we create for our users. Every feature should make someone\'s work better.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />

      <main className="pt-14">
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white dark:from-brand-950/10 dark:to-[#0a0a0f] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-brand-500/10 to-intelligence-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-execution-500/10 to-memory-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
              <Sparkles className="w-4 h-4" />
              Our Story
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              <span className="text-surface-900 dark:text-white">About</span>
              <br />
              <span className="momentum-text">Momentum AI</span>
            </h1>
            <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              One prompt. One living system.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 leading-relaxed">
                We&apos;re building the world&apos;s first AI-native workspace platform. A place where projects hold memory,
                agents do the thinking, and automations run the work — wired together from day one. We believe the
                future of work is not about more tools, but about a single living system that adapts to how you work.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 text-center">
                    <Icon className="w-6 h-6 text-brand-500 dark:text-brand-400 mx-auto mb-3" />
                    <div className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-12 text-center">Our Story</h2>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500 via-intelligence-500 to-execution-500 -translate-x-1/2 hidden md:block" />
              <div className="space-y-8 md:space-y-12">
                {timeline.map((event, i) => (
                  <div key={event.year} className={cn(
                    'relative flex items-start gap-4 md:gap-8',
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  )}>
                    <div className={cn(
                      'flex-1 md:w-1/2',
                      i % 2 === 0 ? 'md:text-right' : 'md:text-left'
                    )}>
                      <div className="p-5 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
                        <div className="text-sm font-bold momentum-text mb-1">{event.year}</div>
                        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">{event.title}</h3>
                        <p className="text-sm text-surface-500 dark:text-surface-400">{event.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-500 border-4 border-white dark:border-[#0a0a0f] z-10" />
                    <div className="md:w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4 text-center">Meet the Team</h2>
            <p className="text-lg text-surface-500 dark:text-surface-400 mb-12 text-center max-w-2xl mx-auto">
              We&apos;re a passionate group of builders, designers, and dreamers on a mission to transform how the world works.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member) => (
                <div key={member.name} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all group">
                  <div className={cn(
                    'w-16 h-16 rounded-2xl bg-gradient-to-br mb-4 flex items-center justify-center',
                    'shadow-lg transition-transform group-hover:scale-110 duration-300',
                    member.gradient
                  )}>
                    <span className="text-xl font-bold text-white">{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">{member.name}</h3>
                  <div className="text-sm font-medium text-brand-500 dark:text-brand-400 mb-3">{member.role}</div>
                  <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4 text-center">Our Values</h2>
            <p className="text-lg text-surface-500 dark:text-surface-400 mb-12 text-center max-w-2xl mx-auto">
              The principles that guide every decision we make.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 dark:from-brand-400/10 dark:to-intelligence-400/10 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{value.title}</h3>
                      <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden text-center">
              <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Come build the future of work</h2>
                <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
                  Join us in creating the world&apos;s first AI-native workspace platform.
                </p>
                <Link href="/careers" className="px-6 py-3 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2 mx-auto">
                  View Openings <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <Calendar className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                <div>
                  <div className="text-sm font-semibold text-surface-900 dark:text-white">Founded</div>
                  <div className="text-sm text-surface-500 dark:text-surface-400">2017</div>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center">
                <MapPin className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                <div>
                  <div className="text-sm font-semibold text-surface-900 dark:text-white">HQ</div>
                  <div className="text-sm text-surface-500 dark:text-surface-400">San Francisco, CA</div>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center sm:justify-end">
                <Building className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                <div>
                  <div className="text-sm font-semibold text-surface-900 dark:text-white">Backed by</div>
                  <div className="text-sm text-surface-500 dark:text-surface-400">Y Combinator</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-100 dark:bg-white/[0.04] text-sm text-surface-500 dark:text-surface-400">
                <Globe className="w-4 h-4" />
                Remote-friendly
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
