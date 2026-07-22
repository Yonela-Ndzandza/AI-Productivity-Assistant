import { Info } from "lucide-react";

export function AIDisclaimer() {
  return (
    <div className="mt-6 flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <p>
        <span className="font-semibold text-foreground">Responsible AI Notice.</span> This
        application provides AI-generated productivity and wellness suggestions for
        informational purposes only. Nutrition recommendations are not medical advice and
        should not replace consultation with a qualified healthcare professional.
      </p>
    </div>
  );
}
