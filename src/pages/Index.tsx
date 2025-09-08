import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/context/ProductContext";
import { useNews } from "@/context/news";
import { useProductUpdate } from "@/context/ProductUpdateContext";
import { ArrowRight, Package, ShoppingCart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import SupplierDashboardCards from "@/components/dashboard/SupplierDashboardCards";
import GeneralDashboardCards from "@/components/dashboard/GeneralDashboardCards";
import NewsSection from "@/components/dashboard/NewsSection";
import NewsCard from "@/components/dashboard/NewsCard";
import DashboardSummary from "@/components/dashboard/DashboardSummary";

const Index = () => {
  const { user } = useAuth();
  const { products } = useProducts();
  const { newsItems } = useNews();
  const { getRequestsBySupplier } = useProductUpdate();
  const [activeTab, setActiveTab] = useState("overview");

  const newsItemsForRole = user ? newsItems.filter(news => 
    news.status === 'approved' && 
    news.visibleToRoles.includes(user.role)
  ).slice(0, 3) : [];
  
  // Données spécifiques aux fournisseurs
  const supplierProducts = user?.role === 'supplier' ? products.filter(p => p.supplierId === user.id) : [];
  const supplierNews = user?.role === 'supplier' ? newsItems.filter(news => news.authorId === user.id) : [];
  const pendingSupplierNews = supplierNews.filter(news => news.status === 'pending');
  const approvedSupplierNews = supplierNews.filter(news => news.status === 'approved');
  const pendingProductUpdates = user?.role === 'supplier' ? getRequestsBySupplier(user.id).filter(req => req.status === 'pending') : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue, {user?.name} ! Voici un aperçu de votre activité.
          </p>
        </div>
        
        {user?.role === 'client' && (
          <Button asChild>
            <Link to="/catalog">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Catalogue produits
            </Link>
          </Button>
        )}
        
        {user?.role === 'supplier' && (
          <Button asChild>
            <Link to="/products">
              <Package className="mr-2 h-4 w-4" />
              Mes produits
            </Link>
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          {user?.role === 'client' && <TabsTrigger value="products">Produits</TabsTrigger>}
          {user?.role === 'client' && <TabsTrigger value="orders">Commandes</TabsTrigger>}
          {user?.role === 'supplier' && <TabsTrigger value="orders">Commandes reçues</TabsTrigger>}
          {user?.role === 'admin' && <TabsTrigger value="users">Utilisateurs</TabsTrigger>}
          <TabsTrigger value="news">Actualités</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Nouveau tableau de bord synthétique */}
          <DashboardSummary userRole={user?.role} />
          
          {/* Cartes de statistiques spécifiques aux fournisseurs */}
          {user?.role === 'supplier' && user && (
            <SupplierDashboardCards 
              supplierProducts={supplierProducts}
              pendingProductUpdates={pendingProductUpdates}
              approvedSupplierNews={approvedSupplierNews}
              pendingSupplierNews={pendingSupplierNews}
            />
          )}

          {/* Cartes existantes pour les autres rôles - en plus du summary */}
          {user?.role !== 'supplier' && user && (
            <GeneralDashboardCards products={products} user={user} />
          )}
          
          <div className={`grid gap-4 ${user?.role === 'supplier' ? 'md:grid-cols-1' : user?.role === 'client' ? 'md:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-7'}`}>
            <NewsSection 
              user={user!}
              newsItemsForRole={newsItemsForRole}
              supplierNews={supplierNews}
            />
            
            {user?.role === 'admin' && (
              <div className="col-span-3">
                {/* Placeholder pour actions rapides admin si nécessaire */}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Produits populaires</CardTitle>
              <CardDescription>
                Les produits les plus commandés ce mois-ci.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="w-[46px] h-[46px] rounded bg-muted mr-4 flex items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Pommes Bio</p>
                    <p className="text-sm text-muted-foreground">Ferme Bio Locale</p>
                  </div>
                  <div className="ml-auto font-medium">+ 5 kg</div>
                </div>
                <div className="flex items-center">
                  <div className="w-[46px] h-[46px] rounded bg-muted mr-4 flex items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Carottes</p>
                    <p className="text-sm text-muted-foreground">Ferme Bio Locale</p>
                  </div>
                  <div className="ml-auto font-medium">+ 3 kg</div>
                </div>
                <div className="flex items-center">
                  <div className="w-[46px] h-[46px] rounded bg-muted mr-4 flex items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Gel hydroalcoolique</p>
                    <p className="text-sm text-muted-foreground">Entrepôt Produits</p>
                  </div>
                  <div className="ml-auto font-medium">+ 10 unités</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commandes récentes</CardTitle>
              <CardDescription>
                {user?.role === 'client' 
                  ? 'Vos commandes des 30 derniers jours.'
                  : 'Commandes reçues des 30 derniers jours.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="w-[46px] h-[46px] rounded bg-muted mr-4 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Commande #1</p>
                    <p className="text-sm text-muted-foreground">10 avril 2025</p>
                  </div>
                  <div className="ml-auto">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                      Confirmée
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-[46px] h-[46px] rounded bg-muted mr-4 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Commande #2</p>
                    <p className="text-sm text-muted-foreground">12 avril 2025</p>
                  </div>
                  <div className="ml-auto">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800">
                      En attente
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs actifs</CardTitle>
              <CardDescription>
                Liste des utilisateurs de la plateforme.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="w-[46px] h-[46px] rounded-full bg-muted mr-4 flex items-center justify-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">EHPAD Les Tilleuls</p>
                    <p className="text-sm text-muted-foreground">Client</p>
                  </div>
                  <div className="ml-auto">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                      Actif
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-[46px] h-[46px] rounded-full bg-muted mr-4 flex items-center justify-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Ferme Bio Locale</p>
                    <p className="text-sm text-muted-foreground">Fournisseur</p>
                  </div>
                  <div className="ml-auto">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                      Actif
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-[46px] h-[46px] rounded-full bg-muted mr-4 flex items-center justify-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Entrepôt Produits Non-Alimentaires</p>
                    <p className="text-sm text-muted-foreground">Fournisseur</p>
                  </div>
                  <div className="ml-auto">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                      Actif
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les actualités</CardTitle>
              <CardDescription>
                Les dernières informations et offres disponibles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {newsItems.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {newsItems.map(news => (
                    <NewsCard key={news.id} news={news} />
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center border border-dashed rounded-md">
                  <p className="text-sm text-muted-foreground">Aucune actualité disponible</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/news">
                  Voir toutes les actualités <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
