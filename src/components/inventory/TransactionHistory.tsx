
import { InventoryTransaction } from '@/types';

interface TransactionHistoryProps {
  getTransactionHistory: () => InventoryTransaction[];
}

const TransactionHistory = ({ getTransactionHistory }: TransactionHistoryProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Mouvements récents</h3>
      <div className="space-y-2">
        {getTransactionHistory()
          .slice(-20)
          .reverse()
          .map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-ozego-background rounded">
              <div>
                <p className="font-medium">{transaction.productName}</p>
                <p className="text-sm text-ozego-secondary">{transaction.reason}</p>
              </div>
              <div className="text-right">
                <span className={`font-medium ${
                  transaction.type === 'in' ? 'text-green-600' : 
                  transaction.type === 'out' ? 'text-red-600' : 'text-ozego-primary'
                }`}>
                  {transaction.type === 'in' ? '+' : transaction.type === 'out' ? '-' : '±'}
                  {transaction.quantity}
                </span>
                <div className="text-sm text-ozego-secondary">
                  {new Date(transaction.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
