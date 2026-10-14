import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MonitorCog, Plus, Search, X, Undo2, UserPlus } from "lucide-react";
import { PageHeader, Avatar } from "@/components/itsm/Badges";
import { Button } from "@/components/ui/button";
import { agents } from "@/lib/itsm-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/equipment")({
  head: () => ({
    meta: [
      { title: "Equipment Card — Servio ITSM" },
      { name: "description", content: "Track, assign and return company equipment." },
      { property: "og:title", content: "Equipment Card — Servio ITSM" },
      { property: "og:description", content: "Track, assign and return company equipment." },
    ],
  }),
  component: EquipmentPage,
});

type EqStatus = "Available" | "Assigned" | "In Repair" | "Retired";

interface Equipment {
  id: string;
  name: string;
  type: string;
  serial: string;
  status: EqStatus;
  assignedTo: string | null;
  location: string;
  warranty: string;
}

const initialEquipment: Equipment[] = [
  {
    id: "EQ-5001",
    name: 'MacBook Pro 14"',
    type: "Laptop",
    serial: "C02XL0ABJHD3",
    status: "Assigned",
    assignedTo: "Sarah Chen",
    location: "Floor 2",
    warranty: "2027-03-14",
  },
  {
    id: "EQ-5002",
    name: "Dell Latitude 5540",
    type: "Laptop",
    serial: "DL5540-88321",
    status: "Available",
    assignedTo: null,
    location: "IT Store",
    warranty: "2026-11-02",
  },
  {
    id: "EQ-5003",
    name: "HP EliteDesk 800",
    type: "Desktop",
    serial: "HP800-10293",
    status: "Assigned",
    assignedTo: "Tom Okafor",
    location: "Floor 3",
    warranty: "2026-08-19",
  },
  {
    id: "EQ-5004",
    name: "Logitech MX Master 3S",
    type: "Peripheral",
    serial: "LGT-55201",
    status: "Available",
    assignedTo: null,
    location: "IT Store",
    warranty: "2026-05-30",
  },
  {
    id: "EQ-5005",
    name: "Cisco Catalyst Switch",
    type: "Network",
    serial: "CSC-9300-77",
    status: "In Repair",
    assignedTo: null,
    location: "Server Room",
    warranty: "2028-01-11",
  },
  {
    id: "EQ-5006",
    name: 'Dell UltraSharp 27"',
    type: "Monitor",
    serial: "U2723-4410",
    status: "Assigned",
    assignedTo: "Lena Fischer",
    location: "Floor 4",
    warranty: "2027-06-25",
  },
  {
    id: "EQ-5007",
    name: "iPhone 15 Pro",
    type: "Mobile",
    serial: "IP15P-90312",
    status: "Assigned",
    assignedTo: "Arjun Mehta",
    location: "Remote",
    warranty: "2026-09-08",
  },
  {
    id: "EQ-5008",
    name: "HP LaserJet Pro",
    type: "Printer",
    serial: "HPLJ-2201",
    status: "Retired",
    assignedTo: null,
    location: "Storage",
    warranty: "2024-12-01",
  },
];

const statusStyle: Record<EqStatus, string> = {
  Available: "bg-success-soft text-success",
  Assigned: "bg-primary-soft text-primary",
  "In Repair": "bg-warning-soft text-warning",
  Retired: "bg-muted text-muted-foreground",
};

const types = ["Laptop", "Desktop", "Monitor", "Peripheral", "Network", "Mobile", "Printer"];

function EquipmentPage() {
  const [items, setItems] = useState(initialEquipment);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EqStatus | "All">("All");
  const [showModal, setShowModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      items.filter(
        (e) =>
          (statusFilter === "All" || e.status === statusFilter) &&
          (e.name + e.id + e.serial + (e.assignedTo ?? ""))
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [items, query, statusFilter],
  );

  const counts = useMemo(() => {
    const c: Record<EqStatus, number> = { Available: 0, Assigned: 0, "In Repair": 0, Retired: 0 };
    for (const e of items) c[e.status]++;
    return c;
  }, [items]);

  const setStatus = (id: string, status: EqStatus, assignedTo: string | null = null) =>
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, status, assignedTo } : e)));

  const addEquipment = (e: Equipment) => setItems((prev) => [e, ...prev]);

  return (
    <div className="py-4 sm:py-8">
      <PageHeader
        title="Equipment Card"
        subtitle="Track, assign and return company equipment."
        action={
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <Plus size={16} /> Add Equipment
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {(Object.keys(counts) as EqStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? "All" : s)}
            className={cn(
              "card-surface p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none",
              statusFilter === s && "ring-2 ring-primary",
            )}
          >
            <p className="text-sm text-muted-foreground">{s}</p>
            <p className="mt-1 text-3xl font-bold">{counts[s]}</p>
          </button>
        ))}
      </div>

      <div className="card-surface">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, ID, serial or assignee…"
              className="input-field w-full pl-9"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as EqStatus | "All")}
            className="input-field sm:w-44"
          >
            <option value="All">All statuses</option>
            {(Object.keys(statusStyle) as EqStatus[]).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Equipment</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Serial No.</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Assigned To</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Warranty</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr
                  key={e.id}
                  className="border-b last:border-0 transition-colors hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{e.name}</p>
                    <p className="text-xs text-muted-foreground">{e.id}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.type}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{e.serial}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
                        statusStyle[e.status],
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {e.assignedTo ? (
                      <span className="flex items-center gap-2">
                        <Avatar name={e.assignedTo} className="h-6 w-6 text-[10px]" />
                        {e.assignedTo}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.location}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.warranty}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {e.status === "Available" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          onClick={() => setAssignTarget(e.id)}
                        >
                          <UserPlus size={14} /> Assign
                        </Button>
                      )}
                      {e.status === "Assigned" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          onClick={() => setStatus(e.id, "Available")}
                        >
                          <Undo2 size={14} /> Return
                        </Button>
                      )}
                      {e.status === "In Repair" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          onClick={() => setStatus(e.id, "Available")}
                        >
                          <Undo2 size={14} /> Mark fixed
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <MonitorCog className="mx-auto mb-2 opacity-40" size={28} />
                    No equipment matches your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddEquipmentModal
          onClose={() => setShowModal(false)}
          onAdd={addEquipment}
          nextId={items.length + 5001}
        />
      )}
      {assignTarget && (
        <AssignModal
          equipment={items.find((e) => e.id === assignTarget)!}
          onClose={() => setAssignTarget(null)}
          onAssign={(who) => {
            setStatus(assignTarget, "Assigned", who);
            setAssignTarget(null);
          }}
        />
      )}
    </div>
  );
}

function AddEquipmentModal({
  onClose,
  onAdd,
  nextId,
}: {
  onClose: () => void;
  onAdd: (e: Equipment) => void;
  nextId: number;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState(types[0] ?? "Laptop");
  const [serial, setSerial] = useState("");
  const [location, setLocation] = useState("");
  const [warranty, setWarranty] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    onAdd({
      id: `EQ-${nextId}`,
      name: name.trim(),
      type,
      serial: serial.trim() || "—",
      status: "Available",
      assignedTo: null,
      location: location.trim() || "IT Store",
      warranty: warranty || "—",
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="card-surface w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Add Equipment</h2>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
            <X size={18} />
          </button>
        </div>
        <div className="grid gap-4">
          <label className="grid gap-1.5 text-sm font-medium">
            Equipment name *
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder='e.g. MacBook Air 13"'
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium">
              Type
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input-field"
              >
                {types.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Serial number
              <input
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                className="input-field"
                placeholder="SN-0000"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium">
              Location
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field"
                placeholder="IT Store"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              Warranty until
              <input
                type="date"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className="input-field"
              />
            </label>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!name.trim()}>
            Add Equipment
          </Button>
        </div>
      </div>
    </div>
  );
}

function AssignModal({
  equipment,
  onClose,
  onAssign,
}: {
  equipment: Equipment;
  onClose: () => void;
  onAssign: (who: string) => void;
}) {
  const [who, setWho] = useState(agents[0] ?? "");
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="card-surface w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold">Assign {equipment.name}</h2>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
            <X size={18} />
          </button>
        </div>
        <label className="grid gap-1.5 text-sm font-medium">
          Assign to
          <select value={who} onChange={(e) => setWho(e.target.value)} className="input-field">
            {agents.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onAssign(who)}>Assign</Button>
        </div>
      </div>
    </div>
  );
}
