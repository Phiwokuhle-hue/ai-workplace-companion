import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  CalendarClock,
  Settings,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/notes", label: "Meeting Notes Summarizer", icon: NotebookPen },
  { to: "/planner", label: "AI Task Planner", icon: CalendarClock },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export const AI_DISCLAIMER =
  "AI-generated content may contain errors. Review and verify important information before using it for professional decisions or communication.";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {nav.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground data-[status=active]:font-medium"
        >
          <Icon className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-accent">
        <Sparkles className="size-4 text-sidebar-primary" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-sm font-semibold text-sidebar-primary">
          AI Workplace
        </span>
        <span className="block text-xs text-sidebar-foreground/60">Productivity Assistant</span>
      </span>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-72 shrink-0 flex-col gap-6 bg-sidebar p-4 lg:sticky lg:top-0 lg:flex lg:h-screen">
        <Brand />
        <NavLinks />
        <p className="mt-auto rounded-lg bg-sidebar-accent/50 p-3 text-[11px] leading-relaxed text-sidebar-foreground/60">
          {AI_DISCLAIMER}
        </p>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-sidebar px-4 py-3 lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex size-10 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {open ? <Menu className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-sidebar p-4 lg:hidden">
          <div className="mb-6 flex items-center justify-between">
            <Brand />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex size-10 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="size-5" />
            </button>
          </div>
          <NavLinks onNavigate={() => setOpen(false)} />
        </div>
      )}

      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-10 text-xs leading-relaxed text-muted-foreground lg:hidden">
            {AI_DISCLAIMER}
          </p>
        </div>
      </main>
    </div>
  );
}
