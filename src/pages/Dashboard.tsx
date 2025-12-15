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
    isLoading
  } = useDashboardData(currentMonth);

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";

  // Debug log
  useEffect(() => {
    console.log('Dashboard - User:', user);
    console.log('Dashboard - User ID:', user?.id);
  }, [user]);

  // Transform data for components
  const formattedPending = pendingTransactions.map(t => ({
    id: t.id,
    provider: t.payment_providers?.name || "Banco",
    amount: t.amount,
    merchant: t.merchant,
    suggested_category: t.categories?.name || "Otros",
    suggested_emoji: t.categories?.icon || "📦",
    date: t.created_at
  }));

  const formattedTransactions = recentTransactions.map(t => ({
    id: t.id,
    merchant: t.merchant,
    amount: t.amount,
    date: t.created_at,
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

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
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
  );
};

export default Dashboard;
