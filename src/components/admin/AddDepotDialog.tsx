
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Depot } from '@/types';

const depotSchema = z.object({
  supplierId: z.string().min(1, 'Veuillez sélectionner un fournisseur'),
  name: z.string().min(1, 'Le nom du dépôt est requis'),
  address: z.string().min(1, 'L\'adresse est requise'),
  city: z.string().min(1, 'La ville est requise'),
  postalCode: z.string().min(5, 'Le code postal doit faire au moins 5 caractères'),
  region: z.string().min(1, 'La région est requise'),
  phone: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  isActive: z.boolean(),
  deliveryZones: z.string().min(1, 'Au moins une zone de livraison est requise')
});

type DepotFormData = z.infer<typeof depotSchema>;

interface AddDepotDialogProps {
  suppliers: { id: string; name: string }[];
  onAddDepot: (depot: Omit<Depot, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const AddDepotDialog = ({ suppliers, onAddDepot }: AddDepotDialogProps) => {
  const [open, setOpen] = useState(false);
  
  const form = useForm<DepotFormData>({
    resolver: zodResolver(depotSchema),
    defaultValues: {
      supplierId: '',
      name: '',
      address: '',
      city: '',
      postalCode: '',
      region: '',
      phone: '',
      email: '',
      isActive: true,
      deliveryZones: ''
    }
  });

  const onSubmit = (data: DepotFormData) => {
    const supplier = suppliers.find(s => s.id === data.supplierId);
    if (!supplier) return;

    const depot: Omit<Depot, 'id' | 'createdAt' | 'updatedAt'> = {
      supplierId: data.supplierId,
      supplierName: supplier.name,
      name: data.name,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      region: data.region,
      phone: data.phone || undefined,
      email: data.email || undefined,
      isActive: data.isActive,
      deliveryZones: data.deliveryZones.split(',').map(zone => zone.trim()).filter(Boolean)
    };

    onAddDepot(depot);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un dépôt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau dépôt</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fournisseur</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un fournisseur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du dépôt</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Dépôt Principal Paris" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Rue de la Paix" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <Input placeholder="Paris" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code postal</FormLabel>
                    <FormControl>
                      <Input placeholder="75000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Région</FormLabel>
                  <FormControl>
                    <Input placeholder="Île-de-France" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="01 23 45 67 89" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="depot@exemple.fr" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="deliveryZones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zones de livraison</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="75001, 75002, 75003, 92000, 93000..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    Séparez les codes postaux par des virgules
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Dépôt actif</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Le dépôt peut recevoir et traiter des commandes
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Créer le dépôt
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepotDialog;
