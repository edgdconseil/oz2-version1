
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SupplierReference } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import { useProducts } from './ProductContext';

interface SupplierReferenceContextType {
  supplierReferences: SupplierReference[];
  addSupplierReference: (supplierId: string, supplierName: string, clientReference: string, preferredDeliveryDays?: string[]) => void;
  updateSupplierReference: (id: string, updates: { clientReference?: string; preferredDeliveryDays?: string[] }) => void;
  deleteSupplierReference: (id: string) => void;
  getSupplierReference: (supplierId: string) => SupplierReference | undefined;
  getAvailableSuppliers: () => { id: string; name: string }[];
}

const SupplierReferenceContext = createContext<SupplierReferenceContextType | undefined>(undefined);

export const SupplierReferenceProvider = ({ children }: { children: ReactNode }) => {
  const [supplierReferences, setSupplierReferences] = useState<SupplierReference[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { products } = useProducts();

  // Load supplier references from localStorage on component mount
  useEffect(() => {
    if (user) {
      const savedReferences = localStorage.getItem(`supplierReferences_${user.id}`);
      if (savedReferences) {
        setSupplierReferences(JSON.parse(savedReferences));
      }
    }
  }, [user]);

  // Save supplier references to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`supplierReferences_${user.id}`, JSON.stringify(supplierReferences));
    }
  }, [supplierReferences, user]);

  const addSupplierReference = (supplierId: string, supplierName: string, clientReference: string, preferredDeliveryDays: string[] = []) => {
    if (!user) return;

    const newReference: SupplierReference = {
      id: `ref-${Date.now()}`,
      clientId: user.id,
      supplierId,
      supplierName,
      clientReference,
      preferredDeliveryDays,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSupplierReferences(prev => [...prev, newReference]);
    
    toast({
      title: "Référence ajoutée",
      description: `Référence ${clientReference} ajoutée pour ${supplierName}`,
    });
  };

  const updateSupplierReference = (id: string, updates: { clientReference?: string; preferredDeliveryDays?: string[] }) => {
    setSupplierReferences(prev =>
      prev.map(ref =>
        ref.id === id
          ? { ...ref, ...updates, updatedAt: new Date().toISOString() }
          : ref
      )
    );

    toast({
      title: "Référence mise à jour",
      description: "La référence a été modifiée avec succès",
    });
  };

  const deleteSupplierReference = (id: string) => {
    setSupplierReferences(prev => prev.filter(ref => ref.id !== id));
    
    toast({
      title: "Référence supprimée",
      description: "La référence fournisseur a été supprimée",
    });
  };

  const getSupplierReference = (supplierId: string) => {
    return supplierReferences.find(ref => ref.supplierId === supplierId);
  };

  const getAvailableSuppliers = () => {
    // Get unique suppliers from products
    const suppliersMap = new Map();
    products.forEach(product => {
      if (!suppliersMap.has(product.supplierId)) {
        suppliersMap.set(product.supplierId, {
          id: product.supplierId,
          name: product.supplierName
        });
      }
    });
    return Array.from(suppliersMap.values());
  };

  return (
    <SupplierReferenceContext.Provider value={{
      supplierReferences,
      addSupplierReference,
      updateSupplierReference,
      deleteSupplierReference,
      getSupplierReference,
      getAvailableSuppliers
    }}>
      {children}
    </SupplierReferenceContext.Provider>
  );
};

export const useSupplierReferences = () => {
  const context = useContext(SupplierReferenceContext);
  if (context === undefined) {
    throw new Error('useSupplierReferences must be used within a SupplierReferenceProvider');
  }
  return context;
};
