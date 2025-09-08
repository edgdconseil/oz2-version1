
import * as XLSX from 'xlsx';
import { Product } from "@/types";

/**
 * Convertit un tableau de produits en workbook Excel (XLSX)
 */
export const convertProductsToXLSX = (products: Product[]): XLSX.WorkBook => {
  // Préparer les données pour le format Excel
  const data = products.map(product => ({
    "Référence": product.reference,
    "Nom": product.name,
    "Catégorie": product.category === 'food' ? 'Alimentaire' : 'Non alimentaire',
    "Prix HT": product.priceHT.toFixed(2),
    "Poids": product.weight.toString(),
    "Origine": product.origin,
    "Biologique": product.isOrganic ? 'Oui' : 'Non',
    "Fournisseur": product.supplierName,
    "Disponibilité": product.available ? 'Disponible' : 'Indisponible',
    "Unité": product.packagingUnit,
    "Taux TVA": `${product.vatRate}%`
  }));

  // Créer une feuille de calcul
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Créer un workbook et y ajouter la feuille
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Produits");
  
  return workbook;
};

/**
 * Télécharge un fichier XLSX contenant les données des produits
 */
export const downloadProductsAsXLSX = (products: Product[]): void => {
  // Convertir les produits en XLSX
  const workbook = convertProductsToXLSX(products);
  
  // Générer le fichier et le télécharger
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `produits_export_${dateStr}.xlsx`);
};
