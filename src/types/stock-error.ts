export type StockErrorType = 'expired' | 'damaged' | 'unpacking_issue' | 'quality_issue' | 'other';

export interface StockError {
  id: string;
  productId: string;
  productName: string;
  productReference: string;
  errorType: StockErrorType;
  quantity: number;
  unit: string;
  description: string;
  dateReported: string;
  reportedBy: string;
  supplierName: string;
  estimatedValue: number;
}

export const stockErrorLabels: Record<StockErrorType, string> = {
  expired: 'Produit périmé',
  damaged: 'Produit endommagé',
  unpacking_issue: 'Problème déballage',
  quality_issue: 'Problème qualité',
  other: 'Autre'
};