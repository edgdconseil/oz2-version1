
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitCompare, Check } from 'lucide-react';
import { Product } from '@/types';

interface ProductComparisonButtonProps {
  product: Product;
  isInComparison: boolean;
  onToggleComparison: (product: Product) => void;
  comparisonCount: number;
}

const ProductComparisonButton = ({ 
  product, 
  isInComparison, 
  onToggleComparison,
  comparisonCount 
}: ProductComparisonButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleComparison(product);
  };

  return (
    <div className="absolute top-0 left-0 flex items-center gap-1 z-10">
      <Button
        variant={isInComparison ? "default" : "secondary"}
        size="sm"
        className="h-8 w-8 p-0 bg-primary text-white border-2 border-white shadow-xl hover:bg-primary/90 hover:scale-105 transition-all"
        onClick={handleClick}
        disabled={!isInComparison && comparisonCount >= 4}
      >
        {isInComparison ? (
          <Check className="h-4 w-4" />
        ) : (
          <GitCompare className="h-4 w-4" />
        )}
      </Button>
      {comparisonCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          {comparisonCount}
        </Badge>
      )}
    </div>
  );
};

export default ProductComparisonButton;
