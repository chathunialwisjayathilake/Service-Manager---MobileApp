import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { ModulePlaceholder } from "@/components/itsm/ModulePlaceholder";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge Base — Servio ITSM" },
      { name: "description", content: "Self-help articles and agent runbooks." },
      { property: "og:title", content: "Knowledge Base — Servio ITSM" },
      { property: "og:description", content: "Self-help articles and agent runbooks." },
    ],
  }),
  component: () => (
    <ModulePlaceholder
      title="Knowledge Base"
      subtitle="Self-help articles and agent runbooks."
      icon={BookOpen}
      stats={[
        ["Articles", "512"],
        ["Views this week", "8.2k"],
        ["Deflection rate", "31%"],
      ]}
    />
  ),
});
