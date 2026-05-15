'use client';

import { useEffect, useState } from 'react';
import { Bell, Search, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useSocketStore } from '@/store/socket-store';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, logout } = useAuthStore();
  const { connected } = useSocketStore();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) connectSocket(token);
    return () => { disconnectSocket(); };
  }, []);

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className={cn('h-2 w-2 rounded-full', connected ? 'bg-green-500' : 'bg-red-500')} />
          {connected ? 'Connected' : 'Disconnected'}
        </div>

        <button className="relative p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 z-20 rounded-xl border border-gray-700 bg-gray-900 shadow-xl py-2">
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="text-sm font-medium text-gray-200">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || ''}</p>
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors">
                  <UserIcon className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
