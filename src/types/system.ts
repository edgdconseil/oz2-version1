
import { Product } from './product';

// New types for Supplier References
export interface SupplierReference {
  id: string;
  clientId: string;
  supplierId: string;
  supplierName: string;
  clientReference: string; // The client's reference number for this supplier
  preferredDeliveryDays: string[]; // Days of the week (e.g., ['monday', 'wednesday', 'friday'])
  createdAt: string;
  updatedAt: string;
}

// New types for Product Update Validation
export type ProductUpdateStatus = 'pending' | 'approved' | 'rejected';
export type ProductUpdateType = 'import' | 'manual';

export interface ProductUpdateRequest {
  id: string;
  originalProductId: string;
  supplierId: string;
  supplierName: string;
  originalData: Product;
  proposedData: Partial<Product>;
  updateType: ProductUpdateType;
  status: ProductUpdateStatus;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  importBatchId?: string; // Pour grouper les updates d'un même import
}

export interface ImportBatch {
  id: string;
  supplierId: string;
  supplierName: string;
  fileName: string;
  totalUpdates: number;
  pendingUpdates: number;
  approvedUpdates: number;
  rejectedUpdates: number;
  status: 'pending' | 'partially_approved' | 'completed' | 'rejected';
  createdAt: string;
}

// New types for Shipping Costs Management
export interface ShippingTier {
  id: string;
  minAmount: number; // Montant minimum pour ce palier (en €)
  maxAmount?: number; // Montant maximum pour ce palier (en €, undefined pour le dernier palier)
  shippingCost: number; // Frais de livraison (en €)
}

export interface SupplierShipping {
  id: string;
  supplierId: string;
  supplierName: string;
  tiers: ShippingTier[]; // Maximum 4 paliers
  createdAt: string;
  updatedAt: string;
}

// New types for Depot Management
export interface Depot {
  id: string;
  supplierId: string;
  supplierName: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  region: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  deliveryZones: string[]; // Liste des codes postaux ou zones de livraison
  createdAt: string;
  updatedAt: string;
}

export interface ClientDepotAssignment {
  id: string;
  clientId: string;
  clientName: string;
  supplierId: string;
  supplierName: string;
  depotId: string;
  depotName: string;
  assignedAt: string;
  assignedBy: string;
}
