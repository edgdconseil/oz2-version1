
import { NewsItem, UserRole, NewsStatus } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Get news filtered by user role
export const getNewsByRole = (newsItems: NewsItem[], role: UserRole) => {
  // Pour les clients, on ne montre que les actualités approuvées
  if (role === 'client') {
    return newsItems
      .filter(news => news.visibleToRoles.includes(role) && news.status === 'approved')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  // Pour les fournisseurs, on montre leurs propres actualités (tous statuts) + les approuvées visibles pour eux
  if (role === 'supplier') {
    return newsItems
      .filter(news => 
        (news.authorRole === 'supplier' && news.visibleToRoles.includes(role) && news.status === 'approved') || 
        news.authorRole === role
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  // Pour les admins, on montre tout
  return newsItems
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Get pending news for admin approval
export const getPendingNews = (newsItems: NewsItem[]) => {
  return newsItems
    .filter(news => news.status === 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Find a specific news item by ID
export const getNewsById = (newsItems: NewsItem[], id: string) => {
  return newsItems.find(news => news.id === id);
};

// Create a new news item
export const createNewsItem = (
  news: Omit<NewsItem, 'id' | 'createdAt' | 'status'>,
): NewsItem => {
  return {
    ...news,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    status: news.authorRole === 'admin' ? 'approved' : 'pending', // Les admins publient directement, les fournisseurs doivent être validés
  };
};

// Calculate status when updating a news item
export const calculateUpdatedStatus = (
  item: NewsItem,
  updates: Partial<NewsItem>
): NewsStatus => {
  // Si c'est un fournisseur qui modifie une actualité déjà approuvée, elle repasse en attente
  if (
    item.authorRole === 'supplier' && 
    item.status === 'approved' && 
    (updates.title || updates.content || updates.type)
  ) {
    return 'pending';
  }
  
  return updates.status || item.status;
};
