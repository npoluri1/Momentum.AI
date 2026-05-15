import type { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';
import { AppError } from './error_handler.js';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (!config.auth.enabled) {
    return next();
  }

  const apiKey = req.headers[config.auth.apiKeyHeader.toLowerCase()] as string | undefined;
  const authHeader = req.headers.authorization;

  if (apiKey && apiKey === config.auth.apiKey) {
    return next();
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    if (token === config.auth.jwtSecret || token === config.auth.apiKey) {
      return next();
    }
  }

  next(new AppError(401, 'Authentication required', 'UNAUTHORIZED'));
}

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!config.auth.enabled) {
      return next();
    }

    const userRole = (req as Record<string, unknown>).userRole as string | undefined;

    if (!userRole || !roles.includes(userRole)) {
      next(new AppError(403, 'Insufficient permissions', 'FORBIDDEN'));
      return;
    }

    next();
  };
}
