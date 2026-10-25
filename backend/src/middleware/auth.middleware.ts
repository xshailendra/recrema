import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { sendError } from '../utils/apiResponse';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookieName = process.env.COOKIE_NAME || 'recrema_token';
    const token = req.cookies[cookieName];

    if (!token) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
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
