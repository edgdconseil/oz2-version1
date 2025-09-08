
import { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Depot } from '@/types';

const editDepotSchema = z.object({
  name: z.string().min(1, 'Le nom du dépôt est requis'),
  address: z.string().min(1, 'L\'adresse est requise'),
  city: z.string().min(1, 'La ville est requise'),
  postalCode: z.string().min(5, 'Le code postal doit faire au moins 5 caractères'),
  region: z.string().min(1, 'La région est requise'),
  phone: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  deliveryZones: z.string().min(1, 'Au moins une zone de livraison est requise')
});

type EditDepotFormData = z.infer<typeof editDepotSchema>;

interface EditDepotDialogProps {
  depot: Depot;
  suppliers: { id: string; name: string }[];
  onEditDepot: (depotId: string, data: Partial<Depot>) => void;
}

const EditDepotDialog = ({ depot, onEditDepot }: EditDepotDialogProps) => {
  const [open, setOpen] = useState(false);
  
  const form = useForm<EditDepotFormData>({
    resolver: zodResolver(editDepotSchema),
    defaultValues: {
      name: depot.name,
      address: depot.address,
      city: depot.city,
      postalCode: depot.postalCode,
      region: depot.region,
      phone: depot.phone || '',
      email: depot.email || '',
      deliveryZones: depot.deliveryZones.join(', ')
    }
  });

  const onSubmit = (data: EditDepotFormData) => {
    const updatedData: Partial<Depot> = {
      name: data.name,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      region: data.region,
      phone: data.phone || undefined,
      email: data.email || undefined,
      deliveryZones: data.deliveryZones.split(',').map(zone => zone.trim()).filter(Boolean)
    };

    onEditDepot(depot.id, updatedData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le dépôt</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du dépôt</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                    <Input {...field} />
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
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepotDialog;
