'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle, ArrowRight, Lock, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ password: '', confirmPassword: '' });

  function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
    if (!pw) return { label: '', color: '', width: '0%' };
    const checks = [
      pw.length >= 8,
      /[A-Z]/.test(pw),
      /[a-z]/.test(pw),
      /[0-9]/.test(pw),
      /[^A-Za-z0-9]/.test(pw),
    ];
    const score = checks.filter(Boolean).length;
    if (score <= 2) return { label: 'Weak', color: 'bg-danger-500', width: '33%' };
    if (score <= 3) return { label: 'Medium', color: 'bg-warning-500', width: '66%' };
    return { label: 'Strong', color: 'bg-memory-500', width: '100%' };
  }

  const strength = getPasswordStrength(form.password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch {
      setError('Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-memory-500/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-memory-500" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Password reset!</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mb-6">
          Your password has been successfully reset.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/25"
        >
          Sign in <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-5 h-5 text-brand-500" />
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Reset password</h1>
      </div>
      <p className="text-surface-500 dark:text-surface-400 mb-8 text-sm">
        Enter your new password below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              required
              minLength={8}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {form.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                  <div className={cn('h-full rounded-full transition-all', strength.color)} style={{ width: strength.width }} />
                </div>
                <span className={cn('text-[10px] font-medium', strength.color.replace('bg-', 'text-'))}>{strength.label}</span>
              </div>
              <p className="text-[10px] text-surface-400 mt-0.5">At least 8 characters with uppercase, number &amp; symbol</p>
            </div>
          )}
        </div>

        <div className="relative">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              required
              minLength={8}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {form.confirmPassword && (
            <div className="mt-1 flex items-center gap-1.5">
              {form.password === form.confirmPassword ? (
                <span className="text-[10px] text-memory-500 flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" /> Passwords match
                </span>
              ) : (
                <span className="text-[10px] text-danger-500">Passwords do not match</span>
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-danger-500 bg-danger-50 dark:bg-danger-950/30 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={!form.password || !form.confirmPassword || form.password !== form.confirmPassword || isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/25"
        >
          {isLoading ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Resetting...</>
          ) : (
            <><Shield className="w-4 h-4" /> Reset password</>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
