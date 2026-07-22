import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { AIDisclaimer } from "@/components/common/AIDisclaimer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, Sparkles, Copy, RefreshCw, User } from "lucide-react";
import { chatWithAssistant } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat Assistant — GlowFlow AI" },
      {
        name: "description",
        content: "Chat with GlowFlow AI about productivity, meals, and wellness.",
      },
      { property: "og:title", content: "AI Chat Assistant — GlowFlow AI" },
      { property: "og:description", content: "Your always-on wellness + productivity coach." },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const prompts = [
  "I'm breaking out before my period",
  "Suggest probiotic meals",
  "Help me plan meals for work",
  "What foods reduce inflammation?",
];

function ChatPage() {
  const chat = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { text: reply } = await chat({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const regenerate = async () => {
    const trimmed = [...messages];
    if (trimmed[trimmed.length - 1]?.role === "assistant") trimmed.pop();
    if (trimmed.length === 0) return;
    setMessages(trimmed);
    setLoading(true);
    try {
      const { text: reply } = await chat({ data: { messages: trimmed } });
      setMessages([...trimmed, { role: "assistant", content: reply }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={<Bot className="h-5 w-5" />}
        title="AI Chat Assistant"
        description="Ask anything about wellness, meals, or productivity."
      />

      <Card className="flex h-[calc(100vh-16rem)] flex-col overflow-hidden shadow-card">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-hero text-white shadow-glow">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold">
                Hi Sarah, how can I help today?
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Ask about hormonal acne triggers, gut-friendly meals, or how to plan a
                calmer workday.
              </p>
              <div className="mt-6 grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
                {prompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="rounded-2xl border border-border bg-card p-3 text-left text-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback
                      className={
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-gradient-hero text-white"
                      }
                    >
                      {m.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`group max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-card ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>
                    {m.role === "assistant" && (
                      <div className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(m.content);
                            toast.success("Copied");
                          }}
                          className="rounded p-1 hover:bg-muted"
                          aria-label="Copy"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        {i === messages.length - 1 && (
                          <button
                            onClick={regenerate}
                            className="rounded p-1 hover:bg-muted"
                            aria-label="Regenerate"
                          >
                            <RefreshCw className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-gradient-hero text-white">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1 rounded-2xl bg-card px-4 py-3 shadow-card">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>

        <div className="border-t border-border bg-card/60 p-3 sm:p-4">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <Textarea
              ref={inputRef}
              rows={1}
              placeholder="Ask GlowFlow AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              className="min-h-[44px] max-h-40 resize-none"
            />
            <Button
              size="icon"
              className="h-11 w-11 shrink-0 bg-gradient-primary text-primary-foreground shadow-glow"
              onClick={() => send()}
              disabled={loading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      <AIDisclaimer />
    </AppShell>
  );
}
