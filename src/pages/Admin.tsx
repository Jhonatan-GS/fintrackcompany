import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, ArrowLeft, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WaitlistEntry {
  id: string;
  email: string;
  full_name: string | null;
  reason: string | null;
  status: string;
  created_at: string;
  approved_at: string | null;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const StatCard = ({ label, value, icon: Icon, color }: StatCardProps) => (
  <div className="bg-card border border-border rounded-2xl p-4">
    <div className="flex items-center gap-3">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
    </div>
  </div>
);

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminRole();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchWaitlist();
    }
  }, [isAdmin, filter]);

  const checkAdminRole = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const { data, error } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (error || !data) {
      navigate('/dashboard');
      return;
    }

    setIsAdmin(true);
  };

  const fetchWaitlist = async () => {
    setLoading(true);
    
    let query = supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filter !== 'all') {
      query = query.eq('status', filter);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching waitlist:', error);
      toast.error('Error al cargar la lista');
    } else {
      setWaitlist(data || []);
    }
    
    setLoading(false);
  };

  const handleApprove = async (entry: WaitlistEntry) => {
    // 1. Actualizar estado en waitlist
    const { error: waitlistError } = await supabase
      .from('waitlist')
      .update({ 
        status: 'approved', 
        approved_at: new Date().toISOString(),
        approved_by: user?.id 
      })
      .eq('id', entry.id);

    if (waitlistError) {
      toast.error('Error al aprobar');
      console.error(waitlistError);
      return;
    }

    // 2. Actualizar access_approved en la tabla users si el usuario ya existe
    const { error: userError } = await supabase
      .from('users')
      .update({ access_approved: true })
      .eq('email', entry.email);

    if (userError) {
      console.error('Error actualizando acceso del usuario:', userError);
      // No es crítico si falla - el usuario puede no existir aún
    }
    
    toast.success(`${entry.full_name || entry.email} ha sido aprobado`);
    fetchWaitlist();
  };

  const handleReject = async (entry: WaitlistEntry) => {
    // 1. Actualizar estado en waitlist
    const { error: waitlistError } = await supabase
      .from('waitlist')
      .update({ status: 'rejected' })
      .eq('id', entry.id);

    if (waitlistError) {
      toast.error('Error al rechazar');
      console.error(waitlistError);
      return;
    }

    // 2. Revocar acceso en la tabla users si el usuario existe
    const { error: userError } = await supabase
      .from('users')
      .update({ access_approved: false })
      .eq('email', entry.email);

    if (userError) {
      console.error('Error revocando acceso del usuario:', userError);
    }
    
    toast.success(`${entry.full_name || entry.email} ha sido rechazado`);
    fetchWaitlist();
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = {
    pending: waitlist.filter(w => w.status === 'pending').length,
    approved: waitlist.filter(w => w.status === 'approved').length,
    rejected: waitlist.filter(w => w.status === 'rejected').length,
    total: waitlist.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Panel de Admin</h1>
          <p className="text-muted-foreground">Gestiona la lista de espera</p>
        </div>
      </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            label="Pendientes" 
            value={stats.pending} 
            icon={Clock}
            color="bg-yellow-500/20 text-yellow-400"
          />
          <StatCard 
            label="Aprobados" 
            value={stats.approved} 
            icon={CheckCircle}
            color="bg-green-500/20 text-green-400"
          />
          <StatCard 
            label="Rechazados" 
            value={stats.rejected} 
            icon={XCircle}
            color="bg-red-500/20 text-red-400"
          />
          <StatCard 
            label="Total" 
            value={stats.total} 
            icon={Users}
            color="bg-primary/20 text-primary"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'pending', label: 'Pendientes' },
            { key: 'approved', label: 'Aprobados' },
            { key: 'rejected', label: 'Rechazados' }
          ].map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? 'default' : 'outline'}
              onClick={() => setFilter(f.key)}
              size="sm"
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Cargando...</div>
          ) : waitlist.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No hay registros</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-muted-foreground font-medium">Usuario</th>
                    <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Razón</th>
                    <th className="text-left p-4 text-muted-foreground font-medium hidden sm:table-cell">Fecha</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Estado</th>
                    <th className="text-right p-4 text-muted-foreground font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {waitlist.map((entry) => (
                    <tr key={entry.id} className="hover:bg-muted/30">
                      <td className="p-4">
                        <p className="text-foreground font-medium">{entry.full_name || 'Sin nombre'}</p>
                        <p className="text-muted-foreground text-sm">{entry.email}</p>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm max-w-xs truncate hidden md:table-cell">
                        {entry.reason || '-'}
                      </td>
                      <td className="p-4 text-muted-foreground text-sm hidden sm:table-cell">
                        {new Date(entry.created_at).toLocaleDateString('es-CO')}
                      </td>
                      <td className="p-4">
                        <Badge className={cn(
                          entry.status === 'pending' && 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                          entry.status === 'approved' && 'bg-green-500/20 text-green-400 border-green-500/30',
                          entry.status === 'rejected' && 'bg-red-500/20 text-red-400 border-red-500/30'
                        )}>
                          {entry.status === 'pending' ? 'Pendiente' : entry.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        {entry.status === 'pending' && (
                          <div className="flex gap-2 justify-end">
                            <Button 
                              size="sm" 
                              onClick={() => handleApprove(entry)}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-destructive/50 text-destructive hover:bg-destructive/10"
                              onClick={() => handleReject(entry)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
};

export default AdminPage;
