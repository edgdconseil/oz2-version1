
import React, { useRef } from 'react';
import { Search, FileSpreadsheet, Upload, FileDown, LineChart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Plus } from 'lucide-react';
import { Product } from '@/types';
import { downloadProductsAsCSV, downloadProductsAsXLSX } from '@/utils/exportUtils';
import { useProducts } from '@/context/ProductContext';
import { useToast } from '@/hooks/use-toast';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  availabilityFilter: string;
  onAvailabilityChange: (value: string) => void;
  onExport: () => void;
  onAddNew: () => void;
  onImport: (file: File) => void;
}

const ProductFilters = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  availabilityFilter,
  onAvailabilityChange,
  onExport,
  onAddNew,
  onImport,
}: ProductFiltersProps) => {
  const { products, getPriceHistory } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleExportCSV = () => {
    downloadProductsAsCSV(products);
    toast({
      title: "Export CSV réussi",
      description: `${products.length} produits exportés au format CSV`,
    });
    onExport(); // Pour conserver la compatibilité avec le code existant
  };
  
  const handleExportXLSX = () => {
    downloadProductsAsXLSX(products);
    toast({
      title: "Export Excel réussi",
      description: `${products.length} produits exportés au format Excel`,
    });
    onExport(); // Pour conserver la compatibilité avec le code existant
  };
  
  const handleExportHistoryCSV = () => {
    // Construire un CSV avec toutes les entrées d'historique des 12 derniers mois
    const headers = [
      'Référence',
      'Nom',
      'Fournisseur',
      'Date',
      'Prix HT',
      'Prix négocié',
      'Modifié par'
    ];

    const rows: (string | number)[][] = [headers];

    products.forEach((p) => {
      const history = getPriceHistory(p.id);
      history.forEach((h) => {
        rows.push([
          p.reference,
          p.name,
          p.supplierName,
          new Date(h.date).toISOString(),
          h.priceHT ?? '',
          h.negotiatedPrice ?? '',
          h.changedByRole ?? ''
        ]);
      });
    });

    const escapeField = (f: any) => {
      const s = String(f);
      return s.includes(';') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };

    const csv = rows.map(r => r.map(escapeField).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `produits_historique_12mois_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export historique réussi",
      description: "Historique 12 mois exporté pour l'ensemble des produits",
    });
  };
  const handleImportClick = () => {
    // Déclencher le clic sur l'input file caché
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "Importation en cours",
        description: "Veuillez patienter pendant le traitement du fichier...",
      });
      onImport(file);
      // Réinitialiser l'input file pour permettre de sélectionner le même fichier à nouveau
      e.target.value = '';
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un produit..."
            className="pl-8 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="food">Alimentaire</SelectItem>
            <SelectItem value="non-food">Non alimentaire</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={availabilityFilter} onValueChange={onAvailabilityChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Disponibilité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="available">Disponibles</SelectItem>
            <SelectItem value="unavailable">Non disponibles</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-2 w-full md:w-auto">
        {/* Input file caché pour l'importation */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".xlsx,.xls,.csv" 
          className="hidden" 
        />
        
        <Button variant="outline" size="sm" onClick={handleImportClick}>
          <Upload className="h-4 w-4 mr-2" />
          Importer
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
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
        
        <Button variant="outline" size="sm" onClick={handleExportHistoryCSV}>
          <LineChart className="h-4 w-4 mr-2" />
          Export histo 12 mois
        </Button>
        
        <Button onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau produit
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;
