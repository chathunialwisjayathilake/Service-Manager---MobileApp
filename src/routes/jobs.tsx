import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarClock, KanbanSquare, Plus, Table2, Wrench, X, Smartphone, ExternalLink } from "lucide-react";
import {
  initialJobs,
  jobColumns,
  jobStatusStyle,
  teams,
  type Job,
  type JobStatus,
} from "@/lib/jobs-data";
import { agents, priorityStyle, tickets, type Priority } from "@/lib/itsm-data";
import { Avatar, PageHeader, PriorityBadge } from "@/components/itsm/Badges";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Job Management — Servio ITSM" },
      {
        name: "description",
        content:
          "Kanban board and table of work orders: assign technicians, track status and due dates.",
      },
      { property: "og:title", content: "Job Management — Servio ITSM" },
      {
        property: "og:description",
        content:
          "Kanban board and table of work orders: assign technicians, track status and due dates.",
      },
    ],
  }),
  component: JobsPage,
});

const columnDot: Record<JobStatus, string> = {
  "To Do": "bg-info",
  "In Progress": "bg-primary",
  "On Hold": "bg-warning",
  Completed: "bg-success",
};

const emptyForm = {
  title: "",
  description: "",
  incident: "",
  scheduled: "",
  technician: "",
  team: teams[0] ?? "Field Services",
  priority: "Medium" as Priority,
  tools: "",
};

function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [view, setView] = useState<"board" | "table">("board");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const byStatus = useMemo(() => {
    const m = new Map<JobStatus, Job[]>(jobColumns.map((c) => [c, []]));
    for (const j of jobs) m.get(j.status)!.push(j);
    return m;
  }, [jobs]);

  const setStatus = (id: string, status: JobStatus) =>
    setJobs((js) => js.map((j) => (j.id === id ? { ...j, status } : j)));

  const createJob = () => {
    if (!form.title.trim()) return;
    const id = `JOB-${3013 + jobs.length - initialJobs.length}`;
    setJobs((js) => [
      {
        id,
        title: form.title.trim(),
        description: form.description,
        technician: form.technician || null,
        team: form.team,
        priority: form.priority,
        due: form.scheduled ? form.scheduled.replace("T", " ") : "Unscheduled",
        status: "To Do",
        incident: form.incident || null,
        tools: form.tools
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      },
      ...js,
    ]);
    setForm(emptyForm);
    setShowModal(false);
  };

  const statusSelect = (job: Job) => (
    <select
      value={job.status}
      onChange={(e) => setStatus(job.id, e.target.value as JobStatus)}
      className={cn(
        "cursor-pointer rounded-full px-2 py-0.5 text-xs font-medium outline-none",
        jobStatusStyle[job.status],
      )}
    >
      {jobColumns.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );

  return (
    <>
      {/* Field Technician Mobile View Banner */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Smartphone size={18} />
          </span>
          <div>
            <h3 className="font-semibold text-foreground">Field Technician Mobile View</h3>
            <p className="text-xs text-muted-foreground">
              Access Telesonic Option 01 Mobile App (Mobile Jobs, Travel & Check-in, Parts, Photos, Signature).
            </p>
          </div>
        </div>
        <Link
          to="/mobile/jobs"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
        >
          Open Mobile Jobs App
          <ExternalLink size={14} />
        </Link>
      </div>

      <PageHeader
        title="Job Management"
        subtitle="Work orders and field tasks across your teams."
        action={
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-muted p-0.5 text-xs font-medium">
              <button
                onClick={() => setView("board")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5",
                  view === "board" ? "bg-card shadow-sm" : "text-muted-foreground",
                )}
              >
                <KanbanSquare size={14} />
                Board
              </button>
              <button
                onClick={() => setView("table")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5",
                  view === "table" ? "bg-card shadow-sm" : "text-muted-foreground",
                )}
              >
                <Table2 size={14} />
                Table
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Plus size={15} />
              New Job
            </button>
          </div>
        }
      />

      {view === "board" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {jobColumns.map((col) => (
            <section key={col} className="rounded-xl bg-muted/50 p-3">
              <header className="mb-3 flex items-center justify-between px-1">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <span className={cn("h-2 w-2 rounded-full", columnDot[col])} />
                  {col === "To Do" ? "To Do / Unassigned" : col}
                </h2>
                <span className="rounded-md bg-card px-1.5 text-xs font-bold text-muted-foreground">
                  {byStatus.get(col)!.length}
                </span>
              </header>
              <div className="space-y-3">
                {byStatus.get(col)!.map((job) => (
                  <article key={job.id} className="card-surface rise p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[11px] text-muted-foreground">{job.id}</span>
                      <PriorityBadge p={job.priority} />
                    </div>
                    <h3 className="mt-1.5 text-sm font-semibold leading-snug">{job.title}</h3>
                    {job.incident && (
                      <Link
                        to="/tickets/$id"
                        params={{ id: job.incident }}
                        className="mt-1 inline-block font-mono text-[11px] text-primary hover:underline"
                      >
                        {job.incident}
                      </Link>
                    )}
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      {job.technician ? (
                        <>
                          <Avatar name={job.technician} className="h-6 w-6 text-[10px]" />
                          <span>{job.technician}</span>
                        </>
                      ) : (
                        <em>Unassigned</em>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarClock size={12} />
                      {job.due}
                    </div>
                    {job.tools.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {job.tools.map((t) => (
                          <span
                            key={t}
                            className="flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            <Wrench size={9} />
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 border-t pt-2.5">{statusSelect(job)}</div>
                  </article>
                ))}
                {byStatus.get(col)!.length === 0 && (
                  <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                    No jobs
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Job</th>
                <th className="px-5 py-3 font-semibold">Technician</th>
                <th className="px-5 py-3 font-semibold">Priority</th>
                <th className="px-5 py-3 font-semibold">Due</th>
                <th className="px-5 py-3 font-semibold">Incident</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-muted/50">
                  <td className="px-5 py-3">
                    <span className="block font-mono text-[11px] text-muted-foreground">
                      {job.id}
                    </span>
                    <span className="font-medium">{job.title}</span>
                  </td>
                  <td className="px-5 py-3">
                    {job.technician ? (
                      <span className="flex items-center gap-2">
                        <Avatar name={job.technician} className="h-6 w-6 text-[10px]" />
                        {job.technician}
                      </span>
                    ) : (
                      <em className="text-muted-foreground">Unassigned</em>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <PriorityBadge p={job.priority} />
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{job.due}</td>
                  <td className="px-5 py-3">
                    {job.incident ? (
                      <Link
                        to="/tickets/$id"
                        params={{ id: job.incident }}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {job.incident}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-3">{statusSelect(job)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="card-surface rise w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight">Create & Assign New Job</h2>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-lg hover:bg-muted"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold">Job Title *</label>
                <input
                  className="input-field"
                  placeholder="e.g. Replace failed switch in comms room"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold">Description</label>
                <textarea
                  className="input-field min-h-20 resize-y"
                  placeholder="What needs to be done?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold">Associated Incident</label>
                  <select
                    className="input-field"
                    value={form.incident}
                    onChange={(e) => setForm({ ...form, incident: e.target.value })}
                  >
                    <option value="">None</option>
                    {tickets.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id} — {t.subject.slice(0, 30)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Scheduled Date/Time</label>
                  <input
                    type="datetime-local"
                    className="input-field"
                    value={form.scheduled}
                    onChange={(e) => setForm({ ...form, scheduled: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Assigned Team</label>
                  <select
                    className="input-field"
                    value={form.team}
                    onChange={(e) => setForm({ ...form, team: e.target.value })}
                  >
                    {teams.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Technician</label>
                  <select
                    className="input-field"
                    value={form.technician}
                    onChange={(e) => setForm({ ...form, technician: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {agents.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Priority</label>
                  <select
                    className="input-field"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                  >
                    {(["Critical", "High", "Medium", "Low"] as const).map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Required Tools/Parts</label>
                  <input
                    className="input-field"
                    placeholder="Comma separated"
                    value={form.tools}
                    onChange={(e) => setForm({ ...form, tools: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={createJob}
                disabled={!form.title.trim()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
              >
                Create Job
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
