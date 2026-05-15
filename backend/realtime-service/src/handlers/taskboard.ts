import { Server } from 'socket.io';
import { AuthenticatedSocket, TaskBoardUpdate } from '../types';
import { cacheClient } from '../redis';

const BOARD_STATE_PREFIX = 'board:state:';
const BOARD_LOCKS_PREFIX = 'board:lock:';
const LOCK_TTL = 5;

function getBoardStateKey(boardId: string): string {
  return `${BOARD_STATE_PREFIX}${boardId}`;
}

function getBoardLockKey(boardId: string): string {
  return `${BOARD_LOCKS_PREFIX}${boardId}`;
}

async function acquireBoardLock(boardId: string, userId: string): Promise<boolean> {
  try {
    const result = await cacheClient.set(
      getBoardLockKey(boardId),
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

async function releaseBoardLock(boardId: string, userId: string): Promise<void> {
  try {
    const val = await cacheClient.get(getBoardLockKey(boardId));
    if (val === userId) {
      await cacheClient.del(getBoardLockKey(boardId));
    }
  } catch {
  }
}

export async function getBoardState(
  boardId: string
): Promise<Record<string, unknown> | null> {
  try {
    const raw = await cacheClient.get(getBoardStateKey(boardId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function setBoardState(
  boardId: string,
  state: Record<string, unknown>
): Promise<void> {
  try {
    await cacheClient.set(getBoardStateKey(boardId), JSON.stringify(state), 'EX', 86400);
  } catch {
  }
}

export function registerTaskboardHandlers(
  io: Server,
  socket: AuthenticatedSocket
): void {
  const { userId } = socket.data;

  socket.on('board:sync', async (data: { boardId: string; projectId: string }) => {
    try {
      const { boardId, projectId } = data;
      const projRoom = `project:${projectId}`;
      socket.join(projRoom);

      const state = await getBoardState(boardId);
      socket.emit('board:sync', state || { boardId, columns: [], tasks: [] });
    } catch (err) {
      console.error(`[TaskBoard] Error syncing board ${data.boardId}:`, err);
      socket.emit('error', {
        message: 'Failed to sync board',
        code: 'BOARD_SYNC_FAILED',
      });
    }
  });

  socket.on('board:move', async (update: TaskBoardUpdate) => {
    try {
      const { boardId, projectId, taskId, fromColumn, toColumn, fromIndex, toIndex } = update;
      const projRoom = `project:${projectId}`;

      const lockAcquired = await acquireBoardLock(boardId, userId);
      if (!lockAcquired) {
        socket.emit('error', {
          message: 'Board is being updated by another user',
          code: 'BOARD_LOCKED',
        });
        return;
      }

      try {
        const broadcast: TaskBoardUpdate = {
          boardId,
          projectId,
          taskId,
          action: 'move',
          fromColumn,
          toColumn,
          fromIndex,
          toIndex,
          userId,
          timestamp: Date.now(),
        };

        socket.to(projRoom).emit('board:update', broadcast);

        await cacheClient.set(
          `board:lastmove:${boardId}`,
          JSON.stringify({ taskId, fromColumn, toColumn, fromIndex, toIndex, userId }),
          'EX',
        60
        );
      } finally {
        await releaseBoardLock(boardId, userId);
      }
    } catch (err) {
      console.error(`[TaskBoard] Error moving task:`, err);
      socket.emit('error', {
        message: 'Failed to move task',
        code: 'BOARD_MOVE_FAILED',
      });
    }
  });

  socket.on('board:update', async (update: TaskBoardUpdate) => {
    try {
      const { boardId, projectId, taskId, updates, action } = update;
      const projRoom = `project:${projectId}`;

      const broadcast: TaskBoardUpdate = {
        boardId,
        projectId,
        taskId,
        action: action || 'update',
        updates,
        userId,
        timestamp: Date.now(),
      };

      socket.to(projRoom).emit('board:update', broadcast);

      if (updates) {
        await cacheClient.set(
          `board:lastupdate:${boardId}:${taskId}`,
          JSON.stringify({ updates, userId }),
          'EX',
          3600
        );
      }
    } catch (err) {
      console.error(`[TaskBoard] Error updating task:`, err);
      socket.emit('error', {
        message: 'Failed to update task on board',
        code: 'BOARD_UPDATE_FAILED',
      });
    }
  });
}
