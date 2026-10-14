import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  Inbox,
  TimerOff,
  UserX,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  UserPlus,
  GitPullRequestArrow,
} from "lucide-react";
import { tickets } from "@/lib/itsm-data";
import { PageHeader, PriorityBadge, Avatar } from "@/components/itsm/Badges";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Servio ITSM" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "description",
        content: "Service manager overview: KPIs, ticket trends, urgent work and recent activity.",
      },
      { property: "og:title", content: "Dashboard — Servio ITSM" },
      {
        property: "og:description",
        content: "Service manager overview: KPIs, ticket trends, urgent work and recent activity.",
      },
    ],
  }),
  component: Dashboard,
});

const kpis = [
  {
    label: "Active Incidents",
    value: 128,
    delta: "+12%",
    up: true,
    icon: AlertTriangle,
    tone: "bg-primary-soft text-primary",
  },
  {
    label: "Pending Requests",
    value: 46,
    delta: "-4%",
    up: false,
    icon: Inbox,
    tone: "bg-info-soft text-info",
  },
  {
    label: "SLA Breached",
    value: 7,
    delta: "+2",
    up: true,
    icon: TimerOff,
    tone: "bg-destructive-soft text-destructive",
    live: true,
  },
  {
    label: "Unassigned Tickets",
    value: 19,
    delta: "-8%",
    up: false,
    icon: UserX,
    tone: "bg-warning-soft text-warning",
  },
];

const series = {
  "7d": {
    labels: ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"],
    open: [42, 51, 28, 22, 63, 58, 47],
    resolved: [38, 49, 31, 25, 55, 61, 52],
  },
  "30d": {
    labels: ["W1", "W2", "W3", "W4"],
    open: [240, 286, 251, 302],
    resolved: [228, 270, 262, 295],
  },
};

const activity = [
  { icon: MessageSquare, who: "Sarah Chen", what: "commented on", ref: "INC-10482", t: "4m ago" },
  { icon: CheckCircle2, who: "Lena Fischer", what: "resolved", ref: "INC-10477", t: "22m ago" },
  { icon: UserPlus, who: "Arjun Mehta", what: "was assigned", ref: "INC-10475", t: "1h ago" },
  {
    icon: GitPullRequestArrow,
    who: "Tom Okafor",
    what: "submitted change",
    ref: "CHG-2201",
    t: "2h ago",
  },
  { icon: AlertTriangle, who: "System", what: "escalated", ref: "INC-10481", t: "3h ago" },
];

function Dashboard() {
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [hover, setHover] = useState<number | null>(null);
  const d = series[range];
  const max = Math.max(...d.open, ...d.resolved);
  const urgent = tickets.filter(
    (t) => (t.priority === "Critical" || t.priority === "High") && t.status !== "Resolved",
  );

  return (
    <>
      <PageHeader
        title="Good morning, Nimal"
        subtitle="Here's what's happening across the service desk today."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <div
            key={k.label}
            className="card-interactive rise p-5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between">
              <span className={`grid h-10 w-10 place-items-center rounded-lg ${k.tone}`}>
                <k.icon size={19} />
              </span>
              {k.live && (
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-destructive">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-destructive" />
                  LIVE
                </span>
              )}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{k.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">{k.value}</span>
              <span
                className={`flex items-center gap-0.5 text-xs font-semibold ${k.up ? "text-destructive" : "text-success"}`}
              >
                {k.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {k.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="card-surface p-5 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Open vs. Resolved</h2>
              <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-primary" />
                  Opened
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-success" />
                  Resolved
                </span>
              </div>
            </div>
            <div className="flex rounded-lg bg-muted p-0.5 text-xs font-medium">
              {(["7d", "30d"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-md px-3 py-1.5 ${range === r ? "bg-card shadow-sm" : "text-muted-foreground"}`}
                >
                  {r === "7d" ? "7 days" : "30 days"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 flex h-60 items-end gap-2 sm:gap-4">
            {d.labels.map((l, i) => (
              <div
                key={l}
                className="relative flex h-full flex-1 flex-col items-center justify-end"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                {hover === i && (
                  <div className="absolute -top-2 z-10 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] text-background">
                    {d.open[i]} open · {d.resolved[i]} resolved
                  </div>
                )}
                <div className="flex h-full w-full items-end justify-center gap-1">
                  <div
                    className="w-full max-w-5 rounded-t-md bg-primary transition-all duration-500"
                    style={{
                      height: `${((d.open[i] ?? 0) / max) * 85}%`,
                      opacity: hover === null || hover === i ? 1 : 0.4,
                    }}
                  />
                  <div
                    className="w-full max-w-5 rounded-t-md bg-success transition-all duration-500"
                    style={{
                      height: `${((d.resolved[i] ?? 0) / max) * 85}%`,
                      opacity: hover === null || hover === i ? 1 : 0.4,
                    }}
                  />
                </div>
                <span className="mt-2 text-xs text-muted-foreground">{l}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card-surface p-5">
          <h2 className="font-semibold">Recent Activity</h2>
          <ol className="mt-4 space-y-4">
            {activity.map((a) => (
              <li key={a.ref + a.t} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
                  <a.icon size={14} />
                </span>
                <div className="min-w-0 text-sm">
                  <p>
                    <span className="font-semibold">{a.who}</span> {a.what}{" "}
                    <span className="font-mono text-xs text-primary">{a.ref}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{a.t}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="card-surface mt-6">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <span className="pulse-dot h-2 w-2 rounded-full bg-destructive" />
            Urgent Tickets
          </h2>
          <Link
            to="/incidents"
            className="flex items-center gap-1 text-sm font-medium text-primary"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <ul className="divide-y">
          {urgent.map((t) => (
            <li key={t.id}>
              <Link
                to="/tickets/$id"
                params={{ id: t.id }}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5 hover:bg-muted/60 sm:grid-cols-[110px_minmax(0,1fr)_140px_90px]"
              >
                <span className="hidden font-mono text-xs text-muted-foreground sm:block">
                  {t.id}
                </span>
                <span className="truncate text-sm font-medium">{t.subject}</span>
                <span className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
                  {t.assignee ? (
                    <>
                      <Avatar name={t.assignee} />
                      {t.assignee.split(" ")[0]}
                    </>
                  ) : (
                    <em>Unassigned</em>
                  )}
                </span>
                <span className="justify-self-end">
                  <PriorityBadge p={t.priority} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
