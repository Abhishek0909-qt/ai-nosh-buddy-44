import { Card } from "@/components/ui/card";
import { Coffee, Sun, Moon } from "lucide-react";

interface MealCardProps {
  mealTime: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const getMealIcon = (mealTime: string) => {
  const time = mealTime.toLowerCase();
  if (time.includes("breakfast")) return <Coffee className="h-5 w-5 text-accent" />;
  if (time.includes("lunch")) return <Sun className="h-5 w-5 text-accent" />;
  return <Moon className="h-5 w-5 text-accent" />;
};

export const MealCard = ({ mealTime, name, calories, protein, carbs, fats }: MealCardProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-[var(--shadow-soft)] border-border/50 hover:shadow-[var(--shadow-glow)] transition-all duration-300">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-accent/10 rounded-lg">
          {getMealIcon(mealTime)}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {mealTime}
          </h3>
          <p className="text-lg font-bold text-foreground mt-1">{name}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-border/50">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Calories</p>
          <p className="text-sm font-bold text-foreground">{calories}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Protein</p>
          <p className="text-sm font-bold text-primary">{protein}g</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Carbs</p>
          <p className="text-sm font-bold text-foreground">{carbs}g</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Fats</p>
          <p className="text-sm font-bold text-foreground">{fats}g</p>
        </div>
      </div>
    </Card>
  );
};
