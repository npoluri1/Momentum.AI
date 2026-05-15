'use client';

import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300',
  primary: 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300',
  success: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300',
  warning: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300',
  danger: 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  dot?: boolean;
  dotColor?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  dot,
  dotColor,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            dotColor || 'currentColor'
          )}
          style={dotColor ? { backgroundColor: dotColor } : undefined}
        />
      )}
      {children}
    </span>
  );
}
