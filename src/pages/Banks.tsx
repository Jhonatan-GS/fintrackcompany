import { useState } from "react";
import { Plus, Building2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock data for Colombian banks
const AVAILABLE_BANKS = [
  { id: '1', name: 'Bancolombia', slug: 'bancolombia', logo: '🏦' },
  { id: '2', name: 'Nequi', slug: 'nequi', logo: '💜' },
  { id: '3', name: 'Daviplata', slug: 'daviplata', logo: '🔴' },
  { id: '4', name: 'Nu Colombia', slug: 'nu', logo: '💜' },
  { id: '5', name: 'Lulo Bank', slug: 'lulo', logo: '🟡' },
  { id: '6', name: 'Rappipay', slug: 'rappipay', logo: '🧡' },
  { id: '7', name: 'BBVA', slug: 'bbva', logo: '🔵' },
  { id: '8', name: 'Banco de Bogotá', slug: 'bancodebogota', logo: '🏛️' },
];

const BanksPage = () => {
  const [userBanks, setUserBanks] = useState<typeof AVAILABLE_BANKS>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddBank = (bank: typeof AVAILABLE_BANKS[0]) => {
    if (userBanks.find(b => b.id === bank.id)) {
      toast.error('Este banco ya está conectado');
      return;
    }
    setUserBanks([...userBanks, bank]);
    setShowAddModal(false);
    toast.success(`${bank.name} conectado`);
  };

  const handleRemoveBank = (bankId: string) => {
    setUserBanks(userBanks.filter(b => b.id !== bankId));
    toast.success('Banco desconectado');
  };

  const availableToAdd = AVAILABLE_BANKS.filter(b => !userBanks.find(ub => ub.id === b.id));

  return (
    <div className="p-4 md:p-6 space-y-6">
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
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                {bank.logo}
              </div>
              <div className="flex-1">
                <p className="text-foreground font-medium">{bank.name}</p>
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
                <span className="text-2xl block mb-2">{bank.logo}</span>
                <span className="text-foreground text-sm font-medium">{bank.name}</span>
              </button>
            ))}
            {availableToAdd.length === 0 && (
              <p className="col-span-2 text-muted-foreground text-center py-4">
                Ya tienes todos los bancos conectados
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BanksPage;
