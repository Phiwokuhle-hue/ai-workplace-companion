import { createFileRoute } from "@tanstack/react-router";
import { AppShell, AI_DISCLAIMER } from "@/components/app-shell";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Set your default email tone, planning horizon and writing preferences for the AI productivity assistant.",
      },
      { property: "og:title", content: "Settings — AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Set your default email tone and planning preferences.",
      },
    ],
  }),
  component: SettingsPage;
});

function SettingsPage() {
  return null;
}
