
import { useEffect } from 'react';
import { InventoryItem, InventoryTransaction, InventoryAlert } from '@/types';

export const useInventoryPersistence = (
  inventoryItems: InventoryItem[],
  transactions: InventoryTransaction[],
  alerts: InventoryAlert[],
  setInventoryItems: (items: InventoryItem[]) => void,
  setTransactions: (transactions: InventoryTransaction[]) => void,
  setAlerts: (alerts: InventoryAlert[]) => void
) => {
  // Load data from localStorage on mount
  useEffect(() => {
    const savedInventory = localStorage.getItem('inventory');
    const savedTransactions = localStorage.getItem('inventoryTransactions');
    const savedAlerts = localStorage.getItem('inventoryAlerts');
    
    if (savedInventory) {
      setInventoryItems(JSON.parse(savedInventory));
    }
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, [setInventoryItems, setTransactions, setAlerts]);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventoryItems));
  }, [inventoryItems]);

  useEffect(() => {
    localStorage.setItem('inventoryTransactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('inventoryAlerts', JSON.stringify(alerts));
  }, [alerts]);
};
