import { z } from 'zod';

export const insightsQuerySchema = z.object({
  query: z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    year: z.coerce.number().int().min(2000).max(2100).optional(),
    month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format').optional(),
  }).passthrough(),
});

export const insightsTrendsQuerySchema = z.object({
  query: z.object({
    period: z.enum(['monthly', 'yearly']),
  }).passthrough(),
});

export const insightsContributorsQuerySchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }).passthrough(),
});
