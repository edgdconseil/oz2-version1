
import React from 'react';
import { Leaf, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartItem as CartItemType } from '@/types';
import {
  TableCell,
  TableRow,
} from '@/components/ui/table';

interface CartItemProps {
  item: CartItemType;
  supplierId: string;
  onQuantityChange: (productId: string, supplierId: string, quantity: number) => void;
  onRemove: (productId: string, supplierId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  supplierId, 
  onQuantityChange, 
  onRemove 
}) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-start">
          <div>
            <div className="font-medium">{item.product.name}</div>
            <div className="text-sm text-gray-500">
              {item.product.isOrganic && 
                <span className="inline-flex items-center text-green-600 mr-2">
                  <Leaf className="h-3 w-3 mr-1" /> Bio
                </span>
              }
              <span>{item.product.origin}</span>
              {item.product.packagingUnit && (
                <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                  Unité: {item.product.packagingUnit}
                </span>
              )}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-center">
        {item.product.priceHT.toFixed(2)} € HT
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onQuantityChange(item.productId, supplierId, item.quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => onQuantityChange(item.productId, supplierId, parseInt(e.target.value) || 1)}
            className="h-8 w-16 mx-2 text-center"
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onQuantityChange(item.productId, supplierId, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-right">
        {(item.product.priceHT * item.quantity).toFixed(2)} € HT
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-500 hover:text-red-500"
          onClick={() => onRemove(item.productId, supplierId)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CartItem;
