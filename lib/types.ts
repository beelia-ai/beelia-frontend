/**
 * Shared TypeScript types for Beelia.ai frontend
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  price: number;
  imageUrl?: string;
  demoUrl?: string;
  sellerId: string;
  seller?: User;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  toolId: string;
  tool?: Tool;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  user?: User;
  toolId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  toolId: string;
  tool?: Tool;
  createdAt: string;
}

export type ToolCategory = 
  | 'IMAGE_GENERATION'
  | 'TEXT_GENERATION'
  | 'CODE_GENERATION'
  | 'AUDIO_GENERATION'
  | 'VIDEO_GENERATION'
  | 'DATA_ANALYSIS'
  | 'AUTOMATION'
  | 'OTHER';
