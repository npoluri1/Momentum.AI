import { Server } from 'socket.io';
import { AuthenticatedSocket, ChatMessage } from '../types';
import { cacheClient } from '../redis';
import { config } from '../config';
import { v4 as uuidv4 } from 'uuid';

const CHAT_HISTORY_PREFIX = 'chat:history:';
const CHAT_EDIT_PREFIX = 'chat:edit:';
const UNREAD_PREFIX = 'chat:unread:';

function getHistoryKey(room: string): string {
  return `${CHAT_HISTORY_PREFIX}${room}`;
}

function getUnreadKey(userId: string, room: string): string {
  return `${UNREAD_PREFIX}${userId}:${room}`;
}

async function getChatHistory(
  room: string,
  limit: number = 50
): Promise<ChatMessage[]> {
  try {
    const raw = await cacheClient.lrange(getHistoryKey(room), -limit, -1);
    return raw
      .map((item) => {
        try {
          return JSON.parse(item) as ChatMessage;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as ChatMessage[];
  } catch {
    return [];
  }
}

async function addToHistory(message: ChatMessage, room: string): Promise<void> {
  try {
    const key = getHistoryKey(room);
    await cacheClient.rpush(key, JSON.stringify(message));
    await cacheClient.ltrim(key, -config.chat.maxHistoryPerRoom, -1);
    await cacheClient.expire(key, 86400 * 7);
  } catch {
  }
}

function extractMentions(content: string): string[] {
  const mentionRegex = /@([\w.-]+)/g;
  const mentions: string[] = [];
  let match;
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push(match[1]);
  }
  return mentions;
}

export function registerChatHandlers(io: Server, socket: AuthenticatedSocket): void {
  const { userId, name } = socket.data;

  socket.on('chat:send', async (messageData) => {
    try {
      const message: ChatMessage = {
        id: uuidv4(),
        room: messageData.room,
        roomType: messageData.roomType,
        fromUserId: userId,
        fromName: name,
        content: messageData.content,
        mentions: extractMentions(messageData.content),
        attachments: messageData.attachments,
        replyTo: messageData.replyTo,
        timestamp: Date.now(),
      };

      await addToHistory(message, messageData.room);

      io.to(messageData.room).emit('chat:message', message);

      if (message.mentions && message.mentions.length > 0) {
        for (const mentionedUser of message.mentions) {
          const userRoom = `user:${mentionedUser}`;
          io.to(userRoom).emit('notification:new', {
            id: uuidv4(),
            type: 'mention',
            userId: mentionedUser,
            title: `${name} mentioned you`,
            body: message.content.substring(0, 200),
            data: { messageId: message.id, room: message.room },
            read: false,
            timestamp: message.timestamp,
          });
        }
      }

      if (messageData.roomType === 'direct') {
        const parts = messageData.room.split('_');
        const otherUserId = parts.find((p: string) => p !== userId);
        if (otherUserId) {
          const unreadKey = getUnreadKey(otherUserId, messageData.room);
          await cacheClient.incr(unreadKey);
          await cacheClient.expire(unreadKey, 86400 * 30);
          io.to(`user:${otherUserId}`).emit('chat:unread_count', {
            room: messageData.room,
            count: parseInt(await cacheClient.get(unreadKey) || '0', 10),
          });
        }
      }
    } catch (err) {
      console.error(`[Chat] Error sending message:`, err);
      socket.emit('error', { message: 'Failed to send message', code: 'CHAT_SEND_FAILED' });
    }
  });

  socket.on('chat:history', async (data: { room: string; limit?: number }) => {
    try {
      const messages = await getChatHistory(data.room, data.limit || 50);
      socket.emit('chat:history', messages);

      const unreadKey = getUnreadKey(userId, data.room);
      await cacheClient.del(unreadKey);
    } catch (err) {
      console.error(`[Chat] Error fetching history:`, err);
      socket.emit('error', { message: 'Failed to fetch history', code: 'CHAT_HISTORY_FAILED' });
    }
  });

  socket.on('chat:edit', async (data: { messageId: string; content: string }) => {
    try {
      const editKey = `${CHAT_EDIT_PREFIX}${data.messageId}`;
      const editedAt = Date.now();

      await cacheClient.set(editKey, JSON.stringify({ content: data.content, editedAt }), 'EX', 86400 * 7);

      let foundRoom: string | null = null;

      const roomKeys = await cacheClient.keys(`${CHAT_HISTORY_PREFIX}*`);

      for (const key of roomKeys) {
        const raw = await cacheClient.lrange(key, 0, -1);
        for (const item of raw) {
          try {
            const msg = JSON.parse(item) as ChatMessage;
            if (msg.id === data.messageId && msg.fromUserId === userId) {
              msg.content = data.content;
              msg.editedAt = editedAt;

              await cacheClient.lset(key, raw.indexOf(item), JSON.stringify(msg));
              foundRoom = msg.room;
              break;
            }
          } catch {
            continue;
          }
        }
        if (foundRoom) break;
      }

      if (foundRoom) {
        io.to(foundRoom).emit('chat:edited', {
          messageId: data.messageId,
          content: data.content,
          editedAt,
        });
      }
    } catch (err) {
      console.error(`[Chat] Error editing message:`, err);
      socket.emit('error', { message: 'Failed to edit message', code: 'CHAT_EDIT_FAILED' });
    }
  });

  socket.on('chat:mark_read', async (data: { room: string }) => {
    try {
      const unreadKey = getUnreadKey(userId, data.room);
      await cacheClient.del(unreadKey);
    } catch {
    }
  });
}
