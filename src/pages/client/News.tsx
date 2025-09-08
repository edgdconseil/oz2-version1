
import { useState } from 'react';
import { NewsItem, NewsType } from '@/types';
import { useNews } from '@/context/news';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Gift, Info, Megaphone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Helper function to get the badge variant and icon based on news type
const getNewsTypeDisplay = (type: NewsType) => {
  switch (type) {
    case 'offer':
      return { 
        label: 'Offre spéciale', 
        variant: 'default' as const,
        icon: Gift 
      };
    case 'announcement':
      return { 
        label: 'Annonce', 
        variant: 'outline' as const,
        icon: Megaphone 
      };
    case 'info':
    default:
      return { 
        label: 'Information', 
        variant: 'secondary' as const, 
        icon: Info 
      };
  }
};

const NewsCard = ({ news }: { news: NewsItem }) => {
  const typeDisplay = getNewsTypeDisplay(news.type);
  const TypeIcon = typeDisplay.icon;
  
  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md">
      {news.imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={news.imageUrl} 
            alt={news.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/400x200?text=Image+indisponible";
            }}
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant={typeDisplay.variant} className="mb-2">
            <TypeIcon className="w-3 h-3 mr-1" />
            {typeDisplay.label}
          </Badge>
          <CardDescription>
            {format(new Date(news.createdAt), 'dd MMMM yyyy', { locale: fr })}
          </CardDescription>
        </div>
        <CardTitle>{news.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600">{news.content}</p>
        
        {news.expiresAt && (
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            Expire le {format(new Date(news.expiresAt), 'dd MMMM yyyy', { locale: fr })}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 text-xs text-gray-500">
        Par {news.authorName}
      </CardFooter>
    </Card>
  );
};

const News = () => {
  const { getNewsByRole } = useNews();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('all');
  
  if (!user) return null;
  
  // Pour les clients, getNewsByRole ne renverra que les actualités approuvées
  const newsItems = getNewsByRole(user.role);
  
  const filterNewsByType = (type?: NewsType) => {
    if (!type) return newsItems;
    return newsItems.filter(item => item.type === type);
  };
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-ozego-blue">Actualités</h1>
        <Link to="/catalog">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Voir le catalogue
          </Button>
        </Link>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="offers">Offres</TabsTrigger>
          <TabsTrigger value="announcements">Annonces</TabsTrigger>
          <TabsTrigger value="info">Informations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {newsItems.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucune actualité disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map(news => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="offers" className="mt-0">
          {filterNewsByType('offer').length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucune offre disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterNewsByType('offer').map(news => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="announcements" className="mt-0">
          {filterNewsByType('announcement').length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucune annonce disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterNewsByType('announcement').map(news => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="info" className="mt-0">
          {filterNewsByType('info').length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucune information disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterNewsByType('info').map(news => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default News;
