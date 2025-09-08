
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Order, OrderStatus } from '@/types';

interface OrderActionsProps {
  order: Order;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
  onDownloadPDF: (order: Order) => void;
}

const OrderActions = ({ order, onStatusChange, onDownloadPDF }: OrderActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <div className="text-right">
        <div className="text-sm text-ozego-secondary">Total</div>
        <div className="font-semibold text-ozego-text">{order.totalTTC.toFixed(2)} € TTC</div>
      </div>
      
      <Select 
        value={order.status} 
        onValueChange={(value) => onStatusChange(order.id, value as OrderStatus)}
      >
        <SelectTrigger className="w-40 ml-4">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ordered">Commandé</SelectItem>
          <SelectItem value="received">Réceptionné</SelectItem>
          <SelectItem value="cancelled">Annulé</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        className="ml-4"
        variant="outline"
        size="sm"
        onClick={() => onDownloadPDF(order)}
      >
        <Download className="h-4 w-4 mr-1" />
        Bon de commande
      </Button>
    </div>
  );
};

export default OrderActions;
