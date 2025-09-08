
export interface PriceChange {
  date: string; // ISO date string
  priceHT?: number;
  negotiatedPrice?: number;
  changedByRole?: 'client' | 'supplier' | 'admin' | 'guest';
}
