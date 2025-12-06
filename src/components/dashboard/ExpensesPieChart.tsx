import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CategoryExpense, formatCOP } from "@/data/mockData";

interface ExpensesPieChartProps {
  data: CategoryExpense[];
}

const ExpensesPieChart = ({ data }: ExpensesPieChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.value / total) * 100).toFixed(1);
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-foreground">
            {item.emoji} {item.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatCOP(item.value)} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        🍩 ¿En qué se va tu dinero?
      </h3>
      
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.slice(0, 6).map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(0);
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-foreground truncate">
                {item.emoji} {item.name}
              </span>
              <span className="text-muted-foreground ml-auto">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpensesPieChart;
