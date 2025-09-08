
import { Clipboard, Download } from 'lucide-react';
import { useState } from 'react';
import { useOrder } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { OrderStatus } from '@/types';
import EmptyOrdersState from '@/components/orders/EmptyOrdersState';
import OrderCard from '@/components/orders/OrderCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { exportOrdersMaCantine } from '@/utils/orderExportUtils';

const ClientOrders = () => {
  const { user } = useAuth();
  const { getClientOrders, downloadOrderPDF, updateOrderStatus } = useOrder();
  const { products } = useProducts();
  
  if (!user) return null;
  
  const orders = getClientOrders(user.id);
  
  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
  };

  const exportMaCantine = () => {
    exportOrdersMaCantine(orders, products);
  };
  
  // Filtrer les commandes par statut
  const orderedOrders = orders.filter(order => order.status === 'ordered');
  const receivedOrders = orders.filter(order => order.status === 'received');
  const cancelledOrders = orders.filter(order => order.status === 'cancelled');
  
  // Si aucune commande n'a été passée
  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Clipboard className="h-6 w-6 mr-2 text-ozego-primary" />
            <h1 className="text-2xl font-bold text-ozego-text">Mes commandes</h1>
          </div>
          
          <Button onClick={exportMaCantine} disabled className="shadow-sm opacity-50 p-2" variant="outline">
            <img 
              src="/lovable-uploads/509d0cfc-6463-471d-9fcc-606c0e9427e3.png" 
              alt="Export ma cantine" 
              className="h-8 w-auto"
            />
          </Button>
        </div>
        
        <EmptyOrdersState />
      </div>
    );
  }
  
  const renderOrdersList = (ordersList: typeof orders) => {
    if (ordersList.length === 0) {
      return (
        <div className="text-center py-8 text-ozego-secondary">
          Aucune commande dans cette catégorie
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
          <h1 className="text-2xl font-bold text-ozego-text">Mes commandes</h1>
        </div>
        
        <Button onClick={exportMaCantine} className="shadow-sm p-2" variant="outline">
          <img 
            src="/lovable-uploads/509d0cfc-6463-471d-9fcc-606c0e9427e3.png" 
            alt="Export ma cantine" 
            className="h-8 w-auto"
          />
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            Toutes ({orders.length})
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
          {renderOrdersList(orders)}
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

export default ClientOrders;
