import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { AIOutput } from "@/components/common/AIOutput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Sparkles } from "lucide-react";
import { generateAIText } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — GlowFlow AI" },
      {
        name: "description",
        content: "Turn long meeting notes into a clean summary, action items, and decisions.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — GlowFlow AI" },
      { property: "og:description", content: "Summary, action items, decisions, deadlines." },
    ],
  }),
  component: MeetingPage,
});

type Summary = {
  summary: string;
  actionItems: string[];
  decisions: string[];
  deadlines: string[];
};

function MeetingPage() {
  const generate = useServerFn(generateAIText);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Summary | null>(null);

  const run = async () => {
    if (!notes.trim()) return toast.error("Paste your meeting notes first");
    setLoading(true);
    try {
      const { text } = await generate({
        data: {
          system:
            'Summarize meeting notes. Reply ONLY with valid JSON matching: {"summary": string, "actionItems": string[], "decisions": string[], "deadlines": string[]}. No markdown fences.',
          prompt: notes,
          temperature: 0.4,
        },
      });
      const clean = text.replace(/```json|```/g, "").trim();
      setData(JSON.parse(clean));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={<FileText className="h-5 w-5" />}
        title="Meeting Notes Summarizer"
        description="Paste your notes — get summary, action items, decisions, and deadlines."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Your notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              rows={16}
              placeholder="Paste raw meeting notes, transcripts, or bullet points..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button
              className="w-full bg-gradient-primary text-primary-foreground shadow-glow"
              onClick={run}
              disabled={loading}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Summarizing..." : "Summarize"}
            </Button>
          </CardContent>
        </Card>

        <AIOutput
          title="Structured summary"
          loading={loading}
          text={data ? JSON.stringify(data, null, 2) : undefined}
          onRegenerate={data ? run : undefined}
          empty="A clean, structured summary will appear here."
        >
          {data && (
            <div className="space-y-4">
              <Section title="Summary" items={[data.summary]} />
              <Section title="Action Items" items={data.actionItems} bullet />
              <Section title="Decisions" items={data.decisions} bullet />
              <Section title="Deadlines" items={data.deadlines} bullet />
            </div>
          )}
        </AIOutput>
      </div>
    </AppShell>
  );
}

function Section({
  title,
  items,
  bullet,
}: {
  title: string;
  items: string[];
  bullet?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-soft p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
        {title}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">None</p>
      ) : bullet ? (
        <ul className="space-y-1.5 text-sm">
          {items.map((x, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {x}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-relaxed">{items[0]}</p>
      )}
    </div>
  );
}
