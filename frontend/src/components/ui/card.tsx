'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900/50',
        hover && 'transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/5 hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-800',
        className
      )}
    >
      <div className="text-base font-semibold">{children}</div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function CardContent({ children, className, padding = true }: CardContentProps) {
  return (
    <div className={cn(padding && 'px-6 py-4', className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4 border-t border-surface-200 dark:border-surface-800',
        className
      )}
    >
      {children}
    </div>
  );
}
