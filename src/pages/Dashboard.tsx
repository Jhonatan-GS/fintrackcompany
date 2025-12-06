import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_DATA } from "@/data/mockData";
import SummaryCards from "@/components/dashboard/SummaryCards";
import InsightsSection from "@/components/dashboard/InsightsSection";
import ExpensesPieChart from "@/components/dashboard/ExpensesPieChart";
import TrendLineChart from "@/components/dashboard/TrendLineChart";
import CategorySummaryTable from "@/components/dashboard/CategorySummaryTable";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import PendingConfirmations from "@/components/dashboard/PendingConfirmations";
import MonthSelector from "@/components/dashboard/MonthSelector";

// ⚠️ TODO: Cambiar MOCK_DATA por datos reales de Supabase cuando estén los flujos N8N

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
                <span className="hidden sm:inline">Cerrar sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header with greeting and month selector */}
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

        {/* Summary Cards */}
        <SummaryCards
          income={MOCK_DATA.summary.income}
          expenses={MOCK_DATA.summary.expenses}
          balance={MOCK_DATA.summary.balance}
          previousMonthExpenses={MOCK_DATA.summary.previousMonthExpenses}
        />

        {/* Pending Confirmations */}
        <PendingConfirmations confirmations={MOCK_DATA.pendingConfirmations} />

        {/* Insights */}
        <InsightsSection insights={MOCK_DATA.insights} />

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          <ExpensesPieChart data={MOCK_DATA.expensesByCategory} />
          <TrendLineChart data={MOCK_DATA.dailyTrend} />
        </div>

        {/* Category Summary Table */}
        <CategorySummaryTable data={MOCK_DATA.categoryComparison} />

        {/* Recent Transactions */}
        <RecentTransactions transactions={MOCK_DATA.transactions} />
      </main>
    </div>
  );
};

export default Dashboard;
