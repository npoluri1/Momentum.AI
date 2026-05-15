import { create } from 'zustand';
import type { User } from '@/lib/types';

interface SocketState {
  connected: boolean;
  onlineUsers: User[];
  setConnected: (connected: boolean) => void;
  setOnlineUsers: (users: User[]) => void;
  addOnlineUser: (user: User) => void;
  removeOnlineUser: (userId: string) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  connected: false,
  onlineUsers: [],
  setConnected: (connected) => set({ connected }),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  addOnlineUser: (user) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.some((u) => u.id === user.id)
        ? state.onlineUsers
        : [...state.onlineUsers, user],
    })),
  removeOnlineUser: (userId) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((u) => u.id !== userId),
    })),
}));
