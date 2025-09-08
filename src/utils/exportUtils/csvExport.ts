
import { Product } from "@/types";

/**
 * Convertit un tableau de produits en chaîne CSV
 */
export const convertProductsToCSV = (products: Product[]): string => {
  // Définir les en-têtes du CSV
  const headers = [
    "Référence",
    "Nom",
    "Catégorie",
    "Prix HT",
    "Poids",
    "Origine",
    "Biologique",
    "Fournisseur",
    "Disponibilité",
    "Unité",
    "Taux TVA"
  ];

  // Créer la ligne d'en-tête
  let csvContent = headers.join(';') + '\n';

  // Ajouter chaque produit
  products.forEach(product => {
    const row = [
      product.reference,
      product.name,
      product.category === 'food' ? 'Alimentaire' : 'Non alimentaire',
      product.priceHT.toFixed(2),
      product.weight.toString(),
      product.origin,
      product.isOrganic ? 'Oui' : 'Non',
      product.supplierName,
      product.available ? 'Disponible' : 'Indisponible',
      product.packagingUnit,
      `${product.vatRate}%`
    ];
    
    // Échapper les champs contenant des points-virgules ou des sauts de ligne
    const escapedRow = row.map(field => {
      if (field.includes(';') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    });
    
    csvContent += escapedRow.join(';') + '\n';
  });

  return csvContent;
};

/**
 * Télécharge un fichier CSV contenant les données des produits
 */
export const downloadProductsAsCSV = (products: Product[]): void => {
  // Convertir les produits en CSV
  const csvContent = convertProductsToCSV(products);
  
  // Créer un objet Blob pour le téléchargement
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Créer un élément de lien pour le téléchargement
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `produits_export_${new Date().toISOString().slice(0,10)}.csv`);
  link.style.visibility = 'hidden';
  
  // Ajouter le lien au DOM, cliquer dessus, puis le supprimer
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
