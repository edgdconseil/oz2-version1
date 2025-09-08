import React from 'react';
import { Product } from '@/types';
import { Form, FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import TextField from './form-fields/TextField';
import PriceField from './form-fields/PriceField';
import SwitchField from './form-fields/SwitchField';
import { FormLabel } from '@/components/ui/form';
import { useProductForm, productFormSchema } from '@/hooks/useProductForm';

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
}

const EditProductForm = ({ product, onClose }: EditProductFormProps) => {
  const { form, onSubmit } = useProductForm({ 
    product, 
    onSuccess: onClose 
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {/* Informations générales */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Informations générales</h3>
          <div className="grid grid-cols-2 gap-4">
            <TextField form={form} name="name" label="Nom du produit" />
            <TextField form={form} name="supplierDesignation" label="Désignation fournisseur" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField form={form} name="reference" label="Référence" />
            <TextField form={form} name="ozegoId" label="ID Ozego" placeholder="ex: OZG-F-0001" />
          </div>
        </div>

        {/* Prix et négociation */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Prix et négociation</h3>
          <div className="grid grid-cols-2 gap-4">
            <PriceField form={form} name="priceHT" label="Prix HT (€)" />
            <PriceField form={form} name="negotiatedPrice" label="Prix négocié (€)" />
          </div>
          <PriceField form={form} name="vatRate" label="Taux de TVA (%)" />
        </div>

        {/* Classification */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Classification</h3>
          <div className="space-y-1">
            <FormLabel>Famille</FormLabel>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <ToggleGroup
                  type="single"
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) field.onChange(value);
                  }}
                  className="justify-start"
                >
                  <ToggleGroupItem value="food">Alimentaire</ToggleGroupItem>
                  <ToggleGroupItem value="non-food">Non-alimentaire</ToggleGroupItem>
                </ToggleGroup>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField form={form} name="grouping" label="Regroupement" />
            <TextField form={form} name="caliber" label="Calibre" />
          </div>
        </div>

        {/* Caractéristiques produit */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Caractéristiques produit</h3>
          <div className="grid grid-cols-2 gap-4">
            <TextField form={form} name="origin" label="Origine" />
            <TextField form={form} name="brand" label="Marque" />
          </div>
          <PriceField form={form} name="weight" label="Poids net égouté (kg)" />
        </div>

        {/* Labels et certifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Labels et certifications</h3>
          <div className="grid grid-cols-2 gap-4">
            <SwitchField form={form} name="isEgalim" label="EGALIM" />
            <SwitchField form={form} name="isOrganic" label="Bio" />
          </div>
          <TextField form={form} name="otherLabels" label="Autres labels" placeholder="ex: Label Rouge, AOP..." />
        </div>

        {/* Conditionnement */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Conditionnement</h3>
          <div className="grid grid-cols-2 gap-4">
            <TextField form={form} name="packagingUnit" label="Unité de COM" placeholder="ex: kg, pièce, lot de 10..." />
            <PriceField form={form} name="packagingCoefficient" label="Coef unité de COM" />
          </div>
          <TextField form={form} name="negotiationUnit" label="U. Négo" placeholder="ex: sachet, unité..." />
        </div>

        {/* Documents et médias */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Documents et médias</h3>
          <TextField
            form={form}
            name="technicalSheetUrl"
            label="Fiche technique"
            placeholder="https://example.com/fiche.pdf"
          />
          <TextField
            form={form}
            name="imageUrl"
            label="URL photo"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Disponibilité */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Disponibilité</h3>
          <SwitchField form={form} name="available" label="Disponible à la vente" />
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">
            Enregistrer
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditProductForm;