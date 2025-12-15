import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingDown, Calendar, Tag } from "lucide-react";

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const Reports = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('month');
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  // Calculate date ranges for filtering
  const startOfMonthDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const endOfMonthDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`;
  const startOfMonth = `${startOfMonthDate}T00:00:00.000Z`;
  const endOfMonth = `${endOfMonthDate}T23:59:59.999Z`;

  // Fetch all transactions for the month to calculate all data
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['reports-transactions', user?.id, month, year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_transactions_full')
        .select('*')
        .eq('user_id', user?.id)
        .gte('email_received_at', startOfMonth)
        .lte('email_received_at', endOfMonth);
      
      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      console.log('Transactions for reports:', data);
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch daily balance for bar chart
  const { data: dailyBalance } = useQuery({
    queryKey: ['reports-daily', user?.id, month, year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_daily_balance')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', startOfMonthDate)
        .lte('date', endOfMonthDate)
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching daily balance:', error);
        throw error;
      }
      console.log('Daily balance data:', data);
      return data;
    },
    enabled: !!user?.id
  });

  // Calculate all metrics from transactions
  let totalExpenses = 0;
  const categoryMap = new Map<string, {
    category_name: string;
    icon: string;
    color: string;
    total: number;
  }>();

  if (transactionsData && transactionsData.length > 0) {
    transactionsData.forEach(row => {
      if (row.type === 'expense') {
        const amount = Math.abs(Number(row.amount)) || 0;
        totalExpenses += amount;
        
        const catName = row.category_name || 'Otros';
        const existing = categoryMap.get(catName);
        if (existing) {
          existing.total += amount;
        } else {
          categoryMap.set(catName, {
            category_name: catName,
            icon: row.category_icon || '📦',
            color: row.category_color || '#6B7280',
            total: amount
          });
        }
      }
    });
  }

  // Convert to array and sort
  const spendingByCategory = Array.from(categoryMap.values())
    .sort((a, b) => b.total - a.total);

  const daysInMonth = new Date(year, month, 0).getDate();
  const currentDayOfMonth = Math.min(currentDate.getDate(), daysInMonth);
  const dailyAverage = currentDayOfMonth > 0 ? totalExpenses / currentDayOfMonth : 0;
  const topCategory = spendingByCategory[0]?.category_name || 'Sin datos';

  const chartData = spendingByCategory.map(cat => ({
    name: cat.category_name,
    value: cat.total,
    emoji: cat.icon,
    color: cat.color
  }));

  const barData = dailyBalance?.map(day => ({
    date: new Date(day.date).toLocaleDateString('es-CO', { day: 'numeric' }),
    gastos: Number(day.total_expense) || 0,
    ingresos: Number(day.total_income) || 0
  })) || [];


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
          <p className="text-muted-foreground">Análisis detallado de tus finanzas</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40 bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Esta semana</SelectItem>
            <SelectItem value="month">Este mes</SelectItem>
            <SelectItem value="year">Este año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Total Gastado</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCOP(totalExpenses)}</p>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Promedio Diario</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatCOP(dailyAverage)}</p>
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Tag className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground text-sm">Categoría Top</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{topCategory}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-foreground font-medium mb-4">Gastos por Categoría</h3>
          {chartData.length > 0 ? (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatCOP(value)}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {chartData.slice(0, 6).map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-foreground truncate">{item.emoji} {item.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Sin datos para mostrar
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-foreground font-medium mb-4">Evolución del Gasto</h3>
          {barData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => formatCOP(value)}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="gastos" fill="#EF4444" radius={[4, 4, 0, 0]} name="Gastos" />
                  <Bar dataKey="ingresos" fill="#10B981" radius={[4, 4, 0, 0]} name="Ingresos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Sin datos para mostrar
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="text-foreground font-medium mb-4">Desglose por Categoría</h3>
        {spendingByCategory && spendingByCategory.length > 0 ? (
          <div className="space-y-3">
            {spendingByCategory.map((cat, index) => {
              const catTotal = Number(cat.total) || 0;
              const percentage = totalExpenses > 0 ? (catTotal / totalExpenses) * 100 : 0;
              return (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-2xl w-8">{cat.icon || '📦'}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-foreground">{cat.category_name}</span>
                      <span className="text-muted-foreground">{formatCOP(catTotal)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: cat.color || '#6B7280'
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-muted-foreground text-sm w-12 text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">Sin categorías para mostrar</p>
        )}
      </div>
    </div>
  );
};

export default Reports;
