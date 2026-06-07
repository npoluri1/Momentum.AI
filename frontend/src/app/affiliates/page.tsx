'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/layout/SiteNav';
import { cn } from '@/lib/utils';
import {
  Sparkles, ArrowRight, DollarSign, Users, TrendingUp, Gift, Crown,
  ChevronDown, CheckCircle, Star, Zap, BarChart3, PiggyBank,
  Megaphone, Share2, HandCoins, Percent, BadgePercent,
} from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    commission: '20%',
    duration: '12 months',
    minReferrals: '0',
    features: ['20% recurring commission', '12-month cookie', 'Basic analytics', 'Monthly payouts', 'Email support'],
    color: 'from-surface-400 to-surface-500',
    popular: false,
  },
  {
    name: 'Pro Partner',
    commission: '30%',
    duration: '24 months',
    minReferrals: '10',
    features: ['30% recurring commission', '24-month cookie', 'Advanced analytics', 'Bi-weekly payouts', 'Priority support', 'Co-marketing opportunities', 'Custom landing pages'],
    color: 'from-brand-500 to-brand-600',
    popular: true,
  },
  {
    name: 'Elite',
    commission: '40%',
    duration: 'Lifetime',
    minReferrals: '50',
    features: ['40% recurring commission', 'Lifetime cookie', 'Real-time dashboard', 'Weekly payouts', 'Dedicated partner manager', 'White-label options', 'API access', 'Event sponsorships'],
    color: 'from-intelligence-500 to-intelligence-600',
    popular: false,
  },
];

const howItWorks = [
  { step: '1', title: 'Sign Up', desc: 'Apply to the program and get approved within 24 hours.', icon: Users },
  { step: '2', title: 'Share', desc: 'Get your unique referral link and share it with your audience.', icon: Share2 },
  { step: '3', title: 'Earn', desc: 'Earn recurring commissions for every paying customer you refer.', icon: HandCoins },
];

const stats = [
  { label: 'Active Partners', value: '2,500+' },
  { label: 'Avg. Monthly Earnings', value: '$3,200' },
  { label: 'Top Partner Earnings', value: '$48K/mo' },
  { label: 'Cookie Duration', value: '12-24 mo' },
];

const testimonials = [
  {
    name: 'Alex Rivera',
    role: 'Tech Content Creator',
    quote: 'The Momentum AI affiliate program is the most generous I have worked with. 30% recurring commissions add up fast when your referrals stick around.',
    earnings: '$12,400/mo',
  },
  {
    name: 'Priya Sharma',
    role: 'SaaS Consultant',
    quote: 'My clients love Momentum AI, and I love the passive income. The partner dashboard makes tracking conversions incredibly easy.',
    earnings: '$8,900/mo',
  },
  {
    name: 'James Chen',
    role: 'Developer Advocate',
    quote: 'As a developer, I genuinely recommend Momentum AI. The affiliate program just makes it a no-brainer to spread the word.',
    earnings: '$21,000/mo',
  },
];

const faqs = [
  {
    q: 'How much can I earn?',
    a: 'Earnings depend on your tier and the plans your referrals choose. Starter partners earn 20% recurring for 12 months. Pro Partners earn 30% for 24 months. Elite partners earn 40% for the lifetime of the customer. Top partners earn $40,000+ per month.',
  },
  {
    q: 'When and how do I get paid?',
    a: 'Starter partners are paid monthly via PayPal or bank transfer. Pro Partners are paid bi-weekly. Elite partners are paid weekly. Minimum payout threshold is $50.',
  },
  {
    q: 'What is the cookie duration?',
    a: 'Starter: 12 months. Pro Partner: 24 months. Elite: Lifetime. If someone clicks your link and signs up within the cookie window, you get credited.',
  },
  {
    q: 'Can I promote Momentum AI on any platform?',
    a: 'Yes. Blogs, YouTube, Twitter/X, LinkedIn, newsletters, podcasts, email lists — anywhere your audience is. We provide branded assets and copy suggestions.',
  },
  {
    q: 'Is there a minimum number of referrals?',
    a: 'No minimum to start. However, to unlock Pro Partner status you need 10 active referrals, and Elite requires 50.',
  },
  {
    q: 'Do you provide marketing materials?',
    a: 'Absolutely. All partners get access to a resource library with banners, email templates, social posts, demo videos, and case studies. Pro and Elite partners get custom co-branded assets.',
  },
];

export default function AffiliatesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
              Partner Program
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              <span className="text-surface-900 dark:text-white">Earn up to</span>
              <br />
              <span className="momentum-text">40% recurring</span>
            </h1>
            <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Join thousands of partners earning passive income by sharing the AI workspace builders love.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button className="px-6 py-3 text-base font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-xl shadow-brand-500/30 transition-all active:scale-[0.98] flex items-center gap-2">
                Apply Now <ArrowRight className="w-4 h-4" />
              </button>
              <Link href="/pricing" className="px-6 py-3 text-base font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all flex items-center gap-2">
                View Pricing <DollarSign className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 md:py-12 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="p-5 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-surface-500 dark:text-surface-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">How It Works</h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                Three simple steps to start earning.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {howItWorks.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 text-center group">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-brand-500 dark:text-brand-400" />
                    </div>
                    <div className="text-xs font-bold text-brand-500 dark:text-brand-400 mb-2">STEP {step.step}</div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Commission Tiers */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">Partner Tiers</h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                The more you refer, the more you earn. Unlock higher commissions as you grow.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 items-start">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={cn(
                    'rounded-2xl border overflow-hidden transition-all',
                    tier.popular
                      ? 'border-brand-200 dark:border-brand-500/30 bg-white dark:bg-[#0a0a0f]/40 shadow-xl shadow-brand-500/10 scale-[1.02]'
                      : 'border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40'
                  )}
                >
                  {tier.popular && (
                    <div className="px-5 py-2 bg-brand-500 text-white text-xs font-bold text-center">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">{tier.name}</h3>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-4xl font-extrabold text-surface-900 dark:text-white">{tier.commission}</span>
                      <span className="text-sm text-surface-500 dark:text-surface-400">recurring</span>
                    </div>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
                      for {tier.duration} · {tier.minReferrals}+ referrals
                    </p>
                    <button
                      type="button"
                      className={cn(
                        'w-full py-2.5 text-sm font-semibold rounded-xl transition-all mb-6 cursor-pointer',
                        tier.popular
                          ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/25'
                          : 'bg-surface-100 dark:bg-white/[0.06] text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-white/[0.1]'
                      )}
                    >
                      Apply as {tier.name}
                    </button>
                    <ul className="space-y-2.5">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-surface-600 dark:text-surface-400">
                          <CheckCircle className="w-4 h-4 text-memory-500 shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">Partner Success Stories</h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                Real partners, real earnings.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-sm">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-surface-900 dark:text-white">{t.name}</div>
                        <div className="text-xs text-surface-500 dark:text-surface-400">{t.role}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-brand-500 dark:text-brand-400">{t.earnings}</div>
                      <div className="text-[10px] text-surface-400">monthly</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">Partner FAQ</h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Everything you need to know about the program.
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
                    <span className="text-sm font-semibold text-surface-900 dark:text-white pr-4">{faq.q}</span>
                    <ChevronDown className={cn('w-4 h-4 text-surface-400 shrink-0 transition-transform duration-300', openFaq === i && 'rotate-180')} />
                  </button>
                  <div className={cn('overflow-hidden transition-all duration-300', openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}>
                    <div className="px-5 pb-5">
                      <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{faq.a}</p>
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to start earning?</h2>
                <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
                  Apply today and get approved within 24 hours. Start sharing and earning immediately.
                </p>
                <button type="button" className="px-8 py-3 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2 mx-auto cursor-pointer">
                  <Zap className="w-4 h-4" />
                  Become a Partner
                </button>
                <p className="text-brand-200 text-sm mt-4">No upfront cost. Cancel anytime.</p>
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
