
export type UserRole = 'client' | 'supplier' | 'admin' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  organization?: string;
  authorizedSuppliers?: string[]; // IDs des fournisseurs autorisés pour les clients
  clientNumber?: string; // N° de client (pour clients et invités)
  deliveryAddress?: string; // Adresse de livraison (pour clients et invités)
  phone?: string; // N° de téléphone (pour clients et invités)
  accessExpiryDate?: string; // Date limite d'accès (pour invités uniquement)
}
