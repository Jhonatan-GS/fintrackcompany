import { BarChart3 } from "lucide-react";

interface EmptyChartStateProps {
  message: string;
}

export const EmptyChartState = ({ message }: EmptyChartStateProps) => (
  <div className="h-48 flex flex-col items-center justify-center text-center">
    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
      <BarChart3 className="w-6 h-6 text-muted-foreground" />
    </div>
    <p className="text-muted-foreground text-sm">{message}</p>
  </div>
);
