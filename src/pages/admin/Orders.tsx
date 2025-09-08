
import { Clipboard, Filter, Download } from 'lucide-react';
import { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { OrderStatus } from '@/types';
import OrderCard from '@/components/orders/OrderCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const AdminOrders = () => {
  const { orders, downloadOrderPDF, updateOrderStatus } = useOrder();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  
  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };
  
  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSupplier = selectedSupplier === 'all' || order.supplierId === selectedSupplier;
    const matchesClient = selectedClient === 'all' || order.clientId === selectedClient;
    
    return matchesSearch && matchesSupplier && matchesClient;
  });
  
  // Filtrer par statut
  const orderedOrders = filteredOrders.filter(order => order.status === 'ordered');
  const receivedOrders = filteredOrders.filter(order => order.status === 'received');
  const cancelledOrders = filteredOrders.filter(order => order.status === 'cancelled');
  
  // Obtenir les listes uniques de fournisseurs et clients
  const uniqueSuppliers = Array.from(new Set(orders.map(order => ({ id: order.supplierId, name: order.supplierName }))));
  const uniqueClients = Array.from(new Set(orders.map(order => ({ id: order.clientId, name: order.clientName }))));
  
  // Calculer les statistiques
  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => sum + order.totalTTC, 0);
  
  const renderOrdersList = (ordersList: typeof orders) => {
    if (ordersList.length === 0) {
      return (
        <div className="text-center py-8 text-ozego-secondary">
          Aucune commande trouvée
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {ordersList.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onStatusChange={handleStatusChange}
            onDownloadPDF={downloadOrderPDF}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Clipboard className="h-6 w-6 mr-2 text-ozego-primary" />
          <h1 className="text-2xl font-bold text-ozego-text">Gestion des commandes</h1>
        </div>
        
        {/* Statistiques */}
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <div className="font-semibold text-ozego-text">{totalOrders}</div>
            <div className="text-ozego-secondary">Commandes</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-ozego-text">{totalAmount.toFixed(2)} €</div>
            <div className="text-ozego-secondary">Total TTC</div>
          </div>
        </div>
      </div>
      
      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Filter className="h-4 w-4 text-ozego-secondary" />
          <span className="text-sm font-medium text-ozego-text">Filtres</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Rechercher par ID, client ou fournisseur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les clients</SelectItem>
                {uniqueClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
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
          
          <div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSearchTerm('');
                setSelectedClient('all');
                setSelectedSupplier('all');
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>
      
      {/* Onglets */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            Toutes ({filteredOrders.length})
          </TabsTrigger>
          <TabsTrigger value="ordered">
            Commandées ({orderedOrders.length})
          </TabsTrigger>
          <TabsTrigger value="received">
            Réceptionnées ({receivedOrders.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Annulées ({cancelledOrders.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {renderOrdersList(filteredOrders)}
        </TabsContent>
        
        <TabsContent value="ordered" className="mt-6">
          {renderOrdersList(orderedOrders)}
        </TabsContent>
        
        <TabsContent value="received" className="mt-6">
          {renderOrdersList(receivedOrders)}
        </TabsContent>
        
        <TabsContent value="cancelled" className="mt-6">
          {renderOrdersList(cancelledOrders)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminOrders;
