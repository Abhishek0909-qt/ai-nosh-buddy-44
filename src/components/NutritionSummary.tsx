import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

interface NutritionSummaryProps {
  goal: string;
  totalCalories: number;
  summary: string;
  bmi?: number;
}

export const NutritionSummary = ({ goal, totalCalories, summary, bmi }: NutritionSummaryProps) => {
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: "Underweight", color: "text-yellow-600" };
    if (bmi < 25) return { text: "Normal", color: "text-green-600" };
    if (bmi < 30) return { text: "Overweight", color: "text-orange-600" };
    return { text: "Obese", color: "text-red-600" };
  };
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
          <div className="flex items-center gap-4 mb-2">
            <p className="text-2xl font-bold text-primary">{totalCalories} calories/day</p>
            {bmi && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">BMI:</span>
                <span className={`text-lg font-bold ${getBMICategory(bmi).color}`}>
                  {bmi.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({getBMICategory(bmi).text})
                </span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      </div>
    </Card>
  );
};
