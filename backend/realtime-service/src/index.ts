import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createAdapter } from '@socket.io/redis-adapter';
import { config } from './config';
import { pubClient, subClient, testConnection } from './redis';
import { authMiddleware } from './auth';
import { registerPresenceHandlers } from './handlers/presence';
import { registerCollaborationHandlers } from './handlers/collaboration';
import { registerChatHandlers } from './handlers/chat';
import { registerNotificationHandlers } from './handlers/notifications';
import { registerTaskboardHandlers } from './handlers/taskboard';

const app = express();
const server = http.createServer(app);

app.use(cors(config.cors));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'realtime-collaboration',
    timestamp: Date.now(),
    uptime: process.uptime(),
  });
});

const io = new Server(server, {
  cors: config.cors,
  pingInterval: 25000,
  pingTimeout: 20000,
  connectTimeout: 15000,
  maxHttpBufferSize: 1e7,
  transports: ['websocket', 'polling'],
  allowEIO3: true,
});

const userSocketMap = new Map<string, Set<string>>();

io.use(authMiddleware);

io.on('connection', (socket) => {
  const { userId } = socket.data;

  if (!userSocketMap.has(userId)) {
    userSocketMap.set(userId, new Set());
  }
  userSocketMap.get(userId)!.add(socket.id);

  const userRoom = `user:${userId}`;
  socket.join(userRoom);

  registerPresenceHandlers(io, socket);
  registerCollaborationHandlers(io, socket);
  registerChatHandlers(io, socket);
  registerNotificationHandlers(io, socket);
  registerTaskboardHandlers(io, socket);

  socket.on('disconnect', () => {
    const sockets = userSocketMap.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        userSocketMap.delete(userId);
      }
    }
  });

  socket.on('error', (err) => {
    console.error(`[Socket] Error for user ${userId}:`, err.message);
  });
});

io.of('/').adapter.on('create-room', (room: string) => {
  console.log(`[Room] Created: ${room}`);
});

io.of('/').adapter.on('delete-room', (room: string) => {
  console.log(`[Room] Deleted: ${room}`);
});

io.of('/').adapter.on('join-room', (room: string, id: string) => {
  console.log(`[Room] Socket ${id} joined: ${room}`);
});

io.of('/').adapter.on('leave-room', (room: string, id: string) => {
  console.log(`[Room] Socket ${id} left: ${room}`);
});

function getUserSocketCount(): number {
  return userSocketMap.size;
}

async function start(): Promise<void> {
  try {
    const redisConnected = await testConnection();
    if (!redisConnected) {
      console.warn('[Server] Redis connection failed - running without Redis adapter');
      console.warn('[Server] Some features (pub/sub across instances) will be unavailable');
    } else {
      io.adapter(createAdapter(pubClient, subClient));
      console.log('[Server] Redis adapter attached to Socket.io');
    }

    server.listen(config.port, config.host, () => {
      console.log(`[Server] Real-time collaboration service running on ${config.host}:${config.port}`);
      console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[Server] CORS origin: ${config.cors.origin}`);
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
}

start();

export { app, server, io, getUserSocketCount };
