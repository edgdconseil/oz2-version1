
import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { useProducts } from '@/context/ProductContext';
import { useProductUpdate } from '@/context/ProductUpdateContext';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import EditProductForm from '@/components/products/EditProductForm';
import ProductImportDialog from '@/components/products/ProductImportDialog';
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductsContent from '@/components/products/ProductsContent';

const Products = () => {
  const { products, getProductsBySupplier, updateProduct } = useProducts();
  const { getRequestsBySupplier } = useProductUpdate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [supplierProducts, setSupplierProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const userProducts = getProductsBySupplier(user.id);
      setSupplierProducts(userProducts);
    }
  }, [products, user, getProductsBySupplier]);

  const handleToggleAvailability = (product: Product) => {
    updateProduct(product.id, { available: !product.available });
    toast({
      title: product.available ? "Produit désactivé" : "Produit activé",
      description: `${product.name} est maintenant ${product.available ? "indisponible" : "disponible"} à la vente.`,
    });
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    const product = supplierProducts.find(p => p.id === productId);
    if (product) {
      handleToggleAvailability(product);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  const supplierUpdateRequests = user ? getRequestsBySupplier(user.id) : [];

  return (
    <div className="container py-8">
      <ProductsHeader 
        supplierProducts={supplierProducts}
        onImportClick={() => setIsImportDialogOpen(true)}
      />

      <ProductsContent
        supplierProducts={supplierProducts}
        supplierUpdateRequests={supplierUpdateRequests}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>
              Modifiez les détails du produit et cliquez sur enregistrer lorsque vous avez terminé.
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <EditProductForm 
              product={selectedProduct} 
              onClose={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      <ProductImportDialog 
        isOpen={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
      />
    </div>
  );
};

export default Products;
