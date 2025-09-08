
export type OrderStatus = 'ordered' | 'received' | 'cancelled';

export type LitigeStatus = 'none' | 'create_litige';
export type LitigeSouhait = 'remboursement' | 'retour_fournisseur' | 'autre';

export interface OrderItem {
  productId: string;
  quantity: number;
  priceHT: number;
  productName: string;
  packagingUnit?: string; // Unité de conditionnement du produit
  received?: boolean; // Nouveau champ pour tracker la réception
  receivedQuantity?: number; // Quantité réellement reçue
  receivedPrice?: number; // Prix réellement appliqué
  litigeStatus?: LitigeStatus; // Statut du litige
  litigeComment?: string; // Commentaire du litige
  litigeSouhait?: LitigeSouhait; // Souhait pour le litige
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  clientReference?: string; // Référence client pour ce fournisseur
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  totalHT: number;
  totalTTC: number;
  shippingCost?: number; // Frais de livraison pour cette commande
  emailSent?: boolean; // Nouveau champ pour tracker l'envoi d'email
  deliveryDate?: string; // Date de livraison souhaitée
  deliveryComment?: string; // Commentaire de livraison
}
