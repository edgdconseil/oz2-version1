
import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { useProductUpdate } from '@/context/ProductUpdateContext';
import { importProductsFromFile, ImportResults } from '@/utils/exportUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProductImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductImportDialog = ({ isOpen, onOpenChange }: ProductImportDialogProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { products } = useProducts();
  const { submitUpdateRequest, createImportBatch } = useProductUpdate();

  const handleFileSelect = (file: File) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour importer des produits.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    toast({
      title: "Importation en cours",
      description: "Analyse du fichier en cours...",
    });

    // Créer un batch d'importation
    const batchId = createImportBatch(file.name, user.id, user.name);

    importProductsFromFile(file, products, (results: ImportResults) => {
      setIsProcessing(false);
      
      let updateRequestsCount = 0;
      
      // Pour chaque produit mis à jour, créer une demande de modification
      results.updated.forEach(updatedProduct => {
        const originalProduct = products.find(p => p.id === updatedProduct.id);
        if (originalProduct) {
          // Identifier les champs modifiés
          const proposedChanges: any = {};
          Object.keys(updatedProduct).forEach(key => {
            if (updatedProduct[key as keyof typeof updatedProduct] !== originalProduct[key as keyof typeof originalProduct]) {
              proposedChanges[key] = updatedProduct[key as keyof typeof updatedProduct];
            }
          });
          
          if (Object.keys(proposedChanges).length > 0) {
            submitUpdateRequest(originalProduct, proposedChanges, batchId);
            updateRequestsCount++;
          }
        }
      });

      // Pour chaque nouveau produit, créer une demande de création
      results.created.forEach(newProduct => {
        // Créer un produit "fictif" pour la demande
        const originalProduct = {
          ...newProduct,
          id: `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          supplierId: user.id,
          supplierName: user.name,
        };
        
        submitUpdateRequest(originalProduct, newProduct, batchId);
        updateRequestsCount++;
      });

      // Afficher le résultat
      const message = `
        Import terminé: ${updateRequestsCount} demandes de modification créées.
        ${results.errors.length > 0 ? `${results.errors.length} erreurs détectées.` : ''}
      `;

      toast({
        title: "Import terminé",
        description: message,
        variant: results.errors.length > 0 ? "destructive" : "default",
      });

      if (results.errors.length > 0) {
        console.error("Erreurs d'importation:", results.errors);
      }

      onOpenChange(false);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(file => 
      file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')
    );
    
    if (excelFile) {
      handleFileSelect(excelFile);
    } else {
      toast({
        title: "Format de fichier non supporté",
        description: "Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV.",
        variant: "destructive",
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importer des produits</DialogTitle>
          <DialogDescription>
            Importez vos produits depuis un fichier Excel. Les modifications seront soumises à validation administrative.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Les modifications importées nécessitent une validation de l'administrateur avant d'être appliquées.
          </AlertDescription>
        </Alert>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-ozego-blue bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isProcessing}
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <FileSpreadsheet className="h-8 w-8 text-gray-600" />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isProcessing ? "Traitement en cours..." : "Glissez votre fichier Excel ici"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Ou cliquez pour sélectionner un fichier
              </p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              <Upload className="h-4 w-4 mr-2" />
              Sélectionner un fichier
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          <p className="font-medium mb-1">Formats acceptés :</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Excel (.xlsx, .xls)</li>
            <li>CSV (.csv)</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImportDialog;
