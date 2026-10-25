import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import wasteRoutes from './routes/waste.routes';
import adminRoutes from './routes/admin.routes';
import insightsRoutes from './routes/insights.routes';
import { sendError, sendSuccess } from './utils/apiResponse';

const app = express();

// 1. Security Middleware
app.use(helmet());

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

app.set('trust proxy', 1);

// 2. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
    },
  },
});

app.use(limiter);

// 3. Body Parsing Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 4. Routes
// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  
  res.status(isDbConnected ? 200 : 503).json({
    success: isDbConnected,
    message: 'Recrema API is running',
    database: isDbConnected ? 'connected' : 'disconnected',
  });
});

app.get('/api/v1/health', (_req: Request, res: Response) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  if (!isDbConnected) {
    return sendError(res, 'SERVICE_UNAVAILABLE', 'Database connection unavailable', 503);
  }

  return sendSuccess(res, {
    status: 'healthy',
    api: 'up',
    database: 'connected',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Example route setup (to be implemented in future phases)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/waste', wasteRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/insights', insightsRoutes);

// 5. Error Handling
// 404 Not Found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot find ${req.method} ${req.originalUrl}`,
    },
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : message,
      details: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    },
  });
});

export default app;
