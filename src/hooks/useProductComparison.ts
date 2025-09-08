
import { useState, useCallback } from 'react';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useProductComparison = () => {
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const { toast } = useToast();

  const addToComparison = useCallback((product: Product) => {
    setComparisonProducts(prev => {
      // Vérifier si le produit est déjà dans la comparaison
      if (prev.find(p => p.id === product.id)) {
        toast({
          title: "Produit déjà ajouté",
          description: "Ce produit est déjà dans votre comparatif",
          variant: "destructive",
        });
        return prev;
      }

      // Limiter à 4 produits maximum
      if (prev.length >= 4) {
        toast({
          title: "Limite atteinte",
          description: "Vous ne pouvez comparer que 4 produits maximum",
          variant: "destructive",
        });
        return prev;
      }

      toast({
        title: "Produit ajouté",
        description: `${product.name} ajouté au comparatif`,
      });

      return [...prev, product];
    });
  }, [toast]);

  const removeFromComparison = useCallback((productId: string) => {
    setComparisonProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonProducts([]);
    setIsComparisonOpen(false);
  }, []);

  const openComparison = useCallback(() => {
    if (comparisonProducts.length < 2) {
      toast({
        title: "Comparaison impossible",
        description: "Sélectionnez au moins 2 produits pour les comparer",
        variant: "destructive",
      });
      return;
    }
    setIsComparisonOpen(true);
  }, [comparisonProducts.length, toast]);

  const closeComparison = useCallback(() => {
    setIsComparisonOpen(false);
  }, []);

  const isInComparison = useCallback((productId: string) => {
    return comparisonProducts.some(p => p.id === productId);
  }, [comparisonProducts]);

  return {
    comparisonProducts,
    isComparisonOpen,
    addToComparison,
    removeFromComparison,
    clearComparison,
    openComparison,
    closeComparison,
    isInComparison,
  };
};
