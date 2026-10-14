import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  PenTool,
  CheckCircle,
  AlertCircle,
  Star,
  FileCheck,
  Printer,
  ShieldCheck,
  User,
  Briefcase,
} from "lucide-react";
import {
  getMobileJobById,
  completeMobileJob,
  getLocalTodayDateString,
  type MobileJob,
} from "@/lib/mobile-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/jobs/$jobId/completion")({
  head: ({ params }) => ({
    meta: [
      { title: `Signature & Completion (O1-SCR-MOB-09) — Job ${params.jobId}` },
      { name: "description", content: "Customer digital sign-off, rating feedback, completion slip and job closure." },
    ],
  }),
  component: MobileCompletionScreen,
});

function MobileCompletionScreen() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<MobileJob | undefined>(() => getMobileJobById(jobId));

  const [signerName, setSignerName] = useState(job?.completion?.signerName || "Dharmadasa Perera");
  const [signerRole, setSignerRole] = useState(job?.completion?.signerRole || "Site Supervisor / Engineer");
  const [rating, setRating] = useState(job?.completion?.ratingStars || 5);
  const [comments, setComments] = useState(job?.completion?.feedbackComments || "Job completed satisfactorily. All test runs passed.");
  const [isSigned, setIsSigned] = useState(!!job?.completion?.completedAt);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Canvas Signature Simulation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

  // Pre-completion checklist items
  const isTravelDone = job.travel?.status === "Arrived";
  const hasPartsLogged = (job.parts?.length || 0) > 0;
  const hasLabourLogged = (job.labourLogs?.length || 0) > 0;
  const hasPhotos = (job.photos?.length || 0) > 0;

  const handleStartDraw = () => setIsDrawing(true);
  const handleStopDraw = () => setIsDrawing(false);
  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setIsSigned(false);
  };

  const handleSimulateAutoSign = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#1d4ed8";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(30, 40);
        ctx.quadraticCurveTo(80, 10, 130, 40);
        ctx.quadraticCurveTo(170, 70, 220, 30);
        ctx.stroke();
      }
    }
    setIsSigned(true);
  };

  const handleSubmitCompletion = () => {
    if (!signerName.trim()) {
      setFeedback("Please enter the name of the customer or site representative signing.");
      return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const workSlipNo = `WS-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    completeMobileJob(job.id, {
      signerName,
      signerRole,
      ratingStars: rating,
      feedbackComments: comments,
      completedAt: `${getLocalTodayDateString()} ${timeStr}`,
      workSlipNumber: workSlipNo,
    });

    setJob(getMobileJobById(job.id));
    setFeedback(`Work order ${job.id} completed! Digital slip ${workSlipNo} issued.`);
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
          <p className="text-[10px] font-mono text-muted-foreground">O1-SCR-MOB-09</p>
        </div>
      </div>

      <div className="card-surface p-4 space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
            <PenTool size={18} />
          </span>
          <div>
            <h1 className="text-sm font-bold">Signature & Job Completion</h1>
            <p className="text-[11px] text-muted-foreground">Work Slip Sign-off & Completion Audit</p>
          </div>
        </div>

        {feedback && (
          <div className="p-2.5 rounded-lg bg-primary-soft text-primary text-xs border border-primary/20 flex items-center gap-2">
            <ShieldCheck size={16} />
            <span>{feedback}</span>
          </div>
        )}

        {/* Pre-completion Checklist Audit */}
        <div className="p-3 rounded-lg bg-muted/40 border text-xs space-y-1.5">
          <span className="font-bold text-foreground block border-b pb-1">
            Pre-Completion Workflow Audit
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <CheckCircle size={13} className={isTravelDone ? "text-success" : "text-muted-foreground"} />
              <span className={isTravelDone ? "text-foreground font-semibold" : "text-muted-foreground"}>
                Site Travel Logged
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <CheckCircle size={13} className={hasPartsLogged ? "text-success" : "text-muted-foreground"} />
              <span className={hasPartsLogged ? "text-foreground font-semibold" : "text-muted-foreground"}>
                Parts Logged ({job.parts?.length || 0})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <CheckCircle size={13} className={hasLabourLogged ? "text-success" : "text-muted-foreground"} />
              <span className={hasLabourLogged ? "text-foreground font-semibold" : "text-muted-foreground"}>
                Labour Logged ({job.labourLogs?.length || 0})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <CheckCircle size={13} className={hasPhotos ? "text-success" : "text-muted-foreground"} />
              <span className={hasPhotos ? "text-foreground font-semibold" : "text-muted-foreground"}>
                Photos Attached ({job.photos?.length || 0})
              </span>
            </div>
          </div>
        </div>

        {/* If already completed display receipt */}
        {job.status === "Completed" && job.completion ? (
          <div className="p-4 rounded-xl border bg-success-soft/30 border-success/30 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-success/20 pb-2">
              <div className="flex items-center gap-2 text-success">
                <FileCheck size={18} />
                <span className="font-bold text-sm">Work Completed</span>
              </div>
              <span className="font-mono text-xs font-extrabold text-foreground bg-card px-2 py-0.5 rounded border">
                {job.completion.workSlipNumber}
              </span>
            </div>

            <div className="space-y-1 text-muted-foreground">
              <p><strong className="text-foreground">Signed by:</strong> {job.completion.signerName} ({job.completion.signerRole})</p>
              <p><strong className="text-foreground">Completed At:</strong> {job.completion.completedAt}</p>
              <p><strong className="text-foreground">Customer Rating:</strong> {"⭐".repeat(job.completion.ratingStars)}</p>
              <p><strong className="text-foreground">Feedback:</strong> "{job.completion.feedbackComments}"</p>
            </div>

            <div className="p-2 rounded bg-card border text-[10px] text-center text-muted-foreground">
              Digital work slip synced to Option 01 SAP Service Contract records.
            </div>
          </div>
        ) : (
          /* Signature Input Form */
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
                  Signer Full Name *
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="e.g. Mr. K. Perera"
                  className="input-field py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={signerRole}
                  onChange={(e) => setSignerRole(e.target.value)}
                  placeholder="e.g. Chief Engineer"
                  className="input-field py-1.5 text-xs"
                />
              </div>
            </div>

            {/* Customer Rating Stars */}
            <div className="space-y-1 text-xs">
              <label className="block text-[10px] font-semibold text-muted-foreground">
                Customer Service Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={20}
                      className={
                        star <= rating ? "fill-warning text-warning" : "text-muted-foreground/40"
                      }
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-foreground ml-2">{rating} / 5 Stars</span>
              </div>
            </div>

            {/* Customer Feedback Comments */}
            <div className="space-y-1 text-xs">
              <label className="block text-[10px] font-semibold text-muted-foreground">
                Customer Remarks & Service Feedback
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Work done satisfactorily..."
                className="input-field text-xs min-h-[50px] py-1.5"
              />
            </div>

            {/* Signature Canvas Box */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-semibold text-muted-foreground">
                  Customer On-Screen Signature
                </label>
                <div className="flex gap-2 text-[10px]">
                  <button onClick={handleSimulateAutoSign} className="text-primary hover:underline">
                    Simulate Sign
                  </button>
                  <button onClick={handleClearSignature} className="text-muted-foreground hover:text-foreground">
                    Clear
                  </button>
                </div>
              </div>

              <div className="border-2 border-dashed rounded-lg p-1 bg-card text-center relative">
                <canvas
                  ref={canvasRef}
                  width={280}
                  height={90}
                  onMouseDown={handleStartDraw}
                  onMouseUp={handleStopDraw}
                  className="w-full h-20 touch-none bg-background rounded"
                />
                {!isSigned && (
                  <p className="text-[10px] text-muted-foreground/60 absolute inset-0 grid place-items-center pointer-events-none">
                    Sign on screen or click 'Simulate Sign'
                  </p>
                )}
              </div>
            </div>

            <Button
              className="w-full text-xs font-bold h-10 bg-success text-success-foreground hover:bg-success/90"
              onClick={handleSubmitCompletion}
            >
              <CheckCircle size={15} className="mr-1.5" />
              Submit Work Completion & Issue Work Slip
            </Button>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full text-xs font-semibold h-9"
          onClick={() => navigate({ to: "/mobile/jobs/$jobId", params: { jobId: job.id } })}
        >
          Return to Job Detail
        </Button>
      </div>
    </div>
  );
}
