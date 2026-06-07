'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, ArrowUp, Sparkles, ChevronDown, Menu, X, Moon, Sun, ArrowRight } from 'lucide-react';
import SiteNav from '@/components/layout/SiteNav';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'description', title: '2. Description of Service' },
  { id: 'accounts', title: '3. User Accounts' },
  { id: 'use', title: '4. Acceptable Use' },
  { id: 'ip', title: '5. Intellectual Property' },
  { id: 'payment', title: '6. Payment Terms' },
  { id: 'termination', title: '7. Cancellation & Termination' },
  { id: 'liability', title: '8. Limitation of Liability' },
  { id: 'privacy', title: '9. Privacy' },
  { id: 'law', title: '10. Governing Law' },
  { id: 'changes', title: '11. Changes to Terms' },
  { id: 'contact', title: '12. Contact Information' },
];

const content: Record<string, { paragraphs: string[] }> = {
  acceptance: {
    paragraphs: [
      'By accessing or using Momentum AI ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service. These Terms constitute a legally binding agreement between you and Momentum AI Inc.',
      'We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Service after any changes indicates your acceptance of the modified Terms. It is your responsibility to review these Terms periodically.',
      'The Service is intended for users who are at least 13 years of age. By using the Service, you represent and warrant that you meet this eligibility requirement. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.',
      'Certain features of the Service may be subject to additional guidelines, terms, or rules, which will be posted in connection with such features. All such additional terms are incorporated into these Terms by reference.',
    ],
  },
  description: {
    paragraphs: [
      'Momentum AI provides an AI-native workspace platform that enables users to create projects, deploy AI agents, automate workflows, build applications, and collaborate with team members in real-time. The Service includes web, mobile, and desktop applications, as well as API access for developers.',
      'The platform offers various features including but not limited to: project management tools, AI-powered agents and assistants, workflow automation engines, real-time collaboration capabilities, application building tools, integrations with third-party services, and data storage and synchronization.',
      'We are constantly innovating and improving the Service. Features may be added, modified, or removed at our discretion. We will make reasonable efforts to notify users of material changes to the Service through in-app notifications or email.',
    ],
  },
  accounts: {
    paragraphs: [
      'To access certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.',
      'You must provide accurate, current, and complete information during the registration process and keep your account information updated. You may not create accounts through unauthorized or automated means, or create multiple accounts for disruptive purposes.',
      'We reserve the right to suspend or terminate accounts that violate these Terms or are inactive for an extended period. Account suspension or termination may result in the loss of access to data stored on the Service. We will make reasonable efforts to provide notice before termination.',
      'You may not share your account credentials with any third party or allow others to access your account. Organizations may create team accounts with designated administrators who manage user access and permissions.',
    ],
  },
  use: {
    paragraphs: [
      'You agree to use the Service only for lawful purposes and in accordance with these Terms. You are solely responsible for all content, data, and information you submit, post, or display through the Service ("Your Content"). You retain all rights to Your Content.',
      'You may not use the Service to: upload or distribute viruses, malware, or other harmful code; engage in any activity that interferes with or disrupts the Service; attempt to gain unauthorized access to any part of the Service; impersonate any person or entity; or violate any applicable laws or regulations.',
      'You may not scrape, crawl, or otherwise extract data from the Service using automated tools without our express written permission. You may not reverse-engineer, decompile, or disassemble any aspect of the Service, except to the extent expressly permitted by applicable law.',
      'We reserve the right to investigate and take appropriate action against任何 misuse of the Service, including legal action and account termination. We may remove or refuse to distribute any content that violates these Terms or is otherwise objectionable.',
    ],
  },
  ip: {
    paragraphs: [
      'As between you and Momentum AI, you retain all intellectual property rights in Your Content. We do not claim ownership over your data, documents, projects, or any other content you create or upload to the Service.',
      'Momentum AI owns all rights, title, and interest in and to the Service, including all software, infrastructure, trademarks, trade dress, and proprietary technologies. This includes any suggestions, feedback, or feature requests you provide regarding the Service.',
      'By submitting feedback or suggestions, you grant us a worldwide, perpetual, irrevocable, royalty-free license to use and incorporate them into the Service without any obligation to compensate you.',
      'The Momentum AI name, logo, and brand assets are trademarks of Momentum AI Inc. You may not use these trademarks without our prior written permission, except as expressly authorized in our brand guidelines.',
    ],
  },
  payment: {
    paragraphs: [
      'Certain features of the Service require payment of fees. All fees are non-refundable unless otherwise stated. We may change our pricing with 30 days notice. Price changes will not affect your current billing cycle.',
      'Payments are processed through third-party payment processors. By providing payment information, you represent that you are authorized to use the designated payment method and authorize us to charge the applicable fees.',
      'Subscription plans automatically renew unless cancelled before the renewal date. You may cancel your subscription at any time through your account settings. Upon cancellation, access to paid features continues until the end of the current billing period.',
      'Late payments may result in suspension of access to paid features. We reserve the right to use third-party collections services for accounts that are more than 30 days past due.',
    ],
  },
  termination: {
    paragraphs: [
      'You may cancel your account at any time through the account settings or by contacting support@momentum.ai. Upon cancellation, your access to the Service will continue until the end of your current billing period for paid accounts, or immediately for free accounts.',
      'We may suspend or terminate your access to the Service at any time, with or without cause, with or without notice. Grounds for termination include violation of these Terms, illegal activity, or conduct that could harm other users or the Service.',
      'Upon termination, your right to access the Service ceases immediately. We will provide you with a reasonable period to export Your Content, unless termination was for cause. After the export period, we may permanently delete Your Content from our systems.',
      'Provisions of these Terms that by their nature should survive termination shall survive, including but not limited to intellectual property provisions, warranty disclaimers, indemnification, and limitations of liability.',
    ],
  },
  liability: {
    paragraphs: [
      'The Service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. Momentum AI disclaims all warranties, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.',
      'We do not guarantee that the Service will be uninterrupted, secure, or error-free. We are not responsible for any loss of data, corruption, or damage to your content. You are responsible for maintaining backups of your important data.',
      'To the maximum extent permitted by law, Momentum AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service. Our total liability for any claims under these Terms shall not exceed the amount you paid us in the 12 months preceding the claim.',
      'Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability. In such jurisdictions, our liability will be limited to the greatest extent permitted by applicable law.',
    ],
  },
  privacy: {
    paragraphs: [
      'Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using the Service, you consent to our collection and use of information as described in the Privacy Policy.',
      'We implement reasonable technical and organizational measures to protect your data. However, no method of transmission or storage is completely secure. We cannot guarantee the absolute security of your information.',
      'If you are located in the European Economic Area, Switzerland, or the United Kingdom, your personal data is processed in accordance with the General Data Protection Regulation (GDPR). You have the right to access, rectify, and delete your personal data as described in our Privacy Policy.',
    ],
  },
  law: {
    paragraphs: [
      'These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. The United Nations Convention on Contracts for the International Sale of Goods does not apply to these Terms.',
      'Any disputes arising out of or relating to these Terms or the Service shall be resolved exclusively in the state or federal courts located in San Francisco, California. You consent to the personal jurisdiction of these courts.',
      'If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.',
      'The failure of Momentum AI to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. Any waiver must be in writing and signed by an authorized representative of Momentum AI.',
    ],
  },
  changes: {
    paragraphs: [
      'We reserve the right to modify these Terms at any time. If we make material changes, we will notify you through the Service or by email at least 30 days before the changes take effect. Your continued use of the Service after the effective date constitutes acceptance of the modified Terms.',
      'Minor changes, such as clarifications or corrections, may take effect immediately upon posting. We encourage you to review the Terms periodically to stay informed about your rights and obligations.',
      'If you do not agree to the modified Terms, you may terminate your account before the changes take effect. Continued use after the effective date indicates your acceptance of the updated Terms.',
    ],
  },
  contact: {
    paragraphs: [
      'If you have any questions, concerns, or requests regarding these Terms, please contact us at:',
      'Email: legal@momentum.ai',
      'Momentum AI Inc. 548 Market Street, Suite 100, San Francisco, CA 94104',
      'We aim to respond to all inquiries within 5 business days. For urgent legal matters, please include "URGENT" in your email subject line.',
    ],
  },
};

export default function TermsPage() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('acceptance');
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
              Legal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-surface-900 dark:text-white mb-4">Terms of Service</h1>
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

                <div className="mt-12 pt-8 border-t border-surface-200 dark:border-white/[0.06]">
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    Questions? Contact us at{' '}
                    <a href="mailto:legal@momentum.ai" className="text-brand-500 dark:text-brand-400 hover:underline font-medium">legal@momentum.ai</a>
                  </p>
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
            <Link href="/privacy" className="hover:text-surface-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link href="/about" className="hover:text-surface-900 dark:hover:text-white transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
