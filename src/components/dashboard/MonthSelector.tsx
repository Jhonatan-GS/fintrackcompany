import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthSelectorProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

const MonthSelector = ({ currentMonth, onMonthChange }: MonthSelectorProps) => {
  const monthName = currentMonth.toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric",
  });

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const isCurrentMonth = 
    currentMonth.getMonth() === new Date().getMonth() &&
    currentMonth.getFullYear() === new Date().getFullYear();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={goToPreviousMonth}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-foreground font-medium capitalize min-w-[140px] text-center">
        {monthName}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={goToNextMonth}
        disabled={isCurrentMonth}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default MonthSelector;
