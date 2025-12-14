import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // TODO: Implement save to database when tables are ready
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    toast.success('Cambios guardados');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ajustes</h1>
        <p className="text-muted-foreground">Configura tu cuenta</p>
      </div>

      {/* Perfil */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
        <h3 className="text-foreground font-medium">Perfil</h3>
        
        <div className="flex items-center gap-4">
          <img 
            src={user?.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=059669&color=fff'}
            className="w-16 h-16 rounded-full"
            alt={user?.user_metadata?.full_name || 'Usuario'}
          />
          <div>
            <p className="text-foreground font-medium">{user?.user_metadata?.full_name || 'Usuario'}</p>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-muted-foreground text-sm mb-2 block">Nombre completo</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-muted/50 border-border"
            />
          </div>
          <div>
            <label className="text-muted-foreground text-sm mb-2 block">WhatsApp</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+57 300 123 4567"
              className="bg-muted/50 border-border"
            />
            {phone && (
              <p className="text-yellow-500 text-xs mt-1">
                ⚠️ Número no verificado
              </p>
            )}
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>

      {/* Cuenta */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="text-foreground font-medium">Cuenta</h3>
        
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="text-foreground">Email</p>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            Verificado
          </Badge>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <div>
            <p className="text-foreground">Gmail conectado</p>
            <p className="text-muted-foreground text-sm">Para sincronizar transacciones</p>
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            Conectado
          </Badge>
        </div>

        <Button 
          variant="outline" 
          className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 mt-4"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
