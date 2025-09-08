
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Order, OrderStatus, CartItem, User } from '@/types';
import { orders as mockOrders } from '@/data/mockData';
import { useOrderOperations } from '@/hooks/useOrderOperations';
import { filterOrdersByClient, filterOrdersBySupplier } from '@/utils/orderUtils';

interface OrderContextType {
  orders: Order[];
  createOrder: (itemsBySupplier: { [supplierId: string]: CartItem[] }, clientInfo: User, sendEmail?: boolean, deliveryDates?: { [supplierId: string]: Date }, deliveryComments?: { [supplierId: string]: string }) => void;
  createOrdersFromCart: (itemsBySupplier: { [supplierId: string]: CartItem[] }, clientInfo: User, sendEmail?: boolean, deliveryDates?: { [supplierId: string]: Date }, deliveryComments?: { [supplierId: string]: string }) => void;
  createSingleOrderFromCart: (supplierId: string, itemsBySupplier: { [supplierId: string]: CartItem[] }, clientInfo: User, sendEmail?: boolean, deliveryDate?: Date, deliveryComment?: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  downloadOrderPDF: (order: Order) => void;
  getClientOrders: (clientId: string) => Order[];
  getOrdersByClient: (clientId: string) => Order[];
  getSupplierOrders: (supplierId: string) => Order[];
  getOrdersBySupplier: (supplierId: string) => Order[];
  markItemAsReceived: (orderId: string, productId: string, receptionData?: {
    receivedQuantity?: number;
    receivedPrice?: number;
    litigeStatus?: string;
    litigeComment?: string;
    litigeSouhait?: string;
  }) => void;
  markAllItemsAsReceived: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const {
    createOrdersFromCart,
    createSingleOrderFromCart,
    updateOrderStatus,
    markItemAsReceived,
    markAllItemsAsReceived,
    downloadOrderPDF
  } = useOrderOperations(orders, setOrders);

  // Alias for backward compatibility
  const createOrder = createOrdersFromCart;

  const getOrdersByClient = (clientId: string) => filterOrdersByClient(orders, clientId);
  const getClientOrders = getOrdersByClient; // Alias for backward compatibility

  const getOrdersBySupplier = (supplierId: string) => filterOrdersBySupplier(orders, supplierId);
  const getSupplierOrders = getOrdersBySupplier; // Alias for backward compatibility

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      createOrdersFromCart,
      createSingleOrderFromCart,
      updateOrderStatus,
      downloadOrderPDF,
      getClientOrders,
      getOrdersByClient,
      getSupplierOrders,
      getOrdersBySupplier,
      markItemAsReceived,
      markAllItemsAsReceived
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
