import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Mail, NotebookPen, CalendarClock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant — Dashboard" },
      {
        name: "description",
        content:
          "Draft emails, summarize meeting notes and plan your week with AI. A fast, frontend-only workplace productivity assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Draft emails, summarize meeting notes and plan your week with AI.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    title: "Smart Email Generator",
    icon: Mail,
    body: "Turn a rough note into a polished email in a friendly, formal or persuasive tone.",
    action: "Write an email",
  },
  {
    to: "/notes",
    title: "Meeting Notes Summarizer",
    icon: NotebookPen,
    body: "Paste long notes and get a summary, decisions, action items and deadlines.",
    action: "Summarize notes",
  },
  {
    to: "/planner",
    title: "AI Task Planner",
    icon: CalendarClock,
    body: "Turn your task list into a realistic, prioritized daily or weekly timetable.",
    action: "Plan my time",
  },
] as const;

function Dashboard() {
  return (
    <AppShell
      title="Good to see you"
      description="Three AI tools for the work that eats your day. Nothing to set up, nothing to sign in to."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(({ to, title, icon: Icon, body, action }) => (
          <div key={to} className="surface-card flex flex-col p-5">
            <span className="flex size-10 items-center justify-center rounded-lg bg-secondary">
              <Icon className="size-5 text-secondary-foreground" aria-hidden />
            </span>
            <h2 className="mt-4 text-base font-semibold">{title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
            <Button asChild className="mt-5 w-full">
              <Link to={to}>
                {action}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <section className="surface-card mt-6 p-5 sm:p-6">
        <h2 className="text-base font-semibold">Quick actions</h2>
        <p className="mt-1 text-sm text-muted-foreground">Jump straight into a common task.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/email">Reply to a client</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/email">Ask for an update</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/notes">Summarize today's stand-up</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/planner">Plan tomorrow</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/planner">Plan my week</Link>
          </Button>
        </div>
      </section>
    </AppShell>
  );
}
