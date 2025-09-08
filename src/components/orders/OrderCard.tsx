
import { Clock, Mail, Truck } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import OrderActions from '@/components/orders/OrderActions';
import OrderDetailsTable from '@/components/orders/OrderDetailsTable';
import ReceiveAllOrderDialog from '@/components/orders/ReceiveAllOrderDialog';
import { Button } from '@/components/ui/button';
import { Order, OrderStatus } from '@/types';

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onDownloadPDF: (order: Order) => void;
}

const OrderCard = ({ order, onStatusChange, onDownloadPDF }: OrderCardProps) => {
  const itemsTotal = order.items.reduce((sum, item) => sum + (item.priceHT * item.quantity), 0);
  const shippingCost = order.shippingCost || 0;
  const unrecevedItems = order.items.filter(item => !item.received);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-sm text-ozego-secondary mb-1">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(order.createdAt).toLocaleDateString('fr-FR', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
            {order.emailSent && (
              <div className="ml-3 flex items-center text-green-600">
                <Mail className="h-4 w-4 mr-1" />
                <span className="text-xs">Envoyé par email</span>
              </div>
            )}
          </div>
          <h3 className="text-lg font-medium text-ozego-text">
            Commande #{order.id.slice(-5)} - {order.supplierName}
          </h3>
          {order.clientReference && (
            <div className="text-sm text-ozego-secondary mt-1">
              Référence client: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{order.clientReference}</span>
            </div>
          )}
          <div className="mt-2 flex items-center gap-3">
            <OrderStatusBadge status={order.status} />
            <span className="text-sm text-ozego-secondary">
              {order.items.length} article{order.items.length > 1 ? 's' : ''}
            </span>
            {shippingCost > 0 && (
              <div className="flex items-center text-sm text-ozego-secondary">
                <Truck className="h-4 w-4 mr-1" />
                <span>Livraison: {shippingCost.toFixed(2)} € HT</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-right mb-2">
            <div className="text-sm text-ozego-secondary">Articles: {itemsTotal.toFixed(2)} € HT</div>
            {shippingCost > 0 && (
              <div className="text-sm text-ozego-secondary">Livraison: {shippingCost.toFixed(2)} € HT</div>
            )}
            <div className="font-semibold text-ozego-text">Total: {order.totalTTC.toFixed(2)} € TTC</div>
          </div>
          <div className="flex gap-2">
            {order.status === 'received' && unrecevedItems.length > 0 && (
              <ReceiveAllOrderDialog order={order}>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Truck className="h-4 w-4 mr-1" />
                  Réceptionner tout
                </Button>
              </ReceiveAllOrderDialog>
            )}
            <OrderActions 
              order={order}
              onStatusChange={onStatusChange}
              onDownloadPDF={onDownloadPDF}
            />
          </div>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={`details-${order.id}`}>
          <div className="px-4 py-2 bg-ozego-background border-t border-b">
            <AccordionTrigger className="py-1 hover:no-underline">
              <span className="text-sm font-medium text-ozego-text">Détails de la commande</span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="px-4 py-3">
            <OrderDetailsTable order={order} />
            {shippingCost > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-ozego-blue" />
                    <span className="text-sm font-medium">Frais de livraison</span>
                  </div>
                  <span className="text-sm font-medium">{shippingCost.toFixed(2)} € HT</span>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default OrderCard;
