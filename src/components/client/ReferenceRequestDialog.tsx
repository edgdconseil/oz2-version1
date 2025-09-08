import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { Building2, Mail, Phone, User, Send } from 'lucide-react';

interface ReferenceRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SupplierInfo {
  id: string;
  name: string;
  isReferenced: boolean;
}

export const ReferenceRequestDialog: React.FC<ReferenceRequestDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { user } = useAuth();
  const { products } = useProducts();
  const { toast } = useToast();
  
  const [suppliers, setSuppliers] = useState<SupplierInfo[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.zapier.com/hooks/catch/your-webhook-url'); // À configurer côté admin
  const [isLoading, setIsLoading] = useState(false);

  // Initialiser les données utilisateur
  useEffect(() => {
    if (user && open) {
      setName(user.name || '');
      setEmail(user.email || '');
      // Le téléphone n'est pas dans le type User, on le laisse vide
      setPhone('');
    }
  }, [user, open]);

  // Récupérer la liste des fournisseurs
  useEffect(() => {
    if (open) {
      // Obtenir tous les fournisseurs uniques
      const uniqueSuppliers = Array.from(
        new Map(products.map(p => [p.supplierId, { id: p.supplierId, name: p.supplierName }])).values()
      );

      // Pour cette démo, on considère que le client n'est référencé que chez quelques fournisseurs
      // En réalité, cette information devrait venir d'une base de données
      const referencedSupplierIds = ['supplier-1', 'supplier-2']; // À adapter selon votre logique
      
      const suppliersWithStatus = uniqueSuppliers.map(supplier => ({
        ...supplier,
        isReferenced: referencedSupplierIds.includes(supplier.id)
      }));

      setSuppliers(suppliersWithStatus);
    }
  }, [products, open]);

  const handleSupplierToggle = (supplierId: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId)
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || selectedSuppliers.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires et sélectionner au moins un fournisseur.",
        variant: "destructive",
      });
      return;
    }


    setIsLoading(true);

    try {
      const selectedSupplierNames = suppliers
        .filter(s => selectedSuppliers.includes(s.id))
        .map(s => s.name);

      const requestData = {
        timestamp: new Date().toISOString(),
        type: 'reference_request',
        client: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        suppliers: selectedSupplierNames,
        comment: comment.trim(),
        triggered_from: window.location.origin,
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(requestData),
      });

      toast({
        title: "Demande envoyée",
        description: "Votre demande de référencement a été envoyée à l'administrateur. Vous recevrez une réponse sous 48h.",
      });

      // Réinitialiser le formulaire
      setSelectedSuppliers([]);
      setComment('');
      onOpenChange(false);

    } catch (error) {
      console.error("Error sending reference request:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nonReferencedSuppliers = suppliers.filter(s => !s.isReferenced);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Demande de référencement fournisseur
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                Vos informations
              </CardTitle>
              <CardDescription className="text-xs">
                Vérifiez et modifiez vos informations si nécessaire
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom et prénom"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Votre numéro de téléphone"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sélection des fournisseurs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Fournisseurs disponibles
              </CardTitle>
              <CardDescription className="text-xs">
                Sélectionnez les fournisseurs pour lesquels vous souhaitez être référencé
              </CardDescription>
            </CardHeader>
            <CardContent>
              {nonReferencedSuppliers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Vous êtes déjà référencé chez tous les fournisseurs disponibles.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {nonReferencedSuppliers.map((supplier) => (
                    <div
                      key={supplier.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedSuppliers.includes(supplier.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted/50'
                      }`}
                      onClick={() => handleSupplierToggle(supplier.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{supplier.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          Non référencé
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedSuppliers.length > 0 && (
                <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm font-medium mb-2">Fournisseurs sélectionnés :</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSuppliers.map(supplierId => {
                      const supplier = suppliers.find(s => s.id === supplierId);
                      return supplier ? (
                        <Badge key={supplierId} variant="default" className="text-xs">
                          {supplier.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commentaire */}
          <div>
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ajoutez un commentaire pour préciser votre demande..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || selectedSuppliers.length === 0}
            >
              {isLoading ? "Envoi en cours..." : "Envoyer la demande"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};