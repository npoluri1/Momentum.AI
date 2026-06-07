'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/layout/SiteNav';
import { cn } from '@/lib/utils';
import {
  Sparkles, ArrowRight, MapPin, Globe, Clock, Heart, Zap,
  Briefcase, Coffee, BookOpen, Dumbbell, Plane, Stethoscope,
  ChevronDown, CheckCircle, Star, Users, Lightbulb, Target,
  Monitor, Smartphone, Layers, Palette, Code, Search, Mail,
} from 'lucide-react';

const departments = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Operations', 'AI/ML'];

const jobs = [
  { id: '1', title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', posted: '2 days ago', featured: true },
  { id: '2', title: 'Backend Engineer — Rust/Go', department: 'Engineering', location: 'San Francisco', type: 'Full-time', posted: '3 days ago', featured: true },
  { id: '3', title: 'Staff AI/ML Engineer', department: 'AI/ML', location: 'Remote', type: 'Full-time', posted: '1 week ago', featured: true },
  { id: '4', title: 'Product Designer', department: 'Design', location: 'Remote', type: 'Full-time', posted: '3 days ago', featured: false },
  { id: '5', title: 'Senior Product Manager', department: 'Product', location: 'New York', type: 'Full-time', posted: '5 days ago', featured: false },
  { id: '6', title: 'Growth Marketing Manager', department: 'Marketing', location: 'Remote', type: 'Full-time', posted: '1 week ago', featured: false },
  { id: '7', title: 'Enterprise Sales Director', department: 'Sales', location: 'San Francisco', type: 'Full-time', posted: '2 weeks ago', featured: false },
  { id: '8', title: 'DevOps / SRE Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', posted: '4 days ago', featured: false },
  { id: '9', title: 'UX Researcher', department: 'Design', location: 'Remote', type: 'Full-time', posted: '1 week ago', featured: false },
  { id: '10', title: 'AI Research Scientist', department: 'AI/ML', location: 'San Francisco', type: 'Full-time', posted: '2 weeks ago', featured: false },
  { id: '11', title: 'Customer Success Manager', department: 'Operations', location: 'Remote', type: 'Full-time', posted: '3 days ago', featured: false },
  { id: '12', title: 'Content Marketing Lead', department: 'Marketing', location: 'Remote', type: 'Full-time', posted: '5 days ago', featured: false },
];

const benefits = [
  { icon: Globe, title: 'Remote-First', desc: 'Work from anywhere. We are a distributed team across 20+ countries.' },
  { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive medical, dental, and vision coverage for you and dependents.' },
  { icon: Zap, title: 'Competitive Compensation', desc: 'Top-of-market salary, equity, and performance bonuses.' },
  { icon: Plane, title: 'Flexible PTO', desc: 'Unlimited paid time off. Take the time you need to recharge.' },
  { icon: BookOpen, title: 'Learning Budget', desc: '$3,000 annual budget for courses, conferences, and books.' },
  { icon: Dumbbell, title: 'Wellness Stipend', desc: '$100/month for gym, fitness apps, or mental health support.' },
  { icon: Monitor, title: 'Home Office', desc: 'Full remote setup including laptop, monitor, and ergonomic equipment.' },
  { icon: Coffee, title: 'Team Retreats', desc: 'Quarterly team off-sites in cities around the world.' },
];

const values = [
  { icon: Lightbulb, title: 'Build Bold', desc: 'We take on hard problems and ship ambitious solutions.' },
  { icon: Users, title: 'Collaborate Openly', desc: 'Great ideas come from everywhere. We debate respectfully and decide quickly.' },
  { icon: Target, title: 'Impact First', desc: 'We measure success by the value we create for users, not hours logged.' },
  { icon: Star, title: 'Craft Matters', desc: 'We sweat the details. Polish is not optional.' },
];

const teamStats = [
  { label: 'Team Size', value: '120+' },
  { label: 'Countries', value: '20+' },
  { label: 'Remote', value: '100%' },
  { label: 'Avg. Tenure', value: '2.5 yrs' },
];

export default function CareersPage() {
  const [activeDept, setActiveDept] = useState('All');
  const [search, setSearch] = useState('');
  const [openJob, setOpenJob] = useState<string | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesDept = activeDept === 'All' || job.department === activeDept;
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />

      <main className="pt-14">
        {/* Hero */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white dark:from-brand-950/10 dark:to-[#0a0a0f] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-brand-500/10 to-intelligence-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-execution-500/10 to-memory-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
              <Sparkles className="w-4 h-4" />
              We&apos;re Hiring
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              <span className="text-surface-900 dark:text-white">Join the team</span>
              <br />
              <span className="momentum-text">building the future</span>
            </h1>
            <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Help us create the world&apos;s first AI-native workspace. Remote-first, impact-driven, and always building.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-surface-500 dark:text-surface-400">
              {teamStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-100/50 dark:bg-white/[0.04] border border-surface-200/30 dark:border-white/[0.06]">
                  <span className="font-bold text-surface-900 dark:text-white">{stat.value}</span>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">How We Work</h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                Our culture is built on autonomy, craft, and genuine care for the people who use what we build.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div key={value.title} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 text-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{value.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{value.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">Perks & Benefits</h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                We invest in our team so they can do their best work.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="p-5 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all group">
                    <Icon className="w-6 h-6 text-brand-500 dark:text-brand-400 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-1">{benefit.title}</h3>
                    <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{benefit.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Job Openings */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">Open Positions</h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                {filteredJobs.length} roles currently open. Find your fit.
              </p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search roles..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-surface-200 dark:border-white/[0.08] bg-white dark:bg-[#0a0a0f]/40 text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-hide pb-1">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setActiveDept(dept)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all',
                      activeDept === dept
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'bg-white dark:bg-[#0a0a0f]/40 border border-surface-200 dark:border-white/[0.06] text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-white/[0.06]'
                    )}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Job List */}
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={cn(
                    'rounded-2xl border overflow-hidden transition-all',
                    job.featured
                      ? 'border-brand-200/50 dark:border-brand-500/20 bg-white dark:bg-[#0a0a0f]/40'
                      : 'border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40'
                  )}
                >
                  <button
                    onClick={() => setOpenJob(openJob === job.id ? null : job.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                        job.featured
                          ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white'
                          : 'bg-surface-100 dark:bg-white/[0.06] text-surface-500 dark:text-surface-400'
                      )}>
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-surface-900 dark:text-white">{job.title}</span>
                          {job.featured && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-surface-500 dark:text-surface-400">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.type}</span>
                          <span>{job.posted}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={cn('w-4 h-4 text-surface-400 shrink-0 transition-transform duration-300', openJob === job.id && 'rotate-180')} />
                  </button>
                  <div className={cn('overflow-hidden transition-all duration-300', openJob === job.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}>
                    <div className="px-5 pb-5 space-y-4">
                      <div className="h-px bg-surface-200/50 dark:bg-white/[0.06]" />
                      <div>
                        <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-2">About the Role</h4>
                        <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                          We are looking for a talented {job.title} to join our growing team. You will work on cutting-edge AI-native workspace technology used by hundreds of thousands of users worldwide.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-surface-900 dark:text-white mb-2">What You&apos;ll Do</h4>
                        <ul className="space-y-1.5">
                          {['Ship high-impact features end-to-end', 'Collaborate with cross-functional teams', 'Contribute to product and technical direction', 'Mentor and grow junior team members'].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-surface-500 dark:text-surface-400">
                              <CheckCircle className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <button type="button" className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer">
                          Apply Now <ArrowRight className="w-3 h-3" />
                        </button>
                        <button type="button" className="px-4 py-2 text-xs font-semibold rounded-xl border border-surface-200 dark:border-white/[0.08] text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all cursor-pointer">
                          Share Role
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
                  <p className="text-surface-500 dark:text-surface-400">No open roles match your search.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Don&apos;t see your role?</h2>
                <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
                  We&apos;re always looking for exceptional people. Send us your resume and we&apos;ll be in touch.
                </p>
                <button type="button" className="px-6 py-3 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2 mx-auto cursor-pointer">
                  <Mail className="w-4 h-4" />
                  Send Resume
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-surface-200 dark:border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-surface-500 dark:text-surface-400">
          <span>&copy; {new Date().getFullYear()} Momentum AI.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-surface-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-surface-900 dark:hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
