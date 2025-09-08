
import { NewsItem, NewsType, UserRole, NewsStatus } from '@/types';

export interface NewsContextProps {
  newsItems: NewsItem[];
  getNewsByRole: (role: UserRole) => NewsItem[];
  getPendingNews: () => NewsItem[];
  getNewsById: (id: string) => NewsItem | undefined;
  addNewsItem: (news: Omit<NewsItem, 'id' | 'createdAt' | 'status'>) => void;
  updateNewsItem: (id: string, updates: Partial<NewsItem>) => void;
  deleteNewsItem: (id: string) => void;
  approveNewsItem: (id: string) => void;
  rejectNewsItem: (id: string, reason: string) => void;
}
