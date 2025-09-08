
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { InventoryItem, InventoryTransaction, InventoryAlert } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/context/ProductContext';
import { useInventoryTransactions } from '@/hooks/useInventoryTransactions';
import { useInventoryAlerts } from '@/hooks/useInventoryAlerts';
import { useInventoryOperations } from '@/hooks/useInventoryOperations';
import { useInventoryPersistence } from '@/hooks/useInventoryPersistence';
import { createInventoryItem } from '@/utils/inventoryUtils';

interface InventoryContextType {
  inventoryItems: InventoryItem[];
  transactions: InventoryTransaction[];
  alerts: InventoryAlert[];
  addStock: (productId: string, quantity: number, reason: string, orderId?: string) => void;
  removeStock: (productId: string, quantity: number, reason: string) => void;
  adjustStock: (productId: string, newQuantity: number, reason: string) => void;
  updateAlertThreshold: (productId: string, threshold: number) => void;
  getProductStock: (productId: string) => number;
  getProductAlerts: () => InventoryAlert[];
  acknowledgeAlert: (alertId: string) => void;
  getTransactionHistory: (productId?: string) => InventoryTransaction[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { products } = useProducts();

  // Use custom hooks for different concerns
  const { 
    transactions, 
    setTransactions, 
    createTransaction, 
    getTransactionHistory 
  } = useInventoryTransactions();

  const { 
    alerts, 
    setAlerts, 
    updateAlertsForItem, 
    getProductAlerts, 
    acknowledgeAlert 
  } = useInventoryAlerts(toast);

  const {
    inventoryItems,
    setInventoryItems,
    addStock: addStockOperation,
    removeStock,
    adjustStock,
    updateAlertThreshold,
    getProductStock
  } = useInventoryOperations(updateAlertsForItem, toast);

  // Handle localStorage persistence
  useInventoryPersistence(
    inventoryItems,
    transactions,
    alerts,
    setInventoryItems,
    setTransactions,
    setAlerts
  );

  // Initialize inventory items for new products
  useEffect(() => {
    products.forEach(product => {
      const existingItem = inventoryItems.find(item => item.productId === product.id);
      if (!existingItem) {
        const newItem = createInventoryItem(product);
        setInventoryItems(prev => [...prev, newItem]);
      }
    });
  }, [products, inventoryItems, setInventoryItems]);

  // Wrapper for addStock that also creates transaction
  const addStock = (productId: string, quantity: number, reason: string, orderId?: string) => {
    addStockOperation(productId, quantity, reason, products, orderId);
    createTransaction(productId, products, 'in', quantity, reason, orderId);
  };

  // Wrapper for removeStock that also creates transaction
  const removeStockWithTransaction = (productId: string, quantity: number, reason: string) => {
    const success = removeStock(productId, quantity, reason);
    if (success) {
      createTransaction(productId, products, 'out', quantity, reason);
    }
  };

  // Wrapper for adjustStock that also creates transaction
  const adjustStockWithTransaction = (productId: string, newQuantity: number, reason: string) => {
    const currentItem = inventoryItems.find(item => item.productId === productId);
    if (currentItem) {
      const difference = newQuantity - currentItem.currentStock;
      adjustStock(productId, newQuantity, reason);
      createTransaction(productId, products, 'adjustment', Math.abs(difference), reason);
    }
  };

  return (
    <InventoryContext.Provider value={{
      inventoryItems,
      transactions,
      alerts,
      addStock,
      removeStock: removeStockWithTransaction,
      adjustStock: adjustStockWithTransaction,
      updateAlertThreshold,
      getProductStock,
      getProductAlerts,
      acknowledgeAlert,
      getTransactionHistory
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
