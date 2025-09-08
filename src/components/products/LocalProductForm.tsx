import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupplierReferences } from '@/context/SupplierReferenceContext';
import { LocalProduct } from '@/context/LocalProductContext';

const localProductSchema = z.object({
  name: z.string().min(1, 'Le nom du produit est requis'),
  reference: z.string().min(1, 'La référence est requise'),
  priceHT: z.number().min(0, 'Le prix doit être positif'),
  packagingUnit: z.string().min(1, 'L\'unité de commande est requise'),
  customSupplierName: z.string().min(1, 'Le fournisseur est requis'),
  customSupplierId: z.string().optional(),
  category: z.enum(['food', 'non-food']),
  origin: z.string().min(1, 'L\'origine est requise'),
  weight: z.number().min(0, 'Le poids doit être positif'),
  vatRate: z.number().min(0).max(100, 'Le taux de TVA doit être entre 0 et 100'),
});

type LocalProductFormValues = z.infer<typeof localProductSchema>;

interface LocalProductFormProps {
  onSubmit: (data: Omit<LocalProduct, 'id' | 'clientId'>) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product?: LocalProduct;
}

const LocalProductForm = ({ onSubmit, isOpen, onOpenChange, product }: LocalProductFormProps) => {
  const { getAvailableSuppliers } = useSupplierReferences();
  const [supplierType, setSupplierType] = useState<'existing' | 'new'>('existing');
  
  const suppliers = getAvailableSuppliers();

  const form = useForm<LocalProductFormValues>({
    resolver: zodResolver(localProductSchema),
    defaultValues: product ? {
      name: product.name,
      reference: product.reference,
      priceHT: product.priceHT,
      packagingUnit: product.packagingUnit,
      customSupplierName: product.customSupplierName,
      customSupplierId: product.customSupplierId,
      category: product.category,
      origin: product.origin,
      weight: product.weight,
      vatRate: product.vatRate,
    } : {
      name: '',
      reference: '',
      priceHT: 0,
      packagingUnit: '',
      customSupplierName: '',
      customSupplierId: '',
      category: 'food',
      origin: '',
      weight: 0,
      vatRate: 20,
    },
  });

  const handleSubmit = (values: LocalProductFormValues) => {
    const productData: Omit<LocalProduct, 'id' | 'clientId'> = {
      name: values.name,
      reference: values.reference,
      priceHT: values.priceHT,
      packagingUnit: values.packagingUnit,
      customSupplierName: values.customSupplierName,
      customSupplierId: values.customSupplierId,
      category: values.category,
      origin: values.origin,
      weight: values.weight,
      vatRate: values.vatRate,
      available: true,
      isOrganic: false,
    };
    
    onSubmit(productData);
    onOpenChange(false);
    form.reset();
  };

  const handleSupplierSelection = (value: string) => {
    if (value === 'new') {
      setSupplierType('new');
      form.setValue('customSupplierId', '');
      form.setValue('customSupplierName', '');
    } else {
      setSupplierType('existing');
      const supplier = suppliers.find(s => s.id === value);
      if (supplier) {
        form.setValue('customSupplierId', supplier.id);
        form.setValue('customSupplierName', supplier.name);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Modifier le produit local' : 'Ajouter un produit local'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du produit *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du produit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Référence *</FormLabel>
                    <FormControl>
                      <Input placeholder="Référence" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priceHT"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix HT (€) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="packagingUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unité de commande *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: kg, pièce, lot" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="food">Alimentaire</SelectItem>
                        <SelectItem value="non-food">Non-alimentaire</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origine *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: France, Italie" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poids (kg) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vatRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taux de TVA (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="20"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <FormItem>
                <FormLabel>Fournisseur *</FormLabel>
                <Select onValueChange={handleSupplierSelection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">Nouveau fournisseur</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
              
              {supplierType === 'new' && (
                <FormField
                  control={form.control}
                  name="customSupplierName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du nouveau fournisseur *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom du fournisseur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {product ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LocalProductForm;