
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitCompare, X, Trash2 } from 'lucide-react';
import { Product } from '@/types';

interface ComparisonBarProps {
  products: Product[];
  onOpenComparison: () => void;
  onClearComparison: () => void;
  onRemoveProduct: (productId: string) => void;
}

const ComparisonBar = ({ 
  products, 
  onOpenComparison, 
  onClearComparison,
  onRemoveProduct 
}: ComparisonBarProps) => {
  if (products.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitCompare className="h-4 w-4" />
            <span className="font-medium">Comparatif</span>
            <Badge variant="secondary">{products.length}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onClearComparison}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3 max-h-16 overflow-y-auto">
          {products.map((product) => (
            <Badge 
              key={product.id} 
              variant="outline" 
              className="text-xs flex items-center gap-1"
            >
              <span className="truncate max-w-20">{product.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-3 w-3 p-0 hover:bg-red-100"
                onClick={() => onRemoveProduct(product.id)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
        </div>
        
        <Button 
          className="w-full" 
          onClick={onOpenComparison}
          disabled={products.length < 2}
        >
          <GitCompare className="h-4 w-4 mr-2" />
          Comparer ({products.length})
        </Button>
      </div>
    </div>
  );
};

export default ComparisonBar;
