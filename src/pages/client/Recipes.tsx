
import React, { useState } from 'react';
import { useRecipes } from '@/context/RecipeContext';
import RecipeCard from '@/components/recipes/RecipeCard';
import { Button } from '@/components/ui/button';
import { Plus, Search, ChefHat, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const Recipes = () => {
  const { recipes } = useRecipes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Extract all unique tags from recipes
  const allTags = [...new Set(recipes.flatMap(recipe => recipe.tags))].sort();
  
  const filteredRecipes = recipes.filter(recipe => {
    // First filter by search term
    const matchesSearch = 
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Then filter by selected tags (if any)
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => recipe.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ChefHat size={24} className="text-primary" />
          <h1 className="text-2xl font-bold">Recettes</h1>
        </div>
        <Button onClick={() => navigate('/recipes/new')}>
          <Plus size={18} className="mr-2" />
          Nouvelle recette
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recherche et filtres</CardTitle>
          <CardDescription>Trouvez la recette parfaite pour votre prochain repas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une recette..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Filter size={16} className="mr-2" />
                    Filtrer par tag
                    {selectedTags.length > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                        {selectedTags.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  {allTags.map(tag => (
                    <DropdownMenuCheckboxItem
                      key={tag}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    >
                      {tag}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <ChefHat size={48} className="mx-auto text-muted-foreground" />
          <p className="text-muted-foreground mt-4">Aucune recette trouvée.</p>
          <Button variant="outline" className="mt-4" onClick={() => {
            setSearchTerm('');
            setSelectedTags([]);
          }}>
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
