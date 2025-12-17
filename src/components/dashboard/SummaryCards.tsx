import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCOP } from "@/data/mockData";

interface SummaryCardsProps {
  income: number;
  expenses: number;
  balance: number;
  previousMonthExpenses: number;
}

const SummaryCards = ({ income, expenses, balance, previousMonthExpenses }: SummaryCardsProps) => {
  const hasComparisonData = previousMonthExpenses > 0;
  const percentageChange = hasComparisonData 
    ? Math.round(((expenses - previousMonthExpenses) / previousMonthExpenses) * 100)
    : 0;
  const isSpendingLess = percentageChange < 0;

  const cards = [
    {
      icon: "💰",
      label: "Ingresos",
      value: formatCOP(income),
      colorClass: "text-emerald-400",
      bgClass: "bg-emerald-500/10",
    },
    {
      icon: "💸",
      label: "Gastos",
      value: formatCOP(expenses),
      colorClass: "text-red-400",
      bgClass: "bg-red-500/10",
    },
    {
      icon: "📊",
      label: "Balance",
      value: `${balance >= 0 ? '+' : ''}${formatCOP(balance)}`,
      colorClass: balance >= 0 ? "text-emerald-400" : "text-red-400",
      bgClass: balance >= 0 ? "bg-emerald-500/10" : "bg-red-500/10",
    },
    {
      icon: "🎯",
      label: "vs Mes anterior",
      value: hasComparisonData ? `${percentageChange >= 0 ? '+' : ''}${percentageChange}%` : "—",
      subtext: hasComparisonData 
        ? (isSpendingLess ? "Gastaste menos 🎉" : "Gastaste más 📈")
        : "Sin datos previos",
      colorClass: hasComparisonData 
        ? (isSpendingLess ? "text-emerald-400" : "text-red-400")
        : "text-muted-foreground",
      bgClass: hasComparisonData 
        ? (isSpendingLess ? "bg-emerald-500/10" : "bg-red-500/10")
        : "bg-muted/50",
      trend: hasComparisonData ? (isSpendingLess ? "down" : "up") : null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-2xl p-5 transition-all hover:border-primary/30"
        >
          <div className={`w-12 h-12 ${card.bgClass} rounded-xl flex items-center justify-center mb-3`}>
            <span className="text-2xl">{card.icon}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
          <div className="flex items-center gap-2">
            <p className={`text-xl lg:text-2xl font-bold ${card.colorClass}`}>
              {card.value}
            </p>
            {card.trend && (
              card.trend === "down" ? (
                <TrendingDown className="w-5 h-5 text-emerald-400" />
              ) : (
                <TrendingUp className="w-5 h-5 text-red-400" />
              )
            )}
          </div>
          {card.subtext && (
            <p className="text-xs text-muted-foreground mt-1">{card.subtext}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
