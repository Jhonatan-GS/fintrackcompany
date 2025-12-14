import { useState } from "react";
import { TrendingDown, Calendar, Tag } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboardData } from "@/hooks/useDashboardData";
import ExpensesPieChart from "@/components/dashboard/ExpensesPieChart";
import { EmptyChartState } from "@/components/dashboard/EmptyChartState";

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

interface StatCardProps {
  label: string;
  value: number | string;
  trend?: number;
  icon: React.ElementType;
  isText?: boolean;
}

const StatCard = ({ label, value, trend, icon: Icon, isText }: StatCardProps) => (
  <div className="bg-card border border-border rounded-2xl p-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <span className="text-muted-foreground text-sm">{label}</span>
    </div>
    <p className="text-foreground text-xl font-bold">
      {isText ? value : formatCOP(value as number)}
    </p>
    {trend !== undefined && (
      <p className={`text-sm ${trend < 0 ? 'text-green-500' : 'text-red-500'}`}>
        {trend < 0 ? '↓' : '↑'} {Math.abs(trend)}% vs mes anterior
      </p>
    )}
  </div>
);

const ReportsPage = () => {
  const { summary, expensesByCategory, recentTransactions, isLoading } = useDashboardData();
  const [period, setPeriod] = useState('month');

  const totalExpenses = summary?.expenses || 0;
  const daysInPeriod = period === 'week' ? 7 : period === 'month' ? 30 : 365;
  const dailyAverage = totalExpenses / daysInPeriod;
  const topCategory = expensesByCategory?.[0]?.name || 'Sin datos';

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
          <p className="text-muted-foreground">Análisis detallado de tus finanzas</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40 bg-muted/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Esta semana</SelectItem>
            <SelectItem value="month">Este mes</SelectItem>
            <SelectItem value="year">Este año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Total Gastado" 
          value={totalExpenses} 
          trend={-12}
          icon={TrendingDown}
        />
        <StatCard 
          label="Promedio Diario" 
          value={dailyAverage}
          icon={Calendar}
        />
        <StatCard 
          label="Categoría Top" 
          value={topCategory}
          isText
          icon={Tag}
        />
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-foreground font-medium mb-4">Gastos por Categoría</h3>
          {expensesByCategory && expensesByCategory.length > 0 ? (
            <ExpensesPieChart data={expensesByCategory} />
          ) : (
            <EmptyChartState message="Sin datos para mostrar" />
          )}
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-foreground font-medium mb-4">Evolución del Gasto</h3>
          {recentTransactions && recentTransactions.length > 0 ? (
            <EmptyChartState message="Gráfico de barras próximamente" />
          ) : (
            <EmptyChartState message="Sin datos para mostrar" />
          )}
        </div>
      </div>

      {/* Tabla de categorías */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="text-foreground font-medium mb-4">Desglose por Categoría</h3>
        {expensesByCategory && expensesByCategory.length > 0 ? (
          <div className="space-y-4">
            {expensesByCategory.map((cat, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-2xl">{cat.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-foreground">{cat.name}</span>
                    <span className="text-muted-foreground">{formatCOP(cat.value)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-primary"
                      style={{ 
                        width: `${(cat.value / (expensesByCategory[0]?.value || 1)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">Sin categorías para mostrar</p>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
