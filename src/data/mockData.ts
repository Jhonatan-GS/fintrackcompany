// ⚠️ TODO: Cambiar MOCK_DATA por datos reales de Supabase cuando estén los flujos N8N
// Buscar "MOCK_DATA" en todo el proyecto para encontrar qué cambiar

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category_id: string;
  category_name: string;
  category_emoji: string;
  provider: string;
  is_confirmed: boolean;
}

export interface PendingConfirmation {
  id: string;
  provider: string;
  amount: number;
  merchant: string;
  suggested_category: string;
  suggested_emoji: string;
  date: string;
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

export interface CategoryComparison {
  category: string;
  emoji: string;
  current: number;
  previous: number;
  change: number;
}

export interface Insight {
  type: 'warning' | 'success' | 'info' | 'tip';
  icon: string;
  message: string;
}

export const MOCK_DATA = {
  // Resumen del mes
  summary: {
    income: 2500000,
    expenses: 1800000,
    balance: 700000,
    previousMonthExpenses: 2050000,
  },
  
  // Transacciones del mes
  transactions: [
    {
      id: "t1",
      merchant: "Rappi",
      amount: -45000,
      date: "2025-12-05T14:30:00",
      category_id: "comida",
      category_name: "Comida",
      category_emoji: "🍔",
      provider: "Nequi",
      is_confirmed: true
    },
    {
      id: "t2",
      merchant: "Nómina Empresa XYZ",
      amount: 2500000,
      date: "2025-12-04T08:00:00",
      category_id: "salario",
      category_name: "Salario",
      category_emoji: "💰",
      provider: "Bancolombia",
      is_confirmed: true
    },
    {
      id: "t3",
      merchant: "Uber",
      amount: -18000,
      date: "2025-12-04T20:00:00",
      category_id: "transporte",
      category_name: "Transporte",
      category_emoji: "🚗",
      provider: "Nequi",
      is_confirmed: true
    },
    {
      id: "t4",
      merchant: "Juan Valdez",
      amount: -12000,
      date: "2025-12-02T09:15:00",
      category_id: "comida",
      category_name: "Comida",
      category_emoji: "☕",
      provider: "Daviplata",
      is_confirmed: true
    },
    {
      id: "t5",
      merchant: "Netflix",
      amount: -38900,
      date: "2025-12-01T00:00:00",
      category_id: "suscripciones",
      category_name: "Suscripciones",
      category_emoji: "📺",
      provider: "Nu Colombia",
      is_confirmed: true
    },
    {
      id: "t6",
      merchant: "Éxito",
      amount: -185000,
      date: "2025-12-03T16:45:00",
      category_id: "supermercado",
      category_name: "Supermercado",
      category_emoji: "🛒",
      provider: "Bancolombia",
      is_confirmed: true
    },
    {
      id: "t7",
      merchant: "EPM Servicios",
      amount: -320000,
      date: "2025-12-01T10:00:00",
      category_id: "vivienda",
      category_name: "Vivienda",
      category_emoji: "🏠",
      provider: "Bancolombia",
      is_confirmed: true
    },
    {
      id: "t8",
      merchant: "Claro Móvil",
      amount: -65000,
      date: "2025-12-01T10:00:00",
      category_id: "tecnologia",
      category_name: "Tecnología",
      category_emoji: "📱",
      provider: "Bancolombia",
      is_confirmed: true
    },
    {
      id: "t9",
      merchant: "Gimnasio SmartFit",
      amount: -89000,
      date: "2025-12-01T00:00:00",
      category_id: "cuidado-personal",
      category_name: "Cuidado Personal",
      category_emoji: "💅",
      provider: "Nequi",
      is_confirmed: true
    },
    {
      id: "t10",
      merchant: "Spotify",
      amount: -16900,
      date: "2025-12-01T00:00:00",
      category_id: "suscripciones",
      category_name: "Suscripciones",
      category_emoji: "🎵",
      provider: "Nu Colombia",
      is_confirmed: true
    }
  ] as Transaction[],
  
  // Pendientes de confirmar
  pendingConfirmations: [
    {
      id: "p1",
      provider: "Bancolombia",
      amount: -85000,
      merchant: "Éxito Calle 80",
      suggested_category: "Supermercado",
      suggested_emoji: "🛒",
      date: "2025-12-05T18:00:00"
    },
    {
      id: "p2",
      provider: "Nequi",
      amount: -23000,
      merchant: "Domicilios App",
      suggested_category: "Comida",
      suggested_emoji: "🍔",
      date: "2025-12-05T13:00:00"
    }
  ] as PendingConfirmation[],
  
  // Gastos por categoría (para gráfica dona)
  expensesByCategory: [
    { name: "Comida", value: 420000, emoji: "🍔", color: "#F59E0B" },
    { name: "Vivienda", value: 385000, emoji: "🏠", color: "#8B5CF6" },
    { name: "Supermercado", value: 270000, emoji: "🛒", color: "#10B981" },
    { name: "Transporte", value: 180000, emoji: "🚗", color: "#3B82F6" },
    { name: "Suscripciones", value: 120800, emoji: "📺", color: "#EC4899" },
    { name: "Cuidado Personal", value: 89000, emoji: "💅", color: "#F472B6" },
    { name: "Tecnología", value: 65000, emoji: "📱", color: "#6366F1" },
    { name: "Otros", value: 270200, emoji: "📦", color: "#6B7280" }
  ] as CategoryExpense[],
  
  // Tendencia diaria (para gráfica línea)
  dailyTrend: [
    { day: "1 Dic", gastos: 529800, ingresos: 0 },
    { day: "2 Dic", gastos: 541800, ingresos: 0 },
    { day: "3 Dic", gastos: 726800, ingresos: 0 },
    { day: "4 Dic", gastos: 744800, ingresos: 2500000 },
    { day: "5 Dic", gastos: 852800, ingresos: 0 }
  ] as DailyTrend[],
  
  // Comparación con mes anterior
  categoryComparison: [
    { category: "Comida", emoji: "🍔", current: 420000, previous: 341000, change: 23 },
    { category: "Vivienda", emoji: "🏠", current: 385000, previous: 385000, change: 0 },
    { category: "Supermercado", emoji: "🛒", current: 270000, previous: 310000, change: -13 },
    { category: "Transporte", emoji: "🚗", current: 180000, previous: 212000, change: -15 },
    { category: "Suscripciones", emoji: "📺", current: 120800, previous: 115000, change: 5 },
    { category: "Cuidado Personal", emoji: "💅", current: 89000, previous: 89000, change: 0 },
    { category: "Tecnología", emoji: "📱", current: 65000, previous: 58000, change: 12 }
  ] as CategoryComparison[],
  
  // Insights calculados
  insights: [
    {
      type: "warning",
      icon: "🔥",
      message: "Gastaste 23% más en Comida que el mes pasado"
    },
    {
      type: "success",
      icon: "✅",
      message: "¡Bien! Transporte bajó un 15% este mes"
    },
    {
      type: "info",
      icon: "👀",
      message: "Llevas 8 compras en Rappi. Tu app favorita del mes."
    },
    {
      type: "tip",
      icon: "💡",
      message: "Ahorraste $250,000 comparado con noviembre. ¡Sigue así!"
    }
  ] as Insight[]
};

// Función helper para formatear moneda colombiana
export const formatCOP = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Función helper para formatear fecha relativa
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return `Hoy ${date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return `Ayer ${date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  }
};
