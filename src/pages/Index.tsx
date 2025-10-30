import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DietForm, FormData } from "@/components/DietForm";
import { MealCard } from "@/components/MealCard";
import { NutritionSummary } from "@/components/NutritionSummary";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

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
  const [user, setUser] = useState<User | null>(null);
  const [bmi, setBmi] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const generatePlan = async (formData: FormData) => {
    setIsLoading(true);
    setCurrentFormData(formData);
    
    // Calculate BMI
    const heightInMeters = formData.height / 100;
    const calculatedBmi = formData.weight / (heightInMeters * heightInMeters);
    setBmi(calculatedBmi);
    
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4 border-b border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              AI Diet & Nutrition Assistant
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get personalized meal plans tailored to your goals, powered by AI
            </p>
          </div>
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
                bmi={bmi ?? undefined}
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
