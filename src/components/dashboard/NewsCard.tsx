
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Gift, Info, Megaphone, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewsItem, NewsType } from '@/types';

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
    <Card className="transition-all duration-200 hover:shadow-md">
      <div className={`flex ${news.imageUrl ? 'gap-4' : ''}`}>
        {news.imageUrl && (
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg ml-4 mt-4">
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
        <div className="flex-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Badge variant={typeDisplay.variant} className="mb-2">
                <TypeIcon className="w-3 h-3 mr-1" />
                {typeDisplay.label}
              </Badge>
              <CardDescription>
                {format(new Date(news.createdAt), 'dd/MM/yyyy', { locale: fr })}
              </CardDescription>
            </div>
            <CardTitle className="text-base">{news.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 line-clamp-2">{news.content}</p>
            
            {news.expiresAt && (
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                Expire le {format(new Date(news.expiresAt), 'dd/MM/yyyy', { locale: fr })}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-0 flex justify-between">
            <span className="text-xs text-gray-500">Par {news.authorName}</span>
            {news.status === 'pending' && (
              <Badge variant="secondary" className="text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                En attente
              </Badge>
            )}
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;
