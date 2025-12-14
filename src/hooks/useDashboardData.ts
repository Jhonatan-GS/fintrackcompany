import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  merchant: string;
  description: string | null;
  transaction_date: string;
  type: 'ingreso' | 'gasto';
  is_confirmed: boolean;
  category_id: string | null;
  provider_id: string | null;
  categories?: {
    name: string;
    icon: string;
    color: string;
  } | null;
  payment_providers?: {
    name: string;
  } | null;
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
  
  // Get start and end of month
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0, 23, 59, 59);
  
  // Get previous month for comparison
  const startOfPrevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0, 23, 59, 59);

  // Fetch current month transactions
  const { data: transactions, isLoading: loadingTransactions } = useQuery({
    queryKey: ['transactions', user?.id, startOfMonth.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (name, icon, color),
          payment_providers (name)
        `)
        .eq('user_id', user?.id)
        .gte('transaction_date', startOfMonth.toISOString())
        .lte('transaction_date', endOfMonth.toISOString())
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user?.id
  });

  // Fetch previous month expenses for comparison
  const { data: prevMonthTransactions } = useQuery({
    queryKey: ['transactions-prev', user?.id, startOfPrevMonth.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, type, category_id, categories (name)')
        .eq('user_id', user?.id)
        .eq('type', 'gasto')
        .gte('transaction_date', startOfPrevMonth.toISOString())
        .lte('transaction_date', endOfPrevMonth.toISOString());
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Calculate summary
  const summary = useMemo(() => {
    if (!transactions) return { income: 0, expenses: 0, balance: 0, previousMonthExpenses: 0 };
    
    const income = transactions
      .filter(t => t.type === 'ingreso')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const expenses = transactions
      .filter(t => t.type === 'gasto')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const previousMonthExpenses = prevMonthTransactions
      ?.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
    
    return {
      income,
      expenses,
      balance: income - expenses,
      previousMonthExpenses
    };
  }, [transactions, prevMonthTransactions]);

  // Expenses by category (for pie chart)
  const expensesByCategory = useMemo((): CategoryExpense[] => {
    if (!transactions) return [];
    
    const categoryMap = new Map<string, CategoryExpense>();
    transactions
      .filter(t => t.type === 'gasto')
      .forEach(t => {
        const catName = t.categories?.name || 'Otros';
        const current = categoryMap.get(catName) || { 
          name: catName, 
          value: 0, 
          emoji: t.categories?.icon || '📦',
          color: t.categories?.color || '#6B7280'
        };
        current.value += Math.abs(t.amount);
        categoryMap.set(catName, current);
      });
    
    return Array.from(categoryMap.values())
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  // Daily trend for line chart
  const dailyTrend = useMemo((): DailyTrend[] => {
    if (!transactions) return [];
    
    const dailyMap = new Map<string, DailyTrend>();
    
    // Get last 7 days or days with data
    transactions.forEach(t => {
      const date = new Date(t.transaction_date);
      const dayKey = date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
      
      const current = dailyMap.get(dayKey) || { day: dayKey, gastos: 0, ingresos: 0 };
      
      if (t.type === 'gasto') {
        current.gastos += Math.abs(t.amount);
      } else {
        current.ingresos += Math.abs(t.amount);
      }
      
      dailyMap.set(dayKey, current);
    });
    
    return Array.from(dailyMap.values()).slice(0, 7).reverse();
  }, [transactions]);

  // Category comparison with previous month
  const categoryComparison = useMemo(() => {
    if (!transactions) return [];
    
    const currentByCategory = new Map<string, { emoji: string; current: number }>();
    const prevByCategory = new Map<string, number>();
    
    transactions
      .filter(t => t.type === 'gasto')
      .forEach(t => {
        const catName = t.categories?.name || 'Otros';
        const current = currentByCategory.get(catName) || { emoji: t.categories?.icon || '📦', current: 0 };
        current.current += Math.abs(t.amount);
        currentByCategory.set(catName, current);
      });
    
    prevMonthTransactions?.forEach((t: any) => {
      const catName = t.categories?.name || 'Otros';
      prevByCategory.set(catName, (prevByCategory.get(catName) || 0) + Math.abs(t.amount));
    });
    
    return Array.from(currentByCategory.entries()).map(([category, data]) => {
      const previous = prevByCategory.get(category) || 0;
      const change = previous > 0 ? Math.round(((data.current - previous) / previous) * 100) : 0;
      
      return {
        category,
        emoji: data.emoji,
        current: data.current,
        previous,
        change
      };
    }).sort((a, b) => b.current - a.current);
  }, [transactions, prevMonthTransactions]);

  // Generate insights
  const insights = useMemo(() => {
    const result: Array<{ type: 'warning' | 'success' | 'info' | 'tip'; icon: string; message: string }> = [];
    
    if (categoryComparison.length > 0) {
      // Find category with highest increase
      const highestIncrease = categoryComparison.find(c => c.change > 20);
      if (highestIncrease) {
        result.push({
          type: 'warning',
          icon: '🔥',
          message: `Gastaste ${highestIncrease.change}% más en ${highestIncrease.category} que el mes pasado`
        });
      }
      
      // Find category with decrease
      const decreased = categoryComparison.find(c => c.change < -10);
      if (decreased) {
        result.push({
          type: 'success',
          icon: '✅',
          message: `¡Bien! ${decreased.category} bajó un ${Math.abs(decreased.change)}% este mes`
        });
      }
    }
    
    // Savings insight
    if (summary.balance > 0) {
      result.push({
        type: 'tip',
        icon: '💡',
        message: `Llevas un balance positivo de $${summary.balance.toLocaleString('es-CO')} este mes. ¡Sigue así!`
      });
    }
    
    return result.slice(0, 4);
  }, [categoryComparison, summary]);

  // Pending transactions
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
    isLoading: loadingTransactions
  };
};
