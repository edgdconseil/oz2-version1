import { Order, Product } from '@/types';
import * as XLSX from 'xlsx';

export const exportOrdersMaCantine = (orders: Order[], products: Product[]) => {
  // Fonction pour obtenir les informations d'un produit
  const getProductInfo = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product || null;
  };

  // Préparer les données ligne par ligne de produit
  const data: any[] = [];
  
  orders.forEach(order => {
    order.items.forEach(item => {
      const product = getProductInfo(item.productId);
      
      // Déterminer les labels
      const labels = [];
      if (product?.isOrganic) labels.push('BIO');
      if (product?.isEgalim) labels.push('EGALIM');
      if (product?.otherLabels?.length) labels.push(...product.otherLabels);
      
      // Calculer le montant (quantité reçue * prix)
      const quantityUsed = item.receivedQuantity || item.quantity;
      const priceUsed = item.receivedPrice || item.priceHT;
      const montant = quantityUsed * priceUsed;
      
      data.push({
        "Fournisseur": order.supplierName,
        "Date de livraison souhaitée": order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('fr-FR') : '',
        "Nom du produit": item.productName,
        "Quantité reçue": item.receivedQuantity || item.quantity,
        "Unité": product?.packagingUnit || '',
        "Prix unitaire HT (€)": priceUsed.toFixed(2),
        "Montant (€)": montant.toFixed(2),
        "Label": labels.join(', '),
        "Biologique": product?.isOrganic ? 'Oui' : 'Non',
        "EGALIM": product?.isEgalim ? 'Oui' : 'Non',
        "Statut commande": order.status === 'ordered' ? 'Commandée' : 
                          order.status === 'received' ? 'Réceptionnée' : 'Annulée',
        "Date commande": new Date(order.createdAt).toLocaleDateString('fr-FR'),
        "Référence commande": order.id
      });
    });
  });

  // Créer une feuille de calcul Excel
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Ajuster la largeur des colonnes
  const colWidths = [
    { wch: 20 }, // Fournisseur
    { wch: 20 }, // Date de livraison souhaitée
    { wch: 30 }, // Nom du produit
    { wch: 15 }, // Quantité reçue
    { wch: 10 }, // Unité
    { wch: 18 }, // Prix unitaire HT
    { wch: 15 }, // Montant
    { wch: 20 }, // Label
    { wch: 12 }, // Biologique
    { wch: 10 }, // EGALIM
    { wch: 15 }, // Statut commande
    { wch: 15 }, // Date commande
    { wch: 20 }  // Référence commande
  ];
  worksheet['!cols'] = colWidths;
  
  // Créer un workbook et y ajouter la feuille
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Commandes Ma Cantine");
  
  // Générer le fichier et le télécharger
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `commandes_ma_cantine_${dateStr}.xlsx`);
};