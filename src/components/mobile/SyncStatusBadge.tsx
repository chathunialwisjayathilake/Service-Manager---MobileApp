import { Wifi, RefreshCw } from "lucide-react";

export function SyncStatusBadge() {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/80 px-3 py-1.5 text-xs text-muted-foreground border border-border/50">
      <div className="flex items-center gap-1.5 font-medium text-foreground">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        <Wifi size={13} className="text-emerald-500" />
        <span>Online</span>
        <span className="text-[10px] font-normal text-muted-foreground">(Simulated)</span>
      </div>
      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
        <RefreshCw
          size={11}
          className="animate-spin text-primary"
          style={{ animationDuration: "8s" }}
        />
        <span>Mock Sync Active</span>
      </div>
    </div>
  );
}
