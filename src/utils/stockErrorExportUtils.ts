import { StockError, stockErrorLabels } from '@/types/stock-error';

const downloadCSV = (csv: string, filename: string) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportStockErrorsToCsv = (errors: StockError[]) => {
  const headers = [
    'Date',
    'Référence',
    'Produit',
    'Fournisseur',
    'Type d\'erreur',
    'Quantité',
    'Unité',
    'Valeur perdue (€ HT)',
    'Description'
  ];

  const rows = errors.map(error => [
    new Date(error.dateReported).toLocaleDateString('fr-FR'),
    error.productReference,
    error.productName,
    error.supplierName,
    stockErrorLabels[error.errorType],
    error.quantity.toString(),
    error.unit,
    error.estimatedValue.toFixed(2),
    error.description
  ]);

  const totalValue = errors.reduce((sum, error) => sum + error.estimatedValue, 0);
  
  // Ajouter une ligne de total
  rows.push([
    '',
    '',
    '',
    '',
    '',
    '',
    'TOTAL',
    totalValue.toFixed(2),
    `${errors.length} erreur(s) signalée(s)`
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  downloadCSV(csvContent, `erreurs-stock-${new Date().toISOString().split('T')[0]}.csv`);
};