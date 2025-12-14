import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, LogOut, LayoutDashboard, Receipt, BarChart3, Building2, Settings, MessageCircle } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDashboardData } from "@/hooks/useDashboardData";
import { cn } from "@/lib/utils";
import SummaryCards from "@/components/dashboard/SummaryCards";
import InsightsSection from "@/components/dashboard/InsightsSection";
import ExpensesPieChart from "@/components/dashboard/ExpensesPieChart";
import TrendLineChart from "@/components/dashboard/TrendLineChart";
import CategorySummaryTable from "@/components/dashboard/CategorySummaryTable";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import PendingConfirmations from "@/components/dashboard/PendingConfirmations";
import MonthSelector from "@/components/dashboard/MonthSelector";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import { WelcomeModal } from "@/components/dashboard/WelcomeModal";
import { EmptyChartState } from "@/components/dashboard/EmptyChartState";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Receipt, label: "Transacciones", href: "/transactions" },
  { icon: BarChart3, label: "Reportes", href: "/reports" },
  { icon: Building2, label: "Mis Bancos", href: "/banks" },
  { icon: Settings, label: "Ajustes", href: "/settings" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const {
    summary,
    expensesByCategory,
    dailyTrend,
    categoryComparison,
    insights,
    pendingTransactions,
    recentTransactions,
    isLoading
  } = useDashboardData(currentMonth);

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";
  const userAvatar = user?.user_metadata?.avatar_url || "";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  // Transform data for components
  const formattedPending = pendingTransactions.map(t => ({
    id: t.id,
    provider: t.payment_providers?.name || "Banco",
    amount: t.amount,
    merchant: t.merchant,
    suggested_category: t.categories?.name || "Otros",
    suggested_emoji: t.categories?.icon || "📦",
    date: t.transaction_date
  }));

  const formattedTransactions = recentTransactions.map(t => ({
    id: t.id,
    merchant: t.merchant,
    amount: t.amount,
    date: t.transaction_date,
    category_id: t.category_id || "",
    category_name: t.categories?.name || "Otros",
    category_emoji: t.categories?.icon || "📦",
    provider: t.payment_providers?.name || "Banco",
    is_confirmed: t.is_confirmed
  }));

  const isEmpty = recentTransactions.length === 0 && pendingTransactions.length === 0;
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!isLoading && isEmpty) {
      setShowWelcome(true);
    }
  }, [isLoading, isEmpty]);

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
          {isLoading ? (
            <DashboardSkeleton />
          ) : (
            <div className="space-y-6">
              {/* Welcome Modal for empty state */}
              <WelcomeModal open={showWelcome} onClose={() => setShowWelcome(false)} />

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    👋 ¡Hola, {userName}!
                  </h1>
                  <p className="text-muted-foreground">Así va tu mes...</p>
                </div>
                <MonthSelector
                  currentMonth={currentMonth}
                  onMonthChange={setCurrentMonth}
                />
              </div>

              {/* Summary Cards - Always visible */}
              <SummaryCards
                income={summary.income}
                expenses={summary.expenses}
                balance={summary.balance}
                previousMonthExpenses={summary.previousMonthExpenses}
              />

              {/* Pending Confirmations */}
              {formattedPending.length > 0 && (
                <PendingConfirmations confirmations={formattedPending} />
              )}

              {/* Insights */}
              {insights.length > 0 && <InsightsSection insights={insights} />}

              {/* Charts Grid - Always visible with empty states */}
              <div className="grid lg:grid-cols-2 gap-6">
                {expensesByCategory.length > 0 ? (
                  <ExpensesPieChart data={expensesByCategory} />
                ) : (
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-foreground font-medium mb-4">Gastos por Categoría</h3>
                    <EmptyChartState message="Las gráficas aparecerán aquí" />
                  </div>
                )}
                {dailyTrend.length > 0 ? (
                  <TrendLineChart data={dailyTrend} />
                ) : (
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-foreground font-medium mb-4">Tendencia del Mes</h3>
                    <EmptyChartState message="Verás tu tendencia de gastos aquí" />
                  </div>
                )}
              </div>

              {/* Category Summary Table */}
              {categoryComparison.length > 0 && (
                <CategorySummaryTable data={categoryComparison} />
              )}

              {/* Recent Transactions - Always visible */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-foreground font-medium mb-4">Transacciones Recientes</h3>
                {formattedTransactions.length > 0 ? (
                  <RecentTransactions transactions={formattedTransactions} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Tus transacciones aparecerán aquí</p>
                    <p className="text-muted-foreground/70 text-sm mt-1">Sincronización activa cada 5 minutos</p>
                  </div>
                )}
              </div>
            </div>
          )}
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
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-foreground text-background text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            ¿Tienes feedback? 💬
          </div>
          
          {/* Button */}
          <div className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#22c55e] shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          
          {/* Pulse */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
        </div>
      </a>
    </div>
  );
};

export default Dashboard;
