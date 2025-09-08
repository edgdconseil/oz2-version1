
import { useState } from 'react';
import { useInventory } from '@/context/InventoryContext';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Package, 
  Search,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import InventoryStats from '@/components/inventory/InventoryStats';
import InventoryAlerts from '@/components/inventory/InventoryAlerts';
import ProductSections from '@/components/inventory/ProductSections';
import TransactionHistory from '@/components/inventory/TransactionHistory';
import { exportInventoryToCsv } from '@/utils/inventoryExportUtils';
import { exportStockErrorsToCsv } from '@/utils/stockErrorExportUtils';
import { StockError } from '@/types/stock-error';

const Inventory = () => {
  const { user } = useAuth();
  const { products } = useProducts();
  const { 
    inventoryItems, 
    getProductAlerts, 
    acknowledgeAlert, 
    getTransactionHistory
  } = useInventory();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!user || user.role !== 'client') return null;
  
  const alerts = getProductAlerts();
  
  // Fixed search functionality
  const filteredItems = inventoryItems.filter(item => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    return (
      item.productName.toLowerCase().includes(searchLower) ||
      item.productReference.toLowerCase().includes(searchLower) ||
      item.supplierName.toLowerCase().includes(searchLower)
    );
  });

  const exportInventory = () => {
    exportInventoryToCsv(filteredItems, products);
  };

  const exportStockErrors = () => {
    const stockErrors: StockError[] = JSON.parse(localStorage.getItem('stockErrors') || '[]');
    if (stockErrors.length === 0) {
      alert('Aucune erreur de stock à exporter');
      return;
    }
    exportStockErrorsToCsv(stockErrors);
  };


  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="p-2 bg-primary/10 rounded-lg mr-3">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventaire</h1>
            <p className="text-muted-foreground">Gestion et suivi de vos stocks</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex gap-2">
            <Button onClick={exportInventory} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter Inventaire
            </Button>
            <Button onClick={exportStockErrors} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exporter Erreurs Stock
            </Button>
          </div>
        </div>
      </div>

      {/* Alertes */}
      <InventoryAlerts 
        alerts={alerts}
        onAcknowledgeAlert={acknowledgeAlert}
      />

      {/* Statistiques rapides */}
      <InventoryStats inventoryItems={inventoryItems} products={products} />

      {/* Contenu principal avec design amélioré */}
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <Tabs defaultValue="inventory" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/30 m-0 rounded-none border-b">
            <TabsTrigger value="inventory" className="text-base font-medium">
              📦 Inventaire actuel
            </TabsTrigger>
            <TabsTrigger value="history" className="text-base font-medium">
              📊 Historique des mouvements
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory" className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, référence ou fournisseur..."
                  className="pl-10 h-12 text-base shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={handleClearSearch}
                  className="h-12 px-4"
                >
                  Effacer
                </Button>
              )}
            </div>
            
            {/* Affichage organisé par statut de stock */}
            <ProductSections 
              filteredItems={filteredItems}
              searchTerm={searchTerm}
              onClearSearch={handleClearSearch}
              getTransactionHistory={getTransactionHistory}
              products={products}
            />
          </TabsContent>
          
          <TabsContent value="history" className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Historique des transactions</h3>
              <TransactionHistory getTransactionHistory={getTransactionHistory} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Inventory;
