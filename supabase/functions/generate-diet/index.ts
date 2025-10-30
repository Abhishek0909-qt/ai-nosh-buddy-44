// Edge function for generating personalized diet plans

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DietRequest {
  age: number;
  weight: number;
  height: number;
  gender: string;
  dietType: string;
  goal: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { age, weight, height, gender, dietType, goal }: DietRequest = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Calculate BMR using Harris-Benedict Formula
    let bmr: number;
    if (gender === "male") {
      bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else {
      bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }

    // Adjust calories based on goal
    let targetCalories: number;
    if (goal === "weight-loss") {
      targetCalories = Math.round(bmr * 0.8);
    } else if (goal === "muscle-gain") {
      targetCalories = Math.round(bmr * 1.15);
    } else {
      targetCalories = Math.round(bmr * 1.0);
    }

    const dietTypeText = dietType === "veg" ? "vegetarian" : "non-vegetarian";
    const goalText = goal.replace("-", " ");

    const randomSeed = Math.random();
    const prompt = `Generate a unique and varied daily meal plan for ${goalText} with the following specifications:
- Total daily calories: ${targetCalories}
- Diet type: ${dietTypeText}
- User: ${age} years old, ${weight}kg, ${height}cm, ${gender}
- Random seed: ${randomSeed} (use this to ensure variety)

IMPORTANT: Create DIFFERENT meal combinations each time. Avoid repeating the same meals.
Provide EXACTLY 3 meals (Breakfast, Lunch, Dinner) with realistic portions and varied options.
Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "goal": "${goalText}",
  "total_calories": ${targetCalories},
  "meals": [
    {
      "meal_time": "Breakfast",
      "name": "specific meal name",
      "calories": number,
      "protein_g": number,
      "carbs_g": number,
      "fats_g": number
    },
    {
      "meal_time": "Lunch",
      "name": "specific meal name",
      "calories": number,
      "protein_g": number,
      "carbs_g": number,
      "fats_g": number
    },
    {
      "meal_time": "Dinner",
      "name": "specific meal name",
      "calories": number,
      "protein_g": number,
      "carbs_g": number,
      "fats_g": number
    }
  ],
  "summary": "brief summary of the plan"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a professional nutritionist. Always return valid JSON only, no markdown formatting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API returned ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices?.[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Clean up the response - remove markdown code blocks if present
    aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const mealPlan = JSON.parse(aiResponse);

    return new Response(JSON.stringify(mealPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-diet:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
