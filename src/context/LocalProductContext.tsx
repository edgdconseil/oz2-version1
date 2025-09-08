import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, ProductCategory } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

export interface LocalProduct extends Omit<Product, 'supplierId' | 'supplierName' | 'ozegoId' | 'supplierDesignation' | 'negotiatedPrice' | 'grouping' | 'caliber' | 'brand' | 'isEgalim' | 'otherLabels' | 'packagingCoefficient' | 'negotiationUnit' | 'technicalSheetUrl' | 'imageUrl'> {
  customSupplierId?: string;
  customSupplierName: string;
  clientId: string;
}

interface LocalProductContextType {
  localProducts: LocalProduct[];
  addLocalProduct: (product: Omit<LocalProduct, 'id' | 'clientId'>) => void;
  updateLocalProduct: (id: string, updates: Partial<LocalProduct>) => void;
  deleteLocalProduct: (id: string) => void;
  getLocalProductById: (id: string) => LocalProduct | undefined;
  getLocalProductsByCategory: (category: ProductCategory) => LocalProduct[];
}

const LocalProductContext = createContext<LocalProductContextType | undefined>(undefined);

export const LocalProductProvider = ({ children }: { children: ReactNode }) => {
  const [localProducts, setLocalProducts] = useState<LocalProduct[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load local products from localStorage on component mount
  useEffect(() => {
    if (!user?.id) return;
    
    const savedProducts = localStorage.getItem(`localProducts_${user.id}`);
    if (savedProducts) {
      setLocalProducts(JSON.parse(savedProducts));
    }
  }, [user?.id]);

  // Save local products to localStorage when they change
  useEffect(() => {
    if (!user?.id) return;
    localStorage.setItem(`localProducts_${user.id}`, JSON.stringify(localProducts));
  }, [localProducts, user?.id]);

  const addLocalProduct = (product: Omit<LocalProduct, 'id' | 'clientId'>) => {
    if (!user?.id) return;
    
    const newProduct: LocalProduct = {
      ...product,
      id: `local-product-${Date.now()}`,
      clientId: user.id,
    };
    
    setLocalProducts(prevProducts => [...prevProducts, newProduct]);
    
    toast({
      title: "Produit local ajouté",
      description: `${newProduct.name} a été ajouté avec succès`,
    });
  };

  const updateLocalProduct = (id: string, updates: Partial<LocalProduct>) => {
    setLocalProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id 
          ? { ...product, ...updates } 
          : product
      )
    );
    
    toast({
      title: "Produit local mis à jour",
      description: `Le produit a été modifié avec succès`,
    });
  };

  const deleteLocalProduct = (id: string) => {
    setLocalProducts(prevProducts => 
      prevProducts.filter(product => product.id !== id)
    );
    
    toast({
      title: "Produit local supprimé",
      description: `Le produit a été supprimé`,
    });
  };

  const getLocalProductById = (id: string) => {
    return localProducts.find(product => product.id === id);
  };

  const getLocalProductsByCategory = (category: ProductCategory) => {
    return localProducts.filter(product => product.category === category);
  };

  return (
    <LocalProductContext.Provider value={{
      localProducts,
      addLocalProduct,
      updateLocalProduct,
      deleteLocalProduct,
      getLocalProductById,
      getLocalProductsByCategory
    }}>
      {children}
    </LocalProductContext.Provider>
  );
};

export const useLocalProducts = () => {
  const context = useContext(LocalProductContext);
  if (context === undefined) {
    throw new Error('useLocalProducts must be used within a LocalProductProvider');
  }
  return context;
};