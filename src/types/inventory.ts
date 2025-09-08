
import { ProductCategory } from './product';

export type InventoryTransactionType = 'in' | 'out' | 'adjustment';

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  type: InventoryTransactionType;
  quantity: number;
  reason: string; // "Réception commande", "Consommation", "Ajustement", etc.
  orderId?: string; // Lié à une commande si applicable
  createdAt: string;
  createdBy: string;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  productReference: string;
  currentStock: number;
  alertThreshold: number; // Seuil d'alerte
  unit: string;
  lastUpdated: string;
  averageConsumption: number; // Consommation moyenne par mois
  category: ProductCategory;
  supplierName: string;
  // Labels et certifications
  isEgalim: boolean;
  isOrganic: boolean;
  otherLabels?: string;
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  alertThreshold: number;
  severity: 'low' | 'critical'; // low = proche du seuil, critical = en dessous
  createdAt: string;
  acknowledged: boolean;
}
