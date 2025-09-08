import { InventoryItem, Product } from '@/types';
import * as XLSX from 'xlsx';

export const exportInventoryToCsv = (filteredItems: InventoryItem[], products: Product[]) => {
  // Fonction pour obtenir le prix d'un produit
  const getProductPrice = (productId: string): number => {
    const product = products.find(p => p.id === productId);
    return product ? product.priceHT : 0;
  };

  // Calcul de la valorisation totale
  const totalValue = filteredItems.reduce((total, item) => {
    const price = getProductPrice(item.productId);
    return total + (price * item.currentStock);
  }, 0);

  const csvContent = [
    ['Référence', 'Produit', 'Stock actuel', 'Unité', 'Prix unitaire HT (€)', 'Valorisation (€)', 'Seuil d\'alerte', 'Fournisseur', 'Dernière MAJ'].join(';'),
    ...filteredItems.map(item => {
      const unitPrice = getProductPrice(item.productId);
      const itemValue = unitPrice * item.currentStock;
      
      return [
        item.productReference,
        item.productName,
        item.currentStock.toString(),
        item.unit,
        unitPrice.toFixed(2),
        itemValue.toFixed(2),
        item.alertThreshold.toString(),
        item.supplierName,
        new Date(item.lastUpdated).toLocaleDateString('fr-FR')
      ].join(';');
    }),
    // Ligne de total
    ['', '', '', '', 'TOTAL:', totalValue.toFixed(2), '', '', ''].join(';')
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `inventaire_valorise_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportInventoryMaCantine = (filteredItems: InventoryItem[], products: Product[]) => {
  // Fonction pour obtenir les informations d'un produit
  const getProductInfo = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product || null;
  };

  // Préparer les données dans le format "Ma Cantine"
  const data = filteredItems.map(item => {
    const product = getProductInfo(item.productId);
    const labels = [];
    
    if (item.isOrganic) labels.push('BIO');
    if (item.isEgalim) labels.push('EGALIM');
    if (item.otherLabels?.length) labels.push(...item.otherLabels);
    
    return {
      "Référence": item.productReference,
      "Nom du produit": item.productName,
      "Catégorie": product?.category === 'food' ? 'Alimentaire' : 'Non alimentaire',
      "Stock actuel": item.currentStock,
      "Unité": item.unit,
      "Prix unitaire HT (€)": product?.priceHT?.toFixed(2) || '0.00',
      "Valorisation (€)": ((product?.priceHT || 0) * item.currentStock).toFixed(2),
      "Seuil d'alerte": item.alertThreshold,
      "Fournisseur": item.supplierName,
      "Origine": product?.origin || '',
      "Labels": labels.join(', '),
      "Poids (g)": product?.weight || '',
      "Biologique": item.isOrganic ? 'Oui' : 'Non',
      "EGALIM": item.isEgalim ? 'Oui' : 'Non',
      "Date dernière MAJ": new Date(item.lastUpdated).toLocaleDateString('fr-FR')
    };
  });

  // Créer une feuille de calcul Excel
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Ajuster la largeur des colonnes
  const colWidths = [
    { wch: 15 }, // Référence
    { wch: 30 }, // Nom du produit
    { wch: 15 }, // Catégorie
    { wch: 12 }, // Stock actuel
    { wch: 10 }, // Unité
    { wch: 15 }, // Prix unitaire HT
    { wch: 15 }, // Valorisation
    { wch: 12 }, // Seuil d'alerte
    { wch: 20 }, // Fournisseur
    { wch: 15 }, // Origine
    { wch: 20 }, // Labels
    { wch: 10 }, // Poids
    { wch: 10 }, // Biologique
    { wch: 10 }, // EGALIM
    { wch: 15 }  // Date dernière MAJ
  ];
  worksheet['!cols'] = colWidths;
  
  // Créer un workbook et y ajouter la feuille
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventaire Ma Cantine");
  
  // Générer le fichier et le télécharger
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `inventaire_ma_cantine_${dateStr}.xlsx`);
};