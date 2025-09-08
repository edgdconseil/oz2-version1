export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'biannual';

export interface RecurringOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  supplierId: string;
  supplierName: string;
}

export interface RecurringOrder {
  id: string;
  name: string;
  clientId: string;
  items: RecurringOrderItem[];
  frequency: RecurringFrequency;
  nextExecutionDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastExecutionDate?: string;
}

export interface RecurringOrderContextType {
  recurringOrders: RecurringOrder[];
  createRecurringOrder: (order: Omit<RecurringOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecurringOrder: (id: string, updates: Partial<RecurringOrder>) => void;
  deleteRecurringOrder: (id: string) => void;
  toggleRecurringOrder: (id: string) => void;
  executeRecurringOrder: (id: string) => void;
  checkAndExecuteRecurringOrders: () => void;
}