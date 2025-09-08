
import { useState } from 'react';
import { useProducts } from '@/context/ProductContext';
import { RecipeIngredient, Product } from '@/types';
import { Check, Minus, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RecipeIngredientsListProps {
  ingredients: RecipeIngredient[];
  onIngredientsChange?: (ingredients: RecipeIngredient[]) => void;
  readonly?: boolean;
  servings?: number;
  recipeServings?: number;
}

export const RecipeIngredientsList = ({
  ingredients,
  onIngredientsChange,
  readonly = false,
  servings,
  recipeServings
}: RecipeIngredientsListProps) => {
  const { products } = useProducts();
  const [newIngredient, setNewIngredient] = useState<RecipeIngredient>({
    productId: '',
    productName: '',
    quantity: 1,
    unit: 'kg'
  });

  // Filter only food products
  const foodProducts = products.filter(p => p.category === 'food');

  const handleAddIngredient = () => {
    if (!newIngredient.productId || !onIngredientsChange) return;
    
    const product = foodProducts.find(p => p.id === newIngredient.productId);
    
    if (product) {
      const updatedIngredient = {
        ...newIngredient,
        productName: product.name
      };
      
      onIngredientsChange([...ingredients, updatedIngredient]);
      
      // Reset form
      setNewIngredient({
        productId: '',
        productName: '',
        quantity: 1,
        unit: 'kg'
      });
    }
  };

  const handleRemoveIngredient = (index: number) => {
    if (!onIngredientsChange) return;
    
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    onIngredientsChange(updatedIngredients);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (!onIngredientsChange) return;
    
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      quantity
    };
    onIngredientsChange(updatedIngredients);
  };

  // Calculate adjusted quantities if servings and recipeServings are provided
  const getAdjustedQuantity = (quantity: number) => {
    if (servings && recipeServings && recipeServings > 0) {
      return (quantity * servings) / recipeServings;
    }
    return quantity;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Ingrédients</h3>
      
      {ingredients.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun ingrédient ajouté</p>
      ) : (
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center gap-3 p-2 rounded bg-gray-50">
              <span className="font-medium flex-grow">{ingredient.productName}</span>
              
              {readonly ? (
                <span>
                  {servings && recipeServings 
                    ? getAdjustedQuantity(ingredient.quantity).toFixed(1) 
                    : ingredient.quantity} {ingredient.unit}
                </span>
              ) : (
                <>
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-r-none"
                      onClick={() => handleUpdateQuantity(index, Math.max(0.1, ingredient.quantity - 0.5))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      value={ingredient.quantity}
                      min="0.1"
                      step="0.1"
                      className="h-8 w-16 rounded-none text-center"
                      onChange={(e) => handleUpdateQuantity(index, parseFloat(e.target.value) || 0.1)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-l-none"
                      onClick={() => handleUpdateQuantity(index, ingredient.quantity + 0.5)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="w-8">{ingredient.unit}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                    onClick={() => handleRemoveIngredient(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      
      {!readonly && onIngredientsChange && (
        <div className="flex gap-2 mt-4">
          <Select
            value={newIngredient.productId}
            onValueChange={(value) => setNewIngredient({...newIngredient, productId: value})}
          >
            <SelectTrigger className="flex-grow">
              <SelectValue placeholder="Sélectionner un produit" />
            </SelectTrigger>
            <SelectContent>
              {foodProducts.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex">
            <Input
              type="number"
              placeholder="Qté"
              min="0.1"
              step="0.1"
              className="w-20 rounded-r-none"
              value={newIngredient.quantity}
              onChange={(e) => setNewIngredient({
                ...newIngredient,
                quantity: parseFloat(e.target.value) || 0.1
              })}
            />
            <Select
              value={newIngredient.unit}
              onValueChange={(value) => setNewIngredient({...newIngredient, unit: value})}
            >
              <SelectTrigger className="w-16 rounded-l-none border-l-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="l">L</SelectItem>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="pcs">pcs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="button" onClick={handleAddIngredient}>
            <Check className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>
      )}
    </div>
  );
};
