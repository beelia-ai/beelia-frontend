/**
 * Zod validation schemas for forms and API requests
 */

import { z } from 'zod';

// Auth schemas
export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['BUYER', 'SELLER']).default('BUYER'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Tool schemas
export const createToolSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  longDescription: z.string().optional(),
  category: z.enum([
    'IMAGE_GENERATION',
    'TEXT_GENERATION',
    'CODE_GENERATION',
    'AUDIO_GENERATION',
    'VIDEO_GENERATION',
    'DATA_ANALYSIS',
    'AUTOMATION',
    'OTHER',
  ]),
  price: z.number().min(0, 'Price must be positive'),
  imageUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
});

// Review schemas
export const createReviewSchema = z.object({
  toolId: z.string().cuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters').optional(),
});

// Type exports
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type CreateToolInput = z.infer<typeof createToolSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
