import { useState } from "react";
import { DietForm, FormData } from "@/components/DietForm";
import { MealCard } from "@/components/MealCard";
import { NutritionSummary } from "@/components/NutritionSummary";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Meal {
  meal_time: string;
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
}

interface MealPlan {
  goal: string;
  total_calories: number;
  meals: Meal[];
  summary: string;
}

const Index = () => {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<FormData | null>(null);
  const { toast } = useToast();

  const generatePlan = async (formData: FormData) => {
    setIsLoading(true);
    setCurrentFormData(formData);
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-diet", {
        body: formData,
      });

      if (error) throw error;
      
      setMealPlan(data);
      toast({
        title: "Success!",
        description: "Your personalized meal plan is ready.",
      });
    } catch (error) {
      console.error("Error generating meal plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAnother = () => {
    if (currentFormData) {
      generatePlan(currentFormData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4 border-b border-border/50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            AI Diet & Nutrition Assistant
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get personalized meal plans tailored to your goals, powered by AI
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <DietForm onSubmit={generatePlan} isLoading={isLoading} />

          {mealPlan && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <NutritionSummary
                goal={mealPlan.goal}
                totalCalories={mealPlan.total_calories}
                summary={mealPlan.summary}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mealPlan.meals.map((meal, index) => (
                  <MealCard
                    key={index}
                    mealTime={meal.meal_time}
                    name={meal.name}
                    calories={meal.calories}
                    protein={meal.protein_g}
                    carbs={meal.carbs_g}
                    fats={meal.fats_g}
                  />
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleShowAnother}
                  disabled={isLoading}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Show Another Meal Plan
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
