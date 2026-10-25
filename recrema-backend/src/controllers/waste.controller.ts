import { Request, Response } from 'express';
import { WasteService } from '../services/waste.service';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { createWasteSchema, paginationSchema } from '../validations/waste.validation';

export const createWasteEntry = async (req: Request, res: Response) => {
  try {
    const parsed = createWasteSchema.safeParse(req);
    if (!parsed.success) {
      return sendError(res, 'VALIDATION_ERROR', 'Invalid request', 400, parsed.error.issues);
    }

    const clientId = req.user?.userId;
    if (!clientId) {
      return sendError(res, 'UNAUTHORIZED', 'User ID not found', 401);
    }

    const entry = await WasteService.createEntry(clientId, parsed.data.body);

    return sendSuccess(res, entry, 201);
  } catch (error) {
    return sendError(res, 'INTERNAL_ERROR', 'Failed to create waste entry', 500);
  }
};

export const getMyWasteEntries = async (req: Request, res: Response) => {
  try {
    const parsed = paginationSchema.safeParse(req);
    if (!parsed.success) {
      return sendError(res, 'VALIDATION_ERROR', 'Invalid pagination parameters', 400, parsed.error.issues);
    }

    const clientId = req.user?.userId;
    if (!clientId) {
      return sendError(res, 'UNAUTHORIZED', 'User ID not found', 401);
    }

    const { page, limit } = parsed.data.query;

    const result = await WasteService.getClientEntries(clientId, page, limit);

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    return sendError(res, 'INTERNAL_ERROR', 'Failed to retrieve waste entries', 500);
  }
};

export const getMyWasteEntryById = async (req: Request, res: Response) => {
  try {
    const clientId = req.user?.userId;
    const entryId = req.params.id;

    if (!clientId) {
      return sendError(res, 'UNAUTHORIZED', 'User ID not found', 401);
    }

    const entry = await WasteService.getClientEntryById(clientId, entryId);

    if (!entry) {
      return sendError(res, 'NOT_FOUND', 'Entry not found', 404);
    }

    return sendSuccess(res, entry);
  } catch (error) {
    return sendError(res, 'INTERNAL_ERROR', 'Failed to retrieve waste entry', 500);
  }
};
