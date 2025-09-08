import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Euro, ShoppingCart, GraduationCap, Newspaper, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Données mockées pour le tableau de bord
const mockOrdersData = [
  { name: 'Lun', amount: 1200 },
  { name: 'Mar', amount: 980 },
  { name: 'Mer', amount: 1580 },
  { name: 'Jeu', amount: 2100 },
  { name: 'Ven', amount: 1750 },
  { name: 'Sam', amount: 1320 },
  { name: 'Dim', amount: 890 },
];

const mockTrainingsData = [
  { id: '1', title: 'Nutrition et santé', status: 'completed', progress: 100 },
  { id: '2', title: 'Gestion des stocks', status: 'in_progress', progress: 65 },
  { id: '3', title: 'Produits bio locaux', status: 'available', progress: 0 },
];

const mockNewsData = [
  { 
    id: '1', 
    title: 'Nouveaux produits bio disponibles', 
    date: '2024-08-05',
    category: 'produits',
    urgent: false 
  },
  { 
    id: '2', 
    title: 'Maintenance programmée du système', 
    date: '2024-08-04',
    category: 'système',
    urgent: true 
  },
  { 
    id: '3', 
    title: 'Promotion spéciale légumes de saison', 
    date: '2024-08-03',
    category: 'promotion',
    urgent: false 
  },
];

interface DashboardSummaryProps {
  userRole?: string;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ userRole }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client' || user?.role === 'guest';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Analyse des commandes */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5" />
              {isAdmin ? 'Analyse globale des commandes' : 'Mon analyse de commandes'}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {isAdmin ? 'Évolution des commandes tous clients confondus' : 'Évolution de vos commandes cette semaine'}
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to={isAdmin ? "/admin/order-analytics" : "/client/order-analytics"}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Voir plus
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockOrdersData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {isAdmin ? '15.2k' : '2.8k'}€
              </div>
              <div className="text-sm text-muted-foreground">Cette semaine</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+12%</div>
              <div className="text-sm text-muted-foreground">vs semaine dernière</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {isAdmin ? '48' : '8'}
              </div>
              <div className="text-sm text-muted-foreground">Commandes</div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Suivi clients pour admin */}
      {isAdmin && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Suivi des clients
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Activité et engagement clients
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/client-tracking">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">24</div>
                  <div className="text-sm text-muted-foreground">Clients actifs</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-muted-foreground">Taux d'activité</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Connexions aujourd'hui</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Commandes en cours</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Nouveaux clients</span>
                  <span className="font-medium text-green-600">+3</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actualités - Section étendue pour tous */}
      <Card className={isClient ? "lg:col-span-2" : "lg:col-span-3"}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              Actualités récentes
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Dernières informations et annonces importantes
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/news">
              Voir toutes
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockNewsData.map((news) => (
              <div key={news.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <Badge 
                    variant={news.urgent ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {news.urgent ? 'Urgent' : news.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(news.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <h4 className="font-medium text-sm leading-tight">{news.title}</h4>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;