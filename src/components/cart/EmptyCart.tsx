
import { ShoppingCart, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EmptyCart = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-12">
      <div className="bg-white rounded-lg shadow p-8 max-w-md mx-auto text-center">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 rounded-full bg-ozego-accent flex items-center justify-center">
            <ShoppingCart className="h-10 w-10 text-ozego-primary" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-ozego-text mb-2">Votre panier est vide</h1>
        <p className="text-ozego-secondary mb-8">
          Vous n'avez pas encore ajouté de produits à votre panier.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            className="bg-ozego-primary hover:bg-ozego-primary/90"
            onClick={() => navigate('/catalog')}
          >
            Parcourir le catalogue
          </Button>
          
          <Button 
            variant="outline"
            className="border-ozego-primary text-ozego-primary hover:bg-ozego-primary hover:text-white"
            onClick={() => navigate('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
