import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, LogOut, LayoutDashboard, Receipt, BarChart3, Building2, Settings, MessageCircle, Shield, Tags } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Receipt, label: "Transacciones", href: "/transactions" },
  { icon: BarChart3, label: "Reportes", href: "/reports" },
  { icon: Building2, label: "Mis Bancos", href: "/banks" },
  { icon: Tags, label: "Categorías", href: "/categories" },
  { icon: Settings, label: "Ajustes", href: "/settings" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [isAdmin, setIsAdmin] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";
  const userAvatar = user?.user_metadata?.avatar_url || "";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.id) return;
      console.log('Checking admin role for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      console.log('Admin check result:', data, error);
      setIsAdmin(!!data);
    };
    checkAdmin();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-40">
          {/* Logo */}
          <div className="p-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FinTrack</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            
            {/* Admin link */}
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  location.pathname === "/admin"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Admin</span>
              </Link>
            )}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer">
              <Avatar className="w-10 h-10 border-2 border-primary/20">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={signOut}
              className="w-full mt-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={cn("flex-1 min-h-screen", !isMobile && "ml-64")}>
        {/* Mobile Header */}
        {isMobile && (
          <nav className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
            <div className="px-4">
              <div className="flex items-center justify-between h-16">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">FinTrack</span>
                </Link>
                <Avatar className="w-9 h-9 border-2 border-primary/20">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </nav>
        )}

        {/* Content */}
        <div className={cn("p-4 sm:p-6 lg:p-8", isMobile && "pb-24")}>
          {children}
        </div>

        {/* Mobile Bottom Nav */}
        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-2 z-40">
            <div className="flex justify-around">
              {navItems.slice(0, 4).map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-xs">{item.label.split(" ")[0]}</span>
                  </Link>
                );
              })}
              <button
                onClick={signOut}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-xs">Salir</span>
              </button>
            </div>
          </nav>
        )}
      </main>

      {/* Feedback Button */}
      <a
        href="https://wa.me/573001234567?text=Hola!%20Tengo%20feedback%20sobre%20FinTrack"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
        style={{ bottom: isMobile ? "5rem" : "1.5rem" }}
      >
        <div className="relative">
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-foreground text-background text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            ¿Tienes feedback? 💬
          </div>
          <div className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#22c55e] shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        </div>
      </a>
    </div>
  );
};

export default DashboardLayout;
