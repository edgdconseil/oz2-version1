import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { InventoryItem, Product } from '@/types';
import { StockError, StockErrorType, stockErrorLabels } from '@/types/stock-error';
import { AlertTriangle } from 'lucide-react';

interface ReportStockErrorDialogProps {
  inventoryItem: InventoryItem;
  products: Product[];
}

const ReportStockErrorDialog = ({ inventoryItem, products }: ReportStockErrorDialogProps) => {
  const [open, setOpen] = useState(false);
  const [errorType, setErrorType] = useState<StockErrorType>('expired');
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const product = products.find(p => p.id === inventoryItem.productId);

  const handleReportError = () => {
    if (quantity <= 0) {
      toast({
        title: "Erreur",
        description: "La quantité doit être supérieure à 0",
        variant: "destructive"
      });
      return;
    }

    if (quantity > inventoryItem.currentStock) {
      toast({
        title: "Erreur",
        description: `Quantité trop élevée. Stock actuel: ${inventoryItem.currentStock} ${inventoryItem.unit}`,
        variant: "destructive"
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez décrire le problème",
        variant: "destructive"
      });
      return;
    }

    const stockError: StockError = {
      id: `error-${Date.now()}-${Math.random()}`,
      productId: inventoryItem.productId,
      productName: inventoryItem.productName,
      productReference: inventoryItem.productReference,
      errorType,
      quantity,
      unit: inventoryItem.unit,
      description: description.trim(),
      dateReported: new Date().toISOString(),
      reportedBy: 'system',
      supplierName: inventoryItem.supplierName,
      estimatedValue: (product?.priceHT || 0) * quantity
    };

    // Sauvegarder l'erreur dans localStorage
    const existingErrors = JSON.parse(localStorage.getItem('stockErrors') || '[]');
    existingErrors.push(stockError);
    localStorage.setItem('stockErrors', JSON.stringify(existingErrors));

    toast({
      title: "Erreur de stock signalée",
      description: `${stockErrorLabels[errorType]} reportée pour ${quantity} ${inventoryItem.unit} de ${inventoryItem.productName}`,
    });
    
    setOpen(false);
    setErrorType('expired');
    setQuantity(1);
    setDescription('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <AlertTriangle className="h-4 w-4 mr-1" />
          Signaler erreur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Signaler une erreur de stock</DialogTitle>
          <DialogDescription>
            Signaler un problème avec ce produit (péremption, dégât, etc.).
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="product-info">Produit</Label>
            <Input 
              id="product-info"
              value={`${inventoryItem.productName} (${inventoryItem.productReference})`}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="error-type">Type d'erreur</Label>
            <Select value={errorType} onValueChange={(value: StockErrorType) => setErrorType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type d'erreur" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(stockErrorLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="error-quantity">Quantité concernée</Label>
            <Input 
              id="error-quantity"
              type="number"
              min="1"
              max={inventoryItem.currentStock}
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
            <p className="text-sm text-gray-500">
              Stock disponible: {inventoryItem.currentStock} {inventoryItem.unit}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="error-description">Description du problème</Label>
            <Textarea 
              id="error-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez précisément le problème (date de péremption, type de dégât, etc.)"
              rows={3}
            />
          </div>
          
          {product && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              Valeur estimée perdue : {((product.priceHT || 0) * quantity).toFixed(2)} € HT
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleReportError} variant="destructive">
            Signaler l'erreur
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportStockErrorDialog;