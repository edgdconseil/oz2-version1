
import { Package, AlertTriangle, TrendingDown, Euro } from 'lucide-react';
import { InventoryItem, Product } from '@/types';

interface InventoryStatsProps {
  inventoryItems: InventoryItem[];
  products: Product[];
}

const InventoryStats = ({ inventoryItems, products }: InventoryStatsProps) => {
  const availableItems = inventoryItems.filter(item => item.currentStock > item.alertThreshold);
  const lowStockItems = inventoryItems.filter(item => item.currentStock > 0 && item.currentStock <= item.alertThreshold);
  const criticalStockItems = inventoryItems.filter(item => item.currentStock === 0);

  // Calcul de la valorisation totale du stock
  const totalStockValue = inventoryItems.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    if (product && item.currentStock > 0) {
      return total + (product.priceHT * item.currentStock);
    }
    return total;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">Produits en stock</p>
            <p className="text-3xl font-bold text-foreground">
              {inventoryItems.filter(item => item.currentStock > 0).length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              sur {inventoryItems.length} produits
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="p-3 bg-amber-100 rounded-lg">
            <TrendingDown className="h-8 w-8 text-amber-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">Stock faible</p>
            <p className="text-3xl font-bold text-amber-600">
              {lowStockItems.length}
            </p>
            <p className="text-xs text-amber-600 mt-1 font-medium">
              À réapprovisionner
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">Stock épuisé</p>
            <p className="text-3xl font-bold text-red-600">
              {criticalStockItems.length}
            </p>
            <p className="text-xs text-red-600 mt-1 font-medium">
              Action urgente requise
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center">
          <div className="p-3 bg-green-100 rounded-lg">
            <Euro className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">Valorisation stock</p>
            <p className="text-3xl font-bold text-green-600">
              {totalStockValue.toFixed(2)} €
            </p>
            <p className="text-xs text-green-600 mt-1 font-medium">
              Valeur totale HT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryStats;
