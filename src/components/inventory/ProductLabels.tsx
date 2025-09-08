import { Badge } from '@/components/ui/badge';
import { Leaf, Award, Tag } from 'lucide-react';

interface ProductLabelsProps {
  isEgalim: boolean;
  isOrganic: boolean;
  otherLabels?: string;
  size?: 'sm' | 'md';
}

const ProductLabels = ({ isEgalim, isOrganic, otherLabels, size = 'md' }: ProductLabelsProps) => {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2 py-1';
  
  return (
    <div className="flex flex-wrap gap-1">
      {isOrganic && (
        <Badge 
          variant="outline" 
          className={`bg-green-50 text-green-700 border-green-200 font-medium ${sizeClasses} flex items-center gap-1`}
        >
          <Leaf className="h-3 w-3" />
          BIO
        </Badge>
      )}
      
      {isEgalim && (
        <Badge 
          variant="outline" 
          className={`bg-blue-50 text-blue-700 border-blue-200 font-medium ${sizeClasses} flex items-center gap-1`}
        >
          <Award className="h-3 w-3" />
          EGALIM
        </Badge>
      )}
      
      {otherLabels && otherLabels.trim() && (
        <Badge 
          variant="outline" 
          className={`bg-purple-50 text-purple-700 border-purple-200 font-medium ${sizeClasses} flex items-center gap-1`}
        >
          <Tag className="h-3 w-3" />
          {otherLabels}
        </Badge>
      )}
      
      {!isOrganic && !isEgalim && (!otherLabels || !otherLabels.trim()) && (
        <span className="text-xs text-muted-foreground italic">Aucun label</span>
      )}
    </div>
  );
};

export default ProductLabels;