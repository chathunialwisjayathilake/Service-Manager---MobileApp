import { useState, useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Headset, ArrowLeft, Bell, ScanLine } from "lucide-react";
import { SyncStatusBadge } from "./SyncStatusBadge";
import { MobileNav } from "./MobileNav";
import { getMobileNotifications, subscribeMobileJobs } from "@/lib/mobile-data";

export function MobileShell({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateUnread = () => {
      const notes = getMobileNotifications();
      setUnreadCount(notes.filter((n) => !n.read).length);
    };
    updateUnread();
    return subscribeMobileJobs(updateUnread);
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile-first centered phone frame container */}
      <div className="mx-auto flex min-h-screen max-w-md flex-col border-x bg-card shadow-2xl">
        {/* Compact Mobile Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-card/90 px-3.5 py-2.5 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Headset size={16} />
            </span>
            <div className="min-w-0">
              <h1 className="text-xs font-bold leading-tight tracking-tight truncate">
                Telesonic Service Manager
              </h1>
              <p className="text-[10px] text-muted-foreground truncate">Field Service Mobile</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* O1-SCR-MOB-12 Stock Count Scan Link */}
            <Link
              to="/mobile/stock-count"
              className="p-1.5 rounded-lg border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative"
              title="O1-SCR-MOB-12 Stock Count Scan"
            >
              <ScanLine size={15} />
            </Link>

            {/* O1-SCR-MOB-14 Notifications Inbox Link */}
            <Link
              to="/mobile/notifications"
              className="p-1.5 rounded-lg border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative"
              title="O1-SCR-MOB-14 Notifications Inbox"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4 min-w-4 px-1 place-items-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-1 rounded-md border bg-muted/60 px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Return to Workspace"
            >
              <ArrowLeft size={13} />
              <span className="hidden sm:inline">Workspace</span>
            </Link>
          </div>
        </header>

        {/* Temporary Simulated Sync & Online/Offline Status Banner */}
        <div className="border-b bg-card px-3.5 py-1.5">
          <SyncStatusBadge />
        </div>

        {/* Main Phone Viewport Area */}
        <main className="flex-1 p-3.5 overflow-y-auto">{children}</main>

        {/* Technician Workflow Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </div>
  );
}
