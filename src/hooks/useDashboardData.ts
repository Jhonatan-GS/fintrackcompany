import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  type: 'ingreso' | 'gasto';
  merchant: string | null;
  description: string | null;
  created_at: string;
  is_confirmed: boolean;
  category_id: string | null;
  category_name: string | null;
  category_icon: string | null;
  category_color: string | null;
  provider_id: string | null;
  provider_name: string | null;
  reference_number: string | null;
  notes: string | null;
}

export interface CategoryExpense {
  name: string;
  value: number;
  emoji: string;
  color: string;
}

export interface DailyTrend {
  day: string;
  gastos: number;
  ingresos: number;
}

export const useDashboardData = (selectedMonth?: Date) => {
  const { user } = useAuth();
  const currentMonth = selectedMonth || new Date();
  const month = currentMonth.getMonth() + 1; // 1-12
  const year = currentMonth.getFullYear();

  // Fetch transactions using the VIEW (already has JOINs)
  const { data: transactions, isLoading: loadingTransactions, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['transactions', user?.id, month, year],
    queryFn: async () => {
      console.log('Fetching from v_transactions_full for user:', user?.id, 'month:', month, 'year:', year);
      
      const startOfMonth = new Date(year, month - 1, 1).toISOString();
      const endOfMonth = new Date(year, month, 0, 23, 59, 59).toISOString();
      
      const { data, error } = await supabase
        .from('v_transactions_full')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      
      console.log('Transactions fetched:', data?.length, 'records');
      return data as Transaction[];
    },
    enabled: !!user?.id,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
    staleTime: 10000
  });

  // Fetch monthly summary using the VIEW
  const { data: monthlySummary } = useQuery({
    queryKey: ['monthly-summary', user?.id, month, year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_monthly_summary')
        .select('*')
        .eq('user_id', user?.id)
        .eq('month', month)
        .eq('year', year)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching monthly summary:', error);
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch previous month summary for comparison
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  
  const { data: prevMonthlySummary } = useQuery({
    queryKey: ['monthly-summary-prev', user?.id, prevMonth, prevYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_monthly_summary')
        .select('*')
        .eq('user_id', user?.id)
        .eq('month', prevMonth)
        .eq('year', prevYear)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching prev monthly summary:', error);
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch spending by category using the VIEW
  const { data: spendingByCategory } = useQuery({
    queryKey: ['spending-by-category', user?.id, month, year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_spending_by_category')
        .select('*')
        .eq('user_id', user?.id)
        .eq('month', month)
        .eq('year', year)
        .order('total_amount', { ascending: false });
      
      if (error) {
        console.error('Error fetching spending by category:', error);
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch daily balance using the VIEW
  const { data: dailyBalance } = useQuery({
    queryKey: ['daily-balance', user?.id, month, year],
    queryFn: async () => {
      const startOfMonth = new Date(year, month - 1, 1).toISOString().split('T')[0];
      const endOfMonth = new Date(year, month, 0).toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('v_daily_balance')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching daily balance:', error);
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Calculate summary from the monthly summary view
  const summary = useMemo(() => {
    if (monthlySummary) {
      return {
        income: Number(monthlySummary.total_income) || 0,
        expenses: Number(monthlySummary.total_expenses) || 0,
        balance: Number(monthlySummary.balance) || 0,
        previousMonthExpenses: Number(prevMonthlySummary?.total_expenses) || 0
      };
    }
    
    // Fallback: calculate from transactions if view doesn't have data yet
    if (!transactions || transactions.length === 0) {
      return { income: 0, expenses: 0, balance: 0, previousMonthExpenses: 0 };
    }
    
    const income = transactions
      .filter(t => t.type === 'ingreso')
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);
    
    const expenses = transactions
      .filter(t => t.type === 'gasto')
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);
    
    return {
      income,
      expenses,
      balance: income - expenses,
      previousMonthExpenses: Number(prevMonthlySummary?.total_expenses) || 0
    };
  }, [monthlySummary, prevMonthlySummary, transactions]);

  // Format expenses by category for pie chart
  const expensesByCategory = useMemo((): CategoryExpense[] => {
    if (spendingByCategory && spendingByCategory.length > 0) {
      return spendingByCategory.slice(0, 6).map(cat => ({
        name: cat.category_name || 'Otros',
        value: Number(cat.total_amount) || 0,
        emoji: cat.category_icon || '📦',
        color: cat.category_color || '#6B7280'
      }));
    }
    
    // Fallback: calculate from transactions
    if (!transactions) return [];
    
    const categoryMap = new Map<string, CategoryExpense>();
    transactions
      .filter(t => t.type === 'gasto')
      .forEach(t => {
        const catName = t.category_name || 'Otros';
        const current = categoryMap.get(catName) || { 
          name: catName, 
          value: 0, 
          emoji: t.category_icon || '📦',
          color: t.category_color || '#6B7280'
        };
        current.value += Math.abs(Number(t.amount) || 0);
        categoryMap.set(catName, current);
      });
    
    return Array.from(categoryMap.values())
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [spendingByCategory, transactions]);

  // Format daily trend for line chart
  const dailyTrend = useMemo((): DailyTrend[] => {
    if (dailyBalance && dailyBalance.length > 0) {
      return dailyBalance.slice(-7).map(day => ({
        day: new Date(day.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }),
        gastos: Number(day.daily_expenses) || 0,
        ingresos: Number(day.daily_income) || 0
      }));
    }
    
    // Fallback: calculate from transactions
    if (!transactions) return [];
    
    const dailyMap = new Map<string, DailyTrend>();
    transactions.forEach(t => {
      const date = new Date(t.created_at);
      const dayKey = date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
      
      const current = dailyMap.get(dayKey) || { day: dayKey, gastos: 0, ingresos: 0 };
      const amount = Math.abs(Number(t.amount) || 0);
      
      if (t.type === 'gasto') {
        current.gastos += amount;
      } else {
        current.ingresos += amount;
      }
      
      dailyMap.set(dayKey, current);
    });
    
    return Array.from(dailyMap.values()).slice(-7).reverse();
  }, [dailyBalance, transactions]);

  // Category comparison with previous month
  const categoryComparison = useMemo(() => {
    if (!spendingByCategory) return [];
    
    return spendingByCategory.map(cat => ({
      category: cat.category_name || 'Otros',
      emoji: cat.category_icon || '📦',
      current: Number(cat.total_amount) || 0,
      previous: 0,
      change: 0
    }));
  }, [spendingByCategory]);

  // Generate insights
  const insights = useMemo(() => {
    const result: Array<{ type: 'warning' | 'success' | 'info' | 'tip'; icon: string; message: string }> = [];
    
    if (summary.balance > 0) {
      result.push({
        type: 'success',
        icon: '✅',
        message: `¡Bien! Llevas un balance positivo de $${summary.balance.toLocaleString('es-CO')} este mes.`
      });
    } else if (summary.balance < 0) {
      result.push({
        type: 'warning',
        icon: '⚠️',
        message: `Cuidado: Tus gastos superan tus ingresos por $${Math.abs(summary.balance).toLocaleString('es-CO')}`
      });
    }
    
    if (expensesByCategory.length > 0) {
      const topCategory = expensesByCategory[0];
      result.push({
        type: 'info',
        icon: topCategory.emoji,
        message: `Tu mayor gasto es en ${topCategory.name}: $${topCategory.value.toLocaleString('es-CO')}`
      });
    }
    
    if (summary.previousMonthExpenses > 0) {
      const changePercent = Math.round(((summary.expenses - summary.previousMonthExpenses) / summary.previousMonthExpenses) * 100);
      if (changePercent < -10) {
        result.push({
          type: 'success',
          icon: '📉',
          message: `Gastaste ${Math.abs(changePercent)}% menos que el mes pasado. ¡Sigue así!`
        });
      } else if (changePercent > 10) {
        result.push({
          type: 'warning',
          icon: '📈',
          message: `Gastaste ${changePercent}% más que el mes pasado.`
        });
      }
    }
    
    return result.slice(0, 4);
  }, [summary, expensesByCategory]);

  // Pending transactions (not confirmed)
  const pendingTransactions = useMemo(() => {
    return transactions?.filter(t => !t.is_confirmed) || [];
  }, [transactions]);

  // Recent confirmed transactions
  const recentTransactions = useMemo(() => {
    return transactions?.filter(t => t.is_confirmed).slice(0, 10) || [];
  }, [transactions]);

  return {
    transactions,
    summary,
    expensesByCategory,
    dailyTrend,
    categoryComparison,
    insights,
    pendingTransactions,
    recentTransactions,
    isLoading: loadingTransactions,
    refetch,
    lastUpdated: dataUpdatedAt ? new Date(dataUpdatedAt) : null
  };
};
