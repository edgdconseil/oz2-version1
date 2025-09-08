
import { useState, useCallback } from 'react';
import { InventoryItem, Product } from '@/types';
import { createInventoryItem } from '@/utils/inventoryUtils';

export const useInventoryOperations = (
  updateAlertsForItem: (item: InventoryItem) => void,
  showToast: (config: any) => void
) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  const updateInventoryItem = useCallback((productId: string, stockChange: number) => {
    setInventoryItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const newStock = Math.max(0, item.currentStock + stockChange);
        const updatedItem = {
          ...item,
          currentStock: newStock,
          lastUpdated: new Date().toISOString()
        };

        updateAlertsForItem(updatedItem);
        return updatedItem;
      }
      return item;
    }));
  }, [updateAlertsForItem]);

  const addStock = useCallback((
    productId: string,
    quantity: number,
    reason: string,
    products: Product[],
    orderId?: string
  ) => {
    const existingItem = inventoryItems.find(item => item.productId === productId);
    const product = products.find(p => p.id === productId);
    
    if (!existingItem && product) {
      const newItem: InventoryItem = {
        ...createInventoryItem(product),
        currentStock: quantity
      };
      
      setInventoryItems(prev => [...prev, newItem]);
      
      showToast({
        title: "Nouveau produit ajouté",
        description: `${product.name} (${product.reference}): ${quantity} ${product.packagingUnit} ajouté(s) au stock`,
      });
    } else {
      updateInventoryItem(productId, quantity);
      
      showToast({
        title: "Stock mis à jour",
        description: `${product?.name}: +${quantity} ${product?.packagingUnit} ajouté(s) au stock`,
      });
    }
  }, [inventoryItems, updateInventoryItem, showToast]);

  const removeStock = useCallback((
    productId: string,
    quantity: number,
    reason: string
  ) => {
    const currentItem = inventoryItems.find(item => item.productId === productId);
    if (!currentItem) {
      showToast({
        title: "Erreur",
        description: "Produit non trouvé dans l'inventaire",
        variant: "destructive"
      });
      return false;
    }

    if (currentItem.currentStock < quantity) {
      showToast({
        title: "Erreur",
        description: `Stock insuffisant. Stock actuel: ${currentItem.currentStock} ${currentItem.unit}`,
        variant: "destructive"
      });
      return false;
    }

    updateInventoryItem(productId, -quantity);
    
    showToast({
      title: "Stock mis à jour",
      description: `${currentItem.productName}: -${quantity} ${currentItem.unit} consommé(s)`,
    });
    return true;
  }, [inventoryItems, updateInventoryItem, showToast]);

  const adjustStock = useCallback((productId: string, newQuantity: number, reason: string) => {
    const currentItem = inventoryItems.find(item => item.productId === productId);
    if (currentItem) {
      const difference = newQuantity - currentItem.currentStock;
      updateInventoryItem(productId, difference);
    }
  }, [inventoryItems, updateInventoryItem]);

  const updateAlertThreshold = useCallback((productId: string, threshold: number) => {
    setInventoryItems(prev => prev.map(item => 
      item.productId === productId 
        ? { ...item, alertThreshold: threshold }
        : item
    ));
  }, []);

  const getProductStock = useCallback((productId: string): number => {
    const item = inventoryItems.find(item => item.productId === productId);
    return item ? item.currentStock : 0;
  }, [inventoryItems]);

  return {
    inventoryItems,
    setInventoryItems,
    addStock,
    removeStock,
    adjustStock,
    updateAlertThreshold,
    getProductStock
  };
};
