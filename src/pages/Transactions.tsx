import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Receipt } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.abs(value));
};

// Translate type for display in Spanish
const translateType = (type: 'income' | 'expense'): string => {
  return type === 'income' ? 'Ingreso' : 'Gasto';
};

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  merchant: string | null;
  description: string | null;
  email_received_at: string;
  is_confirmed: boolean;
  category_id: string | null;
  category_name: string | null;
  category_icon: string | null;
  category_color: string | null;
  provider_id: string | null;
  provider_name: string | null;
  reference_number: string | null;
  location: string | null;
}

const Transactions = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['all-transactions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_transactions_full')
        .select('*')
        .eq('user_id', user?.id)
        .order('email_received_at', { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user?.id
  });

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    
    let result = transactions;
    
    if (filter !== 'all') {
      result = result.filter(t => t.type === filter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.description?.toLowerCase().includes(term) ||
        t.merchant?.toLowerCase().includes(term) ||
        t.category_name?.toLowerCase().includes(term) ||
        t.provider_name?.toLowerCase().includes(term)
      );
    }
    
    return result;
  }, [transactions, filter, searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transacciones</h1>
        <p className="text-muted-foreground">Historial completo de movimientos</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transacción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border"
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

      {/* Transactions List */}
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
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium">No hay transacciones</p>
            <p className="text-muted-foreground text-sm">Las transacciones aparecerán aquí</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              
              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTransaction(tx)}
                  className="p-4 hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <span className="text-lg">{tx.category_icon || '📦'}</span>
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        {tx.description || tx.merchant || 'Sin descripción'}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {tx.provider_name || 'Sin banco'} • {new Date(tx.email_received_at).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-semibold",
                      isIncome ? "text-green-500" : "text-red-500"
                    )}>
                      {isIncome ? '+' : '-'}{formatCOP(tx.amount)}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {tx.is_confirmed ? '✓ Confirmada' : '⏳ Pendiente'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Detalle de Transacción</DialogTitle>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
                  <span className="text-3xl">{selectedTransaction.category_icon || '📦'}</span>
                </div>
                <div>
                  <p className="text-foreground font-medium text-lg">
                    {selectedTransaction.description || selectedTransaction.merchant || 'Sin descripción'}
                  </p>
                  <p className={cn(
                    "text-2xl font-bold",
                    selectedTransaction.type === 'income' ? "text-green-500" : "text-red-500"
                  )}>
                    {selectedTransaction.type === 'income' ? '+' : '-'}{formatCOP(selectedTransaction.amount)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Categoría</p>
                  <p className="text-foreground">{selectedTransaction.category_name || 'Sin categoría'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tipo</p>
                  <p className="text-foreground">{translateType(selectedTransaction.type)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Banco</p>
                  <p className="text-foreground">{selectedTransaction.provider_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fecha</p>
                  <p className="text-foreground">
                    {new Date(selectedTransaction.email_received_at).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                {selectedTransaction.merchant && (
                  <div>
                    <p className="text-muted-foreground">Comercio</p>
                    <p className="text-foreground">{selectedTransaction.merchant}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Estado</p>
                  <p className={selectedTransaction.is_confirmed ? 'text-green-500' : 'text-yellow-500'}>
                    {selectedTransaction.is_confirmed ? '✓ Confirmada' : '⏳ Pendiente'}
                  </p>
                </div>
                {selectedTransaction.reference_number && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Referencia</p>
                    <p className="text-foreground font-mono text-xs">{selectedTransaction.reference_number}</p>
                  </div>
                )}
                {selectedTransaction.location && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Ubicación</p>
                    <p className="text-foreground">{selectedTransaction.location}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
