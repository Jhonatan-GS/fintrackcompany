import { Check, X, Pencil } from "lucide-react";
import { PendingConfirmation, formatCOP, formatRelativeDate } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PendingConfirmationsProps {
  confirmations: PendingConfirmation[];
}

const PendingConfirmations = ({ confirmations }: PendingConfirmationsProps) => {
  const handleConfirm = (id: string) => {
    // ⚠️ TODO: Conectar con Supabase
    toast.success("Transacción confirmada");
  };

  const handleReject = (id: string) => {
    // ⚠️ TODO: Conectar con Supabase
    toast.info("Transacción rechazada");
  };

  const handleChangeCategory = (id: string) => {
    // ⚠️ TODO: Abrir modal para cambiar categoría
    toast.info("Próximamente: Cambiar categoría");
  };

  if (confirmations.length === 0) {
    return (
      <div className="bg-card border border-emerald-500/30 rounded-2xl p-5">
        <div className="text-center py-4">
          <span className="text-4xl mb-3 block">✅</span>
          <p className="text-foreground font-medium">¡Todo al día!</p>
          <p className="text-sm text-muted-foreground">
            No tienes transacciones pendientes de confirmar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-orange-500/30 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">⏳</span>
        <h3 className="text-lg font-semibold text-foreground">
          Pendientes de Confirmar
        </h3>
        <span className="bg-orange-500/20 text-orange-400 text-xs font-medium px-2 py-1 rounded-full">
          {confirmations.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {confirmations.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-xl">
                  {item.suggested_emoji}
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.merchant}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.provider} • {formatRelativeDate(item.date)}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-foreground">
                {formatCOP(item.amount)}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Sugerencia: <span className="text-orange-400">{item.suggested_category}</span>
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => handleChangeCategory(item.id)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => handleReject(item.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                  onClick={() => handleConfirm(item.id)}
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingConfirmations;
