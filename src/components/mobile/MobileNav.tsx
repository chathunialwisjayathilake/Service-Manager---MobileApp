import { Link, useRouterState } from "@tanstack/react-router";
import { ClipboardList, Home, ScanLine, Bell, ArrowLeft } from "lucide-react";

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const navItems = [
    {
      to: "/mobile/jobs",
      label: "Jobs",
      icon: ClipboardList,
      activeMatch: (p: string) => p.startsWith("/mobile/jobs"),
    },
    {
      to: "/mobile",
      label: "Overview",
      icon: Home,
      activeMatch: (p: string) => p === "/mobile" || p === "/mobile/",
    },
    {
      to: "/mobile/stock-count",
      label: "Stock Count",
      icon: ScanLine,
      activeMatch: (p: string) => p.startsWith("/mobile/stock-count"),
    },
    {
      to: "/mobile/notifications",
      label: "Alerts",
      icon: Bell,
      activeMatch: (p: string) => p.startsWith("/mobile/notifications"),
    },
  ];

  return (
    <nav
      aria-label="Mobile technician navigation"
      className="sticky bottom-0 z-30 border-t bg-card/95 backdrop-blur"
    >
      <div className="flex items-center justify-around p-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.activeMatch(pathname);
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-1 flex-col items-center justify-center py-2 px-1 text-[11px] font-medium transition-colors ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}

        <Link
          to="/"
          className="flex flex-1 flex-col items-center justify-center py-2 px-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          title="Return to Desktop Workspace"
        >
          <ArrowLeft size={18} />
          <span className="mt-1">Workspace</span>
        </Link>
      </div>
    </nav>
  );
}
