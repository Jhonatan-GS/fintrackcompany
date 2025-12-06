import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { DailyTrend, formatCOP } from "@/data/mockData";

interface TrendLineChartProps {
  data: DailyTrend[];
}

const TrendLineChart = ({ data }: TrendLineChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === "gastos" ? "Gastos" : "Ingresos"}: {formatCOP(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        📈 Tendencia del Mes
      </h3>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
            <XAxis
              dataKey="day"
              stroke="#6B7280"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <YAxis
              stroke="#6B7280"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="gastos"
              stroke="#EF4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGastos)"
            />
            <Area
              type="monotone"
              dataKey="ingresos"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorIngresos)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-muted-foreground">Gastos acumulados</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-muted-foreground">Ingresos</span>
        </div>
      </div>
    </div>
  );
};

export default TrendLineChart;
