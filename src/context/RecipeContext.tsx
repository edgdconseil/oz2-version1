
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Recipe, RecipeIngredient } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { recipes as mockRecipes } from '@/data/recipeMockData';
import { useProducts } from './ProductContext';

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  getRecipeById: (id: string) => Recipe | undefined;
  calculateProductsNeeded: (recipeId: string, servings: number) => RecipeIngredient[];
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const { toast } = useToast();
  const { products } = useProducts();

  // Load recipes from localStorage on component mount
  useEffect(() => {
    const savedRecipes = localStorage.getItem('recipes');
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    } else {
      // Initialize with mock data
      setRecipes(mockRecipes);
      localStorage.setItem('recipes', JSON.stringify(mockRecipes));
    }
  }, []);

  // Save recipes to localStorage when they change
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: `recipe-${Date.now()}` // Generate a unique ID
    };
    
    setRecipes(prevRecipes => [...prevRecipes, newRecipe]);
    
    toast({
      title: "Recette ajoutée",
      description: `${newRecipe.name} a été ajoutée avec succès`,
    });
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => 
        recipe.id === id 
          ? { ...recipe, ...updates } 
          : recipe
      )
    );
    
    toast({
      title: "Recette mise à jour",
      description: `La recette a été modifiée avec succès`,
    });
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prevRecipes => 
      prevRecipes.filter(recipe => recipe.id !== id)
    );
    
    toast({
      title: "Recette supprimée",
      description: `La recette a été supprimée`,
    });
  };

  const getRecipeById = (id: string) => {
    return recipes.find(recipe => recipe.id === id);
  };

  const calculateProductsNeeded = (recipeId: string, servings: number) => {
    const recipe = getRecipeById(recipeId);
    if (!recipe) return [];
    
    const servingRatio = servings / recipe.servings;
    
    return recipe.ingredients.map(ingredient => ({
      ...ingredient,
      quantity: ingredient.quantity * servingRatio
    }));
  };

  return (
    <RecipeContext.Provider value={{
      recipes,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      getRecipeById,
      calculateProductsNeeded
    }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};
