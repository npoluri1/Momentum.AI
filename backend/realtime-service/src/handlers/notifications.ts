import { Server } from 'socket.io';
import { AuthenticatedSocket, Notification } from '../types';
import { cacheClient } from '../redis';
import { v4 as uuidv4 } from 'uuid';

const NOTIFICATIONS_PREFIX = 'notifications:';
const NOTIFICATION_TTL = 86400 * 30;

function getNotificationKey(userId: string): string {
  return `${NOTIFICATIONS_PREFIX}${userId}`;
}

function getUnreadCountKey(userId: string): string {
  return `${NOTIFICATIONS_PREFIX}unread:${userId}`;
}

async function storeNotification(
  userId: string,
  notification: Notification
): Promise<void> {
  try {
    const key = getNotificationKey(userId);
    await cacheClient.lpush(key, JSON.stringify(notification));
    await cacheClient.ltrim(key, 0, 199);
    await cacheClient.expire(key, NOTIFICATION_TTL);

    await cacheClient.incr(getUnreadCountKey(userId));
    await cacheClient.expire(getUnreadCountKey(userId), NOTIFICATION_TTL);
  } catch {
  }
}

async function getNotifications(
  userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ notifications: Notification[]; total: number; unreadCount: number }> {
  try {
    const key = getNotificationKey(userId);
    const total = await cacheClient.llen(key);
    const raw = await cacheClient.lrange(key, offset, offset + limit - 1);
    const unreadCount = parseInt(
      (await cacheClient.get(getUnreadCountKey(userId))) || '0',
      10
    );

    const notifications: Notification[] = raw
      .map((item) => {
        try {
          return JSON.parse(item) as Notification;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as Notification[];

    return { notifications, total, unreadCount };
  } catch {
    return { notifications: [], total: 0, unreadCount: 0 };
  }
}

export function registerNotificationHandlers(
  io: Server,
  socket: AuthenticatedSocket
): void {
  const { userId, name: _name } = socket.data;

  socket.on('notification:list', async (data?: { limit?: number; offset?: number }) => {
    try {
      const result = await getNotifications(
        userId,
        data?.limit || 20,
        data?.offset || 0
      );
      socket.emit('notification:list', result.notifications);
      socket.emit('notification:unread_count', result.unreadCount);
    } catch (err) {
      console.error(`[Notifications] Error listing for user ${userId}:`, err);
      socket.emit('error', {
        message: 'Failed to fetch notifications',
        code: 'NOTIF_LIST_FAILED',
      });
    }
  });

  socket.on('notification:read', async (data: { notificationId: string }) => {
    try {
      const key = getNotificationKey(userId);
      const raw = await cacheClient.lrange(key, 0, -1);

      for (const item of raw) {
        try {
          const notif = JSON.parse(item) as Notification;
          if (notif.id === data.notificationId && !notif.read) {
            notif.read = true;
            const idx = raw.indexOf(item);
            await cacheClient.lset(key, idx, JSON.stringify(notif));
            await cacheClient.decr(getUnreadCountKey(userId));
            break;
          }
        } catch {
          continue;
        }
      }

      const unreadCount = parseInt(
        (await cacheClient.get(getUnreadCountKey(userId))) || '0',
        10
      );
      socket.emit('notification:unread_count', unreadCount);
    } catch (err) {
      console.error(`[Notifications] Error marking read:`, err);
    }
  });

  socket.on('notification:read_all', async () => {
    try {
      const key = getNotificationKey(userId);
      const raw = await cacheClient.lrange(key, 0, -1);

      for (let i = 0; i < raw.length; i++) {
        try {
          const notif = JSON.parse(raw[i]) as Notification;
          if (!notif.read) {
            notif.read = true;
            await cacheClient.lset(key, i, JSON.stringify(notif));
          }
        } catch {
          continue;
        }
      }

      await cacheClient.set(getUnreadCountKey(userId), '0');
      await cacheClient.expire(getUnreadCountKey(userId), NOTIFICATION_TTL);

      socket.emit('notification:unread_count', 0);
    } catch (err) {
      console.error(`[Notifications] Error marking all read:`, err);
    }
  });
}

export async function pushNotification(
  io: Server,
  notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
): Promise<string> {
  const fullNotification: Notification = {
    ...notification,
    id: uuidv4(),
    timestamp: Date.now(),
    read: false,
  };

  await storeNotification(notification.userId, fullNotification);

  const userRoom = `user:${notification.userId}`;
  io.to(userRoom).emit('notification:new', fullNotification);

  const unreadCount = parseInt(
    (await cacheClient.get(getUnreadCountKey(notification.userId))) || '1',
    10
  );
  io.to(userRoom).emit('notification:unread_count', unreadCount);

  return fullNotification.id;
}

export async function pushNotificationToRoom(
  io: Server,
  room: string,
  notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
): Promise<string> {
  const fullNotification: Notification = {
    ...notification,
    id: uuidv4(),
    timestamp: Date.now(),
    read: false,
  };

  await storeNotification(notification.userId, fullNotification);

  io.to(room).emit('notification:new', fullNotification);

  return fullNotification.id;
}

export async function broadcastNotification(
  io: Server,
  room: string,
  notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
): Promise<string> {
  const fullNotification: Notification = {
    ...notification,
    id: uuidv4(),
    timestamp: Date.now(),
    read: false,
  };

  const userRoom = `user:${notification.userId}`;
  io.to(userRoom).emit('notification:new', fullNotification);

  io.to(room).emit('notification:new', fullNotification);

  return fullNotification.id;
}
