import { useState, useEffect } from "react";
import { Check, Building2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Provider {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  provider_type: string;
}

interface BankSelectionStepProps {
  userId: string;
  onComplete: (selectedIds: string[]) => void;
  selectedBanks: string[];
  setSelectedBanks: (banks: string[]) => void;
}

export const BankSelectionStep = ({ 
  userId, 
  onComplete, 
  selectedBanks, 
  setSelectedBanks 
}: BankSelectionStepProps) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    const { data, error } = await supabase
      .from('payment_providers')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (!error && data) {
      setProviders(data);
    }
    setLoading(false);
  };

  const toggleBank = (providerId: string) => {
    if (selectedBanks.includes(providerId)) {
      setSelectedBanks(selectedBanks.filter(id => id !== providerId));
    } else {
      setSelectedBanks([...selectedBanks, providerId]);
    }
  };

  const handleContinue = () => {
    if (selectedBanks.length > 0) {
      onComplete(selectedBanks);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-4xl mb-4">🏦</div>
        <h2 className="text-2xl font-bold text-foreground">¿Qué bancos y billeteras usas?</h2>
        <p className="text-muted-foreground">
          Selecciona todos los que uses para que podamos rastrear tus transacciones
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {providers.map((provider) => {
          const isSelected = selectedBanks.includes(provider.id);
          return (
            <button
              key={provider.id}
              onClick={() => toggleBank(provider.id)}
              className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 hover:border-primary/50",
                isSelected 
                  ? "border-primary bg-primary/10" 
                  : "border-border bg-card hover:bg-card/80"
              )}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                {provider.logo_url ? (
                  <img 
                    src={provider.logo_url} 
                    alt={provider.name} 
                    className="w-8 h-8 object-contain"
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <span className="text-sm font-medium text-foreground text-center line-clamp-2">
                {provider.name}
              </span>
            </button>
          );
        })}
      </div>

      {selectedBanks.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Seleccionados: <span className="text-primary font-medium">{selectedBanks.length} banco{selectedBanks.length !== 1 ? 's' : ''}</span>
        </p>
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={handleContinue}
          disabled={selectedBanks.length === 0}
          className={cn(
            "px-6 py-3 rounded-lg font-medium transition-all",
            selectedBanks.length > 0
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          Continuar →
        </button>
      </div>
    </div>
  );
};
