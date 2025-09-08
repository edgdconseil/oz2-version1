import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDays, ShoppingCart, TrendingUp, Euro, Package, Download, CalendarIcon, Filter, X } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import { fr } from 'date-fns/locale';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import type { 
  SupplierAnalytics, 
  CategoryAnalytics, 
  LabelAnalytics, 
  DailyAnalytics,
  AnalyticsFilters 
} from '@/types/analytics';
import { useAuth } from '@/context/AuthContext';

// Données mockées pour les filtres
const mockClients = [
  { id: '1', name: 'Restaurant Le Gourmet', email: 'contact@legourmet.fr' },
  { id: '2', name: 'Café des Arts', email: 'info@cafedesarts.fr' },
  { id: '3', name: 'Bistrot du Marché', email: 'hello@bistrotdumarche.fr' },
  { id: '4', name: 'Restaurant Central', email: 'contact@central.fr' },
];

const mockSuppliers = [
  { id: '1', name: 'Fournisseur Bio' },
  { id: '2', name: 'Maraîcher Local' },
  { id: '3', name: 'Épicerie Fine' },
  { id: '4', name: 'Boulangerie Artisanale' },
];

const mockCategories = [
  { id: '1', name: 'Fruits et Légumes' },
  { id: '2', name: 'Produits Laitiers' },
  { id: '3', name: 'Viandes' },
  { id: '4', name: 'Épicerie' },
  { id: '5', name: 'Boulangerie' },
];

// Données mockées - à remplacer par des données réelles depuis Supabase
const mockSupplierData: SupplierAnalytics[] = [
  { supplierName: 'Fournisseur Bio', orderCount: 45, totalAmount: 12500.00 },
  { supplierName: 'Maraîcher Local', orderCount: 32, totalAmount: 8300.50 },
  { supplierName: 'Épicerie Fine', orderCount: 28, totalAmount: 6750.25 },
  { supplierName: 'Boulangerie Artisanale', orderCount: 15, totalAmount: 3200.75 },
];

const mockCategoryData: CategoryAnalytics[] = [
  { category: 'Fruits et Légumes', totalAmount: 15600.50, orderCount: 85 },
  { category: 'Produits Laitiers', totalAmount: 8900.25, orderCount: 45 },
  { category: 'Viandes', totalAmount: 12300.75, orderCount: 38 },
  { category: 'Épicerie', totalAmount: 6850.00, orderCount: 62 },
  { category: 'Boulangerie', totalAmount: 4200.25, orderCount: 28 },
];

const mockLabelData: LabelAnalytics[] = [
  { label: 'Bio', totalAmount: 18500.00, orderCount: 125 },
  { label: 'Local', totalAmount: 12300.50, orderCount: 89 },
  { label: 'Commerce Équitable', totalAmount: 8900.25, orderCount: 45 },
  { label: 'Sans Gluten', totalAmount: 3200.75, orderCount: 28 },
];

const mockDailyData: DailyAnalytics[] = [
  { date: '2024-07-30', totalAmount: 1250.50, orderCount: 8 },
  { date: '2024-07-31', totalAmount: 980.25, orderCount: 6 },
  { date: '2024-08-01', totalAmount: 1580.75, orderCount: 12 },
  { date: '2024-08-02', totalAmount: 2100.00, orderCount: 15 },
  { date: '2024-08-03', totalAmount: 1750.25, orderCount: 11 },
  { date: '2024-08-04', totalAmount: 2250.50, orderCount: 18 },
  { date: '2024-08-05', totalAmount: 1890.75, orderCount: 14 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff7f', '#dc143c'];

const OrderAnalytics = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<AnalyticsFilters>({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const isAdmin = user?.role === 'admin';
  const pageTitle = isAdmin ? 'Analyse des commandes - Tous les clients' : 'Analyse de mes commandes';

  const stats = useMemo(() => {
    const totalAmount = mockDailyData.reduce((sum, day) => sum + day.totalAmount, 0);
    const totalOrders = mockDailyData.reduce((sum, day) => sum + day.orderCount, 0);
    const avgOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;
    const topSupplier = mockSupplierData.reduce((prev, current) => 
      prev.totalAmount > current.totalAmount ? prev : current
    );

    return {
      totalAmount: totalAmount.toFixed(2),
      totalOrders,
      avgOrderValue: avgOrderValue.toFixed(2),
      topSupplier: topSupplier.supplierName,
    };
  }, []);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    const endDate = new Date();
    let startDate = new Date();

    switch (period) {
      case '7':
        startDate = subDays(endDate, 7);
        break;
      case '30':
        startDate = subDays(endDate, 30);
        break;
      case '90':
        startDate = subDays(endDate, 90);
        break;
      case 'month':
        startDate = startOfMonth(endDate);
        break;
      default:
        startDate = subDays(endDate, 30);
    }

    setFilters(prev => ({
      ...prev,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
    }));
  };

  const handleFilterChange = (key: keyof AnalyticsFilters, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
    });
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedPeriod('30');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (isAdmin && filters.userId) count++;
    if (filters.supplierId) count++;
    if (filters.category) count++;
    return count;
  };

  const exportAnalytics = () => {
    const exportData = [
      ['Résumé des analyses'],
      ['Période', `${filters.startDate} - ${filters.endDate}`],
      ['Montant total', `${stats.totalAmount} €`],
      ['Nombre de commandes', stats.totalOrders.toString()],
      ['Valeur moyenne par commande', `${stats.avgOrderValue} €`],
      [''],
      ['Analyse par fournisseur'],
      ['Fournisseur', 'Nb Commandes', 'Montant Total'],
      ...mockSupplierData.map(s => [s.supplierName, s.orderCount.toString(), `${s.totalAmount.toFixed(2)} €`]),
      [''],
      ['Analyse par catégorie'],
      ['Catégorie', 'Nb Commandes', 'Montant Total'],
      ...mockCategoryData.map(c => [c.category, c.orderCount.toString(), `${c.totalAmount.toFixed(2)} €`]),
    ];

    const csvContent = exportData.map(row => row.join(';')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `analyse_commandes_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground mt-2">
            Analysez les tendances et performances de vos commandes
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowFilters(!showFilters)} 
            variant={showFilters ? "default" : "outline"}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
            {getActiveFiltersCount() > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
          <Button onClick={exportAnalytics} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Filtres {isAdmin ? 'avancés' : ''}</CardTitle>
              <Button onClick={clearFilters} variant="ghost" size="sm">
                <X className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Filtre par client - uniquement pour admin */}
              {isAdmin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client</label>
                <Select value={filters.userId || 'all'} onValueChange={(value) => handleFilterChange('userId', value === 'all' ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les clients</SelectItem>
                    {mockClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>
              )}

              {/* Filtre par fournisseur */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Fournisseur</label>
              <Select value={filters.supplierId || 'all'} onValueChange={(value) => handleFilterChange('supplierId', value === 'all' ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder={isAdmin ? "Tous les fournisseurs" : "Mes fournisseurs"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isAdmin ? "Tous les fournisseurs" : "Mes fournisseurs"}</SelectItem>
                  {mockSuppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>

              {/* Filtre par catégorie */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Famille de produits</label>
              <Select value={filters.category || 'all'} onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder={isAdmin ? "Toutes les familles" : "Mes familles"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{isAdmin ? "Toutes les familles" : "Mes familles"}</SelectItem>
                  {mockCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>

              {/* Filtre par période personnalisée */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Période personnalisée</label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'dd/MM') : 'Début'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          if (date) {
                            handleFilterChange('startDate', format(date, 'yyyy-MM-dd'));
                          }
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'dd/MM') : 'Fin'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date);
                          if (date) {
                            handleFilterChange('endDate', format(date, 'yyyy-MM-dd'));
                          }
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Affichage des filtres actifs */}
            {getActiveFiltersCount() > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium">Filtres actifs:</span>
                  {isAdmin && filters.userId && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Client: {mockClients.find(c => c.id === filters.userId)?.name}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleFilterChange('userId', undefined)}
                      />
                    </Badge>
                  )}
                  {filters.supplierId && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Fournisseur: {mockSuppliers.find(s => s.id === filters.supplierId)?.name}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleFilterChange('supplierId', undefined)}
                      />
                    </Badge>
                  )}
                  {filters.category && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Famille: {mockCategories.find(c => c.id === filters.category)?.name}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleFilterChange('category', undefined)}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filtres de période */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedPeriod === '7' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePeriodChange('7')}
        >
          7 jours
        </Button>
        <Button
          variant={selectedPeriod === '30' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePeriodChange('30')}
        >
          30 jours
        </Button>
        <Button
          variant={selectedPeriod === '90' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePeriodChange('90')}
        >
          90 jours
        </Button>
        <Button
          variant={selectedPeriod === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePeriodChange('month')}
        >
          Ce mois
        </Button>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant total</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAmount} €</div>
            <p className="text-xs text-muted-foreground">
              Période sélectionnée
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nombre de commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Commandes passées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgOrderValue} €</div>
            <p className="text-xs text-muted-foreground">
              Par commande
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top fournisseur</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{stats.topSupplier}</div>
            <p className="text-xs text-muted-foreground">
              Meilleur CA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et analyses */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="timeline">Évolution</TabsTrigger>
          <TabsTrigger value="suppliers">Fournisseurs</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="labels">Labels</TabsTrigger>
          <TabsTrigger value="comparison">Comparaison</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des commandes par jour</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockDailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => format(new Date(value), 'dd/MM', { locale: fr })}
                  />
                  <YAxis yAxisId="amount" orientation="left" />
                  <YAxis yAxisId="count" orientation="right" />
                  <Tooltip 
                    labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy', { locale: fr })}
                    formatter={(value, name) => [
                      name === 'totalAmount' ? `${value} €` : value,
                      name === 'totalAmount' ? 'Montant' : 'Nb Commandes'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="amount" dataKey="totalAmount" fill="#8884d8" name="Montant (€)" />
                  <Line yAxisId="count" type="monotone" dataKey="orderCount" stroke="#82ca9d" name="Nb Commandes" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par fournisseur</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockSupplierData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalAmount"
                    >
                      {mockSupplierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} €`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Détail par fournisseur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSupplierData.map((supplier, index) => (
                    <div key={supplier.supplierName} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div>
                          <div className="font-medium">{supplier.supplierName}</div>
                          <div className="text-sm text-muted-foreground">
                            {supplier.orderCount} commandes
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{supplier.totalAmount.toFixed(2)} €</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Montant par catégorie de produits</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockCategoryData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={120} />
                  <Tooltip formatter={(value) => `${value} €`} />
                  <Legend />
                  <Bar dataKey="totalAmount" fill="#8884d8" name="Montant (€)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse par labels produits</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockLabelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} €`} />
                  <Legend />
                  <Bar dataKey="totalAmount" fill="#82ca9d" name="Montant (€)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Catégories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCategoryData
                    .sort((a, b) => b.totalAmount - a.totalAmount)
                    .slice(0, 5)
                    .map((category, index) => (
                      <div key={category.category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span>{category.category}</span>
                        </div>
                        <span className="font-bold">{category.totalAmount.toFixed(2)} €</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Labels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockLabelData
                    .sort((a, b) => b.totalAmount - a.totalAmount)
                    .map((label, index) => (
                      <div key={label.label} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span>{label.label}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{label.totalAmount.toFixed(2)} €</div>
                          <div className="text-sm text-muted-foreground">
                            {label.orderCount} commandes
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderAnalytics;