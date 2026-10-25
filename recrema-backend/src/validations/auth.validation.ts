import { z } from 'zod';

export const passwordSchema = z.string().min(1, 'Password is required');

export const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(1, 'Email or Client Code is required'),
    password: passwordSchema,
  }),
});
