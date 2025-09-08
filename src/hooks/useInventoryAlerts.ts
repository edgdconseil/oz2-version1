
import { useState, useCallback } from 'react';
import { InventoryAlert, InventoryItem } from '@/types';
import { checkAndCreateAlert } from '@/utils/inventoryUtils';

export const useInventoryAlerts = (showToast: (config: any) => void) => {
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);

  const updateAlertsForItem = useCallback((item: InventoryItem) => {
    // Remove old alerts for this product
    setAlerts(prev => prev.filter(alert => alert.productId !== item.productId));

    const newAlert = checkAndCreateAlert(item);
    if (newAlert) {
      setAlerts(prev => [...prev, newAlert]);
      
      showToast({
        title: newAlert.severity === 'critical' ? "Stock épuisé" : "Stock faible",
        description: `${item.productName}: ${item.currentStock} ${item.unit} restant(s)`,
        variant: newAlert.severity === 'critical' ? "destructive" : "default"
      });
    }
  }, [showToast]);

  const getProductAlerts = useCallback((): InventoryAlert[] => {
    return alerts.filter(alert => !alert.acknowledged);
  }, [alerts]);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ));
  }, []);

  return {
    alerts,
    setAlerts,
    updateAlertsForItem,
    getProductAlerts,
    acknowledgeAlert
  };
};
