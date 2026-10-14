import { createFileRoute } from "@tanstack/react-router";
import { HardDrive } from "lucide-react";
import { ModulePlaceholder } from "@/components/itsm/ModulePlaceholder";

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Asset Management — Servio ITSM" },
      { name: "description", content: "Track hardware, software and configuration items." },
      { property: "og:title", content: "Asset Management — Servio ITSM" },
      { property: "og:description", content: "Track hardware, software and configuration items." },
    ],
  }),
  component: () => (
    <ModulePlaceholder
      title="Asset Management"
      subtitle="Track hardware, software and configuration items."
      icon={HardDrive}
      stats={[
        ["Total assets", "2,481"],
        ["In repair", "23"],
        ["Expiring warranties", "41"],
      ]}
    />
  ),
});
