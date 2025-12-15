import { useState, useMemo } from "react";
import { Search, Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboardData, Transaction } from "@/hooks/useDashboardData";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [filter, setFilter] = useState<'all' | 'ingreso' | 'gasto'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = useMemo(() => {
    let result = transactions || [];
    
    if (filter !== 'all') {
      result = result.filter(t => t.type === filter);
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
            variant={filter === 'ingreso' ? 'default' : 'outline'}
            onClick={() => setFilter('ingreso')}
            size="sm"
            className={filter === 'ingreso' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Ingresos
          </Button>
          <Button
            variant={filter === 'gasto' ? 'default' : 'outline'}
            onClick={() => setFilter('gasto')}
            size="sm"
            className={filter === 'gasto' ? 'bg-red-600 hover:bg-red-700' : ''}
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
            {filteredTransactions.map((transaction) => {
              const isIncome = transaction.type === 'ingreso';
              return (
                <div 
                  key={transaction.id} 
                  onClick={() => setSelectedTransaction(transaction)}
                  className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <span className="text-lg">{transaction.categories?.icon || '📦'}</span>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        {transaction.description || transaction.merchant || 'Sin descripción'}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {transaction.categories?.name || 'Sin categoría'} • {formatDate(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-semibold",
                      isIncome ? 'text-green-500' : 'text-red-500'
                    )}>
                      {isIncome ? '+' : '-'}{formatCOP(Math.abs(transaction.amount))}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {transaction.is_confirmed ? '✓ Confirmada' : '⏳ Pendiente'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay transacciones</p>
            <p className="text-muted-foreground/70 text-sm">Las transacciones aparecerán aquí automáticamente</p>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Detalle de Transacción</DialogTitle>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{selectedTransaction.categories?.icon || '📦'}</span>
                <div>
                  <p className="text-foreground text-lg font-medium">
                    {selectedTransaction.description || selectedTransaction.merchant || 'Sin descripción'}
                  </p>
                  <p className={cn(
                    "text-2xl font-bold",
                    selectedTransaction.type === 'ingreso' ? 'text-green-500' : 'text-red-500'
                  )}>
                    {selectedTransaction.type === 'ingreso' ? '+' : '-'}{formatCOP(Math.abs(selectedTransaction.amount))}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Categoría</p>
                  <p className="text-foreground">{selectedTransaction.categories?.name || 'Sin categoría'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tipo</p>
                  <p className="text-foreground capitalize">{selectedTransaction.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Banco</p>
                  <p className="text-foreground">{selectedTransaction.payment_providers?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fecha</p>
                  <p className="text-foreground">{formatDate(selectedTransaction.created_at)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Comercio</p>
                  <p className="text-foreground">{selectedTransaction.merchant || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estado</p>
                  <p className={selectedTransaction.is_confirmed ? 'text-green-500' : 'text-yellow-500'}>
                    {selectedTransaction.is_confirmed ? '✓ Confirmada' : '⏳ Pendiente'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionsPage;
