import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowRight } from "lucide-react";
import { MOCK_DATA } from "@/data/mockData";
import SummaryCards from "@/components/dashboard/SummaryCards";
import InsightsSection from "@/components/dashboard/InsightsSection";
import ExpensesPieChart from "@/components/dashboard/ExpensesPieChart";
import TrendLineChart from "@/components/dashboard/TrendLineChart";
import CategorySummaryTable from "@/components/dashboard/CategorySummaryTable";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import MonthSelector from "@/components/dashboard/MonthSelector";

const Demo = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner */}
      <div className="bg-primary text-primary-foreground text-center py-3 px-4">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="text-sm sm:text-base">
            🎯 Estás viendo una demostración con datos de ejemplo
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/login")}
            className="ml-2"
          >
            Comenzar gratis
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Navbar */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FinTrack</span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-2">Demo</span>
            </div>

            <Button
              onClick={() => navigate("/login")}
              className="bg-primary hover:bg-primary/90"
            >
              Comenzar gratis
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              👋 ¡Hola, Usuario Demo!
            </h1>
            <p className="text-muted-foreground">Así se ve tu dashboard con datos reales</p>
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

        {/* CTA at bottom */}
        <div className="glass-card rounded-2xl p-8 text-center space-y-4 mt-8">
          <h2 className="text-2xl font-bold text-foreground">
            ¿Te gusta lo que ves?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Conecta tu cuenta de Google y empieza a rastrear tus finanzas automáticamente.
            Es gratis y solo toma 2 minutos.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/login")}
            className="bg-primary hover:bg-primary/90 glow-primary"
          >
            Comenzar gratis con Google
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Demo;
