import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  type: 'income' | 'expense';
  merchant: string | null;
  description: string | null;
  email_received_at: string;
  is_confirmed: boolean;
  category_id: string | null;
  category_name: string | null;
  category_icon: string | null;
  category_color: string | null;
  provider_id: string | null;
  provider_name: string | null;
  reference_number: string | null;
  location: string | null;
  ai_confidence_score: number | null;
  suggested_category_name: string | null;
  created_at: string;
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

  // Calculate date ranges for filtering
  const startOfMonth = new Date(year, month - 1, 1).toISOString();
  const endOfMonth = new Date(year, month, 0, 23, 59, 59).toISOString();
  const startOfMonthDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endOfMonthDate = new Date(year, month, 0).toISOString().split('T')[0];

  // Previous month dates
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevStartOfMonth = new Date(prevYear, prevMonth - 1, 1).toISOString();
  const prevEndOfMonth = new Date(prevYear, prevMonth, 0, 23, 59, 59).toISOString();

  // Fetch transactions using the VIEW (already has JOINs)
  const { data: transactions, isLoading: loadingTransactions, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['transactions', user?.id, month, year],
    queryFn: async () => {
      console.log('Fetching from v_transactions_full for user:', user?.id, 'month:', month, 'year:', year);
      
      const { data, error } = await supabase
        .from('v_transactions_full')
        .select('*')
        .eq('user_id', user?.id)
        .gte('email_received_at', startOfMonth)
        .lte('email_received_at', endOfMonth)
        .order('email_received_at', { ascending: false });
      
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

  // Fetch monthly summary using the VIEW (filter by month timestamp range)
  const { data: monthlySummaryData } = useQuery({
    queryKey: ['monthly-summary', user?.id, month, year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_monthly_summary')
        .select('*')
        .eq('user_id', user?.id)
        .gte('month', startOfMonth)
        .lt('month', endOfMonth);
      
      if (error) {
        console.error('Error fetching monthly summary:', error);
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch previous month summary for comparison
  const { data: prevMonthlySummaryData } = useQuery({
    queryKey: ['monthly-summary-prev', user?.id, prevMonth, prevYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_monthly_summary')
        .select('*')
        .eq('user_id', user?.id)
        .gte('month', prevStartOfMonth)
        .lt('month', prevEndOfMonth);
      
      if (error) {
        console.error('Error fetching prev monthly summary:', error);
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch spending by category using the VIEW (filter by month timestamp range)
  const { data: spendingByCategory } = useQuery({
    queryKey: ['spending-by-category', user?.id, month, year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('v_spending_by_category')
        .select('*')
        .eq('user_id', user?.id)
        .gte('month', startOfMonth)
        .lt('month', endOfMonth)
        .order('total', { ascending: false });
      
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
      const { data, error } = await supabase
        .from('v_daily_balance')
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', startOfMonthDate)
        .lte('date', endOfMonthDate)
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
    // Aggregate monthly summary data (may have multiple rows for income/expense types)
    if (monthlySummaryData && monthlySummaryData.length > 0) {
      let income = 0;
      let expenses = 0;
      
      monthlySummaryData.forEach(row => {
        if (row.type === 'income') {
          income += Number(row.total_amount) || 0;
        } else if (row.type === 'expense') {
          expenses += Number(row.total_amount) || 0;
        }
      });

      let prevExpenses = 0;
      if (prevMonthlySummaryData && prevMonthlySummaryData.length > 0) {
        prevMonthlySummaryData.forEach(row => {
          if (row.type === 'expense') {
            prevExpenses += Number(row.total_amount) || 0;
          }
        });
      }
      
      return {
        income,
        expenses,
        balance: income - expenses,
        previousMonthExpenses: prevExpenses
      };
    }
    
    // Fallback: calculate from transactions if view doesn't have data yet
    if (!transactions || transactions.length === 0) {
      return { income: 0, expenses: 0, balance: 0, previousMonthExpenses: 0 };
    }
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);

    let prevExpenses = 0;
    if (prevMonthlySummaryData && prevMonthlySummaryData.length > 0) {
      prevMonthlySummaryData.forEach(row => {
        if (row.type === 'expense') {
          prevExpenses += Number(row.total_amount) || 0;
        }
      });
    }
    
    return {
      income,
      expenses,
      balance: income - expenses,
      previousMonthExpenses: prevExpenses
    };
  }, [monthlySummaryData, prevMonthlySummaryData, transactions]);

  // Format expenses by category for pie chart
  const expensesByCategory = useMemo((): CategoryExpense[] => {
    if (spendingByCategory && spendingByCategory.length > 0) {
      return spendingByCategory.slice(0, 6).map(cat => ({
        name: cat.category_name || 'Otros',
        value: Number(cat.total) || 0,
        emoji: cat.icon || '📦',
        color: cat.color || '#6B7280'
      }));
    }
    
    // Fallback: calculate from transactions
    if (!transactions) return [];
    
    const categoryMap = new Map<string, CategoryExpense>();
    transactions
      .filter(t => t.type === 'expense')
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
        gastos: Number(day.total_expense) || 0,
        ingresos: Number(day.total_income) || 0
      }));
    }
    
    // Fallback: calculate from transactions
    if (!transactions) return [];
    
    const dailyMap = new Map<string, DailyTrend>();
    transactions.forEach(t => {
      const date = new Date(t.email_received_at);
      const dayKey = date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
      
      const current = dailyMap.get(dayKey) || { day: dayKey, gastos: 0, ingresos: 0 };
      const amount = Math.abs(Number(t.amount) || 0);
      
      if (t.type === 'expense') {
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
      emoji: cat.icon || '📦',
      current: Number(cat.total) || 0,
      previous: 0,
      change: 0
    }));
  }, [spendingByCategory]);

  // Generate insights (all in Spanish)
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
