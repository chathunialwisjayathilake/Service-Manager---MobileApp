import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  UserCheck,
  AlertTriangle,
  Info,
  ShieldCheck,
  ChevronRight,
  X,
  LayoutGrid,
  Table2,
} from "lucide-react";
import {
  initialMobileJobs,
  MOCK_TECHNICIAN_NAME,
  type MobileJob,
  type MobileJobStatus,
} from "@/lib/mobile-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/jobs")({
  head: () => ({
    meta: [
      { title: "Mobile Job List (O1-SCR-MOB-02) — Telesonic Mobile" },
      {
        name: "description",
        content: "Assigned service jobs and work orders for field technicians.",
      },
      { property: "og:title", content: "Mobile Job List (O1-SCR-MOB-02) — Telesonic Mobile" },
      {
        property: "og:description",
        content: "Assigned service jobs and work orders for field technicians.",
      },
    ],
  }),
  component: MobileJobsLayout,
});

function MobileJobsLayout() {
  const matches = useMatches();
  const hasChildRoute = matches.some((m) => m.id.includes("$jobId"));

  if (hasChildRoute) {
    return <Outlet />;
  }

  return <MobileJobListScreen />;
}

const statusBadgeStyle: Record<MobileJobStatus, string> = {
  Assigned: "bg-info-soft text-info border-info/30",
  Accepted: "bg-primary-soft text-primary border-primary/30",
  "In Progress": "bg-primary text-primary-foreground font-bold",
  "On Hold": "bg-warning-soft text-warning border-warning/30",
  Completed: "bg-success-soft text-success border-success/30",
  Declined: "bg-destructive-soft text-destructive border-destructive/30",
};

const priorityBadgeStyle = {
  Critical: "bg-destructive text-destructive-foreground font-bold",
  High: "bg-destructive-soft text-destructive",
  Normal: "bg-warning-soft text-warning",
  Low: "bg-success-soft text-success",
};

function MobileJobListScreen() {
  const [jobs, setJobs] = useState<MobileJob[]>(initialMobileJobs);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"All" | "Today" | "Upcoming">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | MobileJobStatus>("All");
  const [declineModalJob, setDeclineModalJob] = useState<MobileJob | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [selectedJobPreview, setSelectedJobPreview] = useState<MobileJob | null>(null);

  const todayStr = "2026-10-13"; // Mock system date

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Date filter
      if (dateFilter === "Today" && job.scheduledDate !== todayStr) return false;
      if (dateFilter === "Upcoming" && job.scheduledDate <= todayStr) return false;

      // Status filter
      if (statusFilter !== "All" && job.status !== statusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          job.id.toLowerCase().includes(q) ||
          job.customerName.toLowerCase().includes(q) ||
          job.town.toLowerCase().includes(q) ||
          job.category.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [jobs, searchQuery, dateFilter, statusFilter]);

  const handleAcceptJob = (jobId: string) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: "Accepted" } : j)));
    setFeedbackMessage(`Job ${jobId} accepted. Updated in local demo state.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleDeclineJob = () => {
    if (!declineModalJob) return;
    const jobId = declineModalJob.id;
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: "Declined", declineReason: declineReason || "Technician unavailable" }
          : j,
      ),
    );
    setFeedbackMessage(`Job ${jobId} declined. Updated in local demo state.`);
    setDeclineModalJob(null);
    setDeclineReason("");
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  return (
    <div className="space-y-3.5 max-w-full overflow-hidden">
      {/* Technician Identity Header Banner & View Toggle */}
      <div className="rounded-xl border bg-card p-3.5 shadow-xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <UserCheck size={16} />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-bold leading-none truncate">Job List</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                {MOCK_TECHNICIAN_NAME}
              </p>
            </div>
          </div>

          {/* Card / Table View Toggle */}
          <div className="flex rounded-lg bg-muted p-0.5 text-xs font-medium border border-border/40 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors ${
                viewMode === "card"
                  ? "bg-card shadow-xs text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Card View"
            >
              <LayoutGrid size={13} />
              <span>Card</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors ${
                viewMode === "table"
                  ? "bg-card shadow-xs text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Table View"
            >
              <Table2 size={13} />
              <span>Table</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground bg-muted/60 p-2 rounded-md border border-border/40">
          <span className="truncate">
            <Info size={11} className="inline mr-1 text-primary shrink-0" />
            Displaying {filteredJobs.length} assigned jobs
          </span>
          <span className="font-mono text-xs font-bold text-foreground shrink-0 ml-2">
            {viewMode === "card" ? "Card View" : "Table View"}
          </span>
        </div>
      </div>

      {/* Temporary Feedback Banner */}
      {feedbackMessage && (
        <div className="flex items-center justify-between rounded-lg bg-primary-soft p-3 text-xs text-primary border border-primary/20 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />
            <span>{feedbackMessage}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-primary hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search job #, customer, town..."
            className="input-field pl-9 bg-card text-xs py-2"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-medium text-muted-foreground mr-1 shrink-0">When:</span>
          {(["All", "Today", "Upcoming"] as const).map((df) => (
            <button
              key={df}
              onClick={() => setDateFilter(df)}
              className={`rounded-full px-3 py-1 text-xs font-medium shrink-0 transition-colors ${
                dateFilter === df
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {df}
            </button>
          ))}
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-medium text-muted-foreground mr-1 shrink-0">
            Status:
          </span>
          {(["All", "Assigned", "Accepted", "On Hold", "Completed"] as const).map((sf) => (
            <button
              key={sf}
              onClick={() => setStatusFilter(sf)}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium shrink-0 transition-colors ${
                statusFilter === sf
                  ? "bg-foreground text-background font-semibold"
                  : "bg-card border text-muted-foreground hover:text-foreground"
              }`}
            >
              {sf}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Content: Card View vs Table View */}
      {filteredJobs.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-8 text-center text-xs text-muted-foreground">
          <AlertTriangle size={24} className="mx-auto mb-2 text-muted-foreground/60" />
          <p className="font-semibold text-foreground">No assigned jobs match your filters</p>
          <p className="mt-1 text-[11px]">Try clearing search or filter selections.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 text-xs"
            onClick={() => {
              setSearchQuery("");
              setDateFilter("All");
              setStatusFilter("All");
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW — Horizontally Scrollable inside mobile container */
        <div className="card-surface overflow-hidden rounded-xl border bg-card">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-xs text-left min-w-[620px]">
              <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold border-b">
                <tr>
                  <th className="px-3 py-2.5">Job No</th>
                  <th className="px-3 py-2.5">Customer</th>
                  <th className="px-3 py-2.5">Town</th>
                  <th className="px-3 py-2.5">Scheduled Window</th>
                  <th className="px-3 py-2.5">Priority</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Role</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-3 py-2.5 font-mono font-bold text-primary whitespace-nowrap">
                      <Link
                        to="/mobile/jobs/$jobId"
                        params={{ jobId: job.id }}
                        className="hover:underline text-left block"
                      >
                        {job.id}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-foreground whitespace-nowrap max-w-[130px] truncate">
                      {job.customerName}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                      {job.town}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                      {job.window}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium border ${priorityBadgeStyle[job.priority]}`}
                      >
                        {job.priority}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium border ${statusBadgeStyle[job.status]}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                      {job.role}
                    </td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap">
                      {job.status === "Assigned" ? (
                        <div className="inline-flex items-center gap-1 justify-end">
                          <Button
                            size="sm"
                            className="h-7 px-2 text-[10px] bg-success text-success-foreground hover:bg-success/90 font-semibold"
                            onClick={() => handleAcceptJob(job.id)}
                          >
                            <CheckCircle size={12} className="mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[10px] text-destructive hover:bg-destructive-soft hover:text-destructive font-semibold"
                            onClick={() => setDeclineModalJob(job)}
                          >
                            <XCircle size={12} className="mr-1" />
                            Decline
                          </Button>
                        </div>
                      ) : (
                        <Link
                          to="/mobile/jobs/$jobId"
                          params={{ jobId: job.id }}
                          className="inline-flex items-center justify-center rounded-md text-[10px] font-medium h-7 px-2 text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted"
                        >
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD VIEW — Default Mobile Stacked Cards */
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="card-surface rise p-4 space-y-3 relative hover:border-primary/50 transition-colors"
            >
              {/* Card Header: Job ID, Priority, Status */}
              <div className="flex items-start justify-between gap-2 border-b pb-2">
                <div>
                  <Link
                    to="/mobile/jobs/$jobId"
                    params={{ jobId: job.id }}
                    className="font-mono text-xs font-bold text-primary hover:underline block"
                  >
                    {job.id}
                  </Link>
                  <p className="text-[10px] text-muted-foreground">{job.role}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-medium border ${priorityBadgeStyle[job.priority]}`}
                  >
                    {job.priority}
                  </span>
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-medium border ${statusBadgeStyle[job.status]}`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>

              {/* Card Body: Customer, Category, Location, Window */}
              <Link
                to="/mobile/jobs/$jobId"
                params={{ jobId: job.id }}
                className="block cursor-pointer space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold group-hover:text-primary transition-colors">
                    {job.customerName}
                  </h3>
                  <ChevronRight
                    size={16}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                </div>

                <p className="text-xs font-medium text-foreground/90">{job.category}</p>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin size={13} className="shrink-0 text-primary/70" />
                  <span className="truncate">
                    {job.town} · {job.siteAddress}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock size={13} className="shrink-0 text-primary/70" />
                  <span>{job.window}</span>
                </div>

                {job.specialConditions && (
                  <p className="text-[11px] text-warning bg-warning-soft/60 p-1.5 rounded-md border border-warning/20 leading-tight mt-1">
                    ⚠️ {job.specialConditions}
                  </p>
                )}

                {job.declineReason && (
                  <p className="text-[11px] text-destructive bg-destructive-soft/60 p-1.5 rounded-md border border-destructive/20 leading-tight mt-1">
                    Declined: {job.declineReason}
                  </p>
                )}
              </Link>

              {/* Card Footer Actions: Accept / Decline for Assigned Status */}
              {job.status === "Assigned" && (
                <div className="pt-2 border-t flex items-center gap-2">
                  <Button
                    size="sm"
                    className="flex-1 text-xs bg-success text-success-foreground hover:bg-success/90 h-9 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcceptJob(job.id);
                    }}
                  >
                    <CheckCircle size={14} className="mr-1.5" />
                    Accept Job
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs text-destructive hover:bg-destructive-soft hover:text-destructive h-9 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeclineModalJob(job);
                    }}
                  >
                    <XCircle size={14} className="mr-1.5" />
                    Decline
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Decline Confirmation Modal */}
      {declineModalJob && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-xs"
          onClick={() => setDeclineModalJob(null)}
        >
          <div
            className="card-surface rise w-full max-w-xs p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold">Decline Job Assignment</h3>
              <button
                onClick={() => setDeclineModalJob(null)}
                className="p-1 hover:bg-muted rounded-md text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Are you sure you want to decline job{" "}
              <span className="font-mono font-bold text-foreground">{declineModalJob.id}</span>?
            </p>

            <div>
              <label className="block text-[11px] font-semibold mb-1">
                Reason for declining (optional):
              </label>
              <input
                type="text"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Vehicle breakdown, travel conflict..."
                className="input-field text-xs py-1.5"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button
                size="sm"
                variant="ghost"
                className="text-xs"
                onClick={() => setDeclineModalJob(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="text-xs font-semibold"
                onClick={handleDeclineJob}
              >
                Decline Job
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Job Preview Modal (Temporary prior to full Job Detail screen Task 5) */}
      {selectedJobPreview && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-xs"
          onClick={() => setSelectedJobPreview(null)}
        >
          <div
            className="card-surface rise w-full max-w-xs p-5 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b pb-2">
              <div>
                <span className="font-mono text-xs font-bold text-primary">
                  {selectedJobPreview.id}
                </span>
                <h3 className="text-sm font-bold mt-0.5">{selectedJobPreview.customerName}</h3>
              </div>
              <button
                onClick={() => setSelectedJobPreview(null)}
                className="p-1 hover:bg-muted rounded-md text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <div className="text-xs space-y-1.5 text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Equipment:</span>{" "}
                {selectedJobPreview.category}
              </p>
              <p>
                <span className="font-semibold text-foreground">Location:</span>{" "}
                {selectedJobPreview.siteAddress}
              </p>
              <p>
                <span className="font-semibold text-foreground">Window:</span>{" "}
                {selectedJobPreview.window}
              </p>
              <p>
                <span className="font-semibold text-foreground">Status:</span>{" "}
                {selectedJobPreview.status}
              </p>
            </div>

            <p className="text-[10px] text-muted-foreground bg-muted/60 p-2 rounded border border-border/40 text-center">
              Full Job Detail screen (O1-SCR-MOB-03) with travel check-in and checklist workflows
              will be implemented in the next step.
            </p>

            <Button
              size="sm"
              className="w-full text-xs"
              onClick={() => setSelectedJobPreview(null)}
            >
              Close Preview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
