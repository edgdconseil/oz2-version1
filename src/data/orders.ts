
import { Order } from '@/types';

// Orders mock data
export const orders: Order[] = [
  {
    id: 'order-1',
    clientId: 'client-1',
    clientName: 'Restaurant Le Gourmet',
    supplierId: 'supplier-1',
    supplierName: 'Ferme Bio du Soleil',
    items: [
      {
        productId: 'prod-1',
        quantity: 10,
        priceHT: 12.50,
        productName: 'Tomates cerises bio',
        received: false
      },
      {
        productId: 'prod-2',
        quantity: 5,
        priceHT: 8.00,
        productName: 'Salade verte bio',
        received: true
      }
    ],
    status: 'received',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
    totalHT: 165.00,
    totalTTC: 198.00
  },
  {
    id: 'order-2',
    clientId: 'client-1',
    clientName: 'Restaurant Le Gourmet',
    supplierId: 'supplier-2',
    supplierName: 'Boucherie Artisanale',
    items: [
      {
        productId: 'prod-6',
        quantity: 3,
        priceHT: 25.00,
        productName: 'Côte de bœuf premium',
        received: false
      }
    ],
    status: 'ordered',
    createdAt: '2024-01-16T14:20:00.000Z',
    updatedAt: '2024-01-16T14:20:00.000Z',
    totalHT: 75.00,
    totalTTC: 90.00
  }
];
