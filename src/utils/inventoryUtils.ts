
import { InventoryItem, InventoryAlert, Product } from '@/types';

export const createInventoryItem = (product: Product): InventoryItem => ({
  productId: product.id,
  productName: product.name,
  productReference: product.reference,
  currentStock: 0,
  alertThreshold: 5,
  unit: product.negotiationUnit || product.packagingUnit,
  lastUpdated: new Date().toISOString(),
  averageConsumption: 0,
  category: product.category,
  supplierName: product.supplierName,
  isEgalim: product.isEgalim,
  isOrganic: product.isOrganic,
  otherLabels: product.otherLabels
});

export const checkAndCreateAlert = (item: InventoryItem): InventoryAlert | null => {
  if (item.currentStock <= item.alertThreshold) {
    const severity = item.currentStock === 0 ? 'critical' : 'low';
    return {
      id: `alert-${Date.now()}-${item.productId}`,
      productId: item.productId,
      productName: item.productName,
      currentStock: item.currentStock,
      alertThreshold: item.alertThreshold,
      severity,
      createdAt: new Date().toISOString(),
      acknowledged: false
    };
  }
  return null;
};

export const generateTransactionId = (): string => {
  return `transaction-${Date.now()}-${Math.random()}`;
};
