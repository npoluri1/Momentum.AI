import { Server } from 'socket.io';
import { AuthenticatedSocket, PresenceUpdate, TypingIndicator } from '../types';
import { cacheClient } from '../redis';

const PRESENCE_TTL = 120;
const ONLINE_THRESHOLD = 30000;

const userPresence = new Map<string, PresenceUpdate>();

function buildPresenceKey(room: string): string {
  return `presence:${room}`;
}

function buildTypingKey(room: string): string {
  return `typing:${room}`;
}

async function broadcastPresenceUpdate(
  io: Server,
  room: string,
  update: PresenceUpdate
): Promise<void> {
  io.to(room).emit('presence:update', update);
}

async function broadcastPresenceList(
  io: Server,
  room: string,
  users: PresenceUpdate[]
): Promise<void> {
  io.to(room).emit('presence:list', users);
}

async function getRoomUsers(room: string): Promise<PresenceUpdate[]> {
  try {
    const raw = await cacheClient.hgetall(buildPresenceKey(room));
    const users: PresenceUpdate[] = [];
    for (const value of Object.values(raw)) {
      try {
        const parsed = JSON.parse(value) as PresenceUpdate;
        if (Date.now() - parsed.lastActive < PRESENCE_TTL * 1000) {
          users.push(parsed);
        }
      } catch {
        continue;
      }
    }
    return users;
  } catch {
    return Array.from(userPresence.values()).filter(
      (u) => Date.now() - u.lastActive < PRESENCE_TTL * 1000
    );
  }
}

export function registerPresenceHandlers(io: Server, socket: AuthenticatedSocket): void {
  const { userId, name, email } = socket.data;

  socket.on('presence:online', async (data: { workspaceId?: string; projectId?: string }) => {
    try {
      const update: PresenceUpdate = {
        userId,
        name,
        email,
        status: 'online',
        workspaceId: data.workspaceId,
        projectId: data.projectId,
        lastActive: Date.now(),
      };

      userPresence.set(userId, update);

      if (data.workspaceId) {
        const wsRoom = `workspace:${data.workspaceId}`;
        socket.join(wsRoom);
        await cacheClient.hset(
          buildPresenceKey(wsRoom),
          userId,
          JSON.stringify(update)
        );
        await cacheClient.expire(buildPresenceKey(wsRoom), PRESENCE_TTL);
        broadcastPresenceUpdate(io, wsRoom, update);
      }

      if (data.projectId) {
        const projRoom = `project:${data.projectId}`;
        socket.join(projRoom);
        await cacheClient.hset(
          buildPresenceKey(projRoom),
          userId,
          JSON.stringify(update)
        );
        await cacheClient.expire(buildPresenceKey(projRoom), PRESENCE_TTL);
        broadcastPresenceUpdate(io, projRoom, update);
      }

      const userRoom = `user:${userId}`;
      socket.join(userRoom);

      const rooms = [data.workspaceId && `workspace:${data.workspaceId}`, data.projectId && `project:${data.projectId}`].filter(Boolean) as string[];

      for (const room of rooms) {
        const users = await getRoomUsers(room);
        broadcastPresenceList(io, room, users);
      }
    } catch (err) {
      console.error(`[Presence] Error setting online for user ${userId}:`, err);
    }
  });

  socket.on('disconnect', async () => {
    try {
      const update: PresenceUpdate = {
        userId,
        name,
        email,
        status: 'offline',
        lastActive: Date.now(),
      };

      userPresence.delete(userId);

      const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);

      for (const room of rooms) {
        if (room.startsWith('workspace:') || room.startsWith('project:')) {
          await cacheClient.hdel(buildPresenceKey(room), userId);
          broadcastPresenceUpdate(io, room, update);
        }
      }
    } catch (err) {
      console.error(`[Presence] Error on disconnect for user ${userId}:`, err);
    }
  });

  socket.on('presence:typing', async (indicator: Omit<TypingIndicator, 'timestamp'>) => {
    try {
      const typingUpdate: TypingIndicator = {
        ...indicator,
        userId,
        name,
        timestamp: Date.now(),
      };

      const typingRoom = indicator.room;

      if (indicator.isTyping) {
        await cacheClient.hset(
          buildTypingKey(typingRoom),
          userId,
          JSON.stringify(typingUpdate)
        );
        await cacheClient.expire(buildTypingKey(typingRoom), 10);
      } else {
        await cacheClient.hdel(buildTypingKey(typingRoom), userId);
      }

      socket.to(typingRoom).emit('presence:typing', typingUpdate);
    } catch (err) {
      console.error(`[Presence] Error handling typing for user ${userId}:`, err);
    }
  });

  socket.on('room:join', async (data: { room: string }) => {
    try {
      socket.join(data.room);

      const update = userPresence.get(userId);
      if (update) {
        await cacheClient.hset(
          buildPresenceKey(data.room),
          userId,
          JSON.stringify({ ...update, lastActive: Date.now() })
        );
        await cacheClient.expire(buildPresenceKey(data.room), PRESENCE_TTL);

        const users = await getRoomUsers(data.room);
        broadcastPresenceList(io, data.room, users);
      }
    } catch (err) {
      console.error(`[Presence] Error joining room ${data.room}:`, err);
    }
  });

  socket.on('room:leave', async (data: { room: string }) => {
    try {
      socket.leave(data.room);

      await cacheClient.hdel(buildPresenceKey(data.room), userId);

      const users = await getRoomUsers(data.room);
      broadcastPresenceList(io, data.room, users);
    } catch (err) {
      console.error(`[Presence] Error leaving room ${data.room}:`, err);
    }
  });
}
