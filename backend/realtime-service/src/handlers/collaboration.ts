import { Server } from 'socket.io';
import { AuthenticatedSocket, DocumentChange, CursorPosition } from '../types';
import { cacheClient } from '../redis';

const DOC_STATE_PREFIX = 'doc:state:';
const DOC_LOCKS_PREFIX = 'doc:lock:';
const LOCK_TTL = 30;

interface DocSession {
  userId: string;
  userName: string;
  joinedAt: number;
}

const activeDocSessions = new Map<string, Map<string, DocSession>>();

function getDocStateKey(docId: string): string {
  return `${DOC_STATE_PREFIX}${docId}`;
}

function getDocLockKey(docId: string): string {
  return `${DOC_LOCKS_PREFIX}${docId}`;
}

async function acquireLock(docId: string, userId: string): Promise<boolean> {
  try {
    const result = await cacheClient.set(
      getDocLockKey(docId),
      userId,
      'EX',
      LOCK_TTL,
      'NX'
    );
    return result === 'OK';
  } catch {
    return false;
  }
}

async function releaseLock(docId: string, userId: string): Promise<void> {
  try {
    const lockVal = await cacheClient.get(getDocLockKey(docId));
    if (lockVal === userId) {
      await cacheClient.del(getDocLockKey(docId));
    }
  } catch {
  }
}

function transformOps(ops: Record<string, unknown>[]): Record<string, unknown>[] {
  return ops.map((op) => ({ ...op }));
}

export function registerCollaborationHandlers(
  io: Server,
  socket: AuthenticatedSocket
): void {
  const { userId, name } = socket.data;
  const joinedDocs = new Set<string>();

  socket.on('doc:join', async (data: { docId: string; projectId: string }) => {
    try {
      const { docId, projectId } = data;
      const projRoom = `project:${projectId}`;
      socket.join(projRoom);

      if (!activeDocSessions.has(docId)) {
        activeDocSessions.set(docId, new Map());
      }

      const sessions = activeDocSessions.get(docId)!;
      sessions.set(userId, { userId, userName: name, joinedAt: Date.now() });

      joinedDocs.add(docId);

      const existingState = await cacheClient.get(getDocStateKey(docId));

      socket.emit('doc:state', {
        docId,
        version: existingState ? JSON.parse(existingState).version : 0,
        sessions: Array.from(sessions.values()),
        content: existingState ? JSON.parse(existingState).content : null,
      });
    } catch (err) {
      console.error(`[Collab] Error joining doc ${data.docId}:`, err);
      socket.emit('error', { message: 'Failed to join document', code: 'DOC_JOIN_FAILED' });
    }
  });

  socket.on('doc:edit', async (change: DocumentChange) => {
    try {
      const { docId, projectId, ops, version } = change;

      const lockAcquired = await acquireLock(docId, userId);
      if (!lockAcquired) {
        socket.emit('error', {
          message: 'Document is locked by another editor',
          code: 'DOC_LOCKED',
        });
        return;
      }

      try {
        const projRoom = `project:${projectId}`;
        const transformed = transformOps(ops);

        const existingRaw = await cacheClient.get(getDocStateKey(docId));
        let currentVersion = 0;

        if (existingRaw) {
          const existing = JSON.parse(existingRaw);
          currentVersion = existing.version || 0;
        }

        const newVersion = Math.max(currentVersion, version) + 1;

        await cacheClient.set(
          getDocStateKey(docId),
          JSON.stringify({ version: newVersion, updatedAt: Date.now() }),
          'EX',
          86400
        );

        const broadcastChange: DocumentChange = {
          docId,
          projectId,
          version: newVersion,
          ops: transformed,
          userId,
          timestamp: Date.now(),
        };

        socket.to(projRoom).emit('doc:edit', broadcastChange);

        socket.emit('doc:ack', { docId, version: newVersion });
      } finally {
        await releaseLock(docId, userId);
      }
    } catch (err) {
      console.error(`[Collab] Error processing edit on doc ${change.docId}:`, err);
      socket.emit('error', { message: 'Failed to process edit', code: 'DOC_EDIT_FAILED' });
    }
  });

  socket.on('cursor:move', (cursor: CursorPosition) => {
    try {
      const { docId } = cursor;
      const cursorUpdate: CursorPosition = {
        ...cursor,
        userId,
        userName: name,
        timestamp: Date.now(),
      };

      const sessions = activeDocSessions.get(docId);
      if (sessions) {
        for (const sessionUserId of sessions.keys()) {
          if (sessionUserId !== userId) {
            const userSocket = io.sockets.sockets.get(
              Array.from(io.sockets.sockets.values())
                .find((s) => s.data.userId === sessionUserId)
                ?.id || ''
            );
            if (userSocket) {
              userSocket.emit('cursor:move', cursorUpdate);
            }
          }
        }
      }
    } catch (err) {
      console.error(`[Collab] Error broadcasting cursor:`, err);
    }
  });

  socket.on('doc:leave', async (data: { docId: string }) => {
    try {
      const { docId } = data;
      const sessions = activeDocSessions.get(docId);
      if (sessions) {
        sessions.delete(userId);
        if (sessions.size === 0) {
          activeDocSessions.delete(docId);
        }
      }
      joinedDocs.delete(docId);
    } catch (err) {
      console.error(`[Collab] Error leaving doc ${data.docId}:`, err);
    }
  });

  socket.on('disconnect', () => {
    for (const docId of joinedDocs) {
      const sessions = activeDocSessions.get(docId);
      if (sessions) {
        sessions.delete(userId);
        if (sessions.size === 0) {
          activeDocSessions.delete(docId);
        }
      }
    }
    joinedDocs.clear();
  });
}
