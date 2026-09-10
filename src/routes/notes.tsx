import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AiResult, EmptyResult, LoadingResult } from "@/components/ai-result";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeNotes } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste long meeting notes and get a concise summary, key decisions, action items, deadlines and discussion points.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Summary, decisions, action items and deadlines from any meeting notes.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const run = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!notes.trim()) {
      toast.error("Paste your meeting notes first.");
      return;
    }
    setLoading(true);
    try {
      setResult(await run({ data: { notes } }));
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? `Couldn't summarize the notes: ${error.message}`
          : "Couldn't summarize the notes. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Drop in raw notes or a transcript. Get a summary, decisions, action items, deadlines and the points that mattered."
    >
      <div className="surface-card space-y-5 p-5 sm:p-6">
        <div className="grid gap-2">
          <Label htmlFor="notes">Meeting notes</Label>
          <Textarea
            id="notes"
            rows={14}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste everything — bullet points, half sentences, who said what. The messier the better."
          />
          <p className="text-xs text-muted-foreground">
            {notes.trim() ? `${notes.trim().split(/\s+/).length} words` : "No notes yet"}
          </p>
        </div>
        <Button onClick={generate} disabled={loading} className="w-full sm:w-auto">
          {loading ? "Summarizing…" : "Summarize notes"}
        </Button>
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingResult label="Reading your notes and pulling out what matters…" />
        ) : result ? (
          <AiResult value={result} onChange={setResult} onRegenerate={generate} rows={22} />
        ) : (
          <EmptyResult
            title="No summary yet"
            hint="Paste your notes above and you'll get a summary, key decisions, action items, deadlines and discussion points — all editable."
          />
        )}
      </div>
    </AppShell>
  );
}
