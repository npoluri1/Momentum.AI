'use client';

import { useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw] max-h-[90vh]',
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: keyof typeof sizes;
  className?: string;
  showClose?: boolean;
}

export function Modal({
  open,
  onClose,
  children,
  title,
  size = 'md',
  className,
  showClose = true,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, handleEscape]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={cn(
          'relative w-full bg-white dark:bg-surface-900 rounded-2xl shadow-2xl',
          'border border-surface-200 dark:border-surface-800',
          'animate-slide-up',
          sizes[size],
          className
        )}
      >
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-800">
            {title && (
              <h2 className="text-lg font-semibold">{title}</h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className={cn(
                  'p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-200',
                  'hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors',
                  !title && 'ml-auto'
                )}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="p-6 overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
}
