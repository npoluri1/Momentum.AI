'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getSocket } from '@/lib/socket';
import { MousePointer2 } from 'lucide-react';

interface CursorData {
  x: number;
  y: number;
  name: string;
  color: string;
  lastSeen: number;
}

interface PresenceCursorsProps {
  roomId: string;
  userId: string;
  userName: string;
  userColor?: string;
}

const CURSOR_COLORS = ['#ff2d60', '#4fcf70', '#a767e5', '#12bcfe', '#f59e0b', '#ef4444'];
const CURSOR_TIMEOUT = 30000;
const THROTTLE_MS = 50;

export default function PresenceCursors({ roomId, userId, userName, userColor }: PresenceCursorsProps) {
  const [cursors, setCursors] = useState<Map<string, CursorData>>(new Map());
  const lastEmitRef = useRef<number>(0);
  const cleanupRef = useRef<(() => void) | null>(null);

  const getColor = useCallback((id: string) => {
    if (userColor) return userColor;
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length];
  }, [userColor]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('cursor:join', { roomId, userId, userName });

    const handleCursorMove = (data: { userId: string; x: number; y: number; userName: string; userColor?: string }) => {
      if (data.userId === userId) return;
      setCursors((prev) => {
        const next = new Map(prev);
        next.set(data.userId, {
          x: data.x,
          y: data.y,
          name: data.userName,
          color: data.userColor || getColor(data.userId),
          lastSeen: Date.now(),
        });
        return next;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastEmitRef.current < THROTTLE_MS) return;
      lastEmitRef.current = now;
      socket.emit('cursor:move', {
        roomId,
        userId,
        userName,
        userColor: userColor || getColor(userId),
        x: e.clientX,
        y: e.clientY,
      });
    };

    socket.on('cursor:move', handleCursorMove);
    window.addEventListener('mousemove', handleMouseMove);

    const interval = setInterval(() => {
      const now = Date.now();
      setCursors((prev) => {
        const next = new Map(prev);
        let changed = false;
        for (const [id, data] of next) {
          if (now - data.lastSeen > CURSOR_TIMEOUT) {
            next.delete(id);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);

    cleanupRef.current = () => {
      socket.emit('cursor:leave', { roomId, userId });
      socket.off('cursor:move', handleCursorMove);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };

    return () => {
      cleanupRef.current?.();
    };
  }, [roomId, userId, userName, userColor, getColor]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from(cursors.entries()).map(([id, data]) => (
        <div
          key={id}
          className="absolute pointer-events-none flex items-center gap-1.5"
          style={{
            left: data.x,
            top: data.y,
            transform: 'translate(-2px, -2px)',
            transition: 'left 0.1s ease-out, top 0.1s ease-out',
          }}
        >
          <MousePointer2
            className="w-4 h-4"
            style={{ color: data.color }}
            fill={data.color}
          />
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-lg whitespace-nowrap text-white"
            style={{ backgroundColor: data.color }}
          >
            {data.name}
          </span>
        </div>
      ))}
    </div>
  );
}
