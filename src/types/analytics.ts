export interface UserConnection {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'client' | 'guest';
  connectionDate: string;
  sessionDuration?: number; // en minutes
  ipAddress?: string;
}

export interface UserActivity {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'client' | 'guest';
  lastConnection: string;
  totalConnections: number;
  totalOrders: number;
  lastOrderDate?: string;
  isActive: boolean;
  accessExpiryDate?: string;
}

export interface OrderActivity {
  id: string;
  userId: string;
  orderDate: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  itemsCount: number;
}

export interface OrderAnalytics {
  totalAmount: number;
  orderCount: number;
  period: string;
}

export interface SupplierAnalytics {
  supplierName: string;
  orderCount: number;
  totalAmount: number;
}

export interface CategoryAnalytics {
  category: string;
  totalAmount: number;
  orderCount: number;
}

export interface LabelAnalytics {
  label: string;
  totalAmount: number;
  orderCount: number;
}

export interface DailyAnalytics {
  date: string;
  totalAmount: number;
  orderCount: number;
}

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  userId?: string;
  supplierId?: string;
  category?: string;
}