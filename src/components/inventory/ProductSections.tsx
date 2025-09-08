
import { Package, Euro, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { History } from 'lucide-react';
import { InventoryItem, InventoryTransaction, Product } from '@/types';
import ConsumeStockDialog from '@/components/inventory/ConsumeStockDialog';
import ProductLabels from '@/components/inventory/ProductLabels';
import ReportStockErrorDialog from '@/components/inventory/ReportStockErrorDialog';

interface ProductSectionsProps {
  filteredItems: InventoryItem[];
  searchTerm: string;
  onClearSearch: () => void;
  getTransactionHistory: (productId?: string) => InventoryTransaction[];
  products: Product[];
}

const ProductSections = ({ 
  filteredItems, 
  searchTerm, 
  onClearSearch, 
  getTransactionHistory,
  products 
}: ProductSectionsProps) => {
  // Organiser les produits par statut de stock (références uniques)
  const criticalStockItems = filteredItems.filter(item => item.currentStock === 0);
  const lowStockItems = filteredItems.filter(item => item.currentStock > 0 && item.currentStock <= item.alertThreshold);
  const availableItems = filteredItems.filter(item => item.currentStock > item.alertThreshold);

  // Fonction pour obtenir le prix d'un produit
  const getProductPrice = (productId: string): number => {
    const product = products.find(p => p.id === productId);
    return product ? product.priceHT : 0;
  };

  // Fonction pour calculer la valorisation d'un item
  const calculateItemValue = (item: InventoryItem): number => {
    const price = getProductPrice(item.productId);
    return price * item.currentStock;
  };

  // Fonction pour calculer la valorisation totale d'une section
  const calculateSectionValue = (items: InventoryItem[]): number => {
    return items.reduce((total, item) => total + calculateItemValue(item), 0);
  };

  // Fonction pour rendre une section de produits
  const renderProductSection = (items: InventoryItem[], title: string, bgColor: string, textColor: string, sectionKey: string) => {
    if (items.length === 0) return null;
    
    const sectionValue = calculateSectionValue(items);
    
    return (
      <div className="mb-8" key={sectionKey}>
        <div className={`${bgColor} ${textColor} px-6 py-4 rounded-t-lg font-semibold flex items-center justify-between border-l-4 border-l-primary`}>
          <span className="text-lg">{title}</span>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium flex items-center bg-white/20 px-3 py-1 rounded-full">
              <Euro className="h-4 w-4 mr-1" />
              {sectionValue.toFixed(2)} €
            </span>
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              {items.length} produit{items.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="border border-t-0 rounded-b-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Référence</TableHead>
                <TableHead className="font-semibold">Produit</TableHead>
                <TableHead className="font-semibold text-center">Stock actuel</TableHead>
                <TableHead className="font-semibold text-right">Prix HT</TableHead>
                <TableHead className="font-semibold text-right">Valorisation</TableHead>
                <TableHead className="font-semibold text-center">Seuil alerte</TableHead>
                <TableHead className="font-semibold">Labels</TableHead>
                <TableHead className="font-semibold">Fournisseur</TableHead>
                <TableHead className="font-semibold text-center">Statut</TableHead>
                <TableHead className="font-semibold text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const unitPrice = getProductPrice(item.productId);
                const itemValue = calculateItemValue(item);
                
                return (
                  <TableRow key={`${sectionKey}-${item.productId}`} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-sm font-medium text-primary">
                      {item.productReference}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate" title={item.productName}>
                        {item.productName}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-lg">{item.currentStock}</span>
                        <span className="text-xs text-muted-foreground">{item.unit}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium">{unitPrice.toFixed(2)} €</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-green-600">{itemValue.toFixed(2)} €</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{item.alertThreshold}</span>
                        <span className="text-xs text-muted-foreground">{item.unit}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <ProductLabels 
                        isEgalim={item.isEgalim}
                        isOrganic={item.isOrganic}
                        otherLabels={item.otherLabels}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={item.supplierName}>
                        {item.supplierName}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.currentStock === 0 && (
                        <Badge variant="destructive" className="font-medium">Épuisé</Badge>
                      )}
                      {item.currentStock > 0 && item.currentStock <= item.alertThreshold && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 font-medium">Stock faible</Badge>
                      )}
                      {item.currentStock > item.alertThreshold && (
                        <Badge className="bg-green-100 text-green-800 font-medium">Disponible</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        {item.currentStock > 0 && (
                          <ConsumeStockDialog inventoryItem={item} />
                        )}
                        <ReportStockErrorDialog inventoryItem={item} products={products} />
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <History className="h-4 w-4 mr-1" />
                              Détails
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{item.productName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <Label>Stock actuel</Label>
                                  <p className="text-lg font-medium">{item.currentStock} {item.unit}</p>
                                </div>
                                <div>
                                  <Label>Prix unitaire HT</Label>
                                  <p className="text-lg font-medium">{unitPrice.toFixed(2)} €</p>
                                </div>
                                <div>
                                  <Label>Valorisation</Label>
                                  <p className="text-lg font-medium text-green-600">{itemValue.toFixed(2)} €</p>
                                </div>
                              </div>
                              <div>
                                <Label>Seuil d'alerte</Label>
                                <p>{item.alertThreshold} {item.unit}</p>
                              </div>
                              
                              <div>
                                <Label>Labels et certifications</Label>
                                <div className="mt-2">
                                  <ProductLabels 
                                    isEgalim={item.isEgalim}
                                    isOrganic={item.isOrganic}
                                    otherLabels={item.otherLabels}
                                    size="md"
                                  />
                                </div>
                              </div>
                              
                               <div>
                                 <Label>Historique récent</Label>
                                 <div className="mt-2 max-h-48 overflow-y-auto">
                                   {getTransactionHistory(item.productId)
                                     .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                     .slice(0, 10)
                                     .map((transaction) => (
                                      <div key={transaction.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                        <span className="text-sm">{transaction.reason}</span>
                                        <div className="text-right">
                                          <span className={`font-medium ${
                                            transaction.type === 'in' ? 'text-green-600' : 
                                            transaction.type === 'out' ? 'text-red-600' : 'text-ozego-primary'
                                          }`}>
                                            {transaction.type === 'in' ? '+' : transaction.type === 'out' ? '-' : '±'}
                                            {transaction.quantity}
                                          </span>
                                          <div className="text-xs text-ozego-secondary">
                                            {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Produits épuisés */}
      {renderProductSection(
        criticalStockItems, 
        "🚨 Produits épuisés", 
        "bg-red-100", 
        "text-red-800",
        "critical"
      )}
      
      {/* Produits en stock faible */}
      {renderProductSection(
        lowStockItems, 
        "⚠️ Stock faible", 
        "bg-amber-100", 
        "text-amber-800",
        "low"
      )}
      
      {/* Produits disponibles */}
      {renderProductSection(
        availableItems, 
        "✅ Produits disponibles", 
        "bg-green-100", 
        "text-green-800",
        "available"
      )}
      
      {/* Message si aucun produit trouvé */}
      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-ozego-secondary">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            {searchTerm.trim() 
              ? `Aucun produit trouvé pour "${searchTerm}"`
              : "Aucun produit trouvé"
            }
          </p>
          {searchTerm.trim() && (
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={onClearSearch}
            >
              Effacer la recherche
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSections;
