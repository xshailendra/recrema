import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { generateToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { loginSchema } from '../validations/auth.validation';
import { User } from '../models/User';

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req);
    if (!parsed.success) {
      return sendError(res, 'VALIDATION_ERROR', 'Invalid request', 400, parsed.error.issues);
    }

    const { identifier, password } = parsed.data.body;

    const user = await AuthService.login(identifier, password);

    if (!user) {
      return sendError(res, 'UNAUTHORIZED', 'Invalid credentials', 401);
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const cookieName = process.env.COOKIE_NAME || 'recrema_token';
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return sendSuccess(res, { user });
  } catch {
    return sendError(res, 'INTERNAL_ERROR', 'An error occurred during login', 500);
  }
};

export const logout = (req: Request, res: Response) => {
  const cookieName = process.env.COOKIE_NAME || 'recrema_token';
  
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  return sendSuccess(res, { message: 'Logged out successfully' });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return sendError(res, 'UNAUTHORIZED', 'User not found in request', 401);
    }

    const user = await User.findById(userId);

    if (!user || !user.isActive) {
      return sendError(res, 'UNAUTHORIZED', 'User not found or inactive', 401);
    }

    return sendSuccess(res, { user });
  } catch (error) {
    return sendError(res, 'INTERNAL_ERROR', 'Failed to get user profile', 500);
  }
};
