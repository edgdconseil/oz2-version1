import { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useProductComparison } from '@/hooks/useProductComparison';
import { Product, ProductCategory } from '@/types';
import { 
  Filter, Search, ShoppingCart, 
  Plus, Minus, Grid, List, 
  Leaf, CheckCircle, AlertCircle,
  Package, FileText, Tag, Percent, Heart, Building2, Award, Apple
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ProductComparisonButton from '@/components/catalog/ProductComparisonButton';
import ComparisonBar from '@/components/catalog/ComparisonBar';
import ProductComparisonModal from '@/components/catalog/ProductComparisonModal';
import { ReferenceRequestDialog } from '@/components/client/ReferenceRequestDialog';

const Catalog = () => {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  
  // Hook de comparaison
  const {
    comparisonProducts,
    isComparisonOpen,
    addToComparison,
    removeFromComparison,
    clearComparison,
    openComparison,
    closeComparison,
    isInComparison,
  } = useProductComparison();
  
  // États
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [onlyOrganic, setOnlyOrganic] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(true);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [origin, setOrigin] = useState('all');
  const [packagingUnit, setPackagingUnit] = useState('all');
  const [vat, setVat] = useState<string>('all');
  const [hasNegPrice, setHasNegPrice] = useState(false);
  const [hasTechSheet, setHasTechSheet] = useState(false);
  const [onlyEgalim, setOnlyEgalim] = useState(false);
  const [onlyWithOtherLabels, setOnlyWithOtherLabels] = useState(false);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [weightMin, setWeightMin] = useState('');
  const [weightMax, setWeightMax] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isReferenceDialogOpen, setIsReferenceDialogOpen] = useState(false);

  // Liste des fournisseurs uniques
  const suppliers = [...new Set(products.map(p => p.supplierName))];
  const origins = [...new Set(products.map(p => p.origin))];
  const packagingUnits = [...new Set(products.map(p => p.packagingUnit))];
  const vatRates = [...new Set(products.map(p => p.vatRate))].sort((a, b) => a - b);
  // Effet pour filtrer les produits
  useEffect(() => {
    let filtered = [...products];
    
    // Filtre par catégorie
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    
    // Filtre par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(term) || 
          p.supplierName.toLowerCase().includes(term) ||
          p.origin.toLowerCase().includes(term)
      );
    }
    
    // Filtre par bio
    if (onlyOrganic) {
      filtered = filtered.filter(p => p.isOrganic);
    }
    
    // Filtre par disponibilité
    if (onlyAvailable) {
      filtered = filtered.filter(p => p.available);
    }

    // Filtre par fournisseur
    if (supplierFilter !== 'all') {
      filtered = filtered.filter(p => p.supplierName === supplierFilter);
    }

    // Filtre par origine
    if (origin !== 'all') {
      filtered = filtered.filter(p => p.origin === origin);
    }

    // Filtre par unité de conditionnement
    if (packagingUnit !== 'all') {
      filtered = filtered.filter(p => p.packagingUnit === packagingUnit);
    }

    // Filtre par TVA
    if (vat !== 'all') {
      filtered = filtered.filter(p => p.vatRate === Number(vat));
    }

    // Filtre Egalim
    if (onlyEgalim) {
      filtered = filtered.filter(p => p.isEgalim);
    }

    // Filtre autres labels
    if (onlyWithOtherLabels) {
      filtered = filtered.filter(p => p.otherLabels && p.otherLabels.trim().length > 0);
    }

    // Filtre fiche technique
    if (hasTechSheet) {
      filtered = filtered.filter(p => !!p.technicalSheetUrl);
    }

    // Filtre prix négocié
    if (hasNegPrice) {
      filtered = filtered.filter(p => p.negotiatedPrice !== undefined && p.negotiatedPrice !== null);
    }

    // Filtres de prix
    const min = parseFloat(priceMin);
    if (!isNaN(min)) {
      filtered = filtered.filter(p => p.priceHT >= min);
    }
    const max = parseFloat(priceMax);
    if (!isNaN(max)) {
      filtered = filtered.filter(p => p.priceHT <= max);
    }

    // Filtres de poids
    const wmin = parseFloat(weightMin);
    if (!isNaN(wmin)) {
      filtered = filtered.filter(p => (p.weight ?? 0) >= wmin);
    }
    const wmax = parseFloat(weightMax);
    if (!isNaN(wmax)) {
      filtered = filtered.filter(p => (p.weight ?? 0) <= wmax);
    }
    
    // Filtre par favoris
    if (onlyFavorites) {
      filtered = filtered.filter(p => isFavorite(p.id));
    }
    
    // Tri
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price-asc') {
        return a.priceHT - b.priceHT;
      } else { // 'price-desc'
        return b.priceHT - a.priceHT;
      }
    });
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, category, onlyOrganic, onlyAvailable, onlyFavorites, supplierFilter, sortBy, isFavorite, origin, packagingUnit, vat, onlyEgalim, onlyWithOtherLabels, hasTechSheet, hasNegPrice, priceMin, priceMax, weightMin, weightMax]);

  // Effet pour gérer les suggestions de recherche
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const term = searchTerm.toLowerCase();
      let suggestions = products.filter(
        p => p.name.toLowerCase().includes(term) || 
          p.supplierName.toLowerCase().includes(term) ||
          p.origin.toLowerCase().includes(term)
      );
      
      // Trier par prix croissant (le moins cher en premier)
      suggestions.sort((a, b) => a.priceHT - b.priceHT);
      
      // Limiter à 8 suggestions maximum
      suggestions = suggestions.slice(0, 8);
      
      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, products]);

  // Fonction pour sélectionner une suggestion
  const handleSelectSuggestion = (product: Product) => {
    setSearchTerm(product.name);
    setShowSuggestions(false);
  };

  // Fonction pour fermer les suggestions
  const handleCloseSuggestions = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  // Initialisation des quantités à 1 pour chaque produit
  useEffect(() => {
    const initialQuantities: Record<string, number> = {};
    products.forEach(product => {
      initialQuantities[product.id] = 1;
    });
    setQuantities(initialQuantities);
  }, [products]);

  // Fonction pour ajouter un produit au panier
  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    
    toast({
      title: "Produit ajouté au panier",
      description: `${quantity} ${product.name} ajouté${quantity > 1 ? 's' : ''} au panier`,
    });
  };

  // Gérer le changement de quantité
  const handleQuantityChange = (productId: string, change: number) => {
    setQuantities(prev => {
      const currentQuantity = prev[productId] || 1;
      const newQuantity = Math.max(1, currentQuantity + change);
      return { ...prev, [productId]: newQuantity };
    });
  };

  // Function to calculate price with VAT
  const calculatePriceWithVAT = (price: number, vatRate: number) => {
    return price * (1 + vatRate / 100);
  };
  
  // Function to open technical sheet
  const openTechnicalSheet = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: "Fiche technique indisponible",
        description: "La fiche technique de ce produit n'est pas disponible pour le moment.",
        variant: "destructive",
      });
    }
  };

  // Fonction pour gérer l'ajout/suppression de la comparaison
  const handleToggleComparison = (product: Product) => {
    if (isInComparison(product.id)) {
      removeFromComparison(product.id);
    } else {
      addToComparison(product);
    }
  };

  // Rendu des cartes de produits
  const renderProductCard = (product: Product) => (
    <Card key={product.id} className="h-full flex flex-col relative">
      <ProductComparisonButton
        product={product}
        isInComparison={isInComparison(product.id)}
        onToggleComparison={handleToggleComparison}
        comparisonCount={comparisonProducts.length}
      />
      
      <CardHeader className="p-3 pb-0">
        <div className="relative">
          <AspectRatio ratio={1} className="bg-muted overflow-hidden rounded-md h-28">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full transition-all hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-ozego-beige">
                <Package className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
            )}
          </AspectRatio>
          
          <div className="absolute bottom-1 left-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 bg-white/80 hover:bg-white/90"
              onClick={() => toggleFavorite(product.id)}
            >
              <Heart 
                className={`h-3 w-3 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
              />
            </Button>
          </div>
          
          {/* Icônes labels sur la photo */}
          <div className="absolute top-1 right-1 flex gap-1">
            {product.isOrganic && (
              <div className="bg-green-100 text-green-800 text-xs font-semibold p-1 rounded-full">
                <Leaf className="h-3 w-3" />
              </div>
            )}
            {product.isEgalim && (
              <div className="bg-blue-100 text-blue-800 text-xs font-semibold p-1 rounded-full">
                <Award className="h-3 w-3" />
              </div>
            )}
            {product.otherLabels && product.otherLabels.trim() && (
              <div className="bg-purple-100 text-purple-800 text-xs font-semibold p-1 rounded-full">
                <Tag className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-1 mt-2">
          {/* Désignation OZEGO */}
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{product.name}</h3>
          
          {/* Nom du fournisseur */}
          <div className="text-xs font-medium text-muted-foreground">{product.supplierName}</div>
          
          {/* Désignation fournisseur (en italique) */}
          <div className="text-xs text-muted-foreground italic">{product.supplierDesignation}</div>
          
          {/* Référence produit */}
          <div className="text-xs">
            <span className="font-medium">Réf:</span> {product.reference}
          </div>
          
          {/* Famille produit avec icône */}
          <div className="flex items-center gap-1 text-xs">
            {product.category === 'food' ? (
              <Apple className="h-3 w-3 text-green-600" />
            ) : (
              <Package className="h-3 w-3 text-blue-600" />
            )}
            <span className="capitalize">{product.category === 'food' ? 'Alimentaire' : 'Non-alimentaire'}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 pt-1 grow">
        <div className="space-y-2">
          {/* Prix / unité de négo */}
          {product.negotiatedPrice && (
            <div className="text-sm font-semibold text-green-600">
              {product.negotiatedPrice.toFixed(2)} € / unité négo
            </div>
          )}
          
          {/* Prix / unité de conditionnement */}
          <div className="font-bold text-base">{product.priceHT.toFixed(2)} € / {product.packagingUnit}</div>
          
          <div className="text-xs text-muted-foreground">
            TVA: {product.vatRate}% - {calculatePriceWithVAT(product.priceHT, product.vatRate).toFixed(2)} € TTC
          </div>
        </div>
        
        <div className="mt-2 flex items-center">
          {product.available ? (
            <span className="text-xs text-green-600 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              En stock
            </span>
          ) : (
            <span className="text-xs text-red-600 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Indisponible
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0 mt-auto">
        {product.available ? (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`quantity-${product.id}`} className="text-xs mr-1">Qté:</Label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={() => handleQuantityChange(product.id, -1)}
                >
                  <Minus className="h-2.5 w-2.5" />
                </Button>
                <span className="mx-1.5 w-8 text-center text-xs">
                  {quantities[product.id] || 1}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={() => handleQuantityChange(product.id, 1)}
                >
                  <Plus className="h-2.5 w-2.5" />
                </Button>
                <span className="ml-1 text-xs text-muted-foreground">{product.packagingUnit}</span>
              </div>
            </div>
            
            <Button 
              className="w-full text-xs py-1.5 h-8"
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Ajouter
            </Button>
          </div>
        ) : (
          <Button className="w-full text-xs py-1.5 h-8" disabled>
            <AlertCircle className="h-3 w-3 mr-1" />
            Indisponible
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  // Rendu d'une ligne de produit (vue liste)
  const renderProductRow = (product: Product) => (
    <div 
      key={product.id} 
      className="flex flex-col sm:flex-row items-stretch border rounded-lg p-4 mb-4 relative"
    >
      <ProductComparisonButton
        product={product}
        isInComparison={isInComparison(product.id)}
        onToggleComparison={handleToggleComparison}
        comparisonCount={comparisonProducts.length}
      />
      
      <div className="sm:w-1/4 mb-4 sm:mb-0 sm:mr-4 relative">
        <AspectRatio ratio={1} className="bg-muted overflow-hidden rounded-md h-full">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-ozego-beige">
              <Package className="h-12 w-12 text-muted-foreground opacity-50" />
            </div>
          )}
        </AspectRatio>
        
        <div className="absolute top-2 left-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white/90"
            onClick={() => toggleFavorite(product.id)}
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
            />
          </Button>
        </div>
      </div>
      
      <div className="sm:w-3/4 flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-lg">{product.name}</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => openTechnicalSheet(product.technicalSheetUrl)}
                    >
                      <FileText className="h-4 w-4 text-primary" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fiche technique</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center gap-2 my-1">
              {product.isOrganic && (
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                  <Leaf className="h-3 w-3 mr-1" />
                  BIO
                </span>
              )}
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                {product.reference}
              </span>
            </div>
            
            <span className="text-sm text-muted-foreground block">
              {product.supplierName} | Origine: {product.origin}
            </span>
            
            <span className="text-xs text-muted-foreground">
              ID Ozego: {product.ozegoId} | Conditionnement: {product.packagingUnit}
            </span>
          </div>
          
          <div className="mt-2 sm:mt-0 text-right">
            <div className="font-bold text-lg">{product.priceHT.toFixed(2)} € HT</div>
            <div className="text-xs text-muted-foreground flex items-center justify-end">
              <Percent className="h-3 w-3 mr-1" />
              TVA: {product.vatRate}% - {calculatePriceWithVAT(product.priceHT, product.vatRate).toFixed(2)} € TTC
            </div>
            <div className="text-sm text-muted-foreground">{product.weight} kg</div>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          {product.available ? (
            <span className="text-xs text-green-600 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              En stock
            </span>
          ) : (
            <span className="text-xs text-red-600 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Indisponible
            </span>
          )}
        </div>
        
        {product.available ? (
          <div className="mt-auto flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center mr-4">
              <Label htmlFor={`list-quantity-${product.id}`} className="mr-2">Quantité:</Label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => handleQuantityChange(product.id, -1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="mx-2 w-6 text-center">
                  {quantities[product.id] || 1}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => handleQuantityChange(product.id, 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <Button
              className="sm:ml-auto"
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Ajouter au panier
            </Button>
          </div>
        ) : (
          <div className="mt-auto">
            <Button className="w-full sm:w-auto" disabled>
              <AlertCircle className="h-4 w-4 mr-2" />
              Indisponible
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catalogue de produits</h1>
          <p className="text-muted-foreground">
            Découvrez notre sélection de produits alimentaires et non-alimentaires
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a href="/cart">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Voir le panier
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsReferenceDialogOpen(true)}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Demande de rattachement
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filtres */}
        <div className="lg:w-1/4 space-y-6">
          <div className="p-4 border rounded-lg bg-card">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="search" className="mb-2 block">Rechercher</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nom, fournisseur, origine..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onBlur={handleCloseSuggestions}
                    onFocus={() => searchTerm.trim().length >= 2 && setShowSuggestions(true)}
                  />
                  
                  {/* Liste des suggestions */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
                      {searchSuggestions.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onMouseDown={() => handleSelectSuggestion(product)}
                        >
                          <div className="flex-shrink-0 w-12 h-12 mr-3">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full bg-ozego-beige rounded flex items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground opacity-50" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {product.supplierName} • {product.origin}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="text-sm font-semibold text-primary">
                                {product.priceHT.toFixed(2)} € HT
                              </span>
                              {product.isOrganic && (
                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <Leaf className="h-3 w-3 mr-1" />
                                  BIO
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="category" className="mb-2 block">Catégorie</Label>
                <Tabs defaultValue={category} onValueChange={(value) => setCategory(value as any)}>
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    <TabsTrigger value="food">Alimentaire</TabsTrigger>
                    <TabsTrigger value="non-food">Non-alim.</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div>
                <Label htmlFor="supplier" className="mb-2 block">Fournisseur</Label>
                <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les fournisseurs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les fournisseurs</SelectItem>
                    {suppliers.map(supplier => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="origin" className="mb-2 block">Origine</Label>
                <Select value={origin} onValueChange={setOrigin}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les origines" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les origines</SelectItem>
                    {origins.map(o => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="packaging" className="mb-2 block">Unité de conditionnement</Label>
                <Select value={packagingUnit} onValueChange={setPackagingUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les unités" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les unités</SelectItem>
                    {packagingUnits.map(u => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vat" className="mb-2 block">TVA</Label>
                <Select value={vat} onValueChange={(v) => setVat(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les TVA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les TVA</SelectItem>
                    {vatRates.map(rate => (
                      <SelectItem key={rate} value={rate.toString()}>
                        {rate}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Prix HT</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                  />
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Poids (kg)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="Min"
                    value={weightMin}
                    onChange={(e) => setWeightMin(e.target.value)}
                  />
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="Max"
                    value={weightMax}
                    onChange={(e) => setWeightMax(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="sortBy" className="mb-2 block">Trier par</Label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nom (A-Z)</SelectItem>
                    <SelectItem value="price-asc">Prix (croissant)</SelectItem>
                    <SelectItem value="price-desc">Prix (décroissant)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="organic"
                  checked={onlyOrganic}
                  onChange={() => setOnlyOrganic(!onlyOrganic)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="organic" className="flex items-center">
                  <Leaf className="h-4 w-4 mr-1 text-green-600" />
                  Produits Bio uniquement
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={onlyAvailable}
                  onChange={() => setOnlyAvailable(!onlyAvailable)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="available" className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                  Produits disponibles uniquement
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="favorites"
                  checked={onlyFavorites}
                  onChange={() => setOnlyFavorites(!onlyFavorites)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="favorites" className="flex items-center">
                  <Heart className="h-4 w-4 mr-1 text-red-500" />
                  Mes favoris uniquement
                </Label>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm('');
                  setCategory('all');
                  setOnlyOrganic(false);
                  setOnlyAvailable(true);
                  setSupplierFilter('all');
                  setSortBy('name');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        </div>
        
        {/* Liste des produits */}
        <div className="lg:w-3/4">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-1">Aucun produit trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos filtres ou votre recherche.
              </p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredProducts.map(product => renderProductCard(product))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map(product => renderProductRow(product))}
            </div>
          )}
        </div>
      </div>

      {/* Barre de comparaison */}
      <ComparisonBar
        products={comparisonProducts}
        onOpenComparison={openComparison}
        onClearComparison={clearComparison}
        onRemoveProduct={removeFromComparison}
      />

      {/* Modal de comparaison */}
      <ProductComparisonModal
        isOpen={isComparisonOpen}
        onClose={closeComparison}
        products={comparisonProducts}
        onRemoveProduct={removeFromComparison}
      />

      {/* Dialog de demande de référencement */}
      <ReferenceRequestDialog
        open={isReferenceDialogOpen}
        onOpenChange={setIsReferenceDialogOpen}
      />
    </div>
  );
};

export default Catalog;
