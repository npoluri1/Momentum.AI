import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { config } from './config';

export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
  roles: string[];
  workspaceIds: string[];
  projectIds: string[];
  iat?: number;
  exp?: number;
}

export function authMiddleware(socket: Socket, next: (err?: Error) => void): void {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '');

    if (!token || typeof token !== 'string') {
      return next(new Error('Authentication required: no token provided'));
    }

    const decoded = jwt.verify(token, config.jwt.secret, {
      algorithms: config.jwt.algorithms as jwt.Algorithm[],
    }) as TokenPayload;

    socket.data.userId = decoded.sub;
    socket.data.email = decoded.email;
    socket.data.name = decoded.name;
    socket.data.roles = decoded.roles || [];
    socket.data.workspaceIds = decoded.workspaceIds || [];
    socket.data.projectIds = decoded.projectIds || [];

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new Error('Token expired'));
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new Error('Invalid token'));
    }
    next(new Error('Authentication failed'));
  }
}

export function verifyRoomAccess(
  socket: Socket,
  room: string,
  _action?: string
): boolean {
  const parts = room.split(':');
  if (parts.length < 2) return true;

  const [type, id] = parts;

  switch (type) {
    case 'workspace':
      return socket.data.workspaceIds?.includes(id) ?? false;
    case 'project':
      return socket.data.projectIds?.includes(id) ?? false;
    case 'direct':
      return (
        id === socket.data.userId ||
        id.split('_').includes(socket.data.userId)
      );
    case 'user':
      return id === socket.data.userId;
    default:
      return true;
  }
}
