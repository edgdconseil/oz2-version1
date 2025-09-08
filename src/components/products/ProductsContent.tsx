
import React from 'react';
import { Product, ProductUpdateRequest } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductTable from './ProductTable';
import UpdateRequestsTable from './UpdateRequestsTable';

interface ProductsContentProps {
  supplierProducts: Product[];
  supplierUpdateRequests: ProductUpdateRequest[];
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductsContent = ({ 
  supplierProducts, 
  supplierUpdateRequests, 
  onEditProduct, 
  onDeleteProduct 
}: ProductsContentProps) => {
  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="products">Produits</TabsTrigger>
        <TabsTrigger value="requests" className="relative">
          Demandes de modification
          {supplierUpdateRequests.filter(r => r.status === 'pending').length > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
              {supplierUpdateRequests.filter(r => r.status === 'pending').length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="products">
        {supplierProducts.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Vous n'avez pas encore de produits. Cliquez sur "Ajouter un produit" pour commencer.</p>
          </div>
        ) : (
          <ProductTable 
            products={supplierProducts}
            onEdit={onEditProduct}
            onDelete={onDeleteProduct}
          />
        )}
      </TabsContent>

      <TabsContent value="requests">
        <UpdateRequestsTable requests={supplierUpdateRequests} isSupplierView={true} />
      </TabsContent>
    </Tabs>
  );
};

export default ProductsContent;
