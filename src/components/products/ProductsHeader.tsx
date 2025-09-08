
import React from 'react';
import { Plus, Upload, FileDown, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { Product } from '@/types';
import { downloadProductsAsCSV, downloadProductsAsXLSX } from '@/utils/exportUtils';

interface ProductsHeaderProps {
  supplierProducts: Product[];
  onImportClick: () => void;
}

const ProductsHeader = ({ supplierProducts, onImportClick }: ProductsHeaderProps) => {
  const { toast } = useToast();

  const handleExportCSV = () => {
    downloadProductsAsCSV(supplierProducts);
    toast({
      title: "Export CSV réussi",
      description: `${supplierProducts.length} produits exportés au format CSV`,
    });
  };

  const handleExportXLSX = () => {
    downloadProductsAsXLSX(supplierProducts);
    toast({
      title: "Export Excel réussi",
      description: `${supplierProducts.length} produits exportés au format Excel`,
    });
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-ozego-blue">Mes produits</h1>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-blue-50 hover:bg-blue-100 border-blue-200">
              <FileDown className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportCSV}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Format CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportXLSX}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Format Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button 
          variant="outline" 
          onClick={onImportClick}
          className="bg-green-50 hover:bg-green-100 border-green-200"
        >
          <Upload className="mr-2 h-4 w-4" /> 
          Importer Excel
        </Button>
        <Button className="bg-ozego-blue hover:bg-ozego-dark-blue">
          <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
        </Button>
      </div>
    </div>
  );
};

export default ProductsHeader;
