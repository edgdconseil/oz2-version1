
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useOrder } from '@/context/OrderContext';
import { useInventory } from '@/context/InventoryContext';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types';
import { Truck, Package } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';

interface ReceiveAllOrderDialogProps {
  order: Order;
  children: React.ReactNode;
}

const ReceiveAllOrderDialog = ({ order, children }: ReceiveAllOrderDialogProps) => {
  const [open, setOpen] = useState(false);
  const { markAllItemsAsReceived } = useOrder();
  const { addStock } = useInventory();
  const { toast } = useToast();
  const { products } = useProducts();

  const unrecevedItems = order.items.filter(item => !item.received);

  const handleReceiveAll = () => {
    // Marquer tous les articles comme réceptionnés dans la commande
    markAllItemsAsReceived(order.id);
    
    // Ajouter tous les articles non reçus au stock d'inventaire avec conversion
    unrecevedItems.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      const coefficient = product?.packagingCoefficient || 1;
      const convertedQuantity = item.quantity * coefficient;
      
      addStock(
        item.productId,
        convertedQuantity,
        `Réception commande #${order.id.slice(-5)}`,
        order.id
      );
    });

    const totalStockAdded = unrecevedItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      const coefficient = product?.packagingCoefficient || 1;
      return total + (item.quantity * coefficient);
    }, 0);

    toast({
      title: "Commande réceptionnée",
      description: `${totalStockAdded} unité(s) ajoutée(s) au stock`,
    });

    setOpen(false);
  };

  if (unrecevedItems.length === 0) {
    return null; // Ne pas afficher le bouton si tous les produits sont déjà reçus
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Réceptionner tous les produits
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir réceptionner tous les produits restants de cette commande ?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Produits à réceptionner :</h4>
            <div className="space-y-1">
              {unrecevedItems.map(item => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.productName}</span>
                  <span className="font-medium">{item.quantity} unité(s)</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Ces produits seront automatiquement ajoutés à votre stock d'inventaire.
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleReceiveAll} className="bg-ozego-primary hover:bg-ozego-primary/90">
            <Truck className="h-4 w-4 mr-2" />
            Réceptionner tout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiveAllOrderDialog;
