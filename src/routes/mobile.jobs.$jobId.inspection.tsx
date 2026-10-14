import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Building,
} from "lucide-react";
import {
  getMobileJobById,
  saveJobInspection,
  MOCK_TECHNICIAN_NAME,
  type MobileJob,
  type SiteInspectionPoint,
} from "@/lib/mobile-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/jobs/$jobId/inspection")({
  head: ({ params }) => ({
    meta: [
      { title: `Site Inspection (O1-SCR-MOB-11) — Job ${params.jobId}` },
      { name: "description", content: "On-site safety, electrical voltage, ambient conditions and site inspection report." },
    ],
  }),
  component: MobileSiteInspectionScreen,
});

const DEFAULT_INSPECTION_POINTS: SiteInspectionPoint[] = [
  { id: "P-1", label: "On-Site Safety Hazards & Technician PPE", category: "Safety", status: "Pass", notes: "Safety harness & boots checked" },
  { id: "P-2", label: "Power Supply Voltage (Phase-to-Neutral)", category: "Electrical", status: "Pass", measuredValue: "230V AC", notes: "Stable supply" },
  { id: "P-3", label: "Ambient Equipment Room Temperature", category: "Environmental", status: "Attention Required", measuredValue: "29.5°C", notes: "Exceeding standard 24°C" },
  { id: "P-4", label: "Visual Casing & Piping Structural Damage", category: "Mechanical", status: "Pass", notes: "No outdoor cabinet dents" },
  { id: "P-5", label: "Electrical Earth Grounding Continuity", category: "Electrical", status: "Pass", measuredValue: "0.8 Ohms", notes: "Ground bonding healthy" },
];

function MobileSiteInspectionScreen() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<MobileJob | undefined>(() => getMobileJobById(jobId));

  const [points, setPoints] = useState<SiteInspectionPoint[]>(
    job?.inspection?.points || DEFAULT_INSPECTION_POINTS
  );
  const [overallStatus, setOverallStatus] = useState<"Pass" | "Fail" | "Conditional Pass">(
    job?.inspection?.overallStatus || "Pass"
  );
  const [generalNotes, setGeneralNotes] = useState(
    job?.inspection?.generalNotes || "Site condition inspected prior to work. All primary safety protocols verified."
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setJob(getMobileJobById(jobId));
  }, [jobId]);

  if (!job) {
    return (
      <div className="p-4 text-center space-y-3">
        <AlertCircle size={32} className="mx-auto text-destructive" />
        <p className="text-sm font-bold">Job {jobId} Not Found</p>
        <Link to="/mobile/jobs" className="text-xs text-primary underline">Return to Job List</Link>
      </div>
    );
  }

  const handlePointStatusChange = (id: string, status: SiteInspectionPoint["status"]) => {
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const handlePointValueChange = (id: string, measuredValue: string) => {
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, measuredValue } : p)));
  };

  const handleSaveInspection = () => {
    saveJobInspection(job.id, {
      id: `INS-${Date.now().toString().slice(-4)}`,
      inspectedAt: new Date().toLocaleString(),
      technicianName: MOCK_TECHNICIAN_NAME,
      overallStatus,
      points,
      generalNotes,
    });

    setJob(getMobileJobById(job.id));
    setFeedback("Site inspection report saved successfully.");
    setTimeout(() => {
      navigate({ to: "/mobile/jobs/$jobId", params: { jobId: job.id } });
    }, 800);
  };

  return (
    <div className="space-y-3.5 max-w-full overflow-hidden pb-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b pb-2">
        <Link
          to="/mobile/jobs/$jobId"
          params={{ jobId: job.id }}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground bg-card border px-2.5 py-1.5 rounded-lg shadow-2xs"
        >
          <ArrowLeft size={14} />
          <span>Back to Job</span>
        </Link>
        <div className="text-right">
          <span className="font-mono text-xs font-bold text-primary">{job.id}</span>
          <p className="text-[10px] font-mono text-muted-foreground">O1-SCR-MOB-11</p>
        </div>
      </div>

      <div className="card-surface p-4 space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
            <ShieldCheck size={18} />
          </span>
          <div>
            <h1 className="text-sm font-bold">Mobile Site Inspection Capture</h1>
            <p className="text-[11px] text-muted-foreground">{job.customerName} · {job.town}</p>
          </div>
        </div>

        {feedback && (
          <div className="p-2.5 rounded-lg bg-primary-soft text-primary text-xs border border-primary/20 flex items-center gap-2">
            <CheckCircle size={15} />
            <span>{feedback}</span>
          </div>
        )}

        {/* Overall Inspection Verdict */}
        <div className="p-3 rounded-lg border bg-muted/40 space-y-1.5 text-xs">
          <span className="font-bold text-foreground block">Overall Inspection Assessment</span>
          <div className="flex items-center gap-2">
            {(["Pass", "Conditional Pass", "Fail"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setOverallStatus(st)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                  overallStatus === st
                    ? st === "Pass"
                      ? "bg-success text-success-foreground border-success"
                      : st === "Conditional Pass"
                      ? "bg-warning text-warning-foreground border-warning"
                      : "bg-destructive text-destructive-foreground border-destructive"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Inspection Checklist Points */}
        <div className="space-y-2.5 pt-1">
          <span className="text-xs font-bold text-foreground block border-b pb-1">
            Site & Equipment Check Points
          </span>

          <div className="space-y-2">
            {points.map((pt) => (
              <div key={pt.id} className="p-3 rounded-lg border bg-card text-xs space-y-2 shadow-2xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {pt.category}
                    </span>
                    <p className="font-bold text-foreground mt-1">{pt.label}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  {(["Pass", "Attention Required", "Fail"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handlePointStatusChange(pt.id, st)}
                      className={`px-2 py-1 rounded text-[10px] font-semibold border transition-colors ${
                        pt.status === st
                          ? st === "Pass"
                            ? "bg-success-soft text-success border-success/30 font-bold"
                            : st === "Attention Required"
                            ? "bg-warning-soft text-warning border-warning/30 font-bold"
                            : "bg-destructive-soft text-destructive border-destructive/30 font-bold"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {pt.measuredValue !== undefined && (
                  <div className="flex items-center gap-2 pt-1 text-[11px]">
                    <span className="text-muted-foreground font-medium">Measured Value:</span>
                    <input
                      type="text"
                      value={pt.measuredValue}
                      onChange={(e) => handlePointValueChange(pt.id, e.target.value)}
                      placeholder="e.g. 230V"
                      className="input-field py-1 text-xs font-mono w-32"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* General Notes */}
        <div className="space-y-1 pt-1 text-xs">
          <label className="block font-bold text-foreground">General Inspection Notes & Recommendations</label>
          <textarea
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            rows={3}
            className="input-field text-xs py-2"
          />
        </div>

        <Button className="w-full text-xs font-bold h-10 bg-primary" onClick={handleSaveInspection}>
          Save Site Inspection Report
        </Button>
      </div>
    </div>
  );
}
