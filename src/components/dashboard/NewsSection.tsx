
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { NewsItem, User } from '@/types';
import NewsCard from './NewsCard';

interface NewsSectionProps {
  user: User;
  newsItemsForRole: NewsItem[];
  supplierNews: NewsItem[];
}

const NewsSection = ({ user, newsItemsForRole, supplierNews }: NewsSectionProps) => {
  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>
          {user?.role === 'supplier' ? 'Mes actualités récentes' : 'Actualités récentes'}
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/news">
            <Bell className="mr-2 h-4 w-4" />
            Voir tout
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {user?.role === 'supplier' ? (
          supplierNews.length > 0 ? (
            <div className="space-y-4">
              {supplierNews.slice(0, 3).map(news => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center border border-dashed rounded-md">
              <p className="text-sm text-muted-foreground">Vous n'avez pas encore créé d'actualité.</p>
            </div>
          )
        ) : (
          newsItemsForRole.length > 0 ? (
            <div className="space-y-4">
              {newsItemsForRole.map(news => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center border border-dashed rounded-md">
              <p className="text-sm text-muted-foreground">Aucune actualité disponible</p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default NewsSection;
