import { ArrowRight, CreditCard, ShieldCheck, Mail, FileText, Calendar, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useShipping } from '@/context/ShippingContext';
import { useSupplierReferences } from '@/context/SupplierReferenceContext';
import { CartItem } from '@/types';

interface SupplierCartSummaryProps {
  supplierId: string;
  supplierName: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  deliveryDate?: Date;
  deliveryComment?: string;
  onCreateOrder?: (supplierId: string, sendEmail: boolean) => void;
  onCreateRecurringOrder?: (supplierId: string, items: CartItem[]) => void;
  isProcessing: boolean;
  isTestUser?: boolean;
}

const SupplierCartSummary = ({ 
  supplierId,
  supplierName,
  items,
  totalItems, 
  totalPrice,
  deliveryDate,
  deliveryComment,
  onCreateOrder,
  onCreateRecurringOrder,
  isProcessing,
  isTestUser = false
}: SupplierCartSummaryProps) => {
  const [sendEmailToSupplier, setSendEmailToSupplier] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { calculateShippingCost } = useShipping();
  const { getSupplierReference } = useSupplierReferences();

  // Récupérer les jours de livraison préférés pour ce fournisseur
  const supplierReference = getSupplierReference(supplierId);
  const preferredDeliveryDays = supplierReference?.preferredDeliveryDays || [];

  const DELIVERY_DAYS = [
    { id: 'monday', label: 'Lundi' },
    { id: 'tuesday', label: 'Mardi' },
    { id: 'wednesday', label: 'Mercredi' },
    { id: 'thursday', label: 'Jeudi' },
    { id: 'friday', label: 'Vendredi' },
    { id: 'saturday', label: 'Samedi' },
    { id: 'sunday', label: 'Dimanche' },
  ];

  // Calculer les frais de livraison pour ce fournisseur
  const shippingCost = calculateShippingCost(supplierId, totalPrice);
  const totalWithShipping = totalPrice + shippingCost;

  // Calculer la TVA en fonction des taux de chaque produit
  const calculateVAT = () => {
    const vatBreakdown: { [rate: number]: number } = {};
    let totalVAT = 0;

    items.forEach(item => {
      const itemTotalHT = item.product.priceHT * item.quantity;
      const vatRate = item.product.vatRate;
      const itemVAT = itemTotalHT * (vatRate / 100);
      
      vatBreakdown[vatRate] = (vatBreakdown[vatRate] || 0) + itemVAT;
      totalVAT += itemVAT;
    });

    // Ajouter la TVA sur les frais de livraison (20%)
    if (shippingCost > 0) {
      const shippingVAT = shippingCost * 0.2;
      vatBreakdown[20] = (vatBreakdown[20] || 0) + shippingVAT;
      totalVAT += shippingVAT;
    }

    return { vatBreakdown, totalVAT };
  };

  const { vatBreakdown, totalVAT } = calculateVAT();
  const totalTTC = totalWithShipping + totalVAT;

  const handleCreateOrder = () => {
    if (!onCreateOrder) return;
    
    if (!sendEmailToSupplier) {
      setShowConfirmDialog(true);
    } else {
      onCreateOrder(supplierId, sendEmailToSupplier);
    }
  };

  const handleConfirmOrder = () => {
    if (!onCreateOrder) return;
    setShowConfirmDialog(false);
    onCreateOrder(supplierId, false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Commande - {supplierName}</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Nombre d'articles</span>
            <span>{totalItems}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Sous-total HT</span>
            <span>{totalPrice.toFixed(2)} €</span>
          </div>
          
          {shippingCost > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Frais de livraison</span>
              <span>{shippingCost.toFixed(2)} €</span>
            </div>
          )}
          
          <div className="flex justify-between font-medium">
            <span className="text-gray-600">Total HT</span>
            <span>{totalWithShipping.toFixed(2)} €</span>
          </div>
          
          {Object.keys(vatBreakdown).length > 1 ? (
            // Afficher le détail par taux de TVA si plusieurs taux
            <>
              {Object.entries(vatBreakdown).map(([rate, amount]) => (
                <div key={rate} className="flex justify-between">
                  <span className="text-gray-600">TVA ({rate}%)</span>
                  <span>{amount.toFixed(2)} €</span>
                </div>
              ))}
              <div className="flex justify-between font-medium">
                <span className="text-gray-600">Total TVA</span>
                <span>{totalVAT.toFixed(2)} €</span>
              </div>
            </>
          ) : (
            // Afficher directement si un seul taux
            <div className="flex justify-between">
              <span className="text-gray-600">
                TVA ({Object.keys(vatBreakdown)[0] || '20'}%)
              </span>
              <span>{totalVAT.toFixed(2)} €</span>
            </div>
          )}
          
          <Separator className="my-3" />
          
          <div className="flex justify-between font-bold">
            <span>Total TTC</span>
            <span>{totalTTC.toFixed(2)} €</span>
          </div>
        </div>
        
        {deliveryDate && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date de livraison souhaitée</span>
              <span>{deliveryDate.toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        )}
        
        {preferredDeliveryDays.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Jours préférés de livraison
              </span>
              <div className="flex flex-wrap gap-1 max-w-xs justify-end">
                {preferredDeliveryDays.map((dayId) => {
                  const day = DELIVERY_DAYS.find(d => d.id === dayId);
                  return day ? (
                    <span key={dayId} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {day.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {deliveryComment && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 font-medium">Commentaire de livraison :</span>
            <p className="text-sm mt-1">{deliveryComment}</p>
          </div>
        )}
        
        {!isTestUser && onCreateOrder && (
          <>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id={`send-email-${supplierId}`}
                  checked={sendEmailToSupplier}
                  onCheckedChange={(checked) => setSendEmailToSupplier(!!checked)}
                />
                <label 
                  htmlFor={`send-email-${supplierId}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center"
                >
                  <Mail className="h-4 w-4 mr-2 text-ozego-blue" />
                  Envoyer automatiquement la commande par email au fournisseur
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-7">
                Si cette option est cochée, votre bon de commande sera envoyé automatiquement par email à {supplierName}.
              </p>
            </div>
            
            {!deliveryDate && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">
                  Date de livraison requise
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Veuillez sélectionner une date de livraison souhaitée avant de valider votre commande.
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              {/* Bouton pour créer une commande récurrente */}
              {onCreateRecurringOrder && (
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => onCreateRecurringOrder(supplierId, items)}
                  disabled={isProcessing}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Créer une commande récurrente
                </Button>
              )}
              
              {/* Bouton de validation de commande */}
              <Button 
                className="w-full bg-ozego-blue hover:bg-ozego-blue/90"
                onClick={handleCreateOrder}
                disabled={isProcessing || !deliveryDate}
              >
                {isProcessing ? (
                  <>Traitement en cours...</>
                ) : (
                  <>
                    Valider cette commande
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
        
        {isTestUser && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">
              Mode Invité
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Vous êtes connecté en tant qu'invité. Vous ne pouvez pas valider de commandes.
            </p>
          </div>
        )}
        
        
      </div>

      {onCreateOrder && (
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmation de commande</AlertDialogTitle>
              <AlertDialogDescription>
                Vous n'avez pas coché l'option d'envoi automatique par email. 
                Cela signifie que votre bon de commande ne sera pas envoyé automatiquement à {supplierName}.
                <br /><br />
                Vous devrez télécharger et envoyer manuellement le bon de commande.
                <br /><br />
                Souhaitez-vous continuer sans envoi automatique ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmOrder}>
                Continuer sans envoi automatique
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default SupplierCartSummary;