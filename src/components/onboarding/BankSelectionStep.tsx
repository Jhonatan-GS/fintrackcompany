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

// Fallback logos from Clearbit
const BANK_LOGO_FALLBACKS: Record<string, string> = {
  'bancolombia': 'https://logo.clearbit.com/bancolombia.com',
  'nequi': 'https://logo.clearbit.com/nequi.com.co',
  'daviplata': 'https://logo.clearbit.com/davivienda.com',
  'nu-colombia': 'https://logo.clearbit.com/nubank.com.br',
  'nu': 'https://logo.clearbit.com/nubank.com.br',
  'lulo-bank': 'https://logo.clearbit.com/lulobank.com',
  'lulo': 'https://logo.clearbit.com/lulobank.com',
  'rappipay': 'https://logo.clearbit.com/rappi.com',
  'bbva': 'https://logo.clearbit.com/bbva.com',
  'davivienda': 'https://logo.clearbit.com/davivienda.com',
  'banco-bogota': 'https://logo.clearbit.com/bancodebogota.com',
  'banco-de-bogota': 'https://logo.clearbit.com/bancodebogota.com',
  'caja-social': 'https://logo.clearbit.com/bancocajasocial.com',
  'banco-caja-social': 'https://logo.clearbit.com/bancocajasocial.com',
  'scotiabank-colpatria': 'https://logo.clearbit.com/scotiabankcolpatria.com',
  'colpatria': 'https://logo.clearbit.com/scotiabankcolpatria.com',
};

const getBankLogo = (provider: Provider): string | null => {
  if (provider.logo_url) return provider.logo_url;
  
  const slug = provider.slug.toLowerCase();
  return BANK_LOGO_FALLBACKS[slug] || null;
};

export const BankSelectionStep = ({ 
  userId, 
  onComplete, 
  selectedBanks, 
  setSelectedBanks 
}: BankSelectionStepProps) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());

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

  const handleImageError = (providerId: string) => {
    setFailedLogos(prev => new Set(prev).add(providerId));
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
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="text-4xl mb-4">🏦</div>
        <h2 className="text-2xl font-bold text-foreground">Selecciona tus bancos</h2>
        <p className="text-muted-foreground">
          Elige los bancos de los que recibes notificaciones por email.
          <br />
          <span className="text-primary">Puedes seleccionar varios.</span>
        </p>
      </div>

      {/* Selection indicator */}
      <div className="flex items-center justify-center">
        <div className={cn(
          "px-4 py-2 rounded-full text-sm transition-all",
          selectedBanks.length > 0 
            ? "bg-primary/20 text-primary" 
            : "bg-muted text-muted-foreground"
        )}>
          {selectedBanks.length === 0 
            ? "👆 Toca para seleccionar" 
            : `✓ ${selectedBanks.length} banco${selectedBanks.length > 1 ? 's' : ''} seleccionado${selectedBanks.length > 1 ? 's' : ''}`
          }
        </div>
      </div>

      {/* Banks grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {providers.map((provider) => {
          const isSelected = selectedBanks.includes(provider.id);
          const logoUrl = getBankLogo(provider);
          const showFallbackIcon = !logoUrl || failedLogos.has(provider.id);
          
          return (
            <button
              key={provider.id}
              onClick={() => toggleBank(provider.id)}
              className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                "hover:scale-105 hover:shadow-lg",
                isSelected 
                  ? "border-primary bg-primary/10 shadow-primary/20" 
                  : "border-border bg-card hover:border-muted-foreground/50"
              )}
            >
              {/* Checkmark */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-scale-in">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              
              {/* Logo container */}
              <div className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center mb-3">
                {showFallbackIcon ? (
                  <Building2 className="w-8 h-8 text-muted-foreground" />
                ) : (
                  <img 
                    src={logoUrl!} 
                    alt={provider.name}
                    className="max-w-full max-h-full object-contain"
                    onError={() => handleImageError(provider.id)}
                  />
                )}
              </div>
              
              {/* Bank name */}
              <span className={cn(
                "text-sm font-medium text-center line-clamp-2 transition-colors",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {provider.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Info message */}
      <p className="text-center text-muted-foreground text-sm">
        💡 Solo leeremos los correos de notificaciones bancarias, nada más.
      </p>

      {/* Continue button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleContinue}
          disabled={selectedBanks.length === 0}
          className={cn(
            "px-6 py-3 rounded-lg font-medium transition-all",
            selectedBanks.length > 0
              ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          Continuar →
        </button>
      </div>
    </div>
  );
};
