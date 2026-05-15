'use client';

import { cn, getInitials } from '@/lib/utils';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const statusSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
};

interface AvatarProps {
  src?: string;
  name: string;
  size?: keyof typeof sizes;
  className?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  onClick?: () => void;
}

const statusColors = {
  online: 'bg-success-500',
  offline: 'bg-surface-400',
  away: 'bg-warning-500',
  busy: 'bg-danger-500',
};

export function Avatar({
  src,
  name,
  size = 'md',
  className,
  status,
  onClick,
}: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div className={cn('relative inline-flex shrink-0', onClick && 'cursor-pointer')} onClick={onClick}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            'rounded-full object-cover',
            sizes[size],
            className
          )}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-medium',
          sizes[size],
          src && 'hidden',
          className
        )}
      >
        {initials}
      </div>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-surface-900',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}
