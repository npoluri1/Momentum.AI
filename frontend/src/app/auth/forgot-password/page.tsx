'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setSent(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-memory-500/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-memory-500" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Check your email</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mb-6">
          We&apos;ve sent a password reset link to <strong className="text-surface-700 dark:text-surface-300">{email}</strong>
        </p>
        <div className="p-4 rounded-xl bg-memory-500/5 border border-memory-500/20 mb-6">
          <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <button onClick={() => { setSent(false); setIsLoading(false); }} className="text-brand-500 hover:text-brand-600 font-medium">
              try again
            </button>
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">Forgot password?</h1>
      <p className="text-surface-500 dark:text-surface-400 mb-8 text-sm">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-danger-500 bg-danger-50 dark:bg-danger-950/30 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={!email.trim() || isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/25"
        >
          {isLoading ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
          ) : (
            <><ArrowRight className="w-4 h-4" /> Send reset link</>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
        Remember your password?{' '}
        <Link href="/auth/login" className="text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
