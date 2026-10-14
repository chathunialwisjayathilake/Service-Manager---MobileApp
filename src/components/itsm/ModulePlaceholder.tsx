import type { LucideIcon } from "lucide-react";
import { PageHeader } from "./Badges";

export function ModulePlaceholder({
  title,
  subtitle,
  icon: Icon,
  stats,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  stats: [string, string][];
}) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(([k, v]) => (
          <div key={k} className="card-surface p-5">
            <p className="text-sm text-muted-foreground">{k}</p>
            <p className="mt-1 text-3xl font-bold">{v}</p>
          </div>
        ))}
      </div>
      <div className="card-surface mt-6 grid place-items-center p-16 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Icon size={26} />
        </span>
        <p className="mt-4 font-semibold">{title} workspace</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          This module's detailed views are coming next.
        </p>
      </div>
    </>
  );
}
