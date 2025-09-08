
import { useEffect } from 'react';
import { useInventory } from '@/context/InventoryContext';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';

export const useInventorySync = () => {
  const { addStock } = useInventory();
  const { user } = useAuth();

  useEffect(() => {
    const handleOrderDelivered = (event: CustomEvent<{ order: Order }>) => {
      const { order } = event.detail;
      
      // Mettre à jour l'inventaire seulement pour le client concerné
      if (user && user.role === 'client' && user.id === order.clientId) {
        order.items.forEach(item => {
          addStock(
            item.productId,
            item.quantity,
            `Réception commande #${order.id.slice(-5)}`,
            order.id
          );
        });
      }
    };

    window.addEventListener('orderDelivered', handleOrderDelivered as EventListener);
    
    return () => {
      window.removeEventListener('orderDelivered', handleOrderDelivered as EventListener);
    };
  }, [addStock, user]);
};

