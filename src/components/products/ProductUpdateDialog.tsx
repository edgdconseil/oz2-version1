
import React from 'react';
import { ProductUpdateRequest } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useProductUpdate } from '@/context/ProductUpdateContext';
import { useAuth } from '@/context/AuthContext';

interface ProductUpdateDialogProps {
  request: ProductUpdateRequest;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductUpdateDialog = ({ request, isOpen, onOpenChange }: ProductUpdateDialogProps) => {
  const { approveUpdate, rejectUpdate } = useProductUpdate();
  const { user } = useAuth();

  const formatFieldName = (fieldName: string) => {
    const fieldMap: { [key: string]: string } = {
      name: 'Nom',
      priceHT: 'Prix HT',
      weight: 'Poids',
      origin: 'Origine',
      isOrganic: 'Biologique',
      available: 'Disponibilité',
      category: 'Catégorie',
      packagingUnit: 'Unité d\'emballage',
      vatRate: 'Taux TVA',
      reference: 'Référence',
    };
    return fieldMap[fieldName] || fieldName;
  };

  const formatFieldValue = (fieldName: string, value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'Oui' : 'Non';
    }
    if (fieldName === 'priceHT') {
      return `${value} €`;
    }
    if (fieldName === 'weight') {
      return `${value} kg`;
    }
    if (fieldName === 'vatRate') {
      return `${value}%`;
    }
    if (fieldName === 'category') {
      return value === 'food' ? 'Alimentaire' : 'Non alimentaire';
    }
    return String(value);
  };

  const getPriceChangeIcon = (originalPrice: number, newPrice: number) => {
    if (newPrice > originalPrice) {
      return <TrendingUp className="h-4 w-4 text-red-500 inline ml-1" />;
    } else if (newPrice < originalPrice) {
      return <TrendingDown className="h-4 w-4 text-green-500 inline ml-1" />;
    }
    return <Minus className="h-4 w-4 text-gray-400 inline ml-1" />;
  };

  const getPriceChangeText = (originalPrice: number, newPrice: number) => {
    const difference = newPrice - originalPrice;
    const percentage = ((difference / originalPrice) * 100).toFixed(1);
    
    if (difference > 0) {
      return (
        <span className="text-red-600 text-sm font-medium">
          (+{difference.toFixed(2)}€, +{percentage}%)
        </span>
      );
    } else if (difference < 0) {
      return (
        <span className="text-green-600 text-sm font-medium">
          ({difference.toFixed(2)}€, {percentage}%)
        </span>
      );
    }
    return <span className="text-gray-500 text-sm">Aucun changement</span>;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la demande de modification</DialogTitle>
          <DialogDescription>
            Demande de modification pour le produit "{request.originalData.name}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Fournisseur</label>
              <p className="text-sm">{request.supplierName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Type de modification</label>
              <div>
                <Badge variant={request.updateType === 'import' ? 'default' : 'secondary'}>
                  {request.updateType === 'import' ? 'Import Excel' : 'Manuel'}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date de soumission</label>
              <p className="text-sm">{new Date(request.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Statut</label>
              <div className="flex items-center gap-2">
                {getStatusIcon(request.status)}
                <Badge 
                  variant={
                    request.status === 'approved' ? 'default' :
                    request.status === 'rejected' ? 'destructive' : 'secondary'
                  }
                >
                  {request.status === 'pending' ? 'En attente' : 
                   request.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Modifications proposées */}
          <div>
            <h3 className="text-lg font-medium mb-4">Modifications proposées</h3>
            <div className="space-y-4">
              {Object.entries(request.proposedData).map(([fieldName, newValue]) => {
                const originalValue = request.originalData[fieldName as keyof typeof request.originalData];
                const isPriceField = fieldName === 'priceHT';
                
                return (
                  <div key={fieldName} className="border rounded-lg p-4 bg-red-50 border-red-200">
                    <div className="font-medium text-sm text-red-700 mb-2 flex items-center">
                      {formatFieldName(fieldName)}
                      {isPriceField && getPriceChangeIcon(originalValue as number, newValue as number)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Valeur actuelle
                        </label>
                        <p className="mt-1 text-sm bg-white border border-gray-200 rounded px-3 py-2">
                          {formatFieldValue(fieldName, originalValue)}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Nouvelle valeur
                        </label>
                        <p className="mt-1 text-sm bg-red-100 border border-red-300 rounded px-3 py-2 font-medium text-red-800">
                          {formatFieldValue(fieldName, newValue)}
                        </p>
                        {isPriceField && (
                          <div className="mt-2">
                            {getPriceChangeText(originalValue as number, newValue as number)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Raison de rejet si applicable */}
          {request.status === 'rejected' && request.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-red-800 mb-2">Raison du rejet</h4>
              <p className="text-sm text-red-700">{request.rejectionReason}</p>
            </div>
          )}

          {/* Actions admin */}
          {request.status === 'pending' && user?.role === 'admin' && (
            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => {
                  // TODO: Ouvrir dialog pour saisir la raison du rejet
                  rejectUpdate(request.id, "Raison non spécifiée");
                  onOpenChange(false);
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  approveUpdate(request.id);
                  onOpenChange(false);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approuver
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductUpdateDialog;
