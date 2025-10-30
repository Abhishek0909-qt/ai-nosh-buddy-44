import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

interface NutritionSummaryProps {
  goal: string;
  totalCalories: number;
  summary: string;
}

export const NutritionSummary = ({ goal, totalCalories, summary }: NutritionSummaryProps) => {
  return (
    <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/20 rounded-lg">
          <Target className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-foreground">Your Plan Summary</h3>
            <div className="px-4 py-1 bg-primary/20 rounded-full">
              <span className="text-sm font-semibold text-primary">{goal}</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-primary mb-2">{totalCalories} calories/day</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      </div>
    </Card>
  );
};
