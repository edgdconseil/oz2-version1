
import { NewsItem, NewsStatus, NewsType } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Trash2, Edit, AlertCircle, Clock, Info, Gift, Megaphone, ImageIcon } from 'lucide-react';

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

// Helper function to get the badge variant and icon based on news status
const getNewsStatusDisplay = (status: NewsStatus) => {
  switch (status) {
    case 'approved':
      return { 
        label: 'Approuvée', 
        variant: 'default' as const,
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    case 'rejected':
      return { 
        label: 'Rejetée', 
        variant: 'destructive' as const,
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    case 'pending':
    default:
      return { 
        label: 'En attente', 
        variant: 'outline' as const, 
        color: 'bg-amber-100 text-amber-800 border-amber-200'
      };
  }
};

interface NewsCardProps {
  news: NewsItem;
  onEdit: (news: NewsItem) => void;
  onDelete: (id: string) => void;
  onAddImage?: (news: NewsItem) => void;
}

const NewsCard = ({ news, onEdit, onDelete, onAddImage }: NewsCardProps) => {
  const typeDisplay = getNewsTypeDisplay(news.type);
  const statusDisplay = getNewsStatusDisplay(news.status);
  const TypeIcon = typeDisplay.icon;
  
  return (
    <Card key={news.id} className="h-full flex flex-col">
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
            {format(new Date(news.createdAt), 'dd/MM/yyyy', { locale: fr })}
          </CardDescription>
        </div>
        <CardTitle>{news.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Badge de statut */}
        <div className="mb-2">
          <Badge variant="outline" className={statusDisplay.color}>
            {news.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
            {news.status === 'rejected' && <AlertCircle className="w-3 h-3 mr-1" />}
            {statusDisplay.label}
          </Badge>
        </div>
        
        {/* Message de rejet si rejeté */}
        {news.status === 'rejected' && news.rejectionReason && (
          <Alert variant="destructive" className="mb-4 mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Motif du rejet</AlertTitle>
            <AlertDescription>
              {news.rejectionReason}
            </AlertDescription>
          </Alert>
        )}
        
        <p className="text-sm text-gray-600 line-clamp-3">{news.content}</p>
        
        {news.expiresAt && (
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            Expire le {format(new Date(news.expiresAt), 'dd/MM/yyyy', { locale: fr })}
          </div>
        )}
        
        <div className="mt-4 flex flex-wrap gap-1">
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
        {onAddImage && !news.imageUrl && (
          <Button variant="outline" size="sm" onClick={() => onAddImage(news)} className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 flex-shrink-0">
            <ImageIcon className="h-4 w-4 mr-1" />
            Image
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => onEdit(news)} className="flex-shrink-0">
          <Edit className="h-4 w-4 mr-1" />
          Modifier
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(news.id)} className="flex-shrink-0">
          <Trash2 className="h-4 w-4 mr-1" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
