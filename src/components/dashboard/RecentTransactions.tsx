import { ArrowRight } from "lucide-react";
import { Transaction, formatCOP, formatRelativeDate } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions = ({ transactions }: RecentTransactionsProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          📝 Últimas Transacciones
        </h3>
        <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
          Ver todas <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        {transactions.slice(0, 5).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-xl">
                {transaction.category_emoji}
              </div>
              <div>
                <p className="font-medium text-foreground">{transaction.merchant}</p>
                <p className="text-xs text-muted-foreground">
                  {transaction.provider} • {formatRelativeDate(transaction.date)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold ${
                  transaction.amount >= 0 ? "text-emerald-400" : "text-foreground"
                }`}
              >
                {transaction.amount >= 0 ? "+" : ""}
                {formatCOP(transaction.amount)}
              </p>
              <Badge variant="secondary" className="text-xs mt-1">
                {transaction.category_name}
              </Badge>
            </div>
          </div>
        ))}
      </div>

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
