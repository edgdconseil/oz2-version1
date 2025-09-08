
import { Link } from 'react-router-dom';
import { ShoppingCart, LogOut, User, Newspaper } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

const DesktopNavigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();

  return (
    <nav className="hidden md:flex items-center space-x-4">
      {isAuthenticated ? (
        <>
          {(user?.role === 'client' || user?.role === 'guest') && (
            <>
              <Link to="/news" className="px-3 py-2 text-ozego-text hover:text-ozego-primary">
                <Newspaper className="h-5 w-5 text-ozego-primary inline mr-1" />
                Actualités
              </Link>
              <Link to="/catalog" className="px-3 py-2 text-ozego-text hover:text-ozego-primary">
                Catalogue
              </Link>
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-ozego-primary" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-ozego-primary rounded-full w-5 h-5 flex items-center justify-center text-white text-xs">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </>
          )}
          
          {user?.role === 'supplier' && (
            <>
              <Link to="/news" className="px-3 py-2 text-ozego-text hover:text-ozego-primary">
                <Newspaper className="h-5 w-5 text-ozego-primary inline mr-1" />
                Actualités
              </Link>
              <Link to="/products" className="px-3 py-2 text-ozego-text hover:text-ozego-primary">
                Mes Produits
              </Link>
            </>
          )}
          
          {user?.role === 'admin' && (
            <>
              <Link to="/news" className="px-3 py-2 text-ozego-text hover:text-ozego-primary">
                <Newspaper className="h-5 w-5 text-ozego-primary inline mr-1" />
                Actualités
              </Link>
              <Link to="/admin/users" className="px-3 py-2 text-ozego-text hover:text-ozego-primary">
                Utilisateurs
              </Link>
              <Link to="/admin/products" className="px-3 py-2 text-ozego-text hover:text-ozego-primary">
                Produits
              </Link>
              <Link to="/admin/orders" className="px-3 py-2 text-ozego-text hover:text-ozego-primary">
                Commandes
              </Link>
            </>
          )}
          
          <div className="flex items-center space-x-2 ml-4">
            <User className="h-5 w-5 text-ozego-primary" />
            <span className="font-medium">{user?.name}</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="ml-2 text-ozego-primary border-ozego-primary hover:bg-ozego-primary hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Déconnexion
          </Button>
        </>
      ) : (
        <Link to="/login">
          <Button variant="default" size="sm" className="bg-ozego-primary hover:bg-opacity-90">
            Connexion
          </Button>
        </Link>
      )}
    </nav>
  );
};

export default DesktopNavigation;
