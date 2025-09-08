
import { createContext, useContext, useState, ReactNode } from 'react';
import { NewsItem } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { NewsContextProps } from './types';
import { mockNewsItems } from './mockData';
import { 
  getNewsByRole, 
  getPendingNews as getPendingNewsUtil, 
  getNewsById as getNewsByIdUtil,
  createNewsItem,
  calculateUpdatedStatus
} from './newsUtils';

// Create the context with a default value
const NewsContext = createContext<NewsContextProps | undefined>(undefined);

// Custom hook to use the news context
export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

interface NewsProviderProps {
  children: ReactNode;
}

// Main news provider component
export const NewsProvider = ({ children }: NewsProviderProps) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(mockNewsItems);
  const { toast } = useToast();

  // Get news filtered by user role (client, supplier, admin)
  const getNewsByRoleHandler = (role: typeof newsItems[number]['authorRole']) => {
    return getNewsByRole(newsItems, role);
  };

  // Get pending news items for admin approval
  const getPendingNewsHandler = () => {
    return getPendingNewsUtil(newsItems);
  };

  // Get a specific news item by ID
  const getNewsByIdHandler = (id: string) => {
    return getNewsByIdUtil(newsItems, id);
  };

  // Add a new news item
  const addNewsItem = (news: Omit<NewsItem, 'id' | 'createdAt' | 'status'>) => {
    const newItem = createNewsItem(news);
    
    setNewsItems(prevItems => [newItem, ...prevItems]);
    
    // Adapter le message en fonction du statut
    if (newItem.status === 'approved') {
      toast({
        title: "Actualité publiée",
        description: "Votre actualité a été publiée avec succès."
      });
    } else {
      toast({
        title: "Actualité en attente de validation",
        description: "Votre actualité a été soumise et sera publiée après validation par un administrateur."
      });
    }
  };

  // Update an existing news item
  const updateNewsItem = (id: string, updates: Partial<NewsItem>) => {
    setNewsItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newStatus = calculateUpdatedStatus(item, updates);
          
          return { 
            ...item, 
            ...updates,
            status: newStatus
          };
        }
        return item;
      })
    );
    
    toast({
      title: "Actualité mise à jour",
      description: "Les modifications ont été enregistrées."
    });
  };

  // Delete a news item
  const deleteNewsItem = (id: string) => {
    setNewsItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({
      title: "Actualité supprimée",
      description: "L'actualité a été supprimée avec succès."
    });
  };

  // Approve a pending news item
  const approveNewsItem = (id: string) => {
    setNewsItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, status: 'approved', rejectionReason: undefined } 
          : item
      )
    );
    toast({
      title: "Actualité approuvée",
      description: "L'actualité a été approuvée et est maintenant publiée."
    });
  };

  // Reject a news item with a reason
  const rejectNewsItem = (id: string, reason: string) => {
    setNewsItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, status: 'rejected', rejectionReason: reason } 
          : item
      )
    );
    toast({
      title: "Actualité rejetée",
      description: "L'actualité a été rejetée avec le motif fourni."
    });
  };

  return (
    <NewsContext.Provider
      value={{
        newsItems,
        getNewsByRole: getNewsByRoleHandler,
        getPendingNews: getPendingNewsHandler,
        getNewsById: getNewsByIdHandler,
        addNewsItem,
        updateNewsItem,
        deleteNewsItem,
        approveNewsItem,
        rejectNewsItem,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};
