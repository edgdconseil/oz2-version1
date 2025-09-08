
import { z } from 'zod';
import { NewsItem, NewsType, UserRole } from '@/types';

// Schéma de validation pour le formulaire d'actualité
export const newsFormSchema = z.object({
  title: z.string()
    .min(3, { message: 'Le titre doit contenir au moins 3 caractères' })
    .max(100, { message: 'Le titre ne peut pas dépasser 100 caractères' }),
  content: z.string()
    .min(10, { message: 'Le contenu doit contenir au moins 10 caractères' }),
  type: z.enum(['info', 'announcement', 'offer'] as const),
  expiresAt: z.string().optional(),
  visibleToClient: z.boolean(),
  visibleToSupplier: z.boolean(),
  visibleToAdmin: z.boolean(),
  imageUrl: z.string().optional(),
});

// Type pour les valeurs du formulaire
export type NewsFormValues = z.infer<typeof newsFormSchema>;

// Fonction pour convertir les données du formulaire en données d'actualité
export const convertFormToNewsData = (
  formData: NewsFormValues,
  authorId: string,
  authorName: string,
  authorRole: UserRole
): Omit<NewsItem, 'id' | 'createdAt' | 'status'> => {
  const visibleToRoles: UserRole[] = [];
  if (formData.visibleToClient) visibleToRoles.push('client');
  if (formData.visibleToSupplier) visibleToRoles.push('supplier');
  if (formData.visibleToAdmin) visibleToRoles.push('admin');

  return {
    title: formData.title,
    content: formData.content,
    type: formData.type as NewsType,
    expiresAt: formData.expiresAt || undefined,
    visibleToRoles,
    authorId,
    authorName,
    authorRole,
    imageUrl: formData.imageUrl || undefined
  };
};

// Fonction pour convertir les données d'actualité en données de formulaire
export const convertNewsToFormData = (news: NewsItem): NewsFormValues => {
  return {
    title: news.title,
    content: news.content,
    type: news.type,
    expiresAt: news.expiresAt || '',
    visibleToClient: news.visibleToRoles.includes('client'),
    visibleToSupplier: news.visibleToRoles.includes('supplier'),
    visibleToAdmin: news.visibleToRoles.includes('admin'),
    imageUrl: news.imageUrl || ''
  };
};
