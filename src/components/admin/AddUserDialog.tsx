
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus } from 'lucide-react';
import { User } from '@/types';

const userSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  organization: z.string().optional(),
  role: z.enum(['client', 'supplier', 'guest'] as const),
  clientNumber: z.string().optional(),
  deliveryAddress: z.string().optional(),
  phone: z.string().optional(),
  accessExpiryDate: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface AddUserDialogProps {
  onAddUser: (user: Omit<User, 'id' | 'isActive'>) => void;
}

const AddUserDialog = ({ onAddUser }: AddUserDialogProps) => {
  const [open, setOpen] = useState(false);
  
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      organization: '',
      role: 'client',
      clientNumber: '',
      deliveryAddress: '',
      phone: '',
      accessExpiryDate: '',
    },
  });

  const onSubmit = (data: UserFormData) => {
    const userData: Omit<User, 'id' | 'isActive'> = {
      name: data.name,
      email: data.email,
      role: data.role,
      organization: data.organization || undefined,
      clientNumber: data.clientNumber || undefined,
      deliveryAddress: data.deliveryAddress || undefined,
      phone: data.phone || undefined,
      accessExpiryDate: data.accessExpiryDate || undefined,
    };
    
    onAddUser(userData);
    form.reset();
    setOpen(false);
  };

  const watchedRole = form.watch('role');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} />
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
                    <Input placeholder="jean.dupont@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'utilisateur</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="supplier">Fournisseur</SelectItem>
                      <SelectItem value="guest">Invité</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organisation (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'entreprise, école, restaurant..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Champs supplémentaires pour les clients et invités */}
            {(watchedRole === 'client' || watchedRole === 'guest') && (
              <>
                <FormField
                  control={form.control}
                  name="clientNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N° de client</FormLabel>
                      <FormControl>
                        <Input placeholder="CLI001234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N° de téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="01 23 45 67 89" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deliveryAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse de livraison</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="123 Rue de la Paix&#10;75001 Paris&#10;France" 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {/* Date limite d'accès pour les invités */}
            {watchedRole === 'guest' && (
              <FormField
                control={form.control}
                name="accessExpiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date limite d'accès</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Créer l'utilisateur
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
