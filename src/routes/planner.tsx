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
import { planTasks } from "@/lib/ai.functions";
import { usePrefs, type Horizon } from "@/lib/prefs";
import { toast } from "sonner";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Enter tasks, priorities, deadlines and available hours to get an optimized, time-blocked daily or weekly schedule.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Turn a task list into a realistic, prioritized timetable.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(planTasks);
  const { prefs, loaded } = usePrefs();
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState<Horizon | null>(null);
  const [hours, setHours] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const activeHorizon = horizon ?? (loaded ? prefs.horizon : "daily");
  const activeHours = hours || (loaded ? prefs.hoursPerDay : "");

  const generate = async () => {
    if (!tasks.trim()) {
      toast.error("Add at least one task first.");
      return;
    }
    setLoading(true);
    try {
      setResult(
        await run({
          data: {
            tasks,
            horizon: activeHorizon,
            hoursPerDay: activeHours || undefined,
            workingHours: workingHours.trim() || undefined,
          },
        }),
      );
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? `Couldn't build the schedule: ${error.message}`
          : "Couldn't build the schedule. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="AI Task Planner"
      description="List what needs doing, with priorities and deadlines. Get a realistic, time-blocked plan back."
    >
      <div className="surface-card space-y-5 p-5 sm:p-6">
        <div className="grid gap-2">
          <Label htmlFor="tasks">Tasks, priorities and deadlines</Label>
          <Textarea
            id="tasks"
            rows={9}
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder={
              "e.g.\nFinish Q3 report — high — due Thursday\nReview two design specs — medium\nPrep board deck — high — due Friday 09:00\nInbox and admin — low"
            }
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="horizon">Plan for</Label>
            <Select value={activeHorizon} onValueChange={(v) => setHorizon(v as Horizon)}>
              <SelectTrigger id="horizon">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">A single day</SelectItem>
                <SelectItem value="weekly">The whole week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hours">Focus hours per day</Label>
            <Input
              id="hours"
              value={activeHours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="6"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="working">Working hours / constraints</Label>
            <Input
              id="working"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder="08:30-17:00, no meetings after 15:00"
            />
          </div>
        </div>

        <Button onClick={generate} disabled={loading} className="w-full sm:w-auto">
          {loading ? "Planning…" : "Build my schedule"}
        </Button>
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingResult label="Prioritizing tasks and blocking out your time…" />
        ) : result ? (
          <AiResult value={result} onChange={setResult} onRegenerate={generate} rows={24} />
        ) : (
          <EmptyResult
            title="No schedule yet"
            hint="Add your tasks above — with priorities and deadlines if you have them — and a prioritized timetable will appear here."
          />
        )}
      </div>
    </AppShell>
  );
}
