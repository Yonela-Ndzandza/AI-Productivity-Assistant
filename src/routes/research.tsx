import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { AIOutput } from "@/components/common/AIOutput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpenText, Search } from "lucide-react";
import { generateAIText } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — GlowFlow AI" },
      {
        name: "description",
        content: "Ask any research question and get a structured, cited-style answer.",
      },
      { property: "og:title", content: "AI Research Assistant — GlowFlow AI" },
      { property: "og:description", content: "Structured research summaries in seconds." },
    ],
  }),
  component: ResearchPage,
});

type Research = {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  sources: { title: string; note: string }[];
};

const suggestions = [
  "What foods reduce hormonal acne?",
  "How does the luteal phase affect skin?",
  "Best productivity techniques for deep work",
  "Anti-inflammatory diet basics",
];

function ResearchPage() {
  const generate = useServerFn(generateAIText);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Research | null>(null);

  const run = async (question?: string) => {
    const query = question ?? q;
    if (!query.trim()) return toast.error("Enter a research question");
    setQ(query);
    setLoading(true);
    try {
      const { text } = await generate({
        data: {
          system:
            'Act as a research assistant. Reply ONLY as JSON: {"summary": string, "keyFindings": string[], "recommendations": string[], "sources": [{"title": string, "note": string}]}. Provide 3-5 findings, 3-5 recommendations, and 3-4 illustrative source references (do not fabricate URLs — use publication names and note the topic).',
          prompt: query,
          temperature: 0.5,
        },
      });
      setData(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to research");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={<BookOpenText className="h-5 w-5" />}
        title="AI Research Assistant"
        description="Get structured summaries, key findings, and recommendations."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Ask a question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="e.g. What foods reduce hormonal acne?"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && run()}
              />
            </div>
            <Button
              className="w-full bg-gradient-primary text-primary-foreground shadow-glow"
              onClick={() => run()}
              disabled={loading}
            >
              {loading ? "Researching..." : "Research"}
            </Button>
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                Try one of these
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => run(s)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs transition-all hover:border-primary/40 hover:bg-gradient-soft"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <AIOutput
          title="Research report"
          loading={loading}
          text={data ? JSON.stringify(data) : undefined}
          onRegenerate={data ? () => run() : undefined}
          empty="Ask a question and get a structured research summary."
        >
          {data && (
            <div className="space-y-4">
              <Panel title="Summary">{data.summary}</Panel>
              <Panel title="Key Findings">
                <ul className="space-y-1.5 text-sm">
                  {data.keyFindings.map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel title="Recommendations">
                <ul className="space-y-1.5 text-sm">
                  {data.recommendations.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel title="Sources">
                <ul className="space-y-2">
                  {data.sources.map((s, i) => (
                    <li key={i} className="text-sm">
                      <div className="font-medium">{s.title}</div>
                      <div className="text-xs text-muted-foreground">{s.note}</div>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          )}
        </AIOutput>
      </div>
    </AppShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-gradient-soft p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
        {title}
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
