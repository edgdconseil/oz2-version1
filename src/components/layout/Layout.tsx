
import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useNews } from '@/context/news';
import { useInventory } from '@/context/InventoryContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2, ShoppingCart, Bell, CheckCircle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { getTotalItems } = useCart();
  const { getNewsByRole, getPendingNews } = useNews();
  const { getProductAlerts } = useInventory();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-ozego-primary" />
        <span className="ml-2 text-lg">Chargement...</span>
      </div>
    );
  }

  // Nombre d'articles dans le panier (pour les clients et invités)
  const cartItemsCount = isAuthenticated && (user?.role === 'client' || user?.role === 'guest') ? getTotalItems() : 0;
  
  // Nombre d'actualités non lues (pour tous les utilisateurs)
  const newsItems = isAuthenticated && user ? getNewsByRole(user.role) : [];
  const newsCount = newsItems.length;
  
  // Nombre d'actualités en attente de validation (pour les administrateurs)
  const pendingNewsCount = isAuthenticated && user?.role === 'admin' ? getPendingNews().length : 0;
  
  // Nombre d'alertes d'inventaire (pour les clients et invités)
  const inventoryAlerts = isAuthenticated && (user?.role === 'client' || user?.role === 'guest') ? getProductAlerts() : [];
  const inventoryAlertsCount = inventoryAlerts.length;

  return (
    <div className="min-h-screen bg-ozego-background">
      <Header />
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto ${isAuthenticated ? 'ml-0 md:ml-64' : ''}`}>
          {children}
        </main>
        
        {/* Flottants pour les notifications et le panier */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-4">
          {/* Bouton des alertes d'inventaire pour les clients et invités */}
          {isAuthenticated && (user?.role === 'client' || user?.role === 'guest') && inventoryAlertsCount > 0 && (
            <Link to="/inventory" className="bg-amber-500 text-white rounded-full p-3 shadow-lg flex items-center">
              <Package className="h-6 w-6" />
              <Badge variant="outline" className="ml-2 bg-white text-amber-700">{inventoryAlertsCount}</Badge>
            </Link>
          )}
          
          {/* Bouton des actualités à valider pour les administrateurs */}
          {isAuthenticated && user?.role === 'admin' && pendingNewsCount > 0 && (
            <Link to="/news" className="bg-amber-500 text-white rounded-full p-3 shadow-lg flex items-center">
              <CheckCircle className="h-6 w-6" />
              <Badge variant="outline" className="ml-2 bg-white text-amber-700">{pendingNewsCount}</Badge>
            </Link>
          )}
          
          {/* Bouton des actualités pour tous les utilisateurs authentifiés */}
          {isAuthenticated && newsCount > 0 && (
            <Link to="/news" className="bg-ozego-primary text-white rounded-full p-3 shadow-lg flex items-center">
              <Bell className="h-6 w-6" />
              <Badge variant="outline" className="ml-2 bg-white text-ozego-primary">{newsCount}</Badge>
            </Link>
          )}
          
          {/* Bouton du panier pour les clients et invités */}
          {isAuthenticated && (user?.role === 'client' || user?.role === 'guest') && cartItemsCount > 0 && (
            <Link to="/cart" className="bg-ozego-primary text-white rounded-full p-3 shadow-lg flex items-center">
              <ShoppingCart className="h-6 w-6" />
              <Badge variant="outline" className="ml-2 bg-white text-ozego-primary">{cartItemsCount}</Badge>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
