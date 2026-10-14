import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Filter, X, Paperclip, Search } from "lucide-react";
import { tickets as seed, type Priority, type Ticket } from "@/lib/itsm-data";
import { PageHeader, PriorityBadge, StatusBadge, Avatar } from "@/components/itsm/Badges";

export const Route = createFileRoute("/incidents")({
  head: () => ({
    meta: [
      { title: "Incidents — Servio ITSM" },
      {
        name: "description",
        content: "Track, filter and create IT incidents with priorities and assignments.",
      },
      { property: "og:title", content: "Incidents — Servio ITSM" },
      {
        property: "og:description",
        content: "Track, filter and create IT incidents with priorities and assignments.",
      },
    ],
  }),
  component: Incidents,
});

function Incidents() {
  const [rows, setRows] = useState<Ticket[]>(seed);
  const [q, setQ] = useState("");
  const [pf, setPf] = useState<"All" | Priority>("All");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (pf === "All" || r.priority === pf) &&
          (r.subject + r.id + r.raisedBy).toLowerCase().includes(q.toLowerCase()),
      ),
    [rows, q, pf],
  );

  return (
    <>
      <PageHeader
        title="Incidents"
        subtitle={`${rows.filter((r) => r.status !== "Resolved").length} open incidents across all queues`}
        action={
          <button onClick={() => setOpen(true)} className="btn-primary">
            <Plus size={16} />
            Create New Incident
          </button>
        }
      />

      <div className="card-surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative sm:w-72">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter incidents…"
              className="input-field pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Filter size={14} className="mr-1 text-muted-foreground" />
            {(["All", "Critical", "High", "Medium", "Low"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPf(p)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${pf === p ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {[
                  "Ticket ID",
                  "Subject",
                  "Raised By",
                  "Priority",
                  "Status",
                  "Assigned To",
                  "Created",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <Link
                      to="/tickets/$id"
                      params={{ id: t.id }}
                      className="font-mono text-xs font-medium text-primary hover:underline"
                    >
                      {t.id}
                    </Link>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 font-medium">
                    <Link to="/tickets/$id" params={{ id: t.id }}>
                      {t.subject}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{t.raisedBy}</td>
                  <td className="px-4 py-3">
                    <PriorityBadge p={t.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge s={t.status} />
                  </td>
                  <td className="px-4 py-3">
                    {t.assignee ? (
                      <span className="flex items-center gap-2">
                        <Avatar name={t.assignee} />
                        {t.assignee}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{t.created}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    No incidents match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t px-4 py-3 text-xs text-muted-foreground">
          Showing {filtered.length} of {rows.length}
        </div>
      </div>

      {open && (
        <CreateModal
          onClose={() => setOpen(false)}
          onCreate={(t) => {
            setRows([t, ...rows]);
            setOpen(false);
          }}
          nextId={`INC-${10483 + rows.length - seed.length}`}
        />
      )}
    </>
  );
}

function CreateModal({
  onClose,
  onCreate,
  nextId,
}: {
  onClose: () => void;
  onCreate: (t: Ticket) => void;
  nextId: string;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("Software");
  const [pri, setPri] = useState<Priority>("Medium");
  const [file, setFile] = useState<string | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        className="card-surface rise w-full max-w-lg"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          onCreate({
            id: nextId,
            subject: title,
            description: desc,
            category: cat,
            priority: pri,
            status: "New",
            raisedBy: "Nimal Perera",
            assignee: null,
            created: new Date().toISOString().slice(0, 16).replace("T", " "),
          });
        }}
      >
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="font-semibold">Create New Incident</h2>
            <p className="text-xs text-muted-foreground">Will be logged as {nextId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 hover:bg-muted"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <label className="block text-sm font-medium">
            Title
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field mt-1.5"
              placeholder="Short summary of the issue"
            />
          </label>
          <label className="block text-sm font-medium">
            Description
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
              className="input-field mt-1.5 resize-none"
              placeholder="What happened? Steps to reproduce…"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-medium">
              Category
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="input-field mt-1.5"
              >
                {["Software", "Hardware", "Network", "Email", "Access"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Priority
              <select
                value={pri}
                onChange={(e) => setPri(e.target.value as Priority)}
                className="input-field mt-1.5"
              >
                {["Critical", "High", "Medium", "Low"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border-2 border-dashed p-5 text-sm text-muted-foreground hover:border-primary hover:text-primary">
            <Paperclip size={18} />
            {file ?? "Attach screenshot or log file"}
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
            />
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Cancel
          </button>
          <button className="btn-primary">Create Incident</button>
        </div>
      </form>
    </div>
  );
}
