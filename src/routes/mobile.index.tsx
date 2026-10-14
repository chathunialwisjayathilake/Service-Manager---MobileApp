import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Smartphone,
  ArrowLeft,
  ClipboardList,
  CheckCircle2,
  Bell,
  ScanLine,
  Truck,
  ShieldCheck,
  PauseCircle,
  ChevronRight,
} from "lucide-react";
import {
  getMobileJobs,
  getMobileNotifications,
  subscribeMobileJobs,
  MOCK_TECHNICIAN_NAME,
} from "@/lib/mobile-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile/")({
  head: () => ({
    meta: [
      { title: "Telesonic Mobile App — Servio ITSM" },
      {
        name: "description",
        content: "Telesonic Service Manager Mobile App for field service technicians.",
      },
      { property: "og:title", content: "Telesonic Mobile App — Servio ITSM" },
      {
        property: "og:description",
        content: "Telesonic Service Manager Mobile App for field service technicians.",
      },
    ],
  }),
  component: MobileOverviewPage,
});

function MobileOverviewPage() {
  const [jobs, setJobs] = useState(() => getMobileJobs());
  const [notifications, setNotifications] = useState(() => getMobileNotifications());

  useEffect(() => {
    const syncState = () => {
      setJobs(getMobileJobs());
      setNotifications(getMobileNotifications());
    };
    syncState();
    return subscribeMobileJobs(syncState);
  }, []);

  const assignedJobs = jobs.filter((j) => j.status === "Assigned" || j.status === "Accepted");
  const activeJobs = jobs.filter((j) => j.status === "In Progress");
  const onHoldJobs = jobs.filter((j) => j.status === "On Hold");
  const completedJobs = jobs.filter((j) => j.status === "Completed");
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-3.5 max-w-full overflow-hidden pb-4">
      {/* Mobile Welcome & Overview Card */}
      <div className="rounded-xl border bg-card p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Option 01 Field Console</p>
            <h2 className="text-lg font-bold text-foreground">Welcome, Nimal</h2>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
            <Smartphone size={20} />
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Telesonic Service Manager Option 01 mobile app for on-site field technicians. Linked with SAP Business One backend.
        </p>
        <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-muted-foreground border-t">
          <span>Tech ID: <strong className="text-foreground">TECH-0092</strong></span>
          <span>·</span>
          <span>Role: <strong className="text-foreground">Field Lead</strong></span>
        </div>
      </div>

      {/* Technician Workflow Quick Summary Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        <Link
          to="/mobile/jobs"
          className="rounded-xl border bg-card p-3.5 shadow-2xs hover:border-primary/50 transition-colors block space-y-1"
        >
          <div className="flex items-center gap-2 text-primary">
            <ClipboardList size={16} />
            <span className="text-xs font-semibold">Assigned Jobs</span>
          </div>
          <p className="text-2xl font-bold text-foreground font-mono">{assignedJobs.length}</p>
          <p className="text-[10px] text-muted-foreground">Work orders awaiting site action</p>
        </Link>

        <Link
          to="/mobile/jobs"
          className="rounded-xl border bg-card p-3.5 shadow-2xs hover:border-primary/50 transition-colors block space-y-1"
        >
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 size={16} />
            <span className="text-xs font-semibold">Completed</span>
          </div>
          <p className="text-2xl font-bold text-foreground font-mono">{completedJobs.length}</p>
          <p className="text-[10px] text-muted-foreground">Work completion slips signed</p>
        </Link>
      </div>

      {/* Additional Option 01 Workflow Hub Tiles */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
          Field Technician Modules
        </h3>

        <div className="grid grid-cols-1 gap-2">
          {/* Stock Count Scan */}
          <Link
            to="/mobile/stock-count"
            className="p-3 rounded-xl border bg-card hover:border-primary/50 transition-colors flex items-center justify-between gap-3 shadow-2xs group"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ScanLine size={18} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    Van Stock Count Scan
                  </h4>
                  <span className="text-[9px] font-mono bg-muted px-1.5 py-0.5 rounded border">O1-SCR-MOB-12</span>
                </div>
                <p className="text-[11px] text-muted-foreground">Audit mobile van inventory & barcode check</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
          </Link>

          {/* Notifications Inbox */}
          <Link
            to="/mobile/notifications"
            className="p-3 rounded-xl border bg-card hover:border-primary/50 transition-colors flex items-center justify-between gap-3 shadow-2xs group"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors relative">
                <Bell size={18} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive" />
                )}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    Notifications Inbox
                  </h4>
                  <span className="text-[9px] font-mono bg-muted px-1.5 py-0.5 rounded border">O1-SCR-MOB-14</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {unreadNotifications > 0 ? `${unreadNotifications} unread dispatch alerts` : "Dispatch notices & alerts"}
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Quick Action Return to Workspace Button */}
      <div className="rounded-xl border bg-muted/40 p-3.5 text-center space-y-2">
        <p className="text-xs text-muted-foreground">Need full ITSM administrative tools or Service Desk?</p>
        <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold">
          <Link to="/">
            <ArrowLeft size={14} className="mr-1.5" />
            Return to Desktop Workspace
          </Link>
        </Button>
      </div>
    </div>
  );
}
