import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Cart, Product } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string, supplierId: string) => void;
  updateQuantity: (productId: string, supplierId: string, quantity: number) => void;
  clearCart: () => void;
  clearSupplierCart: (supplierId: string) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSupplierTotalItems: (supplierId: string) => number;
  getSupplierTotalPrice: (supplierId: string) => number;
  getUniqueSuppliers: () => { id: string, name: string }[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart>({
    supplierItems: {},
    clientId: user?.id || ''
  });
  const { toast } = useToast();

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart && user) {
      const parsedCart = JSON.parse(savedCart);
      if (parsedCart.clientId === user.id) {
        // Handle potential migration from old cart structure to new structure
        if (Array.isArray(parsedCart.items)) {
          // Convert old format to new format
          const newCart: Cart = {
            supplierItems: {},
            clientId: user.id
          };
          
          parsedCart.items.forEach((item: CartItem) => {
            const supplierId = item.product.supplierId;
            if (!newCart.supplierItems[supplierId]) {
              newCart.supplierItems[supplierId] = [];
            }
            newCart.supplierItems[supplierId].push(item);
          });
          
          setCart(newCart);
        } else {
          // Already in new format
          setCart(parsedCart);
        }
      } else {
        // If user is different, initialize a new cart
        setCart({
          supplierItems: {},
          clientId: user.id
        });
      }
    }
  }, [user]);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product: Product, quantity: number) => {
    if (!user || (user.role !== 'client' && user.role !== 'guest')) {
      toast({
        title: "Opération non autorisée",
        description: "Seuls les clients et invités peuvent ajouter des produits au panier.",
        variant: "destructive"
      });
      return;
    }
    
    setCart(prevCart => {
      const supplierId = product.supplierId;
      const supplierItems = prevCart.supplierItems[supplierId] || [];
      
      // Check if the product already exists in this supplier's cart
      const existingItemIndex = supplierItems.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex !== -1) {
        // Update quantity if the product already exists
        const updatedSupplierItems = [...supplierItems];
        updatedSupplierItems[existingItemIndex] = {
          ...updatedSupplierItems[existingItemIndex],
          quantity: updatedSupplierItems[existingItemIndex].quantity + quantity
        };
        
        toast({
          title: "Produit mis à jour",
          description: `Quantité mise à jour pour ${product.name}`,
        });
        
        return {
          ...prevCart,
          supplierItems: {
            ...prevCart.supplierItems,
            [supplierId]: updatedSupplierItems
          }
        };
      } else {
        // Add new product to the supplier's cart
        toast({
          title: "Produit ajouté",
          description: `${product.name} ajouté au panier de ${product.supplierName}`,
        });
        
        return {
          ...prevCart,
          supplierItems: {
            ...prevCart.supplierItems,
            [supplierId]: [
              ...supplierItems,
              {
                productId: product.id,
                quantity,
                product
              }
            ]
          }
        };
      }
    });
  };

  const removeFromCart = (productId: string, supplierId: string) => {
    setCart(prevCart => {
      const supplierItems = prevCart.supplierItems[supplierId] || [];
      const updatedSupplierItems = supplierItems.filter(item => item.productId !== productId);
      
      // Create a copy of the supplier items
      const updatedSupplierItemsObj = { ...prevCart.supplierItems };
      
      if (updatedSupplierItems.length === 0) {
        // If no more items for this supplier, remove the supplier entry
        delete updatedSupplierItemsObj[supplierId];
      } else {
        // Otherwise update the supplier's items
        updatedSupplierItemsObj[supplierId] = updatedSupplierItems;
      }
      
      toast({
        title: "Produit retiré",
        description: "Le produit a été retiré du panier",
      });
      
      return {
        ...prevCart,
        supplierItems: updatedSupplierItemsObj
      };
    });
  };

  const updateQuantity = (productId: string, supplierId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, supplierId);
      return;
    }
    
    setCart(prevCart => {
      const supplierItems = prevCart.supplierItems[supplierId] || [];
      const updatedSupplierItems = supplierItems.map(item => 
        item.productId === productId 
          ? { ...item, quantity } 
          : item
      );
      
      return {
        ...prevCart,
        supplierItems: {
          ...prevCart.supplierItems,
          [supplierId]: updatedSupplierItems
        }
      };
    });
  };

  const clearCart = () => {
    setCart({
      supplierItems: {},
      clientId: user?.id || ''
    });
    
    toast({
      title: "Panier vidé",
      description: "Tous les produits ont été retirés du panier",
    });
  };
  
  const clearSupplierCart = (supplierId: string) => {
    setCart(prevCart => {
      const updatedSupplierItems = { ...prevCart.supplierItems };
      delete updatedSupplierItems[supplierId];
      
      toast({
        title: "Panier fournisseur vidé",
        description: "Tous les produits de ce fournisseur ont été retirés du panier",
      });
      
      return {
        ...prevCart,
        supplierItems: updatedSupplierItems
      };
    });
  };

  const getTotalItems = () => {
    return Object.values(cart.supplierItems).reduce(
      (total, items) => total + items.reduce((sum, item) => sum + item.quantity, 0), 
      0
    );
  };

  const getSupplierTotalItems = (supplierId: string) => {
    const supplierItems = cart.supplierItems[supplierId] || [];
    return supplierItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return Object.values(cart.supplierItems).reduce(
      (total, items) => total + items.reduce((sum, item) => sum + (item.product.priceHT * item.quantity), 0), 
      0
    );
  };

  const getSupplierTotalPrice = (supplierId: string) => {
    const supplierItems = cart.supplierItems[supplierId] || [];
    return supplierItems.reduce((total, item) => total + (item.product.priceHT * item.quantity), 0);
  };
  
  const getUniqueSuppliers = () => {
    return Object.entries(cart.supplierItems).map(([supplierId, items]) => ({
      id: supplierId,
      name: items.length > 0 ? items[0].product.supplierName : "Fournisseur"
    }));
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      clearSupplierCart,
      getTotalItems,
      getTotalPrice,
      getSupplierTotalItems,
      getSupplierTotalPrice,
      getUniqueSuppliers
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
