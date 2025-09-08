
import React from 'react';
import { Button } from '@/components/ui/button';

interface CartActionsProps {
  onContinueShopping: () => void;
  onClearAllCarts: () => void;
}

const CartActions: React.FC<CartActionsProps> = ({
  onContinueShopping,
  onClearAllCarts,
}) => {
  return (
    <div className="mt-4 flex justify-between">
      <Button 
        variant="outline" 
        className="text-gray-500"
        onClick={onContinueShopping}
      >
        Continuer mes achats
      </Button>
      
      <Button 
        variant="destructive" 
        className="text-white"
        onClick={onClearAllCarts}
      >
        Vider tous les paniers
      </Button>
    </div>
  );
};

export default CartActions;
