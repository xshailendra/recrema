import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { sendSuccess, sendError } from '../utils/apiResponse';
import {
  adminWasteQuerySchema,
  createPartnerSchema,
  partnerQuerySchema,
  partnerStatusSchema,
  rejectWasteSchema,
  resetPartnerPasswordSchema,
  updatePartnerSchema,
} from '../validations/admin.validation';

export const getPendingEntries = async (req: Request, res: Response) => {
  try {
    const parsed = adminWasteQuerySchema.safeParse(req);
    if (!parsed.success) return sendError(res, 'VALIDATION_ERROR', 'Invalid queries', 400, parsed.error.issues);

    const { page, limit, startDate, endDate, clientId } = parsed.data.query;
    
    // Force status to pending for this specific endpoint
    const result = await AdminService.getWasteEntries({ status: 'pending', page, limit, startDate, endDate, clientId });

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages },
    });
  } catch (error) {
    return sendError(res, 'INTERNAL_ERROR', 'Failed to retrieve pending entries', 500);
  }
};

export const getAllEntries = async (req: Request, res: Response) => {
  try {
    const parsed = adminWasteQuerySchema.safeParse(req);
    if (!parsed.success) return sendError(res, 'VALIDATION_ERROR', 'Invalid queries', 400, parsed.error.issues);

    const filters = parsed.data.query;
    const result = await AdminService.getWasteEntries(filters);

    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages },
    });
  } catch (error) {
    return sendError(res, 'INTERNAL_ERROR', 'Failed to retrieve all entries', 500);
  }
};

export const approveEntry = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.userId;
    if (!adminId) return sendError(res, 'UNAUTHORIZED', 'Admin ID not found', 401);

    const entryId = req.params.id;
    const entry = await AdminService.approveEntry(entryId, adminId);
    
    return sendSuccess(res, entry);
  } catch (error: any) {
    if (error.message === 'INVALID_ID') return sendError(res, 'VALIDATION_ERROR', 'Invalid entry ID format', 400);
    if (error.message === 'NOT_FOUND') return sendError(res, 'NOT_FOUND', 'Entry not found', 404);
    if (error.message === 'NOT_PENDING') return sendError(res, 'CONFLICT', 'Entry is already approved or rejected', 409);
    
    return sendError(res, 'INTERNAL_ERROR', 'Failed to approve entry', 500);
  }
};

export const rejectEntry = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.userId;
    if (!adminId) return sendError(res, 'UNAUTHORIZED', 'Admin ID not found', 401);

    const parsed = rejectWasteSchema.safeParse(req);
    if (!parsed.success) return sendError(res, 'VALIDATION_ERROR', 'Invalid payload', 400, parsed.error.issues);

    const entryId = req.params.id;
    const { rejectionReason } = parsed.data.body;

    const entry = await AdminService.rejectEntry(entryId, adminId, rejectionReason);
    
    return sendSuccess(res, entry);
  } catch (error: any) {
    if (error.message === 'INVALID_ID') return sendError(res, 'VALIDATION_ERROR', 'Invalid entry ID format', 400);
    if (error.message === 'NOT_FOUND') return sendError(res, 'NOT_FOUND', 'Entry not found', 404);
    if (error.message === 'NOT_PENDING') return sendError(res, 'CONFLICT', 'Entry is already approved or rejected', 409);

    return sendError(res, 'INTERNAL_ERROR', 'Failed to reject entry', 500);
  }
};

export const createPartner = async (req: Request, res: Response) => {
  try {
    const parsed = createPartnerSchema.safeParse(req);
    if (!parsed.success) return sendError(res, 'VALIDATION_ERROR', 'Invalid partner payload', 400, parsed.error.issues);
    const adminId = req.user?.userId;
    if (!adminId) return sendError(res, 'UNAUTHORIZED', 'Admin ID not found', 401);

    const partner = await AdminService.createPartner(parsed.data.body, adminId);
    return sendSuccess(res, partner, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'DUPLICATE_EMAIL') {
      return sendError(res, 'DUPLICATE_EMAIL', 'Email is already in use', 409);
    }
    if (error instanceof Error && error.message === 'DUPLICATE_CLIENT_CODE') {
      return sendError(res, 'DUPLICATE_CLIENT_CODE', 'Client code is already in use', 409);
    }
    return sendError(res, 'INTERNAL_ERROR', 'Failed to create partner', 500);
  }
};

export const getPartners = async (req: Request, res: Response) => {
  try {
    const parsed = partnerQuerySchema.safeParse(req);
    if (!parsed.success) return sendError(res, 'VALIDATION_ERROR', 'Invalid partner query', 400, parsed.error.issues);
    const result = await AdminService.getPartners({
      ...parsed.data.query,
      active: parsed.data.query.active === undefined ? undefined : parsed.data.query.active === 'true',
    });
    return res.status(200).json({
      success: true,
      data: result.data,
      pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages },
    });
  } catch {
    return sendError(res, 'INTERNAL_ERROR', 'Failed to retrieve partners', 500);
  }
};

export const getPartner = async (req: Request, res: Response) => {
  try {
    const partner = await AdminService.getPartner(req.params.id);
    return sendSuccess(res, partner);
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_ID') return sendError(res, 'VALIDATION_ERROR', 'Invalid partner ID format', 400);
    if (error instanceof Error && error.message === 'NOT_FOUND') return sendError(res, 'NOT_FOUND', 'Partner not found', 404);
    return sendError(res, 'INTERNAL_ERROR', 'Failed to retrieve partner', 500);
  }
};

export const updatePartner = async (req: Request, res: Response) => {
  try {
    const parsed = updatePartnerSchema.safeParse(req);
    if (!parsed.success) return sendError(res, 'VALIDATION_ERROR', 'Invalid partner payload', 400, parsed.error.issues);
    const adminId = req.user?.userId;
    if (!adminId) return sendError(res, 'UNAUTHORIZED', 'Admin ID not found', 401);
    const partner = await AdminService.updatePartner(req.params.id, parsed.data.body, adminId);
    return sendSuccess(res, partner);
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_ID') return sendError(res, 'VALIDATION_ERROR', 'Invalid partner ID format', 400);
    if (error instanceof Error && error.message === 'NOT_FOUND') return sendError(res, 'NOT_FOUND', 'Partner not found', 404);
    if (error instanceof Error && error.message === 'DUPLICATE_EMAIL') return sendError(res, 'DUPLICATE_EMAIL', 'Email is already in use', 409);
    if (error instanceof Error && error.message === 'DUPLICATE_CLIENT_CODE') return sendError(res, 'DUPLICATE_CLIENT_CODE', 'Client code is already in use', 409);
    return sendError(res, 'INTERNAL_ERROR', 'Failed to update partner', 500);
  }
};

export const removePartner = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.userId;
    if (!adminId) return sendError(res, 'UNAUTHORIZED', 'Admin ID not found', 401);
    const partner = await AdminService.removePartner(req.params.id, adminId);
    return sendSuccess(res, partner);
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_ID') return sendError(res, 'VALIDATION_ERROR', 'Invalid partner ID format', 400);
    if (error instanceof Error && error.message === 'CANNOT_DELETE_SELF') return sendError(res, 'FORBIDDEN', 'You cannot remove your own admin account', 403);
    if (error instanceof Error && error.message === 'NOT_FOUND') return sendError(res, 'NOT_FOUND', 'Partner not found', 404);
    return sendError(res, 'INTERNAL_ERROR', 'Failed to remove partner', 500);
  }
};

export const updatePartnerStatus = async (req: Request, res: Response) => {
  try {
    const parsed = partnerStatusSchema.safeParse(req);
    if (!parsed.success) return sendError(res, 'VALIDATION_ERROR', 'Invalid status payload', 400, parsed.error.issues);
    const adminId = req.user?.userId;
    if (!adminId) return sendError(res, 'UNAUTHORIZED', 'Admin ID not found', 401);
    const partner = await AdminService.updatePartnerStatus(req.params.id, parsed.data.body.isActive, adminId);
    return sendSuccess(res, partner);
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_ID') return sendError(res, 'VALIDATION_ERROR', 'Invalid partner ID format', 400);
    if (error instanceof Error && error.message === 'NOT_FOUND') return sendError(res, 'NOT_FOUND', 'Partner not found', 404);
    return sendError(res, 'INTERNAL_ERROR', 'Failed to update partner status', 500);
  }
};

export const resetPartnerPassword = async (req: Request, res: Response) => {
  try {
    const parsed = resetPartnerPasswordSchema.safeParse(req);
    if (!parsed.success) return sendError(res, 'VALIDATION_ERROR', 'Invalid password payload', 400, parsed.error.issues);
    const adminId = req.user?.userId;
    if (!adminId) return sendError(res, 'UNAUTHORIZED', 'Admin ID not found', 401);
    await AdminService.resetPartnerPassword(req.params.id, parsed.data.body.password, adminId);
    return sendSuccess(res, { message: 'Partner password reset successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_ID') return sendError(res, 'VALIDATION_ERROR', 'Invalid partner ID format', 400);
    if (error instanceof Error && error.message === 'NOT_FOUND') return sendError(res, 'NOT_FOUND', 'Partner not found', 404);
    return sendError(res, 'INTERNAL_ERROR', 'Failed to reset partner password', 500);
  }
};
