import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

interface DietFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export interface FormData {
  age: number;
  weight: number;
  gender: string;
  dietType: string;
  goal: string;
}

export const DietForm = ({ onSubmit, isLoading }: DietFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    age: 25,
    weight: 70,
    gender: "",
    dietType: "",
    goal: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gender || !formData.dietType || !formData.goal) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <Card className="p-8 bg-gradient-to-b from-card to-card/50 shadow-[var(--shadow-soft)] border-border/50">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Your Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium text-foreground">
              Age (years)
            </Label>
            <Input
              id="age"
              type="number"
              min="10"
              max="100"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
              className="bg-background border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium text-foreground">
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              min="30"
              max="200"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
              className="bg-background border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm font-medium text-foreground">
              Gender
            </Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietType" className="text-sm font-medium text-foreground">
              Diet Preference
            </Label>
            <Select value={formData.dietType} onValueChange={(value) => setFormData({ ...formData, dietType: value })}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select diet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="veg">Vegetarian</SelectItem>
                <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="goal" className="text-sm font-medium text-foreground">
              Your Goal
            </Label>
            <Select value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight-loss">Weight Loss</SelectItem>
                <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          variant="hero"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Generating Your Plan..." : "Generate My Diet Plan"}
        </Button>
      </form>
    </Card>
  );
};
