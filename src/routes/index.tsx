import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  AlertTriangle,
  ShoppingBag,
  Bug,
  GitPullRequestArrow,
  HardDrive,
  BookOpen,
  ClipboardList,
  MonitorCog,
  Trophy,
  Smartphone,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workspace — Servio ITSM" },
      {
        name: "description",
        content:
          "Your Servio ITSM workspace: incidents, jobs, service catalog, changes, assets and knowledge.",
      },
      { property: "og:title", content: "Workspace — Servio ITSM" },
      {
        property: "og:description",
        content:
          "Your Servio ITSM workspace: incidents, jobs, service catalog, changes, assets and knowledge.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Workspace,
});

const modules = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    tone: "bg-primary-soft text-primary",
  },
  {
    to: "/incidents",
    label: "Incidents",
    icon: AlertTriangle,
    tone: "bg-destructive-soft text-destructive",
  },
  { to: "/jobs", label: "Jobs", icon: ClipboardList, tone: "bg-info-soft text-info" },
  {
    to: "/catalog",
    label: "Service Catalog",
    icon: ShoppingBag,
    tone: "bg-success-soft text-success",
  },
  { to: "/problems", label: "Problem", icon: Bug, tone: "bg-warning-soft text-warning" },
  {
    to: "/changes",
    label: "Change",
    icon: GitPullRequestArrow,
    tone: "bg-primary-soft text-primary",
  },
  { to: "/assets", label: "Assets", icon: HardDrive, tone: "bg-info-soft text-info" },
  {
    to: "/knowledge",
    label: "Knowledge Base",
    icon: BookOpen,
    tone: "bg-success-soft text-success",
  },
  {
    to: "/equipment",
    label: "Equipment Card",
    icon: MonitorCog,
    tone: "bg-warning-soft text-warning",
  },
  { to: "/incentive", label: "Incentive", icon: Trophy, tone: "bg-success-soft text-success" },
] as const;

function Workspace() {
  return (
    <div className="py-4 sm:py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">Welcome back, Nimal</p>
          <h1 className="text-3xl font-bold">Your workspace</h1>
        </div>
        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-success" />
          Service desk online
        </span>
      </div>
      <nav aria-label="Service desk modules" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {modules.map(({ to, label, icon: Icon, tone }) => (
          <Button
            key={to}
            asChild
            variant="ghost"
            className="group h-auto min-h-40 flex-col items-start justify-between gap-6 whitespace-normal rounded-lg border bg-card p-5 text-card-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-md motion-reduce:transform-none sm:min-h-48 sm:p-6"
          >
            <Link to={to}>
              <span className="flex w-full items-start justify-between gap-2">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${tone}`}>
                  <Icon className="size-6" />
                </span>
                <ArrowUpRight className="text-muted-foreground transition-colors group-hover:text-primary" />
              </span>
              <span className="text-base font-semibold sm:text-lg">{label}</span>
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  );
}
