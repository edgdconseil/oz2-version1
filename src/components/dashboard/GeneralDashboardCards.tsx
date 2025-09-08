
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, LineChart } from "lucide-react";
import { Product, User } from '@/types';

interface GeneralDashboardCardsProps {
  products: Product[];
  user: User;
}

const GeneralDashboardCards = ({ products, user }: GeneralDashboardCardsProps) => {
  const foodProductCount = products.filter(p => p.category === 'food').length;
  const nonFoodProductCount = products.filter(p => p.category === 'non-food').length;
  const organicProductCount = products.filter(p => p.isOrganic).length;
  const availableProductCount = products.filter(p => p.available).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {user?.role === 'client' ? 'Produits disponibles' : 'Produits'}
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{availableProductCount}</div>
          <p className="text-xs text-muted-foreground">
            {foodProductCount} alimentaires, {nonFoodProductCount} non-alimentaires
          </p>
        </CardContent>
      </Card>
    
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {user?.role === 'client' ? 'Produits Bio' : 'Produits Bio'}
          </CardTitle>
          <div className="rounded-full bg-green-100 p-1">
            <div className="h-3 w-3 rounded-full bg-secondary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{organicProductCount}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((organicProductCount / products.length) * 100)}% du total
          </p>
        </CardContent>
      </Card>
    
      {user?.role === 'client' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              1 en cours, 1 en attente
            </p>
          </CardContent>
        </Card>
      )}
    
      {user?.role === 'admin' && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                1 client, 2 fournisseurs, 1 admin
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                1 en attente, 1 confirmée
              </p>
            </CardContent>
          </Card>
        </>
      )}
    
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Activité</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Normale</div>
          <p className="text-xs text-muted-foreground">
            Dernière activité : aujourd'hui
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralDashboardCards;
