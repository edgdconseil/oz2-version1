import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Search, ShoppingBag, CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RecurringOrder, RecurringFrequency, RecurringOrderItem } from '@/types/recurring-order';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { addDays, addMonths, startOfDay, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface RecurringOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (order: Omit<RecurringOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editOrder?: RecurringOrder;
}

const frequencyLabels: Record<RecurringFrequency, string> = {
  weekly: 'Hebdomadaire',
  biweekly: 'Quinzaine',
  monthly: 'Mensuelle',
  quarterly: 'Trimestrielle',
  biannual: 'Semestrielle',
};

const calculateNextExecutionDate = (frequency: RecurringFrequency): string => {
  const baseDate = startOfDay(new Date());
  
  switch (frequency) {
    case 'weekly':
      return addDays(baseDate, 7).toISOString();
    case 'biweekly':
      return addDays(baseDate, 14).toISOString();
    case 'monthly':
      return addMonths(baseDate, 1).toISOString();
    case 'quarterly':
      return addMonths(baseDate, 3).toISOString();
    case 'biannual':
      return addMonths(baseDate, 6).toISOString();
    default:
      return addMonths(baseDate, 1).toISOString();
  }
};

export const RecurringOrderForm: React.FC<RecurringOrderFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  editOrder,
}) => {
  const { products } = useProducts();
  const { user } = useAuth();
  
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<RecurringFrequency>('monthly');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [items, setItems] = useState<RecurringOrderItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');

  // Réinitialiser le formulaire quand editOrder change
  React.useEffect(() => {
    if (editOrder) {
      setName(editOrder.name);
      setFrequency(editOrder.frequency);
      setStartDate(editOrder.nextExecutionDate ? new Date(editOrder.nextExecutionDate) : undefined);
      setItems(editOrder.items);
    } else {
      setName('');
      setFrequency('monthly');
      setStartDate(undefined);
      setItems([]);
    }
    setSelectedProductId('');
    setQuantity(1);
    setSearchTerm('');
    setSelectedSupplier('');
  }, [editOrder, open]);

  const handleAddItem = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const existingItemIndex = items.findIndex(item => 
      item.productId === product.id && item.supplierId === product.supplierId
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      setItems(updatedItems);
    } else {
      const newItem: RecurringOrderItem = {
        productId: product.id,
        productName: product.name,
        quantity,
        supplierId: product.supplierId,
        supplierName: product.supplierName,
      };
      setItems([...items, newItem]);
    }

    setSelectedProductId('');
    setQuantity(1);
  };

  const handleRemoveItem = (productId: string, supplierId: string) => {
    setItems(items.filter(item => 
      !(item.productId === productId && item.supplierId === supplierId)
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim() || items.length === 0) return;

    const nextExecutionDate = startDate 
      ? startDate.toISOString()
      : editOrder?.nextExecutionDate || calculateNextExecutionDate(frequency);

    onSubmit({
      name: name.trim(),
      clientId: user.id,
      items,
      frequency,
      nextExecutionDate,
      isActive: editOrder?.isActive ?? true,
      lastExecutionDate: editOrder?.lastExecutionDate,
    });

    // Reset form
    setName('');
    setFrequency('monthly');
    setStartDate(undefined);
    setItems([]);
    onOpenChange(false);
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.supplierId]) {
      acc[item.supplierId] = {
        supplierName: item.supplierName,
        items: [],
      };
    }
    acc[item.supplierId].items.push(item);
    return acc;
  }, {} as Record<string, { supplierName: string; items: RecurringOrderItem[] }>);

  // Filtrer les produits selon la recherche et le fournisseur sélectionné
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSupplier = selectedSupplier === 'all' || !selectedSupplier || product.supplierId === selectedSupplier;
    return matchesSearch && matchesSupplier;
  });

  // Obtenir la liste des fournisseurs uniques
  const uniqueSuppliers = Array.from(
    new Map(products.map(p => [p.supplierId, { id: p.supplierId, name: p.supplierName }])).values()
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editOrder ? 'Modifier la commande récurrente' : 'Créer une commande récurrente'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Nom de la commande</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Commande mensuelle fruits et légumes"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="frequency">Fréquence</Label>
              <Select value={frequency} onValueChange={(value: RecurringFrequency) => setFrequency(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(frequencyLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date de déclenchement</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", { locale: fr }) : "Choisir une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {editOrder && startDate && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Prochaine exécution: {format(startDate, 'PPP', { locale: fr })}
              </p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Ajouter des produits du catalogue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filtres de recherche */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher par nom ou référence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les fournisseurs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les fournisseurs</SelectItem>
                    {uniqueSuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sélection de produit et ajout */}
              <div className="flex gap-2">
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {filteredProducts.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        Aucun produit trouvé
                      </div>
                    ) : (
                      filteredProducts.map((product) => (
                        <SelectItem key={`${product.id}-${product.supplierId}`} value={product.id}>
                          <div className="flex flex-col">
                            <span>{product.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {product.supplierName} • {product.priceHT}€ HT • {product.packagingUnit}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  placeholder="Qté"
                  className="w-20"
                />
                
                <Button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!selectedProductId}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Produits sélectionnés ({items.length})</h3>
            
            {Object.entries(groupedItems).map(([supplierId, group]) => (
              <div key={supplierId} className="space-y-2">
                <Badge variant="outline" className="text-sm">
                  {group.supplierName}
                </Badge>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead className="text-right">Quantité</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.items.map((item) => (
                      <TableRow key={`${item.productId}-${item.supplierId}`}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.productId, item.supplierId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
            
            {items.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                Aucun produit sélectionné
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!name.trim() || items.length === 0 || !startDate}>
              {editOrder ? 'Modifier' : 'Créer'} la commande récurrente
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};