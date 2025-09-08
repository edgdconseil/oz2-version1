
import { createContext, useContext, useState, ReactNode } from 'react';
import { TrainingCourse, TrainingType, TrainingLevel, CallbackRequest } from '@/types';
import { trainings } from '@/data/trainingMockData';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

interface TrainingContextType {
  trainings: TrainingCourse[];
  getTrainingById: (id: string) => TrainingCourse | undefined;
  getTrainingsByType: (type: TrainingType) => TrainingCourse[];
  getTrainingsByLevel: (level: TrainingLevel) => TrainingCourse[];
  addTraining: (training: Omit<TrainingCourse, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  updateTraining: (id: string, updates: Partial<TrainingCourse>) => void;
  deleteTraining: (id: string) => void;
  callbackRequests: CallbackRequest[];
  requestCallback: (request: Omit<CallbackRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateCallbackStatus: (id: string, status: 'pending' | 'contacted' | 'completed') => void;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error('useTraining must be used within a TrainingProvider');
  }
  return context;
};

interface TrainingProviderProps {
  children: ReactNode;
}

export const TrainingProvider = ({ children }: TrainingProviderProps) => {
  const [trainingCourses, setTrainingCourses] = useState<TrainingCourse[]>(trainings);
  const [callbackRequests, setCallbackRequests] = useState<CallbackRequest[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const getTrainingById = (id: string) => {
    return trainingCourses.find(training => training.id === id);
  };

  const getTrainingsByType = (type: TrainingType) => {
    return trainingCourses.filter(training => training.type === type);
  };

  const getTrainingsByLevel = (level: TrainingLevel) => {
    return trainingCourses.filter(training => training.level === level);
  };

  const addTraining = (training: Omit<TrainingCourse, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (!user || user.role !== 'admin') {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent créer des formations.",
        variant: "destructive"
      });
      return;
    }

    const newTraining: TrainingCourse = {
      ...training,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.id
    };

    setTrainingCourses(prevTrainings => [newTraining, ...prevTrainings]);
    
    toast({
      title: "Formation créée",
      description: "La formation a été créée avec succès."
    });
  };

  const updateTraining = (id: string, updates: Partial<TrainingCourse>) => {
    if (!user || user.role !== 'admin') {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent modifier des formations.",
        variant: "destructive"
      });
      return;
    }

    setTrainingCourses(prevTrainings =>
      prevTrainings.map(training => {
        if (training.id === id) {
          return {
            ...training,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return training;
      })
    );
    
    toast({
      title: "Formation mise à jour",
      description: "Les modifications ont été enregistrées."
    });
  };

  const deleteTraining = (id: string) => {
    if (!user || user.role !== 'admin') {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent supprimer des formations.",
        variant: "destructive"
      });
      return;
    }

    setTrainingCourses(prevTrainings => prevTrainings.filter(training => training.id !== id));
    
    toast({
      title: "Formation supprimée",
      description: "La formation a été supprimée avec succès."
    });
  };

  // Callback request functionality
  const requestCallback = (request: Omit<CallbackRequest, 'id' | 'createdAt' | 'status'>) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour demander à être rappelé.",
        variant: "destructive"
      });
      return;
    }

    const newRequest: CallbackRequest = {
      ...request,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    setCallbackRequests(prev => [newRequest, ...prev]);
    
    toast({
      title: "Demande envoyée",
      description: "Votre demande de rappel a été enregistrée. Un conseiller vous contactera prochainement."
    });
  };

  const updateCallbackStatus = (id: string, status: 'pending' | 'contacted' | 'completed') => {
    if (!user || user.role !== 'admin') {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent mettre à jour le statut des demandes de rappel.",
        variant: "destructive"
      });
      return;
    }

    setCallbackRequests(prev => 
      prev.map(request => {
        if (request.id === id) {
          return { ...request, status };
        }
        return request;
      })
    );
    
    toast({
      title: "Statut mis à jour",
      description: `La demande a été marquée comme "${status}".`
    });
  };

  return (
    <TrainingContext.Provider
      value={{
        trainings: trainingCourses,
        getTrainingById,
        getTrainingsByType,
        getTrainingsByLevel,
        addTraining,
        updateTraining,
        deleteTraining,
        callbackRequests,
        requestCallback,
        updateCallbackStatus
      }}
    >
      {children}
    </TrainingContext.Provider>
  );
};
