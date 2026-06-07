'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  CreditCard, Download, Check, X, ChevronRight,
  Clock, Shield, Zap, Star,
  FileText, RefreshCw, Plus, Trash2,
  Calendar, AlertTriangle, Sparkles, Globe,
} from 'lucide-react';
import toast from 'react-hot-toast';

const plans = [
  { id: 'free', name: 'Free', price: '$0', period: '/month', desc: 'For individuals exploring', features: ['3 projects', '1 AI agent', '3 automations', '250 MB storage', 'Basic integrations'], cta: 'Current Plan', popular: false },
  { id: 'starter', name: 'Starter', price: '$6', period: '/month', desc: 'For small teams getting started', features: ['Unlimited projects', '3 AI agents', '10 automations', '5 GB storage', 'GPT, Claude, Gemini'], cta: 'Upgrade', popular: false },
  { id: 'pro', name: 'Professional', price: '$16', period: '/month', desc: 'For power users and growing teams', features: ['Unlimited projects', 'Unlimited agents', 'Unlimited automations', '100 GB storage', 'All AI models', 'Remove branding', 'Password sharing'], cta: 'Upgrade', popular: true },
  { id: 'business', name: 'Business', price: '$40', period: '/month', desc: 'For teams and agencies', features: ['Everything in Pro', '150K credits/mo', 'Custom domains', 'White-labeling', 'Team management', 'Priority support'], cta: 'Upgrade', popular: false },
  { id: 'enterprise', name: 'Enterprise', price: '$400', period: '/month', desc: 'For large organizations', features: ['Everything in Business', 'Custom credits', 'SSO/SAML', 'Dedicated support', 'SLA guarantee', 'Private cloud'], cta: 'Contact Sales', popular: false },
];

const invoices = [
  { id: 'INV-001', date: 'Jun 1, 2026', amount: 49.00, status: 'paid', plan: 'Professional' },
  { id: 'INV-002', date: 'May 1, 2026', amount: 49.00, status: 'paid', plan: 'Professional' },
  { id: 'INV-003', date: 'Apr 1, 2026', amount: 49.00, status: 'paid', plan: 'Professional' },
  { id: 'INV-004', date: 'Mar 1, 2026', amount: 49.00, status: 'paid', plan: 'Starter' },
  { id: 'INV-005', date: 'Feb 1, 2026', amount: 6.00, status: 'paid', plan: 'Starter' },
];

const currentPlan = 'pro';

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'plans' | 'invoices' | 'payment'>('plans');
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [annual, setAnnual] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const handleUpgrade = (planId: string) => {
    if (planId === 'enterprise') {
      toast.success('Contacting sales team...');
      return;
    }
    if (planId === currentPlan) return;
    toast.success(`Upgrading to ${plans.find(p => p.id === planId)?.name} plan...`);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white tracking-tight">Billing</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Manage your subscription, invoices, and payment methods</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-success-500/10 text-success-600 dark:text-success-400 border border-success-500/20">
            Professional Plan
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-200/50 dark:border-white/[0.06]">
        {[
          { id: 'plans' as const, label: 'Plans', icon: Star },
          { id: 'invoices' as const, label: 'Invoices', icon: FileText },
          { id: 'payment' as const, label: 'Payment Methods', icon: CreditCard },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all',
              activeTab === tab.id
                ? 'text-brand-500 border-brand-500'
                : 'text-surface-400 dark:text-surface-500 border-transparent hover:text-surface-600 dark:hover:text-surface-300'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {/* Usage Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Current Plan', value: 'Professional', subtitle: '$49/mo', gradient: 'from-brand-500 to-intelligence-500' },
              { label: 'Team Members', value: '12', subtitle: 'of 50 included', gradient: 'from-success-500 to-emerald-500' },
              { label: 'Next Billing', value: 'Jun 15', subtitle: 'Automatic renewal', gradient: 'from-memory-500 to-blue-500' },
            ].map(s => (
              <div key={s.label} className="apple-stat-card">
                <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center mb-2 shadow-sm', s.gradient)}>
                  {s.label === 'Current Plan' ? <Star className="w-4 h-4 text-white" /> :
                   s.label === 'Team Members' ? <Users className="w-4 h-4 text-white" /> :
                   <Calendar className="w-4 h-4 text-white" />}
                </div>
                <p className="text-lg font-bold text-surface-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-surface-400">{s.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Plan Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan, i) => {
              const isCurrent = plan.id === currentPlan;
              const isSelected = selectedPlan === plan.id;
              const Icon = i === 0 ? Zap : i === 1 ? Sparkles : i === 2 ? Star : i === 3 ? Globe : Shield;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={cn(
                    'apple-card p-5 cursor-pointer relative transition-all',
                    plan.popular && 'ring-2 ring-brand-500 shadow-lg shadow-brand-500/10',
                    isSelected && !isCurrent && 'ring-2 ring-brand-500/40'
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-brand-500 to-intelligence-500 text-white text-[10px] font-semibold shadow-md">
                      Most Popular
                    </div>
                  )}
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center mb-3',
                    isCurrent ? 'bg-brand-500 text-white' : 'bg-surface-100 dark:bg-white/[0.06] text-surface-400'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-white">{plan.name}</h3>
                  <div className="flex items-baseline gap-0.5 mt-1 mb-1">
                    <span className="text-3xl font-bold text-surface-900 dark:text-white">{plan.price}</span>
                    <span className="text-xs text-surface-400">{plan.period}</span>
                  </div>
                  <p className="text-xs text-surface-500 mb-4">{plan.desc}</p>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-xs text-surface-600 dark:text-surface-400">
                        <Check className="w-3.5 h-3.5 text-success-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isCurrent}
                    className={cn(
                      'w-full py-2 text-sm font-semibold rounded-xl transition-all',
                      isCurrent
                        ? 'bg-surface-100 dark:bg-white/[0.06] text-surface-400 cursor-default'
                        : plan.id === 'enterprise'
                        ? 'bg-surface-900 dark:bg-white text-surface-0 dark:text-surface-900 hover:bg-surface-800 dark:hover:bg-surface-100'
                        : 'bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/25 active:scale-[0.98]'
                    )}
                  >
                    {isCurrent ? 'Current Plan' : plan.cta}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Cancel */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-warning-500" />
              <div>
                <p className="text-sm font-semibold text-surface-900 dark:text-white">Cancel subscription</p>
                <p className="text-xs text-surface-400">Your workspace will remain accessible until the end of your billing period</p>
              </div>
            </div>
            <button onClick={() => setShowCancel(true)} className="px-3 py-1.5 text-xs font-semibold rounded-xl text-danger-500 hover:bg-danger-500/10 transition-all">Cancel Plan</button>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="apple-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200/50 dark:border-white/[0.06]">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Invoice History</h3>
            <button className="text-xs font-medium text-brand-500 hover:text-brand-600 transition-colors flex items-center gap-1">
              <Download className="w-3 h-3" /> Download All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100/50 dark:border-white/[0.03]">
                  {['Invoice', 'Date', 'Plan', 'Amount', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-b border-surface-100/30 dark:border-white/[0.02] hover:bg-surface-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-surface-900 dark:text-white">{inv.id}</td>
                    <td className="px-5 py-3.5 text-sm text-surface-500">{inv.date}</td>
                    <td className="px-5 py-3.5 text-sm text-surface-600 dark:text-surface-400">{inv.plan}</td>
                    <td className="px-5 py-3.5 text-sm font-medium text-surface-900 dark:text-white">${inv.amount.toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full text-success-500 bg-success-500/10 border border-success-500/20">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toast.success('Downloading invoice...')} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-white/[0.06]">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'payment' && (
        <div className="space-y-4">
          <div className="apple-card p-5">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Saved Payment Methods</h3>
            <div className="space-y-3">
              {[
                { type: 'Visa', last4: '4242', expiry: '06/27', brand: 'visa', default: true },
                { type: 'Mastercard', last4: '8888', expiry: '09/26', brand: 'mastercard', default: false },
              ].map(card => (
                <div key={card.last4} className="flex items-center justify-between p-4 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-brand-500/20 to-intelligence-500/20 flex items-center justify-center text-xs font-bold text-brand-600 dark:text-brand-400 border border-brand-500/10">
                      {card.brand === 'visa' ? 'VISA' : 'MC'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{card.type} ending in {card.last4}</p>
                      <p className="text-xs text-surface-400">Expires {card.expiry}{card.default && ' · Default'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {card.default && <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">Default</span>}
                    <button onClick={() => toast.success('Card removed')} className="p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-500/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => toast.success('Adding new payment method...')} className="mt-3 w-full py-2.5 text-sm font-semibold rounded-xl border-2 border-dashed border-surface-300 dark:border-white/[0.12] text-surface-500 dark:text-surface-400 hover:border-brand-500/30 hover:text-brand-500 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add Payment Method
            </button>
          </div>

          {/* Stripe Badge */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-50/50 dark:bg-white/[0.03] border border-surface-200/30 dark:border-white/[0.04]">
            <Shield className="w-4 h-4 text-surface-400" />
            <p className="text-xs text-surface-400">Payments securely processed by <span className="font-semibold text-surface-600 dark:text-surface-300">Stripe</span>. Your payment info is encrypted and never stored on our servers.</p>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowCancel(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-2xl animate-scale-in p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-warning-50 dark:bg-warning-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-warning-500" />
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white text-center mb-2">Cancel Subscription?</h3>
            <p className="text-sm text-surface-500 text-center mb-6">Your workspace will remain accessible until Jun 15, 2026. After that, you'll be downgraded to the Free plan.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCancel(false)} className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-all">Keep Plan</button>
              <button onClick={() => { toast.success('Subscription cancelled'); setShowCancel(false); }} className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl bg-danger-500 text-white hover:bg-danger-600 shadow-sm shadow-danger-500/25 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
