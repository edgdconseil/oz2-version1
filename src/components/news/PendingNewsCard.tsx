
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { NewsItem } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, XCircle, Gift, Info, Megaphone, Clock, ImageIcon } from 'lucide-react';

interface PendingNewsCardProps {
  news: NewsItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onAddImage: (news: NewsItem) => void;
}

const PendingNewsCard = ({ news, onApprove, onReject, onAddImage }: PendingNewsCardProps) => {
  
  const getNewsTypeIcon = (type: string) => {
    switch (type) {
      case 'offer':
        return <Gift className="h-4 w-4" />;
      case 'announcement':
        return <Megaphone className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const getNewsTypeBadge = (type: string) => {
    switch (type) {
      case 'offer':
        return <Badge variant="default">Offre</Badge>;
      case 'announcement':
        return <Badge variant="outline">Annonce</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };
  
  const TypeIcon = getNewsTypeIcon(news.type);
  
  return (
    <Card className="h-full flex flex-col">
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
          {getNewsTypeBadge(news.type)}
          <CardDescription>
            {format(new Date(news.createdAt), 'dd/MM/yyyy', { locale: fr })}
          </CardDescription>
        </div>
        <CardTitle>{news.title}</CardTitle>
        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 w-fit mt-1">
          <Clock className="w-3 h-3 mr-1" />
          En attente
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600">{news.content}</p>
        
        {news.expiresAt && (
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            Expire le {format(new Date(news.expiresAt), 'dd/MM/yyyy', { locale: fr })}
          </div>
        )}
        
        <div className="mt-4">
          <Badge variant="outline" className="text-xs mr-2 bg-gray-100">
            Par {news.authorName}
          </Badge>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          <div className="text-xs">Visible pour:</div>
          {news.visibleToRoles.map(role => (
            <Badge key={role} variant="outline" className="text-xs">
              {role === 'client' ? 'Clients' : 
              role === 'supplier' ? 'Fournisseurs' : 'Admins'}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex flex-wrap justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onAddImage(news)} className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 flex-shrink-0">
          <ImageIcon className="h-4 w-4 mr-1" />
          Image
        </Button>
        <Button variant="outline" size="sm" onClick={() => onApprove(news.id)} className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 flex-shrink-0">
          <CheckCircle className="h-4 w-4 mr-1" />
          Approuver
        </Button>
        <Button variant="outline" size="sm" onClick={() => onReject(news.id)} className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 flex-shrink-0">
          <XCircle className="h-4 w-4 mr-1" />
          Rejeter
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PendingNewsCard;
