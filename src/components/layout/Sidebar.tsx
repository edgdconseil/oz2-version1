
import { useAuth } from '@/context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  ShoppingBag, 
  ShoppingCart, 
  Package, 
  Home, 
  FileCog, 
  Settings,
  Clipboard,
  Newspaper,
  GraduationCap,
  Archive,
  Building2,
  CheckCircle,
  Truck,
  Warehouse,
  MapPin,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  // Define navigation items based on user role
  const getNavItems = () => {
    switch (user.role) {
      case 'client':
        return [
          { icon: Home, label: 'Tableau de bord', path: '/' },
          { icon: Newspaper, label: 'Actualités', path: '/news' },
          { icon: ShoppingBag, label: 'Catalogue', path: '/catalog' },
          { icon: MapPin, label: 'Produits locaux', path: '/local-products' },
          { icon: ShoppingCart, label: 'Panier', path: '/cart' },
          { icon: RefreshCw, label: 'Commandes récurrentes', path: '/recurring-orders' },
          { icon: Clipboard, label: 'Commandes', path: '/orders' },
          { icon: Archive, label: 'Inventaire', path: '/inventory' },
          { icon: Building2, label: 'Mes fournisseurs', path: '/suppliers' },
          { icon: GraduationCap, label: 'Catalogue expert', path: '/trainings' },
          { icon: BarChart3, label: 'Analyse commandes', path: '/client/order-analytics' },
        ];
      case 'guest':
        return [
          { icon: Home, label: 'Tableau de bord', path: '/' },
          { icon: Newspaper, label: 'Actualités', path: '/news' },
          { icon: ShoppingBag, label: 'Catalogue', path: '/catalog' },
          { icon: MapPin, label: 'Produits locaux', path: '/local-products' },
          { icon: ShoppingCart, label: 'Panier', path: '/cart' },
          { icon: RefreshCw, label: 'Commandes récurrentes', path: '/recurring-orders' },
          { icon: Clipboard, label: 'Commandes', path: '/orders' },
          { icon: Archive, label: 'Inventaire', path: '/inventory' },
          { icon: Building2, label: 'Mes fournisseurs', path: '/suppliers' },
          { icon: GraduationCap, label: 'Catalogue expert', path: '/trainings' },
          { icon: BarChart3, label: 'Analyse commandes', path: '/client/order-analytics' },
        ];
      case 'supplier':
        return [
          { icon: Home, label: 'Tableau de bord', path: '/' },
          { icon: Newspaper, label: 'Actualités', path: '/news' },
          { icon: Package, label: 'Mes Produits', path: '/products' },
        ];
      case 'admin':
        return [
          { icon: Home, label: 'Tableau de bord', path: '/' },
          { icon: Newspaper, label: 'Actualités', path: '/news' },
          { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
          { icon: ShoppingBag, label: 'Produits', path: '/admin/products' },
          { icon: CheckCircle, label: 'Validation produits', path: '/admin/product-validation' },
          { icon: Clipboard, label: 'Commandes', path: '/admin/orders' },
          { icon: Truck, label: 'Frais de livraison', path: '/admin/shipping-costs' },
          { icon: Warehouse, label: 'Dépôts', path: '/admin/depots' },
          { icon: FileCog, label: 'Catégories', path: '/admin/categories' },
          { icon: BarChart3, label: 'Suivi clients', path: '/admin/client-tracking' },
          { icon: BarChart3, label: 'Analyse commandes', path: '/admin/order-analytics' },
        ];
      default:
        return [];
    }
  };
  
  const navItems = getNavItems();
  
  return (
    <aside className="hidden md:block w-64 bg-white border-r border-border h-[calc(100vh-64px)] fixed top-16">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-ozego-text mb-2">
            {user.organization || user.name}
          </h2>
          <div className="text-xs text-ozego-secondary">
            {user.role === 'client' ? 'Espace Client' : 
             user.role === 'supplier' ? 'Espace Fournisseur' : 
             user.role === 'guest' ? 'Espace Invité' :
             'Espace Administrateur'}
          </div>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-3 rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-ozego-accent text-ozego-primary"
                  : "text-ozego-text hover:bg-ozego-accent hover:text-ozego-primary"
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-border">
        <div className="text-xs text-ozego-secondary">
          © {new Date().getFullYear()} Ozego Order Hub
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
