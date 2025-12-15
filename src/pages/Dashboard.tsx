import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";
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
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const {
    summary,
    expensesByCategory,
    dailyTrend,
    categoryComparison,
    insights,
    pendingTransactions,
    recentTransactions,
    isLoading,
    refetch,
    lastUpdated
  } = useDashboardData(currentMonth);

  const handleRefresh = async () => {
    await refetch();
    toast.success('Datos actualizados');
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";

  // Transform data for components - using view fields
  const formattedPending = pendingTransactions.map(t => ({
    id: t.id,
    provider: t.provider_name || "Banco",
    amount: t.amount,
    merchant: t.description || t.merchant,
    suggested_category: t.category_name || "Otros",
    suggested_emoji: t.category_icon || "📦",
    date: t.created_at
  }));

  const formattedTransactions = recentTransactions.map(t => ({
    id: t.id,
    merchant: t.description || t.merchant,
    amount: t.amount,
    date: t.created_at,
    category_id: t.category_id || "",
    category_name: t.category_name || "Otros",
    category_emoji: t.category_icon || "📦",
    provider: t.provider_name || "Banco",
    is_confirmed: t.is_confirmed,
    type: t.type
  }));

  const isEmpty = recentTransactions.length === 0 && pendingTransactions.length === 0;
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('fintrack_welcome_seen');
    if (!isLoading && isEmpty && !hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, [isLoading, isEmpty]);

  const handleCloseWelcome = () => {
    localStorage.setItem('fintrack_welcome_seen', 'true');
    setShowWelcome(false);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <WelcomeModal open={showWelcome} onClose={handleCloseWelcome} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            👋 ¡Hola, {userName}!
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-muted-foreground">Así va tu mes...</p>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {lastUpdated ? `Actualizado: ${lastUpdated.toLocaleTimeString('es-CO')}` : 'Sincronizando...'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <MonthSelector
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        </div>
      </div>

      {/* Summary Cards */}
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

      {/* Charts Grid */}
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

      {/* Recent Transactions */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-foreground font-medium mb-4">Transacciones Recientes</h3>
        {formattedTransactions.length > 0 ? (
          <RecentTransactions transactions={formattedTransactions} />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Tus transacciones aparecerán aquí</p>
            <p className="text-muted-foreground/70 text-sm mt-1">Sincronización activa cada 30 segundos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
