
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';

export const useAuthorizedSuppliers = () => {
  const { user } = useAuth();
  const { products } = useProducts();

  const isProductOrderable = (productId: string): boolean => {
    if (!user || (user.role !== 'client' && user.role !== 'guest')) {
      return true; // Non-clients/invités peuvent voir tous les produits
    }

    const product = products.find(p => p.id === productId);
    if (!product) return false;

    // Si l'utilisateur n'a pas de fournisseurs autorisés, il ne peut rien commander
    if (!user.authorizedSuppliers || user.authorizedSuppliers.length === 0) {
      return false;
    }

    // Vérifier si le fournisseur du produit est dans la liste autorisée
    return user.authorizedSuppliers.includes(product.supplierId);
  };

  const getOrderableProducts = () => {
    if (!user || (user.role !== 'client' && user.role !== 'guest')) {
      return products; // Non-clients/invités voient tous les produits
    }

    if (!user.authorizedSuppliers || user.authorizedSuppliers.length === 0) {
      return []; // Aucun fournisseur autorisé
    }

    return products.filter(product => 
      user.authorizedSuppliers!.includes(product.supplierId)
    );
  };

  return {
    isProductOrderable,
    getOrderableProducts,
    authorizedSuppliers: user?.authorizedSuppliers || []
  };
};
