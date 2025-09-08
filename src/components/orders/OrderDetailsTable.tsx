
import { Check, Truck } from 'lucide-react';
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
import ReceiveOrderDialog from '@/components/orders/ReceiveOrderDialog';
import { Order } from '@/types';

interface OrderDetailsTableProps {
  order: Order;
}

const OrderDetailsTable = ({ order }: OrderDetailsTableProps) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead className="text-center">Prix unitaire</TableHead>
            <TableHead className="text-center">Quantité</TableHead>
            <TableHead className="text-right">Total HT</TableHead>
            <TableHead className="text-center">Statut</TableHead>
            {order.status === 'received' && (
              <TableHead className="text-center">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.items.map((item) => (
            <TableRow key={item.productId}>
              <TableCell className="text-ozego-text">
                <div className="flex items-center gap-2">
                  <span>{item.productName}</span>
                  {item.received && item.litigeStatus === 'create_litige' && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full" title="Litige créé">
                      !
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div>{item.priceHT.toFixed(2)} € HT</div>
                {item.received && item.receivedPrice !== undefined && item.receivedPrice !== item.priceHT && (
                  <div className="text-xs text-ozego-secondary mt-1">
                    Reçu: {item.receivedPrice.toFixed(2)} € HT
                  </div>
                )}
              </TableCell>
              <TableCell className="text-center">
                <div>{item.quantity}</div>
                {item.received && item.receivedQuantity !== undefined && item.receivedQuantity !== item.quantity && (
                  <div className="text-xs text-ozego-secondary mt-1">
                    Reçu: {item.receivedQuantity}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                {(item.priceHT * item.quantity).toFixed(2)} € HT
                {item.received && item.receivedPrice !== undefined && item.receivedQuantity !== undefined && 
                 (item.receivedPrice !== item.priceHT || item.receivedQuantity !== item.quantity) && (
                  <div className="text-xs text-ozego-secondary mt-1">
                    Reçu: {(item.receivedPrice * item.receivedQuantity).toFixed(2)} € HT
                  </div>
                )}
              </TableCell>
              <TableCell className="text-center">
                {item.received ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Check className="h-3 w-3 mr-1" />
                    Produit réceptionné
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-ozego-secondary">
                    En attente
                  </Badge>
                )}
              </TableCell>
              {order.status === 'received' && (
                <TableCell className="text-center">
                  {!item.received ? (
                    <ReceiveOrderDialog orderItem={item} orderId={order.id} order={order}>
                      <Button
                        size="sm"
                        className="bg-ozego-primary hover:bg-ozego-primary/90"
                      >
                        <Truck className="h-4 w-4 mr-1" />
                        Réceptionner
                      </Button>
                    </ReceiveOrderDialog>
                  ) : (
                    <span className="text-sm text-ozego-secondary">Réceptionné</span>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-4 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between text-sm">
            <span>Total HT</span>
            <span>{order.totalHT.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>TVA (20%)</span>
            <span>{(order.totalTTC - order.totalHT).toFixed(2)} €</span>
          </div>
          <div className="flex justify-between font-bold mt-2">
            <span>Total TTC</span>
            <span>{order.totalTTC.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsTable;
