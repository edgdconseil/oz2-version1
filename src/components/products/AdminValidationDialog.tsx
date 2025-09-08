
import React, { useState } from 'react';
import { ProductUpdateRequest, Product } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Edit3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useProductUpdate } from '@/context/ProductUpdateContext';
import { useProducts } from '@/context/ProductContext';

interface AdminValidationDialogProps {
  request: ProductUpdateRequest;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminValidationDialog = ({ request, isOpen, onOpenChange }: AdminValidationDialogProps) => {
  const { approveUpdate, rejectUpdate } = useProductUpdate();
  const { updateProduct } = useProducts();
  const [isEditing, setIsEditing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  
  // État pour les modifications de l'admin
  const [editedData, setEditedData] = useState<Partial<Product>>({
    ...request.originalData,
    ...request.proposedData
  });

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
      ozegoId: 'ID Ozego',
    };
    return fieldMap[fieldName] || fieldName;
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
        <span className="text-red-600 text-xs font-medium">
          (+{difference.toFixed(2)}€, +{percentage}%)
        </span>
      );
    } else if (difference < 0) {
      return (
        <span className="text-green-600 text-xs font-medium">
          ({difference.toFixed(2)}€, {percentage}%)
        </span>
      );
    }
    return <span className="text-gray-500 text-xs">Aucun changement</span>;
  };

  const handleApprove = () => {
    // Appliquer les modifications de l'admin au produit
    updateProduct(request.originalProductId, editedData);
    approveUpdate(request.id);
    onOpenChange(false);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      return;
    }
    rejectUpdate(request.id, rejectionReason);
    setShowRejectDialog(false);
    onOpenChange(false);
  };

  const renderEditableField = (fieldName: string, value: any) => {
    const handleChange = (newValue: any) => {
      setEditedData(prev => ({ ...prev, [fieldName]: newValue }));
    };

    switch (fieldName) {
      case 'name':
      case 'origin':
      case 'reference':
      case 'packagingUnit':
      case 'ozegoId':
        return (
          <Input
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            className="mt-1"
          />
        );
      
      case 'priceHT':
      case 'weight':
      case 'vatRate':
        return (
          <Input
            type="number"
            step={fieldName === 'priceHT' ? '0.01' : fieldName === 'weight' ? '0.001' : '1'}
            value={value || 0}
            onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
            className="mt-1"
          />
        );
      
      case 'category':
        return (
          <Select value={value} onValueChange={handleChange}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">Alimentaire</SelectItem>
              <SelectItem value="non-food">Non alimentaire</SelectItem>
            </SelectContent>
          </Select>
        );
      
      case 'isOrganic':
      case 'available':
        return (
          <div className="flex items-center space-x-2 mt-1">
            <Switch
              checked={value}
              onCheckedChange={handleChange}
            />
            <span className="text-sm">{value ? 'Oui' : 'Non'}</span>
          </div>
        );
      
      default:
        return (
          <Input
            value={String(value || '')}
            onChange={(e) => handleChange(e.target.value)}
            className="mt-1"
          />
        );
    }
  };

  const renderComparisonField = (fieldName: string) => {
    const originalValue = request.originalData[fieldName as keyof Product];
    const proposedValue = request.proposedData[fieldName as keyof Partial<Product>];
    const currentValue = editedData[fieldName as keyof Partial<Product>];
    const isPriceField = fieldName === 'priceHT';

    const formatValue = (value: any) => {
      if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
      if (fieldName === 'priceHT') return `${value} €`;
      if (fieldName === 'weight') return `${value} kg`;
      if (fieldName === 'vatRate') return `${value}%`;
      if (fieldName === 'category') return value === 'food' ? 'Alimentaire' : 'Non alimentaire';
      return String(value);
    };

    return (
      <div className="border rounded-lg p-4 bg-red-50 border-red-200 space-y-3">
        <div className="font-medium text-sm text-red-700 flex items-center">
          {formatFieldName(fieldName)}
          {isPriceField && getPriceChangeIcon(originalValue as number, proposedValue as number)}
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Valeur actuelle
            </label>
            <p className="mt-1 bg-white border border-gray-200 rounded px-3 py-2">
              {formatValue(originalValue)}
            </p>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Valeur proposée
            </label>
            <p className="mt-1 bg-red-100 border border-red-300 rounded px-3 py-2 font-medium text-red-800">
              {formatValue(proposedValue)}
            </p>
            {isPriceField && (
              <div className="mt-1">
                {getPriceChangeText(originalValue as number, proposedValue as number)}
              </div>
            )}
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Valeur finale
            </label>
            {isEditing ? (
              renderEditableField(fieldName, currentValue)
            ) : (
              <p className="mt-1 bg-green-50 border border-green-200 rounded px-3 py-2">
                {formatValue(currentValue)}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Validation de la demande de modification
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="ml-auto"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? 'Terminer l\'édition' : 'Modifier'}
              </Button>
            </DialogTitle>
            <DialogDescription>
              Produit "{request.originalData.name}" - {request.supplierName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-500">Fournisseur</label>
                <p className="text-sm">{request.supplierName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <Badge variant={request.updateType === 'import' ? 'default' : 'secondary'}>
                  {request.updateType === 'import' ? 'Import Excel' : 'Manuel'}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date</label>
                <p className="text-sm">{new Date(request.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            {/* Modifications proposées */}
            <div>
              <h3 className="text-lg font-medium mb-4">
                Modifications proposées {isEditing && <span className="text-sm text-blue-600">(Mode édition)</span>}
              </h3>
              <div className="space-y-4">
                {Object.keys(request.proposedData).map((fieldName) => (
                  <div key={fieldName}>
                    {renderComparisonField(fieldName)}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            {request.status === 'pending' && (
              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setShowRejectDialog(true)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleApprove}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approuver{isEditing ? ' avec modifications' : ''}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de rejet */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Rejeter la demande</DialogTitle>
            <DialogDescription>
              Veuillez préciser la raison du rejet de cette modification.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Raison du rejet *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Expliquez pourquoi cette modification est rejetée..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Confirmer le rejet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminValidationDialog;
