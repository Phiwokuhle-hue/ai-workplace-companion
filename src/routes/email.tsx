import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AiResult, EmptyResult, LoadingResult } from "@/components/ai-result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/ai.functions";
import { usePrefs, type Tone } from "@/lib/prefs";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn rough notes into a polished professional email in a friendly, formal or persuasive tone, then edit and copy it.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Turn rough notes into a polished professional email in seconds.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(generateEmail);
  const { prefs, loaded } = usePrefs();
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<Tone | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const activeTone = tone ?? (loaded ? prefs.tone : "formal");

  const generate = async () => {
    if (!purpose.trim()) {
      toast.error("Add a purpose or rough message first.");
      return;
    }
    setLoading(true);
    try {
      const text = await run({
        data: {
          purpose: prefs.signature
            ? `${purpose}\n\nSender name: ${prefs.signature}`
            : purpose,
          tone: activeTone,
          recipient: recipient.trim() || undefined,
        },
      });
      setResult(text);
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? `Couldn't generate the email: ${error.message}`
          : "Couldn't generate the email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Smart Email Generator"
      description="Describe what you need to say. Pick a tone. Get a professional email you can edit and send."
    >
      <div className="surface-card space-y-5 p-5 sm:p-6">
        <div className="grid gap-2">
          <Label htmlFor="purpose">Purpose or rough message</Label>
          <Textarea
            id="purpose"
            rows={7}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. tell the client the report slipped to Friday, apologise briefly, offer a short call"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient (optional)</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Amara, project client"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={activeTone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={generate} disabled={loading} className="w-full sm:w-auto">
          {loading ? "Generating…" : "Generate email"}
        </Button>
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingResult label="Writing your email…" />
        ) : result ? (
          <AiResult value={result} onChange={setResult} onRegenerate={generate} rows={16} />
        ) : (
          <EmptyResult
            title="No email yet"
            hint="Add a short purpose above — even a few messy words work — and your polished draft will appear here."
          />
        )}
      </div>
    </AppShell>
  );
}
