'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { Eye, EyeOff, Github, Chrome, ArrowRight, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { token, user } = await api.login(form.email, form.password);
      setAuth(user, token);
      toast.success('Welcome back!');
      router.push('/workspace/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">Sign in</h1>
      <p className="text-surface-500 dark:text-surface-400 mb-8 text-sm">Welcome back to Momentum AI</p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-white dark:bg-surface-800/50 border border-surface-300 dark:border-surface-600 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 pr-10"
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-surface-400 hover:text-surface-600 dark:hover:text-surface-300">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex items-center justify-end">
          <Link href="/auth/forgot-password" className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium">Forgot password?</Link>
        </div>
        {error && <p className="text-sm text-danger-500 bg-danger-50 dark:bg-danger-950/30 px-3 py-2 rounded-lg">{error}</p>}
        <Button type="submit" loading={isLoading} className="w-full">
          Sign in <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-200 dark:border-surface-700" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-white dark:bg-surface-900 px-2 text-surface-400">or continue with</span></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 rounded-lg border border-surface-300 dark:border-surface-600 px-4 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
          <Github className="h-5 w-5" /> GitHub
        </button>
        <button className="flex items-center justify-center gap-2 rounded-lg border border-surface-300 dark:border-surface-600 px-4 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
          <Chrome className="h-5 w-5" /> Google
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
}
