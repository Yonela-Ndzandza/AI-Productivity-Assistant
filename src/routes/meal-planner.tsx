import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { AIOutput } from "@/components/common/AIOutput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UtensilsCrossed, Sparkles, Coffee, Salad, Moon, Apple } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { generateAIText } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/meal-planner")({
  head: () => ({
    meta: [
      { title: "AI Meal Planner — GlowFlow AI" },
      {
        name: "description",
        content:
          "Get a personalized 7-day gut-friendly, anti-inflammatory meal plan tailored to your cycle.",
      },
      { property: "og:title", content: "AI Meal Planner — GlowFlow AI" },
      { property: "og:description", content: "7-day meal plans personalized to your cycle." },
    ],
  }),
  component: MealPlannerPage,
});

type Day = {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
};
type Plan = { days: Day[]; shoppingList: string[]; nutritionNotes: string };

const icons = { breakfast: Coffee, lunch: Salad, dinner: Moon, snack: Apple };

function MealPlannerPage() {
  const generate = useServerFn(generateAIText);
  const [diet, setDiet] = useState("Omnivore");
  const [cycle, setCycle] = useState("Luteal");
  const [severity, setSeverity] = useState("Mild");
  const [cookTime, setCookTime] = useState([30]);
  const [budget, setBudget] = useState("Medium");
  const [age, setAge] = useState("28");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      const { text } = await generate({
        data: {
          system:
            'Create an anti-inflammatory, gut-friendly 7-day meal plan for a woman managing hormonal acne. Reply ONLY as JSON: {"days":[{"day":"Monday","breakfast":string,"lunch":string,"dinner":string,"snack":string}, ...7 items], "shoppingList": string[], "nutritionNotes": string}. Keep each meal name under 12 words. Prioritize fermented foods, omega-3s, low-glycemic carbs, and cycle-phase appropriate nutrients.',
          prompt: `Age: ${age}, Diet: ${diet}, Cycle phase: ${cycle}, Acne severity: ${severity}, Max cook time: ${cookTime[0]} min, Budget: ${budget}`,
          temperature: 0.7,
        },
      });
      setPlan(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={<UtensilsCrossed className="h-5 w-5" />}
        title="AI Meal Planner"
        description="Personalized 7-day meal plans tuned to your cycle and skin goals."
      />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Diet</Label>
                <Select value={diet} onValueChange={setDiet}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Omnivore", "Vegetarian", "Vegan", "Gluten Free", "Pescatarian"].map(
                      (d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cycle phase</Label>
              <Select value={cycle} onValueChange={setCycle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Menstrual", "Follicular", "Ovulatory", "Luteal"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Acne severity</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Clear", "Mild", "Moderate", "Severe"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Max cook time: {cookTime[0]} min</Label>
              <Slider
                value={cookTime}
                onValueChange={setCookTime}
                min={10}
                max={90}
                step={5}
              />
            </div>
            <div className="space-y-2">
              <Label>Budget</Label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Low", "Medium", "High"].map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full bg-gradient-primary text-primary-foreground shadow-glow"
              onClick={run}
              disabled={loading}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Generating..." : "Generate 7-day plan"}
            </Button>
          </CardContent>
        </Card>

        <AIOutput
          title="Your personalized plan"
          loading={loading}
          text={plan ? JSON.stringify(plan) : undefined}
          onRegenerate={plan ? run : undefined}
          empty="Set your preferences and generate a 7-day plan."
        >
          {plan && (
            <div className="space-y-4">
              <div className="grid gap-3">
                {plan.days.map((d) => (
                  <div
                    key={d.day}
                    className="rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="font-display font-semibold">{d.day}</div>
                      <Badge variant="secondary" className="text-[10px]">
                        4 meals
                      </Badge>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {(["breakfast", "lunch", "dinner", "snack"] as const).map((k) => {
                        const Icon = icons[k];
                        return (
                          <div
                            key={k}
                            className="flex items-start gap-2 rounded-xl bg-gradient-soft p-2.5"
                          >
                            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <div className="min-w-0">
                              <div className="text-[10px] font-medium uppercase text-muted-foreground">
                                {k}
                              </div>
                              <div className="text-sm">{d[k]}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-border bg-gradient-soft p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  Shopping list
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {plan.shoppingList.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-gradient-soft p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  Nutrition notes
                </div>
                <p className="text-sm leading-relaxed">{plan.nutritionNotes}</p>
              </div>
            </div>
          )}
        </AIOutput>
      </div>
    </AppShell>
  );
}
