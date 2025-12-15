import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  merchant: string | null;
  amount: number;
  date: string;
  category_name: string;
  category_emoji: string;
  provider: string;
  is_confirmed: boolean;
  type?: 'income' | 'expense';
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatRelativeDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
};

const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-3">
      {transactions.slice(0, 5).map((transaction) => {
        // Check for 'income' type (database value)
        const isIncome = transaction.type === 'income' || transaction.amount >= 0;
        
        return (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-xl">
                {transaction.category_emoji}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {truncateText(transaction.merchant || 'Sin descripción', 30)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.provider} • {formatRelativeDate(transaction.date)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={cn(
                "font-semibold",
                isIncome ? "text-green-500" : "text-red-500"
              )}>
                {isIncome ? "+" : "-"}{formatCOP(Math.abs(transaction.amount))}
              </p>
              <Badge variant="secondary" className="text-xs mt-1">
                {transaction.category_name}
              </Badge>
            </div>
          </div>
        );
      })}

      {transactions.length > 0 && (
        <button 
          onClick={() => navigate('/transactions')}
          className="w-full text-sm text-primary hover:text-primary/80 flex items-center justify-center gap-1 py-2 transition-colors"
        >
          Ver todas <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {transactions.length === 0 && (
        <div className="text-center py-8">
          <span className="text-4xl mb-3 block">📊</span>
          <p className="text-foreground font-medium">Aún no hay transacciones</p>
          <p className="text-sm text-muted-foreground">
            Cuando sincronicemos tus emails bancarios, verás tus gastos aquí
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
