import { Copy, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AIDisclaimer } from "./AIDisclaimer";
import type { ReactNode } from "react";

export function AIOutput({
  title = "AI Response",
  loading,
  text,
  onRegenerate,
  children,
  empty,
}: {
  title?: string;
  loading?: boolean;
  text?: string;
  onRegenerate?: () => void;
  children?: ReactNode;
  empty?: string;
}) {
  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <Card className="border-border/60 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <div className="flex gap-1">
          {text && (
            <Button variant="ghost" size="icon" onClick={copy} aria-label="Copy">
              <Copy className="h-4 w-4" />
            </Button>
          )}
          {onRegenerate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRegenerate}
              disabled={loading}
              aria-label="Regenerate"
            >
              <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Thinking...
          </div>
        ) : children ? (
          children
        ) : text ? (
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {text}
          </div>
        ) : (
          <div className="grid min-h-[220px] place-items-center text-center text-sm text-muted-foreground">
            {empty ?? "Fill out the form and generate a response to see results here."}
          </div>
        )}
        <AIDisclaimer />
      </CardContent>
    </Card>
  );
}
