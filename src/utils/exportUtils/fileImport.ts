
import { Product } from "@/types";
import * as XLSX from 'xlsx';
import { excelRowToProduct, generateReference } from './commonUtils';

/**
 * Structure pour les résultats d'importation
 */
export interface ImportResults {
  updated: Product[];
  created: Product[];
  errors: string[];
}

/**
 * Importe des produits à partir d'un fichier Excel ou CSV
 * Met à jour les produits existants et ajoute de nouveaux produits
 * @param file Le fichier à importer
 * @param existingProducts La liste des produits existants
 * @param onComplete Callback à exécuter avec les résultats de l'importation
 */
export const importProductsFromFile = (
  file: File,
  existingProducts: Product[],
  onComplete: (results: ImportResults) => void
): void => {
  const reader = new FileReader();
  const results: ImportResults = {
    updated: [],
    created: [],
    errors: []
  };

  reader.onload = (e) => {
    try {
      const data = e.target?.result;
      if (!data) {
        onComplete({ ...results, errors: ['Impossible de lire le fichier'] });
        return;
      }

      // Conversion du fichier en workbook
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Conversion de la feuille en JSON
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Obtenir les en-têtes (première ligne)
      const headers = rows[0] as string[];
      
      // Créer des objets pour chaque ligne en utilisant les en-têtes comme clés
      const jsonData = [];
      for (let i = 1; i < rows.length; i++) {
        const rowData = rows[i] as any[];
        const row: any = {};
        
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = rowData[j];
        }
        
        jsonData.push(row);
      }
      
      // Traiter chaque ligne du fichier
      for (const row of jsonData) {
        try {
          // Convertir la ligne en produit
          const importedProduct = excelRowToProduct(row);
          
          // Si la référence est manquante et que le nom existe, générer une référence
          if (!importedProduct.reference && importedProduct.name) {
            importedProduct.reference = generateReference(importedProduct.name);
            results.errors.push(`Référence générée automatiquement pour "${importedProduct.name}": ${importedProduct.reference}`);
          }
          // Si ni la référence ni le nom n'existent, ignorer la ligne
          else if (!importedProduct.reference && !importedProduct.name) {
            results.errors.push(`Ligne ignorée: référence et nom manquants`);
            continue;
          }
          
          // Rechercher si le produit existe déjà par sa référence
          const existingProductIndex = existingProducts.findIndex(
            p => p.reference === importedProduct.reference
          );
          
          if (existingProductIndex >= 0) {
            // Mise à jour d'un produit existant
            const updatedProduct = {
              ...existingProducts[existingProductIndex],
              ...importedProduct
            };
            results.updated.push(updatedProduct);
          } else {
            // Créer un nouveau produit (avec des valeurs par défaut pour les champs manquants)
            const newProduct: Partial<Product> = {
              ...importedProduct,
              id: `product-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              ozegoId: importedProduct.ozegoId || `OZG-${Math.floor(Math.random() * 10000)}`,
              supplierId: importedProduct.supplierId || 'imported',
            };
            results.created.push(newProduct as Product);
          }
        } catch (error) {
          results.errors.push(`Erreur de traitement de la ligne: ${error}`);
        }
      }
      
      onComplete(results);
    } catch (error) {
      onComplete({ ...results, errors: [`Erreur lors de l'importation: ${error}`] });
    }
  };
  
  reader.onerror = () => {
    onComplete({ ...results, errors: ['Erreur de lecture du fichier'] });
  };
  
  reader.readAsBinaryString(file);
};
