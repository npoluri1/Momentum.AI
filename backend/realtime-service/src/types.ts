import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    email: string;
    name: string;
    roles: string[];
    workspaceIds: string[];
    projectIds: string[];
  };
}

export interface CollaborationEvent {
  event:
    | 'doc:edit'
    | 'doc:join'
    | 'doc:leave'
    | 'cursor:move'
    | 'presence:online'
    | 'presence:offline'
    | 'presence:typing'
    | 'chat:message'
    | 'chat:history'
    | 'notification:new'
    | 'notification:read'
    | 'board:move'
    | 'board:update'
    | 'board:sync';
  room: string;
  timestamp: number;
  payload: unknown;
}

export interface DocumentChange {
  docId: string;
  projectId: string;
  version: number;
  ops: Record<string, unknown>[];
  userId: string;
  timestamp: number;
}

export interface CursorPosition {
  docId: string;
  userId: string;
  userName: string;
  position: { line: number; ch: number };
  selection?: { start: { line: number; ch: number }; end: { line: number; ch: number } };
  timestamp: number;
}

export interface PresenceUpdate {
  userId: string;
  name: string;
  email: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  workspaceId?: string;
  projectId?: string;
  lastActive: number;
}

export interface TypingIndicator {
  userId: string;
  name: string;
  room: string;
  isTyping: boolean;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  room: string;
  roomType: 'workspace' | 'project' | 'direct';
  fromUserId: string;
  fromName: string;
  content: string;
  mentions?: string[];
  attachments?: { name: string; url: string; type: string }[];
  replyTo?: string;
  timestamp: number;
  editedAt?: number;
}

export interface Notification {
  id: string;
  type: 'mention' | 'task_assigned' | 'workflow_completed' | 'deal_update' | 'comment' | 'due_date';
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  timestamp: number;
  projectId?: string;
  workspaceId?: string;
}

export interface TaskBoardUpdate {
  boardId: string;
  projectId: string;
  taskId: string;
  action: 'move' | 'update' | 'create' | 'delete';
  fromColumn?: string;
  toColumn?: string;
  fromIndex?: number;
  toIndex?: number;
  updates?: Record<string, unknown>;
  userId: string;
  timestamp: number;
}

export interface ServerToClientEvents {
  'doc:edit': (change: DocumentChange) => void;
  'doc:ack': (data: { docId: string; version: number }) => void;
  'cursor:move': (cursor: CursorPosition) => void;
  'presence:update': (presence: PresenceUpdate) => void;
  'presence:typing': (indicator: TypingIndicator) => void;
  'presence:list': (users: PresenceUpdate[]) => void;
  'chat:message': (message: ChatMessage) => void;
  'chat:history': (messages: ChatMessage[]) => void;
  'chat:edited': (data: { messageId: string; content: string; editedAt: number }) => void;
  'notification:new': (notification: Notification) => void;
  'notification:list': (notifications: Notification[]) => void;
  'notification:unread_count': (count: number) => void;
  'board:update': (update: TaskBoardUpdate) => void;
  'board:sync': (state: Record<string, unknown>) => void;
  'error': (error: { message: string; code: string }) => void;
}

export interface ClientToServerEvents {
  'doc:edit': (change: DocumentChange) => void;
  'cursor:move': (cursor: CursorPosition) => void;
  'presence:online': (data: { workspaceId?: string; projectId?: string }) => void;
  'presence:typing': (indicator: Omit<TypingIndicator, 'timestamp'>) => void;
  'chat:send': (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  'chat:history': (data: { room: string; limit?: number }) => void;
  'chat:edit': (data: { messageId: string; content: string }) => void;
  'chat:mark_read': (data: { room: string }) => void;
  'notification:list': (data: { limit?: number; offset?: number }) => void;
  'notification:read': (data: { notificationId: string }) => void;
  'notification:read_all': () => void;
  'board:move': (update: TaskBoardUpdate) => void;
  'board:update': (update: TaskBoardUpdate) => void;
  'board:sync': (data: { boardId: string; projectId: string }) => void;
  'room:join': (data: { room: string }) => void;
  'room:leave': (data: { room: string }) => void;
}
