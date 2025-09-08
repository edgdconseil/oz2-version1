
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useInventory } from '@/context/InventoryContext';
import { useToast } from '@/hooks/use-toast';
import { InventoryItem } from '@/types';
import { Minus, Calendar } from 'lucide-react';

interface ConsumeStockDialogProps {
  inventoryItem: InventoryItem;
}

const ConsumeStockDialog = ({ inventoryItem }: ConsumeStockDialogProps) => {
  const [open, setOpen] = useState(false);
  const [consumeQuantity, setConsumeQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [consumeDate, setConsumeDate] = useState(new Date().toISOString().split('T')[0]);
  const { removeStock } = useInventory();
  const { toast } = useToast();

  const handleConsume = () => {
    if (consumeQuantity <= 0) {
      toast({
        title: "Erreur",
        description: "La quantité à consommer doit être supérieure à 0",
        variant: "destructive"
      });
      return;
    }

    if (consumeQuantity > inventoryItem.currentStock) {
      toast({
        title: "Erreur",
        description: `Stock insuffisant. Stock actuel: ${inventoryItem.currentStock} ${inventoryItem.unit}`,
        variant: "destructive"
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez indiquer la raison de la consommation",
        variant: "destructive"
      });
      return;
    }

    removeStock(inventoryItem.productId, consumeQuantity, `${reason.trim()} (${new Date(consumeDate).toLocaleDateString('fr-FR')})`);
    
    setOpen(false);
    setConsumeQuantity(1);
    setReason('');
    setConsumeDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Minus className="h-4 w-4 mr-1" />
          Consommer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Consommer du stock</DialogTitle>
          <DialogDescription>
            Indiquez la quantité consommée et la raison.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Produit</Label>
            <Input 
              id="product-name"
              value={`${inventoryItem.productName} (${inventoryItem.productReference})`}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="current-stock">Stock actuel</Label>
            <Input 
              id="current-stock"
              value={`${inventoryItem.currentStock} ${inventoryItem.unit}`}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="consume-quantity">Quantité à consommer</Label>
            <Input 
              id="consume-quantity"
              type="number"
              min="1"
              max={inventoryItem.currentStock}
              step="1"
              value={consumeQuantity}
              onChange={(e) => setConsumeQuantity(parseInt(e.target.value) || 1)}
              placeholder="Quantité à consommer"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="consume-date">Date de consommation</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="consume-date"
                type="date"
                value={consumeDate}
                onChange={(e) => setConsumeDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Raison de la consommation</Label>
            <Input 
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Production, Commande client, Péremption..."
            />
          </div>
          
          {consumeQuantity > 0 && (
            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              Stock restant après consommation : {Math.max(0, inventoryItem.currentStock - consumeQuantity)} {inventoryItem.unit}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleConsume}>
            Confirmer la consommation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsumeStockDialog;
