import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Camera,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";
import {
  getMobileJobById,
  addJobPhoto,
  deleteJobPhoto,
  type MobileJob,
  type JobPhoto,
} from "@/lib/mobile-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/jobs/$jobId/photos")({
  head: ({ params }) => ({
    meta: [
      { title: `Photos & Evidence (O1-SCR-MOB-08) — Job ${params.jobId}` },
      { name: "description", content: "Capture site photos, fault evidence, before/after work proof and parts photos." },
    ],
  }),
  component: MobilePhotosScreen,
});

// PRESET MOCK PHOTOS FOR EASY DEMO SELECTION
const PRESET_DEMO_PHOTOS = [
  { name: "VRF Roof Condenser Unit", category: "Before Work" as const, url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80" },
  { name: "E4 Error Code Circuit Probe", category: "Fault / Damage" as const, url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400&auto=format&fit=crop&q=80" },
  { name: "New 45uF Capacitor Replaced", category: "Parts Replaced" as const, url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&auto=format&fit=crop&q=80" },
  { name: "Final Cleaned Site Inspection", category: "After Work / Clean Site" as const, url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop&q=80" },
];

function MobilePhotosScreen() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<MobileJob | undefined>(() => getMobileJobById(jobId));

  const [category, setCategory] = useState<JobPhoto["category"]>("Before Work");
  const [caption, setCaption] = useState("");
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
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

  const handleAddPhoto = () => {
    const preset = PRESET_DEMO_PHOTOS[selectedPresetIndex];
    const newPhoto: JobPhoto = {
      id: `P-${Date.now()}`,
      category,
      dataUrl: preset.url,
      caption: caption || preset.name,
      capturedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    addJobPhoto(job.id, newPhoto);
    setJob(getMobileJobById(job.id));
    setFeedback("Site photo attached to work order.");
    setCaption("");
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleDeletePhoto = (photoId: string) => {
    deleteJobPhoto(job.id, photoId);
    setJob(getMobileJobById(job.id));
    setFeedback("Photo removed.");
    setTimeout(() => setFeedback(null), 3000);
  };

  const photos = job.photos || [];

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
          <p className="text-[10px] font-mono text-muted-foreground">O1-SCR-MOB-08</p>
        </div>
      </div>

      <div className="card-surface p-4 space-y-3">
        <div className="flex items-center gap-2 border-b pb-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
            <Camera size={18} />
          </span>
          <div>
            <h1 className="text-sm font-bold">Site Photos & Evidence</h1>
            <p className="text-[11px] text-muted-foreground">Mobile Camera & Photo Attachments</p>
          </div>
        </div>

        {feedback && (
          <div className="p-2.5 rounded-lg bg-primary-soft text-primary text-xs border border-primary/20 flex items-center gap-2">
            <CheckCircle size={15} />
            <span>{feedback}</span>
          </div>
        )}

        {/* Capture / Upload Panel */}
        <div className="p-3 rounded-lg border bg-muted/40 space-y-2.5 text-xs">
          <h3 className="font-bold text-foreground flex items-center gap-1.5 border-b pb-1.5">
            <Upload size={14} className="text-primary" />
            <span>Capture or Upload New Photo</span>
          </h3>

          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
              Photo Stage Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="input-field py-1 text-xs"
            >
              <option value="Before Work">Before Work (Initial Site Condition)</option>
              <option value="Fault / Damage">Fault / Damage Evidence</option>
              <option value="Parts Replaced">Parts Replaced / Installed</option>
              <option value="After Work / Clean Site">After Work / Site Clean</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
              Simulated Camera Asset Sample
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_DEMO_PHOTOS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPresetIndex(idx)}
                  className={`p-1.5 rounded-lg border text-[10px] font-medium text-left truncate transition-colors ${
                    selectedPresetIndex === idx
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  📸 {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-muted-foreground mb-1">
              Photo Description / Notes
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Loose wiring terminal on ODU circuit..."
              className="input-field py-1.5 text-xs"
            />
          </div>

          <Button size="sm" className="w-full text-xs font-bold bg-primary" onClick={handleAddPhoto}>
            <Camera size={14} className="mr-1.5" />
            Attach Photo to Job
          </Button>
        </div>

        {/* Gallery Display */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between border-b pb-1.5 text-xs">
            <span className="font-bold text-foreground">Attached Photos ({photos.length})</span>
            <span className="text-[11px] font-mono text-muted-foreground">Field Evidence</span>
          </div>

          {photos.length === 0 ? (
            <div className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground space-y-1">
              <ImageIcon size={24} className="mx-auto text-muted-foreground/50" />
              <p className="font-semibold text-foreground">No photos attached</p>
              <p className="text-[11px]">Attach site photos before completing work order.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {photos.map((photo) => (
                <div key={photo.id} className="p-2 rounded-lg border bg-card space-y-1.5 shadow-2xs relative group">
                  <div className="aspect-video w-full rounded overflow-hidden bg-muted">
                    <img src={photo.dataUrl} alt={photo.caption} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-start justify-between gap-1 text-[10px]">
                    <div>
                      <span className="font-bold text-primary block truncate">{photo.category}</span>
                      <p className="text-muted-foreground truncate">{photo.caption}</p>
                    </div>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-1 text-muted-foreground hover:text-destructive rounded"
                      title="Delete photo"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
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
