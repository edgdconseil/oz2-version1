
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Product } from '@/types';
import { useProducts } from '@/context/ProductContext';
import { useToast } from '@/hooks/use-toast';

// Define the product form schema
export const productFormSchema = z.object({
  name: z.string().min(3, { message: "Le nom doit comporter au moins 3 caractères" }),
  supplierDesignation: z.string().min(3, { message: "La désignation fournisseur doit comporter au moins 3 caractères" }),
  reference: z.string().min(3, { message: "La référence doit comporter au moins 3 caractères" }),
  priceHT: z.coerce.number().positive({ message: "Le prix doit être supérieur à 0" }),
  negotiatedPrice: z.coerce.number().positive().optional(),
  category: z.enum(['food', 'non-food'] as const),
  grouping: z.string().optional(),
  caliber: z.string().optional(),
  origin: z.string().min(2, { message: "L'origine doit comporter au moins 2 caractères" }),
  brand: z.string().optional(),
  weight: z.coerce.number().positive({ message: "Le poids doit être supérieur à 0" }),
  isEgalim: z.boolean(),
  otherLabels: z.string().optional(),
  vatRate: z.coerce.number().min(0, { message: "Le taux de TVA doit être positif ou nul" }),
  packagingUnit: z.string().min(1, { message: "L'unité de conditionnement est requise" }),
  packagingCoefficient: z.coerce.number().positive().optional(),
  negotiationUnit: z.string().optional(),
  technicalSheetUrl: z.string().url({ message: "L'URL de la fiche technique doit être valide" }).optional().or(z.literal('')),
  imageUrl: z.string().url({ message: "L'URL de l'image doit être valide" }).optional().or(z.literal('')),
  ozegoId: z.string().min(5, { message: "L'identifiant Ozego doit comporter au moins 5 caractères" }),
  available: z.boolean(),
  isOrganic: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

interface UseProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export const useProductForm = ({ product, onSuccess }: UseProductFormProps = {}) => {
  const { updateProduct, addProduct } = useProducts();
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? {
      name: product.name,
      supplierDesignation: product.supplierDesignation || '',
      reference: product.reference || '',
      priceHT: product.priceHT,
      negotiatedPrice: product.negotiatedPrice || undefined,
      category: product.category,
      grouping: product.grouping || '',
      caliber: product.caliber || '',
      origin: product.origin,
      brand: product.brand || '',
      weight: product.weight,
      isEgalim: product.isEgalim || false,
      otherLabels: product.otherLabels || '',
      vatRate: product.vatRate || 20,
      packagingUnit: product.packagingUnit || '',
      packagingCoefficient: product.packagingCoefficient || undefined,
      negotiationUnit: product.negotiationUnit || '',
      technicalSheetUrl: product.technicalSheetUrl || '',
      imageUrl: product.imageUrl || '',
      ozegoId: product.ozegoId || '',
      available: product.available,
      isOrganic: product.isOrganic,
    } : {
      name: '',
      supplierDesignation: '',
      reference: '',
      priceHT: 0,
      negotiatedPrice: undefined,
      category: 'food' as const,
      grouping: '',
      caliber: '',
      origin: 'France',
      brand: '',
      weight: 0,
      isEgalim: false,
      otherLabels: '',
      vatRate: 20,
      packagingUnit: '',
      packagingCoefficient: undefined,
      negotiationUnit: '',
      technicalSheetUrl: '',
      imageUrl: '',
      ozegoId: '',
      available: true,
      isOrganic: false,
    }
  });

  const onSubmit = (values: ProductFormValues) => {
    if (product) {
      updateProduct(product.id, values);
      
      toast({
        title: "Produit mis à jour",
        description: `${values.name} a été mis à jour avec succès`,
      });
    } else {
      // Add product logic would go here if needed
      addProduct(values as any); // Cast as any because addProduct expects slightly different type
      
      toast({
        title: "Produit ajouté",
        description: `${values.name} a été ajouté avec succès`,
      });
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
