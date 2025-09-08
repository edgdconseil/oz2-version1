
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types';
import { 
  Package, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  switch (status) {
    case 'ordered':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
          <Package className="h-3 w-3" />
          Commandé
        </Badge>
      );
    case 'received':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Réceptionné
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Annulé
        </Badge>
      );
    default:
      return null;
  }
};

export default OrderStatusBadge;
