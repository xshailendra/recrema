import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { sendError } from '../utils/apiResponse';
import mongoose from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const cookieName = process.env.COOKIE_NAME || 'recrema_token';
  const cookies = req.cookies || {};
  const token = cookies[cookieName];

  if (!token) {
    console.warn('[AUTH DEBUG] Authentication cookie missing', {
      cookieNames: Object.keys(cookies),
      expectedCookieName: cookieName,
      hasToken: false,
      hasCookieHeader: Boolean(req.headers.cookie),
      databaseReadyState: mongoose.connection.readyState,
    });
    return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.warn('[AUTH DEBUG] Token verification failed', {
      errorName: error instanceof Error ? error.name : 'UnknownError',
      errorMessage: error instanceof Error ? error.message : 'Unknown token verification error',
      databaseReadyState: mongoose.connection.readyState,
    });
    return sendError(res, 'UNAUTHORIZED', 'Invalid or expired token', 401);
  }
};

export const requireRole = (roles: Array<'client' | 'admin'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'FORBIDDEN', 'You do not have permission to perform this action', 403);
    }

    next();
  };
};
