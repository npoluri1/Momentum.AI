'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const { token, user } = await api.register({ name: form.name, email: form.email, password: form.password });
      setAuth(user, token);
      toast.success('Account created!');
      router.push('/onboarding');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">Create Account</h1>
      <p className="text-surface-500 dark:text-surface-400 mb-8 text-sm">Get started with Momentum AI</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Full Name</label>
          <input
            id="name"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            required
          />
        </div>
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Password</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 pr-10"
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            required
          />
        </div>

        {error && <p className="text-sm text-danger-500 bg-danger-50 dark:bg-danger-950/30 px-3 py-2 rounded-lg">{error}</p>}

        <Button type="submit" loading={isLoading} className="w-full">
          Create Account <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
