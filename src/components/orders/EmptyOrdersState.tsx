
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyOrdersState = () => {
  return (
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="h-20 w-20 rounded-full bg-ozego-accent flex items-center justify-center">
          <Package className="h-10 w-10 text-ozego-primary" />
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-2 text-ozego-text">Aucune commande</h2>
      <p className="text-ozego-secondary mb-4">
        Vous n'avez pas encore passé de commande.
      </p>
      
      <Button 
        onClick={() => window.location.href = '/catalog'}
        className="bg-ozego-primary hover:bg-ozego-primary/90"
      >
        Parcourir le catalogue
      </Button>
    </div>
  );
};

export default EmptyOrdersState;
