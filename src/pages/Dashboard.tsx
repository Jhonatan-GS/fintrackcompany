import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";
  const userAvatar = user?.user_metadata?.avatar_url || "";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FinTrack</span>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                <Avatar className="w-9 h-9 border-2 border-primary/20">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={signOut}
                className="border-border hover:bg-muted"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto px-4 py-12">
        {/* Welcome section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-primary/20 text-primary text-3xl font-bold">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            ¡Hola, <span className="text-gradient">{userName}</span>!
          </h1>
          <p className="text-xl text-muted-foreground">
            Bienvenido a tu espacio financiero
          </p>
        </div>

        {/* Construction notice */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 rounded-3xl text-center space-y-6">
            <div className="text-6xl">🚧</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Tu dashboard está en construcción</h2>
              <p className="text-muted-foreground">
                Estamos trabajando en traerte la mejor experiencia para gestionar tus
                finanzas
              </p>
            </div>

            {/* Features coming soon */}
            <div className="grid md:grid-cols-2 gap-4 pt-6">
              <div className="glass-card p-4 rounded-xl">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold mb-1">Gráficas interactivas</h3>
                <p className="text-sm text-muted-foreground">
                  Visualiza tus gastos en tiempo real
                </p>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <div className="text-3xl mb-2">🔄</div>
                <h3 className="font-semibold mb-1">Sincronización automática</h3>
                <p className="text-sm text-muted-foreground">
                  Conecta tu Gmail para importar transacciones
                </p>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-semibold mb-1">Categorización con IA</h3>
                <p className="text-sm text-muted-foreground">
                  IA inteligente que aprende de tus hábitos
                </p>
              </div>
              <div className="glass-card p-4 rounded-xl">
                <div className="text-3xl mb-2">📱</div>
                <h3 className="font-semibold mb-1">Alertas por Telegram</h3>
                <p className="text-sm text-muted-foreground">
                  Notificaciones instantáneas de movimientos
                </p>
              </div>
            </div>

            {/* Placeholder message */}
            <div className="pt-6 border-t border-border">
              <p className="text-muted-foreground">
                Próximamente: Tus transacciones aparecerán aquí
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
