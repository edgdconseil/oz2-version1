
import { useState } from 'react';
import { useTraining } from '@/context/TrainingContext';
import { TrainingType, TrainingLevel, TrainingCourse } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  FileCheck, 
  TrendingUp, 
  ClipboardCheck,
  Atom
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Helper function to get the badge variant and icon based on training type
const getTrainingTypeDisplay = (type: TrainingType) => {
  switch (type) {
    case 'audit':
      return { 
        label: 'Audit', 
        variant: 'default' as const,
        icon: FileCheck 
      };
    case 'consulting':
      return { 
        label: 'Conseil', 
        variant: 'secondary' as const,
        icon: TrendingUp 
      };
    case 'certification':
      return { 
        label: 'Certification', 
        variant: 'outline' as const, 
        icon: Award 
      };
    case 'management':
      return { 
        label: 'Management', 
        variant: 'default' as const, 
        icon: ClipboardCheck 
      };
    default:
      return { 
        label: 'Formation', 
        variant: 'outline' as const, 
        icon: Atom 
      };
  }
};

// Helper function to get the badge variant for training level
const getLevelBadgeVariant = (level: TrainingLevel) => {
  switch (level) {
    case 'beginner':
      return 'secondary';
    case 'intermediate':
      return 'outline';
    case 'advanced':
      return 'destructive';
    default:
      return 'outline';
  }
};

// Helper function to translate level to French
const getLevelLabel = (level: TrainingLevel) => {
  switch (level) {
    case 'beginner':
      return 'Débutant';
    case 'intermediate':
      return 'Intermédiaire';
    case 'advanced':
      return 'Avancé';
    default:
      return level;
  }
};

// Helper function to format price based on pricing type
const formatPrice = (training: TrainingCourse) => {
  switch (training.pricingType) {
    case 'fixed':
      return `${training.price} €`;
    case 'from':
      return `À partir de ${training.price} €`;
    case 'quote':
      return 'Sur devis';
    default:
      return `${training.price} €`;
  }
};

const TrainingCard = ({ training }: { training: TrainingCourse }) => {
  const typeDisplay = getTrainingTypeDisplay(training.type);
  const TypeIcon = typeDisplay.icon;
  const navigate = useNavigate();
  
  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md border-t-4" style={{ borderTopColor: training.type === 'audit' ? '#9b87f5' : training.type === 'consulting' ? '#33C3F0' : training.type === 'certification' ? '#E5DEFF' : '#7E69AB' }}>
      {training.imageUrl && (
        <div className="aspect-video w-[70%] overflow-hidden mx-auto">
          <img 
            src={training.imageUrl} 
            alt={training.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant={typeDisplay.variant} className="mb-2">
            <TypeIcon className="w-3 h-3 mr-1" />
            {typeDisplay.label}
          </Badge>
          <Badge variant={getLevelBadgeVariant(training.level)}>
            {getLevelLabel(training.level)}
          </Badge>
        </div>
        <CardTitle className="line-clamp-2">{training.title}</CardTitle>
        <CardDescription className="flex items-center mt-1">
          <MapPin className="h-3 w-3 mr-1" />
          {training.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 line-clamp-5 mb-4">{training.description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{training.duration}h de formation</span>
          </div>
          
          {training.dateStart && (
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                {format(new Date(training.dateStart), 'dd MMMM yyyy', { locale: fr })}
                {training.dateEnd && training.dateStart.split('T')[0] !== training.dateEnd.split('T')[0] && (
                  ` au ${format(new Date(training.dateEnd), 'dd MMMM yyyy', { locale: fr })}`
                )}
              </span>
            </div>
          )}
          
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Max. {training.maxParticipants} participants</span>
          </div>
        </div>
        
        {training.highlights && training.highlights.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Points clés :</h4>
            <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
              {training.highlights.slice(0, 2).map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 flex flex-col items-start gap-3 border-t mt-auto">
        <div className="flex justify-between w-full items-center">
          <div className="text-xl font-bold text-ozego-blue">{formatPrice(training)}</div>
          <Button 
            size="sm" 
            onClick={() => training.technicalSheetUrl ? window.open(training.technicalSheetUrl, '_blank') : null}
            disabled={!training.technicalSheetUrl}
          >
            Voir les détails
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const Trainings = () => {
  const { trainings } = useTraining();
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const filterTrainingsByType = (type?: TrainingType) => {
    if (!type) return trainings;
    return trainings.filter(item => item.type === type);
  };
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Catalogue expert</h1>
        <Link to="/catalog">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Voir le catalogue
          </Button>
        </Link>
      </div>
      
      <div className="bg-gradient-to-r from-primary to-primary/80 p-6 md:p-8 rounded-lg mb-8 text-white">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Améliorez vos compétences</h2>
        <p className="mb-4 opacity-90">Découvrez nos formations spécialisées en audit, conseil et certification pour optimiser vos processus et garantir la qualité.</p>
        <div className="flex flex-wrap gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded px-3 py-1 text-sm flex items-center">
            <FileCheck className="h-4 w-4 mr-1" />
            Experts qualifiés
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded px-3 py-1 text-sm flex items-center">
            <Award className="h-4 w-4 mr-1" />
            Certifications reconnues
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded px-3 py-1 text-sm flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Groupes restreints
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="consulting">Conseil</TabsTrigger>
          <TabsTrigger value="certification">Certification</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {trainings.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucune formation disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainings.map(training => (
                <TrainingCard key={training.id} training={training} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="audit" className="mt-0">
          {filterTrainingsByType('audit').length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucune formation d'audit disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterTrainingsByType('audit').map(training => (
                <TrainingCard key={training.id} training={training} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="consulting" className="mt-0">
          {filterTrainingsByType('consulting').length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucune formation de conseil disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterTrainingsByType('consulting').map(training => (
                <TrainingCard key={training.id} training={training} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="certification" className="mt-0">
          {filterTrainingsByType('certification').length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucune formation de certification disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterTrainingsByType('certification').map(training => (
                <TrainingCard key={training.id} training={training} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="management" className="mt-0">
          {filterTrainingsByType('management').length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucune formation de management disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterTrainingsByType('management').map(training => (
                <TrainingCard key={training.id} training={training} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trainings;
