'use client';

import { useState } from 'react';
import SiteNav from '@/components/layout/SiteNav';
import { cn } from '@/lib/utils';
import {
  Shield,
  ShieldCheck,
  Globe,
  Lock,
  Headphones,
  FileText,
  CheckCircle2,
  XCircle,
  Star,
  ChevronDown,
  Sparkles,
  Building2,
  ArrowRight,
  Mail,
  Send,
  Quote,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'SAML/SSO',
    description: 'Single sign-on with Okta, Azure AD, Google Workspace, and any SAML 2.0 identity provider.',
    gradient: 'from-brand-500 to-brand-600',
  },
  {
    icon: ShieldCheck,
    title: 'SOC 2 Type II',
    description: 'Certified SOC 2 Type II compliance with annual audits and continuous monitoring.',
    gradient: 'from-memory-500 to-memory-600',
  },
  {
    icon: Globe,
    title: 'Data Residency',
    description: 'Choose data regions across US, EU, APAC. Fully GDPR compliant with DPA support.',
    gradient: 'from-execution-500 to-execution-600',
  },
  {
    icon: Lock,
    title: 'Advanced Security',
    description: 'Encryption at rest (AES-256) and in transit (TLS 1.3). Audit logs, IP whitelisting, and RBAC.',
    gradient: 'from-intelligence-500 to-intelligence-600',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: '24/7 priority support with dedicated account manager and guaranteed response times.',
    gradient: 'from-warning-400 to-warning-500',
  },
  {
    icon: FileText,
    title: 'Custom Contract',
    description: 'Custom terms, MSAs, negotiated pricing, and enterprise licensing agreements.',
    gradient: 'from-brand-500 to-intelligence-500',
  },
];

const comparisonRows = [
  { feature: 'Workspaces', free: '1', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'AI Agents', free: '1', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'AI Credits', free: '1K/mo', pro: '50K/mo', enterprise: 'Custom' },
  { feature: 'Storage', free: '100MB', pro: '100GB', enterprise: 'Unlimited' },
  { feature: 'API Access', free: false, pro: true, enterprise: true },
  { feature: 'SSO/SAML', free: false, pro: false, enterprise: true },
  { feature: 'SOC 2 Compliance', free: false, pro: false, enterprise: true },
  { feature: 'Data Residency', free: false, pro: false, enterprise: true },
  { feature: 'Audit Logs', free: false, pro: false, enterprise: true },
  { feature: 'IP Whitelisting', free: false, pro: false, enterprise: true },
  { feature: 'Dedicated Support', free: false, pro: 'Priority', enterprise: '24/7 Dedicated' },
  { feature: 'Custom Contract', free: false, pro: false, enterprise: true },
  { feature: 'SLA Guarantee', free: false, pro: false, enterprise: '99.99%' },
  { feature: 'Onboarding', free: 'Self-serve', pro: 'Self-serve', enterprise: 'Guided' },
];

const faqs = [
  {
    question: 'How does SAML/SSO integration work?',
    answer: 'Momentum AI supports SAML 2.0 and OIDC for single sign-on. We integrate with Okta, Azure AD, Google Workspace, OneLogin, and any SAML-compliant IdP. Setup takes minutes via the admin console with automatic user provisioning and deprovisioning via SCIM.',
  },
  {
    question: 'What compliance certifications do you have?',
    answer: 'Momentum AI is SOC 2 Type II certified with annual audits by a third-party firm. We also comply with GDPR, CCPA, and HIPAA BAAs are available upon request. Our infrastructure is hosted on AWS with ISO 27001 certified data centers.',
  },
  {
    question: 'Can I choose where my data is stored?',
    answer: 'Yes. Enterprise customers can select data residency regions including US (Virginia, Oregon), EU (Frankfurt, Ireland), and APAC (Singapore, Sydney). Data is encrypted at rest and in transit and never leaves your chosen region without explicit consent.',
  },
  {
    question: 'What does dedicated support include?',
    answer: 'Enterprise plans include 24/7 priority support with a dedicated account manager, guaranteed 15-minute response time for critical issues, monthly business reviews, and quarterly strategic planning sessions. Direct escalation paths to engineering are included.',
  },
  {
    question: 'Can we negotiate custom pricing and terms?',
    answer: 'Absolutely. Enterprise plans offer custom pricing based on your team size, usage requirements, and contract length. We support MSAs, DPAs, and custom security addendums. Volume discounts are available for larger deployments.',
  },
];

const customerLogos = [
  'TechCorp', 'DataFlow', 'CloudScale', 'NexGenAI',
  'QuantumLabs', 'ApexDigital', 'StellarHQ', 'PrimeStack',
  'VelocityIO', 'AtlasCloud', 'OrbitTech', 'ZenithData',
];

export default function EnterprisePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', size: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white dark:from-brand-950/10 dark:to-[#0a0a0f] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-brand-500/10 to-intelligence-500/10 rounded-full blur-3xl pointer-events-none" />

      <main className="relative">
        <section className="pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
                <Building2 className="w-4 h-4" />
                Enterprise
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                <span className="text-surface-900 dark:text-white">Momentum AI for Enterprise</span>
              </h1>
              <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8">
                Security, compliance, and scale for your organization
              </p>
              <div className="flex items-center justify-center gap-3">
                <button className="px-6 py-3 text-sm font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/25 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Contact Sales
                </button>
                <button className="px-6 py-3 text-sm font-semibold rounded-xl border border-surface-300 dark:border-white/[0.12] text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-white/[0.06] transition-all flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  View Docs
                </button>
              </div>
            </div>

            <div className="max-w-lg mx-auto mb-16">
              <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-5 text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">Trusted by 500+ enterprises worldwide</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">From startups to Fortune 500 companies</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-6 transition-all hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-0.5"
                  >
                    <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-sm', feature.gradient)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mb-16">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6 text-center">Compare Plans</h2>
              <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-surface-200 dark:border-surface-800">
                        <th className="text-left px-5 py-4 font-semibold text-surface-900 dark:text-white">Feature</th>
                        <th className="text-center px-5 py-4 font-semibold text-surface-500">Free</th>
                        <th className="text-center px-5 py-4 font-semibold text-surface-500">Pro</th>
                        <th className="text-center px-5 py-4 font-semibold text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-500/5">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                      {comparisonRows.map((row) => (
                        <tr key={row.feature} className="hover:bg-surface-50 dark:hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3.5 text-surface-700 dark:text-surface-300">{row.feature}</td>
                          <td className="px-5 py-3.5 text-center text-surface-500">
                            {typeof row.free === 'boolean' ? (
                              row.free ? <CheckCircle2 className="w-4 h-4 text-memory-500 mx-auto" /> : <XCircle className="w-4 h-4 text-surface-300 dark:text-surface-600 mx-auto" />
                            ) : (
                              <span className="text-xs">{row.free}</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-center text-surface-500">
                            {typeof row.pro === 'boolean' ? (
                              row.pro ? <CheckCircle2 className="w-4 h-4 text-memory-500 mx-auto" /> : <XCircle className="w-4 h-4 text-surface-300 dark:text-surface-600 mx-auto" />
                            ) : (
                              <span className="text-xs">{row.pro}</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-center bg-brand-50/50 dark:bg-brand-500/5">
                            {typeof row.enterprise === 'boolean' ? (
                              row.enterprise ? <CheckCircle2 className="w-4 h-4 text-memory-500 mx-auto" /> : <XCircle className="w-4 h-4 text-surface-300 dark:text-surface-600 mx-auto" />
                            ) : (
                              <span className="text-xs font-medium text-surface-900 dark:text-white">{row.enterprise}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="text-center mb-16">
              <div className="inline-block p-8 md:p-12 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden max-w-lg mx-auto w-full">
                <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
                <div className="relative">
                  <Sparkles className="w-8 h-8 text-white/80 mx-auto mb-3" />
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Enterprise Pricing</h2>
                  <p className="text-brand-100 mb-6">Custom pricing tailored to your organization&apos;s needs</p>
                  <button className="px-8 py-3 text-sm font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2 mx-auto">
                    <Mail className="w-4 h-4" />
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2 text-center">Join 500+ Enterprises</h2>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 text-center">Trusted by innovative teams worldwide</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {customerLogos.map((name) => (
                  <div
                    key={name}
                    className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-4 flex items-center justify-center h-16"
                  >
                    <span className="text-sm font-semibold text-surface-400 dark:text-surface-500">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-2xl mx-auto mb-16">
              <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-8 md:p-10">
                <Quote className="w-8 h-8 text-brand-500 mb-4" />
                <blockquote className="text-lg md:text-xl text-surface-700 dark:text-surface-300 leading-relaxed mb-6">
                  &ldquo;Momentum AI transformed how our teams collaborate across departments. The AI agents alone saved us hundreds of hours per month. The enterprise-grade security and dedicated support made it an easy decision for our organization.&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-lg">
                    JD
                  </div>
                  <div>
                    <div className="font-semibold text-surface-900 dark:text-white">Jane Doe</div>
                    <div className="text-sm text-surface-500 dark:text-surface-400">VP of Engineering, TechCorp</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto mb-16">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-6 text-center">Enterprise FAQ</h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div
                      key={i}
                      className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="text-sm font-semibold text-surface-900 dark:text-white pr-4">{faq.question}</span>
                        <ChevronDown className={cn('w-4 h-4 text-surface-400 shrink-0 transition-transform duration-300', isOpen && 'rotate-180')} />
                      </button>
                      <div className={cn('overflow-hidden transition-all duration-300', isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}>
                        <div className="px-5 pb-5">
                          <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="max-w-2xl mx-auto pb-16">
              <div className="rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 p-8">
                <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2 text-center">Request a Demo</h2>
                <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 text-center">Fill out the form and our team will get back to you within 24 hours.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1.5">Name</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-surface-200 dark:border-white/[0.08] bg-surface-50 dark:bg-white/[0.04] text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1.5">Work Email</label>
                      <input
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-surface-200 dark:border-white/[0.08] bg-surface-50 dark:bg-white/[0.04] text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1.5">Company Name</label>
                      <input
                        type="text"
                        placeholder="Your company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-surface-200 dark:border-white/[0.08] bg-surface-50 dark:bg-white/[0.04] text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1.5">Company Size</label>
                      <select
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-surface-200 dark:border-white/[0.08] bg-surface-50 dark:bg-white/[0.04] text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      >
                        <option value="">Select size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-600 dark:text-surface-400 mb-1.5">Message</label>
                    <textarea
                      placeholder="Tell us about your needs..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-surface-200 dark:border-white/[0.08] bg-surface-50 dark:bg-white/[0.04] text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 text-sm font-semibold rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Request Demo
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
