import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useProducts } from '@/context/ProductContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface PriceHistoryDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PriceHistoryDialog: React.FC<PriceHistoryDialogProps> = ({ product, open, onOpenChange }) => {
  const { getPriceHistory } = useProducts();
  const history = product ? getPriceHistory(product.id) : [];

  const data = history.map(h => ({
    date: new Date(h.date).toLocaleDateString(),
    priceHT: h.priceHT ?? null,
    negotiatedPrice: h.negotiatedPrice ?? null,
  }));

  const handleExportCSV = () => {
    if (!product) return;
    const rows = [
      ['Date', 'Prix HT', 'Prix négocié'],
      ...history.map(h => [
        new Date(h.date).toISOString(),
        h.priceHT ?? '',
        h.negotiatedPrice ?? ''
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historique-prix-${product.reference}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Historique des prix</DialogTitle>
          <DialogDescription>
            {product ? `${product.name} · Réf: ${product.reference}` : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {data.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="priceHT" name="Prix HT" stroke="#3b82f6" dot={false} />
                  <Line type="monotone" dataKey="negotiatedPrice" name="Prix négocié" stroke="#10b981" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">Aucune donnée d'historique sur 12 mois.</div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={handleExportCSV}>Exporter CSV</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PriceHistoryDialog;
