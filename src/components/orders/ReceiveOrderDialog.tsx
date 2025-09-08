
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrder } from '@/context/OrderContext';
import { useInventory } from '@/context/InventoryContext';
import { useProducts } from '@/context/ProductContext';
import { useToast } from '@/hooks/use-toast';
import { OrderItem, LitigeStatus, LitigeSouhait } from '@/types';
import { generateLitigePDF } from '@/utils/pdfUtils';
import { FileText } from 'lucide-react';

interface ReceiveOrderDialogProps {
  orderItem: OrderItem;
  orderId: string;
  order: any; // Ajout de l'ordre complet pour le PDF
  children: React.ReactNode;
}

const ReceiveOrderDialog = ({ orderItem, orderId, order, children }: ReceiveOrderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showLitigeConfirmDialog, setShowLitigeConfirmDialog] = useState(false);
  const [receivedQuantity, setReceivedQuantity] = useState(orderItem.quantity);
  const [receivedPrice, setReceivedPrice] = useState(orderItem.priceHT);
  const [litigeStatus, setLitigeStatus] = useState<LitigeStatus>('none');
  const [litigeComment, setLitigeComment] = useState('');
  const [litigeSouhait, setLitigeSouhait] = useState<LitigeSouhait>('remboursement');
  const { markItemAsReceived } = useOrder();
  const { addStock } = useInventory();
  const { getProductById } = useProducts();
  const { toast } = useToast();

  const handleReceive = () => {
    if (receivedQuantity <= 0) {
      toast({
        title: "Erreur",
        description: "La quantité reçue doit être supérieure à 0",
        variant: "destructive"
      });
      return;
    }

    if (receivedPrice <= 0) {
      toast({
        title: "Erreur",
        description: "Le prix appliqué doit être supérieur à 0",
        variant: "destructive"
      });
      return;
    }

    // Si un litige est créé, demander confirmation que le bon de litige a été généré
    if (litigeStatus === 'create_litige') {
      setShowLitigeConfirmDialog(true);
      return;
    }

    confirmReceive();
  };

  const confirmReceive = () => {

    // Marquer l'article comme réceptionné dans la commande avec les informations de litige
    markItemAsReceived(orderId, orderItem.productId, {
      receivedQuantity,
      receivedPrice,
      litigeStatus,
      litigeComment: litigeStatus !== 'none' ? litigeComment : undefined,
      litigeSouhait: litigeStatus !== 'none' ? litigeSouhait : undefined
    });
    
    // Ajouter au stock d'inventaire la quantité réellement reçue
    // Utiliser le prix appliqué seulement s'il est inférieur au prix commandé, sinon utiliser le prix commandé
    const inventoryPrice = receivedPrice < orderItem.priceHT ? receivedPrice : orderItem.priceHT;
    const priceComment = receivedPrice < orderItem.priceHT 
      ? `Réception commande #${orderId.slice(-5)} - Prix appliqué: ${receivedPrice.toFixed(2)}€ HT (inférieur au prix commandé: ${orderItem.priceHT.toFixed(2)}€ HT)`
      : `Réception commande #${orderId.slice(-5)} - Prix commandé: ${orderItem.priceHT.toFixed(2)}€ HT`;
    
    addStock(
      orderItem.productId,
      receivedQuantity,
      priceComment,
      orderId
    );

    // Messages adaptés selon le statut
    if (litigeStatus !== 'none') {
      toast({
        title: "Produit réceptionné avec litige",
        description: `${orderItem.productName}: ${receivedQuantity} reçu(s) - Litige en cours`,
        variant: "destructive"
      });
    } else if (receivedQuantity !== orderItem.quantity || receivedPrice !== orderItem.priceHT) {
      toast({
        title: "Produit réceptionné",
        description: `${orderItem.productName}: ${receivedQuantity} reçu(s) (${orderItem.quantity} commandé(s))`,
      });
    } else {
      toast({
        title: "Produit réceptionné",
        description: `${orderItem.productName}: ${receivedQuantity} unité(s) ajoutée(s) au stock`,
      });
    }

    setOpen(false);
    // Reset pour la prochaine fois
    setReceivedQuantity(orderItem.quantity);
    setReceivedPrice(orderItem.priceHT);
    setLitigeStatus('none');
    setLitigeComment('');
    setLitigeSouhait('remboursement');
  };

  const handleConfirmReceiveWithLitige = () => {
    setShowLitigeConfirmDialog(false);
    confirmReceive();
  };

  const handleGenerateLitigePDF = () => {
    // Récupérer le produit complet pour avoir le code produit
    const fullProduct = getProductById(orderItem.productId);
    
    // Créer un objet temporaire avec les données actuelles pour le PDF
    const tempOrderItem = {
      ...orderItem,
      receivedQuantity,
      receivedPrice,
      litigeStatus,
      litigeComment,
      litigeSouhait
    };
    
    generateLitigePDF(order, tempOrderItem, fullProduct);
    
    toast({
      title: "Bon de litige généré",
      description: "Le PDF du bon de litige a été téléchargé",
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Réceptionner le produit</DialogTitle>
            <DialogDescription>
              Indiquez les informations de réception pour ce produit.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="product-name">Produit</Label>
              <Input 
                id="product-name"
                value={orderItem.productName}
                readOnly
                className="bg-muted"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ordered-quantity">Qté commandée</Label>
                <Input 
                  id="ordered-quantity"
                  value={orderItem.quantity}
                  readOnly
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ordered-price">Prix commandé (€ HT)</Label>
                <Input 
                  id="ordered-price"
                  value={orderItem.priceHT.toFixed(2)}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="received-quantity">Quantité reçue *</Label>
                <Input 
                  id="received-quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={receivedQuantity}
                  onChange={(e) => setReceivedQuantity(parseInt(e.target.value) || 0)}
                  placeholder="Qté reçue"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="received-price">Prix appliqué (€ HT) *</Label>
                <Input 
                  id="received-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={receivedPrice}
                  onChange={(e) => setReceivedPrice(parseFloat(e.target.value) || 0)}
                  placeholder="Prix appliqué"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="litige-status">Statut de litige</Label>
              <Select value={litigeStatus} onValueChange={(value: LitigeStatus) => setLitigeStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun litige</SelectItem>
                  <SelectItem value="create_litige">Créer un bon de litige</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {litigeStatus !== 'none' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="litige-souhait">Souhait pour le litige</Label>
                  <Select value={litigeSouhait} onValueChange={(value: LitigeSouhait) => setLitigeSouhait(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le souhait" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remboursement">Remboursement</SelectItem>
                      <SelectItem value="retour_fournisseur">Retour fournisseur</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="litige-comment">Commentaire du litige</Label>
                  <Textarea 
                    id="litige-comment"
                    value={litigeComment}
                    onChange={(e) => setLitigeComment(e.target.value)}
                    placeholder="Décrivez le problème rencontré..."
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleGenerateLitigePDF}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Générer bon de litige
                  </Button>
                </div>
              </>
            )}
            
            {(receivedQuantity !== orderItem.quantity || receivedPrice !== orderItem.priceHT) && (
              <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-950 p-2 rounded">
                ⚠️ Différence détectée par rapport à la commande initiale
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleReceive}>
              Confirmer la réception
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation pour le litige */}
      <Dialog open={showLitigeConfirmDialog} onOpenChange={setShowLitigeConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmation de litige</DialogTitle>
            <DialogDescription>
              Vous avez indiqué vouloir créer un bon de litige pour ce produit.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="text-sm text-orange-600 bg-orange-50 dark:bg-orange-950 p-3 rounded">
              <strong>Important :</strong> Avez-vous bien généré le bon de litige en cliquant sur le bouton "Générer bon de litige" ?
            </div>
            
            <p className="text-sm text-muted-foreground">
              Le bon de litige doit être généré avant de confirmer la réception du produit pour assurer un suivi proper du litige.
            </p>
          </div>
          
          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowLitigeConfirmDialog(false)}
              className="order-2 sm:order-1"
            >
              Retour (générer le bon de litige)
            </Button>
            <Button 
              onClick={handleConfirmReceiveWithLitige}
              className="order-1 sm:order-2"
            >
              Confirmer (bon de litige généré)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReceiveOrderDialog;
