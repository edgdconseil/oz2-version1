import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { X, Leaf, Package, FileText, Percent, Crown, ShoppingCart } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCart } from '@/context/CartContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveProduct: (productId: string) => void;
}

const ProductComparisonModal = ({ 
  isOpen, 
  onClose, 
  products, 
  onRemoveProduct 
}: ProductComparisonModalProps) => {
  const { addToCart } = useCart();

  // Function to calculate price with VAT
  const calculatePriceWithVAT = (price: number, vatRate: number) => {
    return price * (1 + vatRate / 100);
  };

  // Find the cheapest product based on price HT
  const getCheapestProductId = () => {
    if (products.length === 0) return null;
    const cheapest = products.reduce((min, product) => 
      product.priceHT < min.priceHT ? product : min
    );
    return cheapest.id;
  };

  const cheapestProductId = getCheapestProductId();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Comparatif de produits
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Images des produits alignées avec les colonnes */}
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <tbody>
                <tr>
                  {/* Colonne vide pour aligner avec la première colonne du tableau */}
                  <td className="w-48"></td>
                  
                  {/* Images alignées avec les colonnes de produits */}
                  {products.map((product) => (
                    <td key={product.id} className="min-w-48 p-2">
                      <div className="relative">
                        <AspectRatio ratio={4/3} className="bg-muted overflow-hidden rounded-md">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-ozego-beige">
                              <Package className="h-8 w-8 text-muted-foreground opacity-50" />
                            </div>
                          )}
                        </AspectRatio>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                          onClick={() => onRemoveProduct(product.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {product.id === cheapestProductId && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                            <Crown className="h-4 w-4" />
                          </div>
                        )}
                        <div className="mt-2 text-center">
                          <h3 className="font-medium text-sm truncate">{product.name}</h3>
                          <p className="text-xs text-muted-foreground">{product.supplierName}</p>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tableau de comparaison */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Caractéristique</TableHead>
                  {products.map((product) => (
                    <TableHead key={product.id} className="text-center min-w-48">
                      <div className="flex items-center justify-center gap-1">
                        {product.id === cheapestProductId && (
                          <Crown className="h-4 w-4 text-green-600" />
                        )}
                        {product.name}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Fournisseur</TableCell>
                  {products.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      {product.supplierName}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Référence</TableCell>
                  {products.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      <Badge variant="outline">{product.reference}</Badge>
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Prix HT</TableCell>
                  {products.map((product) => (
                    <TableCell 
                      key={product.id} 
                      className={`text-center font-semibold ${
                        product.id === cheapestProductId 
                          ? 'bg-green-100 text-green-800' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {product.id === cheapestProductId && (
                          <Crown className="h-4 w-4 text-green-600" />
                        )}
                        {product.priceHT.toFixed(2)} €
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Prix TTC</TableCell>
                  {products.map((product) => (
                    <TableCell 
                      key={product.id} 
                      className={`text-center ${
                        product.id === cheapestProductId 
                          ? 'bg-green-100 text-green-800' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {product.id === cheapestProductId && (
                          <Crown className="h-4 w-4 text-green-600" />
                        )}
                        {calculatePriceWithVAT(product.priceHT, product.vatRate).toFixed(2)} €
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">TVA</TableCell>
                  {products.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      <div className="flex items-center justify-center">
                        <Percent className="h-3 w-3 mr-1" />
                        {product.vatRate}%
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Poids</TableCell>
                  {products.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      {product.weight} kg
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Origine</TableCell>
                  {products.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      {product.origin}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Conditionnement</TableCell>
                  {products.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      {product.packagingUnit}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Bio</TableCell>
                  {products.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      {product.isOrganic ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Leaf className="h-3 w-3 mr-1" />
                          OUI
                        </Badge>
                      ) : (
                        <Badge variant="outline">NON</Badge>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Disponibilité</TableCell>
                  {products.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      <Badge 
                        variant={product.available ? "default" : "destructive"}
                        className={product.available ? "bg-green-100 text-green-800" : ""}
                      >
                        {product.available ? "En stock" : "Indisponible"}
                      </Badge>
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">ID Ozego</TableCell>
                  {products.map((product) => (
                    <TableCell key={product.id} className="text-center text-xs text-muted-foreground">
                      {product.ozegoId}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Fiche technique</TableCell>
                  {products.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      {product.technicalSheetUrl ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(product.technicalSheetUrl, '_blank')}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-xs">Non disponible</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                
                <TableRow>
                  <TableCell className="font-medium">Action</TableCell>
                  {products.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        disabled={!product.available}
                        onClick={() => addToCart(product, 1)}
                      >
                        <ShoppingCart className="h-3 w-3 mr-2" />
                        {product.available ? 'Ajouter au panier' : 'Indisponible'}
                      </Button>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductComparisonModal;
