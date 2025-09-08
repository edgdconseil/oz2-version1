import React, { createContext, useContext, useState, useEffect } from 'react';
import { addDays, addMonths, isAfter, isBefore, startOfDay } from 'date-fns';
import { RecurringOrder, RecurringOrderContextType, RecurringFrequency } from '@/types/recurring-order';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useProducts } from './ProductContext';
import { toast } from 'sonner';

const RecurringOrderContext = createContext<RecurringOrderContextType | undefined>(undefined);

const STORAGE_KEY = 'recurring_orders';

const calculateNextExecutionDate = (frequency: RecurringFrequency, fromDate: Date = new Date()): string => {
  const baseDate = startOfDay(fromDate);
  
  switch (frequency) {
    case 'weekly':
      return addDays(baseDate, 7).toISOString();
    case 'biweekly':
      return addDays(baseDate, 14).toISOString();
    case 'monthly':
      return addMonths(baseDate, 1).toISOString();
    case 'quarterly':
      return addMonths(baseDate, 3).toISOString();
    case 'biannual':
      return addMonths(baseDate, 6).toISOString();
    default:
      return addMonths(baseDate, 1).toISOString();
  }
};

export const RecurringOrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recurringOrders, setRecurringOrders] = useState<RecurringOrder[]>([]);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { products } = useProducts();

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${user.id}`);
      if (stored) {
        try {
          setRecurringOrders(JSON.parse(stored));
        } catch (error) {
          console.error('Error loading recurring orders:', error);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && recurringOrders.length > 0) {
      localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(recurringOrders));
    }
  }, [recurringOrders, user]);

  useEffect(() => {
    // Vérifier les commandes récurrentes au chargement de la page
    checkAndExecuteRecurringOrders();
    
    // Vérifier toutes les heures
    const interval = setInterval(checkAndExecuteRecurringOrders, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [recurringOrders]);

  const createRecurringOrder = (orderData: Omit<RecurringOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: RecurringOrder = {
      ...orderData,
      id: `recurring-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRecurringOrders(prev => [...prev, newOrder]);
    toast.success('Commande récurrente créée avec succès');
  };

  const updateRecurringOrder = (id: string, updates: Partial<RecurringOrder>) => {
    setRecurringOrders(prev =>
      prev.map(order =>
        order.id === id
          ? { ...order, ...updates, updatedAt: new Date().toISOString() }
          : order
      )
    );
    toast.success('Commande récurrente mise à jour');
  };

  const deleteRecurringOrder = (id: string) => {
    setRecurringOrders(prev => prev.filter(order => order.id !== id));
    toast.success('Commande récurrente supprimée');
  };

  const toggleRecurringOrder = (id: string) => {
    setRecurringOrders(prev =>
      prev.map(order =>
        order.id === id
          ? { 
              ...order, 
              isActive: !order.isActive, 
              updatedAt: new Date().toISOString() 
            }
          : order
      )
    );
  };

  const executeRecurringOrder = (id: string) => {
    const order = recurringOrders.find(o => o.id === id);
    if (!order || !order.isActive) return;

    let addedItems = 0;
    
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        addToCart(product, item.quantity);
        addedItems++;
      }
    });

    if (addedItems > 0) {
      // Mettre à jour la date de prochaine exécution
      const nextDate = calculateNextExecutionDate(order.frequency);
      updateRecurringOrder(id, {
        lastExecutionDate: new Date().toISOString(),
        nextExecutionDate: nextDate
      });

      toast.success(`Commande récurrente "${order.name}" ajoutée au panier (${addedItems} produit${addedItems > 1 ? 's' : ''})`);
    }
  };

  const checkAndExecuteRecurringOrders = () => {
    if (!user) return;
    
    const now = new Date();
    
    recurringOrders.forEach(order => {
      if (order.isActive && order.clientId === user.id) {
        const nextExecution = new Date(order.nextExecutionDate);
        
        if (isBefore(nextExecution, now) || nextExecution.toDateString() === now.toDateString()) {
          executeRecurringOrder(order.id);
        }
      }
    });
  };

  const value: RecurringOrderContextType = {
    recurringOrders: recurringOrders.filter(order => order.clientId === user?.id),
    createRecurringOrder,
    updateRecurringOrder,
    deleteRecurringOrder,
    toggleRecurringOrder,
    executeRecurringOrder,
    checkAndExecuteRecurringOrders,
  };

  return (
    <RecurringOrderContext.Provider value={value}>
      {children}
    </RecurringOrderContext.Provider>
  );
};

export const useRecurringOrders = () => {
  const context = useContext(RecurringOrderContext);
  if (context === undefined) {
    throw new Error('useRecurringOrders must be used within a RecurringOrderProvider');
  }
  return context;
};