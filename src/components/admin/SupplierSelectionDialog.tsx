
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings } from 'lucide-react';
import { User } from '@/types';
import { useProducts } from '@/context/ProductContext';

interface SupplierSelectionDialogProps {
  user: User;
  onUpdateUser: (userId: string, authorizedSuppliers: string[]) => void;
}

const SupplierSelectionDialog = ({ user, onUpdateUser }: SupplierSelectionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>(user.authorizedSuppliers || []);
  const { products } = useProducts();

  // Get unique suppliers from products
  const availableSuppliers = products.reduce((acc, product) => {
    if (!acc.find(s => s.id === product.supplierId)) {
      acc.push({
        id: product.supplierId,
        name: product.supplierName
      });
    }
    return acc;
  }, [] as { id: string; name: string }[]);

  useEffect(() => {
    setSelectedSuppliers(user.authorizedSuppliers || []);
  }, [user.authorizedSuppliers]);

  const handleSupplierToggle = (supplierId: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(supplierId)
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const handleSave = () => {
    onUpdateUser(user.id, selectedSuppliers);
    setOpen(false);
  };

  if (user.role !== 'client') {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Fournisseurs ({selectedSuppliers.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Fournisseurs autorisés pour {user.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <p className="text-sm text-muted-foreground">
            Sélectionnez les fournisseurs auprès desquels ce client peut passer commande.
          </p>
          {availableSuppliers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun fournisseur disponible. Ajoutez des produits pour voir les fournisseurs.
            </p>
          ) : (
            <div className="space-y-3">
              {availableSuppliers.map((supplier) => (
                <div key={supplier.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={supplier.id}
                    checked={selectedSuppliers.includes(supplier.id)}
                    onCheckedChange={() => handleSupplierToggle(supplier.id)}
                  />
                  <label
                    htmlFor={supplier.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {supplier.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierSelectionDialog;
