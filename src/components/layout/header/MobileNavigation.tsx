
import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, User, Newspaper } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

interface MobileNavigationProps {
  mobileMenuOpen: boolean;
}

const MobileNavigation = ({ mobileMenuOpen }: MobileNavigationProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();

  if (!mobileMenuOpen) return null;

  return (
    <nav className="md:hidden mt-4 pb-4 space-y-2">
      {isAuthenticated ? (
        <>
          <div className="flex items-center space-x-2 py-2 border-b border-border mb-2">
            <User className="h-5 w-5 text-ozego-primary" />
            <span className="font-medium">{user?.name}</span>
          </div>

          <Link to="/news" className="block py-2 text-ozego-text hover:text-ozego-primary">
            <Newspaper className="h-5 w-5 inline mr-2 text-ozego-primary" />
            Actualités
          </Link>

          {user?.role === 'client' && (
            <>
              <Link to="/catalog" className="block py-2 text-ozego-text hover:text-ozego-primary">
                Catalogue
              </Link>
              <Link to="/cart" className="flex items-center py-2 text-ozego-text hover:text-ozego-primary">
                <ShoppingCart className="h-5 w-5 mr-2 text-ozego-primary" />
                Panier
                {getTotalItems() > 0 && (
                  <span className="ml-2 bg-ozego-primary rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </>
          )}
          
          {user?.role === 'supplier' && (
            <>
              <Link to="/products" className="block py-2 text-ozego-text hover:text-ozego-primary">
                Mes Produits
              </Link>
              <Link to="/orders" className="block py-2 text-ozego-text hover:text-ozego-primary">
                Commandes
              </Link>
            </>
          )}
          
          {user?.role === 'admin' && (
            <>
              <Link to="/admin/users" className="block py-2 text-ozego-text hover:text-ozego-primary">
                Utilisateurs
              </Link>
              <Link to="/admin/products" className="block py-2 text-ozego-text hover:text-ozego-primary">
                Produits
              </Link>
              <Link to="/admin/orders" className="block py-2 text-ozego-text hover:text-ozego-primary">
                Commandes
              </Link>
            </>
          )}
          
          <Button 
            variant="outline" 
            onClick={logout}
            className="w-full mt-2 text-ozego-primary border-ozego-primary hover:bg-ozego-primary hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </>
      ) : (
        <Link to="/login" className="w-full block">
          <Button variant="default" className="w-full bg-ozego-primary hover:bg-opacity-90">
            Connexion
          </Button>
        </Link>
      )}
    </nav>
  );
};

export default MobileNavigation;
