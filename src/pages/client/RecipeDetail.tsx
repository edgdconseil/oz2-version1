
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '@/context/RecipeContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RecipeIngredientsList } from '@/components/recipes/RecipeIngredientsList';
import { 
  Clock, 
  Users, 
  ChevronLeft, 
  Pencil, 
  Trash2, 
  ChefHat,
  Utensils
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getRecipeById, deleteRecipe } = useRecipes();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [servings, setServings] = useState<number>(4);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  if (!id) {
    navigate('/recipes');
    return null;
  }
  
  const recipe = getRecipeById(id);
  
  if (!recipe) {
    navigate('/recipes');
    return null;
  }
  
  const handleDelete = () => {
    deleteRecipe(recipe.id);
    navigate('/recipes');
    toast({
      title: "Recette supprimée",
      description: "La recette a été supprimée avec succès",
    });
  };
  
  const canEdit = user?.id === recipe.createdBy || user?.role === 'admin';
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/recipes')}>
              <ChevronLeft size={18} className="mr-1" />
              Retour aux recettes
            </Button>
          </div>
          
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold">{recipe.name}</h1>
            
            {canEdit && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                >
                  <Pencil size={18} />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            )}
          </div>
          
          <p className="text-muted-foreground mb-6">{recipe.description}</p>
          
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>
                <Input
                  type="number"
                  min={1}
                  value={servings}
                  onChange={(e) => setServings(parseInt(e.target.value) || recipe.servings)}
                  className="w-16 h-8 inline-block"
                />
                <span className="ml-2">personnes</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{recipe.prepTime + recipe.cookTime} min</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.tags.map((tag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {recipe.imageUrl && (
            <div className="mb-8">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.name} 
                className="w-full h-auto rounded-lg object-cover max-h-[400px]"
              />
            </div>
          )}
          
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="text-primary" size={24} />
              <h2 className="text-xl font-semibold">Instructions</h2>
            </div>
            <div className="space-y-4">
              {recipe.instructions.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p>{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-card rounded-lg shadow-sm p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="text-primary" size={20} />
              <h3 className="text-lg font-semibold">Ingrédients</h3>
            </div>
            <RecipeIngredientsList 
              ingredients={recipe.ingredients} 
              servings={servings}
              recipeServings={recipe.servings}
            />
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette recette ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La recette sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RecipeDetail;
