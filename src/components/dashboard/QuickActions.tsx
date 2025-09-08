
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { User } from '@/types';

interface QuickActionsProps {
  user: User;
}

const QuickActions = ({ user }: QuickActionsProps) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
        <CardDescription>
          Accédez rapidement aux fonctionnalités principales.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {user?.role === 'client' && (
          <>
            <Button variant="outline" className="justify-between" asChild>
              <Link to="/catalog">
                Voir le catalogue <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="justify-between" asChild>
              <Link to="/cart">
                Mon panier <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="justify-between" asChild>
              <Link to="/orders">
                Mes commandes <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="justify-between" asChild>
              <Link to="/news">
                Actualités <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </>
        )}
        
        {user?.role === 'supplier' && (
          <>
            <Button variant="outline" className="justify-between" asChild>
              <Link to="/products">
                Gérer mes produits <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="justify-between" asChild>
              <Link to="/orders">
                Voir les commandes <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="justify-between" asChild>
              <Link to="/news">
                Gérer les actualités <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </>
        )}
        
        {user?.role === 'admin' && (
          <>
            <Button variant="outline" className="justify-between" asChild>
              <Link to="/admin/users">
                Gérer les utilisateurs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="justify-between" asChild>
              <Link to="/admin/products">
                Gérer les produits <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="justify-between" asChild>
              <Link to="/admin/orders">
                Gérer les commandes <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="justify-between" asChild>
              <Link to="/news">
                Gérer les actualités <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full text-xs text-muted-foreground">
          Voir tous les raccourcis
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuickActions;
