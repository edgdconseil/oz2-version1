
export type ProductCategory = 'food' | 'non-food';

export interface Product {
  id: string;
  name: string; // Désignation OZEGO
  supplierDesignation: string; // Désignation fournisseur
  reference: string; // Référence
  priceHT: number; // Prix / unité de conditionnement
  negotiatedPrice?: number; // Prix / unité de négo
  supplierId: string; // Fournisseurs
  supplierName: string; // Nom du fournisseur
  category: ProductCategory; // Famille
  grouping?: string; // Regroupement
  caliber?: string; // Calibre
  origin: string; // Origine
  brand?: string; // Marque
  weight: number; // Poids net égouté
  isEgalim: boolean; // EGALIM
  otherLabels?: string; // Autres labels
  vatRate: number; // TVA
  packagingUnit: string; // Unité de COM
  packagingCoefficient?: number; // Coef unité de COM
  technicalSheetUrl?: string; // Fiche technique
  imageUrl?: string; // Url photo
  ozegoId: string; // ID Ozego
  available: boolean;
  isOrganic: boolean; // Maintenu pour compatibilité avec EGALIM
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

// Updated Cart interface to organize items by supplier
export interface Cart {
  supplierItems: {
    [supplierId: string]: CartItem[];
  };
  clientId: string;
}
