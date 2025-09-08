
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '@/context/RecipeContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import RecipeForm from '@/components/recipes/RecipeForm';
import { Recipe } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const RecipeCreate = () => {
  const { addRecipe } = useRecipes();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = (data: Omit<Recipe, 'id'>) => {
    // Add current user info if available
    const recipeData = {
      ...data,
      createdBy: user?.id || '1',
      createdByName: user?.name || 'Utilisateur'
    };
    
    addRecipe(recipeData);
    navigate('/recipes');
    
    toast({
      title: "Recette créée",
      description: "Votre recette a été créée avec succès",
    });
  };
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/recipes')}>
          <ChevronLeft size={18} className="mr-1" />
          Retour aux recettes
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Créer une nouvelle recette</h1>
      
      <RecipeForm onSubmit={handleSubmit} />
    </div>
  );
};

export default RecipeCreate;
