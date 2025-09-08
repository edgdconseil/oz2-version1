
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, ProductCategory } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { products as mockProducts } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { PriceChange } from '@/types/price-history';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: ProductCategory) => Product[];
  getProductsBySupplier: (supplierId: string) => Product[];
  getPriceHistory: (productId: string) => PriceChange[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const { toast } = useToast();
  const { user } = useAuth();

  // Price history stored per product id
  const [priceHistory, setPriceHistory] = useState<Record<string, PriceChange[]>>(() => {
    const saved = localStorage.getItem('priceHistory');
    return saved ? JSON.parse(saved) : {};
  });

  const pruneOlderThanOneYear = (entries: PriceChange[]) => {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 1);
    return entries.filter(e => new Date(e.date) >= cutoff);
  };

  // Load products from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initialize with mock data
      setProducts(mockProducts);
      localStorage.setItem('products', JSON.stringify(mockProducts));
    }
  }, []);

  // Save products to localStorage when they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Persist price history when it changes
  useEffect(() => {
    localStorage.setItem('priceHistory', JSON.stringify(priceHistory));
  }, [priceHistory]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}` // Generate a unique ID
    };
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
    
    toast({
      title: "Produit ajouté",
      description: `${newProduct.name} a été ajouté avec succès`,
    });
  };

const updateProduct = (id: string, updates: Partial<Product>) => {
  setProducts(prevProducts => 
    prevProducts.map(product => {
      if (product.id !== id) return product;

      const updated = { ...product, ...updates };
      const priceChanged = (
        (updates.priceHT !== undefined && updates.priceHT !== product.priceHT) ||
        (updates.negotiatedPrice !== undefined && updates.negotiatedPrice !== product.negotiatedPrice)
      );

      if (priceChanged) {
        const entry: PriceChange = {
          date: new Date().toISOString(),
          priceHT: updated.priceHT,
          negotiatedPrice: updated.negotiatedPrice,
          changedByRole: user?.role || 'guest',
        };
        setPriceHistory(prev => {
          const next = { ...prev };
          const existing = next[id] || [];
          next[id] = pruneOlderThanOneYear([...existing, entry]);
          return next;
        });
      }

      return updated;
    })
  );
  
  toast({
    title: "Produit mis à jour",
    description: `Le produit a été modifié avec succès`,
  });
};

  const deleteProduct = (id: string) => {
    setProducts(prevProducts => 
      prevProducts.filter(product => product.id !== id)
    );
    
    toast({
      title: "Produit supprimé",
      description: `Le produit a été supprimé`,
    });
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getProductsByCategory = (category: ProductCategory) => {
    return products.filter(product => product.category === category);
  };

const getProductsBySupplier = (supplierId: string) => {
  return products.filter(product => product.supplierId === supplierId);
};

const getPriceHistory = (productId: string): PriceChange[] => {
  const entries = priceHistory[productId] || [];
  return pruneOlderThanOneYear(entries).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};
  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      getProductsByCategory,
      getProductsBySupplier,
      getPriceHistory
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
