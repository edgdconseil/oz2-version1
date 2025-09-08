
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-ozego-background">
      {/* Content */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg border border-border p-8">
          <div className="text-center mb-6">
            <img 
              src="/lovable-uploads/39be0dd5-afc9-47b6-865b-11cddf22500c.png" 
              alt="Ozego Logo" 
              className="h-24 mx-auto mb-4"
            />
            <p className="text-ozego-text mt-2">Connexion à votre espace</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-ozego-text">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="border-border focus:border-ozego-primary focus:ring-ozego-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-ozego-text">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="border-border focus:border-ozego-primary focus:ring-ozego-primary"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-ozego-primary hover:bg-ozego-primary/90 text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-border">
            <div className="text-sm text-center text-ozego-text">
              <p className="mb-2 font-medium">Pour la démonstration, utilisez :</p>
              <div className="space-y-1 text-xs">
                <p><strong className="text-ozego-primary">Client:</strong> ehpad@example.com</p>
                <p><strong className="text-ozego-primary">Fournisseur:</strong> fournisseur@example.com</p>
                <p><strong className="text-ozego-primary">Invité:</strong> invite@example.com</p>
                <p><strong className="text-ozego-primary">Admin:</strong> admin@ozego.fr</p>
              </div>
              <p className="mt-2 text-ozego-secondary">(Le mot de passe peut être n'importe quoi)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
