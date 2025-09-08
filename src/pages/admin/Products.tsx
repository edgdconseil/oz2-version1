import React, { useState } from 'react';
import { useProducts } from '@/context/ProductContext';
import { Product } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditProductForm from '@/components/products/EditProductForm';
import ProductForm from '@/components/products/ProductForm';
import ProductFilters from '@/components/products/ProductFilters';
import ProductTable from '@/components/products/ProductTable';
import PriceHistoryDialog from '@/components/products/PriceHistoryDialog';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { importProductsFromFile } from '@/utils/exportUtils';

const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyProduct, setHistoryProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesAvailability = availabilityFilter === 'all' || 
                               (availabilityFilter === 'available' && product.available) ||
                               (availabilityFilter === 'unavailable' && !product.available);
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const handleAddProduct = (data: Omit<Product, 'id' | 'supplierId' | 'supplierName'>) => {
    addProduct({
      ...data,
      supplierId: user?.id || 'admin',
      supplierName: user?.name || 'Admin',
    });
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleShowHistory = (product: Product) => {
    setHistoryProduct(product);
    setIsHistoryOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      deleteProduct(id);
    }
  };

  const handleEditSave = (updatedProduct: Product) => {
    updateProduct(updatedProduct.id, updatedProduct);
    setEditingProduct(null);
  };

  const handleExport = () => {
    // Cette fonction est maintenant un placeholder car les exports réels sont gérés dans ProductFilters
    // avec des toasts spécifiques pour chaque format
  };

  const handleImport = (file: File) => {
    importProductsFromFile(file, products, (results) => {
      // Mettre à jour les produits existants
      results.updated.forEach(product => {
        updateProduct(product.id, product);
      });
      
      // Ajouter les nouveaux produits
      results.created.forEach(product => {
        addProduct({
          ...product,
          supplierId: user?.id || 'admin',
          supplierName: user?.name || 'Admin',
        });
      });
      
      // Afficher un toast avec les résultats
      const message = `
        ${results.updated.length} produits mis à jour, 
        ${results.created.length} produits créés
        ${results.errors.length > 0 ? `(${results.errors.length} erreurs)` : ''}
      `;
      
      toast({
        title: "Import terminé",
        description: message,
        variant: results.errors.length > 0 ? "destructive" : "default",
      });
      
      // Si des erreurs sont présentes, les afficher dans la console
      if (results.errors.length > 0) {
        console.error("Erreurs d'importation:", results.errors);
      }
    });
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des produits</h1>
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <ProductFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            availabilityFilter={availabilityFilter}
            onAvailabilityChange={setAvailabilityFilter}
            onExport={handleExport}
            onAddNew={() => setIsAddDialogOpen(true)}
            onImport={handleImport}
          />
          
          <ProductTable
            products={filteredProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            showHistory
            onShowHistory={handleShowHistory}
          />
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold text-ozego-blue mb-2">Gestion des catégories</h2>
            <p className="text-gray-500">Cette fonctionnalité est en cours de développement.</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <ProductForm
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddProduct}
      />
      
      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      <PriceHistoryDialog
        product={historyProduct}
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
      />
    </div>
  );
};

export default AdminProducts;
