import React from 'react';
import { Pencil, ToggleRight, ToggleLeft, Eye, EyeOff, LineChart as LineChartIcon } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  showHistory?: boolean;
  onShowHistory?: (product: Product) => void;
}

const ProductTable = ({ products, onEdit, onDelete, showHistory, onShowHistory }: ProductTableProps) => {
  const handleToggleAvailability = (product: Product) => {
    // Use the onDelete prop to toggle availability (it's being used for that in the supplier context)
    onDelete(product.id);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Désignation fournisseur</TableHead>
            <TableHead>Famille</TableHead>
            <TableHead>Origine</TableHead>
            <TableHead className="text-right">Prix HT</TableHead>
            <TableHead className="text-right">Poids</TableHead>
            <TableHead>EGALIM</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Disponibilité</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(product => (
            <TableRow key={product.id} className={`${!product.available ? 'opacity-70' : ''}`}>
              <TableCell className="font-medium">{product.reference}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className="max-w-[200px] truncate" title={product.supplierDesignation}>
                {product.supplierDesignation}
              </TableCell>
              <TableCell>
                <Badge variant={product.category === 'food' ? 'default' : 'secondary'}>
                  {product.category === 'food' ? 'Alimentaire' : 'Non alimentaire'}
                </Badge>
              </TableCell>
              <TableCell>{product.origin}</TableCell>
              <TableCell className="text-right">{product.priceHT.toFixed(2)} €</TableCell>
              <TableCell className="text-right">{product.weight} {product.packagingUnit}</TableCell>
              <TableCell>
                <Badge variant={product.isEgalim ? 'default' : 'outline'}>
                  {product.isEgalim ? 'EGALIM' : 'Non EGALIM'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={product.isOrganic ? 'default' : 'outline'}>
                  {product.isOrganic ? 'Bio' : 'Non bio'}
                </Badge>
              </TableCell>
              <TableCell>
                {product.available ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Eye className="h-3 w-3 mr-1" />
                    Disponible
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Indisponible
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-1 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  {showHistory && onShowHistory && (
                    <Button variant="ghost" size="sm" onClick={() => onShowHistory(product)}>
                      <LineChartIcon className="h-4 w-4 mr-1" />
                      Historique
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleAvailability(product)}
                  >
                    {product.available ? (
                      <>
                        <ToggleLeft className="h-4 w-4 mr-1 text-gray-500" />
                        Désactiver
                      </>
                    ) : (
                      <>
                        <ToggleRight className="h-4 w-4 mr-1 text-green-500" />
                        Activer
                      </>
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                Aucun produit ne correspond à votre recherche
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;