
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ProductUpdateRequest, ImportBatch, Product, ProductUpdateStatus } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

interface ProductUpdateContextType {
  updateRequests: ProductUpdateRequest[];
  importBatches: ImportBatch[];
  submitUpdateRequest: (originalProduct: Product, proposedData: Partial<Product>, importBatchId?: string) => void;
  createImportBatch: (fileName: string, supplierId: string, supplierName: string) => string;
  approveUpdate: (requestId: string) => void;
  rejectUpdate: (requestId: string, reason: string) => void;
  getRequestsBySupplier: (supplierId: string) => ProductUpdateRequest[];
  getPendingRequests: () => ProductUpdateRequest[];
  getBatchById: (batchId: string) => ImportBatch | undefined;
}

const ProductUpdateContext = createContext<ProductUpdateContextType | undefined>(undefined);

export const ProductUpdateProvider = ({ children }: { children: ReactNode }) => {
  const [updateRequests, setUpdateRequests] = useState<ProductUpdateRequest[]>([]);
  const [importBatches, setImportBatches] = useState<ImportBatch[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const savedRequests = localStorage.getItem('productUpdateRequests');
    if (savedRequests) {
      setUpdateRequests(JSON.parse(savedRequests));
    }

    const savedBatches = localStorage.getItem('importBatches');
    if (savedBatches) {
      setImportBatches(JSON.parse(savedBatches));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('productUpdateRequests', JSON.stringify(updateRequests));
  }, [updateRequests]);

  useEffect(() => {
    localStorage.setItem('importBatches', JSON.stringify(importBatches));
  }, [importBatches]);

  const createImportBatch = (fileName: string, supplierId: string, supplierName: string): string => {
    const batchId = `batch-${Date.now()}`;
    const newBatch: ImportBatch = {
      id: batchId,
      supplierId,
      supplierName,
      fileName,
      totalUpdates: 0,
      pendingUpdates: 0,
      approvedUpdates: 0,
      rejectedUpdates: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setImportBatches(prev => [...prev, newBatch]);
    return batchId;
  };

  const submitUpdateRequest = (originalProduct: Product, proposedData: Partial<Product>, importBatchId?: string) => {
    const requestId = `request-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const newRequest: ProductUpdateRequest = {
      id: requestId,
      originalProductId: originalProduct.id,
      supplierId: originalProduct.supplierId,
      supplierName: originalProduct.supplierName,
      originalData: originalProduct,
      proposedData,
      updateType: importBatchId ? 'import' : 'manual',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      importBatchId,
    };

    setUpdateRequests(prev => [...prev, newRequest]);

    // Update batch counters if applicable
    if (importBatchId) {
      setImportBatches(prev => prev.map(batch => 
        batch.id === importBatchId 
          ? { 
              ...batch, 
              totalUpdates: batch.totalUpdates + 1,
              pendingUpdates: batch.pendingUpdates + 1 
            }
          : batch
      ));
    }

    toast({
      title: "Demande de modification soumise",
      description: "Les modifications sont en attente de validation administrateur.",
    });
  };

  const approveUpdate = (requestId: string) => {
    setUpdateRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: 'approved' as ProductUpdateStatus,
            reviewedBy: user?.id,
            reviewedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : request
    ));

    // Update batch counters
    const request = updateRequests.find(r => r.id === requestId);
    if (request?.importBatchId) {
      setImportBatches(prev => prev.map(batch => 
        batch.id === request.importBatchId 
          ? { 
              ...batch, 
              pendingUpdates: batch.pendingUpdates - 1,
              approvedUpdates: batch.approvedUpdates + 1,
              status: batch.pendingUpdates === 1 ? 'completed' : 'partially_approved'
            }
          : batch
      ));
    }

    toast({
      title: "Modification approuvée",
      description: "La modification du produit a été approuvée.",
    });
  };

  const rejectUpdate = (requestId: string, reason: string) => {
    setUpdateRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: 'rejected' as ProductUpdateStatus,
            reviewedBy: user?.id,
            reviewedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            rejectionReason: reason
          }
        : request
    ));

    // Update batch counters
    const request = updateRequests.find(r => r.id === requestId);
    if (request?.importBatchId) {
      setImportBatches(prev => prev.map(batch => 
        batch.id === request.importBatchId 
          ? { 
              ...batch, 
              pendingUpdates: batch.pendingUpdates - 1,
              rejectedUpdates: batch.rejectedUpdates + 1
            }
          : batch
      ));
    }

    toast({
      title: "Modification rejetée",
      description: "La modification du produit a été rejetée.",
    });
  };

  const getRequestsBySupplier = (supplierId: string) => {
    return updateRequests.filter(request => request.supplierId === supplierId);
  };

  const getPendingRequests = () => {
    return updateRequests.filter(request => request.status === 'pending');
  };

  const getBatchById = (batchId: string) => {
    return importBatches.find(batch => batch.id === batchId);
  };

  return (
    <ProductUpdateContext.Provider value={{
      updateRequests,
      importBatches,
      submitUpdateRequest,
      createImportBatch,
      approveUpdate,
      rejectUpdate,
      getRequestsBySupplier,
      getPendingRequests,
      getBatchById
    }}>
      {children}
    </ProductUpdateContext.Provider>
  );
};

export const useProductUpdate = () => {
  const context = useContext(ProductUpdateContext);
  if (context === undefined) {
    throw new Error('useProductUpdate must be used within a ProductUpdateProvider');
  }
  return context;
};
