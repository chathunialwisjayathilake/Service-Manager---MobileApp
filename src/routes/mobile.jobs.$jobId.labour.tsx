import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Clock,
  UserCheck,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import {
  getMobileJobById,
  addJobLabourLog,
  MOCK_TECHNICIAN_NAME,
  getLocalTodayDateString,
  type MobileJob,
  type LabourLog,
} from "@/lib/mobile-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/jobs/$jobId/labour")({
  head: ({ params }) => ({
    meta: [
      { title: `Labour & Time (O1-SCR-MOB-07) — Job ${params.jobId}` },
      { name: "description", content: "Live job stopwatch timer, labor entry, overtime codes and time logs." },
    ],
  }),
  component: MobileLabourScreen,
});

function MobileLabourScreen() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<MobileJob | undefined>(() => getMobileJobById(jobId));

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const intervalRef = useRef<any>(null);

  // Manual Log Entry Form
  const [hoursInput, setHoursInput] = useState("1.5");
  const [rateType, setRateType] = useState<"Regular" | "Overtime" | "Weekend/Holiday">("Regular");
  const [activityDesc, setActivityDesc] = useState("On-site diagnostic and component servicing.");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setJob(getMobileJobById(jobId));
  }, [jobId]);

  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isTimerRunning]);

  if (!job) {
    return (
      <div className="p-4 text-center space-y-3">
        <AlertCircle size={32} className="mx-auto text-destructive" />
        <p className="text-sm font-bold">Job {jobId} Not Found</p>
        <Link to="/mobile/jobs" className="text-xs text-primary underline">Return to Job List</Link>
      </div>
    );
  }

  const formatTimerDisplay = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleTimerConvertAndLog = () => {
    const hrs = Math.max(0.1, Number((timerSeconds / 3600).toFixed(2)));
    const newLog: LabourLog = {
      id: `L-${Date.now().toString().slice(-4)}`,
      technicianName: MOCK_TECHNICIAN_NAME,
      date: getLocalTodayDateString(),
      hours: hrs,
      rateType,
      activityDescription: `Live timer session logged (${formatTimerDisplay(timerSeconds)})`,
    };
    addJobLabourLog(job.id, newLog);
    setJob(getMobileJobById(job.id));
    setFeedback(`Logged ${hrs} hours from stopwatch session.`);
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleManualAddLog = () => {
    const hrs = parseFloat(hoursInput) || 0;
    if (hrs <= 0) return;
    const newLog: LabourLog = {
      id: `L-${Date.now().toString().slice(-4)}`,
      technicianName: MOCK_TECHNICIAN_NAME,
      date: getLocalTodayDateString(),
      hours: hrs,
      rateType,
      activityDescription: activityDesc || "Labor activity",
    };
    addJobLabourLog(job.id, newLog);
    setJob(getMobileJobById(job.id));
    setFeedback(`Logged ${hrs} hours (${rateType}) for ${job.id}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const labourLogs = job.labourLogs || [];
  const totalLabourHours = labourLogs.reduce((sum, l) => sum + l.hours, 0);

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
          <p className="text-[10px] font-mono text-muted-foreground">O1-SCR-MOB-07</p>
        </div>
      </div>

      <div className="card-surface p-4 space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
            <Timer size={18} />
          </span>
          <div>
            <h1 className="text-sm font-bold">Labour & Work Time Log</h1>
            <p className="text-[11px] text-muted-foreground">Technician Time Recording</p>
          </div>
        </div>

        {feedback && (
          <div className="p-2.5 rounded-lg bg-primary-soft text-primary text-xs border border-primary/20 flex items-center gap-2">
            <CheckCircle size={15} />
            <span>{feedback}</span>
          </div>
        )}

        {/* Live Job Stopwatch Card */}
        <div className="p-3.5 rounded-xl border bg-card space-y-2.5 shadow-2xs text-center">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Live Job Stopwatch Timer
          </span>
          <div className="font-mono text-3xl font-extrabold text-foreground tracking-tight py-1">
            {formatTimerDisplay(timerSeconds)}
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            {!isTimerRunning ? (
              <Button
                size="sm"
                className="text-xs bg-success text-success-foreground hover:bg-success/90 font-semibold px-4"
                onClick={() => setIsTimerRunning(true)}
              >
                <Play size={13} className="mr-1.5" />
                Start Timer
              </Button>
            ) : (
              <Button
                size="sm"
                className="text-xs bg-warning text-warning-foreground hover:bg-warning/90 font-semibold px-4"
                onClick={() => setIsTimerRunning(false)}
              >
                <Pause size={13} className="mr-1.5" />
                Pause
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              className="text-xs px-3"
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(0);
              }}
            >
              <RotateCcw size={13} className="mr-1" />
              Reset
            </Button>

            {timerSeconds > 0 && (
              <Button
                size="sm"
                className="text-xs bg-primary font-semibold px-3"
                onClick={handleTimerConvertAndLog}
              >
                Log Session
              </Button>
            )}
          </div>
        </div>

        {/* Manual Labour Entry Form */}
        <div className="p-3 rounded-lg border bg-muted/40 space-y-2 text-xs">
          <h3 className="font-bold text-foreground flex items-center gap-1.5 border-b pb-1.5">
            <Plus size={14} className="text-primary" />
            <span>Manual Time Entry Log</span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
                Hours Worked
              </label>
              <input
                type="number"
                step="0.5"
                value={hoursInput}
                onChange={(e) => setHoursInput(e.target.value)}
                className="input-field py-1 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
                Rate / Hour Code
              </label>
              <select
                value={rateType}
                onChange={(e) => setRateType(e.target.value as any)}
                className="input-field py-1 text-xs"
              >
                <option value="Regular">Regular Hours</option>
                <option value="Overtime">Overtime (1.5x)</option>
                <option value="Weekend/Holiday">Weekend / Holiday (2.0x)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
              Work Activity Description
            </label>
            <input
              type="text"
              value={activityDesc}
              onChange={(e) => setActivityDesc(e.target.value)}
              placeholder="e.g. System diagnosis, sensor replacement..."
              className="input-field py-1.5 text-xs"
            />
          </div>

          <Button size="sm" className="w-full text-xs font-bold bg-primary mt-1" onClick={handleManualAddLog}>
            Log Labour Hours
          </Button>
        </div>

        {/* Logged Labour List */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between border-b pb-1.5 text-xs">
            <span className="font-bold text-foreground">Logged Labour Entries</span>
            <span className="font-mono font-bold text-primary">Total: {totalLabourHours} Hrs</span>
          </div>

          {labourLogs.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-lg">
              No labour time entries recorded yet.
            </p>
          ) : (
            <div className="space-y-2">
              {labourLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg border bg-card text-xs space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-foreground">{log.technicianName}</span>
                    <span className="font-mono text-primary font-bold">{log.hours} Hours ({log.rateType})</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{log.activityDescription}</p>
                  <p className="text-[10px] text-muted-foreground/70 font-mono">Logged on {log.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          className="w-full text-xs font-bold h-9 mt-2"
          onClick={() => navigate({ to: "/mobile/jobs/$jobId", params: { jobId: job.id } })}
        >
          Return to Job Detail
        </Button>
      </div>
    </div>
  );
}
