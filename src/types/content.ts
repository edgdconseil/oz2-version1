
import { UserRole } from './user';

export interface Menu {
  id: string;
  name: string;
  clientId: string;
  items: string[]; // Array of product IDs (food only)
}

export type NewsType = 'info' | 'offer' | 'announcement';
export type NewsStatus = 'pending' | 'approved' | 'rejected';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: NewsType;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  createdAt: string;
  expiresAt?: string;
  imageUrl?: string;
  relatedProductIds?: string[];
  visibleToRoles: UserRole[];
  status: NewsStatus; // New field for approval status
  rejectionReason?: string; // Optional reason for rejection
}

// New types for Recipe Management
export interface RecipeIngredient {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  servings: number;
  prepTime: number; // In minutes
  cookTime: number; // In minutes
  ingredients: RecipeIngredient[];
  instructions: string[];
  imageUrl?: string;
  tags: string[];
  createdBy: string;
  createdByName: string;
}
