import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Navigation,
  MapPin,
  Clock,
  Gauge,
  CheckCircle2,
  FileText,
  AlertCircle,
  ShieldCheck,
  Phone,
  Compass,
  Bell,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
  Wifi,
  Database,
  Radio,
  Check,
  Zap,
} from "lucide-react";
import {
  getMobileJobById,
  updateMobileJobTravel,
  subscribeMobileJobs,
  type MobileJob,
  type TravelDetails,
} from "@/lib/mobile-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/jobs/$jobId/travel")({
  head: ({ params }) => ({
    meta: [
      { title: `Travel & Check-in (O1-SCR-MOB-04) — Job ${params.jobId}` },
      {
        name: "description",
        content:
          "Technician GPS check-in, odometer readings, en-route notifications, and site arrival status.",
      },
    ],
  }),
  component: MobileTravelCheckInScreen,
});

function MobileTravelCheckInScreen() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState<MobileJob | undefined>(() =>
    getMobileJobById(jobId)
  );

  // Sync state from job
  const [travelStatus, setTravelStatus] = useState<
    "Not Started" | "Traveling" | "Arrived"
  >(job?.travel?.status || "Not Started");

  const [startOdometer, setStartOdometer] = useState<number>(
    job?.travel?.startOdometer || 142580
  );
  const [endOdometer, setEndOdometer] = useState<number>(
    job?.travel?.endOdometer || (job?.travel?.startOdometer || 142580) + 18
  );
  const [travelStartTime, setTravelStartTime] = useState<string>(
    job?.travel?.travelStartTime || ""
  );
  const [arrivalTime, setArrivalTime] = useState<string>(
    job?.travel?.arrivalTime || ""
  );
  const [gpsCoordinates, setGpsCoordinates] = useState<string | undefined>(
    job?.travel?.gpsCoordinates || "6.9821° N, 79.9312° E"
  );
  const [gpsAccuracy, setGpsAccuracy] = useState<string | undefined>(
    job?.travel?.gpsAccuracy || "±4m"
  );
  const [customerNotified, setCustomerNotified] = useState<boolean>(
    job?.travel?.customerNotified || false
  );
  const [customerNotifiedAt, setCustomerNotifiedAt] = useState<string | undefined>(
    job?.travel?.customerNotifiedAt
  );
  const [trafficCondition, setTrafficCondition] = useState<string>(
    job?.travel?.trafficCondition || "Normal Traffic"
  );
  const [travelNotes, setTravelNotes] = useState<string>(
    job?.travel?.travelNotes || ""
  );

  const [feedback, setFeedback] = useState<string | null>(null);
  const [simulatedBanner, setSimulatedBanner] = useState<string | null>(null);

  const idempotencyKey =
    job?.travel?.idempotencyKey ||
    `IDEMP-TRV-${(job?.id || "001").replace(/[^A-Z0-9]/gi, "")}-987123`;

  // Subscribe to store updates
  useEffect(() => {
    const current = getMobileJobById(jobId);
    setJob(current);
    if (current?.travel) {
      setTravelStatus(current.travel.status || "Not Started");
      if (current.travel.startOdometer !== undefined)
        setStartOdometer(current.travel.startOdometer);
      if (current.travel.endOdometer !== undefined)
        setEndOdometer(current.travel.endOdometer);
      if (current.travel.travelStartTime)
        setTravelStartTime(current.travel.travelStartTime);
      if (current.travel.arrivalTime) setArrivalTime(current.travel.arrivalTime);
      if (current.travel.gpsCoordinates)
        setGpsCoordinates(current.travel.gpsCoordinates);
      if (current.travel.gpsAccuracy)
        setGpsAccuracy(current.travel.gpsAccuracy);
      if (current.travel.customerNotified)
        setCustomerNotified(current.travel.customerNotified);
      if (current.travel.customerNotifiedAt)
        setCustomerNotifiedAt(current.travel.customerNotifiedAt);
      if (current.travel.trafficCondition)
        setTrafficCondition(current.travel.trafficCondition);
      if (current.travel.travelNotes !== undefined)
        setTravelNotes(current.travel.travelNotes);
    }

    return subscribeMobileJobs(() => {
      const updated = getMobileJobById(jobId);
      setJob(updated);
      if (updated?.travel) {
        setTravelStatus(updated.travel.status || "Not Started");
      }
    });
  }, [jobId]);

  if (!job) {
    return (
      <div className="p-4 text-center space-y-3">
        <AlertCircle size={32} className="mx-auto text-destructive" />
        <p className="text-sm font-bold">Job {jobId} Not Found</p>
        <Link to="/mobile/jobs" className="text-xs text-primary underline">
          Return to Job List
        </Link>
      </div>
    );
  }

  const distanceTraveled = Math.max(0, endOdometer - startOdometer);
  const isOdometerInvalid = endOdometer < startOdometer;

  // Handler: Start Travel
  const handleStartTravel = () => {
    const nowStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setTravelStatus("Traveling");
    setTravelStartTime(nowStr);

    const update: Partial<TravelDetails> = {
      status: "Traveling",
      startOdometer,
      travelStartTime: nowStr,
      trafficCondition,
      travelNotes,
      idempotencyKey,
    };

    updateMobileJobTravel(job.id, update);
    setFeedback(`Travel started at ${nowStr}. Status set to 'En Route'.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Handler: GPS Capture
  const handleRecordGPS = () => {
    const lat = (6.9821 + (Math.random() - 0.5) * 0.01).toFixed(4);
    const lng = (79.9312 + (Math.random() - 0.5) * 0.01).toFixed(4);
    const coords = `${lat}° N, ${lng}° E`;
    const acc = `±${Math.floor(Math.random() * 3 + 3)}m`;

    setGpsCoordinates(coords);
    setGpsAccuracy(acc);

    updateMobileJobTravel(job.id, {
      gpsCoordinates: coords,
      gpsAccuracy: acc,
    });

    setFeedback(`GPS sensor locked: ${coords} (${acc}) · Geofence verified`);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Handler: Customer Notification Simulation
  const handleNotifyCustomer = () => {
    const nowStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setCustomerNotified(true);
    setCustomerNotifiedAt(nowStr);

    updateMobileJobTravel(job.id, {
      customerNotified: true,
      customerNotifiedAt: nowStr,
    });

    setSimulatedBanner(
      `⚡ Customer SMS / WhatsApp Alert sent to ${job.customerName} (${job.customerContact || "Contact Person"}). [Simulated]`
    );
    setTimeout(() => setSimulatedBanner(null), 5000);
  };

  // Handler: Site Check-in
  const handleSiteArrival = () => {
    const nowStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    let currentGps = gpsCoordinates;
    let currentAcc = gpsAccuracy;
    if (!currentGps) {
      currentGps = "6.9821° N, 79.9312° E";
      currentAcc = "±4m";
      setGpsCoordinates(currentGps);
      setGpsAccuracy(currentAcc);
    }

    setTravelStatus("Arrived");
    setArrivalTime(nowStr);

    updateMobileJobTravel(job.id, {
      status: "Arrived",
      startOdometer,
      endOdometer,
      arrivalTime: nowStr,
      gpsCoordinates: currentGps,
      gpsAccuracy: currentAcc,
      trafficCondition,
      travelNotes,
      idempotencyKey,
    });

    setFeedback(
      `Site arrival checked in at ${nowStr}. Job status updated to 'In Progress'.`
    );
  };

  // Handler: Save & Return
  const handleSaveDraft = () => {
    updateMobileJobTravel(job.id, {
      status: travelStatus,
      startOdometer,
      endOdometer,
      travelStartTime,
      arrivalTime,
      gpsCoordinates,
      gpsAccuracy,
      customerNotified,
      customerNotifiedAt,
      trafficCondition,
      travelNotes,
      idempotencyKey,
    });
    setFeedback("Draft saved locally to offline queue.");
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCompleteAndReturn = () => {
    if (travelStatus !== "Arrived") {
      handleSiteArrival();
    } else {
      updateMobileJobTravel(job.id, {
        status: "Arrived",
        startOdometer,
        endOdometer,
        arrivalTime: arrivalTime || new Date().toLocaleTimeString(),
        gpsCoordinates,
        gpsAccuracy,
        trafficCondition,
        travelNotes,
        idempotencyKey,
      });
    }
    navigate({ to: "/mobile/jobs/$jobId", params: { jobId: job.id } });
  };

  const trafficOptions = [
    "Normal Traffic",
    "Heavy Traffic",
    "Weather Delay",
    "Site Access Delay",
  ];

  return (
    <div className="space-y-3.5 max-w-full overflow-hidden pb-6">
      {/* Top Bar with Back Navigation & Job Ref */}
      <div className="flex items-center justify-between gap-2 border-b pb-2">
        <Link
          to="/mobile/jobs/$jobId"
          params={{ jobId: job.id }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground bg-card border px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Job</span>
        </Link>
        <div className="text-right">
          <span className="font-mono text-xs font-bold text-primary bg-primary-soft px-2 py-0.5 rounded border border-primary/20">
            {job.id}
          </span>
          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
            O1-SCR-MOB-04
          </p>
        </div>
      </div>

      {/* Offline Sync Banner & Idempotency Key */}
      <div className="flex items-center justify-between bg-muted/70 px-3 py-1.5 rounded-lg border text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          <Wifi size={13} className="text-emerald-500 shrink-0" />
          <span>Offline Queue Ready</span>
        </div>
        <div className="font-mono text-[10px] text-muted-foreground truncate max-w-[170px]" title={idempotencyKey}>
          Key: <span className="text-foreground font-semibold">{idempotencyKey}</span>
        </div>
      </div>

      {/* Main Job Context Header Card */}
      <div className="card-surface p-3.5 space-y-3 border shadow-xs">
        <div className="flex items-start justify-between gap-2 border-b pb-2.5">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground shrink-0 font-bold text-xs shadow-2xs">
                <Navigation size={15} />
              </span>
              <h1 className="text-sm font-bold text-foreground leading-tight truncate">
                Travel & Check-in
              </h1>
            </div>
            <p className="text-xs font-semibold text-foreground pt-1">
              {job.customerName}
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <MapPin size={12} className="text-primary shrink-0" />
              <span>{job.siteAddress || `${job.town}, Sri Lanka`}</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                travelStatus === "Arrived"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300"
                  : travelStatus === "Traveling"
                  ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {travelStatus === "Arrived"
                ? "✓ Arrived on Site"
                : travelStatus === "Traveling"
                ? "🚗 En Route"
                : "Not Started"}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground bg-muted/80 px-1.5 py-0.5 rounded border">
              Window: {job.scheduledWindow || "09:00 - 11:00"}
            </span>
          </div>
        </div>

        {/* Quick Contacts */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <div className="text-[11px] text-muted-foreground">
            Role: <strong className="text-foreground font-semibold">{job.technicianRole || "Lead Technician"}</strong>
          </div>
          {job.customerContact && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setFeedback(`Calling contact: ${job.customerContact}`);
                  setTimeout(() => setFeedback(null), 3000);
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted hover:bg-muted/80 text-foreground text-[11px] font-medium border transition-colors"
              >
                <Phone size={12} className="text-primary" />
                <span>Call</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFeedback(`Opening turn-by-turn navigation for ${job.siteAddress}`);
                  setTimeout(() => setFeedback(null), 3000);
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted hover:bg-muted/80 text-foreground text-[11px] font-medium border transition-colors"
              >
                <Compass size={12} className="text-primary" />
                <span>Nav</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback & Simulation Alerts */}
      {feedback && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200 text-xs border border-emerald-300 animate-in fade-in">
          <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
          <span className="font-medium">{feedback}</span>
        </div>
      )}

      {simulatedBanner && (
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200 text-xs border border-blue-300 animate-in fade-in">
          <Bell size={16} className="shrink-0 text-blue-600 mt-0.5" />
          <span>{simulatedBanner}</span>
        </div>
      )}

      {/* Workflow Section 1: Travel Departure & Departure Odometer */}
      <div className="card-surface p-3.5 space-y-3 border">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded bg-primary-soft text-primary font-bold text-xs">
              1
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Departure & Travel En Route
            </h2>
          </div>
          {travelStartTime && (
            <span className="text-[11px] font-mono font-bold text-primary bg-primary-soft px-2 py-0.5 rounded border border-primary/20">
              {travelStartTime}
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          {travelStatus === "Not Started" ? (
            <Button
              className="w-full text-xs font-bold h-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
              onClick={handleStartTravel}
            >
              <Navigation size={15} className="mr-2" />
              Start Travel / Departure
            </Button>
          ) : (
            <div className="flex items-center justify-between text-xs bg-muted/50 p-2.5 rounded-lg border">
              <span className="text-muted-foreground font-medium">Departure Clock:</span>
              <span className="font-mono font-bold text-foreground">
                {travelStartTime || "09:15:22 AM"}
              </span>
            </div>
          )}

          {/* Start Odometer Field */}
          <div className="space-y-1">
            <label className="block text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Gauge size={13} className="text-primary" />
                Start Odometer Reading (KM)
              </span>
              <span className="text-[10px] text-muted-foreground">Vehicle Log</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={startOdometer}
                onChange={(e) => setStartOdometer(Number(e.target.value))}
                className="input-field py-2 px-3 text-xs font-mono font-bold w-full pr-12"
              />
              <span className="absolute right-3 top-2.5 text-xs font-bold text-muted-foreground">
                KM
              </span>
            </div>
          </div>

          {/* Automated Customer En Route Alert Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={`w-full text-xs h-9 border font-semibold transition-colors ${
              customerNotified
                ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-200"
                : "bg-card text-foreground hover:bg-muted"
            }`}
            onClick={handleNotifyCustomer}
          >
            <Bell size={14} className="mr-2 text-primary" />
            {customerNotified
              ? `✓ Alert Sent at ${customerNotifiedAt || "09:15 AM"} [Simulated]`
              : "Send 'On The Way' Alert to Customer (SMS / WhatsApp)"}
          </Button>
        </div>
      </div>

      {/* Workflow Section 2: Site Arrival & GPS Sensor Check-In */}
      <div className="card-surface p-3.5 space-y-3 border">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded bg-primary-soft text-primary font-bold text-xs">
              2
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Site Arrival & GPS Check-In
            </h2>
          </div>
          {arrivalTime && (
            <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200">
              {arrivalTime}
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          {/* Arrival / End Odometer & Calculated Distance */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Arrival Odometer
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={endOdometer}
                  onChange={(e) => setEndOdometer(Number(e.target.value))}
                  className="input-field py-1.5 px-2.5 text-xs font-mono font-bold w-full pr-10"
                />
                <span className="absolute right-2.5 top-2 text-[11px] font-bold text-muted-foreground">
                  KM
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Calculated Distance
              </label>
              <div className="bg-muted/60 py-1.5 px-2.5 rounded border font-mono text-xs font-bold text-primary flex items-center justify-between h-[34px]">
                <span>{distanceTraveled} KM</span>
                <span className="text-[10px] text-muted-foreground font-normal">Trip Log</span>
              </div>
            </div>
          </div>

          {isOdometerInvalid && (
            <div className="flex items-center gap-1.5 text-[11px] text-destructive bg-destructive-soft p-2 rounded border border-destructive/30">
              <AlertTriangle size={14} className="shrink-0" />
              <span>Arrival odometer cannot be lower than start odometer.</span>
            </div>
          )}

          {/* GPS Location Capture Box */}
          <div className="bg-muted/40 p-3 rounded-lg border space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <MapPin size={14} className="text-primary" />
                Device GPS Validation
              </span>
              <span className="text-[10px] font-mono bg-card px-1.5 py-0.5 rounded border text-muted-foreground">
                Accuracy: {gpsAccuracy || "±4m"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-card p-2 rounded border font-mono text-xs font-bold text-foreground truncate">
                {gpsCoordinates || "Click Acquire GPS"}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-[11px] shrink-0 bg-card font-semibold"
                onClick={handleRecordGPS}
              >
                <RefreshCw size={12} className="mr-1 text-primary" />
                {gpsCoordinates ? "Refresh GPS" : "Acquire GPS"}
              </Button>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-1.5 rounded border border-emerald-200">
              <Check size={12} className="text-emerald-600 shrink-0" />
              <span>Geofence Verified: Within 50m of Customer Site</span>
            </div>
          </div>

          {/* Site Arrival Confirm Button */}
          {travelStatus !== "Arrived" ? (
            <Button
              className="w-full text-xs font-bold h-10 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              disabled={isOdometerInvalid}
              onClick={handleSiteArrival}
            >
              <CheckCircle2 size={16} className="mr-2" />
              Confirm Site Arrival & Check-In
            </Button>
          ) : (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-xs text-emerald-900 dark:text-emerald-100 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Site Arrival Confirmed</span>
                </div>
                <span className="text-[10px] bg-card px-2 py-0.5 rounded border text-foreground">
                  In Progress
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Arrival: <strong className="text-foreground">{arrivalTime || "09:42:10 AM"}</strong> · GPS:{" "}
                <strong className="text-foreground">{gpsCoordinates}</strong>
              </p>
              <div className="pt-0.5 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-[11px] text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setTravelStatus("Traveling");
                    setFeedback("Re-enabled check-in controls for updates.");
                  }}
                >
                  <RotateCcw size={12} className="mr-1" />
                  Edit / Re-check-in
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Workflow Section 3: Traffic Conditions & Travel Notes */}
      <div className="card-surface p-3.5 space-y-3 border">
        <div className="flex items-center gap-2 border-b pb-2">
          <span className="grid h-6 w-6 place-items-center rounded bg-primary-soft text-primary font-bold text-xs">
            3
          </span>
          <h2 className="text-xs font-bold uppercase tracking-wide text-foreground">
            Traffic Conditions & Route Notes
          </h2>
        </div>

        {/* Traffic Condition Chips */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
            <Radio size={13} className="text-primary" />
            Road / Traffic Condition
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {trafficOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setTrafficCondition(opt)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium border text-left transition-colors flex items-center justify-between ${
                  trafficCondition === opt
                    ? "bg-primary text-primary-foreground border-primary font-bold"
                    : "bg-card text-foreground hover:bg-muted border-border"
                }`}
              >
                <span>{opt}</span>
                {trafficCondition === opt && <Check size={12} />}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Notes Text Area */}
        <div className="space-y-1 pt-1">
          <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
            <FileText size={13} className="text-primary" />
            Route & Site Access Notes
          </label>
          <textarea
            value={travelNotes}
            onChange={(e) => setTravelNotes(e.target.value)}
            placeholder="e.g. Heavy traffic along Kandy Road due to road maintenance; site gate pass obtained."
            className="input-field text-xs min-h-[60px] py-2 px-3 w-full"
          />
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="space-y-2 pt-1">
        <Button
          className="w-full text-xs font-bold h-11 bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
          onClick={handleCompleteAndReturn}
        >
          <Zap size={15} className="mr-2" />
          COMPLETE CHECK-IN & START JOB
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full text-xs font-semibold h-9 bg-card text-foreground hover:bg-muted"
          onClick={handleSaveDraft}
        >
          <Database size={14} className="mr-2 text-muted-foreground" />
          Save Draft / Offline Update
        </Button>
      </div>

      <div className="p-3 rounded-lg bg-muted/60 border border-border/40 text-center text-[10px] text-muted-foreground space-y-0.5">
        <p className="font-semibold text-foreground">Option 01 — Telesonic Mobile Travel & Site Check-in</p>
        <p>Real-time synchronization with Job Detail & Technician Dispatch Board</p>
      </div>
    </div>
  );
}
