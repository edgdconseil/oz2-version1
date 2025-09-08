
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useShipping } from '@/context/ShippingContext';
import { useProducts } from '@/context/ProductContext';
import { ShippingTier } from '@/types';
import { Truck, Plus, Save, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ShippingCosts = () => {
  const { supplierShippings, getSupplierShipping, createSupplierShipping, updateSupplierShipping, deleteSupplierShipping } = useShipping();
  const { products } = useProducts();
  const { toast } = useToast();
  
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null);
  const [editingTiers, setEditingTiers] = useState<ShippingTier[]>([]);

  // Obtenir tous les fournisseurs uniques depuis les produits
  const suppliers = products.reduce((acc, product) => {
    if (!acc.find(s => s.id === product.supplierId)) {
      acc.push({
        id: product.supplierId,
        name: product.supplierName
      });
    }
    return acc;
  }, [] as { id: string; name: string }[]);

  const handleEditSupplier = (supplierId: string) => {
    const existingShipping = getSupplierShipping(supplierId);
    if (existingShipping) {
      setEditingTiers([...existingShipping.tiers]);
    } else {
      // Créer des paliers par défaut
      setEditingTiers([
        { id: '', minAmount: 0, maxAmount: 50, shippingCost: 15 },
        { id: '', minAmount: 50, maxAmount: 100, shippingCost: 10 },
        { id: '', minAmount: 100, maxAmount: 200, shippingCost: 5 },
        { id: '', minAmount: 200, shippingCost: 0 }
      ]);
    }
    setEditingSupplier(supplierId);
  };

  const handleSaveShipping = () => {
    if (!editingSupplier) return;

    const supplier = suppliers.find(s => s.id === editingSupplier);
    if (!supplier) return;

    // Valider les paliers
    const sortedTiers = [...editingTiers].sort((a, b) => a.minAmount - b.minAmount);
    
    for (let i = 0; i < sortedTiers.length - 1; i++) {
      if (sortedTiers[i].maxAmount && sortedTiers[i].maxAmount! <= sortedTiers[i].minAmount) {
        toast({
          title: "Erreur de validation",
          description: "Le montant maximum doit être supérieur au montant minimum.",
          variant: "destructive"
        });
        return;
      }
      
      if (sortedTiers[i].maxAmount && sortedTiers[i + 1].minAmount < sortedTiers[i].maxAmount!) {
        toast({
          title: "Erreur de validation",
          description: "Les paliers doivent être contigus sans chevauchement.",
          variant: "destructive"
        });
        return;
      }
    }

    const existingShipping = getSupplierShipping(editingSupplier);
    if (existingShipping) {
      updateSupplierShipping(editingSupplier, editingTiers);
    } else {
      createSupplierShipping(editingSupplier, supplier.name, editingTiers);
    }

    setEditingSupplier(null);
    setEditingTiers([]);
  };

  const handleCancelEdit = () => {
    setEditingSupplier(null);
    setEditingTiers([]);
  };

  const updateTier = (index: number, field: keyof ShippingTier, value: number) => {
    const newTiers = [...editingTiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setEditingTiers(newTiers);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Truck className="h-8 w-8 text-ozego-primary" />
        <div>
          <h1 className="text-3xl font-bold text-ozego-text">Frais de livraison</h1>
          <p className="text-ozego-secondary">Configurez les frais de livraison par paliers pour chaque fournisseur</p>
        </div>
      </div>

      <div className="grid gap-6">
        {suppliers.map(supplier => {
          const shipping = getSupplierShipping(supplier.id);
          const isEditing = editingSupplier === supplier.id;

          return (
            <Card key={supplier.id} className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-ozego-text">{supplier.name}</CardTitle>
                    <CardDescription>
                      {shipping ? 'Frais de livraison configurés' : 'Aucun frais de livraison configuré'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {shipping && !isEditing && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Configuré
                      </Badge>
                    )}
                    {!isEditing && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditSupplier(supplier.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {shipping ? 'Modifier' : 'Configurer'}
                      </Button>
                    )}
                    {shipping && !isEditing && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteSupplierShipping(supplier.id)}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="text-sm text-ozego-secondary mb-4">
                      Configurez jusqu'à 4 paliers de frais de livraison. Les montants doivent être en euros et être contigus.
                    </div>
                    
                    {editingTiers.map((tier, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-border rounded-lg">
                        <div>
                          <Label htmlFor={`min-${index}`}>Montant minimum (€)</Label>
                          <Input
                            id={`min-${index}`}
                            type="number"
                            value={tier.minAmount}
                            onChange={(e) => updateTier(index, 'minAmount', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`max-${index}`}>
                            Montant maximum (€)
                            {index === editingTiers.length - 1 && (
                              <span className="text-ozego-secondary text-xs ml-1">(optionnel pour le dernier palier)</span>
                            )}
                          </Label>
                          <Input
                            id={`max-${index}`}
                            type="number"
                            value={tier.maxAmount || ''}
                            onChange={(e) => updateTier(index, 'maxAmount', parseFloat(e.target.value) || undefined)}
                            placeholder={index === editingTiers.length - 1 ? "Illimité" : ""}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`cost-${index}`}>Frais de livraison (€)</Label>
                          <Input
                            id={`cost-${index}`}
                            type="number"
                            step="0.01"
                            value={tier.shippingCost}
                            onChange={(e) => updateTier(index, 'shippingCost', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                        
                        <div className="flex items-end">
                          <div className="text-sm text-ozego-secondary">
                            <div>Palier {index + 1}</div>
                            <div className="font-medium text-ozego-text">
                              {tier.minAmount}€ - {tier.maxAmount ? `${tier.maxAmount}€` : '∞'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center space-x-2 pt-4">
                      <Button onClick={handleSaveShipping}>
                        <Save className="h-4 w-4 mr-1" />
                        Enregistrer
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : shipping ? (
                  <div className="space-y-3">
                    {shipping.tiers
                      .sort((a, b) => a.minAmount - b.minAmount)
                      .map((tier, index) => (
                        <div key={tier.id} className="flex items-center justify-between p-3 bg-ozego-accent rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline">Palier {index + 1}</Badge>
                            <span className="text-ozego-text">
                              {formatCurrency(tier.minAmount)} - {tier.maxAmount ? formatCurrency(tier.maxAmount) : '∞'}
                            </span>
                          </div>
                          <div className="font-medium text-ozego-primary">
                            {tier.shippingCost === 0 ? 'Gratuit' : formatCurrency(tier.shippingCost)}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-ozego-secondary">
                    <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun frais de livraison configuré</p>
                    <p className="text-sm">Cliquez sur "Configurer" pour ajouter des paliers de frais de livraison</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {suppliers.length === 0 && (
        <Card className="border-border">
          <CardContent className="text-center py-12">
            <Truck className="h-16 w-16 mx-auto mb-4 text-ozego-secondary opacity-50" />
            <h3 className="text-lg font-medium text-ozego-text mb-2">Aucun fournisseur trouvé</h3>
            <p className="text-ozego-secondary">
              Les frais de livraison sont configurés par fournisseur. Ajoutez d'abord des produits avec des fournisseurs.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShippingCosts;
