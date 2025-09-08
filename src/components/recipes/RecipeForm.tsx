import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Recipe, RecipeIngredient } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProducts } from '@/context/ProductContext';
import { useToast } from '@/components/ui/use-toast';
import { X, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RecipeFormProps {
  initialData?: Recipe;
  onSubmit: (data: Recipe | Omit<Recipe, 'id'>) => void;
}

const recipeSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  servings: z.coerce.number().min(1, 'Le nombre de personnes doit être au moins 1'),
  prepTime: z.coerce.number().min(0, 'Le temps de préparation ne peut pas être négatif'),
  cookTime: z.coerce.number().min(0, 'Le temps de cuisson ne peut pas être négatif'),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()),
});

const RecipeForm: React.FC<RecipeFormProps> = ({ initialData, onSubmit }) => {
  const { products } = useProducts();
  const { toast } = useToast();
  const [instructions, setInstructions] = useState<string[]>(initialData?.instructions || ['']);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(initialData?.ingredients || []);
  const [newTag, setNewTag] = useState('');
  
  const foodProducts = products.filter(p => p.category === 'food' && p.available);
  
  const form = useForm<z.infer<typeof recipeSchema>>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      servings: initialData?.servings || 4,
      prepTime: initialData?.prepTime || 0,
      cookTime: initialData?.cookTime || 0,
      imageUrl: initialData?.imageUrl || '',
      tags: initialData?.tags || [],
    },
  });

  const handleSubmit = (values: z.infer<typeof recipeSchema>) => {
    if (ingredients.length === 0) {
      toast({
        title: "Erreur",
        description: "Vous devez ajouter au moins un ingrédient",
        variant: "destructive",
      });
      return;
    }

    if (instructions.length === 0 || instructions.some(i => !i.trim())) {
      toast({
        title: "Erreur",
        description: "Toutes les étapes doivent être remplies",
        variant: "destructive",
      });
      return;
    }

    const recipeData = {
      name: values.name,
      description: values.description,
      servings: values.servings,
      prepTime: values.prepTime,
      cookTime: values.cookTime,
      imageUrl: values.imageUrl,
      tags: values.tags,
      ingredients,
      instructions: instructions.filter(i => i.trim()),
      createdBy: initialData?.createdBy || '1', // Default to current user ID
      createdByName: initialData?.createdByName || 'EHPAD Les Tilleuls', // Default to current user name
    };

    if (initialData?.id) {
      onSubmit({ ...recipeData, id: initialData.id });
    } else {
      onSubmit(recipeData);
    }
  };

  function addIngredient() {
    setIngredients([...ingredients, { productId: '', productName: '', quantity: 0, unit: 'g' }]);
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function updateIngredient(index: number, field: keyof RecipeIngredient, value: any) {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    
    // If productId is updated, also update productName
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        updatedIngredients[index].productName = product.name;
      }
    }
    
    setIngredients(updatedIngredients);
  }

  function addInstruction() {
    setInstructions([...instructions, '']);
  }

  function removeInstruction(index: number) {
    setInstructions(instructions.filter((_, i) => i !== index));
  }

  function updateInstruction(index: number, value: string) {
    const updatedInstructions = [...instructions];
    updatedInstructions[index] = value;
    setInstructions(updatedInstructions);
  }

  function addTag() {
    if (newTag.trim() && !form.getValues().tags.includes(newTag.trim())) {
      form.setValue('tags', [...form.getValues().tags, newTag.trim()]);
      setNewTag('');
    }
  }

  function removeTag(tag: string) {
    form.setValue('tags', form.getValues().tags.filter(t => t !== tag));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la recette</FormLabel>
                  <FormControl>
                    <Input placeholder="Salade de carottes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Une salade fraîche et légère..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="servings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personnes</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prepTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Préparation (min)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cookTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisson (min)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de l'image</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.getValues().tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-secondary text-secondary-foreground"
                  >
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)} 
                      className="ml-1 rounded-full hover:bg-secondary-foreground/10"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input 
                  value={newTag} 
                  onChange={(e) => setNewTag(e.target.value)} 
                  placeholder="végétarien"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" size="icon" onClick={addTag}>
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Ingrédients</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                  <Plus size={16} className="mr-1" /> Ajouter
                </Button>
              </div>
              
              {ingredients.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun ingrédient ajouté</p>
              ) : (
                <div className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <Card key={index} className="relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => removeIngredient(index)}
                      >
                        <X size={16} />
                      </Button>
                      <CardContent className="pt-4 pb-2">
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-6">
                            <FormLabel className="text-xs">Produit</FormLabel>
                            <Select
                              value={ingredient.productId}
                              onValueChange={(value) => updateIngredient(index, 'productId', value)}
                            >
                              <SelectTrigger>
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
                          </div>
                          <div className="col-span-3">
                            <FormLabel className="text-xs">Quantité</FormLabel>
                            <Input
                              type="number"
                              value={ingredient.quantity}
                              onChange={(e) => updateIngredient(index, 'quantity', Number(e.target.value))}
                              min={0}
                            />
                          </div>
                          <div className="col-span-3">
                            <FormLabel className="text-xs">Unité</FormLabel>
                            <Select
                              value={ingredient.unit}
                              onValueChange={(value) => updateIngredient(index, 'unit', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Unité" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="g">g</SelectItem>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="ml">ml</SelectItem>
                                <SelectItem value="l">l</SelectItem>
                                <SelectItem value="pièce">pièce</SelectItem>
                                <SelectItem value="c. à soupe">c. à soupe</SelectItem>
                                <SelectItem value="c. à café">c. à café</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Instructions</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
                  <Plus size={16} className="mr-1" /> Ajouter
                </Button>
              </div>
              
              {instructions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune instruction ajoutée</p>
              ) : (
                <div className="space-y-3">
                  {instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-sm">
                            {index + 1}
                          </span>
                          <Textarea
                            value={instruction}
                            onChange={(e) => updateInstruction(index, e.target.value)}
                            placeholder={`Étape ${index + 1}`}
                            className="flex-grow"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 self-start"
                        onClick={() => removeInstruction(index)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit">{initialData ? 'Mettre à jour' : 'Créer la recette'}</Button>
        </div>
      </form>
    </Form>
  );
};

export default RecipeForm;
