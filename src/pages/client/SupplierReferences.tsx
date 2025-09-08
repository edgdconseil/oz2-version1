
import { useState } from 'react';
import { useSupplierReferences } from '@/context/SupplierReferenceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Building2, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ReferenceFormData {
  supplierId: string;
  clientReference: string;
  preferredDeliveryDays: string[];
}

const DELIVERY_DAYS = [
  { id: 'monday', label: 'Lundi' },
  { id: 'tuesday', label: 'Mardi' },
  { id: 'wednesday', label: 'Mercredi' },
  { id: 'thursday', label: 'Jeudi' },
  { id: 'friday', label: 'Vendredi' },
  { id: 'saturday', label: 'Samedi' },
  { id: 'sunday', label: 'Dimanche' },
];

const SupplierReferences = () => {
  const {
    supplierReferences,
    addSupplierReference,
    updateSupplierReference,
    deleteSupplierReference,
    getAvailableSuppliers
  } = useSupplierReferences();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingReference, setEditingReference] = useState<{ id: string; reference: string; deliveryDays: string[] } | null>(null);

  const form = useForm<ReferenceFormData>({
    defaultValues: {
      supplierId: '',
      clientReference: '',
      preferredDeliveryDays: []
    }
  });

  const availableSuppliers = getAvailableSuppliers().filter(
    supplier => !supplierReferences.some(ref => ref.supplierId === supplier.id)
  );

  const onSubmit = (data: ReferenceFormData) => {
    const supplier = getAvailableSuppliers().find(s => s.id === data.supplierId);
    if (supplier) {
      addSupplierReference(data.supplierId, supplier.name, data.clientReference, data.preferredDeliveryDays);
      form.reset();
      setIsAddDialogOpen(false);
    }
  };

  const handleEdit = (id: string, currentReference: string, currentDeliveryDays: string[]) => {
    setEditingReference({ id, reference: currentReference, deliveryDays: currentDeliveryDays });
  };

  const handleEditSubmit = () => {
    if (editingReference) {
      updateSupplierReference(editingReference.id, { 
        clientReference: editingReference.reference,
        preferredDeliveryDays: editingReference.deliveryDays
      });
      setEditingReference(null);
    }
  };

  const handleDelete = (id: string) => {
    deleteSupplierReference(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ozego-blue">Mes fournisseurs</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos références client pour chaque fournisseur
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ozego-primary hover:bg-ozego-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une référence
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une référence fournisseur</DialogTitle>
              <DialogDescription>
                Ajoutez votre numéro de référence client pour un fournisseur
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="supplierId"
                  rules={{ required: "Veuillez sélectionner un fournisseur" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fournisseur</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un fournisseur" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSuppliers.map((supplier) => (
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
                  name="clientReference"
                  rules={{ required: "Veuillez saisir votre référence" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Votre référence client</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: CLI-001, REF-2024-001..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredDeliveryDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Jours de livraison préférés
                      </FormLabel>
                      <div className="grid grid-cols-2 gap-3">
                        {DELIVERY_DAYS.map((day) => (
                          <div key={day.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={day.id}
                              checked={field.value?.includes(day.id)}
                              onCheckedChange={(checked) => {
                                const currentDays = field.value || [];
                                if (checked) {
                                  field.onChange([...currentDays, day.id]);
                                } else {
                                  field.onChange(currentDays.filter(d => d !== day.id));
                                }
                              }}
                            />
                            <Label htmlFor={day.id} className="text-sm font-normal">
                              {day.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit">Ajouter</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {supplierReferences.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune référence fournisseur
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Commencez par ajouter vos références client pour vos fournisseurs
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-ozego-primary hover:bg-ozego-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une référence
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Références fournisseurs</CardTitle>
            <CardDescription>
              Liste de vos références client pour chaque fournisseur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fournisseur</TableHead>
                  <TableHead>Votre référence</TableHead>
                  <TableHead>Jours de livraison préférés</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Dernière modification</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierReferences.map((reference) => (
                  <TableRow key={reference.id}>
                    <TableCell className="font-medium">
                      {reference.supplierName}
                    </TableCell>
                    <TableCell>
                      {editingReference?.id === reference.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={editingReference.reference}
                            onChange={(e) =>
                              setEditingReference({
                                ...editingReference,
                                reference: e.target.value
                              })
                            }
                            className="w-48"
                          />
                          <Button size="sm" onClick={handleEditSubmit}>
                            Sauvegarder
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingReference(null)}
                          >
                            Annuler
                          </Button>
                        </div>
                      ) : (
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {reference.clientReference}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingReference?.id === reference.id ? (
                        <div className="grid grid-cols-2 gap-2 max-w-xs">
                          {DELIVERY_DAYS.map((day) => (
                            <div key={day.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`edit-${day.id}`}
                                checked={editingReference.deliveryDays?.includes(day.id)}
                                onCheckedChange={(checked) => {
                                  const currentDays = editingReference.deliveryDays || [];
                                  if (checked) {
                                    setEditingReference({
                                      ...editingReference,
                                      deliveryDays: [...currentDays, day.id]
                                    });
                                  } else {
                                    setEditingReference({
                                      ...editingReference,
                                      deliveryDays: currentDays.filter(d => d !== day.id)
                                    });
                                  }
                                }}
                              />
                              <Label htmlFor={`edit-${day.id}`} className="text-xs">
                                {day.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {reference.preferredDeliveryDays?.length > 0 ? (
                            reference.preferredDeliveryDays.map((dayId) => {
                              const day = DELIVERY_DAYS.find(d => d.id === dayId);
                              return day ? (
                                <span key={dayId} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {day.label}
                                </span>
                              ) : null;
                            })
                          ) : (
                            <span className="text-gray-400 text-xs">Aucun jour défini</span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(reference.createdAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {new Date(reference.updatedAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(reference.id, reference.clientReference, reference.preferredDeliveryDays || [])}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(reference.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupplierReferences;
