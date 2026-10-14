import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Phone, Building2, Clock, Send, Paperclip } from "lucide-react";
import { tickets, agents, type Priority, type Status } from "@/lib/itsm-data";
import { PriorityBadge, StatusBadge, Avatar } from "@/components/itsm/Badges";

export const Route = createFileRoute("/tickets/$id")({
  loader: ({ params }) => {
    const t = tickets.find((x) => x.id === params.id);
    if (!t) throw notFound();
    return t;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.id ?? "Ticket"} — Servio ITSM` },
      { name: "description", content: loaderData?.subject ?? "Ticket details" },
      { property: "og:title", content: `${loaderData?.id ?? "Ticket"} — Servio ITSM` },
      { property: "og:description", content: loaderData?.subject ?? "Ticket details" },
    ],
  }),
  component: TicketDetail,
});

function TicketDetail() {
  const t = Route.useLoaderData();
  const [status, setStatus] = useState<Status>(t.status);
  const [priority, setPriority] = useState<Priority>(t.priority);
  const [assignee, setAssignee] = useState(t.assignee ?? "");
  const [comment, setComment] = useState("");
  const [timeline, setTimeline] = useState([
    {
      who: t.raisedBy,
      text: "Ticket created via self-service portal.",
      t: t.created,
      kind: "system",
    },
    {
      who: "System",
      text: `Priority set to ${t.priority}. Routed to Service Desk L1.`,
      t: t.created,
      kind: "system",
    },
    {
      who: "Sarah Chen",
      text: "Hi, thanks for reporting. Can you share your VPN client version and a screenshot of the error?",
      t: "09:24",
      kind: "comment",
    },
    {
      who: t.raisedBy,
      text: "Version 5.2.1 — screenshot attached. It happens on both Wi-Fi and hotspot.",
      t: "09:41",
      kind: "comment",
    },
  ]);

  const [secs, setSecs] = useState(2 * 3600 + 14 * 60 + 33);
  useEffect(() => {
    const i = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(i);
  }, []);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0"),
    mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0"),
    ss = String(secs % 60).padStart(2, "0");
  const pct = (secs / (4 * 3600)) * 100;

  return (
    <>
      <Link
        to="/incidents"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={15} />
        Back to incidents
      </Link>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <section className="card-surface p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
              <StatusBadge s={status} />
              <PriorityBadge p={priority} />
            </div>
            <h1 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">{t.subject}</h1>
            <p className="mt-4 leading-relaxed text-foreground/85">{t.description}</p>
            <div className="mt-6 flex flex-wrap gap-4 border-t pt-5">
              <div className="flex items-center gap-3">
                <Avatar name={t.raisedBy} className="h-10 w-10 text-sm" />
                <div>
                  <p className="font-semibold">{t.raisedBy}</p>
                  <p className="text-xs text-muted-foreground">Finance Analyst</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground sm:ml-auto sm:items-center">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} />
                  {(t.raisedBy.split(" ")[0] ?? "").toLowerCase()}@company.com
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={14} />
                  ext. 4412
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 size={14} />
                  Colombo HQ
                </span>
              </div>
            </div>
          </section>

          <section className="card-surface p-6">
            <h2 className="font-semibold">Activity</h2>
            <ol className="relative mt-5 space-y-5 border-l pl-6">
              {timeline.map((e, i) => (
                <li key={i} className="relative">
                  <span
                    className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full ring-4 ring-card ${e.kind === "system" ? "bg-muted-foreground/40" : "bg-primary"}`}
                  />
                  {e.kind === "system" ? (
                    <p className="text-sm text-muted-foreground">
                      {e.text} <span className="text-xs">· {e.t}</span>
                    </p>
                  ) : (
                    <div className="rounded-lg bg-muted/60 p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Avatar name={e.who} className="h-6 w-6 text-[10px]" />
                        <span className="font-semibold">{e.who}</span>
                        <span className="text-xs text-muted-foreground">{e.t}</span>
                      </div>
                      <p className="mt-2 text-sm">{e.text}</p>
                    </div>
                  )}
                </li>
              ))}
            </ol>
            <form
              className="mt-6 rounded-lg border focus-within:border-ring"
              onSubmit={(e) => {
                e.preventDefault();
                if (!comment.trim()) return;
                setTimeline([
                  ...timeline,
                  { who: "Nimal Perera", text: comment, t: "Just now", kind: "comment" },
                ]);
                setComment("");
              }}
            >
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Write a reply or internal note…"
                className="w-full resize-none bg-transparent p-3 text-sm outline-none"
              />
              <div className="flex items-center justify-between border-t px-3 py-2">
                <button
                  type="button"
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                  aria-label="Attach"
                >
                  <Paperclip size={16} />
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  <Send size={14} />
                  Send
                </button>
              </div>
            </form>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className={`card-surface p-5 ${secs < 3600 ? "border-destructive" : ""}`}>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Clock size={13} />
              Resolution SLA
            </p>
            <p
              className={`mt-2 font-mono text-3xl font-medium tabular-nums ${secs < 3600 ? "text-destructive" : ""}`}
            >
              {hh}:{mm}:{ss}
            </p>
            <div className="mt-3 h-1.5 rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all ${pct < 25 ? "bg-destructive" : pct < 50 ? "bg-warning" : "bg-success"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Due today, 14:00 · 4h target</p>
          </section>
          <section className="card-surface space-y-4 p-5">
            <h2 className="font-semibold">Properties</h2>
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="input-field"
              >
                {["New", "In Progress", "On Hold", "Resolved"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Assignee">
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="input-field"
              >
                <option value="">Unassigned</option>
                {agents.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </Field>
            <Field label="Priority">
              <div className="grid grid-cols-4 gap-1 rounded-lg bg-muted p-1">
                {(["Low", "Medium", "High", "Critical"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`rounded-md py-1.5 text-xs font-medium ${priority === p ? "bg-card shadow-sm" : "text-muted-foreground"}`}
                  >
                    {p === "Critical" ? "Crit" : p === "Medium" ? "Med" : p}
                  </button>
                ))}
              </div>
            </Field>
            <dl className="space-y-2 border-t pt-4 text-sm">
              {[
                ["Category", t.category],
                ["Created", t.created],
                ["Channel", "Self-service"],
                ["Group", "Service Desk L1"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
