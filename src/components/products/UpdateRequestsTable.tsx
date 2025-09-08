
import React from 'react';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { ProductUpdateRequest } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProductUpdate } from '@/context/ProductUpdateContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import ProductUpdateDialog from './ProductUpdateDialog';
import AdminValidationDialog from './AdminValidationDialog';
import { useState } from 'react';

interface UpdateRequestsTableProps {
  requests: ProductUpdateRequest[];
  isSupplierView?: boolean;
}

const UpdateRequestsTable = ({ requests, isSupplierView = false }: UpdateRequestsTableProps) => {
  const { approveUpdate, rejectUpdate } = useProductUpdate();
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<ProductUpdateRequest | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const getModifiedFieldsCount = (request: ProductUpdateRequest) => {
    return Object.keys(request.proposedData).length;
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune demande de modification
          </h3>
          <p className="text-gray-500">
            {isSupplierView 
              ? "Vous n'avez pas encore soumis de demandes de modification."
              : "Aucune demande de modification en attente de validation."
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Modifications</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              {!isSupplierView && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map(request => (
              <TableRow 
                key={request.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedRequest(request)}
              >
                <TableCell>
                  <div>
                    <div className="font-medium">{request.originalData.name}</div>
                    <div className="text-sm text-gray-500">{request.originalData.reference}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{request.supplierName}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={request.updateType === 'import' ? 'default' : 'secondary'}>
                    {request.updateType === 'import' ? 'Import Excel' : 'Manuel'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {getModifiedFieldsCount(request)} champ{getModifiedFieldsCount(request) > 1 ? 's' : ''} modifié{getModifiedFieldsCount(request) > 1 ? 's' : ''}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <Badge 
                      variant={
                        request.status === 'approved' ? 'default' :
                        request.status === 'rejected' ? 'destructive' : 'secondary'
                      }
                    >
                      {getStatusText(request.status)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600">
                    {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </TableCell>
                {!isSupplierView && (
                  <TableCell className="text-right">
                    {request.status === 'pending' && user?.role === 'admin' && (
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            approveUpdate(request.id);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Validation rapide
                        </Button>
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedRequest && (
        <>
          {user?.role === 'admin' ? (
            <AdminValidationDialog
              request={selectedRequest}
              isOpen={!!selectedRequest}
              onOpenChange={() => setSelectedRequest(null)}
            />
          ) : (
            <ProductUpdateDialog
              request={selectedRequest}
              isOpen={!!selectedRequest}
              onOpenChange={() => setSelectedRequest(null)}
            />
          )}
        </>
      )}
    </>
  );
};

export default UpdateRequestsTable;
