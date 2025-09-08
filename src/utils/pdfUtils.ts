
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order, OrderItem, Product } from '@/types';

export const generateOrderPDF = (order: Order): void => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('BON DE COMMANDE', 14, 22);
  
  doc.setFontSize(12);
  doc.text(`Commande N°: ${order.id}`, 14, 35);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`, 14, 42);
  
  // Client and Supplier info
  doc.setFontSize(11);
  doc.text('CLIENT:', 14, 60);
  doc.text(`${order.clientName}`, 14, 65);
  
  // Add client reference if available
  if (order.clientReference) {
    doc.text(`Référence client: ${order.clientReference}`, 14, 70);
  }
  
  doc.text('FOURNISSEUR:', 120, 60);
  doc.text(`${order.supplierName}`, 120, 65);
  
  // Prepare table data
  const tableColumn = ["Produit", "Unité", "Quantité", "Prix HT", "Total HT"];
  const tableRows = order.items.map(item => [
    item.productName,
    item.packagingUnit || 'N/A',
    item.quantity.toString(),
    `${item.priceHT.toFixed(2)} €`,
    `${(item.priceHT * item.quantity).toFixed(2)} €`
  ]);
  
  // Add items table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: order.clientReference ? 80 : 75,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [230, 236, 245], textColor: [0, 0, 0] }
  });
  
  // Add totals
  const finalY = (doc as any).lastAutoTable.finalY || 80;
  doc.text(`Total HT: ${order.totalHT.toFixed(2)} €`, 14, finalY + 20);
  doc.text(`Total TTC: ${order.totalTTC.toFixed(2)} €`, 14, finalY + 30);
  
  // Save the PDF
  doc.save(`commande-${order.id}.pdf`);
};

export const generateLitigePDF = (order: Order, orderItem: OrderItem, product?: Product): void => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('BON DE LITIGE', 14, 22);
  
  doc.setFontSize(12);
  doc.text(`Commande de référence: ${order.id}`, 14, 35);
  doc.text(`Date de réception: ${new Date().toLocaleDateString('fr-FR')}`, 14, 42);
  
  // Client and Supplier info
  doc.setFontSize(11);
  doc.text('CLIENT:', 14, 60);
  doc.text(`${order.clientName}`, 14, 65);
  
  // Ajouter le numéro de client (ID de commande comme référence)
  doc.text(`N° Client: ${order.clientId}`, 14, 70);
  
  if (order.clientReference) {
    doc.text(`Référence client: ${order.clientReference}`, 14, 75);
  }
  
  doc.text('FOURNISSEUR:', 120, 60);
  doc.text(`${order.supplierName}`, 120, 65);
  
  // Product details
  doc.setFontSize(14);
  doc.text('DÉTAILS DU LITIGE', 14, order.clientReference ? 90 : 85);
  
  const startY = order.clientReference ? 100 : 95;
  
  // Product info table
  const productData = [
    ['Produit', orderItem.productName],
    ['Code produit', product?.reference || 'N/A'],
    ['Quantité commandée', orderItem.quantity.toString()],
    ['Prix commandé (HT)', `${orderItem.priceHT.toFixed(2)} €`],
    ['Quantité reçue', `${orderItem.receivedQuantity || 0}`],
    ['Prix appliqué (HT)', `${(orderItem.receivedPrice || 0).toFixed(2)} €`]
  ];
  
  autoTable(doc, {
    body: productData,
    startY: startY,
    theme: 'grid',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fillColor: [230, 236, 245], fontStyle: 'bold' },
    }
  });
  
  // Litige details
  let currentY = (doc as any).lastAutoTable.finalY + 20;
  
  doc.setFontSize(12);
  doc.text('INFORMATIONS DU LITIGE', 14, currentY);
  
  currentY += 15;
  doc.setFontSize(10);
  
  const litigeStatusText = orderItem.litigeStatus === 'create_litige' ? 'Créé' : 'Aucun';
  doc.text(`Statut: ${litigeStatusText}`, 14, currentY);
  
  currentY += 10;
  const litigeSouhaitText = orderItem.litigeSouhait === 'remboursement' ? 'Remboursement' :
                           orderItem.litigeSouhait === 'retour_fournisseur' ? 'Retour fournisseur' : 'Autre';
  doc.text(`Souhait: ${litigeSouhaitText}`, 14, currentY);
  
  if (orderItem.litigeComment) {
    currentY += 15;
    doc.text('Commentaire:', 14, currentY);
    currentY += 10;
    
    // Split long comments into multiple lines
    const splitComment = doc.splitTextToSize(orderItem.litigeComment, 180);
    doc.text(splitComment, 14, currentY);
  }
  
  // Signature section
  currentY += 40;
  doc.text('Signature du client:', 14, currentY);
  doc.text('Date:', 120, currentY);
  
  // Save the PDF
  doc.save(`bon-litige-${order.id}-${orderItem.productId}.pdf`);
};
