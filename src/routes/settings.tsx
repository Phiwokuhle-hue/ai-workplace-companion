import { createFileRoute } from "@tanstack/react-router";
import { AppShell, AI_DISCLAIMER } from "@/components/app-shell";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePrefs, type Horizon, type Tone } from "@/lib/prefs";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Set your default email tone, planning horizon, signature and daily focus hours for the AI productivity assistant.",
      },
      { property: "og:title", content: "Settings — AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Set your default email tone and planning preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { prefs, update } = usePrefs();

  return (
    <AppShell
      title="Settings"
      description="Preferences are saved on this device only. There is no account and nothing is stored on a server."
    >
      <div className="surface-card space-y-6 p-5 sm:p-6">
        <div className="grid gap-2">
          <Label htmlFor="tone">Default email tone</Label>
          <Select value={prefs.tone} onValueChange={(v) => update({ tone: v as Tone })}>
            <SelectTrigger id="tone" className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="persuasive">Persuasive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="horizon">Default planning view</Label>
          <Select value={prefs.horizon} onValueChange={(v) => update({ horizon: v as Horizon })}>
            <SelectTrigger id="horizon" className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily schedule</SelectItem>
              <SelectItem value="weekly">Weekly schedule</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="hours">Focus hours available per day</Label>
          <Input
            id="hours"
            className="max-w-xs"
            value={prefs.hoursPerDay}
            onChange={(e) => update({ hoursPerDay: e.target.value })}
            placeholder="6"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="signature">Email sign-off name</Label>
          <Input
            id="signature"
            className="max-w-xs"
            value={prefs.signature}
            onChange={(e) => update({ signature: e.target.value })}
            placeholder="e.g. Thandi Ndlovu"
          />
        </div>
      </div>

      <div className="surface-card mt-6 p-5 sm:p-6">
        <h2 className="text-base font-semibold">Responsible AI</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{AI_DISCLAIMER}</p>
      </div>
    </AppShell>
  );
}
