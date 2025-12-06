import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CategoryComparison, formatCOP } from "@/data/mockData";

interface CategorySummaryTableProps {
  data: CategoryComparison[];
}

const CategorySummaryTable = ({ data }: CategorySummaryTableProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        📅 Resumen por Categoría
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground border-b border-border">
              <th className="pb-3 font-medium">Categoría</th>
              <th className="pb-3 font-medium text-right">Gastado</th>
              <th className="pb-3 font-medium text-right">vs Anterior</th>
              <th className="pb-3 font-medium text-center">Tendencia</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="py-3">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-foreground">{item.category}</span>
                  </span>
                </td>
                <td className="py-3 text-right text-foreground font-medium">
                  {formatCOP(item.current)}
                </td>
                <td className="py-3 text-right">
                  <span
                    className={`font-medium ${
                      item.change > 0
                        ? "text-red-400"
                        : item.change < 0
                        ? "text-emerald-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.change > 0 ? "+" : ""}
                    {item.change}%
                  </span>
                </td>
                <td className="py-3 text-center">
                  {item.change > 0 ? (
                    <TrendingUp className="w-5 h-5 text-red-400 mx-auto" />
                  ) : item.change < 0 ? (
                    <TrendingDown className="w-5 h-5 text-emerald-400 mx-auto" />
                  ) : (
                    <Minus className="w-5 h-5 text-muted-foreground mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategorySummaryTable;
