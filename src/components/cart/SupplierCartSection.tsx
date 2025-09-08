
import React from 'react';
import { Store, Trash2, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CartItem as CartItemType } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import CartItem from './CartItem';
import { useSupplierReferences } from '@/context/SupplierReferenceContext';

// Mapping des jours en français vers les numéros de jours JavaScript
const dayNameToNumber: Record<string, number> = {
  'sunday': 0,    // Dimanche
  'monday': 1,    // Lundi
  'tuesday': 2,   // Mardi
  'wednesday': 3, // Mercredi
  'thursday': 4,  // Jeudi
  'friday': 5,    // Vendredi
  'saturday': 6,  // Samedi
};

// Données mockées des jours de livraison préférés par fournisseur (fallback)
const defaultPreferredDeliveryDays: string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

interface SupplierCartSectionProps {
  supplierId: string;
  supplierName: string;
  items: CartItemType[];
  totalItems: number;
  deliveryDate?: Date;
  deliveryComment?: string;
  onQuantityChange: (productId: string, supplierId: string, quantity: number) => void;
  onRemoveItem: (productId: string, supplierId: string) => void;
  onClearSupplierCart: (supplierId: string) => void;
  onDeliveryDateChange: (supplierId: string, date: Date | undefined) => void;
  onDeliveryCommentChange: (supplierId: string, comment: string) => void;
}

const SupplierCartSection: React.FC<SupplierCartSectionProps> = ({
  supplierId,
  supplierName,
  items,
  totalItems,
  deliveryDate,
  deliveryComment,
  onQuantityChange,
  onRemoveItem,
  onClearSupplierCart,
  onDeliveryDateChange,
  onDeliveryCommentChange,
}) => {
  const { getSupplierReference } = useSupplierReferences();
  
  // Obtenir les jours de livraison préférés pour ce fournisseur depuis les références
  const supplierRef = getSupplierReference(supplierId);
  const preferredDayNames = supplierRef?.preferredDeliveryDays?.length 
    ? supplierRef.preferredDeliveryDays 
    : defaultPreferredDeliveryDays;
  
  // Convertir les noms de jours en numéros pour la comparaison avec le calendrier
  const preferredDayNumbers = preferredDayNames.map(dayName => dayNameToNumber[dayName]);
  
  // Fonction pour vérifier si une date correspond à un jour de livraison préféré
  const isPreferredDeliveryDay = (date: Date) => {
    const dayOfWeek = date.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    return preferredDayNumbers.includes(dayOfWeek);
  };

  return (
    <AccordionItem value={supplierId} key={supplierId} className="border rounded-lg mb-4 bg-white">
      <AccordionTrigger className="px-4 py-2 hover:no-underline">
        <div className="flex items-center">
          <Store className="h-5 w-5 mr-2 text-gray-600" />
          <span className="font-medium">{supplierName}</span>
          <span className="ml-2 text-sm text-gray-500">
            ({totalItems} article{totalItems > 1 ? 's' : ''})
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead className="text-center">Prix unitaire</TableHead>
                <TableHead className="text-center">Quantité</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <CartItem
                  key={`${supplierId}-${item.productId}`}
                  item={item}
                  supplierId={supplierId}
                  onQuantityChange={onQuantityChange}
                  onRemove={onRemoveItem}
                />
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t bg-gray-50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Date de livraison souhaitée :</span>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[200px] justify-start text-left font-normal",
                      !deliveryDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {deliveryDate ? format(deliveryDate, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={deliveryDate}
                    onSelect={(date) => onDeliveryDateChange(supplierId, date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={fr}
                    modifiers={{
                      preferred: (date) => isPreferredDeliveryDay(date) && date >= new Date()
                    }}
                    modifiersStyles={{
                      preferred: {
                        backgroundColor: 'hsl(var(--primary))',
                        color: 'hsl(var(--primary-foreground))',
                        fontWeight: 'bold'
                      }
                    }}
                    className={cn("p-3 pointer-events-auto")}
                  />
                  <div className="p-3 border-t text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-primary"></div>
                      <span>Jours de livraison préférés du fournisseur</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <Button 
              variant="outline" 
              className="text-red-500 border-red-200 hover:bg-red-50"
              onClick={() => onClearSupplierCart(supplierId)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vider ce panier
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Commentaire de livraison :</span>
            </div>
            <Textarea
              placeholder="Ajoutez un commentaire pour la livraison (adresse spécifique, instructions particulières...)"
              value={deliveryComment || ''}
              onChange={(e) => onDeliveryCommentChange(supplierId, e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SupplierCartSection;
