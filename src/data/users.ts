
import { User } from '@/types';

// Users mock data
export const users: User[] = [
  {
    id: '1',
    email: 'ehpad@example.com',
    name: 'EHPAD Les Tilleuls',
    role: 'client',
    isActive: true,
    organization: 'Les Tilleuls'
  },
  {
    id: '2',
    email: 'fournisseur@example.com',
    name: 'Ferme Bio Locale',
    role: 'supplier',
    isActive: true,
    organization: 'Ferme Bio Locale'
  },
  {
    id: '3',
    email: 'admin@ozego.fr',
    name: 'Administrateur Ozego',
    role: 'admin',
    isActive: true,
    organization: 'Ozego'
  },
  {
    id: '4',
    email: 'produits@exemple.fr',
    name: 'Entrepôt Produits Non-Alimentaires',
    role: 'supplier',
    isActive: true,
    organization: 'Entrepôt Produits'
  },
  {
    id: '5',
    email: 'invite@example.com',
    name: 'Compte Invité',
    role: 'guest',
    isActive: true,
    organization: 'Mode Invité',
    authorizedSuppliers: ['2', '4'] // Accès aux deux fournisseurs pour les tests
  }
];
