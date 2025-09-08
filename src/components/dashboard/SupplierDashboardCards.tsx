
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertCircle, Bell, LineChart } from "lucide-react";
import { Product, ProductUpdateRequest, NewsItem } from '@/types';

interface SupplierDashboardCardsProps {
  supplierProducts: Product[];
  pendingProductUpdates: ProductUpdateRequest[];
  approvedSupplierNews: NewsItem[];
  pendingSupplierNews: NewsItem[];
}

const SupplierDashboardCards = ({ 
  supplierProducts, 
  pendingProductUpdates, 
  approvedSupplierNews, 
  pendingSupplierNews 
}: SupplierDashboardCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mes produits</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{supplierProducts.length}</div>
          <p className="text-xs text-muted-foreground">
            {supplierProducts.filter(p => p.available).length} disponibles
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">En attente validation</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingProductUpdates.length}</div>
          <p className="text-xs text-muted-foreground">
            Modifications produits
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Actualités publiées</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approvedSupplierNews.length}</div>
          <p className="text-xs text-muted-foreground">
            {pendingSupplierNews.length} en attente
          </p>
        </CardContent>
      </Card>

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

export default SupplierDashboardCards;
