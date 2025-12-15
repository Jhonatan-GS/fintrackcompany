import { useState, useEffect } from "react";
import { Plus, Building2, Trash2, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentProvider {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

interface UserProvider {
  id: string;
  provider_id: string;
  payment_providers: PaymentProvider;
}

const BanksPage = () => {
  const { user } = useAuth();
  const [userBanks, setUserBanks] = useState<UserProvider[]>([]);
  const [availableBanks, setAvailableBanks] = useState<PaymentProvider[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());

  const handleImageError = (bankId: string) => {
    setFailedLogos(prev => new Set(prev).add(bankId));
  };

  useEffect(() => {
    console.log('User:', user);
    console.log('User ID:', user?.id);
    if (user?.id) {
      fetchUserBanks();
      fetchAvailableBanks();
    }
  }, [user?.id]);

  const fetchUserBanks = async () => {
    console.log('Fetching user banks for:', user?.id);
    const { data, error } = await supabase
      .from('user_providers')
      .select(`
        id,
        provider_id,
        payment_providers:provider_id (id, name, slug, logo_url)
      `)
      .eq('user_id', user?.id)
      .eq('is_active', true);
    
    console.log('User banks data:', data);
    console.log('User banks error:', error);
    
    if (!error && data) {
      setUserBanks(data as unknown as UserProvider[]);
    }
    setLoading(false);
  };

  const fetchAvailableBanks = async () => {
    console.log('Fetching available banks...');
    const { data, error } = await supabase
      .from('payment_providers')
      .select('*')
      .eq('is_active', true);
    
    console.log('Available banks data:', data);
    console.log('Available banks error:', error);
    
    if (!error && data) {
      setAvailableBanks(data);
    }
  };

  const handleAddBank = async (bank: PaymentProvider) => {
    if (userBanks.find(b => b.provider_id === bank.id)) {
      toast.error('Este banco ya está conectado');
      return;
    }

    const { error } = await supabase
      .from('user_providers')
      .insert({
        user_id: user?.id,
        provider_id: bank.id,
        is_active: true
      });

    if (error) {
      console.error('Error adding bank:', error);
      toast.error('Error al conectar banco');
      return;
    }

    await fetchUserBanks();
    setShowAddModal(false);
    toast.success(`${bank.name} conectado`);
  };

  const handleRemoveBank = async (userProviderId: string) => {
    const { error } = await supabase
      .from('user_providers')
      .update({ is_active: false })
      .eq('id', userProviderId);

    if (error) {
      console.error('Error removing bank:', error);
      toast.error('Error al desconectar banco');
      return;
    }

    await fetchUserBanks();
    toast.success('Banco desconectado');
  };

  const availableToAdd = availableBanks.filter(
    b => !userBanks.find(ub => ub.provider_id === b.id)
  );

  const getBankEmoji = (slug: string) => {
    const emojis: Record<string, string> = {
      bancolombia: '🏦',
      nequi: '💜',
      daviplata: '🔴',
      nu: '💜',
      lulo: '🟡',
      rappipay: '🧡',
      bbva: '🔵',
      bancodebogota: '🏛️',
    };
    return emojis[slug] || '🏦';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mis Bancos</h1>
            <p className="text-muted-foreground">Administra tus bancos conectados</p>
          </div>
        </div>
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 h-20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis Bancos</h1>
          <p className="text-muted-foreground">Administra tus bancos conectados</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar banco
        </Button>
      </div>

      {/* Bancos conectados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userBanks.length > 0 ? (
          userBanks.map((bank) => (
            <div 
              key={bank.id}
              className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                {bank.payment_providers?.logo_url && !failedLogos.has(bank.id) ? (
                  <img 
                    src={bank.payment_providers.logo_url} 
                    alt={bank.payment_providers?.name} 
                    className="w-8 h-8 object-contain"
                    onError={() => handleImageError(bank.id)}
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-foreground font-medium">{bank.payment_providers?.name}</p>
                <p className="text-muted-foreground text-sm">Conectado</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleRemoveBank(bank.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-card border border-border rounded-2xl p-12 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tienes bancos conectados</p>
            <Button 
              className="mt-4"
              onClick={() => setShowAddModal(true)}
            >
              Agregar mi primer banco
            </Button>
          </div>
        )}
      </div>

      {/* Modal para agregar banco */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Agregar banco</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {availableToAdd.map((bank) => (
              <button
                key={bank.id}
                onClick={() => handleAddBank(bank)}
                className="p-4 rounded-xl border border-border hover:border-primary bg-muted/50 hover:bg-muted transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mb-2">
                  {bank.logo_url && !failedLogos.has(bank.id) ? (
                    <img 
                      src={bank.logo_url} 
                      alt={bank.name} 
                      className="w-7 h-7 object-contain"
                      onError={() => handleImageError(bank.id)}
                    />
                  ) : (
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <span className="text-foreground text-sm font-medium">{bank.name}</span>
              </button>
            ))}
            {availableToAdd.length === 0 && (
              <p className="col-span-2 text-muted-foreground text-center py-4">
                {availableBanks.length === 0 
                  ? 'No hay bancos disponibles' 
                  : 'Ya tienes todos los bancos conectados'}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BanksPage;
