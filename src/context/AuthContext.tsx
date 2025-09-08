
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { users } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, we would make an API call here
    // For demo purposes, we'll use our mock data
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && foundUser.isActive) {
      // In real app, we would validate password here
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${foundUser.name}`,
      });
      setIsLoading(false);
      return true;
    } else if (foundUser && !foundUser.isActive) {
      toast({
        title: "Compte désactivé",
        description: "Votre compte a été désactivé. Veuillez contacter l'administrateur.",
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    } else {
      toast({
        title: "Échec de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
