'use client';

import { useState, useEffect } from 'react';
import { cn, getInitials } from '@/lib/utils';
import { useSocketStore } from '@/store/socket-store';
import { Users, MoreHorizontal } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar?: string;
  status?: 'online' | 'away' | 'busy';
}

interface PresenceAvatarsProps {
  users?: User[];
  maxVisible?: number;
  showCount?: boolean;
  className?: string;
  onViewAll?: () => void;
}

const statusColors: Record<string, string> = {
  online: 'bg-success-500',
  away: 'bg-warning-500',
  busy: 'bg-danger-500',
};

export default function PresenceAvatars({
  users: propUsers,
  maxVisible = 4,
  showCount = true,
  className,
  onViewAll,
}: PresenceAvatarsProps) {
  const { connected, onlineUsers } = useSocketStore();
  const [showPopup, setShowPopup] = useState(false);

  // Use socket store if available, otherwise use prop users
  const users = propUsers || onlineUsers.map(u => ({
    id: u.id,
    name: u.name,
    avatar: u.avatar,
    status: 'online' as const,
  }));

  // If no users provided, use mock data
  const displayUsers = users.length > 0
    ? users
    : [
        { id: '1', name: 'Sarah Chen', status: 'online' as const },
        { id: '2', name: 'Alex Rivera', status: 'online' as const },
        { id: '3', name: 'John Doe', status: 'away' as const },
        { id: '4', name: 'Maria Santos', status: 'online' as const },
        { id: '5', name: 'David Kim', status: 'busy' as const },
        { id: '6', name: 'Priya Sharma', status: 'online' as const },
      ];

  const visibleUsers = displayUsers.slice(0, maxVisible);
  const remaining = displayUsers.length - maxVisible;

  // Close popup on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-presence-popup]')) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className={cn('relative', className)} data-presence-popup>
      {/* Connection indicator */}
      <div className="flex items-center gap-2">
        <div className="flex items-center -space-x-2">
          {visibleUsers.map((user, i) => (
            <div
              key={user.id}
              className="relative group/avatar"
              style={{ zIndex: visibleUsers.length - i }}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full border-2 border-white dark:border-[#0a0a0f] object-cover shadow-sm cursor-pointer hover:z-10 relative transition-transform hover:scale-110"
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-full border-2 border-white dark:border-[#0a0a0f] flex items-center justify-center text-[9px] font-bold text-white shadow-sm cursor-pointer hover:z-10 relative transition-transform hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${getGradientColor(i, 0)}, ${getGradientColor(i, 1)})`,
                  }}
                  title={user.name}
                >
                  {getInitials(user.name)}
                </div>
              )}
              {/* Status dot */}
              {user.status && (
                <div className={cn(
                  'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#0a0a0f]',
                  statusColors[user.status] || statusColors.online
                )} />
              )}
              {/* Tooltip */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-surface-900 dark:bg-surface-700 text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
                {user.name}
                {user.status && (
                  <span className="text-surface-400 ml-1 capitalize">• {user.status}</span>
                )}
              </div>
            </div>
          ))}

          {/* Remaining count */}
          {remaining > 0 && (
            <button
              onClick={() => setShowPopup(!showPopup)}
              className="relative w-7 h-7 rounded-full border-2 border-white dark:border-[#0a0a0f] bg-surface-200/80 dark:bg-surface-700/80 flex items-center justify-center text-[10px] font-bold text-surface-500 dark:text-surface-300 shadow-sm hover:bg-surface-300 dark:hover:bg-surface-600 transition-all cursor-pointer"
            >
              +{remaining}
            </button>
          )}
        </div>

        {showCount && (
          <span className="text-xs text-surface-400 dark:text-surface-500 font-medium">
            {displayUsers.length} {displayUsers.length === 1 ? 'online' : 'online'}
          </span>
        )}

        {connected !== undefined && (
          <div className="flex items-center gap-1.5">
            <div className={cn(
              'w-1.5 h-1.5 rounded-full',
              connected ? 'bg-success-500' : 'bg-surface-400'
            )} />
            <span className="text-[10px] text-surface-400">
              {connected ? 'Live' : 'Offline'}
            </span>
          </div>
        )}
      </div>

      {/* Popup with all online users */}
      {showPopup && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden border border-surface-200 dark:border-white/[0.06] bg-white dark:bg-surface-800 shadow-xl z-50 animate-fade-in">
          <div className="px-4 py-3 border-b border-surface-100 dark:border-white/[0.04] flex items-center justify-between">
            <span className="text-sm font-semibold text-surface-900 dark:text-white">Online Members</span>
            <span className="text-xs text-surface-400">{displayUsers.length} online</span>
          </div>
          <div className="max-h-60 overflow-y-auto p-2 space-y-1">
            {displayUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-50 dark:hover:bg-white/[0.04] transition-colors"
              >
                <div className="relative shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${getGradientColor(displayUsers.indexOf(user), 0)}, ${getGradientColor(displayUsers.indexOf(user), 1)})`,
                      }}
                    >
                      {getInitials(user.name)}
                    </div>
                  )}
                  {user.status && (
                    <div className={cn(
                      'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-surface-800',
                      statusColors[user.status]
                    )} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-surface-400 capitalize">{user.status || 'online'}</p>
                </div>
              </div>
            ))}
          </div>
          {onViewAll && (
            <div className="px-3 py-2 border-t border-surface-100 dark:border-white/[0.04]">
              <button
                onClick={onViewAll}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-brand-500 hover:text-brand-600 hover:bg-brand-500/5 rounded-xl transition-all"
              >
                <Users className="w-3.5 h-3.5" />
                View all members
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Generate consistent gradient colors based on index
function getGradientColor(index: number, shade: number): string {
  const gradients = [
    ['#ff2d60', '#ff6b8a'],
    ['#8b5cf6', '#a78bfa'],
    ['#10b981', '#34d399'],
    ['#06b6d4', '#22d3ee'],
    ['#f59e0b', '#fbbf24'],
    ['#ef4444', '#f87171'],
    ['#6366f1', '#818cf8'],
    ['#ec4899', '#f472b6'],
  ];
  const pair = gradients[index % gradients.length];
  return shade === 0 ? pair[0] : pair[1];
}
