'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/layout/SiteNav';
import { cn } from '@/lib/utils';
import {
  Shield, ShieldCheck, Lock, Eye, Server, FileKey, Fingerprint,
  Globe, Clock, Users, CheckCircle, ChevronDown, Sparkles,
  ArrowRight, Mail, Building2, HardDrive, KeyRound, BadgeCheck,
  Radio, Activity, FileText, ArrowUpRight,
} from 'lucide-react';

const certifications = [
  { name: 'SOC 2 Type II', status: 'Certified', desc: 'Independent audit of security, availability, and confidentiality controls.', icon: BadgeCheck },
  { name: 'ISO 27001', status: 'Certified', desc: 'International standard for information security management systems.', icon: ShieldCheck },
  { name: 'GDPR', status: 'Compliant', desc: 'Full compliance with EU data protection regulations.', icon: Globe },
  { name: 'HIPAA', status: 'BAA Available', desc: 'Business Associate Agreements for healthcare organizations.', icon: FileText },
  { name: 'CCPA', status: 'Compliant', desc: 'California Consumer Privacy Act compliance for data rights.', icon: Eye },
  { name: 'Google CASA', status: 'Certified', desc: 'OWASP ASVS Level 2 application security certification.', icon: Shield },
];

const securityFeatures = [
  {
    icon: Lock,
    title: 'Encryption at Rest',
    desc: 'All data is encrypted using AES-256 before being written to disk. Keys are managed via AWS KMS with automatic rotation.',
  },
  {
    icon: Shield,
    title: 'Encryption in Transit',
    desc: 'TLS 1.3 for all data in transit. HSTS headers enforced. Perfect forward secrecy enabled on all connections.',
  },
  {
    icon: Fingerprint,
    title: 'Zero-Knowledge Architecture',
    desc: 'Sensitive workspace data is encrypted with keys only accessible to your organization. We cannot access your content.',
  },
  {
    icon: KeyRound,
    title: 'SSO & SAML 2.0',
    desc: 'Single sign-on with Okta, Azure AD, Google Workspace, OneLogin, and any SAML 2.0 / OIDC identity provider.',
  },
  {
    icon: Users,
    title: 'Role-Based Access Control',
    desc: 'Granular permissions at workspace, project, and feature level. Custom roles with fine-grained access policies.',
  },
  {
    icon: Eye,
    title: 'Audit Logs',
    desc: 'Comprehensive audit trail of all user actions, data access, and system changes. Immutable logs with 7-year retention.',
  },
  {
    icon: Server,
    title: 'Infrastructure Security',
    desc: 'Hosted on AWS with SOC 2 compliant data centers. Private subnets, VPC isolation, and DDoS protection via Cloudflare.',
  },
  {
    icon: HardDrive,
    title: 'Data Residency',
    desc: 'Choose where your data lives: US (Virginia, Oregon), EU (Frankfurt, Ireland), or APAC (Singapore, Sydney).',
  },
];

const complianceDetails = [
  {
    title: 'Data Privacy',
    content: 'We collect only the data necessary to provide our services. Your data is never used to train AI models. You retain full ownership of your content. We provide data export and deletion capabilities at any time.',
  },
  {
    title: 'Third-Party Security',
    content: 'All third-party vendors undergo security reviews before onboarding. We maintain a vendor risk register and require SOC 2 or equivalent certifications. Subprocessors are disclosed in our DPA.',
  },
  {
    title: 'Incident Response',
    content: 'We have a documented incident response plan with defined severity levels, escalation paths, and communication procedures. Enterprise customers receive breach notifications within 24 hours.',
  },
  {
    title: 'Penetration Testing',
    content: 'Annual third-party penetration tests by accredited security firms. Critical and high findings are remediated within 72 hours. Results are available to Enterprise customers under NDA.',
  },
  {
    title: 'Employee Security',
    content: 'All employees undergo background checks and complete annual security training. Access to production requires MFA and is granted on a least-privilege basis. Offboarding access revocation is automated.',
  },
];

const trustBadges = [
  { label: 'SOC 2 Type II', color: 'from-brand-500 to-brand-600' },
  { label: 'ISO 27001', color: 'from-intelligence-500 to-intelligence-600' },
  { label: 'GDPR Ready', color: 'from-execution-500 to-execution-600' },
  { label: 'HIPAA BAA', color: 'from-memory-500 to-memory-600' },
  { label: 'AES-256', color: 'from-brand-500 to-intelligence-500' },
  { label: 'TLS 1.3', color: 'from-warning-400 to-warning-500' },
];

export default function SecurityPage() {
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
              <Shield className="w-4 h-4" />
              Trust Center
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              <span className="text-surface-900 dark:text-white">Security is not a</span>
              <br />
              <span className="momentum-text">feature. It is the foundation.</span>
            </h1>
            <p className="text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Enterprise-grade security, compliance, and privacy built into every layer of Momentum AI.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-100/50 dark:bg-white/[0.04] border border-surface-200/30 dark:border-white/[0.06]">
                <CheckCircle className="w-4 h-4 text-memory-500" />
                <span className="text-sm text-surface-700 dark:text-surface-300">SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-100/50 dark:bg-white/[0.04] border border-surface-200/30 dark:border-white/[0.06]">
                <CheckCircle className="w-4 h-4 text-memory-500" />
                <span className="text-sm text-surface-700 dark:text-surface-300">ISO 27001</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-100/50 dark:bg-white/[0.04] border border-surface-200/30 dark:border-white/[0.06]">
                <CheckCircle className="w-4 h-4 text-memory-500" />
                <span className="text-sm text-surface-700 dark:text-surface-300">GDPR</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-8 md:py-12 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm',
                    'bg-gradient-to-br',
                    badge.color
                  )}
                >
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">Compliance & Certifications</h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                Independently audited and certified to meet the highest security standards.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert) => {
                const Icon = cert.icon;
                return (
                  <div key={cert.name} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 hover:bg-surface-50 dark:hover:bg-white/[0.03] transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                      </div>
                      <span className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-bold border',
                        cert.status === 'Certified'
                          ? 'bg-memory-500/10 text-memory-500 border-memory-500/20'
                          : 'bg-brand-500/10 text-brand-500 border-brand-500/20'
                      )}>
                        {cert.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{cert.name}</h3>
                    <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{cert.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Security Features Grid */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">Security Architecture</h2>
              <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
                Defense in depth at every layer — from infrastructure to application to data.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {securityFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="p-6 rounded-2xl border border-surface-200/50 dark:border-white/[0.06] bg-white dark:bg-[#0a0a0f]/40 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/10 to-intelligence-500/10 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-brand-500 dark:text-brand-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Infrastructure */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-4">Infrastructure You Can Trust</h2>
                <p className="text-lg text-surface-500 dark:text-surface-400 mb-6 leading-relaxed">
                  Built on AWS with multi-region redundancy, automated backups, and 99.99% uptime SLA for Enterprise customers.
                </p>
                <div className="space-y-3">
                  {[
                    { icon: Server, label: 'AWS Infrastructure', desc: 'US-East, US-West, EU-Central, APAC' },
                    { icon: Activity, label: 'Real-time Monitoring', desc: '24/7 ops team with PagerDuty escalation' },
                    { icon: Clock, label: 'Automated Backups', desc: 'Hourly snapshots with 30-day retention' },
                    { icon: Radio, label: 'DDoS Protection', desc: 'Cloudflare Magic Transit + AWS Shield' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-white/[0.04] border border-surface-200/30 dark:border-white/[0.06]">
                        <Icon className="w-5 h-5 text-brand-500 dark:text-brand-400 shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-surface-900 dark:text-white">{item.label}</div>
                          <div className="text-xs text-surface-500 dark:text-surface-400">{item.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="p-8 rounded-3xl bg-gradient-to-br from-surface-100 to-surface-50 dark:from-white/[0.04] dark:to-white/[0.02] border border-surface-200/50 dark:border-white/[0.06]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-500 dark:text-surface-400">Uptime SLA</span>
                    <span className="text-sm font-bold text-surface-900 dark:text-white">99.99%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-200 dark:bg-white/[0.06] overflow-hidden">
                    <div className="h-full w-[99.99%] rounded-full bg-gradient-to-r from-brand-500 to-memory-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-500 dark:text-surface-400">Data Encryption</span>
                    <span className="text-sm font-bold text-surface-900 dark:text-white">AES-256 + TLS 1.3</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-200 dark:bg-white/[0.06] overflow-hidden">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-brand-500 to-memory-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-500 dark:text-surface-400">Backup Frequency</span>
                    <span className="text-sm font-bold text-surface-900 dark:text-white">Every Hour</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-200 dark:bg-white/[0.06] overflow-hidden">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-brand-500 to-memory-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-surface-500 dark:text-surface-400">Incident Response</span>
                    <span className="text-sm font-bold text-surface-900 dark:text-white">&lt; 15 min</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-200 dark:bg-white/[0.06] overflow-hidden">
                    <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-brand-500 to-memory-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Details Accordion */}
        <section className="py-16 md:py-20 bg-surface-50/50 dark:bg-white/[0.02]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white mb-3">Compliance Details</h2>
              <p className="text-lg text-surface-500 dark:text-surface-400">
                Deep dives into our security and privacy practices.
              </p>
            </div>
            <div className="space-y-3">
              {complianceDetails.map((detail, i) => {
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
                      <span className="text-sm font-semibold text-surface-900 dark:text-white pr-4">{detail.title}</span>
                      <ChevronDown className={cn('w-4 h-4 text-surface-400 shrink-0 transition-transform duration-300', isOpen && 'rotate-180')} />
                    </button>
                    <div className={cn('overflow-hidden transition-all duration-300', isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}>
                      <div className="px-5 pb-5">
                        <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{detail.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-10 md:p-14 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.08] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
              <div className="relative">
                <Shield className="w-8 h-8 text-white/80 mx-auto mb-3" />
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Need a security review?</h2>
                <p className="text-brand-100 mb-8 max-w-lg mx-auto text-lg">
                  Our security team is happy to answer questions, share audit reports, or walk through our architecture.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link href="/enterprise" className="px-6 py-3 text-base font-semibold rounded-xl bg-white text-brand-600 hover:bg-brand-50 transition-all shadow-lg flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Contact Sales
                  </Link>
                  <a href="mailto:security@momentum.ai" className="px-6 py-3 text-base font-semibold rounded-xl border border-white/30 text-white hover:bg-white/10 transition-all flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    security@momentum.ai
                  </a>
                </div>
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
            <Link href="/security" className="hover:text-surface-900 dark:hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
