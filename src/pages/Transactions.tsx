import { useState, useMemo } from "react";
import { Search, Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboardData, Transaction } from "@/hooks/useDashboardData";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const TransactionsPage = () => {
  const { transactions, isLoading } = useDashboardData();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    let result = transactions || [];
    
    if (filter === 'income') {
      result = result.filter(t => t.type === 'ingreso');
    } else if (filter === 'expense') {
      result = result.filter(t => t.type === 'gasto');
    }
    
    if (searchTerm) {
      result = result.filter(t => 
        t.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return result;
  }, [transactions, filter, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transacciones</h1>
          <p className="text-muted-foreground">Historial completo de movimientos</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transacción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted/50 border-border"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            Todas
          </Button>
          <Button
            variant={filter === 'income' ? 'default' : 'outline'}
            onClick={() => setFilter('income')}
            size="sm"
            className={filter === 'income' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Ingresos
          </Button>
          <Button
            variant={filter === 'expense' ? 'default' : 'outline'}
            onClick={() => setFilter('expense')}
            size="sm"
            className={filter === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            Gastos
          </Button>
        </div>
      </div>

      {/* Lista de transacciones */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-border">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <span className="text-lg">{transaction.categories?.icon || '📦'}</span>
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{transaction.merchant || 'Sin comercio'}</p>
                    <p className="text-muted-foreground text-sm">
                      {transaction.categories?.name || 'Sin categoría'} • {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-semibold",
                    transaction.type === 'ingreso' ? 'text-green-500' : 'text-red-500'
                  )}>
                    {transaction.type === 'ingreso' ? '+' : '-'}{formatCOP(Math.abs(transaction.amount))}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {transaction.is_confirmed ? '✓ Confirmada' : '⏳ Pendiente'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay transacciones</p>
            <p className="text-muted-foreground/70 text-sm">Las transacciones aparecerán aquí automáticamente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
