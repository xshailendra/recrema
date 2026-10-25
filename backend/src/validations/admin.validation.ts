import { z } from 'zod';
import { passwordSchema } from './auth.validation';

export const rejectWasteSchema = z.object({
  body: z.object({
    rejectionReason: z
      .string()
      .trim()
      .min(1, 'Rejection reason is required')
      .max(1000, 'Reason cannot exceed 1000 characters'),
  }).strict(),
});

export const adminWasteQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
    clientId: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }).passthrough(),
});

const partnerFields = {
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('A valid email is required').max(320),
  clientCode: z.string().trim().min(1, 'Client code is required').max(100),
};

export const createPartnerSchema = z.object({
  body: z.object({
    ...partnerFields,
    password: passwordSchema,
  }).strict(),
});

export const updatePartnerSchema = z.object({
  body: z.object({
    name: partnerFields.name.optional(),
    email: partnerFields.email.optional(),
    clientCode: partnerFields.clientCode.optional(),
    password: passwordSchema.optional(),
  }).strict().refine((value) => Object.keys(value).length > 0, 'At least one partner field is required'),
});

export const partnerQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().max(200).optional(),
    active: z.enum(['true', 'false']).optional(),
  }).passthrough(),
});

export const partnerStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }).strict(),
});

export const resetPartnerPasswordSchema = z.object({
  body: z.object({
    password: passwordSchema,
  }).strict(),
});
