import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Smartphone,
  Download,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Info,
  Server,
  Cpu,
  HardDrive,
  ExternalLink,
  ChevronRight,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile-apk-download")({
  head: () => ({
    meta: [
      { title: "Telesonic Mobile App Download — Servio ITSM" },
      {
        name: "description",
        content:
          "Download and install Telesonic Service Manager Android Mobile Application for field service technicians.",
      },
      { property: "og:title", content: "Telesonic Mobile App Download — Servio ITSM" },
      {
        property: "og:description",
        content:
          "Download and install Telesonic Service Manager Android Mobile Application for field service technicians.",
      },
    ],
  }),
  component: MobileApkDownloadPage,
});

function MobileApkDownloadPage() {
  const navigate = useNavigate();
  const [isLaunching, setIsLaunching] = useState(false);

  const handleStartApp = () => {
    setIsLaunching(true);
    setTimeout(() => {
      navigate({ to: "/mobile/login" });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-xl space-y-6">
        {/* Top Back Action */}
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link to="/login">
              <ArrowLeft size={16} className="mr-1.5" />
              Back to Website Login
            </Link>
          </Button>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Radio size={12} className="animate-pulse" />
            Field Terminal Preview
          </span>
        </div>

        {/* Main APK Download Card */}
        <div className="rounded-2xl border bg-card p-6 shadow-xl space-y-6 relative overflow-hidden">
          {/* Subtle Top Decorative Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-info to-primary" />

          {/* App Header & Branding */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-5">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <Smartphone size={32} />
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Telesonic Mobile App
                </h1>
                <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-mono font-semibold text-muted-foreground border">
                  v2.4.0-APK
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Telesonic Service Manager Android Application for Field Service Technicians
              </p>
              <p className="text-[11px] font-mono text-primary flex items-center gap-1 pt-0.5">
                <ShieldCheck size={13} />
                com.telesonic.servicemanager.mobile
              </p>
            </div>
          </div>

          {/* SIMULATION DISCLAIMER BANNER - CLEAR REQUIREMENT */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-xs text-amber-800 dark:text-amber-300">
              <AlertCircle size={16} className="shrink-0" />
              <span>Browser Demonstration Mode</span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              This is a browser-based frontend demonstration preview. No actual Android{" "}
              <code>.apk</code> package file will be saved to your local storage or device. Clicking
              the button below will open the separate mobile app login screen.
            </p>
          </div>

          {/* Technical Specifications Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl bg-muted/40 p-3 border space-y-1">
              <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                <HardDrive size={12} /> Package Size
              </span>
              <p className="font-bold text-foreground font-mono">28.4 MB (Simulated)</p>
            </div>

            <div className="rounded-xl bg-muted/40 p-3 border space-y-1">
              <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                <Cpu size={12} /> Target OS
              </span>
              <p className="font-bold text-foreground">Android 11.0+</p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl bg-muted/40 p-3 border space-y-1">
              <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                <Server size={12} /> Integration
              </span>
              <p className="font-bold text-foreground">Option 01 / SAP B1</p>
            </div>
          </div>

          {/* Included Option 01 Mobile Modules Checklist */}
          <div className="space-y-2 border-t pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Included Mobile Modules (Option 01)
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground">
              {[
                "Mobile Job List (O1-SCR-MOB-02)",
                "Job Detail (O1-SCR-MOB-03)",
                "Travel & Site Check-in (O1-SCR-MOB-04)",
                "Parts Used / Returned (O1-SCR-MOB-06)",
                "Labour & Time Capture (O1-SCR-MOB-07)",
                "Site Photo Capture (O1-SCR-MOB-08)",
                "Digital Signature (O1-SCR-MOB-09)",
                "Site Inspection (O1-SCR-MOB-11)",
                "Van Stock Count Scan (O1-SCR-MOB-12)",
                "Hold Request (O1-SCR-MOB-13)",
                "Notifications Inbox (O1-SCR-MOB-14)",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-success shrink-0" />
                  <span className="truncate">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 border-t pt-5">
            <Button
              onClick={handleStartApp}
              disabled={isLaunching}
              size="lg"
              className="w-full h-12 text-sm font-bold shadow-md gap-2"
            >
              {isLaunching ? (
                <>
                  <Smartphone size={18} className="animate-spin" />
                  Opening Mobile Application...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Download Mobile App
                </>
              )}
            </Button>

            <div className="flex items-center justify-between gap-3 text-xs">
              <Button asChild variant="outline" size="sm" className="w-full text-muted-foreground">
                <Link to="/login">
                  <ArrowLeft size={14} className="mr-1.5" />
                  Back to Website Login
                </Link>
              </Button>

              <Button asChild variant="ghost" size="sm" className="w-full text-primary">
                <Link to="/mobile/login">
                  Direct Mobile Login
                  <ChevronRight size={14} className="ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-muted-foreground">
          © 2026 Telesonic Service Manager · Option 01 Field Engineering Frontend
        </p>
      </div>
    </div>
  );
}
