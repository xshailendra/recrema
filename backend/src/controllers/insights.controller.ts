import { Request, Response } from 'express';
import { InsightsService } from '../services/insights.service';
import { sendSuccess, sendError } from '../utils/apiResponse';
import {
  insightsQuerySchema,
  insightsTrendsQuerySchema,
  insightsContributorsQuerySchema,
} from '../validations/insights.validation';

export const getSummary = async (req: Request, res: Response) => {
  try {
    const parsed = insightsQuerySchema.safeParse(req);
    if (!parsed.success) {
      return sendError(res, 'VALIDATION_ERROR', 'Invalid query parameters', 400, parsed.error.issues);
    }

    const filters = parsed.data.query;
    const summary = await InsightsService.getSummary(filters);

    return sendSuccess(res, summary);
  } catch (error) {
    return sendError(res, 'INTERNAL_ERROR', 'Failed to calculate insights summary', 500);
  }
};

export const getTrends = async (req: Request, res: Response) => {
  try {
    const parsed = insightsTrendsQuerySchema.safeParse(req);
    if (!parsed.success) {
      return sendError(res, 'VALIDATION_ERROR', 'Invalid period', 400, parsed.error.issues);
    }

    const { period } = parsed.data.query;
    const data = await InsightsService.getTrends(period);

    return res.status(200).json({
      success: true,
      period,
      data,
    });
  } catch (error) {
    return sendError(res, 'INTERNAL_ERROR', 'Failed to retrieve trends', 500);
  }
};

export const getContributors = async (req: Request, res: Response) => {
  try {
    const parsed = insightsContributorsQuerySchema.safeParse(req);
    if (!parsed.success) {
      return sendError(res, 'VALIDATION_ERROR', 'Invalid limit parameter', 400, parsed.error.issues);
    }

    const { limit } = parsed.data.query;
    const contributors = await InsightsService.getContributors(limit);

    return sendSuccess(res, contributors);
  } catch (error) {
    return sendError(res, 'INTERNAL_ERROR', 'Failed to retrieve top contributors', 500);
  }
};
