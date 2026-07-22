import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { AIDisclaimer } from "@/components/common/AIDisclaimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeartPulse, Sparkles } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/wellness")({
  head: () => ({
    meta: [
      { title: "Wellness Tracker — GlowFlow AI" },
      {
        name: "description",
        content: "Log triggers, view trends, and get AI-observed patterns for your skin.",
      },
      { property: "og:title", content: "Wellness Tracker — GlowFlow AI" },
      { property: "og:description", content: "Track sleep, stress, diet, and cycle." },
    ],
  }),
  component: WellnessPage,
});

const weekly = [
  { day: "Mon", flare: 2, stress: 6, sugar: 3, sleep: 6.5 },
  { day: "Tue", flare: 2, stress: 5, sugar: 2, sleep: 7 },
  { day: "Wed", flare: 1, stress: 4, sugar: 1, sleep: 7.5 },
  { day: "Thu", flare: 1, stress: 5, sugar: 2, sleep: 7 },
  { day: "Fri", flare: 1, stress: 6, sugar: 3, sleep: 6 },
  { day: "Sat", flare: 1, stress: 3, sugar: 2, sleep: 8 },
  { day: "Sun", flare: 0, stress: 3, sugar: 1, sleep: 8.5 },
];

function WellnessPage() {
  const [sleep, setSleep] = useState([7]);
  const [stress, setStress] = useState([4]);
  const [water, setWater] = useState([5]);
  const [dairy, setDairy] = useState(false);
  const [sugar, setSugar] = useState(false);
  const [exercise, setExercise] = useState(true);

  const insights = [
    "Your acne tends to flare 2–3 days before your menstrual cycle.",
    "Higher sugar intake correlates with more frequent breakouts this month.",
    "Sleeping 7+ hours matches your clearest skin days.",
  ];

  return (
    <AppShell>
      <PageHeader
        icon={<HeartPulse className="h-5 w-5" />}
        title="Wellness Tracker"
        description="Log daily triggers and let AI surface patterns."
      />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Today's log</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="mb-2 block">Sleep: {sleep[0]} hrs</Label>
              <Slider value={sleep} onValueChange={setSleep} min={0} max={12} step={0.5} />
            </div>
            <div>
              <Label className="mb-2 block">Stress: {stress[0]}/10</Label>
              <Slider value={stress} onValueChange={setStress} min={0} max={10} />
            </div>
            <div>
              <Label className="mb-2 block">Water: {water[0]} cups</Label>
              <Slider value={water} onValueChange={setWater} min={0} max={12} />
            </div>
            <div className="space-y-3 pt-2">
              <ToggleRow label="Dairy today" checked={dairy} onChange={setDairy} />
              <ToggleRow label="Added sugar today" checked={sugar} onChange={setSugar} />
              <ToggleRow label="Exercised" checked={exercise} onChange={setExercise} />
            </div>
            <Button
              className="w-full bg-gradient-primary text-primary-foreground shadow-glow"
              onClick={() => toast.success("Logged for today")}
            >
              Save today's entry
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Weekly trends</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
                  <XAxis dataKey="day" fontSize={12} stroke="var(--color-muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="flare" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="stress" fill="var(--color-chart-3)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="sugar" fill="var(--color-chart-5)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="sleep" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-accent" /> AI-observed patterns
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {insights.map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-gradient-soft p-4"
                >
                  <Badge className="mb-2 bg-primary/15 text-primary hover:bg-primary/20">
                    Observation
                  </Badge>
                  <p className="text-sm leading-relaxed">{i}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <AIDisclaimer />
    </AppShell>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
      <span className="text-sm font-medium">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
