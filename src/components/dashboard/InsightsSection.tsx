import { Insight } from "@/data/mockData";

interface InsightsSectionProps {
  insights: Insight[];
}

const InsightsSection = ({ insights }: InsightsSectionProps) => {
  const getInsightStyles = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-300';
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-300';
      case 'tip':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-300';
      default:
        return 'bg-muted border-border text-muted-foreground';
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <span>💡</span> Insights del mes
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        {insights.slice(0, 4).map((insight, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-4 rounded-xl border ${getInsightStyles(insight.type)} transition-all hover:scale-[1.02]`}
          >
            <span className="text-xl flex-shrink-0">{insight.icon}</span>
            <p className="text-sm leading-relaxed">{insight.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsSection;
