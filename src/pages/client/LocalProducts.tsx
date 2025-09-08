import { useState, useEffect } from 'react';
import { useLocalProducts, LocalProduct } from '@/context/LocalProductContext';
import { useCart } from '@/context/CartContext';
import { ProductCategory } from '@/types';
import { 
  Plus, Minus, Grid, List, 
  Search, ShoppingCart, Package,
  CheckCircle, AlertCircle, Percent,
  Edit, Trash2
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
import LocalProductForm from '@/components/products/LocalProductForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const LocalProducts = () => {
  const { localProducts, addLocalProduct, updateLocalProduct, deleteLocalProduct } = useLocalProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // États
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState<LocalProduct[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<LocalProduct | undefined>();

  // Liste des fournisseurs uniques
  const suppliers = [...new Set(localProducts.map(p => p.customSupplierName))];

  // Effet pour filtrer les produits
  useEffect(() => {
    let filtered = [...localProducts];
    
    // Filtre par catégorie
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }
    
    // Filtre par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(term) || 
          p.customSupplierName.toLowerCase().includes(term) ||
          p.origin.toLowerCase().includes(term)
      );
    }
    
    // Filtre par fournisseur
    if (supplierFilter !== 'all') {
      filtered = filtered.filter(p => p.customSupplierName === supplierFilter);
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
  }, [localProducts, searchTerm, category, supplierFilter, sortBy]);

  // Initialisation des quantités à 1 pour chaque produit
  useEffect(() => {
    const initialQuantities: Record<string, number> = {};
    localProducts.forEach(product => {
      initialQuantities[product.id] = 1;
    });
    setQuantities(initialQuantities);
  }, [localProducts]);

  // Fonction pour ajouter un produit au panier
  const handleAddToCart = (product: LocalProduct) => {
    const quantity = quantities[product.id] || 1;
    
    // Convertir le produit local en format compatible avec le panier
    const cartProduct = {
      ...product,
      supplierId: product.customSupplierId || 'local',
      supplierName: product.customSupplierName,
      ozegoId: 'LOCAL',
      supplierDesignation: product.name,
      negotiatedPrice: undefined,
      grouping: undefined,
      caliber: undefined,
      brand: undefined,
      isEgalim: false,
      otherLabels: undefined,
      packagingCoefficient: undefined,
      technicalSheetUrl: undefined,
      imageUrl: undefined,
    };
    
    addToCart(cartProduct, quantity);
    
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

  const handleEditProduct = (product: LocalProduct) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    deleteLocalProduct(productId);
  };

  const handleFormSubmit = (data: Omit<LocalProduct, 'id' | 'clientId'>) => {
    if (editingProduct) {
      updateLocalProduct(editingProduct.id, data);
    } else {
      addLocalProduct(data);
    }
    setEditingProduct(undefined);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  // Rendu des cartes de produits
  const renderProductCard = (product: LocalProduct) => (
    <Card key={product.id} className="h-full flex flex-col relative">
      <CardHeader className="p-4 pb-0">
        <div className="relative">
          <AspectRatio ratio={4/3} className="bg-muted mb-2 overflow-hidden rounded-md">
            <div className="flex items-center justify-center w-full h-full bg-ozego-beige">
              <Package className="h-12 w-12 text-muted-foreground opacity-50" />
            </div>
          </AspectRatio>
          
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <div className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded-full">
              LOCAL
            </div>
            <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
              Réf: {product.reference}
            </div>
          </div>
          
          <div className="absolute top-2 left-2 flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => handleEditProduct(product)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer "{product.name}" ? Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="space-y-1 mt-2">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-base">{product.name}</h3>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{product.customSupplierName}</span>
            <span className="text-sm text-muted-foreground">Origine: {product.origin}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 grow">
        <div className="mt-2 flex justify-between items-center">
          <div>
            <div className="font-bold text-lg">{product.priceHT.toFixed(2)} € HT</div>
            <div className="text-xs text-muted-foreground flex items-center">
              <Percent className="h-3 w-3 mr-1" />
              TVA: {product.vatRate}% - {calculatePriceWithVAT(product.priceHT, product.vatRate).toFixed(2)} € TTC
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm">{product.weight} kg</div>
            <div className="text-xs text-muted-foreground">{product.packagingUnit}</div>
          </div>
        </div>
        
        <div className="mt-2 flex items-center">
          <span className="text-xs text-green-600 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Disponible
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`quantity-${product.id}`} className="mr-2">Quantité:</Label>
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
            className="w-full"
            onClick={() => handleAddToCart(product)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Ajouter au panier
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  // Rendu d'une ligne de produit (vue liste)
  const renderProductRow = (product: LocalProduct) => (
    <div 
      key={product.id} 
      className="flex flex-col sm:flex-row items-stretch border rounded-lg p-4 mb-4 relative"
    >
      <div className="sm:w-1/4 mb-4 sm:mb-0 sm:mr-4">
        <AspectRatio ratio={4/3} className="bg-muted overflow-hidden rounded-md h-full">
          <div className="flex items-center justify-center w-full h-full bg-ozego-beige">
            <Package className="h-12 w-12 text-muted-foreground opacity-50" />
          </div>
        </AspectRatio>
      </div>
      
      <div className="sm:w-3/4 flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-lg">{product.name}</h3>
              <Button
                variant="outline"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => handleEditProduct(product)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer "{product.name}" ? Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteProduct(product.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="flex items-center gap-2 my-1">
              <span className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded-full">
                LOCAL
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                {product.reference}
              </span>
            </div>
            
            <span className="text-sm text-muted-foreground block">
              {product.customSupplierName} | Origine: {product.origin}
            </span>
            
            <span className="text-xs text-muted-foreground">
              Conditionnement: {product.packagingUnit}
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
          <span className="text-xs text-green-600 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Disponible
          </span>
        </div>
        
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
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produits locaux</h1>
          <p className="text-muted-foreground">
            Gérez vos produits locaux et créez vos propres commandes
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </Button>
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
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar des filtres */}
        <div className="lg:w-64 space-y-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Catégories */}
          <Tabs value={category} onValueChange={(value) => setCategory(value as ProductCategory | 'all')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="food">Alimentaire</TabsTrigger>
              <TabsTrigger value="non-food">Non-alim.</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Fournisseur */}
          {suppliers.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Fournisseur</Label>
              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les fournisseurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les fournisseurs</SelectItem>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Tri */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Trier par</Label>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nom A-Z</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun produit local</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter vos premiers produits locaux
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </div>
              
              {view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(renderProductCard)}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map(renderProductRow)}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <LocalProductForm
        isOpen={isFormOpen}
        onOpenChange={handleFormClose}
        onSubmit={handleFormSubmit}
        product={editingProduct}
      />
    </div>
  );
};

export default LocalProducts;