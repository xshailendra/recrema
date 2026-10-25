import { z } from 'zod';

export const createWasteSchema = z.object({
  body: z.object({
    quantityKg: z
      .number()
      .positive('Quantity must be greater than 0')
      .finite('Quantity must be a finite number'),
    wasteDate: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
      message: 'Invalid date format',
    }),
    notes: z
      .string()
      .trim()
      .max(2000, 'Notes cannot exceed 2000 characters')
      .optional(),
  })
  // strict() ensures that any extra fields (like clientId, status, approvedBy) are completely rejected.
  .strict(),
});

export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }).passthrough(),
});
