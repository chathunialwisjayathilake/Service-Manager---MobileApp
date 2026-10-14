import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  UserCheck,
  Phone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Wrench,
  History,
  Layers,
  Navigation,
  ClipboardCheck,
  Package,
  Timer,
  Camera,
  PenTool,
  PauseCircle,
  X,
  ChevronRight,
  ShieldCheck,
  Building,
} from "lucide-react";
import {
  getMobileJobById,
  subscribeMobileJobs,
  updateMobileJobStatus,
  type MobileJob,
  type MobileJobStatus,
} from "@/lib/mobile-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/jobs/$jobId")({
  head: ({ params }) => ({
    meta: [
      { title: `Job ${params.jobId} — Mobile Job Detail (O1-SCR-MOB-03)` },
      { name: "description", content: `Work order details and technician workflow entry for job ${params.jobId}` },
      { property: "og:title", content: `Job ${params.jobId} — Mobile Job Detail (O1-SCR-MOB-03)` },
      { property: "og:description", content: `Work order details and technician workflow entry for job ${params.jobId}` },
    ],
  }),
  component: MobileJobDetailLayout,
});

function MobileJobDetailLayout() {
  const matches = useMatches();
  const subWorkflowRoutes = [
    "/travel",
    "/parts",
    "/labour",
    "/photos",
    "/inspection",
    "/hold",
    "/completion",
  ];
  const hasSubWorkflowChild = matches.some((m) =>
    subWorkflowRoutes.some((sub) => m.id.endsWith(sub))
  );

  if (hasSubWorkflowChild) {
    return <Outlet />;
  }

  return <MobileJobDetailScreen />;
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

function MobileJobDetailScreen() {
  const { jobId } = Route.useParams();
  const [job, setJob] = useState<MobileJob | undefined>(() => getMobileJobById(jobId));
  const [activeTab, setActiveTab] = useState<"overview" | "components" | "history">("overview");
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    setJob(getMobileJobById(jobId));
    return subscribeMobileJobs(() => {
      setJob(getMobileJobById(jobId));
    });
  }, [jobId]);

  const handleAccept = () => {
    if (!job) return;
    updateMobileJobStatus(job.id, "Accepted");
    setFeedbackMessage(`Job ${job.id} accepted. Status updated.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleDecline = () => {
    if (!job) return;
    updateMobileJobStatus(job.id, "Declined", declineReason || "Technician unavailable");
    setFeedbackMessage(`Job ${job.id} declined.`);
    setDeclineModalOpen(false);
    setDeclineReason("");
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  if (!job) {
    return (
      <div className="space-y-4 py-6">
        <div className="rounded-xl border border-destructive/30 bg-card p-6 text-center space-y-3 shadow-xs">
          <AlertTriangle size={32} className="mx-auto text-destructive" />
          <h2 className="text-base font-bold text-foreground">Job Not Found</h2>
          <p className="text-xs text-muted-foreground">
            Work order <span className="font-mono font-bold text-foreground">{jobId}</span> could not be found or is not assigned to your account.
          </p>
          <div className="pt-2">
            <Link
              to="/mobile/jobs"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft size={14} className="mr-1.5" />
              Return to Job List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeWorkflows = [
    {
      id: "travel",
      title: "Travel & Check-in",
      code: "O1-SCR-MOB-04",
      icon: Navigation,
      to: `/mobile/jobs/${job.id}/travel`,
      statusText:
        job.travel?.status === "Arrived"
          ? `✓ Arrived on Site (${job.travel.arrivalTime || "Logged"})`
          : job.travel?.status === "Traveling"
          ? `🚗 En Route (${job.travel.travelStartTime || "In Progress"})`
          : "Not Started",
      highlight: job.travel?.status === "Arrived",
    },
    {
      id: "diagnosis",
      title: "Diagnosis & Checklist",
      code: "O1-SCR-MOB-05 (Excluded)",
      icon: ClipboardCheck,
      disabled: true,
      excludedReason: "Excluded from current assigned scope",
      statusText: "Excluded",
    },
    {
      id: "parts",
      title: "Parts Used & Returned",
      code: "O1-SCR-MOB-06",
      icon: Package,
      to: `/mobile/jobs/${job.id}/parts`,
      statusText: `${job.parts?.length || 0} line items`,
      highlight: (job.parts?.length || 0) > 0,
    },
    {
      id: "labour",
      title: "Labour & Time",
      code: "O1-SCR-MOB-07",
      icon: Timer,
      to: `/mobile/jobs/${job.id}/labour`,
      statusText: `${job.labourLogs?.length || 0} entries`,
      highlight: (job.labourLogs?.length || 0) > 0,
    },
    {
      id: "photos",
      title: "Photos & Evidence",
      code: "O1-SCR-MOB-08",
      icon: Camera,
      to: `/mobile/jobs/${job.id}/photos`,
      statusText: `${job.photos?.length || 0} photos attached`,
      highlight: (job.photos?.length || 0) > 0,
    },
    {
      id: "inspection",
      title: "Site Inspection Capture",
      code: "O1-SCR-MOB-11",
      icon: ShieldCheck,
      to: `/mobile/jobs/${job.id}/inspection`,
      statusText: job.inspection ? `Saved (${job.inspection.overallStatus})` : "Pending",
      highlight: !!job.inspection,
    },
    {
      id: "hold",
      title: "Request Job Hold",
      code: "O1-SCR-MOB-13",
      icon: PauseCircle,
      to: `/mobile/jobs/${job.id}/hold`,
      statusText: job.status === "On Hold" ? "On Hold Active" : "Request Hold",
      highlight: job.status === "On Hold",
    },
    {
      id: "completion",
      title: "Signature & Completion",
      code: "O1-SCR-MOB-09",
      icon: PenTool,
      to: `/mobile/jobs/${job.id}/completion`,
      statusText: job.status === "Completed" ? "Work Completed" : "Sign & Finalize",
      highlight: job.status === "Completed",
    },
  ];

  return (
    <div className="space-y-3.5 max-w-full overflow-hidden pb-4">
      {/* Top Header: Back Button & Screen Code */}
      <div className="flex items-center justify-between gap-2">
        <Link
          to="/mobile/jobs"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground bg-card border px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Jobs</span>
        </Link>

        <span className="text-[10px] font-mono font-semibold text-muted-foreground bg-muted px-2 py-1 rounded border border-border/50">
          O1-SCR-MOB-03
        </span>
      </div>

      {/* Main Job Card Header */}
      <div className="card-surface p-4 space-y-3 relative">
        <div className="flex items-start justify-between gap-2 border-b pb-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-primary">{job.id}</span>
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium border ${priorityBadgeStyle[job.priority]}`}>
                {job.priority}
              </span>
            </div>
            <h1 className="text-base font-extrabold text-foreground mt-1 leading-snug">
              {job.customerName}
            </h1>
            <p className="text-xs text-muted-foreground font-medium">{job.siteName || job.town}</p>
          </div>

          <span className={`rounded-md px-2.5 py-1 text-xs font-semibold border shrink-0 ${statusBadgeStyle[job.status]}`}>
            {job.status}
          </span>
        </div>

        {/* Accept / Decline actions for Assigned status */}
        {job.status === "Assigned" && (
          <div className="flex items-center gap-2 bg-info-soft/50 p-2.5 rounded-lg border border-info/20">
            <Button
              size="sm"
              className="flex-1 text-xs bg-success text-success-foreground hover:bg-success/90 h-8 font-semibold shadow-2xs"
              onClick={handleAccept}
            >
              <CheckCircle size={14} className="mr-1.5" />
              Accept Job
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs text-destructive hover:bg-destructive-soft hover:text-destructive h-8 font-semibold bg-card"
              onClick={() => setDeclineModalOpen(true)}
            >
              <XCircle size={14} className="mr-1.5" />
              Decline Job
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border/40">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-primary shrink-0" />
            <span className="text-foreground font-medium">{job.siteAddress}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={14} className="text-primary shrink-0" />
            <span>Scheduled: <strong className="text-foreground">{job.window}</strong> ({job.scheduledDate})</span>
          </div>

          <div className="flex items-center gap-2">
            <UserCheck size={14} className="text-primary shrink-0" />
            <span>Role: <strong className="text-foreground">{job.role}</strong> ({job.technicianName})</span>
          </div>

          {job.customerContact && (
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-primary shrink-0" />
              <span>Contact: <strong className="text-foreground">{job.customerContact}</strong></span>
            </div>
          )}
        </div>

        {job.specialConditions && (
          <div className="flex items-start gap-2 text-xs text-warning bg-warning-soft/70 p-2.5 rounded-lg border border-warning/30">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[11px] uppercase tracking-wider">Special Conditions</span>
              <span>{job.specialConditions}</span>
            </div>
          </div>
        )}
      </div>

      {feedbackMessage && (
        <div className="flex items-center justify-between rounded-lg bg-primary-soft p-3 text-xs text-primary border border-primary/20 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-primary hover:text-foreground">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Tabs for Details, Equipment, Service History */}
      <div className="flex rounded-lg bg-muted p-1 text-xs font-medium border border-border/40">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors ${
            activeTab === "overview"
              ? "bg-card text-foreground font-bold shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText size={13} />
          <span>Instructions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("components")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors ${
            activeTab === "components"
              ? "bg-card text-foreground font-bold shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers size={13} />
          <span>Equipment ({job.components?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors ${
            activeTab === "history"
              ? "bg-card text-foreground font-bold shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <History size={13} />
          <span>History</span>
        </button>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-3">
          <div className="card-surface p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b pb-2">
              <Wrench size={14} className="text-primary" />
              <span>Service Category & Work Instructions</span>
            </div>
            <p className="text-xs font-bold text-primary">{job.category}</p>
            <p className="text-xs text-muted-foreground leading-relaxed bg-muted/40 p-2.5 rounded-md border border-border/30">
              {job.instructions || "No specific instructions logged for this work order."}
            </p>
          </div>
        </div>
      )}

      {activeTab === "components" && (
        <div className="card-surface p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-foreground border-b pb-2">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-primary" />
              <span>Related Equipment & Serial Units</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">Option 01 SAP Linked</span>
          </div>

          {!job.components || job.components.length === 0 ? (
            <p className="text-xs text-muted-foreground py-3 text-center">No component details listed.</p>
          ) : (
            <div className="space-y-2">
              {job.components.map((comp, i) => (
                <div key={i} className="p-2.5 bg-muted/50 rounded-lg border border-border/40 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{comp.name}</span>
                    <span className="text-[10px] bg-card px-2 py-0.5 rounded border border-border/50 font-medium">
                      {comp.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-muted-foreground">{comp.modelOrSerial}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="card-surface p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-foreground border-b pb-2">
            <div className="flex items-center gap-2">
              <History size={14} className="text-primary" />
              <span>Prior Service History Records</span>
            </div>
            {job.lastServiceDate && (
              <span className="text-[10px] text-muted-foreground">Last: {job.lastServiceDate}</span>
            )}
          </div>

          {!job.serviceHistory || job.serviceHistory.length === 0 ? (
            <p className="text-xs text-muted-foreground py-3 text-center">No prior service records on file.</p>
          ) : (
            <div className="space-y-2">
              {job.serviceHistory.map((hist, i) => (
                <div key={i} className="p-2.5 bg-muted/50 rounded-lg border border-border/40 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{hist.type}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{hist.date}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Tech: <strong className="text-foreground">{hist.technician}</strong></p>
                  <p className="text-[11px] text-foreground/90 bg-card p-1.5 rounded border border-border/30 mt-1">{hist.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Technician Workflow Section */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Technician Workflow Actions
          </h2>
          <span className="text-[10px] font-mono text-muted-foreground">Option 01 Business Flow</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {activeWorkflows.map((wf) => {
            const Icon = wf.icon;
            if (wf.disabled) {
              return (
                <div
                  key={wf.id}
                  className="card-surface p-3 flex items-center justify-between gap-3 bg-muted/40 opacity-60 border-dashed"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <Icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-muted-foreground truncate">{wf.title}</h3>
                        <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground border font-mono shrink-0">
                          Excluded
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground/80 truncate">{wf.excludedReason}</p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={wf.id}
                to={wf.to!}
                className={`card-surface p-3 flex items-center justify-between gap-3 transition-all hover:border-primary/60 group ${
                  wf.highlight ? "border-primary/40 bg-primary-soft/10" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors ${
                    wf.highlight
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                  }`}>
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {wf.title}
                      </h3>
                      <span className="text-[9px] bg-card px-1.5 py-0.5 rounded text-muted-foreground border font-mono shrink-0">
                        {wf.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{wf.statusText}</p>
                  </div>
                </div>

                <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-muted/60 border border-border/40 text-center text-[10px] text-muted-foreground space-y-0.5">
        <p className="font-semibold text-foreground">Demonstration Mock Data — Telesonic Service Manager Option 01</p>
        <p>Field technician: {job.technicianName} · All status updates persist in session memory.</p>
      </div>

      {declineModalOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setDeclineModalOpen(false)}
        >
          <div className="card-surface rise w-full max-w-xs p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold">Decline Job Assignment</h3>
              <button onClick={() => setDeclineModalOpen(false)} className="p-1 hover:bg-muted rounded-md text-muted-foreground">
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Are you sure you want to decline job <span className="font-mono font-bold text-foreground">{job.id}</span>?
            </p>

            <div>
              <label className="block text-[11px] font-semibold mb-1">Reason for declining (optional):</label>
              <input
                type="text"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Vehicle breakdown, schedule conflict..."
                className="input-field text-xs py-1.5"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <Button size="sm" variant="ghost" className="text-xs" onClick={() => setDeclineModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" variant="destructive" className="text-xs font-semibold" onClick={handleDecline}>
                Decline Job
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
