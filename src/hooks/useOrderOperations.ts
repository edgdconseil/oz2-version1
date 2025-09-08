
import { useState, useCallback } from 'react';
import { Order, OrderStatus, CartItem, User } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useSupplierReferences } from '@/context/SupplierReferenceContext';
import { useShipping } from '@/context/ShippingContext';
import { createOrderFromCart } from '@/utils/orderUtils';
import { generateOrderPDF } from '@/utils/pdfUtils';

export const useOrderOperations = (orders: Order[], setOrders: (orders: Order[]) => void) => {
  const { toast } = useToast();
  const supplierReferences = useSupplierReferences();
  const { calculateShippingCost } = useShipping();

  const createOrdersFromCart = useCallback((
    itemsBySupplier: { [supplierId: string]: CartItem[] }, 
    clientInfo: User, 
    sendEmail?: boolean,
    deliveryDates?: { [supplierId: string]: Date },
    deliveryComments?: { [supplierId: string]: string }
  ) => {
    const newOrders: Order[] = [];

    // Create one order per supplier
    Object.keys(itemsBySupplier).forEach(supplierId => {
      const supplierItems = itemsBySupplier[supplierId];
      
      // Calculate shipping cost for this supplier
      const supplierTotal = supplierItems.reduce((sum, item) => sum + (item.product.priceHT * item.quantity), 0);
      const shippingCost = calculateShippingCost(supplierId, supplierTotal);
      
      // Get client reference for this supplier (with safety check)
      let clientReference: string | undefined;
      try {
        const supplierRef = supplierReferences?.getSupplierReference?.(supplierId);
        clientReference = supplierRef?.clientReference;
      } catch (error) {
        console.log('Could not get supplier reference:', error);
        clientReference = undefined;
      }
      
      const deliveryDate = deliveryDates?.[supplierId]?.toISOString();
      const deliveryComment = deliveryComments?.[supplierId];
      
      const newOrder = createOrderFromCart(
        supplierId,
        supplierItems,
        clientInfo,
        clientReference,
        sendEmail,
        shippingCost,
        deliveryDate,
        deliveryComment
      );

      newOrders.push(newOrder);
    });

    setOrders([...orders, ...newOrders]);
    
    toast({
      title: "Commandes créées",
      description: `${newOrders.length} commande(s) ont été créées avec succès.`,
    });
  }, [orders, setOrders, toast, supplierReferences, calculateShippingCost]);

  const createSingleOrderFromCart = useCallback((
    supplierId: string,
    itemsBySupplier: { [supplierId: string]: CartItem[] }, 
    clientInfo: User, 
    sendEmail?: boolean,
    deliveryDate?: Date,
    deliveryComment?: string
  ) => {
    const supplierItems = itemsBySupplier[supplierId];
    if (!supplierItems || supplierItems.length === 0) return;

    // Calculate shipping cost for this supplier
    const supplierTotal = supplierItems.reduce((sum, item) => sum + (item.product.priceHT * item.quantity), 0);
    const shippingCost = calculateShippingCost(supplierId, supplierTotal);
    
    // Get client reference for this supplier (with safety check)
    let clientReference: string | undefined;
    try {
      const supplierRef = supplierReferences?.getSupplierReference?.(supplierId);
      clientReference = supplierRef?.clientReference;
    } catch (error) {
      console.log('Could not get supplier reference:', error);
      clientReference = undefined;
    }
    
    const deliveryDateString = deliveryDate?.toISOString();
    
    const newOrder = createOrderFromCart(
      supplierId,
      supplierItems,
      clientInfo,
      clientReference,
      sendEmail,
      shippingCost,
      deliveryDateString,
      deliveryComment
    );

    setOrders([...orders, newOrder]);
    
    toast({
      title: "Commande créée",
      description: `La commande pour ${newOrder.supplierName} a été créée avec succès.`,
    });
  }, [orders, setOrders, toast, supplierReferences, calculateShippingCost]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(
      orders.map(order => 
        order.id === orderId 
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
    
    toast({
      title: "Statut mis à jour",
      description: `Le statut de la commande a été mis à jour.`,
    });
  }, [orders, setOrders, toast]);

  const markItemAsReceived = useCallback((orderId: string, productId: string, receptionData?: {
    receivedQuantity?: number;
    receivedPrice?: number;
    litigeStatus?: string;
    litigeComment?: string;
    litigeSouhait?: string;
  }) => {
    setOrders(
      orders.map(order => 
        order.id === orderId 
          ? {
              ...order,
              items: order.items.map(item =>
                item.productId === productId
                  ? { 
                      ...item, 
                      received: true,
                      ...(receptionData && {
                        receivedQuantity: receptionData.receivedQuantity,
                        receivedPrice: receptionData.receivedPrice,
                        litigeStatus: receptionData.litigeStatus as any,
                        litigeComment: receptionData.litigeComment,
                        litigeSouhait: receptionData.litigeSouhait as any
                      })
                    }
                  : item
              ),
              updatedAt: new Date().toISOString()
            }
          : order
      )
    );
    
    toast({
      title: "Article réceptionné",
      description: "L'article a été marqué comme reçu.",
    });
  }, [orders, setOrders, toast]);

  const markAllItemsAsReceived = useCallback((orderId: string) => {
    setOrders(
      orders.map(order => 
        order.id === orderId 
          ? {
              ...order,
              items: order.items.map(item => ({ ...item, received: true })),
              updatedAt: new Date().toISOString()
            }
          : order
      )
    );
    
    toast({
      title: "Commande réceptionnée",
      description: "Tous les produits de la commande ont été marqués comme reçus.",
    });
  }, [orders, setOrders, toast]);

  const downloadOrderPDF = useCallback((order: Order) => {
    generateOrderPDF(order);
    
    toast({
      title: "PDF téléchargé",
      description: "Le bon de commande a été téléchargé avec succès.",
    });
  }, [toast]);

  return {
    createOrdersFromCart,
    createSingleOrderFromCart,
    updateOrderStatus,
    markItemAsReceived,
    markAllItemsAsReceived,
    downloadOrderPDF
  };
};
