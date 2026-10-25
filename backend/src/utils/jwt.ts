import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface JwtPayload {
  userId: string;
  role: 'client' | 'admin';
}

export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  return jwt.verify(token, secret) as JwtPayload;
};
