import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function LoadingResult({ label }: { label: string }) {
  return (
    <div className="surface-card p-6" role="status" aria-live="polite">
      <p className="flex items-center gap-2 text-sm font-medium">
        <RefreshCw className="size-4 animate-spin" aria-hidden />
        {label}
      </p>
      <div className="mt-5 space-y-3">
        {[100, 92, 80, 96, 64].map((w, i) => (
          <div
            key={i}
            className="h-3 animate-pulse rounded-full bg-muted"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function EmptyResult({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="surface-card border-dashed p-8 text-center">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

export function AiResult({
  value,
  onChange,
  onRegenerate,
  regenerating,
  rows = 18,
}: {
  value: string;
  onChange: (v: string) => void;
  onRegenerate: () => void;
  regenerating?: boolean;
  rows?: number;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — select the text and copy manually.");
    }
  };

  return (
    <div className="surface-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Result</h2>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={copy}>
            {copied ? (
              <Check className="size-4" aria-hidden />
            ) : (
              <Copy className="size-4" aria-hidden />
            )}
            Copy
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onRegenerate}
            disabled={regenerating}
          >
            <RefreshCw className={`size-4 ${regenerating ? "animate-spin" : ""}`} aria-hidden />
            Regenerate
          </Button>
        </div>
      </div>
      <Textarea
        aria-label="Editable AI result"
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="mt-4 resize-y bg-background font-sans text-sm leading-relaxed"
      />
      <p className="mt-3 text-xs text-muted-foreground">
        Edit the text above before you use it — everything here is fully editable.
      </p>
    </div>
  );
}
