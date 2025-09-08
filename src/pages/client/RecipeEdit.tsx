
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '@/context/RecipeContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import RecipeForm from '@/components/recipes/RecipeForm';
import { Recipe } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const RecipeEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { getRecipeById, updateRecipe } = useRecipes();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  if (!id) {
    navigate('/recipes');
    return null;
  }
  
  const recipe = getRecipeById(id);
  
  if (!recipe) {
    navigate('/recipes');
    return null;
  }
  
  // Check if user can edit this recipe
  const canEdit = user?.id === recipe.createdBy || user?.role === 'admin';
  
  if (!canEdit) {
    navigate(`/recipes/${id}`);
    return null;
  }
  
  const handleSubmit = (data: Recipe) => {
    updateRecipe(recipe.id, data);
    navigate(`/recipes/${recipe.id}`);
    
    toast({
      title: "Recette mise à jour",
      description: "Votre recette a été mise à jour avec succès",
    });
  };
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(`/recipes/${recipe.id}`)}>
          <ChevronLeft size={18} className="mr-1" />
          Retour à la recette
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Modifier la recette</h1>
      
      <RecipeForm initialData={recipe} onSubmit={handleSubmit} />
    </div>
  );
};

export default RecipeEdit;
