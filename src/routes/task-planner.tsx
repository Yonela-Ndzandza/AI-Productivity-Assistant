import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { AIOutput } from "@/components/common/AIOutput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarClock, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { generateAIText } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — GlowFlow AI" },
      {
        name: "description",
        content: "Turn a task list into a prioritized, time-blocked daily schedule.",
      },
      { property: "og:title", content: "AI Task Planner — GlowFlow AI" },
      { property: "og:description", content: "Prioritize and time-block your day." },
    ],
  }),
  component: TaskPlannerPage,
});

type Block = {
  time: string;
  task: string;
  duration: string;
  priority: "High" | "Medium" | "Low";
  type?: "break" | "task";
};

function TaskPlannerPage() {
  const generate = useServerFn(generateAIText);
  const [tasks, setTasks] = useState(
    "Finish quarterly report\nReview 3 pull requests\nCall with marketing team\nMeal prep\nWorkout",
  );
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState<Block[] | null>(null);

  const run = async () => {
    setLoading(true);
    try {
      const { text } = await generate({
        data: {
          system:
            'You are a productivity coach. Given a task list, produce a realistic single-day schedule from 9:00 to 18:00. Reply ONLY as JSON array of {time, task, duration, priority, type} where priority is "High"|"Medium"|"Low" and type is "task" or "break". Include 2-3 short breaks. No markdown.',
          prompt: tasks,
          temperature: 0.5,
        },
      });
      const clean = text.replace(/```json|```/g, "").trim();
      setBlocks(JSON.parse(clean));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={<CalendarClock className="h-5 w-5" />}
        title="AI Task Planner"
        description="List your tasks and let AI build a prioritized daily schedule with breaks."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Your tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              rows={14}
              placeholder="One task per line..."
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
            <Button
              className="w-full bg-gradient-primary text-primary-foreground shadow-glow"
              onClick={run}
              disabled={loading}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Planning..." : "Generate Schedule"}
            </Button>
          </CardContent>
        </Card>

        <AIOutput
          title="Today's plan"
          loading={loading}
          text={blocks ? JSON.stringify(blocks) : undefined}
          onRegenerate={blocks ? run : undefined}
          empty="Your AI-generated timeline will appear here."
        >
          {blocks && (
            <ol className="relative space-y-3 border-l-2 border-dashed border-border pl-6">
              {blocks.map((b, i) => (
                <li key={i} className="relative">
                  <span
                    className={`absolute -left-[29px] top-2 grid h-4 w-4 place-items-center rounded-full ring-4 ring-background ${
                      b.type === "break" ? "bg-accent" : "bg-primary"
                    }`}
                  />
                  <div className="rounded-2xl border border-border bg-card p-3 shadow-card transition-all hover:-translate-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" /> {b.time} · {b.duration}
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          b.priority === "High"
                            ? "bg-accent/15 text-accent"
                            : b.priority === "Medium"
                              ? "bg-warning/15 text-warning-foreground"
                              : ""
                        }
                      >
                        {b.priority}
                      </Badge>
                    </div>
                    <div className="mt-1 font-medium">{b.task}</div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </AIOutput>
      </div>
    </AppShell>
  );
}
