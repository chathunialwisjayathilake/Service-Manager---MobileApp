import { priorityStyle, statusStyle, type Priority, type Status } from "@/lib/itsm-data";
import { cn } from "@/lib/utils";

export function PriorityBadge({ p }: { p: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
        priorityStyle[p],
      )}
    >
      {p}
    </span>
  );
}
export function StatusBadge({ s }: { s: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        statusStyle[s],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s}
    </span>
  );
}
export function Avatar({ name, className }: { name: string; className?: string }) {
  const i = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      className={cn(
        "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-bold text-primary",
        className,
      )}
    >
      {i}
    </span>
  );
}
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
