'use client';

import SiteNav from '@/components/layout/SiteNav';
import Footer from '@/components/layout/Footer';
import { useState } from 'react';
import { CheckCircle, ArrowRight, Zap, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Free', monthlyPrice: '$0', annualPrice: '$0', period: '/mo',
    description: 'For individuals exploring',
    features: ['1 user', '3 AI apps', '1 AI agent', '3 automations', '250MB storage', '3K credits (one-time)', 'Basic AI models'],
    cta: 'Get Started', popular: false, brand: false,
  },
  {
    name: 'Starter', monthlyPrice: '$6', annualPrice: '$5', period: '/mo',
    description: 'For individuals who build often',
    features: ['3 users', 'Unlimited AI apps', '3 AI agents', '10 automations', '5GB storage', '10K credits/month', 'All frontier AI models', 'API access'],
    cta: 'Start Free Trial', popular: false, brand: false,
  },
  {
    name: 'Pro', monthlyPrice: '$16', annualPrice: '$12', period: '/mo',
    description: 'For power users & small teams',
    features: ['10 users', 'Unlimited AI apps', 'Unlimited AI agents', 'Unlimited automations', '100GB storage', '50K credits/month', 'All frontier AI models', '100+ integrations', 'Client portals', 'Remove branding', 'Priority support'],
    cta: 'Start Free Trial', popular: true, brand: true,
  },
  {
    name: 'Business', monthlyPrice: '$40', annualPrice: '$30', period: '/mo',
    description: 'For teams & organizations',
    features: ['Unlimited users', 'Unlimited AI apps', 'Unlimited AI agents', 'Unlimited automations', '1TB storage', '150K credits/month', 'All frontier AI models', '100+ integrations', 'Client portals', 'Full white-label', 'Custom domains', 'SSO & SAML', '24/7 support'],
    cta: 'Start Free Trial', popular: false, brand: false,
  },
  {
    name: 'Max', monthlyPrice: '$200', annualPrice: '$150', period: '/mo',
    description: 'Maximum AI generation capacity',
    features: ['Unlimited users', 'Unlimited AI apps', 'Unlimited AI agents', 'Unlimited automations', '1TB storage', '150K+ credits/month', 'All frontier AI models', '100+ integrations', 'Client portals', 'Full white-label', 'Custom domains', 'SSO & SAML', '24/7 support', 'Dedicated success'],
    cta: 'Contact Sales', popular: false, brand: false,
  },
];

const yearlyTotal: Record<string, string> = {
  Starter: '$60/yr',
  Pro: '$144/yr',
  Business: '$360/yr',
  Max: '$1,800/yr',
};

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      <SiteNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200/50 dark:border-brand-800/50 text-sm font-medium text-brand-700 dark:text-brand-300 mb-4">
            <Sparkles className="w-4 h-4" /> Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-surface-900 dark:text-white mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-surface-500 dark:text-surface-400">
            Start for free. Upgrade as you grow. No hidden fees.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm font-medium ${!annual ? 'text-surface-900 dark:text-white' : 'text-surface-500 dark:text-surface-400'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${annual ? 'bg-brand-600' : 'bg-surface-300 dark:bg-surface-600'}`}
          >
            <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${annual ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-surface-900 dark:text-white' : 'text-surface-500 dark:text-surface-400'}`}>
            Annual <span className="text-green-500 font-semibold">Save 20%</span>
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {plans.map((plan) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div key={plan.name} className={`relative p-6 rounded-2xl border transition-all flex flex-col ${
                plan.popular
                  ? 'bg-white dark:bg-surface-800 border-brand-500 shadow-xl shadow-brand-500/10 scale-105 z-10'
                  : 'bg-white dark:bg-surface-900/50 border-surface-200 dark:border-surface-700'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xs font-semibold whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-surface-900 dark:text-white">{price}</span>
                  <span className="text-surface-400 dark:text-surface-500">{plan.period}</span>
                  {annual && plan.name !== 'Free' && (
                    <div className="text-xs text-green-500 dark:text-green-400 mt-0.5">{yearlyTotal[plan.name]} billed annually</div>
                  )}
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-surface-600 dark:text-surface-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full px-4 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  plan.brand
                    ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/30'
                    : 'border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800'
                }`}>
                  {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12 p-8 md:p-10 rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/30">
          <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Enterprise</h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mb-5 max-w-lg mx-auto">
            Custom pricing, dedicated support, and tailored solutions for large organizations.
          </p>
          <button className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-surface-900 dark:bg-white text-white dark:text-surface-900 hover:bg-surface-800 dark:hover:bg-surface-200 transition-all flex items-center gap-1.5 mx-auto">
            Contact Sales <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
