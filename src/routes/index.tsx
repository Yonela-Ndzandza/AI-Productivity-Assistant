import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  TrendingUp,
  Droplets,
  Salad,
  Sun,
  Moon,
  Coffee,
  Apple,
  ArrowUpRight,
  Camera,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — GlowFlow AI" },
      {
        name: "description",
        content:
          "Your daily overview: wellness score, meal plan, tasks, and AI recommendations.",
      },
      { property: "og:title", content: "Dashboard — GlowFlow AI" },
      {
        property: "og:description",
        content: "Productivity and wellness at a glance.",
      },
    ],
  }),
  component: DashboardPage,
});

const trend = [
  { day: "Mon", score: 68, flare: 2 },
  { day: "Tue", score: 71, flare: 2 },
  { day: "Wed", score: 74, flare: 1 },
  { day: "Thu", score: 78, flare: 1 },
  { day: "Fri", score: 80, flare: 1 },
  { day: "Sat", score: 79, flare: 1 },
  { day: "Sun", score: 82, flare: 0 },
];

const meals = [
  {
    slot: "Breakfast",
    name: "Kefir & berry overnight oats",
    icon: Coffee,
    tag: "Gut-friendly",
  },
  { slot: "Lunch", name: "Salmon quinoa bowl", icon: Salad, tag: "Omega-3" },
  { slot: "Dinner", name: "Miso-glazed tofu & greens", icon: Moon, tag: "Fermented" },
  { slot: "Snack", name: "Almonds & dark chocolate", icon: Apple, tag: "Low-GI" },
];

const initialTasks = [
  { id: 1, label: "Team meeting — 10:00", done: true },
  { id: 2, label: "Reply to client emails", done: true },
  { id: 3, label: "Finish quarterly report", done: false },
  { id: 4, label: "Meal prep for tomorrow", done: false },
  { id: 5, label: "Grocery shopping", done: false },
];

const recs = [
  {
    title: "Try adding kefir to breakfast",
    desc: "Fermented foods support your gut lining during your luteal phase.",
  },
  {
    title: "Prep tomorrow's lunch tonight",
    desc: "Batch cook quinoa and roast veggies to stay ahead of the day.",
  },
  {
    title: "Hydrate — you're at 4/8 glasses",
    desc: "Add a pinch of sea salt and lemon to speed absorption.",
  },
];

function DashboardPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const done = tasks.filter((t) => t.done).length;

  return (
    <AppShell>
      {/* Welcome */}
      <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-hero p-6 text-white shadow-glow sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Sparkles className="h-4 w-4" /> Wednesday · Luteal phase (Day 22)
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
              Welcome back, Sarah 👋
            </h1>
            <p className="mt-1 max-w-lg text-sm text-white/85">
              Your gut score is trending up. Keep the fermented streak going — your skin
              is thanking you.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              className="bg-white text-foreground hover:bg-white/90"
            >
              <Camera className="mr-2 h-4 w-4" /> Snap a meal
            </Button>
            <Button
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              View full plan
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Wellness score */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gut Health Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="font-display text-4xl font-bold">82%</div>
              <Badge className="bg-success/15 text-success hover:bg-success/20">
                Improving
              </Badge>
            </div>
            <Progress value={82} className="mt-4" />
            <div className="mt-4 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#g1)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Acne tracker */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Skin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-soft text-3xl">
                😊
              </div>
              <div>
                <div className="font-display text-xl font-semibold">Clear</div>
                <div className="text-xs text-muted-foreground">2 clear days in a row</div>
              </div>
            </div>
            <div className="mt-4 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis dataKey="day" fontSize={10} stroke="var(--color-muted-foreground)" />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="flare"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hydration */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Hydration
            </CardTitle>
            <Droplets className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-4xl font-bold">
              4<span className="text-lg text-muted-foreground">/8 cups</span>
            </div>
            <Progress value={50} className="mt-4" />
            <div className="mt-4 flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-8 flex-1 rounded-md ${
                    i < 4 ? "bg-primary" : "bg-muted"
                  } transition-all hover:scale-105`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meal plan */}
        <Card className="shadow-card md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">Today's Meal Plan</CardTitle>
            <Button variant="ghost" size="sm">
              Full plan <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {meals.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.slot}
                  className="group rounded-2xl border border-border bg-gradient-soft p-4 transition-all hover:-translate-y-0.5 hover:shadow-card"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <Icon className="h-4 w-4 text-primary" />
                    <Badge variant="secondary" className="text-[10px]">
                      {m.tag}
                    </Badge>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">
                    {m.slot}
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm font-semibold">{m.name}</div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Today's Tasks</CardTitle>
              <Badge variant="secondary">
                {done}/{tasks.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasks.map((t) => (
              <label
                key={t.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  checked={t.done}
                  onCheckedChange={(v) =>
                    setTasks((prev) =>
                      prev.map((x) => (x.id === t.id ? { ...x, done: Boolean(v) } : x)),
                    )
                  }
                />
                <span
                  className={`text-sm ${
                    t.done ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {t.label}
                </span>
              </label>
            ))}
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="shadow-card md:col-span-2 xl:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <CardTitle className="text-base font-semibold">
                AI Recommendations
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {recs.map((r) => (
              <div
                key={r.title}
                className="group rounded-2xl border border-border p-4 transition-all hover:border-primary/40 hover:shadow-card"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-soft text-primary">
                    <Sun className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold">{r.title}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
