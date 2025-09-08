
import { CartItem, Order, User, OrderItem } from '@/types';

export const calculateOrderTotals = (orderItems: OrderItem[], shippingCost: number = 0) => {
  const totalHT = orderItems.reduce((sum, item) => sum + (item.priceHT * item.quantity), 0);
  const totalWithShipping = totalHT + shippingCost;
  const totalTTC = totalWithShipping * 1.20; // Assuming 20% VAT
  return { totalHT: totalWithShipping, totalTTC };
};

export const createOrderFromCart = (
  supplierId: string,
  supplierItems: CartItem[],
  clientInfo: User,
  clientReference?: string,
  sendEmail?: boolean,
  shippingCost: number = 0,
  deliveryDate?: string,
  deliveryComment?: string
): Order => {
  const supplierName = supplierItems[0].product.supplierName;
  
  const orderItems = supplierItems.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    priceHT: item.product.priceHT,
    productName: item.product.name,
    packagingUnit: item.product.packagingUnit
  }));

  const { totalHT, totalTTC } = calculateOrderTotals(orderItems, shippingCost);

  return {
    id: `order-${Date.now()}-${supplierId}`,
    clientId: clientInfo.id,
    clientName: clientInfo.name,
    clientReference,
    supplierId,
    supplierName,
    items: orderItems,
    status: 'ordered',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalHT,
    totalTTC,
    shippingCost,
    emailSent: sendEmail,
    deliveryDate,
    deliveryComment
  };
};

export const filterOrdersByClient = (orders: Order[], clientId: string): Order[] => {
  return orders.filter(order => order.clientId === clientId);
};

export const filterOrdersBySupplier = (orders: Order[], supplierId: string): Order[] => {
  return orders.filter(order => order.supplierId === supplierId);
};
