
import { useCart } from '@/context/CartContext';
import { useOrder } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { useRecurringOrders } from '@/context/RecurringOrderContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CartItem } from '@/types';
import { RecurringFrequency } from '@/types/recurring-order';
import { useToast } from '@/hooks/use-toast';
import { Accordion } from '@/components/ui/accordion';
import EmptyCart from '@/components/cart/EmptyCart';
import SupplierCartSection from '@/components/cart/SupplierCartSection';
import SupplierCartSummary from '@/components/cart/SupplierCartSummary';
import CartActions from '@/components/cart/CartActions';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    clearSupplierCart,
    getTotalItems,
    getTotalPrice,
    getSupplierTotalItems,
    getSupplierTotalPrice,
    getUniqueSuppliers
  } = useCart();
  const { createSingleOrderFromCart, createOrdersFromCart } = useOrder();
  const { createRecurringOrder } = useRecurringOrders();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSuppliers, setProcessingSuppliers] = useState<Set<string>>(new Set());
  const [deliveryDates, setDeliveryDates] = useState<{ [supplierId: string]: Date }>({});
  const [deliveryComments, setDeliveryComments] = useState<{ [supplierId: string]: string }>({});

  if (!user || (user.role !== 'client' && user.role !== 'guest')) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-gray-500">Accès non autorisé</p>
      </div>
    );
  }

  const totalItems = getTotalItems();
  const uniqueSuppliers = getUniqueSuppliers();

  if (totalItems === 0) {
    return <EmptyCart />;
  }

  const handleCreateSingleOrder = (supplierId: string, sendEmail: boolean) => {
    if (!user || user.role === 'guest') return;
    
    setProcessingSuppliers(prev => new Set(prev).add(supplierId));
    try {
      createSingleOrderFromCart(
        supplierId, 
        cart.supplierItems, 
        user, 
        sendEmail, 
        deliveryDates[supplierId], 
        deliveryComments[supplierId]
      );
      
      // Remove this supplier's items from cart
      clearSupplierCart(supplierId);
      
      // Clear delivery data for this supplier
      setDeliveryDates(prev => {
        const newDates = { ...prev };
        delete newDates[supplierId];
        return newDates;
      });
      setDeliveryComments(prev => {
        const newComments = { ...prev };
        delete newComments[supplierId];
        return newComments;
      });
      
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setProcessingSuppliers(prev => {
        const newSet = new Set(prev);
        newSet.delete(supplierId);
        return newSet;
      });
    }
  };

  const handleCreateAllOrders = (sendEmail: boolean) => {
    if (!user || user.role === 'guest') return;
    
    setIsProcessing(true);
    try {
      createOrdersFromCart(cart.supplierItems, user, sendEmail, deliveryDates, deliveryComments);
      clearCart();
      setDeliveryDates({});
      setDeliveryComments({});
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    navigate('/catalog');
  };

  const handleClearAllCarts = () => {
    clearCart();
    setDeliveryDates({});
    setDeliveryComments({});
  };

  const handleDeliveryDateChange = (supplierId: string, date: Date | undefined) => {
    setDeliveryDates(prev => ({
      ...prev,
      [supplierId]: date || new Date()
    }));
  };

  const handleDeliveryCommentChange = (supplierId: string, comment: string) => {
    setDeliveryComments(prev => ({
      ...prev,
      [supplierId]: comment
    }));
  };

  const handleCreateRecurringOrder = (supplierId: string, items: CartItem[]) => {
    if (!user || user.role === 'guest') return;
    
    // Convertir les items du panier en format RecurringOrderItem
    const recurringOrderItems = items.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      supplierId: item.product.supplierId,
      supplierName: item.product.supplierName,
    }));

    // Obtenir le nom du fournisseur
    const supplier = uniqueSuppliers.find(s => s.id === supplierId);
    const supplierName = supplier?.name || 'Fournisseur inconnu';

    // Créer la commande récurrente avec des valeurs par défaut
    const recurringOrderData = {
      name: `Commande récurrente - ${supplierName}`,
      clientId: user.id,
      items: recurringOrderItems,
      frequency: 'monthly' as RecurringFrequency,
      nextExecutionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Dans 30 jours
      isActive: true,
    };

    createRecurringOrder(recurringOrderData);
    
    toast({
      title: "Commande récurrente créée",
      description: `Une commande récurrente a été créée pour ${supplierName}. Vous pouvez la modifier dans la page "Commandes récurrentes".`,
    });

    // Rediriger vers la page des commandes récurrentes
    navigate('/recurring-orders');
  };

  const supplierBreakdown = uniqueSuppliers.map(supplier => ({
    id: supplier.id,
    name: supplier.name,
    totalItems: getSupplierTotalItems(supplier.id),
    totalPrice: getSupplierTotalPrice(supplier.id)
  }));

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mon Panier</h1>
      
      <div className="space-y-8">
        {uniqueSuppliers.map((supplier) => (
          <div key={supplier.id} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Accordion type="multiple" defaultValue={[supplier.id]} className="space-y-4">
                <SupplierCartSection
                  supplierId={supplier.id}
                  supplierName={supplier.name}
                  items={cart.supplierItems[supplier.id] || []}
                  totalItems={getSupplierTotalItems(supplier.id)}
                  deliveryDate={deliveryDates[supplier.id]}
                  deliveryComment={deliveryComments[supplier.id]}
                  onQuantityChange={updateQuantity}
                  onRemoveItem={removeFromCart}
                  onClearSupplierCart={clearSupplierCart}
                  onDeliveryDateChange={handleDeliveryDateChange}
                  onDeliveryCommentChange={handleDeliveryCommentChange}
                />
              </Accordion>
            </div>
            
            <div className="lg:col-span-1">
              <SupplierCartSummary
                supplierId={supplier.id}
                supplierName={supplier.name}
                items={cart.supplierItems[supplier.id] || []}
                totalItems={getSupplierTotalItems(supplier.id)}
                totalPrice={getSupplierTotalPrice(supplier.id)}
                deliveryDate={deliveryDates[supplier.id]}
                deliveryComment={deliveryComments[supplier.id]}
                onCreateOrder={user.role === 'guest' ? undefined : handleCreateSingleOrder}
                onCreateRecurringOrder={user.role === 'guest' ? undefined : handleCreateRecurringOrder}
                isProcessing={processingSuppliers.has(supplier.id)}
                isTestUser={user.role === 'guest'}
              />
            </div>
          </div>
        ))}
        
        <CartActions
          onContinueShopping={handleContinueShopping}
          onClearAllCarts={handleClearAllCarts}
        />
      </div>
    </div>
  );
};

export default Cart;
