
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SupplierShipping, ShippingTier } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface ShippingContextType {
  supplierShippings: SupplierShipping[];
  getSupplierShipping: (supplierId: string) => SupplierShipping | undefined;
  createSupplierShipping: (supplierId: string, supplierName: string, tiers: ShippingTier[]) => void;
  updateSupplierShipping: (supplierId: string, tiers: ShippingTier[]) => void;
  deleteSupplierShipping: (supplierId: string) => void;
  calculateShippingCost: (supplierId: string, orderAmount: number) => number;
}

const ShippingContext = createContext<ShippingContextType | undefined>(undefined);

// Données par défaut pour les tests
const defaultShippingData: SupplierShipping[] = [
  {
    id: uuidv4(),
    supplierId: 'supplier-1',
    supplierName: 'Ferme Bio Dubois',
    tiers: [
      { id: uuidv4(), minAmount: 0, maxAmount: 50, shippingCost: 15 },
      { id: uuidv4(), minAmount: 50, maxAmount: 100, shippingCost: 10 },
      { id: uuidv4(), minAmount: 100, maxAmount: 200, shippingCost: 5 },
      { id: uuidv4(), minAmount: 200, shippingCost: 0 }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const ShippingProvider = ({ children }: { children: ReactNode }) => {
  const [supplierShippings, setSupplierShippings] = useState<SupplierShipping[]>(defaultShippingData);
  const { toast } = useToast();

  // Charger les données depuis localStorage
  useEffect(() => {
    const savedShippings = localStorage.getItem('supplierShippings');
    if (savedShippings) {
      setSupplierShippings(JSON.parse(savedShippings));
    }
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('supplierShippings', JSON.stringify(supplierShippings));
  }, [supplierShippings]);

  const getSupplierShipping = (supplierId: string) => {
    return supplierShippings.find(shipping => shipping.supplierId === supplierId);
  };

  const createSupplierShipping = (supplierId: string, supplierName: string, tiers: ShippingTier[]) => {
    const newShipping: SupplierShipping = {
      id: uuidv4(),
      supplierId,
      supplierName,
      tiers: tiers.map(tier => ({ ...tier, id: uuidv4() })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSupplierShippings(prev => [...prev, newShipping]);
    
    toast({
      title: "Frais de livraison créés",
      description: `Les frais de livraison pour ${supplierName} ont été créés avec succès.`,
    });
  };

  const updateSupplierShipping = (supplierId: string, tiers: ShippingTier[]) => {
    setSupplierShippings(prev => 
      prev.map(shipping => 
        shipping.supplierId === supplierId
          ? { 
              ...shipping, 
              tiers: tiers.map(tier => ({ ...tier, id: tier.id || uuidv4() })),
              updatedAt: new Date().toISOString() 
            }
          : shipping
      )
    );
    
    toast({
      title: "Frais de livraison mis à jour",
      description: "Les frais de livraison ont été mis à jour avec succès.",
    });
  };

  const deleteSupplierShipping = (supplierId: string) => {
    setSupplierShippings(prev => prev.filter(shipping => shipping.supplierId !== supplierId));
    
    toast({
      title: "Frais de livraison supprimés",
      description: "Les frais de livraison ont été supprimés avec succès.",
    });
  };

  const calculateShippingCost = (supplierId: string, orderAmount: number): number => {
    const supplierShipping = getSupplierShipping(supplierId);
    if (!supplierShipping) return 0;

    // Trier les paliers par montant minimum
    const sortedTiers = [...supplierShipping.tiers].sort((a, b) => a.minAmount - b.minAmount);
    
    // Trouver le palier correspondant
    for (const tier of sortedTiers) {
      if (orderAmount >= tier.minAmount && (!tier.maxAmount || orderAmount < tier.maxAmount)) {
        return tier.shippingCost;
      }
    }
    
    // Si aucun palier ne correspond, prendre le dernier (le plus élevé)
    const lastTier = sortedTiers[sortedTiers.length - 1];
    return lastTier ? lastTier.shippingCost : 0;
  };

  return (
    <ShippingContext.Provider value={{
      supplierShippings,
      getSupplierShipping,
      createSupplierShipping,
      updateSupplierShipping,
      deleteSupplierShipping,
      calculateShippingCost
    }}>
      {children}
    </ShippingContext.Provider>
  );
};

export const useShipping = () => {
  const context = useContext(ShippingContext);
  if (context === undefined) {
    throw new Error('useShipping must be used within a ShippingProvider');
  }
  return context;
};
