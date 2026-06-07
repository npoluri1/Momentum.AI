'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, ArrowUp, Sparkles, Menu, X, Moon, Sun, Cookie, FileText, ArrowRight } from 'lucide-react';
import SiteNav from '@/components/layout/SiteNav';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'collect', title: '1. Information We Collect' },
  { id: 'use', title: '2. How We Use Your Information' },
  { id: 'sharing', title: '3. Data Sharing & Disclosure' },
  { id: 'retention', title: '4. Data Retention' },
  { id: 'rights', title: '5. Your Rights & Choices' },
  { id: 'security', title: '6. Security Measures' },
  { id: 'transfers', title: '7. International Transfers' },
  { id: 'children', title: '8. Children\'s Privacy' },
  { id: 'changes', title: '9. Changes to Policy' },
  { id: 'contact', title: '10. Contact' },
];

const content: Record<string, { paragraphs: string[] }> = {
  collect: {
    paragraphs: [
      'We collect information you provide directly to us, including account registration details (name, email address, password), profile information, billing and payment information, and any content you upload, create, or share through the Service.',
      'We automatically collect certain information when you use the Service, including usage data (pages visited, features used, time spent), device information (browser type, operating system, IP address), cookies and similar tracking technologies, and performance metrics and error logs.',
      'We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can manage your cookie preferences through your browser settings and our cookie preference center.',
      'Payment information is processed by our third-party payment processors and is not stored on our servers. We retain only the last four digits of your payment card and the expiration date for reference purposes.',
    ],
  },
  use: {
    paragraphs: [
      'We use the information we collect to provide, maintain, and improve the Service, including processing transactions, enabling collaboration features, and delivering AI agent and automation functionality.',
      'We use your information to communicate with you about the Service, including sending account-related notifications, responding to your inquiries, and providing customer support. We may also send you product updates and marketing communications with your consent.',
      'We analyze usage data to understand how the Service is used, identify trends, and improve our platform. This includes training and improving our AI models using aggregated and anonymized data.',
      'We use information for security purposes, including detecting and preventing fraud, abuse, and unauthorized access, as well as enforcing our Terms of Service and other legal agreements.',
    ],
  },
  sharing: {
    paragraphs: [
      'We share your information with third-party service providers who help us operate the Service, including cloud hosting providers, payment processors, analytics services, and customer support platforms. These providers are contractually bound to protect your information.',
      'We may disclose your information if required by law, court order, or governmental regulation, or if we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others.',
      'In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on the Service of any change in ownership or use of your information.',
      'We do not sell your personal information to third parties. We may share aggregated, anonymized data that cannot reasonably identify you for analytical and research purposes.',
    ],
  },
  retention: {
    paragraphs: [
      'We retain your personal information for as long as your account is active or as needed to provide you the Service. If you delete your account, we will delete or anonymize your personal information within 90 days, unless we are legally required to retain it.',
      'Usage logs and analytics data are retained for a period of up to 24 months, after which they are aggregated or deleted. Backups of your content are retained for up to 30 days after deletion.',
      'If you have not logged into your account for 12 consecutive months, we will send you a notice asking if you wish to keep your account active. If no response is received within 30 days, we may deactivate your account and delete your data.',
      'Legal and compliance records may be retained for longer periods in accordance with applicable laws and regulations. Such data is securely archived and access is strictly limited.',
    ],
  },
  rights: {
    paragraphs: [
      'You have the right to access, update, or delete your personal information at any time through your account settings. You may also export your data in a portable format. We will respond to your request within 30 days.',
      'You may opt out of marketing communications at any time by clicking the "unsubscribe" link in our emails or updating your notification preferences in account settings. We will still send you essential service-related communications.',
      'If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have additional rights under the GDPR, including the right to rectification, restriction of processing, data portability, and the right to object to processing.',
      'To exercise your privacy rights, please contact us at privacy@momentum.ai. We will verify your identity before processing your request. You also have the right to lodge a complaint with your local data protection authority.',
    ],
  },
  security: {
    paragraphs: [
      'We implement industry-standard security measures to protect your information, including encryption in transit (TLS 1.3) and at rest (AES-256), regular security audits, and penetration testing by independent third-party firms.',
      'Our infrastructure is hosted on secure, SOC 2-compliant cloud providers with physical security controls, redundant systems, and 24/7 monitoring. Access to production systems is limited to authorized personnel with multi-factor authentication.',
      'We have an incident response plan in place to promptly address any security breaches. In the event of a data breach that affects your personal information, we will notify you within 72 hours as required by applicable law.',
      'While we take security seriously, no method of electronic storage or transmission is 100% secure. We encourage you to use strong passwords, enable two-factor authentication, and follow security best practices.',
    ],
  },
  transfers: {
    paragraphs: [
      'Your information may be transferred to and processed in the United States and other countries where our service providers operate. These countries may have different data protection laws than your country of residence.',
      'For users in the European Economic Area, the United Kingdom, and Switzerland, we ensure adequate safeguards for data transfers through Standard Contractual Clauses (SCCs) approved by the European Commission.',
      'We participate in and comply with relevant data transfer frameworks. You may request a copy of the applicable safeguards by contacting privacy@momentum.ai.',
    ],
  },
  children: {
    paragraphs: [
      'The Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete it immediately.',
      'If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@momentum.ai so we can take appropriate action.',
      'For users between the ages of 13 and 18, we require that a parent or guardian reviews and agrees to our Terms of Service and Privacy Policy before using the Service.',
    ],
  },
  changes: {
    paragraphs: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or industry standards. We will notify you of material changes through the Service or via email at least 30 days before the changes take effect.',
      'We encourage you to review this Privacy Policy periodically. The date of the most recent update is displayed at the top of the policy. Your continued use of the Service after changes become effective constitutes acceptance of the updated policy.',
      'If we make significant changes to how we handle your personal information, we will provide a more prominent notice, such as a banner on the Service or an email notification.',
    ],
  },
  contact: {
    paragraphs: [
      'If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer at:',
      'Email: privacy@momentum.ai',
      'Momentum AI Inc., 548 Market Street, Suite 100, San Francisco, CA 94104',
      'We aim to respond to all privacy-related inquiries within 5 business days. For urgent privacy concerns, please include "PRIVACY" in your email subject line.',
    ],
  },
};

export default function PrivacyPage() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('collect');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">
      <SiteNav />

      <main className="pt-14">
        <section className="py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white dark:from-brand-950/10 dark:to-[#0a0a0f] pointer-events-none" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200/50 dark:border-brand-500/20 text-sm font-medium text-brand-600 dark:text-brand-400 mb-6">
              <Sparkles className="w-4 h-4" />
              Privacy
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-surface-900 dark:text-white mb-4">Privacy Policy</h1>
            <p className="text-surface-500 dark:text-surface-400">Last updated: June 1, 2026</p>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 lg:gap-12">
              <aside className="hidden lg:block w-64 shrink-0">
                <nav className="sticky top-20 space-y-1">
                  <div className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3 px-3">Sections</div>
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={cn(
                        'block w-full text-left px-3 py-2 text-sm rounded-lg transition-all',
                        activeSection === s.id
                          ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 font-medium'
                          : 'text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-white/[0.04]'
                      )}
                    >
                      {s.title}
                    </button>
                  ))}
                  <div className="pt-3 mt-3 border-t border-surface-200 dark:border-white/[0.06] space-y-1">
                    <button
                      onClick={() => alert('Cookie preferences would open here')}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-white/[0.04] transition-all"
                    >
                      <Cookie className="w-4 h-4" />
                      Cookie Preferences
                    </button>
                    <Link
                      href="#"
                      className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-white/[0.04] transition-all"
                    >
                      <FileText className="w-4 h-4" />
                      DPA
                    </Link>
                  </div>
                </nav>
              </aside>

              <div className="flex-1 min-w-0 max-w-3xl">
                <div className="space-y-12">
                  {sections.map((section) => (
                    <article key={section.id} id={section.id} className="scroll-mt-20">
                      <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4 pb-3 border-b border-surface-200 dark:border-white/[0.06]">
                        {section.title}
                      </h2>
                      <div className="space-y-4">
                        {content[section.id].paragraphs.map((p, i) => (
                          <p key={i} className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{p}</p>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-surface-200 dark:border-white/[0.06] space-y-3">
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    Questions? Contact us at{' '}
                    <a href="mailto:privacy@momentum.ai" className="text-brand-500 dark:text-brand-400 hover:underline font-medium">privacy@momentum.ai</a>
                  </p>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Download Data Processing Agreement <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition-all animate-slide-up"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <footer className="border-t border-surface-200 dark:border-white/[0.06] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-surface-500 dark:text-surface-400">
          <div className="flex items-center gap-4">
            <span>&copy; {new Date().getFullYear()} Momentum AI.</span>
            <Link href="/terms" className="hover:text-surface-900 dark:hover:text-white transition-colors">Terms</Link>
            <Link href="/about" className="hover:text-surface-900 dark:hover:text-white transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
