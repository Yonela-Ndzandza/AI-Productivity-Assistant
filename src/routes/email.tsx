import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { AIOutput } from "@/components/common/AIOutput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Send } from "lucide-react";
import { generateAIText } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — GlowFlow AI" },
      {
        name: "description",
        content: "Generate professional emails in seconds with GlowFlow AI.",
      },
      { property: "og:title", content: "Smart Email Generator — GlowFlow AI" },
      { property: "og:description", content: "Compose polished emails in any tone." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const generate = useServerFn(generateAIText);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("Professional");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const run = async () => {
    if (!subject.trim()) {
      toast.error("Please enter a subject or purpose");
      return;
    }
    setLoading(true);
    try {
      const { text } = await generate({
        data: {
          system:
            "You are an expert email writer. Return ONLY the email — start with 'Subject: ...' on line one, blank line, then greeting, body paragraphs, and a professional sign-off. Match the requested tone exactly.",
          prompt: `Recipient: ${recipient || "(unspecified)"}\nSubject/Purpose: ${subject}\nTone: ${tone}\nAdditional notes: ${notes || "(none)"}`,
          temperature: 0.7,
        },
      });
      setOutput(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={<Mail className="h-5 w-5" />}
        title="Smart Email Generator"
        description="Draft polished emails in your voice in seconds."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Email details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Recipient</Label>
              <Input
                placeholder="e.g. Alex, hiring manager"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Subject / Purpose</Label>
              <Input
                placeholder="e.g. Follow up on Q3 proposal"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Professional",
                    "Friendly",
                    "Persuasive",
                    "Apologetic",
                    "Confident",
                  ].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Additional notes</Label>
              <Textarea
                rows={5}
                placeholder="Key points, deadlines, or context..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button
              className="w-full bg-gradient-primary text-primary-foreground shadow-glow"
              onClick={run}
              disabled={loading}
            >
              <Send className="mr-2 h-4 w-4" />
              {loading ? "Generating..." : "Generate Email"}
            </Button>
          </CardContent>
        </Card>

        <AIOutput
          title="Generated email"
          loading={loading}
          text={output}
          onRegenerate={output ? run : undefined}
          empty="Fill in the details and generate a polished email draft."
        />
      </div>
    </AppShell>
  );
}
