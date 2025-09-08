import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Users, ShoppingCart, Clock, TrendingUp, Search, Download } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { UserActivity, UserConnection, OrderActivity } from '@/types/analytics';

// Données mockées - à remplacer par des données réelles depuis Supabase
const mockUserActivities: UserActivity[] = [
  {
    userId: '1',
    userName: 'Jean Dupont',
    userEmail: 'jean.dupont@example.com',
    userRole: 'client',
    lastConnection: '2024-08-05T08:30:00Z',
    totalConnections: 15,
    totalOrders: 8,
    lastOrderDate: '2024-08-04T14:20:00Z',
    isActive: true,
  },
  {
    userId: '2',
    userName: 'Marie Martin',
    userEmail: 'marie.martin@example.com',
    userRole: 'client',
    lastConnection: '2024-08-03T16:45:00Z',
    totalConnections: 23,
    totalOrders: 12,
    lastOrderDate: '2024-08-03T17:10:00Z',
    isActive: true,
  },
  {
    userId: '3',
    userName: 'Pierre Invité',
    userEmail: 'pierre.invite@example.com',
    userRole: 'guest',
    lastConnection: '2024-07-28T10:15:00Z',
    totalConnections: 3,
    totalOrders: 1,
    lastOrderDate: '2024-07-25T11:30:00Z',
    isActive: false,
    accessExpiryDate: '2024-08-01T00:00:00Z',
  },
];

const mockConnections: UserConnection[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Jean Dupont',
    userEmail: 'jean.dupont@example.com',
    userRole: 'client',
    connectionDate: '2024-08-05T08:30:00Z',
    sessionDuration: 45,
    ipAddress: '192.168.1.100',
  },
  {
    id: '2',
    userId: '2',
    userName: 'Marie Martin',
    userEmail: 'marie.martin@example.com',
    userRole: 'client',
    connectionDate: '2024-08-03T16:45:00Z',
    sessionDuration: 32,
    ipAddress: '192.168.1.101',
  },
  {
    id: '3',
    userId: '1',
    userName: 'Jean Dupont',
    userEmail: 'jean.dupont@example.com',
    userRole: 'client',
    connectionDate: '2024-08-04T09:15:00Z',
    sessionDuration: 28,
    ipAddress: '192.168.1.100',
  },
];

const mockOrders: OrderActivity[] = [
  {
    id: '1',
    userId: '1',
    orderDate: '2024-08-04T14:20:00Z',
    totalAmount: 156.50,
    status: 'delivered',
    itemsCount: 8,
  },
  {
    id: '2',
    userId: '2',
    orderDate: '2024-08-03T17:10:00Z',
    totalAmount: 89.30,
    status: 'shipped',
    itemsCount: 5,
  },
];

const ClientTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30'); // 7, 30, 90 jours

  const filteredActivities = useMemo(() => {
    return mockUserActivities.filter(activity =>
      activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredConnections = useMemo(() => {
    const periodDate = new Date();
    periodDate.setDate(periodDate.getDate() - parseInt(selectedPeriod));
    
    return mockConnections.filter(connection => {
      const connectionDate = new Date(connection.connectionDate);
      const matchesSearch = connection.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           connection.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const inPeriod = connectionDate >= periodDate;
      return matchesSearch && inPeriod;
    });
  }, [searchTerm, selectedPeriod]);

  const stats = useMemo(() => {
    const activeUsers = mockUserActivities.filter(u => u.isActive).length;
    const totalConnections = mockUserActivities.reduce((sum, u) => sum + u.totalConnections, 0);
    const totalOrders = mockUserActivities.reduce((sum, u) => sum + u.totalOrders, 0);
    const avgOrdersPerUser = totalOrders / mockUserActivities.length;

    return {
      activeUsers,
      totalConnections,
      totalOrders,
      avgOrdersPerUser: avgOrdersPerUser.toFixed(1),
    };
  }, []);

  const exportData = () => {
    // Préparer les données pour l'export
    const exportData = filteredActivities.map(activity => ({
      "Nom": activity.userName,
      "Email": activity.userEmail,
      "Rôle": activity.userRole,
      "Statut": activity.isActive ? 'Actif' : 'Inactif',
      "Dernière connexion": format(new Date(activity.lastConnection), 'dd/MM/yyyy HH:mm', { locale: fr }),
      "Total connexions": activity.totalConnections,
      "Total commandes": activity.totalOrders,
      "Dernière commande": activity.lastOrderDate 
        ? format(new Date(activity.lastOrderDate), 'dd/MM/yyyy HH:mm', { locale: fr })
        : 'Aucune',
      "Date d'expiration": activity.accessExpiryDate 
        ? format(new Date(activity.accessExpiryDate), 'dd/MM/yyyy', { locale: fr })
        : 'N/A'
    }));

    // Créer le CSV
    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(';'),
      ...exportData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(';')
      )
    ].join('\n');

    // Télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `suivi_clients_${dateStr}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (isActive: boolean, expiryDate?: string) => {
    if (!isActive) {
      return <Badge variant="destructive">Inactif</Badge>;
    }
    if (expiryDate && new Date(expiryDate) < new Date()) {
      return <Badge variant="destructive">Expiré</Badge>;
    }
    return <Badge variant="default">Actif</Badge>;
  };

  const getOrderStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      confirmed: 'default',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive',
    } as const;

    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Suivi des connexions clients</h1>
          <p className="text-muted-foreground mt-2">
            Suivez l'activité de vos clients : connexions, commandes et engagement
          </p>
        </div>
        <Button onClick={exportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              sur {mockUserActivities.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total connexions</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConnections}</div>
            <p className="text-xs text-muted-foreground">
              Toutes périodes confondues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Toutes périodes confondues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moy. commandes/client</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgOrdersPerUser}</div>
            <p className="text-xs text-muted-foreground">
              Par utilisateur
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recherche */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="activity" className="w-full">
        <TabsList>
          <TabsTrigger value="activity">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="connections">Historique des connexions</TabsTrigger>
          <TabsTrigger value="orders">Historique des commandes</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activité des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead>Total connexions</TableHead>
                    <TableHead>Total commandes</TableHead>
                    <TableHead>Dernière commande</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => (
                    <TableRow key={activity.userId}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{activity.userName}</div>
                          <div className="text-sm text-muted-foreground">{activity.userEmail}</div>
                          <Badge variant="outline" className="mt-1">
                            {activity.userRole}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(activity.isActive, activity.accessExpiryDate)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(activity.lastConnection), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </TableCell>
                      <TableCell>{activity.totalConnections}</TableCell>
                      <TableCell>{activity.totalOrders}</TableCell>
                      <TableCell>
                        {activity.lastOrderDate 
                          ? format(new Date(activity.lastOrderDate), 'dd/MM/yyyy HH:mm', { locale: fr })
                          : 'Aucune'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === '7' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('7')}
            >
              7 jours
            </Button>
            <Button
              variant={selectedPeriod === '30' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('30')}
            >
              30 jours
            </Button>
            <Button
              variant={selectedPeriod === '90' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('90')}
            >
              90 jours
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historique des connexions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Date de connexion</TableHead>
                    <TableHead>Durée de session</TableHead>
                    <TableHead>Adresse IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConnections.map((connection) => (
                    <TableRow key={connection.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{connection.userName}</div>
                          <div className="text-sm text-muted-foreground">{connection.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(connection.connectionDate), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {connection.sessionDuration ? `${connection.sessionDuration} min` : 'En cours'}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {connection.ipAddress || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique des commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Date de commande</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => {
                    const user = mockUserActivities.find(u => u.userId === order.userId);
                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user?.userName}</div>
                            <div className="text-sm text-muted-foreground">{user?.userEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(order.orderDate), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        </TableCell>
                        <TableCell>{order.totalAmount.toFixed(2)} €</TableCell>
                        <TableCell>{order.itemsCount} articles</TableCell>
                        <TableCell>
                          {getOrderStatusBadge(order.status)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientTracking;