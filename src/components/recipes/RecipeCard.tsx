
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat } from 'lucide-react';
import { Recipe } from '@/types';
import { useNavigate } from 'react-router-dom';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const navigate = useNavigate();
  
  const totalTime = recipe.prepTime + recipe.cookTime;
  
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden relative">
        <img 
          src={recipe.imageUrl || '/placeholder.svg'} 
          alt={recipe.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full bg-primary/90 text-primary-foreground">
            <ChefHat size={12} /> {recipe.ingredients.length} ingrédients
          </span>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-1">{recipe.name}</CardTitle>
        <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{recipe.servings} pers.</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{totalTime} min</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
              +{recipe.tags.length - 3}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => navigate(`/recipes/${recipe.id}`)}
        >
          Voir la recette
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
