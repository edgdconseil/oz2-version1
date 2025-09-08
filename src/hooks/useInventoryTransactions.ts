
import { useState, useCallback } from 'react';
import { InventoryTransaction, InventoryTransactionType, Product } from '@/types';
import { generateTransactionId } from '@/utils/inventoryUtils';

export const useInventoryTransactions = () => {
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);

  const createTransaction = useCallback((
    productId: string,
    products: Product[],
    type: InventoryTransactionType,
    quantity: number,
    reason: string,
    orderId?: string
  ) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const transaction: InventoryTransaction = {
      id: generateTransactionId(),
      productId,
      productName: product.name,
      type,
      quantity,
      reason,
      orderId,
      createdAt: new Date().toISOString(),
      createdBy: 'system'
    };

    setTransactions(prev => [...prev, transaction]);
    return transaction;
  }, []);

  const getTransactionHistory = useCallback((productId?: string): InventoryTransaction[] => {
    if (productId) {
      return transactions.filter(t => t.productId === productId);
    }
    return transactions;
  }, [transactions]);

  return {
    transactions,
    setTransactions,
    createTransaction,
    getTransactionHistory
  };
};
